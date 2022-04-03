import { ToggleButton, ToggleButtonConfig } from './togglebutton';
import { UIInstanceManager } from '../uimanager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * A button that toggles between playback and pause.
 */
export declare class PlaybackToggleButton extends ToggleButton<ToggleButtonConfig> {
    private static readonly CLASS_STOPTOGGLE;
    protected isPlayInitiated: boolean;
    constructor(config?: ToggleButtonConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager, handleClickEvent?: boolean): void;
}
