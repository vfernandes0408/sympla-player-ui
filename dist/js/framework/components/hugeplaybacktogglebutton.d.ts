import { ToggleButtonConfig } from './togglebutton';
import { PlaybackToggleButton } from './playbacktogglebutton';
import { DOM } from '../dom';
import { UIInstanceManager } from '../uimanager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * A button that overlays the video and toggles between playback and pause.
 */
export declare class HugePlaybackToggleButton extends PlaybackToggleButton {
    constructor(config?: ToggleButtonConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    protected toDomElement(): DOM;
    /**
     * Enables or disables the play state transition animations of the play button image. Can be used to suppress
     * animations.
     * @param {boolean} enabled true to enable the animations (default), false to disable them
     */
    protected setTransitionAnimationsEnabled(enabled: boolean): void;
}
