"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageUtils = void 0;
var StorageUtils;
(function (StorageUtils) {
    var hasLocalStorageCache;
    function hasLocalStorage() {
        if (hasLocalStorageCache) {
            return hasLocalStorageCache;
        }
        // hasLocalStorage is used to safely ensure we can use localStorage
        // taken from https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#Feature-detecting_localStorage
        var storage = { length: 0 };
        try {
            storage = window['localStorage'];
            var x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            hasLocalStorageCache = true;
        }
        catch (e) {
            hasLocalStorageCache = e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === 'QuotaExceededError' ||
                // Firefox
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                // acknowledge QuotaExceededError only if there's something already stored
                storage.length !== 0;
        }
        return hasLocalStorageCache;
    }
    StorageUtils.hasLocalStorage = hasLocalStorage;
    /**
     * Stores a string item into localStorage.
     * @param key the item's key
     * @param data the item's data
     */
    function setItem(key, data) {
        if (StorageUtils.hasLocalStorage()) {
            window.localStorage.setItem(key, data);
        }
    }
    StorageUtils.setItem = setItem;
    /**
     * Gets an item's string value from the localStorage.
     * @param key the key to look up its associated value
     * @return {string | null} Returns the string if found, null if there is no data stored for the key
     */
    function getItem(key) {
        if (StorageUtils.hasLocalStorage()) {
            return window.localStorage.getItem(key);
        }
        else {
            return null;
        }
    }
    StorageUtils.getItem = getItem;
    /**
     * Stores an object into localStorage. The object will be serialized to JSON. The following types are supported
     * in addition to the default types:
     *  - ColorUtils.Color
     *
     * @param key the key to store the data to
     * @param data the object to store
     */
    function setObject(key, data) {
        if (StorageUtils.hasLocalStorage()) {
            var json = JSON.stringify(data);
            setItem(key, json);
        }
    }
    StorageUtils.setObject = setObject;
    /**
     * Gets an object for the given key from localStorage. The object will be deserialized from JSON. Beside the
     * default types, the following types are supported:
     *  - ColorUtils.Color
     *
     * @param key the key to look up its associated object
     * @return {any} Returns the object if found, null otherwise
     */
    function getObject(key) {
        if (StorageUtils.hasLocalStorage()) {
            var json = getItem(key);
            if (key) {
                var object = JSON.parse(json);
                return object;
            }
        }
        return null;
    }
    StorageUtils.getObject = getObject;
})(StorageUtils = exports.StorageUtils || (exports.StorageUtils = {}));
