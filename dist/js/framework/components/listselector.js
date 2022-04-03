"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListSelector = void 0;
var component_1 = require("./component");
var eventdispatcher_1 = require("../eventdispatcher");
var arrayutils_1 = require("../arrayutils");
var i18n_1 = require("../localization/i18n");
var ListSelector = /** @class */ (function (_super) {
    __extends(ListSelector, _super);
    function ListSelector(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.listSelectorEvents = {
            onItemAdded: new eventdispatcher_1.EventDispatcher(),
            onItemRemoved: new eventdispatcher_1.EventDispatcher(),
            onItemSelected: new eventdispatcher_1.EventDispatcher(),
        };
        _this.config = _this.mergeConfig(config, {
            items: [],
            cssClass: 'ui-listselector',
        }, _this.config);
        _this.items = _this.config.items;
        return _this;
    }
    ListSelector.prototype.getItemIndex = function (key) {
        for (var index in this.items) {
            if (key === this.items[index].key) {
                return parseInt(index);
            }
        }
        return -1;
    };
    /**
     * Returns all current items of this selector.
     * * @returns {ListItem[]}
     */
    ListSelector.prototype.getItems = function () {
        return this.items;
    };
    /**
     * Checks if the specified item is part of this selector.
     * @param key the key of the item to check
     * @returns {boolean} true if the item is part of this selector, else false
     */
    ListSelector.prototype.hasItem = function (key) {
        return this.getItemIndex(key) > -1;
    };
    /**
     * Adds an item to this selector by doing a sorted insert or by appending the element to the end of the list of items.
     * If an item with the specified key already exists, it is replaced.
     * @param key the key of the item to add
     * @param label the (human-readable) label of the item to add
     * @param sortedInsert whether the item should be added respecting the order of keys
     * @param ariaLabel custom aria label for the listItem
     */
    ListSelector.prototype.addItem = function (key, label, sortedInsert, ariaLabel) {
        if (sortedInsert === void 0) { sortedInsert = false; }
        if (ariaLabel === void 0) { ariaLabel = ''; }
        var listItem = __assign({ key: key, label: i18n_1.i18n.performLocalization(label) }, (ariaLabel && { ariaLabel: ariaLabel }));
        // Apply filter function
        if (this.config.filter && !this.config.filter(listItem)) {
            return;
        }
        // Apply translator function
        if (this.config.translator) {
            listItem.label = this.config.translator(listItem);
        }
        // Try to remove key first to get overwrite behavior and avoid duplicate keys
        this.removeItem(key); // This will trigger an ItemRemoved and an ItemAdded event
        // Add the item to the list
        if (sortedInsert) {
            var index = this.items.findIndex(function (entry) { return entry.key > key; });
            if (index < 0) {
                this.items.push(listItem);
            }
            else {
                this.items.splice(index, 0, listItem);
            }
        }
        else {
            this.items.push(listItem);
        }
        this.onItemAddedEvent(key);
    };
    /**
     * Removes an item from this selector.
     * @param key the key of the item to remove
     * @returns {boolean} true if removal was successful, false if the item is not part of this selector
     */
    ListSelector.prototype.removeItem = function (key) {
        var index = this.getItemIndex(key);
        if (index > -1) {
            arrayutils_1.ArrayUtils.remove(this.items, this.items[index]);
            this.onItemRemovedEvent(key);
            return true;
        }
        return false;
    };
    /**
     * Selects an item from the items in this selector.
     * @param key the key of the item to select
     * @returns {boolean} true is the selection was successful, false if the selected item is not part of the selector
     */
    ListSelector.prototype.selectItem = function (key) {
        if (key === this.selectedItem) {
            // itemConfig is already selected, suppress any further action
            return true;
        }
        var index = this.getItemIndex(key);
        if (index > -1) {
            this.selectedItem = key;
            this.onItemSelectedEvent(key);
            return true;
        }
        return false;
    };
    /**
     * Returns the key of the selected item.
     * @returns {string} the key of the selected item or null if no item is selected
     */
    ListSelector.prototype.getSelectedItem = function () {
        return this.selectedItem;
    };
    /**
     * Returns the items for the given key or undefined if no item with the given key exists.
     * @param key the key of the item to return
     * @returns {ListItem} the item with the requested key. Undefined if no item with the given key exists.
     */
    ListSelector.prototype.getItemForKey = function (key) {
        return this.items.find(function (item) { return item.key === key; });
    };
    /**
     * Synchronize the current items of this selector with the given ones. This will remove and add items selectively.
     * For each removed item the ItemRemovedEvent and for each added item the ItemAddedEvent will be triggered. Favour
     * this method over using clearItems and adding all items again afterwards.
     * @param newItems
     */
    ListSelector.prototype.synchronizeItems = function (newItems) {
        var _this = this;
        newItems
            .filter(function (item) { return !_this.hasItem(item.key); })
            .forEach(function (item) { return _this.addItem(item.key, item.label, item.sortedInsert, item.ariaLabel); });
        this.items
            .filter(function (item) { return newItems.filter(function (i) { return i.key === item.key; }).length === 0; })
            .forEach(function (item) { return _this.removeItem(item.key); });
    };
    /**
     * Removes all items from this selector.
     */
    ListSelector.prototype.clearItems = function () {
        // local copy for iteration after clear
        var items = this.items;
        // clear items
        this.items = [];
        // clear the selection as the selected item is also removed
        this.selectedItem = null;
        // fire events
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            this.onItemRemovedEvent(item.key);
        }
    };
    /**
     * Returns the number of items in this selector.
     * @returns {number}
     */
    ListSelector.prototype.itemCount = function () {
        return Object.keys(this.items).length;
    };
    ListSelector.prototype.onItemAddedEvent = function (key) {
        this.listSelectorEvents.onItemAdded.dispatch(this, key);
    };
    ListSelector.prototype.onItemRemovedEvent = function (key) {
        this.listSelectorEvents.onItemRemoved.dispatch(this, key);
    };
    ListSelector.prototype.onItemSelectedEvent = function (key) {
        this.listSelectorEvents.onItemSelected.dispatch(this, key);
    };
    Object.defineProperty(ListSelector.prototype, "onItemAdded", {
        /**
         * Gets the event that is fired when an item is added to the list of items.
         * @returns {Event<ListSelector<Config>, string>}
         */
        get: function () {
            return this.listSelectorEvents.onItemAdded.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ListSelector.prototype, "onItemRemoved", {
        /**
         * Gets the event that is fired when an item is removed from the list of items.
         * @returns {Event<ListSelector<Config>, string>}
         */
        get: function () {
            return this.listSelectorEvents.onItemRemoved.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ListSelector.prototype, "onItemSelected", {
        /**
         * Gets the event that is fired when an item is selected from the list of items.
         * @returns {Event<ListSelector<Config>, string>}
         */
        get: function () {
            return this.listSelectorEvents.onItemSelected.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    return ListSelector;
}(component_1.Component));
exports.ListSelector = ListSelector;
