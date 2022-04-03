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
exports.SubtitleSettingsPanelPage = void 0;
var settingspanelpage_1 = require("../settingspanelpage");
var subtitlesettingsmanager_1 = require("./subtitlesettingsmanager");
var fontsizeselectbox_1 = require("./fontsizeselectbox");
var fontfamilyselectbox_1 = require("./fontfamilyselectbox");
var fontcolorselectbox_1 = require("./fontcolorselectbox");
var fontopacityselectbox_1 = require("./fontopacityselectbox");
var characteredgeselectbox_1 = require("./characteredgeselectbox");
var backgroundcolorselectbox_1 = require("./backgroundcolorselectbox");
var backgroundopacityselectbox_1 = require("./backgroundopacityselectbox");
var windowcolorselectbox_1 = require("./windowcolorselectbox");
var windowopacityselectbox_1 = require("./windowopacityselectbox");
var subtitlesettingsresetbutton_1 = require("./subtitlesettingsresetbutton");
var settingspanelpagebackbutton_1 = require("../settingspanelpagebackbutton");
var settingspanelitem_1 = require("../settingspanelitem");
var i18n_1 = require("../../localization/i18n");
var SubtitleSettingsPanelPage = /** @class */ (function (_super) {
    __extends(SubtitleSettingsPanelPage, _super);
    function SubtitleSettingsPanelPage(config) {
        var _this = _super.call(this, config) || this;
        _this.overlay = config.overlay;
        _this.settingsPanel = config.settingsPanel;
        var manager = new subtitlesettingsmanager_1.SubtitleSettingsManager();
        _this.config = _this.mergeConfig(config, {
            components: [
                new settingspanelitem_1.SettingsPanelItem(i18n_1.i18n.getLocalizer('settings.subtitles.font.size'), new fontsizeselectbox_1.FontSizeSelectBox({
                    overlay: _this.overlay, settingsManager: manager,
                })),
                new settingspanelitem_1.SettingsPanelItem(i18n_1.i18n.getLocalizer('settings.subtitles.font.family'), new fontfamilyselectbox_1.FontFamilySelectBox({
                    overlay: _this.overlay, settingsManager: manager,
                })),
                new settingspanelitem_1.SettingsPanelItem(i18n_1.i18n.getLocalizer('settings.subtitles.font.color'), new fontcolorselectbox_1.FontColorSelectBox({
                    overlay: _this.overlay, settingsManager: manager,
                })),
                new settingspanelitem_1.SettingsPanelItem(i18n_1.i18n.getLocalizer('settings.subtitles.font.opacity'), new fontopacityselectbox_1.FontOpacitySelectBox({
                    overlay: _this.overlay, settingsManager: manager,
                })),
                new settingspanelitem_1.SettingsPanelItem(i18n_1.i18n.getLocalizer('settings.subtitles.characterEdge'), new characteredgeselectbox_1.CharacterEdgeSelectBox({
                    overlay: _this.overlay, settingsManager: manager,
                })),
                new settingspanelitem_1.SettingsPanelItem(i18n_1.i18n.getLocalizer('settings.subtitles.background.color'), new backgroundcolorselectbox_1.BackgroundColorSelectBox({
                    overlay: _this.overlay, settingsManager: manager,
                })),
                new settingspanelitem_1.SettingsPanelItem(i18n_1.i18n.getLocalizer('settings.subtitles.background.opacity'), new backgroundopacityselectbox_1.BackgroundOpacitySelectBox({
                    overlay: _this.overlay, settingsManager: manager,
                })),
                new settingspanelitem_1.SettingsPanelItem(i18n_1.i18n.getLocalizer('settings.subtitles.window.color'), new windowcolorselectbox_1.WindowColorSelectBox({
                    overlay: _this.overlay, settingsManager: manager,
                })),
                new settingspanelitem_1.SettingsPanelItem(i18n_1.i18n.getLocalizer('settings.subtitles.window.opacity'), new windowopacityselectbox_1.WindowOpacitySelectBox({
                    overlay: _this.overlay, settingsManager: manager,
                })),
                new settingspanelitem_1.SettingsPanelItem(new settingspanelpagebackbutton_1.SettingsPanelPageBackButton({
                    container: _this.settingsPanel,
                    text: i18n_1.i18n.getLocalizer('back'),
                }), new subtitlesettingsresetbutton_1.SubtitleSettingsResetButton({
                    settingsManager: manager,
                }), {
                    role: 'menubar',
                }),
            ],
        }, _this.config);
        return _this;
    }
    SubtitleSettingsPanelPage.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        this.onActive.subscribe(function () {
            _this.overlay.enablePreviewSubtitleLabel();
        });
        this.onInactive.subscribe(function () {
            _this.overlay.removePreviewSubtitleLabel();
        });
    };
    return SubtitleSettingsPanelPage;
}(settingspanelpage_1.SettingsPanelPage));
exports.SubtitleSettingsPanelPage = SubtitleSettingsPanelPage;
