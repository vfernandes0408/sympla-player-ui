import { SettingsPanelPage } from '../settingspanelpage';
import { SettingsPanel } from '../settingspanel';
import { SubtitleOverlay } from '../subtitleoverlay';
import { ContainerConfig } from '../container';
import { UIInstanceManager } from '../../uimanager';
import { PlayerAPI } from 'bitmovin-player';
export interface SubtitleSettingsPanelPageConfig extends ContainerConfig {
    settingsPanel: SettingsPanel;
    overlay: SubtitleOverlay;
}
export declare class SubtitleSettingsPanelPage extends SettingsPanelPage {
    private readonly overlay;
    private readonly settingsPanel;
    constructor(config: SubtitleSettingsPanelPageConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
