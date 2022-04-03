import { Container, ContainerConfig } from './container';
import { UIInstanceManager } from '../uimanager';
import { Event, NoArgs } from '../eventdispatcher';
import { SettingsPanelPage } from './settingspanelpage';
import { PlayerAPI } from 'bitmovin-player';
import { Component, ComponentConfig } from './component';
/**
 * Configuration interface for a {@link SettingsPanel}.
 */
export interface SettingsPanelConfig extends ContainerConfig {
    /**
     * The delay in milliseconds after which the settings panel will be hidden when there is no user interaction.
     * Set to -1 to disable automatic hiding.
     * Default: 3 seconds (3000)
     */
    hideDelay?: number;
    /**
     * Flag to specify if there should be an animation when switching SettingsPanelPages.
     * Default: true
     */
    pageTransitionAnimation?: boolean;
}
/**
 * A panel containing a list of {@link SettingsPanelPage items}.
 *
 * To configure pages just pass them in the components array.
 *
 * Example:
 *  let settingsPanel = new SettingsPanel({
 *    hidden: true,
 *  });
 *
 *  let settingsPanelPage = new SettingsPanelPage({
 *    components: […]
 *  });
 *
 *  let secondSettingsPanelPage = new SettingsPanelPage({
 *    components: […]
 *  });
 *
 *  settingsPanel.addComponent(settingsPanelPage);
 *  settingsPanel.addComponent(secondSettingsPanelPage);
 *
 * For an example how to navigate between pages @see SettingsPanelPageNavigatorButton
 */
export declare class SettingsPanel extends Container<SettingsPanelConfig> {
    private static readonly CLASS_ACTIVE_PAGE;
    private activePage;
    private navigationStack;
    private settingsPanelEvents;
    private hideTimeout;
    constructor(config: SettingsPanelConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    /**
     * Returns the current active / visible page
     * @return {SettingsPanelPage}
     */
    getActivePage(): SettingsPanelPage;
    /**
     * Sets the
     * @deprecated Use {@link setActivePage} instead
     * @param index
     */
    setActivePageIndex(index: number): void;
    /**
     * Adds the passed page to the navigation stack and makes it visible.
     * Use {@link popSettingsPanelPage} to navigate backwards.
     *
     * Results in no-op if the target page is the current page.
     * @params page
     */
    setActivePage(targetPage: SettingsPanelPage): void;
    /**
     * Resets the navigation stack by navigating back to the root page and displaying it.
     */
    popToRootSettingsPanelPage(): void;
    /**
     * Removes the current page from the navigation stack and makes the previous one visible.
     * Results in a no-op if we are already on the root page.
     */
    popSettingsPanelPage(): void;
    /**
     * Checks if there are active settings within the root page of the settings panel.
     * An active setting is a setting that is visible and enabled, which the user can interact with.
     * @returns {boolean} true if there are active settings, false if the panel is functionally empty to a user
     */
    rootPageHasActiveSettings(): boolean;
    /**
     * Return all configured pages
     * @returns {SettingsPanelPage[]}
     */
    getPages(): SettingsPanelPage[];
    get onSettingsStateChanged(): Event<SettingsPanel, NoArgs>;
    release(): void;
    addComponent(component: Component<ComponentConfig>): void;
    private updateActivePageClass;
    private resetNavigation;
    private navigateToPage;
    /**
     * @param targetPage
     * @param sourcePage
     * @param skipAnimation This is just an internal flag if we want to have an animation. It is set true when we reset
     * the navigation within the onShow callback of the settingsPanel. In this case we don't want an actual animation but
     * the recalculation of the dimension of the settingsPanel.
     * This is independent of the pageTransitionAnimation flag.
     */
    private animateNavigation;
    private forceBrowserReflow;
    /**
     * Hack for IE + Firefox
     * when the settings panel fades out while an item of a select box is still hovered, the select box will not fade out
     * while the settings panel does. This would leave a floating select box, which is just weird
     */
    private hideHoveredSelectBoxes;
    private getComputedItems;
    private getRootPage;
    protected onSettingsStateChangedEvent(): void;
}
