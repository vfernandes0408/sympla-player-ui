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
exports.ErrorMessageOverlay = void 0;
var container_1 = require("./container");
var label_1 = require("./label");
var tvnoisecanvas_1 = require("./tvnoisecanvas");
var errorutils_1 = require("../errorutils");
var mobilev3playerapi_1 = require("../mobilev3playerapi");
/**
 * Overlays the player and displays error messages.
 */
var ErrorMessageOverlay = /** @class */ (function (_super) {
    __extends(ErrorMessageOverlay, _super);
    function ErrorMessageOverlay(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.errorLabel = new label_1.Label({ cssClass: 'ui-errormessage-label' });
        _this.tvNoiseBackground = new tvnoisecanvas_1.TvNoiseCanvas();
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-errormessage-overlay',
            components: [_this.tvNoiseBackground, _this.errorLabel],
            hidden: true,
        }, _this.config);
        return _this;
    }
    ErrorMessageOverlay.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var config = this.getConfig();
        var handleErrorMessage = function (event, message) {
            var customizedMessage = customizeErrorMessage(uimanager.getConfig().errorMessages || config.messages, event);
            if (customizedMessage) {
                message = customizedMessage;
            }
            _this.errorLabel.setText(message);
            _this.tvNoiseBackground.start();
            _this.show();
        };
        if (mobilev3playerapi_1.isMobileV3PlayerAPI(player)) {
            var errorEventHandler = function (event) {
                var message = errorutils_1.ErrorUtils.defaultMobileV3ErrorMessageTranslator(event);
                handleErrorMessage(event, message);
            };
            player.on(mobilev3playerapi_1.MobileV3PlayerEvent.PlayerError, errorEventHandler);
            player.on(mobilev3playerapi_1.MobileV3PlayerEvent.SourceError, errorEventHandler);
        }
        else {
            player.on(player.exports.PlayerEvent.Error, function (event) {
                var message = errorutils_1.ErrorUtils.defaultWebErrorMessageTranslator(event);
                handleErrorMessage(event, message);
            });
        }
        player.on(player.exports.PlayerEvent.SourceLoaded, function (event) {
            if (_this.isShown()) {
                _this.tvNoiseBackground.stop();
                _this.hide();
            }
        });
    };
    ErrorMessageOverlay.prototype.release = function () {
        _super.prototype.release.call(this);
        // Canvas rendering must be explicitly stopped, else it just continues forever and hogs resources
        this.tvNoiseBackground.stop();
    };
    return ErrorMessageOverlay;
}(container_1.Container));
exports.ErrorMessageOverlay = ErrorMessageOverlay;
function customizeErrorMessage(errorMessages, event) {
    if (!errorMessages) {
        return undefined;
    }
    // Process message vocabularies
    if (typeof errorMessages === 'function') {
        // Translation function for all errors
        return errorMessages(event);
    }
    if (errorMessages[event.code]) {
        // It's not a translation function, so it must be a map of strings or translation functions
        var customMessage = errorMessages[event.code];
        return typeof customMessage === 'string' ? customMessage : customMessage(event);
    }
}
