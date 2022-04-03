import { ContainerConfig, Container } from './container';
import { UIInstanceManager } from '../uimanager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * Overlays the player and displays the status of a Cast session.
 */
export declare class CastStatusOverlay extends Container<ContainerConfig> {
    private statusLabel;
    constructor(config?: ContainerConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
