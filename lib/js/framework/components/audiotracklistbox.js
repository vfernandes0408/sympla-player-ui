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
exports.AudioTrackListBox = void 0;
var listbox_1 = require("./listbox");
var audiotrackutils_1 = require("../audiotrackutils");
/**
 * A element that is similar to a select box where the user can select a subtitle
 */
var AudioTrackListBox = /** @class */ (function (_super) {
    __extends(AudioTrackListBox, _super);
    function AudioTrackListBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AudioTrackListBox.prototype.configure = function (player, uimanager) {
        _super.prototype.configure.call(this, player, uimanager);
        new audiotrackutils_1.AudioTrackSwitchHandler(player, this, uimanager);
    };
    return AudioTrackListBox;
}(listbox_1.ListBox));
exports.AudioTrackListBox = AudioTrackListBox;
