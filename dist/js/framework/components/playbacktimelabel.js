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
exports.PlaybackTimeLabel = exports.PlaybackTimeLabelMode = void 0;
var label_1 = require("./label");
var playerutils_1 = require("../playerutils");
var stringutils_1 = require("../stringutils");
var i18n_1 = require("../localization/i18n");
var PlaybackTimeLabelMode;
(function (PlaybackTimeLabelMode) {
    /**
     * Displays the current time
     */
    PlaybackTimeLabelMode[PlaybackTimeLabelMode["CurrentTime"] = 0] = "CurrentTime";
    /**
     * Displays the duration of the content
     */
    PlaybackTimeLabelMode[PlaybackTimeLabelMode["TotalTime"] = 1] = "TotalTime";
    /**
     * Displays the current time and the duration of the content
     * Format: ${currentTime} / ${totalTime}
     */
    PlaybackTimeLabelMode[PlaybackTimeLabelMode["CurrentAndTotalTime"] = 2] = "CurrentAndTotalTime";
    /**
     * Displays the remaining time of the content
     */
    PlaybackTimeLabelMode[PlaybackTimeLabelMode["RemainingTime"] = 3] = "RemainingTime";
})(PlaybackTimeLabelMode = exports.PlaybackTimeLabelMode || (exports.PlaybackTimeLabelMode = {}));
/**
 * A label that display the current playback time and the total time through {@link PlaybackTimeLabel#setTime setTime}
 * or any string through {@link PlaybackTimeLabel#setText setText}.
 */
var PlaybackTimeLabel = /** @class */ (function (_super) {
    __extends(PlaybackTimeLabel, _super);
    function PlaybackTimeLabel(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-playbacktimelabel',
            timeLabelMode: PlaybackTimeLabelMode.CurrentAndTotalTime,
            hideInLivePlayback: false,
        }, _this.config);
        return _this;
    }
    PlaybackTimeLabel.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var config = this.getConfig();
        var live = false;
        var liveCssClass = this.prefixCss('ui-playbacktimelabel-live');
        var liveEdgeCssClass = this.prefixCss('ui-playbacktimelabel-live-edge');
        var minWidth = 0;
        var liveClickHandler = function () {
            player.timeShift(0);
        };
        var updateLiveState = function () {
            // Player is playing a live stream when the duration is infinite
            live = player.isLive();
            // Attach/detach live marker class
            if (live) {
                _this.getDomElement().addClass(liveCssClass);
                _this.setText(i18n_1.i18n.getLocalizer('live'));
                if (config.hideInLivePlayback) {
                    _this.hide();
                }
                _this.onClick.subscribe(liveClickHandler);
                updateLiveTimeshiftState();
            }
            else {
                _this.getDomElement().removeClass(liveCssClass);
                _this.getDomElement().removeClass(liveEdgeCssClass);
                _this.show();
                _this.onClick.unsubscribe(liveClickHandler);
            }
        };
        var updateLiveTimeshiftState = function () {
            if (!live) {
                return;
            }
            // The player is only at the live edge iff the stream is not shifted and it is actually playing or playback has
            // never been started (meaning it isn't paused). A player that is paused is always behind the live edge.
            // An exception is made for live streams without a timeshift window, because here we "stop" playback instead
            // of pausing it (from a UI perspective), so we keep the live edge indicator on because a play would always
            // resume at the live edge.
            var isTimeshifted = player.getTimeShift() < 0;
            var isTimeshiftAvailable = player.getMaxTimeShift() < 0;
            if (!isTimeshifted && (!player.isPaused() || !isTimeshiftAvailable)) {
                _this.getDomElement().addClass(liveEdgeCssClass);
            }
            else {
                _this.getDomElement().removeClass(liveEdgeCssClass);
            }
        };
        var liveStreamDetector = new playerutils_1.PlayerUtils.LiveStreamDetector(player, uimanager);
        liveStreamDetector.onLiveChanged.subscribe(function (sender, args) {
            live = args.live;
            updateLiveState();
        });
        liveStreamDetector.detect(); // Initial detection
        var playbackTimeHandler = function () {
            if (!live && player.getDuration() !== Infinity) {
                _this.setTime(playerutils_1.PlayerUtils.getCurrentTimeRelativeToSeekableRange(player), player.getDuration());
            }
            // To avoid 'jumping' in the UI by varying label sizes due to non-monospaced fonts,
            // we gradually increase the min-width with the content to reach a stable size.
            var width = _this.getDomElement().width();
            if (width > minWidth) {
                minWidth = width;
                _this.getDomElement().css({
                    'min-width': minWidth + 'px',
                });
            }
        };
        player.on(player.exports.PlayerEvent.TimeChanged, playbackTimeHandler);
        player.on(player.exports.PlayerEvent.Seeked, playbackTimeHandler);
        player.on(player.exports.PlayerEvent.TimeShift, updateLiveTimeshiftState);
        player.on(player.exports.PlayerEvent.TimeShifted, updateLiveTimeshiftState);
        player.on(player.exports.PlayerEvent.Playing, updateLiveTimeshiftState);
        player.on(player.exports.PlayerEvent.Paused, updateLiveTimeshiftState);
        player.on(player.exports.PlayerEvent.StallStarted, updateLiveTimeshiftState);
        player.on(player.exports.PlayerEvent.StallEnded, updateLiveTimeshiftState);
        var init = function () {
            // Reset min-width when a new source is ready (especially for switching VOD/Live modes where the label content
            // changes)
            minWidth = 0;
            _this.getDomElement().css({
                'min-width': null,
            });
            // Set time format depending on source duration
            _this.timeFormat = Math.abs(player.isLive() ? player.getMaxTimeShift() : player.getDuration()) >= 3600 ?
                stringutils_1.StringUtils.FORMAT_HHMMSS : stringutils_1.StringUtils.FORMAT_MMSS;
            // Update time after the format has been set
            playbackTimeHandler();
        };
        uimanager.getConfig().events.onUpdated.subscribe(init);
        init();
    };
    /**
     * Sets the current playback time and total duration.
     * @param playbackSeconds the current playback time in seconds
     * @param durationSeconds the total duration in seconds
     */
    PlaybackTimeLabel.prototype.setTime = function (playbackSeconds, durationSeconds) {
        var currentTime = stringutils_1.StringUtils.secondsToTime(playbackSeconds, this.timeFormat);
        var totalTime = stringutils_1.StringUtils.secondsToTime(durationSeconds, this.timeFormat);
        switch (this.config.timeLabelMode) {
            case PlaybackTimeLabelMode.CurrentTime:
                this.setText("" + currentTime);
                break;
            case PlaybackTimeLabelMode.TotalTime:
                this.setText("" + totalTime);
                break;
            case PlaybackTimeLabelMode.CurrentAndTotalTime:
                this.setText(currentTime + " / " + totalTime);
                break;
            case PlaybackTimeLabelMode.RemainingTime:
                var remainingTime = stringutils_1.StringUtils.secondsToTime(durationSeconds - playbackSeconds, this.timeFormat);
                this.setText("" + remainingTime);
                break;
        }
    };
    /**
     * Sets the current time format
     * @param timeFormat the time format
     */
    PlaybackTimeLabel.prototype.setTimeFormat = function (timeFormat) {
        this.timeFormat = timeFormat;
    };
    return PlaybackTimeLabel;
}(label_1.Label));
exports.PlaybackTimeLabel = PlaybackTimeLabel;
