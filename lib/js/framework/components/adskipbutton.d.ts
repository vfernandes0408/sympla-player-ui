import { ButtonConfig, Button } from './button';
import { UIInstanceManager } from '../uimanager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * Configuration interface for the {@link AdSkipButton}.
 */
export interface AdSkipButtonConfig extends ButtonConfig {
    /**
     * Message which gets displayed during the countdown is active.
     * Supported placeholders: look at {@link StringUtils.replaceAdMessagePlaceholders}
     */
    untilSkippableMessage?: string;
    /**
     * Message displayed when the ad is skippable.
     * Supported placeholders: look at {@link StringUtils.replaceAdMessagePlaceholders}
     */
    skippableMessage?: string;
}
/**
 * A button that is displayed during ads and can be used to skip the ad.
 */
export declare class AdSkipButton extends Button<AdSkipButtonConfig> {
    constructor(config?: AdSkipButtonConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
