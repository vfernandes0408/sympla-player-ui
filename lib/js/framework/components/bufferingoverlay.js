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
exports.BufferingOverlay = void 0;
var container_1 = require("./container");
var component_1 = require("./component");
var timeout_1 = require("../timeout");
/**
 * Overlays the player and displays a buffering indicator.
 */
var BufferingOverlay = /** @class */ (function (_super) {
    __extends(BufferingOverlay, _super);
    function BufferingOverlay(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.indicators = [
            new component_1.Component({ tag: 'div', cssClass: 'ui-buffering-overlay-indicator', role: 'img' }),
            new component_1.Component({ tag: 'div', cssClass: 'ui-buffering-overlay-indicator', role: 'img' }),
            new component_1.Component({ tag: 'div', cssClass: 'ui-buffering-overlay-indicator', role: 'img' }),
        ];
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-buffering-overlay',
            hidden: true,
            components: _this.indicators,
            showDelayMs: 1000,
        }, _this.config);
        return _this;
    }
    BufferingOverlay.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var config = this.getConfig();
        var overlayShowTimeout = new timeout_1.Timeout(config.showDelayMs, function () {
            _this.show();
        });
        var showOverlay = function () {
            overlayShowTimeout.start();
        };
        var hideOverlay = function () {
            overlayShowTimeout.clear();
            _this.hide();
        };
        player.on(player.exports.PlayerEvent.StallStarted, showOverlay);
        player.on(player.exports.PlayerEvent.StallEnded, hideOverlay);
        player.on(player.exports.PlayerEvent.Play, showOverlay);
        player.on(player.exports.PlayerEvent.Playing, hideOverlay);
        player.on(player.exports.PlayerEvent.Paused, hideOverlay);
        player.on(player.exports.PlayerEvent.Seek, showOverlay);
        player.on(player.exports.PlayerEvent.Seeked, hideOverlay);
        player.on(player.exports.PlayerEvent.TimeShift, showOverlay);
        player.on(player.exports.PlayerEvent.TimeShifted, hideOverlay);
        player.on(player.exports.PlayerEvent.SourceUnloaded, hideOverlay);
        // Show overlay if player is already stalled at init
        if (player.isStalled()) {
            this.show();
        }
    };
    return BufferingOverlay;
}(container_1.Container));
exports.BufferingOverlay = BufferingOverlay;
