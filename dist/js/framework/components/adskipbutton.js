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
exports.AdSkipButton = void 0;
var button_1 = require("./button");
var stringutils_1 = require("../stringutils");
/**
 * A button that is displayed during ads and can be used to skip the ad.
 */
var AdSkipButton = /** @class */ (function (_super) {
    __extends(AdSkipButton, _super);
    function AdSkipButton(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-button-ad-skip',
            untilSkippableMessage: 'Skip ad in {remainingTime}',
            skippableMessage: 'Skip ad',
        }, _this.config);
        return _this;
    }
    AdSkipButton.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var config = this.getConfig();
        var untilSkippableMessage = config.untilSkippableMessage;
        var skippableMessage = config.skippableMessage;
        var skipOffset = -1;
        var updateSkipMessageHandler = function () {
            _this.show();
            // Update the skip message on the button
            if (player.getCurrentTime() < skipOffset) {
                _this.setText(stringutils_1.StringUtils.replaceAdMessagePlaceholders(untilSkippableMessage, skipOffset, player));
                _this.disable();
            }
            else {
                _this.setText(skippableMessage);
                _this.enable();
            }
        };
        var adStartHandler = function (event) {
            var ad = event.ad;
            skipOffset = ad.skippableAfter;
            untilSkippableMessage = ad.uiConfig && ad.uiConfig.untilSkippableMessage || config.untilSkippableMessage;
            skippableMessage = ad.uiConfig && ad.uiConfig.skippableMessage || config.skippableMessage;
            // Display this button only if ad is skippable.
            // Non-skippable ads will return -1 for skippableAfter for player version < v8.3.0.
            if (typeof skipOffset === 'number' && skipOffset >= 0) {
                updateSkipMessageHandler();
                player.on(player.exports.PlayerEvent.TimeChanged, updateSkipMessageHandler);
            }
            else {
                _this.hide();
            }
        };
        var adEndHandler = function () {
            player.off(player.exports.PlayerEvent.TimeChanged, updateSkipMessageHandler);
        };
        player.on(player.exports.PlayerEvent.AdStarted, adStartHandler);
        player.on(player.exports.PlayerEvent.AdSkipped, adEndHandler);
        player.on(player.exports.PlayerEvent.AdError, adEndHandler);
        player.on(player.exports.PlayerEvent.AdFinished, adEndHandler);
        this.onClick.subscribe(function () {
            // Try to skip the ad (this only works if it is skippable so we don't need to take extra care of that here)
            player.ads.skip();
        });
    };
    return AdSkipButton;
}(button_1.Button));
exports.AdSkipButton = AdSkipButton;
