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
exports.SettingsPanelPage = void 0;
var container_1 = require("./container");
var settingspanelitem_1 = require("./settingspanelitem");
var eventdispatcher_1 = require("../eventdispatcher");
var browserutils_1 = require("../browserutils");
/**
 * A panel containing a list of {@link SettingsPanelItem items} that represent labelled settings.
 */
var SettingsPanelPage = /** @class */ (function (_super) {
    __extends(SettingsPanelPage, _super);
    function SettingsPanelPage(config) {
        var _this = _super.call(this, config) || this;
        _this.settingsPanelPageEvents = {
            onSettingsStateChanged: new eventdispatcher_1.EventDispatcher(),
            onActive: new eventdispatcher_1.EventDispatcher(),
            onInactive: new eventdispatcher_1.EventDispatcher(),
        };
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-settings-panel-page',
            role: 'menu',
        }, _this.config);
        return _this;
    }
    SettingsPanelPage.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        // Fire event when the state of a settings-item has changed
        var settingsStateChangedHandler = function () {
            _this.onSettingsStateChangedEvent();
            // Attach marker class to last visible item
            var lastShownItem = null;
            for (var _i = 0, _a = _this.getItems(); _i < _a.length; _i++) {
                var component = _a[_i];
                component.getDomElement().removeClass(_this.prefixCss(SettingsPanelPage.CLASS_LAST));
                if (component.isShown()) {
                    lastShownItem = component;
                }
            }
            if (lastShownItem) {
                lastShownItem.getDomElement().addClass(_this.prefixCss(SettingsPanelPage.CLASS_LAST));
            }
        };
        for (var _i = 0, _a = this.getItems(); _i < _a.length; _i++) {
            var component = _a[_i];
            component.onActiveChanged.subscribe(settingsStateChangedHandler);
        }
    };
    SettingsPanelPage.prototype.hasActiveSettings = function () {
        for (var _i = 0, _a = this.getItems(); _i < _a.length; _i++) {
            var component = _a[_i];
            if (component.isActive()) {
                return true;
            }
        }
        return false;
    };
    SettingsPanelPage.prototype.getItems = function () {
        return this.config.components.filter(function (component) { return component instanceof settingspanelitem_1.SettingsPanelItem; });
    };
    SettingsPanelPage.prototype.onSettingsStateChangedEvent = function () {
        this.settingsPanelPageEvents.onSettingsStateChanged.dispatch(this);
    };
    Object.defineProperty(SettingsPanelPage.prototype, "onSettingsStateChanged", {
        get: function () {
            return this.settingsPanelPageEvents.onSettingsStateChanged.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    SettingsPanelPage.prototype.onActiveEvent = function () {
        var activeItems = this.getItems().filter(function (item) { return item.isActive(); });
        this.settingsPanelPageEvents.onActive.dispatch(this);
        // Disable focus for iOS and iPadOS 13. They open select boxes automatically on focus and we want to avoid that.
        if (activeItems.length > 0 && !browserutils_1.BrowserUtils.isIOS && !(browserutils_1.BrowserUtils.isMacIntel && browserutils_1.BrowserUtils.isTouchSupported)) {
            activeItems[0].getDomElement().focusToFirstInput();
        }
    };
    Object.defineProperty(SettingsPanelPage.prototype, "onActive", {
        get: function () {
            return this.settingsPanelPageEvents.onActive.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    SettingsPanelPage.prototype.onInactiveEvent = function () {
        this.settingsPanelPageEvents.onInactive.dispatch(this);
    };
    Object.defineProperty(SettingsPanelPage.prototype, "onInactive", {
        get: function () {
            return this.settingsPanelPageEvents.onInactive.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    SettingsPanelPage.CLASS_LAST = 'last';
    return SettingsPanelPage;
}(container_1.Container));
exports.SettingsPanelPage = SettingsPanelPage;
