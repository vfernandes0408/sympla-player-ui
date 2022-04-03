import { Container, ContainerConfig } from './container';
import { UIInstanceManager } from '../uimanager';
import { PlayerAPI, Thumbnail } from 'bitmovin-player';
/**
 * Configuration interface for a {@link SeekBarLabel}.
 */
export interface SeekBarLabelConfig extends ContainerConfig {
}
/**
 * A label for a {@link SeekBar} that can display the seek target time, a thumbnail, and title (e.g. chapter title).
 */
export declare class SeekBarLabel extends Container<SeekBarLabelConfig> {
    private timeLabel;
    private titleLabel;
    private thumbnail;
    private thumbnailImageLoader;
    private timeFormat;
    private appliedMarkerCssClasses;
    private player;
    private uiManager;
    constructor(config?: SeekBarLabelConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    private handleSeekPreview;
    /**
     * Sets arbitrary text on the label.
     * @param text the text to show on the label
     */
    setText(text: string): void;
    /**
     * Sets a time to be displayed on the label.
     * @param seconds the time in seconds to display on the label
     */
    setTime(seconds: number): void;
    /**
     * Sets the text on the title label.
     * @param text the text to show on the label
     */
    setTitleText(text?: string): void;
    /**
     * Sets or removes a thumbnail on the label.
     * @param thumbnail the thumbnail to display on the label or null to remove a displayed thumbnail
     */
    setThumbnail(thumbnail?: Thumbnail): void;
    private thumbnailCssSprite;
    private thumbnailCssSingleImage;
    release(): void;
}
