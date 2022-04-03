import { PlayerAPI } from 'bitmovin-player';
import { UIInstanceManager } from '../uimanager';
import { DOM } from '../dom';
import { ComponentConfig } from './component';
import { SeekBarMarker } from './seekbar';
export interface MarkersConfig extends ComponentConfig {
    /**
     * Used for seekBar marker snapping range percentage
     */
    snappingRange?: number;
}
export declare class TimelineMarkersHandler {
    private markersContainer;
    private timelineMarkers;
    private player;
    private uimanager;
    private pausedTimeshiftUpdater;
    private getSeekBarWidth;
    protected config: MarkersConfig;
    constructor(config: MarkersConfig, getSeekBarWidth: () => number, markersContainer: DOM);
    initialize(player: PlayerAPI, uimanager: UIInstanceManager): void;
    private configureMarkers;
    getMarkerAtPosition(percentage: number): SeekBarMarker | null;
    private clearMarkers;
    private removeMarkerFromConfig;
    private filterRemovedMarkers;
    private removeMarkerFromDOM;
    private updateMarkers;
    private getMarkerCssProperties;
    private updateMarkerDOM;
    private createMarkerDOM;
    private updateMarkersDOM;
    private configureLivePausedTimeshiftUpdater;
    protected prefixCss(cssClassOrId: string): string;
}
