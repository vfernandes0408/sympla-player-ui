import { SubtitleRegionContainer, SubtitleLabel } from './components/subtitleoverlay';
import { VTTProperties, VTTRegionProperties } from 'bitmovin-player/types/subtitles/vtt/API';
import { DOM, Size } from './dom';

// Our default height of a line
const lineHeight = 28;
const defaultLineNumber = 21; // Our default amount of lines

enum Direction {
  Top = 'top',
  Bottom = 'bottom',
  Left = 'left',
  Right = 'right',
}

const DirectionPair = new Map<Direction, Direction>([
  [Direction.Top, Direction.Bottom],
  [Direction.Left, Direction.Right],
  [Direction.Right, Direction.Left],
]);

/**
 * Sets the default standardized styles for the Cue Box
 * https://w3.org/TR/webvtt1/#applying-css-properties
 */
const setDefaultVttStyles = (cueContainerDom: DOM, vtt: VTTProperties) => {
  if (vtt.region) {
    cueContainerDom.css('position', 'relative');
    cueContainerDom.css('unicode-bidi', 'plaintext');
  } else {
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
const setVttLineAlign = (cueContainerDom: DOM, { lineAlign }: VTTProperties, direction: Direction) => {
  switch (lineAlign) {
    case 'center':
      cueContainerDom.css(`margin-${direction}`, `${-lineHeight / 2}px`);
      break;
    case 'end':
      cueContainerDom.css(`margin-${direction}`, `${-lineHeight}px`);
  }
};

/**
 * Defines the line positioning of the Cue Box
 * https://w3.org/TR/webvtt1/#webvtt-cue-line
 */
const setVttLine = (
  cueContainerDom: DOM,
  vtt: VTTProperties,
  direction: Direction,
  subtitleOverLaySize: Size,
) => {
  if (vtt.line === 'auto') {
    return;
  }

  let relativeLinePosition = parseFloat(vtt.line as string);

  if (vtt.snapToLines) {
    let targetLine = Number(vtt.line);
    if (targetLine < 0) {
      targetLine = defaultLineNumber + targetLine;
    }

    const lineHeight = subtitleOverLaySize.height / defaultLineNumber;
    const absoluteLinePosition = lineHeight * targetLine;
    relativeLinePosition = (100 * absoluteLinePosition) / subtitleOverLaySize.height;
  }

  cueContainerDom.css(direction, `${relativeLinePosition}%`);
  setVttLineAlign(cueContainerDom, vtt, direction);
};

/**
 * Defines the writing direction of the Cue Box
 * https://w3.org/TR/webvtt1/#webvtt-cue-writing-direction
 */
const setVttWritingDirection = (
  cueContainerDom: DOM, vtt: VTTProperties,
  subtitleOverlaySize: Size,
) => {
  if (vtt.vertical === '') {
    cueContainerDom.css('writing-mode', 'horizontal-tb');
    cueContainerDom.css(Direction.Bottom, '0');
    setVttLine(cueContainerDom, vtt, Direction.Top, subtitleOverlaySize);
  } else if (vtt.vertical === 'lr') {
    cueContainerDom.css('writing-mode', 'vertical-lr');
    cueContainerDom.css(Direction.Right, '0');
    cueContainerDom.css(Direction.Top, '0');
    setVttLine(cueContainerDom, vtt, Direction.Right, subtitleOverlaySize);
  } else if (vtt.vertical === 'rl') {
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
const setVttPositionAlign = (cueContainerDom: DOM, vtt: VTTProperties, direction: Direction) => {
  // https://www.w3.org/TR/webvtt1/#webvtt-cue-position
  if (vtt.position === 'auto') {
    cueContainerDom.css(direction, '0');
  } else {
    switch (vtt.positionAlign) {
      case 'line-left':
        cueContainerDom.css(direction, `${vtt.position}%`);
        cueContainerDom.css(DirectionPair.get(direction), 'auto');
        cueContainerDom.css('justify-content', 'flex-start');
        break;
      case 'center':
        cueContainerDom.css(direction, `${vtt.position - vtt.size / 2}%`);
        cueContainerDom.css(DirectionPair.get(direction), 'auto');
        cueContainerDom.css('justify-content', 'center');
        break;
      case 'line-right':
        cueContainerDom.css(direction, 'auto');
        cueContainerDom.css(DirectionPair.get(direction), `${100 - vtt.position}%`);
        cueContainerDom.css('justify-content', 'flex-end');
        break;
      default:
        cueContainerDom.css(direction, `${vtt.position}%`);
        cueContainerDom.css('justify-content', 'flex-start');
    }
  }
};

export namespace VttUtils {
  export const setVttCueBoxStyles = (
    cueContainer: SubtitleLabel,
    subtitleOverlaySize: Size,
  ) => {
    const vtt = cueContainer.vtt;
    const cueContainerDom = cueContainer.getDomElement();

    setDefaultVttStyles(cueContainerDom, vtt);
    setVttWritingDirection(cueContainerDom, vtt, subtitleOverlaySize);

    // https://w3.org/TR/webvtt1/#webvtt-cue-text-alignment
    const textAlign = vtt.align === 'middle' ? 'center' : vtt.align;
    cueContainerDom.css('text-align', textAlign);

    // https://w3.org/TR/webvtt1/#webvtt-cue-size
    const containerSize = vtt.size;
    if (vtt.vertical === '') {
      cueContainerDom.css('width', `${containerSize}%`);
      setVttPositionAlign(cueContainerDom, vtt, Direction.Left);
    } else {
      cueContainerDom.css('height', `${containerSize}%`);
      setVttPositionAlign(cueContainerDom, vtt, Direction.Top);
    }
  };

  /** https://www.w3.org/TR/webvtt1/#regions
   *  https://www.speechpad.com/captions/webvtt#toc_16
   */
  export const setVttRegionStyles = (
    regionContainer: SubtitleRegionContainer,
    region: VTTRegionProperties,
    overlaySize: Size,
  ) => {
    const regionContainerDom = regionContainer.getDomElement();
    const regionPositionX = overlaySize.width * region.viewportAnchorX / 100 - ((overlaySize.width * region.width / 100) * region.regionAnchorX / 100);
    const regionPositionY = overlaySize.height * region.viewportAnchorY / 100 - ((region.lines * lineHeight) * region.regionAnchorY / 100);
    regionContainerDom.css('position', 'absolute');
    regionContainerDom.css('overflow', 'hidden');
    regionContainerDom.css('width', `${region.width}%`);
    regionContainerDom.css(Direction.Left, `${regionPositionX}px`);
    regionContainerDom.css(Direction.Right, 'unset');
    regionContainerDom.css(Direction.Top, `${regionPositionY}px`);
    regionContainerDom.css(Direction.Bottom, 'unset');
    regionContainerDom.css('height', `${region.lines * lineHeight}px`);
  };
}
