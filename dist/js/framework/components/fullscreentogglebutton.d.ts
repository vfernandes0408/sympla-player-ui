import { ToggleButton, ToggleButtonConfig } from './togglebutton';
import { UIInstanceManager } from '../uimanager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * A button that toggles the player between windowed and fullscreen view.
 */
export declare class FullscreenToggleButton extends ToggleButton<ToggleButtonConfig> {
    constructor(config?: ToggleButtonConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
