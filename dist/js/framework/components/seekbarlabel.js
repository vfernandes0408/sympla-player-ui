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
exports.SeekBarLabel = void 0;
var container_1 = require("./container");
var label_1 = require("./label");
var component_1 = require("./component");
var stringutils_1 = require("../stringutils");
var imageloader_1 = require("../imageloader");
var playerutils_1 = require("../playerutils");
/**
 * A label for a {@link SeekBar} that can display the seek target time, a thumbnail, and title (e.g. chapter title).
 */
var SeekBarLabel = /** @class */ (function (_super) {
    __extends(SeekBarLabel, _super);
    function SeekBarLabel(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.appliedMarkerCssClasses = [];
        _this.handleSeekPreview = function (sender, args) {
            if (_this.player.isLive()) {
                var maxTimeShift = _this.player.getMaxTimeShift();
                var timeShiftPreview = maxTimeShift - maxTimeShift * (args.position / 100);
                _this.setTime(timeShiftPreview);
                // In case of a live stream the player expects the time passed into the getThumbnail as a wallClockTime and not
                // as a relative timeShift value.
                var convertTimeShiftPreviewToWallClockTime = function (targetTimeShift) {
                    var currentTimeShift = _this.player.getTimeShift();
                    var currentTime = _this.player.getCurrentTime();
                    var wallClockTimeOfLiveEdge = currentTime - currentTimeShift;
                    return wallClockTimeOfLiveEdge + targetTimeShift;
                };
                var wallClockTime = convertTimeShiftPreviewToWallClockTime(timeShiftPreview);
                _this.setThumbnail(_this.player.getThumbnail(wallClockTime));
            }
            else {
                var time = _this.player.getDuration() * (args.position / 100);
                _this.setTime(time);
                var seekableRangeStart = playerutils_1.PlayerUtils.getSeekableRangeStart(_this.player, 0);
                var absoluteSeekTarget = time + seekableRangeStart;
                _this.setThumbnail(_this.player.getThumbnail(absoluteSeekTarget));
            }
            if (args.marker) {
                _this.setTitleText(args.marker.marker.title);
            }
            else {
                _this.setTitleText(null);
            }
            // Remove CSS classes from previous marker
            if (_this.appliedMarkerCssClasses.length > 0) {
                _this.getDomElement().removeClass(_this.appliedMarkerCssClasses.join(' '));
                _this.appliedMarkerCssClasses = [];
            }
            // Add CSS classes of current marker
            if (args.marker) {
                var cssClasses = (args.marker.marker.cssClasses || []).map(function (cssClass) { return _this.prefixCss(cssClass); });
                _this.getDomElement().addClass(cssClasses.join(' '));
                _this.appliedMarkerCssClasses = cssClasses;
            }
        };
        _this.timeLabel = new label_1.Label({ cssClasses: ['seekbar-label-time'] });
        _this.titleLabel = new label_1.Label({ cssClasses: ['seekbar-label-title'] });
        _this.thumbnail = new component_1.Component({ cssClasses: ['seekbar-thumbnail'], role: 'img' });
        _this.thumbnailImageLoader = new imageloader_1.ImageLoader();
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-seekbar-label',
            components: [new container_1.Container({
                    components: [
                        _this.thumbnail,
                        new container_1.Container({
                            components: [_this.titleLabel, _this.timeLabel],
                            cssClass: 'seekbar-label-metadata',
                        })
                    ],
                    cssClass: 'seekbar-label-inner',
                })],
            hidden: true,
        }, _this.config);
        return _this;
    }
    SeekBarLabel.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        this.player = player;
        this.uiManager = uimanager;
        uimanager.onSeekPreview.subscribeRateLimited(this.handleSeekPreview, 100);
        var init = function () {
            // Set time format depending on source duration
            _this.timeFormat = Math.abs(player.isLive() ? player.getMaxTimeShift() : player.getDuration()) >= 3600 ?
                stringutils_1.StringUtils.FORMAT_HHMMSS : stringutils_1.StringUtils.FORMAT_MMSS;
            // Set initial state of title and thumbnail to handle sourceLoaded when switching to a live-stream
            _this.setTitleText(null);
            _this.setThumbnail(null);
        };
        uimanager.getConfig().events.onUpdated.subscribe(init);
        init();
    };
    /**
     * Sets arbitrary text on the label.
     * @param text the text to show on the label
     */
    SeekBarLabel.prototype.setText = function (text) {
        this.timeLabel.setText(text);
    };
    /**
     * Sets a time to be displayed on the label.
     * @param seconds the time in seconds to display on the label
     */
    SeekBarLabel.prototype.setTime = function (seconds) {
        this.setText(stringutils_1.StringUtils.secondsToTime(seconds, this.timeFormat));
    };
    /**
     * Sets the text on the title label.
     * @param text the text to show on the label
     */
    SeekBarLabel.prototype.setTitleText = function (text) {
        if (text === void 0) { text = ''; }
        this.titleLabel.setText(text);
    };
    /**
     * Sets or removes a thumbnail on the label.
     * @param thumbnail the thumbnail to display on the label or null to remove a displayed thumbnail
     */
    SeekBarLabel.prototype.setThumbnail = function (thumbnail) {
        var _this = this;
        if (thumbnail === void 0) { thumbnail = null; }
        var thumbnailElement = this.thumbnail.getDomElement();
        if (thumbnail == null) {
            thumbnailElement.css({
                'background-image': null,
                'display': null,
                'width': null,
                'height': null,
            });
        }
        else {
            // We use the thumbnail image loader to make sure the thumbnail is loaded and it's size is known before be can
            // calculate the CSS properties and set them on the element.
            this.thumbnailImageLoader.load(thumbnail.url, function (url, width, height) {
                // can be checked like that because x/y/w/h are either all present or none
                // https://www.w3.org/TR/media-frags/#naming-space
                if (thumbnail.x !== undefined) {
                    thumbnailElement.css(_this.thumbnailCssSprite(thumbnail, width, height));
                }
                else {
                    thumbnailElement.css(_this.thumbnailCssSingleImage(thumbnail, width, height));
                }
            });
        }
    };
    SeekBarLabel.prototype.thumbnailCssSprite = function (thumbnail, width, height) {
        var thumbnailCountX = width / thumbnail.width;
        var thumbnailCountY = height / thumbnail.height;
        var thumbnailIndexX = thumbnail.x / thumbnail.width;
        var thumbnailIndexY = thumbnail.y / thumbnail.height;
        var sizeX = 100 * thumbnailCountX;
        var sizeY = 100 * thumbnailCountY;
        var offsetX = 100 * thumbnailIndexX;
        var offsetY = 100 * thumbnailIndexY;
        var aspectRatio = 1 / thumbnail.width * thumbnail.height;
        // The thumbnail size is set by setting the CSS 'width' and 'padding-bottom' properties. 'padding-bottom' is
        // used because it is relative to the width and can be used to set the aspect ratio of the thumbnail.
        // A default value for width is set in the stylesheet and can be overwritten from there or anywhere else.
        return {
            'display': 'inherit',
            'background-image': "url(" + thumbnail.url + ")",
            'padding-bottom': 100 * aspectRatio + "%",
            'background-size': sizeX + "% " + sizeY + "%",
            'background-position': "-" + offsetX + "% -" + offsetY + "%",
        };
    };
    SeekBarLabel.prototype.thumbnailCssSingleImage = function (thumbnail, width, height) {
        var aspectRatio = 1 / width * height;
        return {
            'display': 'inherit',
            'background-image': "url(" + thumbnail.url + ")",
            'padding-bottom': 100 * aspectRatio + "%",
            'background-size': "100% 100%",
            'background-position': "0 0",
        };
    };
    SeekBarLabel.prototype.release = function () {
        _super.prototype.release.call(this);
        this.uiManager.onSeekPreview.unsubscribe(this.handleSeekPreview);
    };
    return SeekBarLabel;
}(container_1.Container));
exports.SeekBarLabel = SeekBarLabel;
