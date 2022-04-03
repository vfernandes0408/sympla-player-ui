"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIFactory = void 0;
var subtitleoverlay_1 = require("./components/subtitleoverlay");
var settingspanelpage_1 = require("./components/settingspanelpage");
var settingspanelitem_1 = require("./components/settingspanelitem");
var videoqualityselectbox_1 = require("./components/videoqualityselectbox");
var playbackspeedselectbox_1 = require("./components/playbackspeedselectbox");
var audiotrackselectbox_1 = require("./components/audiotrackselectbox");
var audioqualityselectbox_1 = require("./components/audioqualityselectbox");
var settingspanel_1 = require("./components/settingspanel");
var subtitlesettingspanelpage_1 = require("./components/subtitlesettings/subtitlesettingspanelpage");
var settingspanelpageopenbutton_1 = require("./components/settingspanelpageopenbutton");
var subtitlesettingslabel_1 = require("./components/subtitlesettings/subtitlesettingslabel");
var subtitleselectbox_1 = require("./components/subtitleselectbox");
var controlbar_1 = require("./components/controlbar");
var container_1 = require("./components/container");
var playbacktimelabel_1 = require("./components/playbacktimelabel");
var seekbar_1 = require("./components/seekbar");
var seekbarlabel_1 = require("./components/seekbarlabel");
var playbacktogglebutton_1 = require("./components/playbacktogglebutton");
var volumetogglebutton_1 = require("./components/volumetogglebutton");
var volumeslider_1 = require("./components/volumeslider");
var spacer_1 = require("./components/spacer");
var pictureinpicturetogglebutton_1 = require("./components/pictureinpicturetogglebutton");
var airplaytogglebutton_1 = require("./components/airplaytogglebutton");
var casttogglebutton_1 = require("./components/casttogglebutton");
var vrtogglebutton_1 = require("./components/vrtogglebutton");
var settingstogglebutton_1 = require("./components/settingstogglebutton");
var fullscreentogglebutton_1 = require("./components/fullscreentogglebutton");
var uicontainer_1 = require("./components/uicontainer");
var bufferingoverlay_1 = require("./components/bufferingoverlay");
var playbacktoggleoverlay_1 = require("./components/playbacktoggleoverlay");
var caststatusoverlay_1 = require("./components/caststatusoverlay");
var titlebar_1 = require("./components/titlebar");
var recommendationoverlay_1 = require("./components/recommendationoverlay");
var watermark_1 = require("./components/watermark");
var errormessageoverlay_1 = require("./components/errormessageoverlay");
var adclickoverlay_1 = require("./components/adclickoverlay");
var admessagelabel_1 = require("./components/admessagelabel");
var adskipbutton_1 = require("./components/adskipbutton");
var closebutton_1 = require("./components/closebutton");
var metadatalabel_1 = require("./components/metadatalabel");
var playerutils_1 = require("./playerutils");
var label_1 = require("./components/label");
var castuicontainer_1 = require("./components/castuicontainer");
var uimanager_1 = require("./uimanager");
var i18n_1 = require("./localization/i18n");
var UIFactory;
(function (UIFactory) {
    function buildDefaultUI(player, config) {
        if (config === void 0) { config = {}; }
        return UIFactory.buildModernUI(player, config);
    }
    UIFactory.buildDefaultUI = buildDefaultUI;
    function buildDefaultSmallScreenUI(player, config) {
        if (config === void 0) { config = {}; }
        return UIFactory.buildModernSmallScreenUI(player, config);
    }
    UIFactory.buildDefaultSmallScreenUI = buildDefaultSmallScreenUI;
    function buildDefaultCastReceiverUI(player, config) {
        if (config === void 0) { config = {}; }
        return UIFactory.buildModernCastReceiverUI(player, config);
    }
    UIFactory.buildDefaultCastReceiverUI = buildDefaultCastReceiverUI;
    function modernUI() {
        var mainSettingsPanelPage = new settingspanelpage_1.SettingsPanelPage({
            components: [
                new settingspanelitem_1.SettingsPanelItem('Resolução', new videoqualityselectbox_1.VideoQualitySelectBox()),
            ],
        });
        var settingsPanel = new settingspanel_1.SettingsPanel({
            components: [mainSettingsPanelPage],
            hidden: true,
        });
        var newControlBar = new controlbar_1.ControlBar({
            components: [
                settingsPanel,
                new container_1.Container({
                    components: [new seekbar_1.SeekBar()],
                    cssClasses: [],
                }),
                new container_1.Container({
                    components: [
                        new playbacktimelabel_1.PlaybackTimeLabel({
                            timeLabelMode: playbacktimelabel_1.PlaybackTimeLabelMode.TotalTime,
                            cssClasses: ['text-right'],
                        }),
                        new playbacktogglebutton_1.PlaybackToggleButton(),
                        new volumetogglebutton_1.VolumeToggleButton(),
                        new volumeslider_1.VolumeSlider(),
                        new spacer_1.Spacer(),
                        new settingstogglebutton_1.SettingsToggleButton({ settingsPanel: settingsPanel }),
                        new pictureinpicturetogglebutton_1.PictureInPictureToggleButton(),
                        new airplaytogglebutton_1.AirPlayToggleButton(),
                        new casttogglebutton_1.CastToggleButton(),
                        new fullscreentogglebutton_1.FullscreenToggleButton(),
                    ],
                    cssClasses: ['controlbar-bottom'],
                }),
            ],
        });
        return new uicontainer_1.UIContainer({
            components: [
                new bufferingoverlay_1.BufferingOverlay(),
                new playbacktoggleoverlay_1.PlaybackToggleOverlay({
                    hidden: true,
                }),
                new caststatusoverlay_1.CastStatusOverlay(),
                newControlBar,
                new watermark_1.Watermark({
                    url: 'https://www.sympla.com.br',
                }),
                new errormessageoverlay_1.ErrorMessageOverlay(),
            ],
            hideDelay: 2000,
            hidePlayerStateExceptions: [
                playerutils_1.PlayerUtils.PlayerState.Prepared,
                playerutils_1.PlayerUtils.PlayerState.Paused,
                playerutils_1.PlayerUtils.PlayerState.Finished,
            ],
        });
    }
    UIFactory.modernUI = modernUI;
    function modernAdsUI() {
        return new uicontainer_1.UIContainer({
            components: [
                new bufferingoverlay_1.BufferingOverlay(),
                new adclickoverlay_1.AdClickOverlay(),
                new playbacktoggleoverlay_1.PlaybackToggleOverlay(),
                new container_1.Container({
                    components: [
                        new admessagelabel_1.AdMessageLabel({ text: i18n_1.i18n.getLocalizer('ads.remainingTime') }),
                        new adskipbutton_1.AdSkipButton(),
                    ],
                    cssClass: 'ui-ads-status',
                }),
                new controlbar_1.ControlBar({
                    components: [
                        new container_1.Container({
                            components: [
                                new playbacktogglebutton_1.PlaybackToggleButton(),
                                new volumetogglebutton_1.VolumeToggleButton(),
                                new volumeslider_1.VolumeSlider(),
                                new spacer_1.Spacer(),
                                new fullscreentogglebutton_1.FullscreenToggleButton(),
                            ],
                            cssClasses: ['controlbar-bottom'],
                        }),
                    ],
                }),
            ],
            cssClasses: ['ui-skin-ads'],
            hideDelay: 2000,
            hidePlayerStateExceptions: [
                playerutils_1.PlayerUtils.PlayerState.Prepared,
                playerutils_1.PlayerUtils.PlayerState.Paused,
                playerutils_1.PlayerUtils.PlayerState.Finished,
            ],
        });
    }
    UIFactory.modernAdsUI = modernAdsUI;
    function modernSmallScreenUI() {
        var subtitleOverlay = new subtitleoverlay_1.SubtitleOverlay();
        var mainSettingsPanelPage = new settingspanelpage_1.SettingsPanelPage({
            components: [
                new settingspanelitem_1.SettingsPanelItem(i18n_1.i18n.getLocalizer('settings.video.quality'), new videoqualityselectbox_1.VideoQualitySelectBox()),
                new settingspanelitem_1.SettingsPanelItem(i18n_1.i18n.getLocalizer('speed'), new playbackspeedselectbox_1.PlaybackSpeedSelectBox()),
                new settingspanelitem_1.SettingsPanelItem(i18n_1.i18n.getLocalizer('settings.audio.track'), new audiotrackselectbox_1.AudioTrackSelectBox()),
                new settingspanelitem_1.SettingsPanelItem(i18n_1.i18n.getLocalizer('settings.audio.quality'), new audioqualityselectbox_1.AudioQualitySelectBox()),
            ],
        });
        var settingsPanel = new settingspanel_1.SettingsPanel({
            components: [
                mainSettingsPanelPage,
            ],
            hidden: true,
            pageTransitionAnimation: false,
            hideDelay: -1,
        });
        var subtitleSettingsPanelPage = new subtitlesettingspanelpage_1.SubtitleSettingsPanelPage({
            settingsPanel: settingsPanel,
            overlay: subtitleOverlay,
        });
        var subtitleSettingsOpenButton = new settingspanelpageopenbutton_1.SettingsPanelPageOpenButton({
            targetPage: subtitleSettingsPanelPage,
            container: settingsPanel,
            ariaLabel: i18n_1.i18n.getLocalizer('settings.subtitles'),
            text: i18n_1.i18n.getLocalizer('open'),
        });
        var subtitleSelectBox = new subtitleselectbox_1.SubtitleSelectBox();
        mainSettingsPanelPage.addComponent(new settingspanelitem_1.SettingsPanelItem(new subtitlesettingslabel_1.SubtitleSettingsLabel({
            text: i18n_1.i18n.getLocalizer('settings.subtitles'),
            opener: subtitleSettingsOpenButton,
        }), subtitleSelectBox, {
            role: 'menubar',
        }));
        settingsPanel.addComponent(subtitleSettingsPanelPage);
        settingsPanel.addComponent(new closebutton_1.CloseButton({ target: settingsPanel }));
        subtitleSettingsPanelPage.addComponent(new closebutton_1.CloseButton({ target: settingsPanel }));
        var controlBar = new controlbar_1.ControlBar({
            components: [
                new container_1.Container({
                    components: [
                        new playbacktimelabel_1.PlaybackTimeLabel({ timeLabelMode: playbacktimelabel_1.PlaybackTimeLabelMode.CurrentTime, hideInLivePlayback: true }),
                        new seekbar_1.SeekBar({ label: new seekbarlabel_1.SeekBarLabel() }),
                        new playbacktimelabel_1.PlaybackTimeLabel({ timeLabelMode: playbacktimelabel_1.PlaybackTimeLabelMode.TotalTime, cssClasses: ['text-right'] }),
                    ],
                    cssClasses: ['controlbar-top'],
                }),
            ],
        });
        return new uicontainer_1.UIContainer({
            components: [
                subtitleOverlay,
                new bufferingoverlay_1.BufferingOverlay(),
                new caststatusoverlay_1.CastStatusOverlay(),
                new playbacktoggleoverlay_1.PlaybackToggleOverlay(),
                new recommendationoverlay_1.RecommendationOverlay(),
                controlBar,
                new titlebar_1.TitleBar({
                    components: [
                        new metadatalabel_1.MetadataLabel({ content: metadatalabel_1.MetadataLabelContent.Title }),
                        new casttogglebutton_1.CastToggleButton(),
                        new vrtogglebutton_1.VRToggleButton(),
                        new pictureinpicturetogglebutton_1.PictureInPictureToggleButton(),
                        new airplaytogglebutton_1.AirPlayToggleButton(),
                        new volumetogglebutton_1.VolumeToggleButton(),
                        new settingstogglebutton_1.SettingsToggleButton({ settingsPanel: settingsPanel }),
                        new fullscreentogglebutton_1.FullscreenToggleButton(),
                    ],
                }),
                settingsPanel,
                new watermark_1.Watermark(),
                new errormessageoverlay_1.ErrorMessageOverlay(),
            ],
            cssClasses: ['ui-skin-smallscreen'],
            hideDelay: 2000,
            hidePlayerStateExceptions: [
                playerutils_1.PlayerUtils.PlayerState.Prepared,
                playerutils_1.PlayerUtils.PlayerState.Paused,
                playerutils_1.PlayerUtils.PlayerState.Finished,
            ],
        });
    }
    UIFactory.modernSmallScreenUI = modernSmallScreenUI;
    function modernSmallScreenAdsUI() {
        return new uicontainer_1.UIContainer({
            components: [
                new bufferingoverlay_1.BufferingOverlay(),
                new adclickoverlay_1.AdClickOverlay(),
                new playbacktoggleoverlay_1.PlaybackToggleOverlay(),
                new titlebar_1.TitleBar({
                    components: [
                        // dummy label with no content to move buttons to the right
                        new label_1.Label({ cssClass: 'label-metadata-title' }),
                        new fullscreentogglebutton_1.FullscreenToggleButton(),
                    ],
                }),
                new container_1.Container({
                    components: [
                        new admessagelabel_1.AdMessageLabel({ text: 'Ad: {remainingTime} secs' }),
                        new adskipbutton_1.AdSkipButton(),
                    ],
                    cssClass: 'ui-ads-status',
                }),
            ],
            cssClasses: ['ui-skin-ads', 'ui-skin-smallscreen'],
            hideDelay: 2000,
            hidePlayerStateExceptions: [
                playerutils_1.PlayerUtils.PlayerState.Prepared,
                playerutils_1.PlayerUtils.PlayerState.Paused,
                playerutils_1.PlayerUtils.PlayerState.Finished,
            ],
        });
    }
    UIFactory.modernSmallScreenAdsUI = modernSmallScreenAdsUI;
    function modernCastReceiverUI() {
        var controlBar = new controlbar_1.ControlBar({
            components: [
                new container_1.Container({
                    components: [
                        new playbacktimelabel_1.PlaybackTimeLabel({ timeLabelMode: playbacktimelabel_1.PlaybackTimeLabelMode.CurrentTime, hideInLivePlayback: true }),
                        new seekbar_1.SeekBar({ smoothPlaybackPositionUpdateIntervalMs: -1 }),
                        new playbacktimelabel_1.PlaybackTimeLabel({ timeLabelMode: playbacktimelabel_1.PlaybackTimeLabelMode.TotalTime, cssClasses: ['text-right'] }),
                    ],
                    cssClasses: ['controlbar-top'],
                }),
            ],
        });
        return new castuicontainer_1.CastUIContainer({
            components: [
                new subtitleoverlay_1.SubtitleOverlay(),
                new bufferingoverlay_1.BufferingOverlay(),
                new playbacktoggleoverlay_1.PlaybackToggleOverlay(),
                new watermark_1.Watermark(),
                controlBar,
                new titlebar_1.TitleBar({ keepHiddenWithoutMetadata: true }),
                new errormessageoverlay_1.ErrorMessageOverlay(),
            ],
            cssClasses: ['ui-skin-cast-receiver'],
            hideDelay: 2000,
            hidePlayerStateExceptions: [
                playerutils_1.PlayerUtils.PlayerState.Prepared,
                playerutils_1.PlayerUtils.PlayerState.Paused,
                playerutils_1.PlayerUtils.PlayerState.Finished,
            ],
        });
    }
    UIFactory.modernCastReceiverUI = modernCastReceiverUI;
    function buildModernUI(player, config) {
        if (config === void 0) { config = {}; }
        // show smallScreen UI only on mobile/handheld devices
        var smallScreenSwitchWidth = 600;
        return new uimanager_1.UIManager(player, [{
                ui: modernSmallScreenAdsUI(),
                condition: function (context) {
                    return context.isMobile && context.documentWidth < smallScreenSwitchWidth && context.isAd
                        && context.adRequiresUi;
                },
            }, {
                ui: modernAdsUI(),
                condition: function (context) {
                    return context.isAd && context.adRequiresUi;
                },
            }, {
                ui: modernSmallScreenUI(),
                condition: function (context) {
                    return !context.isAd && !context.adRequiresUi && context.isMobile
                        && context.documentWidth < smallScreenSwitchWidth;
                },
            }, {
                ui: modernUI(),
                condition: function (context) {
                    return !context.isAd && !context.adRequiresUi;
                },
            }], config);
    }
    UIFactory.buildModernUI = buildModernUI;
    function buildModernSmallScreenUI(player, config) {
        if (config === void 0) { config = {}; }
        return new uimanager_1.UIManager(player, [{
                ui: modernSmallScreenAdsUI(),
                condition: function (context) {
                    return context.isAd && context.adRequiresUi;
                },
            }, {
                ui: modernSmallScreenUI(),
                condition: function (context) {
                    return !context.isAd && !context.adRequiresUi;
                },
            }], config);
    }
    UIFactory.buildModernSmallScreenUI = buildModernSmallScreenUI;
    function buildModernCastReceiverUI(player, config) {
        if (config === void 0) { config = {}; }
        return new uimanager_1.UIManager(player, modernCastReceiverUI(), config);
    }
    UIFactory.buildModernCastReceiverUI = buildModernCastReceiverUI;
})(UIFactory = exports.UIFactory || (exports.UIFactory = {}));
