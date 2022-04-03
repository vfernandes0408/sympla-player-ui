import { Label, LabelConfig } from './label';
import { UIInstanceManager } from '../uimanager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * A label that displays a message about a running ad, optionally with a countdown.
 */
export declare class AdMessageLabel extends Label<LabelConfig> {
    constructor(config?: LabelConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
