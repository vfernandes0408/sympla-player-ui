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
exports.AdMessageLabel = void 0;
var label_1 = require("./label");
var stringutils_1 = require("../stringutils");
var i18n_1 = require("../localization/i18n");
/**
 * A label that displays a message about a running ad, optionally with a countdown.
 */
var AdMessageLabel = /** @class */ (function (_super) {
    __extends(AdMessageLabel, _super);
    function AdMessageLabel(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-label-ad-message',
            text: i18n_1.i18n.getLocalizer('ads.remainingTime'),
        }, _this.config);
        return _this;
    }
    AdMessageLabel.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var config = this.getConfig();
        var text = config.text;
        var updateMessageHandler = function () {
            _this.setText(stringutils_1.StringUtils.replaceAdMessagePlaceholders(i18n_1.i18n.performLocalization(text), null, player));
        };
        var adStartHandler = function (event) {
            var uiConfig = event.ad.uiConfig;
            text = uiConfig && uiConfig.message || config.text;
            updateMessageHandler();
            player.on(player.exports.PlayerEvent.TimeChanged, updateMessageHandler);
        };
        var adEndHandler = function () {
            player.off(player.exports.PlayerEvent.TimeChanged, updateMessageHandler);
        };
        player.on(player.exports.PlayerEvent.AdStarted, adStartHandler);
        player.on(player.exports.PlayerEvent.AdSkipped, adEndHandler);
        player.on(player.exports.PlayerEvent.AdError, adEndHandler);
        player.on(player.exports.PlayerEvent.AdFinished, adEndHandler);
    };
    return AdMessageLabel;
}(label_1.Label));
exports.AdMessageLabel = AdMessageLabel;
