import { UIManager } from './uimanager';
import { UIConfig } from './uiconfig';
import { PlayerAPI } from 'bitmovin-player';
export declare namespace DemoFactory {
    function buildDemoWithSeparateAudioSubtitlesButtons(player: PlayerAPI, config?: UIConfig): UIManager;
}
