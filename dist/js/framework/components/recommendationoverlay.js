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
exports.RecommendationOverlay = void 0;
var container_1 = require("./container");
var component_1 = require("./component");
var dom_1 = require("../dom");
var stringutils_1 = require("../stringutils");
var hugereplaybutton_1 = require("./hugereplaybutton");
/**
 * Overlays the player and displays recommended videos.
 */
var RecommendationOverlay = /** @class */ (function (_super) {
    __extends(RecommendationOverlay, _super);
    function RecommendationOverlay(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.replayButton = new hugereplaybutton_1.HugeReplayButton();
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-recommendation-overlay',
            hidden: true,
            components: [_this.replayButton],
        }, _this.config);
        return _this;
    }
    RecommendationOverlay.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var clearRecommendations = function () {
            for (var _i = 0, _a = _this.getComponents().slice(); _i < _a.length; _i++) {
                var component = _a[_i];
                if (component instanceof RecommendationItem) {
                    _this.removeComponent(component);
                }
            }
            _this.updateComponents();
            _this.getDomElement().removeClass(_this.prefixCss('recommendations'));
        };
        var setupRecommendations = function () {
            clearRecommendations();
            var recommendations = uimanager.getConfig().recommendations;
            if (recommendations.length > 0) {
                var index = 1;
                for (var _i = 0, recommendations_1 = recommendations; _i < recommendations_1.length; _i++) {
                    var item = recommendations_1[_i];
                    _this.addComponent(new RecommendationItem({
                        itemConfig: item,
                        cssClasses: ['recommendation-item-' + (index++)],
                    }));
                }
                _this.updateComponents(); // create container DOM elements
                _this.getDomElement().addClass(_this.prefixCss('recommendations'));
            }
        };
        uimanager.getConfig().events.onUpdated.subscribe(setupRecommendations);
        // Remove recommendations and hide overlay when source is unloaded
        player.on(player.exports.PlayerEvent.SourceUnloaded, function () {
            clearRecommendations();
            _this.hide();
        });
        // Display recommendations when playback has finished
        player.on(player.exports.PlayerEvent.PlaybackFinished, function () {
            _this.show();
        });
        // Hide recommendations when playback starts, e.g. a restart
        player.on(player.exports.PlayerEvent.Play, function () {
            _this.hide();
        });
        // Init on startup
        setupRecommendations();
    };
    return RecommendationOverlay;
}(container_1.Container));
exports.RecommendationOverlay = RecommendationOverlay;
/**
 * An item of the {@link RecommendationOverlay}. Used only internally in {@link RecommendationOverlay}.
 */
var RecommendationItem = /** @class */ (function (_super) {
    __extends(RecommendationItem, _super);
    function RecommendationItem(config) {
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-recommendation-item',
            itemConfig: null,
        }, _this.config);
        return _this;
    }
    RecommendationItem.prototype.toDomElement = function () {
        var config = this.config.itemConfig;
        var itemElement = new dom_1.DOM('a', {
            'id': this.config.id,
            'class': this.getCssClasses(),
            'href': config.url,
        }).css({ 'background-image': "url(" + config.thumbnail + ")" });
        var bgElement = new dom_1.DOM('div', {
            'class': this.prefixCss('background'),
        });
        itemElement.append(bgElement);
        var titleElement = new dom_1.DOM('span', {
            'class': this.prefixCss('title'),
        }).append(new dom_1.DOM('span', {
            'class': this.prefixCss('innertitle'),
        }).html(config.title));
        itemElement.append(titleElement);
        var timeElement = new dom_1.DOM('span', {
            'class': this.prefixCss('duration'),
        }).append(new dom_1.DOM('span', {
            'class': this.prefixCss('innerduration'),
        }).html(config.duration ? stringutils_1.StringUtils.secondsToTime(config.duration) : ''));
        itemElement.append(timeElement);
        return itemElement;
    };
    return RecommendationItem;
}(component_1.Component));
