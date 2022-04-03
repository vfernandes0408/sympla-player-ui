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
exports.SubtitleSettingsResetButton = void 0;
var button_1 = require("../button");
var i18n_1 = require("../../localization/i18n");
/**
 * A button that resets all subtitle settings to their defaults.
 */
var SubtitleSettingsResetButton = /** @class */ (function (_super) {
    __extends(SubtitleSettingsResetButton, _super);
    function SubtitleSettingsResetButton(config) {
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-subtitlesettingsresetbutton',
            text: i18n_1.i18n.getLocalizer('reset'),
        }, _this.config);
        return _this;
    }
    SubtitleSettingsResetButton.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        this.onClick.subscribe(function () {
            _this.config.settingsManager.reset();
        });
    };
    return SubtitleSettingsResetButton;
}(button_1.Button));
exports.SubtitleSettingsResetButton = SubtitleSettingsResetButton;
