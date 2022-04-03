import { SubtitleRegionContainer, SubtitleLabel } from './components/subtitleoverlay';
import { VTTRegionProperties } from 'bitmovin-player/types/subtitles/vtt/API';
import { Size } from './dom';
export declare namespace VttUtils {
    const setVttCueBoxStyles: (cueContainer: SubtitleLabel, subtitleOverlaySize: Size) => void;
    /** https://www.w3.org/TR/webvtt1/#regions
     *  https://www.speechpad.com/captions/webvtt#toc_16
     */
    const setVttRegionStyles: (regionContainer: SubtitleRegionContainer, region: VTTRegionProperties, overlaySize: Size) => void;
}
