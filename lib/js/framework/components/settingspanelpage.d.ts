import { Container, ContainerConfig } from './container';
import { SettingsPanelItem } from './settingspanelitem';
import { UIInstanceManager } from '../uimanager';
import { Event, NoArgs } from '../eventdispatcher';
import { PlayerAPI } from 'bitmovin-player';
/**
 * A panel containing a list of {@link SettingsPanelItem items} that represent labelled settings.
 */
export declare class SettingsPanelPage extends Container<ContainerConfig> {
    private static readonly CLASS_LAST;
    private settingsPanelPageEvents;
    constructor(config: ContainerConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    hasActiveSettings(): boolean;
    getItems(): SettingsPanelItem[];
    onSettingsStateChangedEvent(): void;
    get onSettingsStateChanged(): Event<SettingsPanelPage, NoArgs>;
    onActiveEvent(): void;
    get onActive(): Event<SettingsPanelPage, NoArgs>;
    onInactiveEvent(): void;
    get onInactive(): Event<SettingsPanelPage, NoArgs>;
}
