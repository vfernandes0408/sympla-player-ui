import { Container, ContainerConfig } from './container';
import { UIInstanceManager } from '../uimanager';
import { Label, LabelConfig } from './label';
import { Size } from '../dom';
import { PlayerAPI, SubtitleCueEvent } from 'bitmovin-player';
import { VTTProperties } from 'bitmovin-player/types/subtitles/vtt/API';
/**
 * Overlays the player to display subtitles.
 */
export declare class SubtitleOverlay extends Container<ContainerConfig> {
    private subtitleManager;
    private previewSubtitleActive;
    private previewSubtitle;
    private preprocessLabelEventCallback;
    private subtitleContainerManager;
    private static readonly CLASS_CONTROLBAR_VISIBLE;
    private static readonly CLASS_CEA_608;
    private static readonly CEA608_NUM_ROWS;
    private static readonly CEA608_NUM_COLUMNS;
    private static readonly CEA608_ROW_OFFSET;
    private static readonly CEA608_COLUMN_OFFSET;
    constructor(config?: ContainerConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    generateLabel(event: SubtitleCueEvent): SubtitleLabel;
    configureCea608Captions(player: PlayerAPI, uimanager: UIInstanceManager): void;
    enablePreviewSubtitleLabel(): void;
    removePreviewSubtitleLabel(): void;
}
interface SubtitleLabelConfig extends LabelConfig {
    vtt?: VTTProperties;
    region?: string;
    regionStyle?: string;
}
export declare class SubtitleLabel extends Label<SubtitleLabelConfig> {
    constructor(config?: SubtitleLabelConfig);
    get vtt(): VTTProperties;
    get region(): string;
    get regionStyle(): string;
}
export declare class SubtitleRegionContainerManager {
    private subtitleOverlay;
    private subtitleRegionContainers;
    /**
     * @param subtitleOverlay Reference to the subtitle overlay for adding and removing the containers.
     */
    constructor(subtitleOverlay: SubtitleOverlay);
    private getRegion;
    /**
     * Creates and wraps a subtitle label into a container div based on the subtitle region.
     * If the subtitle has positioning information it is added to the container.
     * @param label The subtitle label to wrap
     */
    addLabel(label: SubtitleLabel, overlaySize?: Size): void;
    replaceLabel(previousLabel: SubtitleLabel, newLabel: SubtitleLabel): void;
    /**
     * Removes a subtitle label from a container.
     */
    removeLabel(label: SubtitleLabel): void;
    /**
     * Removes all subtitle containers.
     */
    clear(): void;
}
export declare class SubtitleRegionContainer extends Container<ContainerConfig> {
    private labelCount;
    constructor(config?: ContainerConfig);
    addLabel(labelToAdd: SubtitleLabel, overlaySize?: Size): void;
    removeLabel(labelToRemove: SubtitleLabel): void;
    isEmpty(): boolean;
}
export {};
