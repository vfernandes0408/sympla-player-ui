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
exports.SettingsPanel = void 0;
var container_1 = require("./container");
var selectbox_1 = require("./selectbox");
var timeout_1 = require("../timeout");
var eventdispatcher_1 = require("../eventdispatcher");
var settingspanelpage_1 = require("./settingspanelpage");
var NavigationDirection;
(function (NavigationDirection) {
    NavigationDirection[NavigationDirection["Forwards"] = 0] = "Forwards";
    NavigationDirection[NavigationDirection["Backwards"] = 1] = "Backwards";
})(NavigationDirection || (NavigationDirection = {}));
/**
 * A panel containing a list of {@link SettingsPanelPage items}.
 *
 * To configure pages just pass them in the components array.
 *
 * Example:
 *  let settingsPanel = new SettingsPanel({
 *    hidden: true,
 *  });
 *
 *  let settingsPanelPage = new SettingsPanelPage({
 *    components: […]
 *  });
 *
 *  let secondSettingsPanelPage = new SettingsPanelPage({
 *    components: […]
 *  });
 *
 *  settingsPanel.addComponent(settingsPanelPage);
 *  settingsPanel.addComponent(secondSettingsPanelPage);
 *
 * For an example how to navigate between pages @see SettingsPanelPageNavigatorButton
 */
var SettingsPanel = /** @class */ (function (_super) {
    __extends(SettingsPanel, _super);
    function SettingsPanel(config) {
        var _this = _super.call(this, config) || this;
        _this.navigationStack = [];
        _this.settingsPanelEvents = {
            onSettingsStateChanged: new eventdispatcher_1.EventDispatcher(),
        };
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-settings-panel',
            hideDelay: 3000,
            pageTransitionAnimation: true,
        }, _this.config);
        _this.activePage = _this.getRootPage();
        return _this;
    }
    SettingsPanel.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var config = this.getConfig();
        uimanager.onControlsHide.subscribe(function () { return _this.hideHoveredSelectBoxes(); });
        if (config.hideDelay > -1) {
            this.hideTimeout = new timeout_1.Timeout(config.hideDelay, function () {
                _this.hide();
                _this.hideHoveredSelectBoxes();
            });
            this.getDomElement().on('mouseenter', function () {
                // On mouse enter clear the timeout
                _this.hideTimeout.clear();
            });
            this.getDomElement().on('mouseleave', function () {
                // On mouse leave activate the timeout
                _this.hideTimeout.reset();
            });
            this.getDomElement().on('focusin', function () {
                _this.hideTimeout.clear();
            });
            this.getDomElement().on('focusout', function () {
                _this.hideTimeout.reset();
            });
        }
        this.onHide.subscribe(function () {
            if (config.hideDelay > -1) {
                // Clear timeout when hidden from outside
                _this.hideTimeout.clear();
            }
            // Since we don't reset the actual navigation here we need to simulate a onInactive event in case some panel
            // needs to do something when they become invisible / inactive.
            _this.activePage.onInactiveEvent();
        });
        this.onShow.subscribe(function () {
            // Reset navigation when te panel gets visible to avoid a weird animation when hiding
            _this.resetNavigation(true);
            // Since we don't need to navigate to the root page again we need to fire the onActive event when the settings
            // panel gets visible.
            _this.activePage.onActiveEvent();
            if (config.hideDelay > -1) {
                // Activate timeout when shown
                _this.hideTimeout.start();
            }
        });
        // pass event from root page through
        this.getRootPage().onSettingsStateChanged.subscribe(function () {
            _this.onSettingsStateChangedEvent();
        });
        this.updateActivePageClass();
    };
    /**
     * Returns the current active / visible page
     * @return {SettingsPanelPage}
     */
    SettingsPanel.prototype.getActivePage = function () {
        return this.activePage;
    };
    /**
     * Sets the
     * @deprecated Use {@link setActivePage} instead
     * @param index
     */
    SettingsPanel.prototype.setActivePageIndex = function (index) {
        this.setActivePage(this.getPages()[index]);
    };
    /**
     * Adds the passed page to the navigation stack and makes it visible.
     * Use {@link popSettingsPanelPage} to navigate backwards.
     *
     * Results in no-op if the target page is the current page.
     * @params page
     */
    SettingsPanel.prototype.setActivePage = function (targetPage) {
        if (targetPage === this.getActivePage()) {
            console.warn('Page is already the current one ... skipping navigation');
            return;
        }
        this.navigateToPage(targetPage, this.getActivePage(), NavigationDirection.Forwards, !this.config.pageTransitionAnimation);
    };
    /**
     * Resets the navigation stack by navigating back to the root page and displaying it.
     */
    SettingsPanel.prototype.popToRootSettingsPanelPage = function () {
        this.resetNavigation(this.config.pageTransitionAnimation);
    };
    /**
     * Removes the current page from the navigation stack and makes the previous one visible.
     * Results in a no-op if we are already on the root page.
     */
    SettingsPanel.prototype.popSettingsPanelPage = function () {
        if (this.navigationStack.length === 0) {
            console.warn('Already on the root page ... skipping navigation');
            return;
        }
        var targetPage = this.navigationStack[this.navigationStack.length - 2];
        // The root part isn't part of the navigation stack so handle it explicitly here
        if (!targetPage) {
            targetPage = this.getRootPage();
        }
        this.navigateToPage(targetPage, this.activePage, NavigationDirection.Backwards, !this.config.pageTransitionAnimation);
    };
    /**
     * Checks if there are active settings within the root page of the settings panel.
     * An active setting is a setting that is visible and enabled, which the user can interact with.
     * @returns {boolean} true if there are active settings, false if the panel is functionally empty to a user
     */
    SettingsPanel.prototype.rootPageHasActiveSettings = function () {
        return this.getRootPage().hasActiveSettings();
    };
    /**
     * Return all configured pages
     * @returns {SettingsPanelPage[]}
     */
    SettingsPanel.prototype.getPages = function () {
        return this.config.components.filter(function (component) { return component instanceof settingspanelpage_1.SettingsPanelPage; });
    };
    Object.defineProperty(SettingsPanel.prototype, "onSettingsStateChanged", {
        get: function () {
            return this.settingsPanelEvents.onSettingsStateChanged.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    SettingsPanel.prototype.release = function () {
        _super.prototype.release.call(this);
        if (this.hideTimeout) {
            this.hideTimeout.clear();
        }
    };
    // Support adding settingsPanelPages after initialization
    SettingsPanel.prototype.addComponent = function (component) {
        if (this.getPages().length === 0 && component instanceof settingspanelpage_1.SettingsPanelPage) {
            this.activePage = component;
        }
        _super.prototype.addComponent.call(this, component);
    };
    SettingsPanel.prototype.updateActivePageClass = function () {
        var _this = this;
        this.getPages().forEach(function (page) {
            if (page === _this.activePage) {
                page.getDomElement().addClass(_this.prefixCss(SettingsPanel.CLASS_ACTIVE_PAGE));
            }
            else {
                page.getDomElement().removeClass(_this.prefixCss(SettingsPanel.CLASS_ACTIVE_PAGE));
            }
        });
    };
    SettingsPanel.prototype.resetNavigation = function (resetNavigationOnShow) {
        var sourcePage = this.getActivePage();
        var rootPage = this.getRootPage();
        if (sourcePage) {
            // Since the onInactiveEvent was already fired in the onHide we need to suppress it here
            if (!resetNavigationOnShow) {
                sourcePage.onInactiveEvent();
            }
        }
        this.navigationStack = [];
        this.animateNavigation(rootPage, sourcePage, resetNavigationOnShow);
        this.activePage = rootPage;
        this.updateActivePageClass();
    };
    SettingsPanel.prototype.navigateToPage = function (targetPage, sourcePage, direction, skipAnimation) {
        this.activePage = targetPage;
        if (direction === NavigationDirection.Forwards) {
            this.navigationStack.push(targetPage);
        }
        else {
            this.navigationStack.pop();
        }
        this.animateNavigation(targetPage, sourcePage, skipAnimation);
        this.updateActivePageClass();
        targetPage.onActiveEvent();
        sourcePage.onInactiveEvent();
    };
    /**
     * @param targetPage
     * @param sourcePage
     * @param skipAnimation This is just an internal flag if we want to have an animation. It is set true when we reset
     * the navigation within the onShow callback of the settingsPanel. In this case we don't want an actual animation but
     * the recalculation of the dimension of the settingsPanel.
     * This is independent of the pageTransitionAnimation flag.
     */
    SettingsPanel.prototype.animateNavigation = function (targetPage, sourcePage, skipAnimation) {
        if (!this.config.pageTransitionAnimation) {
            return;
        }
        var settingsPanelDomElement = this.getDomElement();
        var settingsPanelHTMLElement = this.getDomElement().get(0);
        // get current dimension
        var settingsPanelWidth = settingsPanelHTMLElement.scrollWidth;
        var settingsPanelHeight = settingsPanelHTMLElement.scrollHeight;
        // calculate target size of the settings panel
        sourcePage.getDomElement().css('display', 'none');
        this.getDomElement().css({ width: '', height: '' }); // let css auto settings kick in again
        var targetPageHtmlElement = targetPage.getDomElement().get(0);
        // clone the targetPage DOM element so that we can calculate the width / height how they will be after
        // switching the page. We are using a clone to prevent (mostly styling) side-effects on the real DOM element
        var clone = targetPageHtmlElement.cloneNode(true);
        // append to parent so we get the 'real' size
        var containerWrapper = targetPageHtmlElement.parentNode;
        containerWrapper.appendChild(clone);
        // set clone visible
        clone.style.display = 'block';
        // collect target dimension
        var targetSettingsPanelWidth = settingsPanelHTMLElement.scrollWidth;
        var targetSettingsPanelHeight = settingsPanelHTMLElement.scrollHeight;
        // remove clone from the DOM
        clone.parentElement.removeChild(clone); // .remove() is not working in IE
        sourcePage.getDomElement().css('display', '');
        // set the values back to the current ones that the browser animates it (browsers don't animate 'auto' values)
        settingsPanelDomElement.css({
            width: settingsPanelWidth + 'px',
            height: settingsPanelHeight + 'px',
        });
        if (!skipAnimation) {
            // We need to force the browser to reflow between setting the width and height that we actually get a animation
            this.forceBrowserReflow();
        }
        // set the values to the target dimension
        settingsPanelDomElement.css({
            width: targetSettingsPanelWidth + 'px',
            height: targetSettingsPanelHeight + 'px',
        });
    };
    SettingsPanel.prototype.forceBrowserReflow = function () {
        // Force the browser to reflow the layout
        // https://gist.github.com/paulirish/5d52fb081b3570c81e3a
        this.getDomElement().get(0).offsetLeft;
    };
    /**
     * Hack for IE + Firefox
     * when the settings panel fades out while an item of a select box is still hovered, the select box will not fade out
     * while the settings panel does. This would leave a floating select box, which is just weird
     */
    SettingsPanel.prototype.hideHoveredSelectBoxes = function () {
        this.getComputedItems().forEach(function (item) {
            if (item.isActive() && item.setting instanceof selectbox_1.SelectBox) {
                var selectBox_1 = item.setting;
                var oldDisplay_1 = selectBox_1.getDomElement().css('display');
                if (oldDisplay_1 === 'none') {
                    // if oldDisplay is already 'none', no need to set to 'none' again. It could lead to race condition
                    // wherein the display is irreversibly set to 'none' when browser tab/window is not active because
                    // requestAnimationFrame is either delayed or paused in some browsers in inactive state
                    return;
                }
                // updating the display to none marks the select-box as inactive, so it will be hidden with the rest
                // we just have to make sure to reset this as soon as possible
                selectBox_1.getDomElement().css('display', 'none');
                if (window.requestAnimationFrame) {
                    requestAnimationFrame(function () {
                        selectBox_1.getDomElement().css('display', oldDisplay_1);
                    });
                }
                else {
                    // IE9 has no requestAnimationFrame, set the value directly. It has no optimization about ignoring DOM-changes
                    // between animationFrames
                    selectBox_1.getDomElement().css('display', oldDisplay_1);
                }
            }
        });
    };
    // collect all items from all pages (see hideHoveredSelectBoxes)
    SettingsPanel.prototype.getComputedItems = function () {
        var allItems = [];
        for (var _i = 0, _a = this.getPages(); _i < _a.length; _i++) {
            var page = _a[_i];
            allItems.push.apply(allItems, page.getItems());
        }
        return allItems;
    };
    SettingsPanel.prototype.getRootPage = function () {
        return this.getPages()[0];
    };
    SettingsPanel.prototype.onSettingsStateChangedEvent = function () {
        this.settingsPanelEvents.onSettingsStateChanged.dispatch(this);
    };
    SettingsPanel.CLASS_ACTIVE_PAGE = 'active';
    return SettingsPanel;
}(container_1.Container));
exports.SettingsPanel = SettingsPanel;
