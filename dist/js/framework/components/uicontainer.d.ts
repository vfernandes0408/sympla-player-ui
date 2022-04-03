import { ContainerConfig, Container } from './container';
import { UIInstanceManager } from '../uimanager';
import { DOM } from '../dom';
import { PlayerUtils } from '../playerutils';
import { PlayerAPI } from 'bitmovin-player';
/**
 * Configuration interface for a {@link UIContainer}.
 */
export interface UIContainerConfig extends ContainerConfig {
    /**
     * The delay in milliseconds after which the control bar will be hidden when there is no user interaction.
     * Set to -1 for the UI to be always shown.
     * Default: 5 seconds (5000)
     */
    hideDelay?: number;
    /**
     * An array of player states in which the UI will not be hidden, no matter what the {@link hideDelay} is.
     */
    hidePlayerStateExceptions?: PlayerUtils.PlayerState[];
    /**
     * The HTML element on which user interaction events (e.g. mouse and touch events) will be tracked to detect
     * interaction with the UI. These basically trigger showing and hiding of the UI.
     * Default: the UI container itself
     */
    userInteractionEventSource?: HTMLElement;
}
/**
 * The base container that contains all of the UI. The UIContainer is passed to the {@link UIManager} to build and
 * setup the UI.
 */
export declare class UIContainer extends Container<UIContainerConfig> {
    private static readonly STATE_PREFIX;
    private static readonly FULLSCREEN;
    private static readonly BUFFERING;
    private static readonly REMOTE_CONTROL;
    private static readonly CONTROLS_SHOWN;
    private static readonly CONTROLS_HIDDEN;
    private uiHideTimeout;
    private playerStateChange;
    private userInteractionEventSource;
    private userInteractionEvents;
    constructor(config: UIContainerConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    private configureUIShowHide;
    private configurePlayerStates;
    release(): void;
    protected toDomElement(): DOM;
}
