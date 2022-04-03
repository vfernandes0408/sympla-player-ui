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
exports.SettingsPanelItem = void 0;
var container_1 = require("./container");
var component_1 = require("./component");
var eventdispatcher_1 = require("../eventdispatcher");
var label_1 = require("./label");
var selectbox_1 = require("./selectbox");
var listbox_1 = require("./listbox");
var videoqualityselectbox_1 = require("./videoqualityselectbox");
var audioqualityselectbox_1 = require("./audioqualityselectbox");
var playbackspeedselectbox_1 = require("./playbackspeedselectbox");
/**
 * An item for a {@link SettingsPanelPage},
 * Containing an optional {@link Label} and a component that configures a setting.
 * If the components is a {@link SelectBox} it will handle the logic of displaying it or not
 */
var SettingsPanelItem = /** @class */ (function (_super) {
    __extends(SettingsPanelItem, _super);
    function SettingsPanelItem(label, setting, config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.settingsPanelItemEvents = {
            onActiveChanged: new eventdispatcher_1.EventDispatcher(),
        };
        _this.setting = setting;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-settings-panel-item',
            role: 'menuitem',
        }, _this.config);
        if (label !== null) {
            if (label instanceof component_1.Component) {
                _this.label = label;
            }
            else {
                _this.label = new label_1.Label({ text: label, for: _this.setting.getConfig().id });
            }
            _this.addComponent(_this.label);
        }
        _this.addComponent(_this.setting);
        return _this;
    }
    SettingsPanelItem.prototype.configure = function (player, uimanager) {
        var _this = this;
        if (this.setting instanceof selectbox_1.SelectBox || this.setting instanceof listbox_1.ListBox) {
            var handleConfigItemChanged = function () {
                if (!(_this.setting instanceof selectbox_1.SelectBox) && !(_this.setting instanceof listbox_1.ListBox)) {
                    return;
                }
                // The minimum number of items that must be available for the setting to be displayed
                // By default, at least two items must be available, else a selection is not possible
                var minItemsToDisplay = 2;
                // Audio/video quality select boxes contain an additional 'auto' mode, which in combination with a single
                // available quality also does not make sense
                if ((_this.setting instanceof videoqualityselectbox_1.VideoQualitySelectBox && _this.setting.hasAutoItem())
                    || _this.setting instanceof audioqualityselectbox_1.AudioQualitySelectBox) {
                    minItemsToDisplay = 3;
                }
                if (_this.setting.itemCount() < minItemsToDisplay) {
                    // Hide the setting if no meaningful choice is available
                    _this.hide();
                }
                else if (_this.setting instanceof playbackspeedselectbox_1.PlaybackSpeedSelectBox
                    && !uimanager.getConfig().playbackSpeedSelectionEnabled) {
                    // Hide the PlaybackSpeedSelectBox if disabled in config
                    _this.hide();
                }
                else {
                    _this.show();
                }
                // Visibility might have changed and therefore the active state might have changed so we fire the event
                // TODO fire only when state has really changed (e.g. check if visibility has really changed)
                _this.onActiveChangedEvent();
                _this.getDomElement().attr('aria-haspopup', 'true');
            };
            this.setting.onItemAdded.subscribe(handleConfigItemChanged);
            this.setting.onItemRemoved.subscribe(handleConfigItemChanged);
            // Initialize hidden state
            handleConfigItemChanged();
        }
    };
    /**
     * Checks if this settings panel item is active, i.e. visible and enabled and a user can interact with it.
     * @returns {boolean} true if the panel is active, else false
     */
    SettingsPanelItem.prototype.isActive = function () {
        return this.isShown();
    };
    SettingsPanelItem.prototype.onActiveChangedEvent = function () {
        this.settingsPanelItemEvents.onActiveChanged.dispatch(this);
    };
    Object.defineProperty(SettingsPanelItem.prototype, "onActiveChanged", {
        /**
         * Gets the event that is fired when the 'active' state of this item changes.
         * @see #isActive
         * @returns {Event<SettingsPanelItem, NoArgs>}
         */
        get: function () {
            return this.settingsPanelItemEvents.onActiveChanged.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    return SettingsPanelItem;
}(container_1.Container));
exports.SettingsPanelItem = SettingsPanelItem;
