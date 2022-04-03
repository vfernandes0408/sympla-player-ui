import { ClickOverlay } from './clickoverlay';
import { UIInstanceManager } from '../uimanager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * A simple click capture overlay for clickThroughUrls of ads.
 */
export declare class AdClickOverlay extends ClickOverlay {
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
