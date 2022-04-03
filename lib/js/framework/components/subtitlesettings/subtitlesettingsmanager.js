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
exports.SubtitleSettingsProperty = exports.SubtitleSettingsManager = void 0;
var storageutils_1 = require("../../storageutils");
var component_1 = require("../component");
var eventdispatcher_1 = require("../../eventdispatcher");
var SubtitleSettingsManager = /** @class */ (function () {
    function SubtitleSettingsManager() {
        var _this = this;
        this._properties = {
            fontColor: new SubtitleSettingsProperty(this),
            fontOpacity: new SubtitleSettingsProperty(this),
            fontFamily: new SubtitleSettingsProperty(this),
            fontSize: new SubtitleSettingsProperty(this),
            characterEdge: new SubtitleSettingsProperty(this),
            backgroundColor: new SubtitleSettingsProperty(this),
            backgroundOpacity: new SubtitleSettingsProperty(this),
            windowColor: new SubtitleSettingsProperty(this),
            windowOpacity: new SubtitleSettingsProperty(this),
        };
        this.userSettings = {};
        this.localStorageKey = DummyComponent.instance().prefixCss('subtitlesettings');
        var _loop_1 = function (propertyName) {
            this_1._properties[propertyName].onChanged.subscribe(function (sender, property) {
                if (property.isSet()) {
                    _this.userSettings[propertyName] = property.value;
                }
                else {
                    // Delete the property from the settings object if unset to avoid serialization of null values
                    delete _this.userSettings[propertyName];
                }
                // Save the settings object when a property has changed
                _this.save();
            });
        };
        var this_1 = this;
        for (var propertyName in this._properties) {
            _loop_1(propertyName);
        }
        this.load();
    }
    SubtitleSettingsManager.prototype.reset = function () {
        for (var propertyName in this._properties) {
            this._properties[propertyName].clear();
        }
    };
    Object.defineProperty(SubtitleSettingsManager.prototype, "fontColor", {
        get: function () {
            return this._properties.fontColor;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SubtitleSettingsManager.prototype, "fontOpacity", {
        get: function () {
            return this._properties.fontOpacity;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SubtitleSettingsManager.prototype, "fontFamily", {
        get: function () {
            return this._properties.fontFamily;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SubtitleSettingsManager.prototype, "fontSize", {
        get: function () {
            return this._properties.fontSize;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SubtitleSettingsManager.prototype, "characterEdge", {
        get: function () {
            return this._properties.characterEdge;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SubtitleSettingsManager.prototype, "backgroundColor", {
        get: function () {
            return this._properties.backgroundColor;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SubtitleSettingsManager.prototype, "backgroundOpacity", {
        get: function () {
            return this._properties.backgroundOpacity;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SubtitleSettingsManager.prototype, "windowColor", {
        get: function () {
            return this._properties.windowColor;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SubtitleSettingsManager.prototype, "windowOpacity", {
        get: function () {
            return this._properties.windowOpacity;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Saves the settings to local storage.
     */
    SubtitleSettingsManager.prototype.save = function () {
        storageutils_1.StorageUtils.setObject(this.localStorageKey, this.userSettings);
    };
    /**
     * Loads the settings from local storage
     */
    SubtitleSettingsManager.prototype.load = function () {
        this.userSettings = storageutils_1.StorageUtils.getObject(this.localStorageKey) || {};
        // Apply the loaded settings
        for (var property in this.userSettings) {
            this._properties[property].value = this.userSettings[property];
        }
    };
    return SubtitleSettingsManager;
}());
exports.SubtitleSettingsManager = SubtitleSettingsManager;
/**
 * A dummy component whose sole purpose is to expose the {@link #prefixCss} method to the
 * {@link SubtitleSettingsManager}.
 */
var DummyComponent = /** @class */ (function (_super) {
    __extends(DummyComponent, _super);
    function DummyComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DummyComponent.instance = function () {
        if (!DummyComponent._instance) {
            DummyComponent._instance = new DummyComponent();
        }
        return DummyComponent._instance;
    };
    DummyComponent.prototype.prefixCss = function (cssClassOrId) {
        return _super.prototype.prefixCss.call(this, cssClassOrId);
    };
    return DummyComponent;
}(component_1.Component));
var SubtitleSettingsProperty = /** @class */ (function () {
    function SubtitleSettingsProperty(manager) {
        this._manager = manager;
        this._onChanged = new eventdispatcher_1.EventDispatcher();
    }
    SubtitleSettingsProperty.prototype.isSet = function () {
        return this._value != null;
    };
    SubtitleSettingsProperty.prototype.clear = function () {
        this._value = null;
        this.onChangedEvent(null);
    };
    Object.defineProperty(SubtitleSettingsProperty.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (value) {
            if (typeof value === 'string' && value === 'null') {
                value = null;
            }
            this._value = value;
            this.onChangedEvent(value);
        },
        enumerable: false,
        configurable: true
    });
    SubtitleSettingsProperty.prototype.onChangedEvent = function (value) {
        this._onChanged.dispatch(this._manager, this);
    };
    Object.defineProperty(SubtitleSettingsProperty.prototype, "onChanged", {
        get: function () {
            return this._onChanged.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    return SubtitleSettingsProperty;
}());
exports.SubtitleSettingsProperty = SubtitleSettingsProperty;
