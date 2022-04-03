import { ListSelector, ListSelectorConfig } from './listselector';
import { DOM } from '../dom';
import { PlayerAPI } from 'bitmovin-player';
import { UIInstanceManager } from '../uimanager';
/**
 * A element to select a single item out of a list of available items.
 *
 * DOM example:
 * <code>
 *   <div class='ui-listbox'>
 *     <button class='ui-listbox-button'>label</button>
 *     ...
 *   </div
 * </code>
 */
export declare class ListBox extends ListSelector<ListSelectorConfig> {
    private listBoxElement;
    private components;
    constructor(config?: ListSelectorConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    protected toDomElement(): DOM;
    private createListBoxDomItems;
    private removeListBoxDomItem;
    private addListBoxDomItem;
    private refreshSelectedItem;
    private buildListBoxItemButton;
    private getComponentForKey;
    private handleSelectionChange;
}
