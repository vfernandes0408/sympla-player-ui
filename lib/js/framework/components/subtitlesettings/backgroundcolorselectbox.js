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
exports.BackgroundColorSelectBox = void 0;
var subtitlesettingselectbox_1 = require("./subtitlesettingselectbox");
var i18n_1 = require("../../localization/i18n");
/**
 * A select box providing a selection of different background colors.
 */
var BackgroundColorSelectBox = /** @class */ (function (_super) {
    __extends(BackgroundColorSelectBox, _super);
    function BackgroundColorSelectBox(config) {
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClasses: ['ui-subtitlesettingsbackgroundcolorselectbox'],
        }, _this.config);
        return _this;
    }
    BackgroundColorSelectBox.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        this.addItem(null, i18n_1.i18n.getLocalizer('default'));
        this.addItem('white', i18n_1.i18n.getLocalizer('colors.white'));
        this.addItem('black', i18n_1.i18n.getLocalizer('colors.black'));
        this.addItem('red', i18n_1.i18n.getLocalizer('colors.red'));
        this.addItem('green', i18n_1.i18n.getLocalizer('colors.green'));
        this.addItem('blue', i18n_1.i18n.getLocalizer('colors.blue'));
        this.addItem('cyan', i18n_1.i18n.getLocalizer('colors.cyan'));
        this.addItem('yellow', i18n_1.i18n.getLocalizer('colors.yellow'));
        this.addItem('magenta', i18n_1.i18n.getLocalizer('colors.magenta'));
        var setColorAndOpacity = function () {
            if (_this.settingsManager.backgroundColor.isSet() && _this.settingsManager.backgroundOpacity.isSet()) {
                _this.toggleOverlayClass('bgcolor-' + _this.settingsManager.backgroundColor.value + _this.settingsManager.backgroundOpacity.value);
            }
            else {
                _this.toggleOverlayClass(null);
            }
        };
        this.onItemSelected.subscribe(function (sender, key) {
            _this.settingsManager.backgroundColor.value = key;
        });
        this.settingsManager.backgroundColor.onChanged.subscribe(function (sender, property) {
            // Color and opacity go together, so we need to...
            if (!_this.settingsManager.backgroundColor.isSet()) {
                // ... clear the opacity when the color is not set
                _this.settingsManager.backgroundOpacity.clear();
            }
            else if (!_this.settingsManager.backgroundOpacity.isSet()) {
                // ... set an opacity when the color is set
                _this.settingsManager.backgroundOpacity.value = '100';
            }
            _this.selectItem(property.value);
            setColorAndOpacity();
        });
        this.settingsManager.backgroundOpacity.onChanged.subscribe(function () {
            setColorAndOpacity();
        });
        // Load initial value
        if (this.settingsManager.backgroundColor.isSet()) {
            this.selectItem(this.settingsManager.backgroundColor.value);
        }
    };
    return BackgroundColorSelectBox;
}(subtitlesettingselectbox_1.SubtitleSettingSelectBox));
exports.BackgroundColorSelectBox = BackgroundColorSelectBox;
