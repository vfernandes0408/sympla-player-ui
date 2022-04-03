import { UIInstanceManager } from '../uimanager';
import { SettingsPanelPageNavigatorButton, SettingsPanelPageNavigatorConfig } from './settingspanelpagenavigatorbutton';
import { PlayerAPI } from 'bitmovin-player';
export declare class SettingsPanelPageOpenButton extends SettingsPanelPageNavigatorButton {
    constructor(config: SettingsPanelPageNavigatorConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
