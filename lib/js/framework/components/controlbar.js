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
exports.ControlBar = void 0;
var container_1 = require("./container");
var uiutils_1 = require("../uiutils");
var spacer_1 = require("./spacer");
var i18n_1 = require("../localization/i18n");
var browserutils_1 = require("../browserutils");
/**
 * A container for main player control components, e.g. play toggle button, seek bar, volume control, fullscreen toggle
 * button.
 */
var ControlBar = /** @class */ (function (_super) {
    __extends(ControlBar, _super);
    function ControlBar(config) {
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-controlbar',
            hidden: true,
            role: 'region',
            ariaLabel: i18n_1.i18n.getLocalizer('controlBar'),
        }, _this.config);
        return _this;
    }
    ControlBar.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        // Counts how many components are hovered and block hiding of the control bar
        var hoverStackCount = 0;
        // only enabling this for non-mobile platforms without touch input. enabling this
        // for touch devices causes the UI to not disappear after hideDelay seconds.
        // Instead, it will stay visible until another manual interaction is performed.
        if (uimanager.getConfig().disableAutoHideWhenHovered && !browserutils_1.BrowserUtils.isMobile) {
            // Track hover status of child components
            uiutils_1.UIUtils.traverseTree(this, function (component) {
                // Do not track hover status of child containers or spacers, only of 'real' controls
                if (component instanceof container_1.Container || component instanceof spacer_1.Spacer) {
                    return;
                }
                // Subscribe hover event and keep a count of the number of hovered children
                component.onHoverChanged.subscribe(function (_, args) {
                    if (args.hovered) {
                        hoverStackCount++;
                    }
                    else {
                        hoverStackCount--;
                    }
                });
            });
        }
        uimanager.onControlsShow.subscribe(function () {
            _this.show();
        });
        uimanager.onPreviewControlsHide.subscribe(function (sender, args) {
            // Cancel the hide event if hovered child components block hiding
            args.cancel = (hoverStackCount > 0);
        });
        uimanager.onControlsHide.subscribe(function () {
            _this.hide();
        });
    };
    return ControlBar;
}(container_1.Container));
exports.ControlBar = ControlBar;
