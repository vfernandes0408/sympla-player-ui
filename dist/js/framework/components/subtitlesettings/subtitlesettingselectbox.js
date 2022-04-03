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
exports.SubtitleSettingSelectBox = void 0;
var selectbox_1 = require("../selectbox");
/**
 * Base class for all subtitles settings select box
 **/
var SubtitleSettingSelectBox = /** @class */ (function (_super) {
    __extends(SubtitleSettingSelectBox, _super);
    function SubtitleSettingSelectBox(config) {
        var _this = _super.call(this, config) || this;
        _this.settingsManager = config.settingsManager;
        _this.overlay = config.overlay;
        return _this;
    }
    /**
     * Removes a previously set class and adds the passed in class.
     * @param cssClass The new class to replace the previous class with or null to just remove the previous class
     */
    SubtitleSettingSelectBox.prototype.toggleOverlayClass = function (cssClass) {
        // Remove previous class if existing
        if (this.currentCssClass) {
            this.overlay.getDomElement().removeClass(this.currentCssClass);
            this.currentCssClass = null;
        }
        // Add new class if specified. If the new class is null, we don't add anything.
        if (cssClass) {
            this.currentCssClass = this.prefixCss(cssClass);
            this.overlay.getDomElement().addClass(this.currentCssClass);
        }
    };
    return SubtitleSettingSelectBox;
}(selectbox_1.SelectBox));
exports.SubtitleSettingSelectBox = SubtitleSettingSelectBox;
