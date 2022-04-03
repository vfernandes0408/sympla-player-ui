import { SubtitleOverlay } from '../subtitleoverlay';
import { ListSelectorConfig } from '../listselector';
import { SelectBox } from '../selectbox';
import { SubtitleSettingsManager } from './subtitlesettingsmanager';
export interface SubtitleSettingSelectBoxConfig extends ListSelectorConfig {
    overlay: SubtitleOverlay;
    settingsManager: SubtitleSettingsManager;
}
/**
 * Base class for all subtitles settings select box
 **/
export declare class SubtitleSettingSelectBox extends SelectBox {
    protected settingsManager: SubtitleSettingsManager;
    protected overlay: SubtitleOverlay;
    private currentCssClass;
    constructor(config: SubtitleSettingSelectBoxConfig);
    /**
     * Removes a previously set class and adds the passed in class.
     * @param cssClass The new class to replace the previous class with or null to just remove the previous class
     */
    protected toggleOverlayClass(cssClass: string): void;
}
