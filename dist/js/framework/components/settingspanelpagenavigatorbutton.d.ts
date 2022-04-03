import { Button, ButtonConfig } from './button';
import { SettingsPanel } from './settingspanel';
import { SettingsPanelPage } from './settingspanelpage';
/**
 * Configuration interface for a {@link SettingsPanelPageNavigatorButton}
 */
export interface SettingsPanelPageNavigatorConfig extends ButtonConfig {
    /**
     * Container `SettingsPanel` where the navigation takes place
     */
    container: SettingsPanel;
    /**
     * Page where the button should navigate to
     * If empty it will navigate to the root page (not intended to use as navigate back behavior)
     */
    targetPage?: SettingsPanelPage;
    /**
     * WCAG20 standard: Establishes relationships between objects and their label(s)
     */
    ariaLabelledBy?: string;
}
/**
 * Can be used to navigate between SettingsPanelPages
 *
 * Example:
 *  let settingPanelNavigationButton = new SettingsPanelPageNavigatorButton({
 *    container: settingsPanel,
 *    targetPage: settingsPanelPage,
 *  });
 *
 *  settingsPanelPage.addComponent(settingPanelNavigationButton);
 *
 * Don't forget to add the settingPanelNavigationButton to the settingsPanelPage.
 */
export declare class SettingsPanelPageNavigatorButton extends Button<SettingsPanelPageNavigatorConfig> {
    private readonly container;
    private readonly targetPage?;
    constructor(config: SettingsPanelPageNavigatorConfig);
    /**
     * navigate one level back
     */
    popPage(): void;
    /**
     * navigate to the target page
     */
    pushTargetPage(): void;
}
