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
exports.CharacterEdgeSelectBox = void 0;
var subtitlesettingselectbox_1 = require("./subtitlesettingselectbox");
var i18n_1 = require("../../localization/i18n");
/**
 * A select box providing a selection of different character edge.
 */
var CharacterEdgeSelectBox = /** @class */ (function (_super) {
    __extends(CharacterEdgeSelectBox, _super);
    function CharacterEdgeSelectBox(config) {
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClasses: ['ui-subtitlesettingscharacteredgeselectbox'],
        }, _this.config);
        return _this;
    }
    CharacterEdgeSelectBox.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        this.addItem(null, i18n_1.i18n.getLocalizer('default'));
        this.addItem('raised', i18n_1.i18n.getLocalizer('settings.subtitles.characterEdge.raised'));
        this.addItem('depressed', i18n_1.i18n.getLocalizer('settings.subtitles.characterEdge.depressed'));
        this.addItem('uniform', i18n_1.i18n.getLocalizer('settings.subtitles.characterEdge.uniform'));
        this.addItem('dropshadowed', i18n_1.i18n.getLocalizer('settings.subtitles.characterEdge.dropshadowed'));
        this.settingsManager.characterEdge.onChanged.subscribe(function (sender, property) {
            if (property.isSet()) {
                _this.toggleOverlayClass('characteredge-' + property.value);
            }
            else {
                _this.toggleOverlayClass(null);
            }
            // Select the item in case the property was set from outside
            _this.selectItem(property.value);
        });
        this.onItemSelected.subscribe(function (sender, key) {
            _this.settingsManager.characterEdge.value = key;
        });
        // Load initial value
        if (this.settingsManager.characterEdge.isSet()) {
            this.selectItem(this.settingsManager.characterEdge.value);
        }
    };
    return CharacterEdgeSelectBox;
}(subtitlesettingselectbox_1.SubtitleSettingSelectBox));
exports.CharacterEdgeSelectBox = CharacterEdgeSelectBox;
