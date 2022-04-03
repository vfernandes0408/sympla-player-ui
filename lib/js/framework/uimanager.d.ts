import { UIContainer } from './components/uicontainer';
import { Component, ComponentConfig } from './components/component';
import { SeekBar, SeekBarMarker } from './components/seekbar';
import { NoArgs, EventDispatcher, CancelEventArgs } from './eventdispatcher';
import { TimelineMarker, UIConfig } from './uiconfig';
import { PlayerAPI, PlayerEvent } from 'bitmovin-player';
import { VolumeController } from './volumecontroller';
import { CustomVocabulary, Vocabularies } from './localization/i18n';
export interface LocalizationConfig {
    /**
     * Sets the desired language, and falls back to 'en' if there is no vocabulary for the desired language. Setting it
     * to "auto" will enable language detection from the browser's locale.
     */
    language?: 'auto' | 'en' | 'de' | string;
    /**
     * A map of `language` to {@link CustomVocabulary} definitions. Can be used to overwrite default translations and add
     * custom strings or additional languages.
     */
    vocabularies?: Vocabularies;
}
export interface InternalUIConfig extends UIConfig {
    events: {
        /**
         * Fires when the configuration has been updated/changed.
         */
        onUpdated: EventDispatcher<UIManager, void>;
    };
    volumeController: VolumeController;
}
/**
 * The context that will be passed to a {@link UIConditionResolver} to determine if it's conditions fulfil the context.
 */
export interface UIConditionContext {
    /**
     * Tells if the player is loading or playing an ad.
     */
    isAd: boolean;
    /**
     * Tells if the current ad requires an external UI, if {@link #isAd} is true.
     */
    adRequiresUi: boolean;
    /**
     * Tells if the player is currently in fullscreen mode.
     */
    isFullscreen: boolean;
    /**
     * Tells if the UI is running in a mobile browser.
     */
    isMobile: boolean;
    /**
     * Tells if the player is in playing or paused state.
     */
    isPlaying: boolean;
    /**
     * The width of the player/UI element.
     */
    width: number;
    /**
     * The width of the document where the player/UI is embedded in.
     */
    documentWidth: number;
}
/**
 * Resolves the conditions of its associated UI in a {@link UIVariant} upon a {@link UIConditionContext} and decides
 * if the UI should be displayed. If it returns true, the UI is a candidate for display; if it returns false, it will
 * not be displayed in the given context.
 */
export interface UIConditionResolver {
    (context: UIConditionContext): boolean;
}
/**
 * Associates a UI instance with an optional {@link UIConditionResolver} that determines if the UI should be displayed.
 */
export interface UIVariant {
    ui: UIContainer;
    condition?: UIConditionResolver;
}
export declare class UIManager {
    private player;
    private uiContainerElement;
    private uiVariants;
    private uiInstanceManagers;
    private currentUi;
    private config;
    private managerPlayerWrapper;
    private focusVisibilityTracker;
    private events;
    /**
     * Creates a UI manager with a single UI variant that will be permanently shown.
     * @param player the associated player of this UI
     * @param ui the UI to add to the player
     * @param uiconfig optional UI configuration
     */
    constructor(player: PlayerAPI, ui: UIContainer, uiconfig?: UIConfig);
    /**
     * Creates a UI manager with a list of UI variants that will be dynamically selected and switched according to
     * the context of the UI.
     *
     * Every time the UI context changes, the conditions of the UI variants will be sequentially resolved and the first
     * UI, whose condition evaluates to true, will be selected and displayed. The last variant in the list might omit the
     * condition resolver and will be selected as default/fallback UI when all other conditions fail. If there is no
     * fallback UI and all conditions fail, no UI will be displayed.
     *
     * @param player the associated player of this UI
     * @param uiVariants a list of UI variants that will be dynamically switched
     * @param uiconfig optional UI configuration
     */
    constructor(player: PlayerAPI, uiVariants: UIVariant[], uiconfig?: UIConfig);
    /**
     * Exposes i18n.getLocalizer() function
     * @returns {I18nApi.getLocalizer()}
     */
    static localize<V extends CustomVocabulary<Record<string, string>>>(key: keyof V): () => string;
    /**
     * Provide configuration to support Custom UI languages
     * default language: 'en'
     */
    static setLocalizationConfig(localizationConfig: LocalizationConfig): void;
    getConfig(): UIConfig;
    /**
     * Returns the list of UI variants as passed into the constructor of {@link UIManager}.
     * @returns {UIVariant[]} the list of available UI variants
     */
    getUiVariants(): UIVariant[];
    /**
     * Switches to a UI variant from the list returned by {@link getUiVariants}.
     * @param {UIVariant} uiVariant the UI variant to switch to
     * @param {() => void} onShow a callback that is executed just before the new UI variant is shown
     */
    switchToUiVariant(uiVariant: UIVariant, onShow?: () => void): void;
    /**
     * Triggers a UI variant switch as triggered by events when automatic switching is enabled. It allows to overwrite
     * properties of the {@link UIConditionContext}.
     * @param {Partial<UIConditionContext>} context an optional set of properties that overwrite properties of the
     *   automatically determined context
     * @param {(context: UIConditionContext) => void} onShow a callback that is executed just before the new UI variant
     *   is shown (if a switch is happening)
     */
    resolveUiVariant(context?: Partial<UIConditionContext>, onShow?: (context: UIConditionContext) => void): void;
    private addUi;
    private releaseUi;
    release(): void;
    /**
     * Fires just before UI variants are about to be resolved and the UI variant is possibly switched. It is fired when
     * the switch is triggered from an automatic switch and when calling {@link resolveUiVariant}.
     * Can be used to modify the {@link UIConditionContext} before resolving is done.
     * @returns {EventDispatcher<UIManager, UIConditionContext>}
     */
    get onUiVariantResolve(): EventDispatcher<UIManager, UIConditionContext>;
    /**
     * Returns the list of all added markers in undefined order.
     */
    getTimelineMarkers(): TimelineMarker[];
    /**
     * Adds a marker to the timeline. Does not check for duplicates/overlaps at the `time`.
     */
    addTimelineMarker(timelineMarker: TimelineMarker): void;
    /**
     * Removes a marker from the timeline (by reference) and returns `true` if the marker has
     * been part of the timeline and successfully removed, or `false` if the marker could not
     * be found and thus not removed.
     */
    removeTimelineMarker(timelineMarker: TimelineMarker): boolean;
}
export interface SeekPreviewArgs extends NoArgs {
    /**
     * The timeline position in percent where the event originates from.
     */
    position: number;
    /**
     * The timeline marker associated with the current position, if existing.
     */
    marker?: SeekBarMarker;
}
/**
 * Encapsulates functionality to manage a UI instance. Used by the {@link UIManager} to manage multiple UI instances.
 */
export declare class UIInstanceManager {
    private playerWrapper;
    private ui;
    private config;
    private events;
    constructor(player: PlayerAPI, ui: UIContainer, config: InternalUIConfig);
    getConfig(): InternalUIConfig;
    getUI(): UIContainer;
    getPlayer(): PlayerAPI;
    /**
     * Fires when the UI is fully configured and added to the DOM.
     * @returns {EventDispatcher}
     */
    get onConfigured(): EventDispatcher<UIContainer, NoArgs>;
    /**
     * Fires when a seek starts.
     * @returns {EventDispatcher}
     */
    get onSeek(): EventDispatcher<SeekBar, NoArgs>;
    /**
     * Fires when the seek timeline is scrubbed.
     * @returns {EventDispatcher}
     */
    get onSeekPreview(): EventDispatcher<SeekBar, SeekPreviewArgs>;
    /**
     * Fires when a seek is finished.
     * @returns {EventDispatcher}
     */
    get onSeeked(): EventDispatcher<SeekBar, NoArgs>;
    /**
     * Fires when a component is showing.
     * @returns {EventDispatcher}
     */
    get onComponentShow(): EventDispatcher<Component<ComponentConfig>, NoArgs>;
    /**
     * Fires when a component is hiding.
     * @returns {EventDispatcher}
     */
    get onComponentHide(): EventDispatcher<Component<ComponentConfig>, NoArgs>;
    /**
     * Fires when the UI controls are showing.
     * @returns {EventDispatcher}
     */
    get onControlsShow(): EventDispatcher<UIContainer, NoArgs>;
    /**
     * Fires before the UI controls are hiding to check if they are allowed to hide.
     * @returns {EventDispatcher}
     */
    get onPreviewControlsHide(): EventDispatcher<UIContainer, CancelEventArgs>;
    /**
     * Fires when the UI controls are hiding.
     * @returns {EventDispatcher}
     */
    get onControlsHide(): EventDispatcher<UIContainer, NoArgs>;
    /**
     * Fires when the UI controls are released.
     * @returns {EventDispatcher}
     */
    get onRelease(): EventDispatcher<UIContainer, NoArgs>;
    protected clearEventHandlers(): void;
}
/**
 * Extended interface of the {@link Player} for use in the UI.
 */
export interface WrappedPlayer extends PlayerAPI {
    /**
     * Fires an event on the player that targets all handlers in the UI but never enters the real player.
     * @param event the event to fire
     * @param data data to send with the event
     */
    fireEventInUI(event: PlayerEvent, data: {}): void;
}
/**
 * Wraps the player to track event handlers and provide a simple method to remove all registered event
 * handlers from the player.
 */
export declare class PlayerWrapper {
    private player;
    private wrapper;
    private eventHandlers;
    constructor(player: PlayerAPI);
    /**
     * Returns a wrapped player object that can be used on place of the normal player object.
     * @returns {WrappedPlayer} a wrapped player
     */
    getPlayer(): WrappedPlayer;
    /**
     * Clears all registered event handlers from the player that were added through the wrapped player.
     */
    clearEventHandlers(): void;
}
