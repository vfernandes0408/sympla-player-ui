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
exports.AdClickOverlay = void 0;
var clickoverlay_1 = require("./clickoverlay");
/**
 * A simple click capture overlay for clickThroughUrls of ads.
 */
var AdClickOverlay = /** @class */ (function (_super) {
    __extends(AdClickOverlay, _super);
    function AdClickOverlay() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AdClickOverlay.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var clickThroughCallback = null;
        player.on(player.exports.PlayerEvent.AdStarted, function (event) {
            var ad = event.ad;
            _this.setUrl(ad.clickThroughUrl);
            clickThroughCallback = ad.clickThroughUrlOpened;
        });
        // Clear click-through URL when ad has finished
        var adFinishedHandler = function () {
            _this.setUrl(null);
        };
        player.on(player.exports.PlayerEvent.AdFinished, adFinishedHandler);
        player.on(player.exports.PlayerEvent.AdSkipped, adFinishedHandler);
        player.on(player.exports.PlayerEvent.AdError, adFinishedHandler);
        this.onClick.subscribe(function () {
            // Pause the ad when overlay is clicked
            player.pause('ui-ad-click-overlay');
            if (clickThroughCallback) {
                clickThroughCallback();
            }
        });
    };
    return AdClickOverlay;
}(clickoverlay_1.ClickOverlay));
exports.AdClickOverlay = AdClickOverlay;
