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
exports.SubtitleListBox = void 0;
var listbox_1 = require("./listbox");
var subtitleutils_1 = require("../subtitleutils");
/**
 * A element that is similar to a select box where the user can select a subtitle
 */
var SubtitleListBox = /** @class */ (function (_super) {
    __extends(SubtitleListBox, _super);
    function SubtitleListBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SubtitleListBox.prototype.configure = function (player, uimanager) {
        _super.prototype.configure.call(this, player, uimanager);
        new subtitleutils_1.SubtitleSwitchHandler(player, this, uimanager);
    };
    return SubtitleListBox;
}(listbox_1.ListBox));
exports.SubtitleListBox = SubtitleListBox;
