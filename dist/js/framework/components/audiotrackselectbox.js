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
exports.AudioTrackSelectBox = void 0;
var selectbox_1 = require("./selectbox");
var audiotrackutils_1 = require("../audiotrackutils");
/**
 * A select box providing a selection between available audio tracks (e.g. different languages).
 */
var AudioTrackSelectBox = /** @class */ (function (_super) {
    __extends(AudioTrackSelectBox, _super);
    function AudioTrackSelectBox(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClasses: ['ui-audiotrackselectbox'],
        }, _this.config);
        return _this;
    }
    AudioTrackSelectBox.prototype.configure = function (player, uimanager) {
        _super.prototype.configure.call(this, player, uimanager);
        new audiotrackutils_1.AudioTrackSwitchHandler(player, this, uimanager);
    };
    return AudioTrackSelectBox;
}(selectbox_1.SelectBox));
exports.AudioTrackSelectBox = AudioTrackSelectBox;
