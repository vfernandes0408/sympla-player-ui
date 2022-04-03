import { ListBox } from './listbox';
import { UIInstanceManager } from '../uimanager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * A element that is similar to a select box where the user can select a subtitle
 */
export declare class SubtitleListBox extends ListBox {
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
