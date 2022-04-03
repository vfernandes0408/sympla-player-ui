import { UIContainer } from './components/uicontainer';
import { CastUIContainer } from './components/castuicontainer';
import { UIManager } from './uimanager';
import { UIConfig } from './uiconfig';
import { PlayerAPI } from 'bitmovin-player';
export declare namespace UIFactory {
    function buildDefaultUI(player: PlayerAPI, config?: UIConfig): UIManager;
    function buildDefaultSmallScreenUI(player: PlayerAPI, config?: UIConfig): UIManager;
    function buildDefaultCastReceiverUI(player: PlayerAPI, config?: UIConfig): UIManager;
    function modernUI(): UIContainer;
    function modernAdsUI(): UIContainer;
    function modernSmallScreenUI(): UIContainer;
    function modernSmallScreenAdsUI(): UIContainer;
    function modernCastReceiverUI(): CastUIContainer;
    function buildModernUI(player: PlayerAPI, config?: UIConfig): UIManager;
    function buildModernSmallScreenUI(player: PlayerAPI, config?: UIConfig): UIManager;
    function buildModernCastReceiverUI(player: PlayerAPI, config?: UIConfig): UIManager;
}
