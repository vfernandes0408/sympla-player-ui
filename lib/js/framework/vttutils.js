"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VttUtils = void 0;
// Our default height of a line
var lineHeight = 28;
var defaultLineNumber = 21; // Our default amount of lines
var Direction;
(function (Direction) {
    Direction["Top"] = "top";
    Direction["Bottom"] = "bottom";
    Direction["Left"] = "left";
    Direction["Right"] = "right";
})(Direction || (Direction = {}));
var DirectionPair = new Map([
    [Direction.Top, Direction.Bottom],
    [Direction.Left, Direction.Right],
    [Direction.Right, Direction.Left],
]);
/**
 * Sets the default standardized styles for the Cue Box
 * https://w3.org/TR/webvtt1/#applying-css-properties
 */
var setDefaultVttStyles = function (cueContainerDom, vtt) {
    if (vtt.region) {
        cueContainerDom.css('position', 'relative');
        cueContainerDom.css('unicode-bidi', 'plaintext');
    }
    else {
        cueContainerDom.css('position', 'absolute');
        cueContainerDom.css('overflow-wrap', 'break-word');
        cueContainerDom.css('overflow', 'hidden');
        cueContainerDom.css('flex-flow', 'column');
    }
    cueContainerDom.css('display', 'inline-flex');
};
/**
 * Align the Cue Box's line
 * https://w3.org/TR/webvtt1/#webvtt-cue-line-alignment
 */
var setVttLineAlign = function (cueContainerDom, _a, direction) {
    var lineAlign = _a.lineAlign;
    switch (lineAlign) {
        case 'center':
            cueContainerDom.css("margin-" + direction, -lineHeight / 2 + "px");
            break;
        case 'end':
            cueContainerDom.css("margin-" + direction, -lineHeight + "px");
    }
};
/**
 * Defines the line positioning of the Cue Box
 * https://w3.org/TR/webvtt1/#webvtt-cue-line
 */
var setVttLine = function (cueContainerDom, vtt, direction, subtitleOverLaySize) {
    if (vtt.line === 'auto') {
        return;
    }
    var relativeLinePosition = parseFloat(vtt.line);
    if (vtt.snapToLines) {
        var targetLine = Number(vtt.line);
        if (targetLine < 0) {
            targetLine = defaultLineNumber + targetLine;
        }
        var lineHeight_1 = subtitleOverLaySize.height / defaultLineNumber;
        var absoluteLinePosition = lineHeight_1 * targetLine;
        relativeLinePosition = (100 * absoluteLinePosition) / subtitleOverLaySize.height;
    }
    cueContainerDom.css(direction, relativeLinePosition + "%");
    setVttLineAlign(cueContainerDom, vtt, direction);
};
/**
 * Defines the writing direction of the Cue Box
 * https://w3.org/TR/webvtt1/#webvtt-cue-writing-direction
 */
var setVttWritingDirection = function (cueContainerDom, vtt, subtitleOverlaySize) {
    if (vtt.vertical === '') {
        cueContainerDom.css('writing-mode', 'horizontal-tb');
        cueContainerDom.css(Direction.Bottom, '0');
        setVttLine(cueContainerDom, vtt, Direction.Top, subtitleOverlaySize);
    }
    else if (vtt.vertical === 'lr') {
        cueContainerDom.css('writing-mode', 'vertical-lr');
        cueContainerDom.css(Direction.Right, '0');
        cueContainerDom.css(Direction.Top, '0');
        setVttLine(cueContainerDom, vtt, Direction.Right, subtitleOverlaySize);
    }
    else if (vtt.vertical === 'rl') {
        cueContainerDom.css('writing-mode', 'vertical-rl');
        cueContainerDom.css(Direction.Left, '0');
        cueContainerDom.css(Direction.Top, '0');
        setVttLine(cueContainerDom, vtt, Direction.Left, subtitleOverlaySize);
    }
};
/**
 * Defines the Cue position alignment
 * https://w3.org/TR/webvtt1/#webvtt-cue-position-alignment
 */
var setVttPositionAlign = function (cueContainerDom, vtt, direction) {
    // https://www.w3.org/TR/webvtt1/#webvtt-cue-position
    if (vtt.position === 'auto') {
        cueContainerDom.css(direction, '0');
    }
    else {
        switch (vtt.positionAlign) {
            case 'line-left':
                cueContainerDom.css(direction, vtt.position + "%");
                cueContainerDom.css(DirectionPair.get(direction), 'auto');
                cueContainerDom.css('justify-content', 'flex-start');
                break;
            case 'center':
                cueContainerDom.css(direction, vtt.position - vtt.size / 2 + "%");
                cueContainerDom.css(DirectionPair.get(direction), 'auto');
                cueContainerDom.css('justify-content', 'center');
                break;
            case 'line-right':
                cueContainerDom.css(direction, 'auto');
                cueContainerDom.css(DirectionPair.get(direction), 100 - vtt.position + "%");
                cueContainerDom.css('justify-content', 'flex-end');
                break;
            default:
                cueContainerDom.css(direction, vtt.position + "%");
                cueContainerDom.css('justify-content', 'flex-start');
        }
    }
};
var VttUtils;
(function (VttUtils) {
    VttUtils.setVttCueBoxStyles = function (cueContainer, subtitleOverlaySize) {
        var vtt = cueContainer.vtt;
        var cueContainerDom = cueContainer.getDomElement();
        setDefaultVttStyles(cueContainerDom, vtt);
        setVttWritingDirection(cueContainerDom, vtt, subtitleOverlaySize);
        // https://w3.org/TR/webvtt1/#webvtt-cue-text-alignment
        var textAlign = vtt.align === 'middle' ? 'center' : vtt.align;
        cueContainerDom.css('text-align', textAlign);
        // https://w3.org/TR/webvtt1/#webvtt-cue-size
        var containerSize = vtt.size;
        if (vtt.vertical === '') {
            cueContainerDom.css('width', containerSize + "%");
            setVttPositionAlign(cueContainerDom, vtt, Direction.Left);
        }
        else {
            cueContainerDom.css('height', containerSize + "%");
            setVttPositionAlign(cueContainerDom, vtt, Direction.Top);
        }
    };
    /** https://www.w3.org/TR/webvtt1/#regions
     *  https://www.speechpad.com/captions/webvtt#toc_16
     */
    VttUtils.setVttRegionStyles = function (regionContainer, region, overlaySize) {
        var regionContainerDom = regionContainer.getDomElement();
        var regionPositionX = overlaySize.width * region.viewportAnchorX / 100 - ((overlaySize.width * region.width / 100) * region.regionAnchorX / 100);
        var regionPositionY = overlaySize.height * region.viewportAnchorY / 100 - ((region.lines * lineHeight) * region.regionAnchorY / 100);
        regionContainerDom.css('position', 'absolute');
        regionContainerDom.css('overflow', 'hidden');
        regionContainerDom.css('width', region.width + "%");
        regionContainerDom.css(Direction.Left, regionPositionX + "px");
        regionContainerDom.css(Direction.Right, 'unset');
        regionContainerDom.css(Direction.Top, regionPositionY + "px");
        regionContainerDom.css(Direction.Bottom, 'unset');
        regionContainerDom.css('height', region.lines * lineHeight + "px");
    };
})(VttUtils = exports.VttUtils || (exports.VttUtils = {}));
