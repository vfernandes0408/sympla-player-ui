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
exports.SettingsPanelPageBackButton = void 0;
var settingspanelpagenavigatorbutton_1 = require("./settingspanelpagenavigatorbutton");
var SettingsPanelPageBackButton = /** @class */ (function (_super) {
    __extends(SettingsPanelPageBackButton, _super);
    function SettingsPanelPageBackButton(config) {
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-settingspanelpagebackbutton',
            text: 'back',
        }, _this.config);
        return _this;
    }
    SettingsPanelPageBackButton.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        this.onClick.subscribe(function () {
            _this.popPage();
        });
    };
    return SettingsPanelPageBackButton;
}(settingspanelpagenavigatorbutton_1.SettingsPanelPageNavigatorButton));
exports.SettingsPanelPageBackButton = SettingsPanelPageBackButton;
