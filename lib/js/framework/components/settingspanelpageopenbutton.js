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
exports.SettingsPanelPageOpenButton = void 0;
var settingspanelpagenavigatorbutton_1 = require("./settingspanelpagenavigatorbutton");
var i18n_1 = require("../localization/i18n");
var SettingsPanelPageOpenButton = /** @class */ (function (_super) {
    __extends(SettingsPanelPageOpenButton, _super);
    function SettingsPanelPageOpenButton(config) {
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-settingspanelpageopenbutton',
            text: i18n_1.i18n.getLocalizer('open'),
            role: 'menuitem',
        }, _this.config);
        return _this;
    }
    SettingsPanelPageOpenButton.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        this.getDomElement().attr('aria-haspopup', 'true');
        this.getDomElement().attr('aria-owns', this.config.targetPage.getConfig().id);
        this.onClick.subscribe(function () {
            _this.pushTargetPage();
        });
    };
    return SettingsPanelPageOpenButton;
}(settingspanelpagenavigatorbutton_1.SettingsPanelPageNavigatorButton));
exports.SettingsPanelPageOpenButton = SettingsPanelPageOpenButton;
