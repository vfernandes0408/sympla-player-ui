import { ContainerConfig, Container } from './container';
import { UIInstanceManager } from '../uimanager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * Overlays the player and displays recommended videos.
 */
export declare class RecommendationOverlay extends Container<ContainerConfig> {
    private replayButton;
    constructor(config?: ContainerConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
