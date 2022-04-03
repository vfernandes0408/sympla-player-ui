"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubtitleSwitchHandler = void 0;
var i18n_1 = require("./localization/i18n");
/**
 * Helper class to handle all subtitle related events
 *
 * This class listens to player events as well as the `ListSelector` event if selection changed
 */
var SubtitleSwitchHandler = /** @class */ (function () {
    function SubtitleSwitchHandler(player, element, uimanager) {
        var _this = this;
        this.addSubtitle = function (event) {
            var subtitle = event.subtitle;
            if (!_this.listElement.hasItem(subtitle.id)) {
                _this.listElement.addItem(subtitle.id, subtitle.label);
            }
        };
        this.removeSubtitle = function (event) {
            var subtitle = event.subtitle;
            if (_this.listElement.hasItem(subtitle.id)) {
                _this.listElement.removeItem(subtitle.id);
            }
        };
        this.selectCurrentSubtitle = function () {
            if (!_this.player.subtitles) {
                // Subtitles API not available (yet)
                return;
            }
            var currentSubtitle = _this.player.subtitles.list().filter(function (subtitle) { return subtitle.enabled; }).pop();
            _this.listElement.selectItem(currentSubtitle ? currentSubtitle.id : SubtitleSwitchHandler.SUBTITLES_OFF_KEY);
        };
        this.clearSubtitles = function () {
            _this.listElement.clearItems();
        };
        this.refreshSubtitles = function () {
            if (!_this.player.subtitles) {
                // Subtitles API not available (yet)
                return;
            }
            var offListItem = {
                key: SubtitleSwitchHandler.SUBTITLES_OFF_KEY,
                label: i18n_1.i18n.getLocalizer('off'),
            };
            var subtitles = _this.player.subtitles.list();
            var subtitleToListItem = function (subtitle) {
                return { key: subtitle.id, label: subtitle.label };
            };
            _this.listElement.synchronizeItems(__spreadArrays([
                offListItem
            ], subtitles.map(subtitleToListItem)));
            _this.selectCurrentSubtitle();
        };
        this.player = player;
        this.listElement = element;
        this.uimanager = uimanager;
        this.bindSelectionEvent();
        this.bindPlayerEvents();
        this.refreshSubtitles();
    }
    SubtitleSwitchHandler.prototype.bindSelectionEvent = function () {
        var _this = this;
        this.listElement.onItemSelected.subscribe(function (_, value) {
            // TODO add support for multiple concurrent subtitle selections
            if (value === SubtitleSwitchHandler.SUBTITLES_OFF_KEY) {
                var currentSubtitle = _this.player.subtitles.list().filter(function (subtitle) { return subtitle.enabled; }).pop();
                if (currentSubtitle) {
                    _this.player.subtitles.disable(currentSubtitle.id);
                }
            }
            else {
                _this.player.subtitles.enable(value, true);
            }
        });
    };
    SubtitleSwitchHandler.prototype.bindPlayerEvents = function () {
        this.player.on(this.player.exports.PlayerEvent.SubtitleAdded, this.addSubtitle);
        this.player.on(this.player.exports.PlayerEvent.SubtitleEnabled, this.selectCurrentSubtitle);
        this.player.on(this.player.exports.PlayerEvent.SubtitleDisabled, this.selectCurrentSubtitle);
        this.player.on(this.player.exports.PlayerEvent.SubtitleRemoved, this.removeSubtitle);
        // Update subtitles when source goes away
        this.player.on(this.player.exports.PlayerEvent.SourceUnloaded, this.clearSubtitles);
        // Update subtitles when the period within a source changes
        this.player.on(this.player.exports.PlayerEvent.PeriodSwitched, this.refreshSubtitles);
        this.uimanager.getConfig().events.onUpdated.subscribe(this.refreshSubtitles);
    };
    SubtitleSwitchHandler.SUBTITLES_OFF_KEY = 'null';
    return SubtitleSwitchHandler;
}());
exports.SubtitleSwitchHandler = SubtitleSwitchHandler;
