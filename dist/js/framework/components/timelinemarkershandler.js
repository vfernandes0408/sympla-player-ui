"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelineMarkersHandler = void 0;
var dom_1 = require("../dom");
var playerutils_1 = require("../playerutils");
var timeout_1 = require("../timeout");
var TimelineMarkersHandler = /** @class */ (function () {
    function TimelineMarkersHandler(config, getSeekBarWidth, markersContainer) {
        this.config = config;
        this.getSeekBarWidth = getSeekBarWidth;
        this.markersContainer = markersContainer;
        this.timelineMarkers = [];
    }
    TimelineMarkersHandler.prototype.initialize = function (player, uimanager) {
        this.player = player;
        this.uimanager = uimanager;
        this.configureMarkers();
    };
    TimelineMarkersHandler.prototype.configureMarkers = function () {
        var _this = this;
        // Remove markers when unloaded
        this.player.on(this.player.exports.PlayerEvent.SourceUnloaded, function () { return _this.clearMarkers(); });
        this.player.on(this.player.exports.PlayerEvent.AdBreakStarted, function () { return _this.clearMarkers(); });
        this.player.on(this.player.exports.PlayerEvent.AdBreakFinished, function () { return _this.updateMarkers(); });
        // Update markers when the size of the seekbar changes
        this.player.on(this.player.exports.PlayerEvent.PlayerResized, function () { return _this.updateMarkersDOM(); });
        this.player.on(this.player.exports.PlayerEvent.SourceLoaded, function () {
            if (_this.player.isLive()) {
                // Update marker position as timeshift range changes
                _this.player.on(_this.player.exports.PlayerEvent.TimeChanged, function () { return _this.updateMarkers(); });
                // Update marker postion when paused as timeshift range changes
                _this.configureLivePausedTimeshiftUpdater(function () { return _this.updateMarkers(); });
            }
        });
        this.uimanager.getConfig().events.onUpdated.subscribe(function () { return _this.updateMarkers(); });
        this.uimanager.onRelease.subscribe(function () { return _this.uimanager.getConfig().events.onUpdated.unsubscribe(function () { return _this.updateMarkers(); }); });
        // Init markers at startup
        this.updateMarkers();
    };
    TimelineMarkersHandler.prototype.getMarkerAtPosition = function (percentage) {
        var snappingRange = this.config.snappingRange;
        var matchingMarker = this.timelineMarkers.find(function (marker) {
            var hasDuration = marker.duration > 0;
            // Handle interval markers
            var intervalMarkerMatch = hasDuration &&
                percentage >= marker.position - snappingRange &&
                percentage <= marker.position + marker.duration + snappingRange;
            // Handle position markers
            var positionMarkerMatch = percentage >= marker.position - snappingRange &&
                percentage <= marker.position + snappingRange;
            return intervalMarkerMatch || positionMarkerMatch;
        });
        return matchingMarker || null;
    };
    TimelineMarkersHandler.prototype.clearMarkers = function () {
        this.timelineMarkers = [];
        this.markersContainer.empty();
    };
    TimelineMarkersHandler.prototype.removeMarkerFromConfig = function (marker) {
        this.uimanager.getConfig().metadata.markers = this.uimanager.getConfig().metadata.markers.filter(function (_marker) { return marker !== _marker; });
    };
    TimelineMarkersHandler.prototype.filterRemovedMarkers = function () {
        var _this = this;
        this.timelineMarkers = this.timelineMarkers.filter(function (seekbarMarker) {
            var matchingMarker = _this.uimanager.getConfig().metadata.markers.find(function (_marker) { return seekbarMarker.marker === _marker; });
            if (!matchingMarker) {
                _this.removeMarkerFromDOM(seekbarMarker);
            }
            return matchingMarker;
        });
    };
    TimelineMarkersHandler.prototype.removeMarkerFromDOM = function (marker) {
        if (marker.element) {
            marker.element.remove();
        }
    };
    TimelineMarkersHandler.prototype.updateMarkers = function () {
        var _this = this;
        if (!shouldProcessMarkers(this.player, this.uimanager)) {
            this.clearMarkers();
            return;
        }
        this.filterRemovedMarkers();
        this.uimanager.getConfig().metadata.markers.forEach(function (marker) {
            var _a = getMarkerPositions(_this.player, marker), markerPosition = _a.markerPosition, markerDuration = _a.markerDuration;
            if (shouldRemoveMarker(markerPosition, markerDuration)) {
                _this.removeMarkerFromConfig(marker);
            }
            else if (markerPosition <= 100) {
                var matchingMarker = _this.timelineMarkers.find(function (seekbarMarker) { return seekbarMarker.marker === marker; });
                if (matchingMarker) {
                    matchingMarker.position = markerPosition;
                    matchingMarker.duration = markerDuration;
                    _this.updateMarkerDOM(matchingMarker);
                }
                else {
                    var newMarker = { marker: marker, position: markerPosition, duration: markerDuration };
                    _this.timelineMarkers.push(newMarker);
                    _this.createMarkerDOM(newMarker);
                }
            }
        });
    };
    TimelineMarkersHandler.prototype.getMarkerCssProperties = function (marker) {
        var seekBarWidthPx = this.getSeekBarWidth();
        var positionInPx = (seekBarWidthPx / 100) * (marker.position < 0 ? 0 : marker.position);
        var cssProperties = {
            'transform': "translateX(" + positionInPx + "px)",
        };
        if (marker.duration > 0) {
            var markerWidthPx = Math.round(seekBarWidthPx / 100 * marker.duration);
            cssProperties['width'] = markerWidthPx + "px";
        }
        return cssProperties;
    };
    TimelineMarkersHandler.prototype.updateMarkerDOM = function (marker) {
        marker.element.css(this.getMarkerCssProperties(marker));
    };
    TimelineMarkersHandler.prototype.createMarkerDOM = function (marker) {
        var _this = this;
        var markerClasses = ['seekbar-marker'].concat(marker.marker.cssClasses || [])
            .map(function (cssClass) { return _this.prefixCss(cssClass); });
        var markerElement = new dom_1.DOM('div', {
            'class': markerClasses.join(' '),
            'data-marker-time': String(marker.marker.time),
            'data-marker-title': String(marker.marker.title),
        }).css(this.getMarkerCssProperties(marker));
        if (marker.marker.imageUrl) {
            var removeImage = function () {
                imageElement_1.remove();
            };
            var imageElement_1 = new dom_1.DOM('img', {
                'class': this.prefixCss('seekbar-marker-image'),
                'src': marker.marker.imageUrl,
            }).on('error', removeImage);
            markerElement.append(imageElement_1);
        }
        marker.element = markerElement;
        this.markersContainer.append(markerElement);
    };
    TimelineMarkersHandler.prototype.updateMarkersDOM = function () {
        var _this = this;
        this.timelineMarkers.forEach(function (marker) {
            if (marker.element) {
                _this.updateMarkerDOM(marker);
            }
            else {
                _this.createMarkerDOM(marker);
            }
        });
    };
    TimelineMarkersHandler.prototype.configureLivePausedTimeshiftUpdater = function (handler) {
        var _this = this;
        // Regularly update the marker position while the timeout is active
        this.pausedTimeshiftUpdater = new timeout_1.Timeout(1000, handler, true);
        this.player.on(this.player.exports.PlayerEvent.Paused, function () {
            if (_this.player.isLive() && _this.player.getMaxTimeShift() < 0) {
                _this.pausedTimeshiftUpdater.start();
            }
        });
        // Stop updater when playback continues (no matter if the updater was started before)
        this.player.on(this.player.exports.PlayerEvent.Play, function () { return _this.pausedTimeshiftUpdater.clear(); });
        this.player.on(this.player.exports.PlayerEvent.Destroy, function () { return _this.pausedTimeshiftUpdater.clear(); });
    };
    TimelineMarkersHandler.prototype.prefixCss = function (cssClassOrId) {
        return this.config.cssPrefix + '-' + cssClassOrId;
    };
    return TimelineMarkersHandler;
}());
exports.TimelineMarkersHandler = TimelineMarkersHandler;
function getMarkerPositions(player, marker) {
    var duration = getDuration(player);
    var markerPosition = 100 / duration * getMarkerTime(marker, player, duration); // convert absolute time to percentage
    var markerDuration = 100 / duration * marker.duration;
    if (markerPosition < 0 && !isNaN(markerDuration)) {
        // Shrink marker duration for on live streams as they reach end
        markerDuration = markerDuration + markerPosition;
    }
    if (100 - markerPosition < markerDuration) {
        // Shrink marker if it overflows timeline
        markerDuration = 100 - markerPosition;
    }
    return { markerDuration: markerDuration, markerPosition: markerPosition };
}
function getMarkerTime(marker, player, duration) {
    if (!player.isLive()) {
        return marker.time;
    }
    return duration - (playerutils_1.PlayerUtils.getSeekableRangeRespectingLive(player).end - marker.time);
}
function getDuration(player) {
    if (!player.isLive()) {
        return player.getDuration();
    }
    var _a = playerutils_1.PlayerUtils.getSeekableRangeRespectingLive(player), start = _a.start, end = _a.end;
    return end - start;
}
function shouldRemoveMarker(markerPosition, markerDuration) {
    return (markerDuration < 0 || isNaN(markerDuration)) && markerPosition < 0;
}
function shouldProcessMarkers(player, uimanager) {
    // Don't generate timeline markers if we don't yet have a duration
    // The duration check is for buggy platforms where the duration is not available instantly (Chrome on Android 4.3)
    var validToProcess = player.getDuration() !== Infinity || player.isLive();
    var hasMarkers = uimanager.getConfig().metadata.markers.length > 0;
    return validToProcess && hasMarkers;
}
