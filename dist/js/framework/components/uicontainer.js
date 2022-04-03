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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIContainer = void 0;
var container_1 = require("./container");
var dom_1 = require("../dom");
var timeout_1 = require("../timeout");
var playerutils_1 = require("../playerutils");
var eventdispatcher_1 = require("../eventdispatcher");
var i18n_1 = require("../localization/i18n");
/**
 * The base container that contains all of the UI. The UIContainer is passed to the {@link UIManager} to build and
 * setup the UI.
 */
var UIContainer = /** @class */ (function (_super) {
    __extends(UIContainer, _super);
    function UIContainer(config) {
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-uicontainer',
            role: 'region',
            ariaLabel: i18n_1.i18n.getLocalizer('player'),
            hideDelay: 5000,
        }, _this.config);
        _this.playerStateChange = new eventdispatcher_1.EventDispatcher();
        return _this;
    }
    UIContainer.prototype.configure = function (player, uimanager) {
        var config = this.getConfig();
        if (config.userInteractionEventSource) {
            this.userInteractionEventSource = new dom_1.DOM(config.userInteractionEventSource);
        }
        else {
            this.userInteractionEventSource = this.getDomElement();
        }
        _super.prototype.configure.call(this, player, uimanager);
        this.configureUIShowHide(player, uimanager);
        this.configurePlayerStates(player, uimanager);
    };
    UIContainer.prototype.configureUIShowHide = function (player, uimanager) {
        var _this = this;
        var config = this.getConfig();
        if (config.hideDelay === -1) {
            uimanager.onConfigured.subscribe(function () { return uimanager.onControlsShow.dispatch(_this); });
            return;
        }
        var isUiShown = false;
        var isSeeking = false;
        var isFirstTouch = true;
        var playerState;
        var hidingPrevented = function () {
            return config.hidePlayerStateExceptions && config.hidePlayerStateExceptions.indexOf(playerState) > -1;
        };
        var showUi = function () {
            if (!isUiShown) {
                // Let subscribers know that they should reveal themselves
                uimanager.onControlsShow.dispatch(_this);
                isUiShown = true;
            }
            // Don't trigger timeout while seeking (it will be triggered once the seek is finished) or casting
            if (!isSeeking && !player.isCasting() && !hidingPrevented()) {
                _this.uiHideTimeout.start();
            }
        };
        var hideUi = function () {
            // Hide the UI only if it is shown, and if not casting
            if (isUiShown && !player.isCasting()) {
                // Issue a preview event to check if we are good to hide the controls
                var previewHideEventArgs = {};
                uimanager.onPreviewControlsHide.dispatch(_this, previewHideEventArgs);
                if (!previewHideEventArgs.cancel) {
                    // If the preview wasn't canceled, let subscribers know that they should now hide themselves
                    uimanager.onControlsHide.dispatch(_this);
                    isUiShown = false;
                }
                else {
                    // If the hide preview was canceled, continue to show UI
                    showUi();
                }
            }
        };
        // Timeout to defer UI hiding by the configured delay time
        this.uiHideTimeout = new timeout_1.Timeout(config.hideDelay, hideUi);
        this.userInteractionEvents = [{
                // On touch displays, the first touch reveals the UI
                name: 'touchend',
                handler: function (e) {
                    if (!isUiShown) {
                        // Only if the UI is hidden, we prevent other actions (except for the first touch) and reveal the UI
                        // instead. The first touch is not prevented to let other listeners receive the event and trigger an
                        // initial action, e.g. the huge playback button can directly start playback instead of requiring a double
                        // tap which 1. reveals the UI and 2. starts playback.
                        if (isFirstTouch && !player.isPlaying()) {
                            isFirstTouch = false;
                        }
                        else {
                            e.preventDefault();
                        }
                        showUi();
                    }
                },
            }, {
                // When the mouse enters, we show the UI
                name: 'mouseenter',
                handler: function () {
                    showUi();
                },
            }, {
                // When the mouse moves within, we show the UI
                name: 'mousemove',
                handler: function () {
                    showUi();
                },
            }, {
                name: 'focusin',
                handler: function () {
                    showUi();
                },
            }, {
                name: 'keydown',
                handler: function () {
                    showUi();
                },
            }, {
                // When the mouse leaves, we can prepare to hide the UI, except a seek is going on
                name: 'mouseleave',
                handler: function () {
                    // When a seek is going on, the seek scrub pointer may exit the UI area while still seeking, and we do not
                    // hide the UI in such cases
                    if (!isSeeking && !hidingPrevented()) {
                        _this.uiHideTimeout.start();
                    }
                },
            }];
        this.userInteractionEvents.forEach(function (event) { return _this.userInteractionEventSource.on(event.name, event.handler); });
        uimanager.onSeek.subscribe(function () {
            _this.uiHideTimeout.clear(); // Don't hide UI while a seek is in progress
            isSeeking = true;
        });
        uimanager.onSeeked.subscribe(function () {
            isSeeking = false;
            if (!hidingPrevented()) {
                _this.uiHideTimeout.start(); // Re-enable UI hide timeout after a seek
            }
        });
        player.on(player.exports.PlayerEvent.CastStarted, function () {
            showUi(); // Show UI when a Cast session has started (UI will then stay permanently on during the session)
        });
        this.playerStateChange.subscribe(function (_, state) {
            playerState = state;
            if (hidingPrevented()) {
                // Entering a player state that prevents hiding and forces the controls to be shown
                _this.uiHideTimeout.clear();
                showUi();
            }
            else {
                // Entering a player state that allows hiding
                _this.uiHideTimeout.start();
            }
        });
    };
    UIContainer.prototype.configurePlayerStates = function (player, uimanager) {
        var _this = this;
        var container = this.getDomElement();
        // Convert player states into CSS class names
        var stateClassNames = [];
        for (var state in playerutils_1.PlayerUtils.PlayerState) {
            if (isNaN(Number(state))) {
                var enumName = playerutils_1.PlayerUtils.PlayerState[playerutils_1.PlayerUtils.PlayerState[state]];
                stateClassNames[playerutils_1.PlayerUtils.PlayerState[state]] =
                    this.prefixCss(UIContainer.STATE_PREFIX + enumName.toLowerCase());
            }
        }
        var removeStates = function () {
            container.removeClass(stateClassNames[playerutils_1.PlayerUtils.PlayerState.Idle]);
            container.removeClass(stateClassNames[playerutils_1.PlayerUtils.PlayerState.Prepared]);
            container.removeClass(stateClassNames[playerutils_1.PlayerUtils.PlayerState.Playing]);
            container.removeClass(stateClassNames[playerutils_1.PlayerUtils.PlayerState.Paused]);
            container.removeClass(stateClassNames[playerutils_1.PlayerUtils.PlayerState.Finished]);
        };
        var updateState = function (state) {
            removeStates();
            container.addClass(stateClassNames[state]);
            _this.playerStateChange.dispatch(_this, state);
        };
        player.on(player.exports.PlayerEvent.SourceLoaded, function () {
            updateState(playerutils_1.PlayerUtils.PlayerState.Prepared);
        });
        player.on(player.exports.PlayerEvent.Play, function () {
            updateState(playerutils_1.PlayerUtils.PlayerState.Playing);
        });
        player.on(player.exports.PlayerEvent.Playing, function () {
            updateState(playerutils_1.PlayerUtils.PlayerState.Playing);
        });
        player.on(player.exports.PlayerEvent.Paused, function () {
            updateState(playerutils_1.PlayerUtils.PlayerState.Paused);
        });
        player.on(player.exports.PlayerEvent.PlaybackFinished, function () {
            updateState(playerutils_1.PlayerUtils.PlayerState.Finished);
        });
        player.on(player.exports.PlayerEvent.SourceUnloaded, function () {
            updateState(playerutils_1.PlayerUtils.PlayerState.Idle);
        });
        uimanager.getConfig().events.onUpdated.subscribe(function () {
            updateState(playerutils_1.PlayerUtils.getState(player));
        });
        // Fullscreen marker class
        player.on(player.exports.PlayerEvent.ViewModeChanged, function () {
            if (player.getViewMode() === player.exports.ViewMode.Fullscreen) {
                container.addClass(_this.prefixCss(UIContainer.FULLSCREEN));
            }
            else {
                container.removeClass(_this.prefixCss(UIContainer.FULLSCREEN));
            }
        });
        // Init fullscreen state
        if (player.getViewMode() === player.exports.ViewMode.Fullscreen) {
            container.addClass(this.prefixCss(UIContainer.FULLSCREEN));
        }
        // Buffering marker class
        player.on(player.exports.PlayerEvent.StallStarted, function () {
            container.addClass(_this.prefixCss(UIContainer.BUFFERING));
        });
        player.on(player.exports.PlayerEvent.StallEnded, function () {
            container.removeClass(_this.prefixCss(UIContainer.BUFFERING));
        });
        // Init buffering state
        if (player.isStalled()) {
            container.addClass(this.prefixCss(UIContainer.BUFFERING));
        }
        // RemoteControl marker class
        player.on(player.exports.PlayerEvent.CastStarted, function () {
            container.addClass(_this.prefixCss(UIContainer.REMOTE_CONTROL));
        });
        player.on(player.exports.PlayerEvent.CastStopped, function () {
            container.removeClass(_this.prefixCss(UIContainer.REMOTE_CONTROL));
        });
        // Init RemoteControl state
        if (player.isCasting()) {
            container.addClass(this.prefixCss(UIContainer.REMOTE_CONTROL));
        }
        // Controls visibility marker class
        uimanager.onControlsShow.subscribe(function () {
            container.removeClass(_this.prefixCss(UIContainer.CONTROLS_HIDDEN));
            container.addClass(_this.prefixCss(UIContainer.CONTROLS_SHOWN));
        });
        uimanager.onControlsHide.subscribe(function () {
            container.removeClass(_this.prefixCss(UIContainer.CONTROLS_SHOWN));
            container.addClass(_this.prefixCss(UIContainer.CONTROLS_HIDDEN));
        });
        // Layout size classes
        var updateLayoutSizeClasses = function (width, height) {
            container.removeClass(_this.prefixCss('layout-max-width-400'));
            container.removeClass(_this.prefixCss('layout-max-width-600'));
            container.removeClass(_this.prefixCss('layout-max-width-800'));
            container.removeClass(_this.prefixCss('layout-max-width-1200'));
            if (width <= 400) {
                container.addClass(_this.prefixCss('layout-max-width-400'));
            }
            else if (width <= 600) {
                container.addClass(_this.prefixCss('layout-max-width-600'));
            }
            else if (width <= 800) {
                container.addClass(_this.prefixCss('layout-max-width-800'));
            }
            else if (width <= 1200) {
                container.addClass(_this.prefixCss('layout-max-width-1200'));
            }
        };
        player.on(player.exports.PlayerEvent.PlayerResized, function (e) {
            // Convert strings (with "px" suffix) to ints
            var width = Math.round(Number(e.width.substring(0, e.width.length - 2)));
            var height = Math.round(Number(e.height.substring(0, e.height.length - 2)));
            updateLayoutSizeClasses(width, height);
        });
        // Init layout state
        updateLayoutSizeClasses(new dom_1.DOM(player.getContainer()).width(), new dom_1.DOM(player.getContainer()).height());
    };
    UIContainer.prototype.release = function () {
        var _this = this;
        // Explicitly unsubscribe user interaction event handlers because they could be attached to an external element
        // that isn't owned by the UI and therefore not removed on release.
        if (this.userInteractionEvents) {
            this.userInteractionEvents.forEach(function (event) { return _this.userInteractionEventSource.off(event.name, event.handler); });
        }
        _super.prototype.release.call(this);
        if (this.uiHideTimeout) {
            this.uiHideTimeout.clear();
        }
    };
    UIContainer.prototype.toDomElement = function () {
        var container = _super.prototype.toDomElement.call(this);
        // Detect flexbox support (not supported in IE9)
        if (document && typeof document.createElement('p').style.flex !== 'undefined') {
            container.addClass(this.prefixCss('flexbox'));
        }
        else {
            container.addClass(this.prefixCss('no-flexbox'));
        }
        return container;
    };
    UIContainer.STATE_PREFIX = 'player-state-';
    UIContainer.FULLSCREEN = 'fullscreen';
    UIContainer.BUFFERING = 'buffering';
    UIContainer.REMOTE_CONTROL = 'remote-control';
    UIContainer.CONTROLS_SHOWN = 'controls-shown';
    UIContainer.CONTROLS_HIDDEN = 'controls-hidden';
    return UIContainer;
}(container_1.Container));
exports.UIContainer = UIContainer;
