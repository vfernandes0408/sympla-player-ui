import { Component, ComponentConfig } from './component';
import { Event } from '../eventdispatcher';
import { LocalizableText } from '../localization/i18n';
/**
 * A map of items (key/value -> label} for a {@link ListSelector} in a {@link ListSelectorConfig}.
 */
export interface ListItem {
    key: string;
    label: LocalizableText;
    sortedInsert?: boolean;
    ariaLabel?: string;
}
/**
 * Filter function that can be used to filter out list items added through {@link ListSelector.addItem}.
 *
 * This is intended to be used in conjunction with subclasses that populate themselves automatically
 * via the player API, e.g. {@link SubtitleSelectBox}.
 */
export interface ListItemFilter {
    /**
     * Takes a list item and decides whether it should pass or be discarded.
     * @param {ListItem} listItem the item to apply the filter to
     * @returns {boolean} true to let the item pass through the filter, false to discard the item
     */
    (listItem: ListItem): boolean;
}
/**
 * Translator function to translate labels of list items added through {@link ListSelector.addItem}.
 *
 * This is intended to be used in conjunction with subclasses that populate themselves automatically
 * via the player API, e.g. {@link SubtitleSelectBox}.
 */
export interface ListItemLabelTranslator {
    /**
     * Takes a list item, optionally changes the label, and returns the new label.
     * @param {ListItem} listItem the item to translate
     * @returns {string} the translated or original label
     */
    (listItem: ListItem): string;
}
/**
 * Configuration interface for a {@link ListSelector}.
 */
export interface ListSelectorConfig extends ComponentConfig {
    items?: ListItem[];
    filter?: ListItemFilter;
    translator?: ListItemLabelTranslator;
}
export declare abstract class ListSelector<Config extends ListSelectorConfig> extends Component<ListSelectorConfig> {
    protected items: ListItem[];
    protected selectedItem: string;
    private listSelectorEvents;
    constructor(config?: ListSelectorConfig);
    private getItemIndex;
    /**
     * Returns all current items of this selector.
     * * @returns {ListItem[]}
     */
    getItems(): ListItem[];
    /**
     * Checks if the specified item is part of this selector.
     * @param key the key of the item to check
     * @returns {boolean} true if the item is part of this selector, else false
     */
    hasItem(key: string): boolean;
    /**
     * Adds an item to this selector by doing a sorted insert or by appending the element to the end of the list of items.
     * If an item with the specified key already exists, it is replaced.
     * @param key the key of the item to add
     * @param label the (human-readable) label of the item to add
     * @param sortedInsert whether the item should be added respecting the order of keys
     * @param ariaLabel custom aria label for the listItem
     */
    addItem(key: string, label: LocalizableText, sortedInsert?: boolean, ariaLabel?: string): void;
    /**
     * Removes an item from this selector.
     * @param key the key of the item to remove
     * @returns {boolean} true if removal was successful, false if the item is not part of this selector
     */
    removeItem(key: string): boolean;
    /**
     * Selects an item from the items in this selector.
     * @param key the key of the item to select
     * @returns {boolean} true is the selection was successful, false if the selected item is not part of the selector
     */
    selectItem(key: string): boolean;
    /**
     * Returns the key of the selected item.
     * @returns {string} the key of the selected item or null if no item is selected
     */
    getSelectedItem(): string | null;
    /**
     * Returns the items for the given key or undefined if no item with the given key exists.
     * @param key the key of the item to return
     * @returns {ListItem} the item with the requested key. Undefined if no item with the given key exists.
     */
    getItemForKey(key: string): ListItem;
    /**
     * Synchronize the current items of this selector with the given ones. This will remove and add items selectively.
     * For each removed item the ItemRemovedEvent and for each added item the ItemAddedEvent will be triggered. Favour
     * this method over using clearItems and adding all items again afterwards.
     * @param newItems
     */
    synchronizeItems(newItems: ListItem[]): void;
    /**
     * Removes all items from this selector.
     */
    clearItems(): void;
    /**
     * Returns the number of items in this selector.
     * @returns {number}
     */
    itemCount(): number;
    protected onItemAddedEvent(key: string): void;
    protected onItemRemovedEvent(key: string): void;
    protected onItemSelectedEvent(key: string): void;
    /**
     * Gets the event that is fired when an item is added to the list of items.
     * @returns {Event<ListSelector<Config>, string>}
     */
    get onItemAdded(): Event<ListSelector<Config>, string>;
    /**
     * Gets the event that is fired when an item is removed from the list of items.
     * @returns {Event<ListSelector<Config>, string>}
     */
    get onItemRemoved(): Event<ListSelector<Config>, string>;
    /**
     * Gets the event that is fired when an item is selected from the list of items.
     * @returns {Event<ListSelector<Config>, string>}
     */
    get onItemSelected(): Event<ListSelector<Config>, string>;
}
