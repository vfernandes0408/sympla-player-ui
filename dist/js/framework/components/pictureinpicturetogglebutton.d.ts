import { ToggleButton, ToggleButtonConfig } from './togglebutton';
import { UIInstanceManager } from '../uimanager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * A button that toggles Apple macOS picture-in-picture mode.
 */
export declare class PictureInPictureToggleButton extends ToggleButton<ToggleButtonConfig> {
    constructor(config?: ToggleButtonConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
