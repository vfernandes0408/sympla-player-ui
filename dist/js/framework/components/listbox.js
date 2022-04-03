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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListBox = void 0;
var togglebutton_1 = require("./togglebutton");
var listselector_1 = require("./listselector");
var dom_1 = require("../dom");
var arrayutils_1 = require("../arrayutils");
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
// TODO: change ListSelector to extends container in v4 to improve usage of ListBox.
//       Currently we are creating the dom element of the list box with child elements manually here.
//       But this functionality is already covered within the Container component.
var ListBox = /** @class */ (function (_super) {
    __extends(ListBox, _super);
    function ListBox(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.components = [];
        _this.removeListBoxDomItem = function (_, key) {
            var component = _this.getComponentForKey(key);
            if (component) {
                component.getDomElement().remove();
                arrayutils_1.ArrayUtils.remove(_this.components, component);
            }
        };
        _this.addListBoxDomItem = function (_, key) {
            var component = _this.getComponentForKey(key);
            var newItem = _this.getItemForKey(key);
            if (component) {
                // Update existing component
                component.setText(newItem.label);
            }
            else {
                var listBoxItemButton_1 = _this.buildListBoxItemButton(newItem);
                listBoxItemButton_1.onClick.subscribe(function () {
                    _this.handleSelectionChange(listBoxItemButton_1);
                });
                _this.components.push(listBoxItemButton_1);
                _this.listBoxElement.append(listBoxItemButton_1.getDomElement());
            }
        };
        _this.refreshSelectedItem = function () {
            // This gets called twice because the first time is triggered when the user clicks on the ListBoxItemButton. And the
            // second call comes from the player event when the actual item is selected (Subtitle / AudioTrack in this case).
            // As this is a generic component we can't prohibit this behaviour. We need to treat this component as it acts
            // independent from PlayerEvents and on the other hand we need to react to PlayerEvents as it could be triggered
            // from outside.
            for (var _i = 0, _a = _this.items; _i < _a.length; _i++) {
                var item = _a[_i];
                var component = _this.getComponentForKey(item.key);
                if (component) {
                    String(component.key) === String(_this.selectedItem) ? component.on() : component.off();
                }
            }
        };
        _this.handleSelectionChange = function (sender) {
            _this.onItemSelectedEvent(sender.key);
        };
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-listbox',
        }, _this.config);
        return _this;
    }
    ListBox.prototype.configure = function (player, uimanager) {
        // Subscribe before super call to receive initial events
        this.onItemAdded.subscribe(this.addListBoxDomItem);
        this.onItemRemoved.subscribe(this.removeListBoxDomItem);
        this.onItemSelected.subscribe(this.refreshSelectedItem);
        _super.prototype.configure.call(this, player, uimanager);
    };
    ListBox.prototype.toDomElement = function () {
        var listBoxElement = new dom_1.DOM('div', {
            'id': this.config.id,
            'class': this.getCssClasses(),
        });
        this.listBoxElement = listBoxElement;
        this.createListBoxDomItems();
        this.refreshSelectedItem();
        return listBoxElement;
    };
    ListBox.prototype.createListBoxDomItems = function () {
        // Delete all children
        this.listBoxElement.empty();
        this.components = [];
        // Add updated children
        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
            var item = _a[_i];
            this.addListBoxDomItem(this, item.key);
        }
    };
    ListBox.prototype.buildListBoxItemButton = function (listItem) {
        return new ListBoxItemButton({
            key: listItem.key,
            text: listItem.label,
            ariaLabel: listItem.ariaLabel,
        });
    };
    ListBox.prototype.getComponentForKey = function (key) {
        return this.components.find(function (c) { return key === c.key; });
    };
    return ListBox;
}(listselector_1.ListSelector));
exports.ListBox = ListBox;
var ListBoxItemButton = /** @class */ (function (_super) {
    __extends(ListBoxItemButton, _super);
    function ListBoxItemButton(config) {
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-listbox-button',
            onClass: 'selected',
            offClass: '',
        }, _this.config);
        return _this;
    }
    Object.defineProperty(ListBoxItemButton.prototype, "key", {
        get: function () {
            return this.config.key;
        },
        enumerable: false,
        configurable: true
    });
    return ListBoxItemButton;
}(togglebutton_1.ToggleButton));
