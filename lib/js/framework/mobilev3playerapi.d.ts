import { PlayerAPI, PlayerEvent, PlayerEventBase, PlayerEventCallback } from 'bitmovin-player';
import { WrappedPlayer } from './uimanager';
export declare enum MobileV3PlayerEvent {
    SourceError = "sourceerror",
    PlayerError = "playererror",
    PlaylistTransition = "playlisttransition"
}
export interface MobileV3PlayerErrorEvent extends PlayerEventBase {
    code: number;
    message: string;
}
export interface MobileV3SourceErrorEvent extends PlayerEventBase {
    code: number;
    message: string;
}
export declare type MobileV3PlayerEventType = PlayerEvent | MobileV3PlayerEvent;
export interface MobileV3PlayerAPI extends PlayerAPI {
    on(eventType: MobileV3PlayerEventType, callback: PlayerEventCallback): void;
    exports: PlayerAPI['exports'] & {
        PlayerEvent: MobileV3PlayerEventType;
    };
}
export declare function isMobileV3PlayerAPI(player: WrappedPlayer | PlayerAPI | MobileV3PlayerAPI): player is MobileV3PlayerAPI;
