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
exports.SubtitleRegionContainer = exports.SubtitleRegionContainerManager = exports.SubtitleLabel = exports.SubtitleOverlay = void 0;
var container_1 = require("./container");
var label_1 = require("./label");
var controlbar_1 = require("./controlbar");
var eventdispatcher_1 = require("../eventdispatcher");
var dom_1 = require("../dom");
var i18n_1 = require("../localization/i18n");
var vttutils_1 = require("../vttutils");
/**
 * Overlays the player to display subtitles.
 */
var SubtitleOverlay = /** @class */ (function (_super) {
    __extends(SubtitleOverlay, _super);
    function SubtitleOverlay(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.preprocessLabelEventCallback = new eventdispatcher_1.EventDispatcher();
        _this.previewSubtitleActive = false;
        _this.previewSubtitle = new SubtitleLabel({ text: i18n_1.i18n.getLocalizer('subtitle.example') });
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-subtitle-overlay',
        }, _this.config);
        return _this;
    }
    SubtitleOverlay.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var subtitleManager = new ActiveSubtitleManager();
        this.subtitleManager = subtitleManager;
        this.subtitleContainerManager = new SubtitleRegionContainerManager(this);
        player.on(player.exports.PlayerEvent.CueEnter, function (event) {
            var label = _this.generateLabel(event);
            subtitleManager.cueEnter(event, label);
            _this.preprocessLabelEventCallback.dispatch(event, label);
            if (_this.previewSubtitleActive) {
                _this.subtitleContainerManager.removeLabel(_this.previewSubtitle);
            }
            _this.show();
            _this.subtitleContainerManager.addLabel(label, _this.getDomElement().size());
            _this.updateComponents();
        });
        player.on(player.exports.PlayerEvent.CueUpdate, function (event) {
            var label = _this.generateLabel(event);
            var labelToReplace = subtitleManager.cueUpdate(event, label);
            _this.preprocessLabelEventCallback.dispatch(event, label);
            if (labelToReplace) {
                _this.subtitleContainerManager.replaceLabel(labelToReplace, label);
            }
        });
        player.on(player.exports.PlayerEvent.CueExit, function (event) {
            var labelToRemove = subtitleManager.cueExit(event);
            if (labelToRemove) {
                _this.subtitleContainerManager.removeLabel(labelToRemove);
                _this.updateComponents();
            }
            if (!subtitleManager.hasCues) {
                if (!_this.previewSubtitleActive) {
                    _this.hide();
                }
                else {
                    _this.subtitleContainerManager.addLabel(_this.previewSubtitle);
                    _this.updateComponents();
                }
            }
        });
        var subtitleClearHandler = function () {
            _this.hide();
            _this.subtitleContainerManager.clear();
            subtitleManager.clear();
            _this.removeComponents();
            _this.updateComponents();
        };
        player.on(player.exports.PlayerEvent.AudioChanged, subtitleClearHandler);
        player.on(player.exports.PlayerEvent.SubtitleEnabled, subtitleClearHandler);
        player.on(player.exports.PlayerEvent.SubtitleDisabled, subtitleClearHandler);
        player.on(player.exports.PlayerEvent.Seek, subtitleClearHandler);
        player.on(player.exports.PlayerEvent.TimeShift, subtitleClearHandler);
        player.on(player.exports.PlayerEvent.PlaybackFinished, subtitleClearHandler);
        player.on(player.exports.PlayerEvent.SourceUnloaded, subtitleClearHandler);
        uimanager.onComponentShow.subscribe(function (component) {
            if (component instanceof controlbar_1.ControlBar) {
                _this.getDomElement().addClass(_this.prefixCss(SubtitleOverlay.CLASS_CONTROLBAR_VISIBLE));
            }
        });
        uimanager.onComponentHide.subscribe(function (component) {
            if (component instanceof controlbar_1.ControlBar) {
                _this.getDomElement().removeClass(_this.prefixCss(SubtitleOverlay.CLASS_CONTROLBAR_VISIBLE));
            }
        });
        this.configureCea608Captions(player, uimanager);
        // Init
        subtitleClearHandler();
    };
    SubtitleOverlay.prototype.generateLabel = function (event) {
        // Sanitize cue data (must be done before the cue ID is generated in subtitleManager.cueEnter / update)
        if (event.position) {
            // Sometimes the positions are undefined, we assume them to be zero
            event.position.row = event.position.row || 0;
            event.position.column = event.position.column || 0;
        }
        var label = new SubtitleLabel({
            // Prefer the HTML subtitle text if set, else try generating a image tag as string from the image attribute,
            // else use the plain text
            text: event.html || ActiveSubtitleManager.generateImageTagText(event.image) || event.text,
            vtt: event.vtt,
            region: event.region,
            regionStyle: event.regionStyle,
        });
        return label;
    };
    SubtitleOverlay.prototype.configureCea608Captions = function (player, uimanager) {
        var _this = this;
        // The calculated font size
        var fontSize = 0;
        // The required letter spacing spread the text characters evenly across the grid
        var fontLetterSpacing = 0;
        // Flag telling if a font size calculation is required of if the current values are valid
        var fontSizeCalculationRequired = true;
        // Flag telling if the CEA-608 mode is enabled
        var enabled = false;
        var updateCEA608FontSize = function () {
            var dummyLabel = new SubtitleLabel({ text: 'X' });
            dummyLabel.getDomElement().css({
                // By using a large font size we do not need to use multiple letters and can get still an
                // accurate measurement even though the returned size is an integer value
                'font-size': '200px',
                'line-height': '200px',
                'visibility': 'hidden',
            });
            _this.addComponent(dummyLabel);
            _this.updateComponents();
            _this.show();
            var dummyLabelCharWidth = dummyLabel.getDomElement().width();
            var dummyLabelCharHeight = dummyLabel.getDomElement().height();
            var fontSizeRatio = dummyLabelCharWidth / dummyLabelCharHeight;
            _this.removeComponent(dummyLabel);
            _this.updateComponents();
            if (!_this.subtitleManager.hasCues) {
                _this.hide();
            }
            // We subtract 1px here to avoid line breaks at the right border of the subtitle overlay that can happen
            // when texts contain whitespaces. It's probably some kind of pixel rounding issue in the browser's
            // layouting, but the actual reason could not be determined. Aiming for a target width - 1px would work in
            // most browsers, but Safari has a "quantized" font size rendering with huge steps in between so we need
            // to subtract some more pixels to avoid line breaks there as well.
            var subtitleOverlayWidth = _this.getDomElement().width() - 10;
            var subtitleOverlayHeight = _this.getDomElement().height();
            // The size ratio of the letter grid
            var fontGridSizeRatio = (dummyLabelCharWidth * SubtitleOverlay.CEA608_NUM_COLUMNS) /
                (dummyLabelCharHeight * SubtitleOverlay.CEA608_NUM_ROWS);
            // The size ratio of the available space for the grid
            var subtitleOverlaySizeRatio = subtitleOverlayWidth / subtitleOverlayHeight;
            if (subtitleOverlaySizeRatio > fontGridSizeRatio) {
                // When the available space is wider than the text grid, the font size is simply
                // determined by the height of the available space.
                fontSize = subtitleOverlayHeight / SubtitleOverlay.CEA608_NUM_ROWS;
                // Calculate the additional letter spacing required to evenly spread the text across the grid's width
                var gridSlotWidth = subtitleOverlayWidth / SubtitleOverlay.CEA608_NUM_COLUMNS;
                var fontCharWidth = fontSize * fontSizeRatio;
                fontLetterSpacing = gridSlotWidth - fontCharWidth;
            }
            else {
                // When the available space is not wide enough, texts would vertically overlap if we take
                // the height as a base for the font size, so we need to limit the height. We do that
                // by determining the font size by the width of the available space.
                fontSize = subtitleOverlayWidth / SubtitleOverlay.CEA608_NUM_COLUMNS / fontSizeRatio;
                fontLetterSpacing = 0;
            }
            // Update font-size of all active subtitle labels
            for (var _i = 0, _a = _this.getComponents(); _i < _a.length; _i++) {
                var label = _a[_i];
                if (label instanceof SubtitleLabel) {
                    label.getDomElement().css({
                        'font-size': fontSize + "px",
                        'letter-spacing': fontLetterSpacing + "px",
                    });
                }
            }
        };
        player.on(player.exports.PlayerEvent.PlayerResized, function () {
            if (enabled) {
                updateCEA608FontSize();
            }
            else {
                fontSizeCalculationRequired = true;
            }
        });
        this.preprocessLabelEventCallback.subscribe(function (event, label) {
            var isCEA608 = event.position != null;
            if (!isCEA608) {
                // Skip all non-CEA608 cues
                return;
            }
            if (!enabled) {
                enabled = true;
                _this.getDomElement().addClass(_this.prefixCss(SubtitleOverlay.CLASS_CEA_608));
                // We conditionally update the font size by this flag here to avoid updating every time a subtitle
                // is added into an empty overlay. Because we reset the overlay when all subtitles are gone, this
                // would trigger an unnecessary update every time, but it's only required under certain conditions,
                // e.g. after the player size has changed.
                if (fontSizeCalculationRequired) {
                    updateCEA608FontSize();
                    fontSizeCalculationRequired = false;
                }
            }
            label.getDomElement().css({
                'left': event.position.column * SubtitleOverlay.CEA608_COLUMN_OFFSET + "%",
                'top': event.position.row * SubtitleOverlay.CEA608_ROW_OFFSET + "%",
                'font-size': fontSize + "px",
                'letter-spacing': fontLetterSpacing + "px",
            });
        });
        var reset = function () {
            _this.getDomElement().removeClass(_this.prefixCss(SubtitleOverlay.CLASS_CEA_608));
            enabled = false;
        };
        player.on(player.exports.PlayerEvent.CueExit, function () {
            if (!_this.subtitleManager.hasCues) {
                // Disable CEA-608 mode when all subtitles are gone (to allow correct formatting and
                // display of other types of subtitles, e.g. the formatting preview subtitle)
                reset();
            }
        });
        player.on(player.exports.PlayerEvent.SourceUnloaded, reset);
        player.on(player.exports.PlayerEvent.SubtitleEnabled, reset);
        player.on(player.exports.PlayerEvent.SubtitleDisabled, reset);
    };
    SubtitleOverlay.prototype.enablePreviewSubtitleLabel = function () {
        if (!this.subtitleManager.hasCues) {
            this.previewSubtitleActive = true;
            this.subtitleContainerManager.addLabel(this.previewSubtitle);
            this.updateComponents();
            this.show();
        }
    };
    SubtitleOverlay.prototype.removePreviewSubtitleLabel = function () {
        if (this.previewSubtitleActive) {
            this.previewSubtitleActive = false;
            this.subtitleContainerManager.removeLabel(this.previewSubtitle);
            this.updateComponents();
        }
    };
    SubtitleOverlay.CLASS_CONTROLBAR_VISIBLE = 'controlbar-visible';
    SubtitleOverlay.CLASS_CEA_608 = 'cea608';
    // The number of rows in a cea608 grid
    SubtitleOverlay.CEA608_NUM_ROWS = 15;
    // The number of columns in a cea608 grid
    SubtitleOverlay.CEA608_NUM_COLUMNS = 32;
    // The offset in percent for one row (which is also the height of a row)
    SubtitleOverlay.CEA608_ROW_OFFSET = 100 / SubtitleOverlay.CEA608_NUM_ROWS;
    // The offset in percent for one column (which is also the width of a column)
    SubtitleOverlay.CEA608_COLUMN_OFFSET = 100 / SubtitleOverlay.CEA608_NUM_COLUMNS;
    return SubtitleOverlay;
}(container_1.Container));
exports.SubtitleOverlay = SubtitleOverlay;
var SubtitleLabel = /** @class */ (function (_super) {
    __extends(SubtitleLabel, _super);
    function SubtitleLabel(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-subtitle-label',
        }, _this.config);
        return _this;
    }
    Object.defineProperty(SubtitleLabel.prototype, "vtt", {
        get: function () {
            return this.config.vtt;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SubtitleLabel.prototype, "region", {
        get: function () {
            return this.config.region;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SubtitleLabel.prototype, "regionStyle", {
        get: function () {
            return this.config.regionStyle;
        },
        enumerable: false,
        configurable: true
    });
    return SubtitleLabel;
}(label_1.Label));
exports.SubtitleLabel = SubtitleLabel;
var ActiveSubtitleManager = /** @class */ (function () {
    function ActiveSubtitleManager() {
        this.activeSubtitleCueMap = {};
        this.activeSubtitleCueCount = 0;
    }
    /**
     * Calculates a unique ID for a subtitle cue, which is needed to associate an CueEnter with its CueExit
     * event so we can remove the correct subtitle in CueExit when multiple subtitles are active at the same time.
     * The start time plus the text should make a unique identifier, and in the only case where a collision
     * can happen, two similar texts will be displayed at a similar time and a similar position (or without position).
     * The start time should always be known, because it is required to schedule the CueEnter event. The end time
     * must not necessarily be known and therefore cannot be used for the ID.
     * @param event
     * @return {string}
     */
    ActiveSubtitleManager.calculateId = function (event) {
        var id = event.start + '-' + event.text;
        if (event.position) {
            id += '-' + event.position.row + '-' + event.position.column;
        }
        return id;
    };
    ActiveSubtitleManager.prototype.cueEnter = function (event, label) {
        this.addCueToMap(event, label);
    };
    ActiveSubtitleManager.prototype.cueUpdate = function (event, label) {
        var labelToReplace = this.popCueFromMap(event);
        if (labelToReplace) {
            this.addCueToMap(event, label);
            return labelToReplace;
        }
        return undefined;
    };
    ActiveSubtitleManager.prototype.addCueToMap = function (event, label) {
        var id = ActiveSubtitleManager.calculateId(event);
        // Create array for id if it does not exist
        this.activeSubtitleCueMap[id] = this.activeSubtitleCueMap[id] || [];
        // Add cue
        this.activeSubtitleCueMap[id].push({ event: event, label: label });
        this.activeSubtitleCueCount++;
    };
    ActiveSubtitleManager.prototype.popCueFromMap = function (event) {
        var id = ActiveSubtitleManager.calculateId(event);
        var activeSubtitleCues = this.activeSubtitleCueMap[id];
        if (activeSubtitleCues && activeSubtitleCues.length > 0) {
            // Remove cue
            /* We apply the FIFO approach here and remove the oldest cue from the associated id. When there are multiple cues
             * with the same id, there is no way to know which one of the cues is to be deleted, so we just hope that FIFO
             * works fine. Theoretically it can happen that two cues with colliding ids are removed at different times, in
             * the wrong order. This rare case has yet to be observed. If it ever gets an issue, we can take the unstable
             * cue end time (which can change between CueEnter and CueExit IN CueUpdate) and use it as an
             * additional hint to try and remove the correct one of the colliding cues.
             */
            var activeSubtitleCue = activeSubtitleCues.shift();
            this.activeSubtitleCueCount--;
            return activeSubtitleCue.label;
        }
    };
    ActiveSubtitleManager.generateImageTagText = function (imageData) {
        if (!imageData) {
            return;
        }
        var imgTag = new dom_1.DOM('img', {
            src: imageData,
        });
        imgTag.css('width', '100%');
        return imgTag.get(0).outerHTML; // return the html as string
    };
    /**
     * Returns the label associated with an already added cue.
     * @param event
     * @return {SubtitleLabel}
     */
    ActiveSubtitleManager.prototype.getCues = function (event) {
        var id = ActiveSubtitleManager.calculateId(event);
        var activeSubtitleCues = this.activeSubtitleCueMap[id];
        if (activeSubtitleCues && activeSubtitleCues.length > 0) {
            return activeSubtitleCues.map(function (cue) { return cue.label; });
        }
    };
    /**
     * Removes the subtitle cue from the manager and returns the label that should be removed from the subtitle overlay,
     * or null if there is no associated label existing (e.g. because all labels have been {@link #clear cleared}.
     * @param event
     * @return {SubtitleLabel|null}
     */
    ActiveSubtitleManager.prototype.cueExit = function (event) {
        return this.popCueFromMap(event);
    };
    Object.defineProperty(ActiveSubtitleManager.prototype, "cueCount", {
        /**
         * Returns the number of active subtitle cues.
         * @return {number}
         */
        get: function () {
            // We explicitly count the cues to save an Array.reduce on every cueCount call (which can happen frequently)
            return this.activeSubtitleCueCount;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ActiveSubtitleManager.prototype, "hasCues", {
        /**
         * Returns true if there are active subtitle cues, else false.
         * @return {boolean}
         */
        get: function () {
            return this.cueCount > 0;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Removes all subtitle cues from the manager.
     */
    ActiveSubtitleManager.prototype.clear = function () {
        this.activeSubtitleCueMap = {};
        this.activeSubtitleCueCount = 0;
    };
    return ActiveSubtitleManager;
}());
var SubtitleRegionContainerManager = /** @class */ (function () {
    /**
     * @param subtitleOverlay Reference to the subtitle overlay for adding and removing the containers.
     */
    function SubtitleRegionContainerManager(subtitleOverlay) {
        this.subtitleOverlay = subtitleOverlay;
        this.subtitleRegionContainers = {};
        this.subtitleOverlay = subtitleOverlay;
    }
    SubtitleRegionContainerManager.prototype.getRegion = function (label) {
        if (label.vtt) {
            return {
                regionContainerId: label.vtt.region && label.vtt.region.id ? label.vtt.region.id : 'vtt',
                regionName: 'vtt',
            };
        }
        return {
            regionContainerId: label.region || 'default',
            regionName: label.region || 'default',
        };
    };
    /**
     * Creates and wraps a subtitle label into a container div based on the subtitle region.
     * If the subtitle has positioning information it is added to the container.
     * @param label The subtitle label to wrap
     */
    SubtitleRegionContainerManager.prototype.addLabel = function (label, overlaySize) {
        var _a = this.getRegion(label), regionContainerId = _a.regionContainerId, regionName = _a.regionName;
        var cssClasses = ["subtitle-position-" + regionName];
        if (label.vtt && label.vtt.region) {
            cssClasses.push("vtt-region-" + label.vtt.region.id);
        }
        if (!this.subtitleRegionContainers[regionContainerId]) {
            var regionContainer = new SubtitleRegionContainer({
                cssClasses: cssClasses,
            });
            this.subtitleRegionContainers[regionContainerId] = regionContainer;
            if (label.regionStyle) {
                regionContainer.getDomElement().attr('style', label.regionStyle);
            }
            else if (label.vtt && !label.vtt.region) {
                /**
                 * If there is no region present to wrap the Cue Box, the Cue box becomes the
                 * region itself. Therefore the positioning values have to come from the box.
                 */
                regionContainer.getDomElement().css('position', 'static');
            }
            else {
                // getDomElement needs to be called at least once to ensure the component exists
                regionContainer.getDomElement();
            }
            for (var regionContainerId_1 in this.subtitleRegionContainers) {
                this.subtitleOverlay.addComponent(this.subtitleRegionContainers[regionContainerId_1]);
            }
        }
        this.subtitleRegionContainers[regionContainerId].addLabel(label, overlaySize);
    };
    SubtitleRegionContainerManager.prototype.replaceLabel = function (previousLabel, newLabel) {
        var regionContainerId = this.getRegion(previousLabel).regionContainerId;
        this.subtitleRegionContainers[regionContainerId].removeLabel(previousLabel);
        this.subtitleRegionContainers[regionContainerId].addLabel(newLabel);
    };
    /**
     * Removes a subtitle label from a container.
     */
    SubtitleRegionContainerManager.prototype.removeLabel = function (label) {
        var regionContainerId;
        if (label.vtt) {
            regionContainerId = label.vtt.region && label.vtt.region.id ? label.vtt.region.id : 'vtt';
        }
        else {
            regionContainerId = label.region || 'default';
        }
        this.subtitleRegionContainers[regionContainerId].removeLabel(label);
        // Remove container if no more labels are displayed
        if (this.subtitleRegionContainers[regionContainerId].isEmpty()) {
            this.subtitleOverlay.removeComponent(this.subtitleRegionContainers[regionContainerId]);
            delete this.subtitleRegionContainers[regionContainerId];
        }
    };
    /**
     * Removes all subtitle containers.
     */
    SubtitleRegionContainerManager.prototype.clear = function () {
        for (var regionName in this.subtitleRegionContainers) {
            this.subtitleOverlay.removeComponent(this.subtitleRegionContainers[regionName]);
        }
        this.subtitleRegionContainers = {};
    };
    return SubtitleRegionContainerManager;
}());
exports.SubtitleRegionContainerManager = SubtitleRegionContainerManager;
var SubtitleRegionContainer = /** @class */ (function (_super) {
    __extends(SubtitleRegionContainer, _super);
    function SubtitleRegionContainer(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.labelCount = 0;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'subtitle-region-container',
        }, _this.config);
        return _this;
    }
    SubtitleRegionContainer.prototype.addLabel = function (labelToAdd, overlaySize) {
        this.labelCount++;
        if (labelToAdd.vtt) {
            if (labelToAdd.vtt.region && overlaySize) {
                vttutils_1.VttUtils.setVttRegionStyles(this, labelToAdd.vtt.region, overlaySize);
            }
            vttutils_1.VttUtils.setVttCueBoxStyles(labelToAdd, overlaySize);
        }
        this.addComponent(labelToAdd);
        this.updateComponents();
    };
    SubtitleRegionContainer.prototype.removeLabel = function (labelToRemove) {
        this.labelCount--;
        this.removeComponent(labelToRemove);
        this.updateComponents();
    };
    SubtitleRegionContainer.prototype.isEmpty = function () {
        return this.labelCount === 0;
    };
    return SubtitleRegionContainer;
}(container_1.Container));
exports.SubtitleRegionContainer = SubtitleRegionContainer;
