import { UIContainer, UIContainerConfig } from './uicontainer';
import { UIInstanceManager } from '../uimanager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * The base container for Cast receivers that contains all of the UI and takes care that the UI is shown on
 * certain playback events.
 */
export declare class CastUIContainer extends UIContainer {
    private castUiHideTimeout;
    constructor(config: UIContainerConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    release(): void;
}
