"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMobileV3PlayerAPI = exports.MobileV3PlayerEvent = void 0;
var MobileV3PlayerEvent;
(function (MobileV3PlayerEvent) {
    MobileV3PlayerEvent["SourceError"] = "sourceerror";
    MobileV3PlayerEvent["PlayerError"] = "playererror";
    MobileV3PlayerEvent["PlaylistTransition"] = "playlisttransition";
})(MobileV3PlayerEvent = exports.MobileV3PlayerEvent || (exports.MobileV3PlayerEvent = {}));
function isMobileV3PlayerAPI(player) {
    for (var key in MobileV3PlayerEvent) {
        if (MobileV3PlayerEvent.hasOwnProperty(key) && !player.exports.PlayerEvent.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}
exports.isMobileV3PlayerAPI = isMobileV3PlayerAPI;
