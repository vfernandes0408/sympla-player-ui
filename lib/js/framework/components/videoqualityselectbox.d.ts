import { SelectBox } from './selectbox';
import { ListSelectorConfig } from './listselector';
import { UIInstanceManager } from '../uimanager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * A select box providing a selection between 'auto' and the available video qualities.
 */
export declare class VideoQualitySelectBox extends SelectBox {
    private hasAuto;
    constructor(config?: ListSelectorConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    /**
     * Returns true if the select box contains an 'auto' item for automatic quality selection mode.
     * @return {boolean}
     */
    hasAutoItem(): boolean;
}
