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
exports.SubtitleSettingsLabel = void 0;
var container_1 = require("../container");
var dom_1 = require("../../dom");
var i18n_1 = require("../../localization/i18n");
var SubtitleSettingsLabel = /** @class */ (function (_super) {
    __extends(SubtitleSettingsLabel, _super);
    function SubtitleSettingsLabel(config) {
        var _this = _super.call(this, config) || this;
        _this.opener = config.opener;
        _this.text = config.text;
        _this.for = config.for;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-label',
            components: [
                _this.opener,
            ],
        }, _this.config);
        return _this;
    }
    SubtitleSettingsLabel.prototype.toDomElement = function () {
        var labelElement = new dom_1.DOM('label', {
            'id': this.config.id,
            'class': this.getCssClasses(),
            'for': this.for,
        }).append(new dom_1.DOM('span', {}).html(i18n_1.i18n.performLocalization(this.text)), this.opener.getDomElement());
        return labelElement;
    };
    return SubtitleSettingsLabel;
}(container_1.Container));
exports.SubtitleSettingsLabel = SubtitleSettingsLabel;
