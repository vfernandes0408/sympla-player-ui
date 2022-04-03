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
exports.FontSizeSelectBox = void 0;
var subtitlesettingselectbox_1 = require("./subtitlesettingselectbox");
var i18n_1 = require("../../localization/i18n");
/**
 * A select box providing a selection of different font colors.
 */
var FontSizeSelectBox = /** @class */ (function (_super) {
    __extends(FontSizeSelectBox, _super);
    function FontSizeSelectBox(config) {
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClasses: ['ui-subtitlesettingsfontsizeselectbox'],
        }, _this.config);
        return _this;
    }
    FontSizeSelectBox.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        this.addItem(null, i18n_1.i18n.getLocalizer('default'));
        this.addItem('50', i18n_1.i18n.getLocalizer('percent', { value: 50 }));
        this.addItem('75', i18n_1.i18n.getLocalizer('percent', { value: 75 }));
        this.addItem('100', i18n_1.i18n.getLocalizer('percent', { value: 100 }));
        this.addItem('150', i18n_1.i18n.getLocalizer('percent', { value: 150 }));
        this.addItem('200', i18n_1.i18n.getLocalizer('percent', { value: 200 }));
        this.addItem('300', i18n_1.i18n.getLocalizer('percent', { value: 300 }));
        this.addItem('400', i18n_1.i18n.getLocalizer('percent', { value: 400 }));
        this.settingsManager.fontSize.onChanged.subscribe(function (sender, property) {
            if (property.isSet()) {
                _this.toggleOverlayClass('fontsize-' + property.value);
            }
            else {
                _this.toggleOverlayClass(null);
            }
            // Select the item in case the property was set from outside
            _this.selectItem(property.value);
        });
        this.onItemSelected.subscribe(function (sender, key) {
            _this.settingsManager.fontSize.value = key;
        });
        // Load initial value
        if (this.settingsManager.fontSize.isSet()) {
            this.selectItem(this.settingsManager.fontSize.value);
        }
    };
    return FontSizeSelectBox;
}(subtitlesettingselectbox_1.SubtitleSettingSelectBox));
exports.FontSizeSelectBox = FontSizeSelectBox;
