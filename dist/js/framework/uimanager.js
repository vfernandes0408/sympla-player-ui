"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerWrapper = exports.UIInstanceManager = exports.UIManager = void 0;
var uicontainer_1 = require("./components/uicontainer");
var dom_1 = require("./dom");
var container_1 = require("./components/container");
var eventdispatcher_1 = require("./eventdispatcher");
var uiutils_1 = require("./uiutils");
var arrayutils_1 = require("./arrayutils");
var browserutils_1 = require("./browserutils");
var volumecontroller_1 = require("./volumecontroller");
var i18n_1 = require("./localization/i18n");
var focusvisibilitytracker_1 = require("./focusvisibilitytracker");
var mobilev3playerapi_1 = require("./mobilev3playerapi");
var UIManager = /** @class */ (function () {
    function UIManager(player, playerUiOrUiVariants, uiconfig) {
        var _this = this;
        if (uiconfig === void 0) { uiconfig = {}; }
        this.events = {
            onUiVariantResolve: new eventdispatcher_1.EventDispatcher(),
        };
        if (playerUiOrUiVariants instanceof uicontainer_1.UIContainer) {
            // Single-UI constructor has been called, transform arguments to UIVariant[] signature
            var playerUi = playerUiOrUiVariants;
            var uiVariants = [];
            // Add the default player UI
            uiVariants.push({ ui: playerUi });
            this.uiVariants = uiVariants;
        }
        else {
            // Default constructor (UIVariant[]) has been called
            this.uiVariants = playerUiOrUiVariants;
        }
        this.player = player;
        this.managerPlayerWrapper = new PlayerWrapper(player);
        // ensure that at least the metadata object does exist in the uiconfig
        uiconfig.metadata = uiconfig.metadata ? uiconfig.metadata : {};
        this.config = __assign(__assign({ playbackSpeedSelectionEnabled: true, autoUiVariantResolve: true, disableAutoHideWhenHovered: false, enableSeekPreview: true }, uiconfig), { events: {
                onUpdated: new eventdispatcher_1.EventDispatcher(),
            }, volumeController: new volumecontroller_1.VolumeController(this.managerPlayerWrapper.getPlayer()) });
        /**
         * Gathers configuration data from the UI config and player source config and creates a merged UI config
         * that is used throughout the UI instance.
         */
        var updateConfig = function () {
            var playerSourceConfig = player.getSource() || {};
            _this.config.metadata = JSON.parse(JSON.stringify(uiconfig.metadata || {}));
            // Extract the UI-related config properties from the source config
            var playerSourceUiConfig = {
                metadata: {
                    // TODO move metadata into source.metadata namespace in player v8
                    title: playerSourceConfig.title,
                    description: playerSourceConfig.description,
                    markers: playerSourceConfig.markers,
                },
                recommendations: playerSourceConfig.recommendations,
            };
            // Player source config takes precedence over the UI config, because the config in the source is attached
            // to a source which changes with every player.load, whereas the UI config stays the same for the whole
            // lifetime of the player instance.
            _this.config.metadata.title = playerSourceUiConfig.metadata.title || uiconfig.metadata.title;
            _this.config.metadata.description = playerSourceUiConfig.metadata.description || uiconfig.metadata.description;
            _this.config.metadata.markers = playerSourceUiConfig.metadata.markers || uiconfig.metadata.markers || [];
            _this.config.recommendations = playerSourceUiConfig.recommendations || uiconfig.recommendations || [];
        };
        updateConfig();
        // Update the source configuration when a new source is loaded and dispatch onUpdated
        var updateSource = function () {
            updateConfig();
            _this.config.events.onUpdated.dispatch(_this);
        };
        var wrappedPlayer = this.managerPlayerWrapper.getPlayer();
        wrappedPlayer.on(this.player.exports.PlayerEvent.SourceLoaded, updateSource);
        // The PlaylistTransition event is only available on Mobile v3 for now.
        // This event is fired when a new source becomes active in the player.
        if (mobilev3playerapi_1.isMobileV3PlayerAPI(wrappedPlayer)) {
            wrappedPlayer.on(mobilev3playerapi_1.MobileV3PlayerEvent.PlaylistTransition, updateSource);
        }
        if (uiconfig.container) {
            // Unfortunately "uiContainerElement = new DOM(config.container)" will not accept the container with
            // string|HTMLElement type directly, although it accepts both types, so we need to spit these two cases up here.
            // TODO check in upcoming TS versions if the container can be passed in directly, or fix the constructor
            this.uiContainerElement = uiconfig.container instanceof HTMLElement ?
                new dom_1.DOM(uiconfig.container) : new dom_1.DOM(uiconfig.container);
        }
        else {
            this.uiContainerElement = new dom_1.DOM(player.getContainer());
        }
        // Create UI instance managers for the UI variants
        // The instance managers map to the corresponding UI variants by their array index
        this.uiInstanceManagers = [];
        var uiVariantsWithoutCondition = [];
        for (var _i = 0, _a = this.uiVariants; _i < _a.length; _i++) {
            var uiVariant = _a[_i];
            if (uiVariant.condition == null) {
                // Collect variants without conditions for error checking
                uiVariantsWithoutCondition.push(uiVariant);
            }
            // Create the instance manager for a UI variant
            this.uiInstanceManagers.push(new InternalUIInstanceManager(player, uiVariant.ui, this.config));
        }
        // Make sure that there is only one UI variant without a condition
        // It does not make sense to have multiple variants without condition, because only the first one in the list
        // (the one with the lowest index) will ever be selected.
        if (uiVariantsWithoutCondition.length > 1) {
            throw Error('Too many UIs without a condition: You cannot have more than one default UI');
        }
        // Make sure that the default UI variant, if defined, is at the end of the list (last index)
        // If it comes earlier, the variants with conditions that come afterwards will never be selected because the
        // default variant without a condition always evaluates to 'true'
        if (uiVariantsWithoutCondition.length > 0
            && uiVariantsWithoutCondition[0] !== this.uiVariants[this.uiVariants.length - 1]) {
            throw Error('Invalid UI variant order: the default UI (without condition) must be at the end of the list');
        }
        var adStartedEvent = null; // keep the event stored here during ad playback
        // Dynamically select a UI variant that matches the current UI condition.
        var resolveUiVariant = function (event) {
            // Make sure that the AdStarted event data is persisted through ad playback in case other events happen
            // in the meantime, e.g. player resize. We need to store this data because there is no other way to find out
            // ad details while an ad is playing (in v8.0 at least; from v8.1 there will be ads.getActiveAd()).
            // Existing event data signals that an ad is currently active (instead of ads.isLinearAdActive()).
            if (event != null) {
                switch (event.type) {
                    // The ads UI is shown upon the first AdStarted event. Subsequent AdStarted events within an ad break
                    // will not change the condition context and thus not lead to undesired UI variant resolving.
                    // The ads UI is shown upon AdStarted instead of AdBreakStarted because there can be a loading delay
                    // between these two events in the player, and the AdBreakStarted event does not carry any metadata to
                    // initialize the ads UI, so it would be rendered in an uninitialized state for a certain amount of time.
                    // TODO show ads UI upon AdBreakStarted and display loading overlay between AdBreakStarted and first AdStarted
                    // TODO display loading overlay between AdFinished and next AdStarted
                    case player.exports.PlayerEvent.AdStarted:
                        adStartedEvent = event;
                        break;
                    // The ads UI is hidden only when the ad break is finished, i.e. not on AdFinished events. This way we keep
                    // the ads UI variant active throughout an ad break, as reacting to AdFinished would lead to undesired UI
                    // variant switching between two ads in an ad break, e.g. ads UI -> AdFinished -> content UI ->
                    // AdStarted -> ads UI.
                    case player.exports.PlayerEvent.AdBreakFinished:
                        adStartedEvent = null;
                        // When switching to a variant for the first time, a config.events.onUpdated event is fired to trigger a UI
                        // update of the new variant, because most components subscribe to this event to update themselves. When
                        // switching to the ads UI on the first AdStarted, all UI variants update themselves with the ad data, so
                        // when switching back to the "normal" UI it will carry properties of the ad instead of the main content.
                        // We thus fire this event here to force an UI update with the properties of the main content. This is
                        // basically a hack because the config.events.onUpdated event is abused in many places and not just used
                        // for config updates (e.g. adding a marker to the seekbar).
                        // TODO introduce an event that is fired when the playback content is updated, a switch to/from ads
                        _this.config.events.onUpdated.dispatch(_this);
                        break;
                    // When a new source is loaded during ad playback, there will be no Ad(Break)Finished event
                    case player.exports.PlayerEvent.SourceLoaded:
                    case player.exports.PlayerEvent.SourceUnloaded:
                        adStartedEvent = null;
                        break;
                }
            }
            // Detect if an ad has started
            var isAd = adStartedEvent != null;
            var adRequiresUi = false;
            if (isAd) {
                var ad = adStartedEvent.ad;
                // for now only linear ads can request a UI
                if (ad.isLinear) {
                    var linearAd = ad;
                    adRequiresUi = linearAd.uiConfig && linearAd.uiConfig.requestsUi || false;
                }
            }
            if (adRequiresUi) {
                // we dispatch onUpdated event because if there are multiple adBreaks for same position
                // `Play` and `Playing` events will not be dispatched which will cause `PlaybackButton` state
                // to be out of sync
                _this.config.events.onUpdated.dispatch(_this);
            }
            _this.resolveUiVariant({
                isAd: isAd,
                adRequiresUi: adRequiresUi,
            }, function (context) {
                // If this is an ad UI, we need to relay the saved ON_AD_STARTED event data so ad components can configure
                // themselves for the current ad.
                if (context.isAd) {
                    /* Relay the ON_AD_STARTED event to the ads UI
                     *
                     * Because the ads UI is initialized in the ON_AD_STARTED handler, i.e. when the ON_AD_STARTED event has
                     * already been fired, components in the ads UI that listen for the ON_AD_STARTED event never receive it.
                     * Since this can break functionality of components that rely on this event, we relay the event to the
                     * ads UI components with the following call.
                     */
                    _this.currentUi.getWrappedPlayer().fireEventInUI(_this.player.exports.PlayerEvent.AdStarted, adStartedEvent);
                }
            });
        };
        // Listen to the following events to trigger UI variant resolution
        if (this.config.autoUiVariantResolve) {
            this.managerPlayerWrapper.getPlayer().on(this.player.exports.PlayerEvent.SourceLoaded, resolveUiVariant);
            this.managerPlayerWrapper.getPlayer().on(this.player.exports.PlayerEvent.SourceUnloaded, resolveUiVariant);
            this.managerPlayerWrapper.getPlayer().on(this.player.exports.PlayerEvent.Play, resolveUiVariant);
            this.managerPlayerWrapper.getPlayer().on(this.player.exports.PlayerEvent.Paused, resolveUiVariant);
            this.managerPlayerWrapper.getPlayer().on(this.player.exports.PlayerEvent.AdStarted, resolveUiVariant);
            this.managerPlayerWrapper.getPlayer().on(this.player.exports.PlayerEvent.AdBreakFinished, resolveUiVariant);
            this.managerPlayerWrapper.getPlayer().on(this.player.exports.PlayerEvent.PlayerResized, resolveUiVariant);
            this.managerPlayerWrapper.getPlayer().on(this.player.exports.PlayerEvent.ViewModeChanged, resolveUiVariant);
        }
        this.focusVisibilityTracker = new focusvisibilitytracker_1.FocusVisibilityTracker('bmpui');
        // Initialize the UI
        resolveUiVariant(null);
    }
    /**
     * Exposes i18n.getLocalizer() function
     * @returns {I18nApi.getLocalizer()}
     */
    UIManager.localize = function (key) {
        return i18n_1.i18n.getLocalizer(key);
    };
    /**
     * Provide configuration to support Custom UI languages
     * default language: 'en'
     */
    UIManager.setLocalizationConfig = function (localizationConfig) {
        i18n_1.i18n.setConfig(localizationConfig);
    };
    UIManager.prototype.getConfig = function () {
        return this.config;
    };
    /**
     * Returns the list of UI variants as passed into the constructor of {@link UIManager}.
     * @returns {UIVariant[]} the list of available UI variants
     */
    UIManager.prototype.getUiVariants = function () {
        return this.uiVariants;
    };
    /**
     * Switches to a UI variant from the list returned by {@link getUiVariants}.
     * @param {UIVariant} uiVariant the UI variant to switch to
     * @param {() => void} onShow a callback that is executed just before the new UI variant is shown
     */
    UIManager.prototype.switchToUiVariant = function (uiVariant, onShow) {
        var uiVariantIndex = this.uiVariants.indexOf(uiVariant);
        var nextUi = this.uiInstanceManagers[uiVariantIndex];
        var uiVariantChanged = false;
        // Determine if the UI variant is changing
        if (nextUi !== this.currentUi) {
            uiVariantChanged = true;
            // console.log('switched from ', this.currentUi ? this.currentUi.getUI() : 'none',
            //   ' to ', nextUi ? nextUi.getUI() : 'none');
        }
        // Only if the UI variant is changing, we need to do some stuff. Else we just leave everything as-is.
        if (uiVariantChanged) {
            // Hide the currently active UI variant
            if (this.currentUi) {
                this.currentUi.getUI().hide();
            }
            // Assign the new UI variant as current UI
            this.currentUi = nextUi;
            // When we switch to a different UI instance, there's some additional stuff to manage. If we do not switch
            // to an instance, we're done here.
            if (this.currentUi != null) {
                // Add the UI to the DOM (and configure it) the first time it is selected
                if (!this.currentUi.isConfigured()) {
                    this.addUi(this.currentUi);
                }
                if (onShow) {
                    onShow();
                }
                this.currentUi.getUI().show();
            }
        }
    };
    /**
     * Triggers a UI variant switch as triggered by events when automatic switching is enabled. It allows to overwrite
     * properties of the {@link UIConditionContext}.
     * @param {Partial<UIConditionContext>} context an optional set of properties that overwrite properties of the
     *   automatically determined context
     * @param {(context: UIConditionContext) => void} onShow a callback that is executed just before the new UI variant
     *   is shown (if a switch is happening)
     */
    UIManager.prototype.resolveUiVariant = function (context, onShow) {
        if (context === void 0) { context = {}; }
        // Determine the current context for which the UI variant will be resolved
        var defaultContext = {
            isAd: false,
            adRequiresUi: false,
            isFullscreen: this.player.getViewMode() === this.player.exports.ViewMode.Fullscreen,
            isMobile: browserutils_1.BrowserUtils.isMobile,
            isPlaying: this.player.isPlaying(),
            width: this.uiContainerElement.width(),
            documentWidth: document.body.clientWidth,
        };
        // Overwrite properties of the default context with passed in context properties
        var switchingContext = __assign(__assign({}, defaultContext), context);
        // Fire the event and allow modification of the context before it is used to resolve the UI variant
        this.events.onUiVariantResolve.dispatch(this, switchingContext);
        var nextUiVariant = null;
        // Select new UI variant
        // If no variant condition is fulfilled, we switch to *no* UI
        for (var _i = 0, _a = this.uiVariants; _i < _a.length; _i++) {
            var uiVariant = _a[_i];
            if (uiVariant.condition == null || uiVariant.condition(switchingContext) === true) {
                nextUiVariant = uiVariant;
                break;
            }
        }
        this.switchToUiVariant(nextUiVariant, function () {
            if (onShow) {
                onShow(switchingContext);
            }
        });
    };
    UIManager.prototype.addUi = function (ui) {
        var dom = ui.getUI().getDomElement();
        var player = ui.getWrappedPlayer();
        ui.configureControls();
        /* Append the UI DOM after configuration to avoid CSS transitions at initialization
         * Example: Components are hidden during configuration and these hides may trigger CSS transitions that are
         * undesirable at this time. */
        this.uiContainerElement.append(dom);
        // When the UI is loaded after a source was loaded, we need to tell the components to initialize themselves
        if (player.getSource()) {
            this.config.events.onUpdated.dispatch(this);
        }
        // Fire onConfigured after UI DOM elements are successfully added. When fired immediately, the DOM elements
        // might not be fully configured and e.g. do not have a size.
        // https://swizec.com/blog/how-to-properly-wait-for-dom-elements-to-show-up-in-modern-browsers/swizec/6663
        if (window.requestAnimationFrame) {
            requestAnimationFrame(function () { ui.onConfigured.dispatch(ui.getUI()); });
        }
        else {
            // IE9 fallback
            setTimeout(function () { ui.onConfigured.dispatch(ui.getUI()); }, 0);
        }
    };
    UIManager.prototype.releaseUi = function (ui) {
        ui.releaseControls();
        ui.getUI().getDomElement().remove();
        ui.clearEventHandlers();
    };
    UIManager.prototype.release = function () {
        for (var _i = 0, _a = this.uiInstanceManagers; _i < _a.length; _i++) {
            var uiInstanceManager = _a[_i];
            this.releaseUi(uiInstanceManager);
        }
        this.managerPlayerWrapper.clearEventHandlers();
        this.focusVisibilityTracker.release();
    };
    Object.defineProperty(UIManager.prototype, "onUiVariantResolve", {
        /**
         * Fires just before UI variants are about to be resolved and the UI variant is possibly switched. It is fired when
         * the switch is triggered from an automatic switch and when calling {@link resolveUiVariant}.
         * Can be used to modify the {@link UIConditionContext} before resolving is done.
         * @returns {EventDispatcher<UIManager, UIConditionContext>}
         */
        get: function () {
            return this.events.onUiVariantResolve;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns the list of all added markers in undefined order.
     */
    UIManager.prototype.getTimelineMarkers = function () {
        return this.config.metadata.markers;
    };
    /**
     * Adds a marker to the timeline. Does not check for duplicates/overlaps at the `time`.
     */
    UIManager.prototype.addTimelineMarker = function (timelineMarker) {
        this.config.metadata.markers.push(timelineMarker);
        this.config.events.onUpdated.dispatch(this);
    };
    /**
     * Removes a marker from the timeline (by reference) and returns `true` if the marker has
     * been part of the timeline and successfully removed, or `false` if the marker could not
     * be found and thus not removed.
     */
    UIManager.prototype.removeTimelineMarker = function (timelineMarker) {
        if (arrayutils_1.ArrayUtils.remove(this.config.metadata.markers, timelineMarker) === timelineMarker) {
            this.config.events.onUpdated.dispatch(this);
            return true;
        }
        return false;
    };
    return UIManager;
}());
exports.UIManager = UIManager;
/**
 * Encapsulates functionality to manage a UI instance. Used by the {@link UIManager} to manage multiple UI instances.
 */
var UIInstanceManager = /** @class */ (function () {
    function UIInstanceManager(player, ui, config) {
        this.events = {
            onConfigured: new eventdispatcher_1.EventDispatcher(),
            onSeek: new eventdispatcher_1.EventDispatcher(),
            onSeekPreview: new eventdispatcher_1.EventDispatcher(),
            onSeeked: new eventdispatcher_1.EventDispatcher(),
            onComponentShow: new eventdispatcher_1.EventDispatcher(),
            onComponentHide: new eventdispatcher_1.EventDispatcher(),
            onControlsShow: new eventdispatcher_1.EventDispatcher(),
            onPreviewControlsHide: new eventdispatcher_1.EventDispatcher(),
            onControlsHide: new eventdispatcher_1.EventDispatcher(),
            onRelease: new eventdispatcher_1.EventDispatcher(),
        };
        this.playerWrapper = new PlayerWrapper(player);
        this.ui = ui;
        this.config = config;
    }
    UIInstanceManager.prototype.getConfig = function () {
        return this.config;
    };
    UIInstanceManager.prototype.getUI = function () {
        return this.ui;
    };
    UIInstanceManager.prototype.getPlayer = function () {
        return this.playerWrapper.getPlayer();
    };
    Object.defineProperty(UIInstanceManager.prototype, "onConfigured", {
        /**
         * Fires when the UI is fully configured and added to the DOM.
         * @returns {EventDispatcher}
         */
        get: function () {
            return this.events.onConfigured;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UIInstanceManager.prototype, "onSeek", {
        /**
         * Fires when a seek starts.
         * @returns {EventDispatcher}
         */
        get: function () {
            return this.events.onSeek;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UIInstanceManager.prototype, "onSeekPreview", {
        /**
         * Fires when the seek timeline is scrubbed.
         * @returns {EventDispatcher}
         */
        get: function () {
            return this.events.onSeekPreview;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UIInstanceManager.prototype, "onSeeked", {
        /**
         * Fires when a seek is finished.
         * @returns {EventDispatcher}
         */
        get: function () {
            return this.events.onSeeked;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UIInstanceManager.prototype, "onComponentShow", {
        /**
         * Fires when a component is showing.
         * @returns {EventDispatcher}
         */
        get: function () {
            return this.events.onComponentShow;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UIInstanceManager.prototype, "onComponentHide", {
        /**
         * Fires when a component is hiding.
         * @returns {EventDispatcher}
         */
        get: function () {
            return this.events.onComponentHide;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UIInstanceManager.prototype, "onControlsShow", {
        /**
         * Fires when the UI controls are showing.
         * @returns {EventDispatcher}
         */
        get: function () {
            return this.events.onControlsShow;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UIInstanceManager.prototype, "onPreviewControlsHide", {
        /**
         * Fires before the UI controls are hiding to check if they are allowed to hide.
         * @returns {EventDispatcher}
         */
        get: function () {
            return this.events.onPreviewControlsHide;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UIInstanceManager.prototype, "onControlsHide", {
        /**
         * Fires when the UI controls are hiding.
         * @returns {EventDispatcher}
         */
        get: function () {
            return this.events.onControlsHide;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UIInstanceManager.prototype, "onRelease", {
        /**
         * Fires when the UI controls are released.
         * @returns {EventDispatcher}
         */
        get: function () {
            return this.events.onRelease;
        },
        enumerable: false,
        configurable: true
    });
    UIInstanceManager.prototype.clearEventHandlers = function () {
        this.playerWrapper.clearEventHandlers();
        var events = this.events; // avoid TS7017
        for (var event_1 in events) {
            var dispatcher = events[event_1];
            dispatcher.unsubscribeAll();
        }
    };
    return UIInstanceManager;
}());
exports.UIInstanceManager = UIInstanceManager;
/**
 * Extends the {@link UIInstanceManager} for internal use in the {@link UIManager} and provides access to functionality
 * that components receiving a reference to the {@link UIInstanceManager} should not have access to.
 */
var InternalUIInstanceManager = /** @class */ (function (_super) {
    __extends(InternalUIInstanceManager, _super);
    function InternalUIInstanceManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InternalUIInstanceManager.prototype.getWrappedPlayer = function () {
        // TODO find a non-hacky way to provide the WrappedPlayer to the UIManager without exporting it
        // getPlayer() actually returns the WrappedPlayer but its return type is set to Player so the WrappedPlayer does
        // not need to be exported
        return this.getPlayer();
    };
    InternalUIInstanceManager.prototype.configureControls = function () {
        this.configureControlsTree(this.getUI());
        this.configured = true;
    };
    InternalUIInstanceManager.prototype.isConfigured = function () {
        return this.configured;
    };
    InternalUIInstanceManager.prototype.configureControlsTree = function (component) {
        var _this = this;
        var configuredComponents = [];
        uiutils_1.UIUtils.traverseTree(component, function (component) {
            // First, check if we have already configured a component, and throw an error if we did. Multiple configuration
            // of the same component leads to unexpected UI behavior. Also, a component that is in the UI tree multiple
            // times hints at a wrong UI structure.
            // We could just skip configuration in such a case and not throw an exception, but enforcing a clean UI tree
            // seems like the better choice.
            for (var _i = 0, configuredComponents_1 = configuredComponents; _i < configuredComponents_1.length; _i++) {
                var configuredComponent = configuredComponents_1[_i];
                if (configuredComponent === component) {
                    // Write the component to the console to simplify identification of the culprit
                    // (e.g. by inspecting the config)
                    if (console) {
                        console.error('Circular reference in UI tree', component);
                    }
                    // Additionally throw an error, because this case must not happen and leads to unexpected UI behavior.
                    throw Error('Circular reference in UI tree: ' + component.constructor.name);
                }
            }
            component.initialize();
            component.configure(_this.getPlayer(), _this);
            configuredComponents.push(component);
        });
    };
    InternalUIInstanceManager.prototype.releaseControls = function () {
        // Do not call release methods if the components have never been configured; this can result in exceptions
        if (this.configured) {
            this.onRelease.dispatch(this.getUI());
            this.releaseControlsTree(this.getUI());
            this.configured = false;
        }
        this.released = true;
    };
    InternalUIInstanceManager.prototype.isReleased = function () {
        return this.released;
    };
    InternalUIInstanceManager.prototype.releaseControlsTree = function (component) {
        component.release();
        if (component instanceof container_1.Container) {
            for (var _i = 0, _a = component.getComponents(); _i < _a.length; _i++) {
                var childComponent = _a[_i];
                this.releaseControlsTree(childComponent);
            }
        }
    };
    InternalUIInstanceManager.prototype.clearEventHandlers = function () {
        _super.prototype.clearEventHandlers.call(this);
    };
    return InternalUIInstanceManager;
}(UIInstanceManager));
/**
 * Wraps the player to track event handlers and provide a simple method to remove all registered event
 * handlers from the player.
 */
var PlayerWrapper = /** @class */ (function () {
    function PlayerWrapper(player) {
        var _this = this;
        this.eventHandlers = {};
        this.player = player;
        // Collect all members of the player (public API methods and properties of the player)
        var objectProtoPropertyNames = Object.getOwnPropertyNames(Object.getPrototypeOf({}));
        var namesToIgnore = __spreadArrays(['constructor'], objectProtoPropertyNames);
        var members = getAllPropertyNames(player).filter(function (name) { return namesToIgnore.indexOf(name) === -1; });
        // Split the members into methods and properties
        var methods = [];
        var properties = [];
        for (var _i = 0, members_1 = members; _i < members_1.length; _i++) {
            var member = members_1[_i];
            if (typeof player[member] === 'function') {
                methods.push(member);
            }
            else {
                properties.push(member);
            }
        }
        // Create wrapper object
        var wrapper = {};
        var _loop_1 = function (method) {
            wrapper[method] = function () {
                // console.log('called ' + member); // track method calls on the player
                return player[method].apply(player, arguments);
            };
        };
        // Add function wrappers for all API methods that do nothing but calling the base method on the player
        for (var _a = 0, methods_1 = methods; _a < methods_1.length; _a++) {
            var method = methods_1[_a];
            _loop_1(method);
        }
        var _loop_2 = function (property) {
            // Get an eventually existing property descriptor to differentiate between plain properties and properties with
            // getters/setters.
            var propertyDescriptor = (function (target) {
                while (target) {
                    var propertyDescriptor_1 = Object.getOwnPropertyDescriptor(target, property);
                    if (propertyDescriptor_1) {
                        return propertyDescriptor_1;
                    }
                    // Check if the PropertyDescriptor exists on a child prototype in case we have an inheritance of the player
                    target = Object.getPrototypeOf(target);
                }
            })(player);
            // If the property has getters/setters, wrap them accordingly...
            if (propertyDescriptor && (propertyDescriptor.get || propertyDescriptor.set)) {
                Object.defineProperty(wrapper, property, {
                    get: function () { return propertyDescriptor.get.call(player); },
                    set: function (value) { return propertyDescriptor.set.call(player, value); },
                });
            }
            // ... else just transfer the property to the wrapper
            else {
                wrapper[property] = player[property];
            }
        };
        // Add all public properties of the player to the wrapper
        for (var _b = 0, properties_1 = properties; _b < properties_1.length; _b++) {
            var property = properties_1[_b];
            _loop_2(property);
        }
        // Explicitly add a wrapper method for 'on' that adds added event handlers to the event list
        wrapper.on = function (eventType, callback) {
            player.on(eventType, callback);
            if (!_this.eventHandlers[eventType]) {
                _this.eventHandlers[eventType] = [];
            }
            _this.eventHandlers[eventType].push(callback);
            return wrapper;
        };
        // Explicitly add a wrapper method for 'off' that removes removed event handlers from the event list
        wrapper.off = function (eventType, callback) {
            player.off(eventType, callback);
            if (_this.eventHandlers[eventType]) {
                arrayutils_1.ArrayUtils.remove(_this.eventHandlers[eventType], callback);
            }
            return wrapper;
        };
        wrapper.fireEventInUI = function (event, data) {
            if (_this.eventHandlers[event]) { // check if there are handlers for this event registered
                // Extend the data object with default values to convert it to a {@link PlayerEventBase} object.
                var playerEventData = Object.assign({}, {
                    timestamp: Date.now(),
                    type: event,
                    // Add a marker property so the UI can detect UI-internal player events
                    uiSourced: true,
                }, data);
                // Execute the registered callbacks
                for (var _i = 0, _a = _this.eventHandlers[event]; _i < _a.length; _i++) {
                    var callback = _a[_i];
                    callback(playerEventData);
                }
            }
        };
        this.wrapper = wrapper;
    }
    /**
     * Returns a wrapped player object that can be used on place of the normal player object.
     * @returns {WrappedPlayer} a wrapped player
     */
    PlayerWrapper.prototype.getPlayer = function () {
        return this.wrapper;
    };
    /**
     * Clears all registered event handlers from the player that were added through the wrapped player.
     */
    PlayerWrapper.prototype.clearEventHandlers = function () {
        try {
            // Call the player API to check if the instance is still valid or already destroyed.
            // This can be any call throwing the PlayerAPINotAvailableError when the player instance is destroyed.
            this.player.getSource();
        }
        catch (error) {
            if (error instanceof this.player.exports.PlayerAPINotAvailableError) {
                // We have detected that the player instance is already destroyed, so we clear the event handlers to avoid
                // event handler unsubscription attempts (which would result in PlayerAPINotAvailableError errors).
                this.eventHandlers = {};
            }
        }
        for (var eventType in this.eventHandlers) {
            for (var _i = 0, _a = this.eventHandlers[eventType]; _i < _a.length; _i++) {
                var callback = _a[_i];
                this.player.off(eventType, callback);
            }
        }
    };
    return PlayerWrapper;
}());
exports.PlayerWrapper = PlayerWrapper;
function getAllPropertyNames(target) {
    var names = [];
    while (target) {
        var newNames = Object.getOwnPropertyNames(target).filter(function (name) { return names.indexOf(name) === -1; });
        names = names.concat(newNames);
        // go up prototype chain
        target = Object.getPrototypeOf(target);
    }
    return names;
}
