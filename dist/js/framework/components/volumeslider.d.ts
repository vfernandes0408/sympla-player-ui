import { SeekBar, SeekBarConfig } from './seekbar';
import { UIInstanceManager } from '../uimanager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * Configuration interface for the {@link VolumeSlider} component.
 */
export interface VolumeSliderConfig extends SeekBarConfig {
    /**
     * Specifies if the volume slider should be automatically hidden when volume control is prohibited by the
     * browser or platform. This currently only applies to iOS.
     * Default: true
     */
    hideIfVolumeControlProhibited?: boolean;
}
/**
 * A simple volume slider component to adjust the player's volume setting.
 */
export declare class VolumeSlider extends SeekBar {
    private volumeTransition;
    constructor(config?: VolumeSliderConfig);
    private setVolumeAriaSliderValues;
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    private updateVolumeWhileScrubbing;
    private detectVolumeControlAvailability;
    release(): void;
}
