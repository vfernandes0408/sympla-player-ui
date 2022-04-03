import { SelectBox } from './selectbox';
import { ListSelectorConfig } from './listselector';
import { UIInstanceManager } from '../uimanager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * A select box providing a selection of different playback speeds.
 */
export declare class PlaybackSpeedSelectBox extends SelectBox {
    protected defaultPlaybackSpeeds: number[];
    constructor(config?: ListSelectorConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    setSpeed(speed: number): void;
    addDefaultItems(customItems?: number[]): void;
    clearItems(): void;
}
