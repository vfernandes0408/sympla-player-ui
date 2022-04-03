import { Container, ContainerConfig } from './container';
import { Component, ComponentConfig } from './component';
import { Event, NoArgs } from '../eventdispatcher';
import { UIInstanceManager } from '../uimanager';
import { PlayerAPI } from 'bitmovin-player';
import { LocalizableText } from '../localization/i18n';
/**
 * An item for a {@link SettingsPanelPage},
 * Containing an optional {@link Label} and a component that configures a setting.
 * If the components is a {@link SelectBox} it will handle the logic of displaying it or not
 */
export declare class SettingsPanelItem extends Container<ContainerConfig> {
    private label;
    private setting;
    private settingsPanelItemEvents;
    constructor(label: LocalizableText | Component<ComponentConfig>, setting: Component<ComponentConfig>, config?: ContainerConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    /**
     * Checks if this settings panel item is active, i.e. visible and enabled and a user can interact with it.
     * @returns {boolean} true if the panel is active, else false
     */
    isActive(): boolean;
    protected onActiveChangedEvent(): void;
    /**
     * Gets the event that is fired when the 'active' state of this item changes.
     * @see #isActive
     * @returns {Event<SettingsPanelItem, NoArgs>}
     */
    get onActiveChanged(): Event<SettingsPanelItem, NoArgs>;
}
