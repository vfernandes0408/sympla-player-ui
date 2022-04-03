import { SubtitleSettingSelectBox, SubtitleSettingSelectBoxConfig } from './subtitlesettingselectbox';
import { UIInstanceManager } from '../../uimanager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * A select box providing a selection of different background opacity.
 */
export declare class WindowOpacitySelectBox extends SubtitleSettingSelectBox {
    constructor(config: SubtitleSettingSelectBoxConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
