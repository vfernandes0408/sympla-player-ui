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
exports.SettingsPanelPageNavigatorButton = void 0;
var button_1 = require("./button");
/**
 * Can be used to navigate between SettingsPanelPages
 *
 * Example:
 *  let settingPanelNavigationButton = new SettingsPanelPageNavigatorButton({
 *    container: settingsPanel,
 *    targetPage: settingsPanelPage,
 *  });
 *
 *  settingsPanelPage.addComponent(settingPanelNavigationButton);
 *
 * Don't forget to add the settingPanelNavigationButton to the settingsPanelPage.
 */
var SettingsPanelPageNavigatorButton = /** @class */ (function (_super) {
    __extends(SettingsPanelPageNavigatorButton, _super);
    function SettingsPanelPageNavigatorButton(config) {
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {}, _this.config);
        _this.container = _this.config.container;
        _this.targetPage = _this.config.targetPage;
        return _this;
    }
    /**
     * navigate one level back
     */
    SettingsPanelPageNavigatorButton.prototype.popPage = function () {
        this.container.popSettingsPanelPage();
    };
    /**
     * navigate to the target page
     */
    SettingsPanelPageNavigatorButton.prototype.pushTargetPage = function () {
        this.container.setActivePage(this.targetPage);
    };
    return SettingsPanelPageNavigatorButton;
}(button_1.Button));
exports.SettingsPanelPageNavigatorButton = SettingsPanelPageNavigatorButton;
