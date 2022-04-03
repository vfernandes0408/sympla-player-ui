import { SelectBox } from './selectbox';
import { ListSelectorConfig } from './listselector';
import { UIInstanceManager } from '../uimanager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * A select box providing a selection between available subtitle and caption tracks.
 */
export declare class SubtitleSelectBox extends SelectBox {
    constructor(config?: ListSelectorConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
