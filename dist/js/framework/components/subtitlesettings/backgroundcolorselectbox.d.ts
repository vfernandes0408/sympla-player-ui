import { SubtitleSettingSelectBox, SubtitleSettingSelectBoxConfig } from './subtitlesettingselectbox';
import { UIInstanceManager } from '../../uimanager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * A select box providing a selection of different background colors.
 */
export declare class BackgroundColorSelectBox extends SubtitleSettingSelectBox {
    constructor(config: SubtitleSettingSelectBoxConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
