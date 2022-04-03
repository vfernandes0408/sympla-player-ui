import { ButtonConfig, Button } from './button';
import { DOM } from '../dom';
import { UIInstanceManager } from '../uimanager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * A button to play/replay a video.
 */
export declare class HugeReplayButton extends Button<ButtonConfig> {
    constructor(config?: ButtonConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    protected toDomElement(): DOM;
}
