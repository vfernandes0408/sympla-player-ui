import { LabelConfig } from '../label';
import { Container, ContainerConfig } from '../container';
import { DOM } from '../../dom';
import { SettingsPanelPageOpenButton } from '../settingspanelpageopenbutton';
export interface SubtitleSettingsLabelConfig extends LabelConfig {
    opener: SettingsPanelPageOpenButton;
}
export declare class SubtitleSettingsLabel extends Container<ContainerConfig> {
    private opener;
    private text;
    private for;
    constructor(config: SubtitleSettingsLabelConfig);
    protected toDomElement(): DOM;
}
