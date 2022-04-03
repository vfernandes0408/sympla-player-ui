import { UIInstanceManager } from '../../uimanager';
import { SubtitleSettingsManager } from './subtitlesettingsmanager';
import { Button, ButtonConfig } from '../button';
import { PlayerAPI } from 'bitmovin-player';
export interface SubtitleSettingsResetButtonConfig extends ButtonConfig {
    settingsManager: SubtitleSettingsManager;
}
/**
 * A button that resets all subtitle settings to their defaults.
 */
export declare class SubtitleSettingsResetButton extends Button<ButtonConfig> {
    constructor(config: SubtitleSettingsResetButtonConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
