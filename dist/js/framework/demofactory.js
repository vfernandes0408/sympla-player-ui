"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoFactory = void 0;
var vrtogglebutton_1 = require("./components/vrtogglebutton");
var settingstogglebutton_1 = require("./components/settingstogglebutton");
var volumeslider_1 = require("./components/volumeslider");
var playbacktimelabel_1 = require("./components/playbacktimelabel");
var airplaytogglebutton_1 = require("./components/airplaytogglebutton");
var errormessageoverlay_1 = require("./components/errormessageoverlay");
var controlbar_1 = require("./components/controlbar");
var casttogglebutton_1 = require("./components/casttogglebutton");
var fullscreentogglebutton_1 = require("./components/fullscreentogglebutton");
var recommendationoverlay_1 = require("./components/recommendationoverlay");
var playbackspeedselectbox_1 = require("./components/playbackspeedselectbox");
var audioqualityselectbox_1 = require("./components/audioqualityselectbox");
var caststatusoverlay_1 = require("./components/caststatusoverlay");
var uicontainer_1 = require("./components/uicontainer");
var watermark_1 = require("./components/watermark");
var subtitleoverlay_1 = require("./components/subtitleoverlay");
var settingspanel_1 = require("./components/settingspanel");
var seekbarlabel_1 = require("./components/seekbarlabel");
var playbacktoggleoverlay_1 = require("./components/playbacktoggleoverlay");
var pictureinpicturetogglebutton_1 = require("./components/pictureinpicturetogglebutton");
var spacer_1 = require("./components/spacer");
var container_1 = require("./components/container");
var volumetogglebutton_1 = require("./components/volumetogglebutton");
var playbacktogglebutton_1 = require("./components/playbacktogglebutton");
var seekbar_1 = require("./components/seekbar");
var videoqualityselectbox_1 = require("./components/videoqualityselectbox");
var uimanager_1 = require("./uimanager");
var titlebar_1 = require("./components/titlebar");
var bufferingoverlay_1 = require("./components/bufferingoverlay");
var subtitlelistbox_1 = require("./components/subtitlelistbox");
var audiotracklistbox_1 = require("./components/audiotracklistbox");
var settingspanelitem_1 = require("./components/settingspanelitem");
var settingspanelpage_1 = require("./components/settingspanelpage");
var uifactory_1 = require("./uifactory");
var DemoFactory;
(function (DemoFactory) {
    function buildDemoWithSeparateAudioSubtitlesButtons(player, config) {
        if (config === void 0) { config = {}; }
        // show smallScreen UI only on mobile/handheld devices
        var smallScreenSwitchWidth = 600;
        return new uimanager_1.UIManager(player, [{
                ui: uifactory_1.UIFactory.modernSmallScreenAdsUI(),
                condition: function (context) {
                    return context.isMobile && context.documentWidth < smallScreenSwitchWidth
                        && context.isAd && context.adRequiresUi;
                },
            }, {
                ui: uifactory_1.UIFactory.modernAdsUI(),
                condition: function (context) {
                    return context.isAd && context.adRequiresUi;
                },
            }, {
                ui: uifactory_1.UIFactory.modernSmallScreenUI(),
                condition: function (context) {
                    return context.isMobile && context.documentWidth < smallScreenSwitchWidth;
                },
            }, {
                ui: modernUIWithSeparateAudioSubtitlesButtons(),
            }], config);
    }
    DemoFactory.buildDemoWithSeparateAudioSubtitlesButtons = buildDemoWithSeparateAudioSubtitlesButtons;
    function modernUIWithSeparateAudioSubtitlesButtons() {
        var subtitleOverlay = new subtitleoverlay_1.SubtitleOverlay();
        var settingsPanel = new settingspanel_1.SettingsPanel({
            components: [
                new settingspanelpage_1.SettingsPanelPage({
                    components: [
                        new settingspanelitem_1.SettingsPanelItem('Video Quality', new videoqualityselectbox_1.VideoQualitySelectBox()),
                        new settingspanelitem_1.SettingsPanelItem('Speed', new playbackspeedselectbox_1.PlaybackSpeedSelectBox()),
                        new settingspanelitem_1.SettingsPanelItem('Audio Quality', new audioqualityselectbox_1.AudioQualitySelectBox()),
                    ],
                }),
            ],
            hidden: true,
        });
        var subtitleListBox = new subtitlelistbox_1.SubtitleListBox();
        var subtitleSettingsPanel = new settingspanel_1.SettingsPanel({
            components: [
                new settingspanelpage_1.SettingsPanelPage({
                    components: [
                        new settingspanelitem_1.SettingsPanelItem(null, subtitleListBox),
                    ],
                }),
            ],
            hidden: true,
        });
        var audioTrackListBox = new audiotracklistbox_1.AudioTrackListBox();
        var audioTrackSettingsPanel = new settingspanel_1.SettingsPanel({
            components: [
                new settingspanelpage_1.SettingsPanelPage({
                    components: [
                        new settingspanelitem_1.SettingsPanelItem(null, audioTrackListBox),
                    ],
                }),
            ],
            hidden: true,
        });
        var controlBar = new controlbar_1.ControlBar({
            components: [
                audioTrackSettingsPanel,
                subtitleSettingsPanel,
                settingsPanel,
                new container_1.Container({
                    components: [
                        new playbacktimelabel_1.PlaybackTimeLabel({ timeLabelMode: playbacktimelabel_1.PlaybackTimeLabelMode.CurrentTime, hideInLivePlayback: true }),
                        new seekbar_1.SeekBar({ label: new seekbarlabel_1.SeekBarLabel() }),
                        new playbacktimelabel_1.PlaybackTimeLabel({ timeLabelMode: playbacktimelabel_1.PlaybackTimeLabelMode.TotalTime, cssClasses: ['text-right'] }),
                    ],
                    cssClasses: ['controlbar-top'],
                }),
                new container_1.Container({
                    components: [
                        new playbacktogglebutton_1.PlaybackToggleButton(),
                        new volumetogglebutton_1.VolumeToggleButton(),
                        new volumeslider_1.VolumeSlider(),
                        new spacer_1.Spacer(),
                        new pictureinpicturetogglebutton_1.PictureInPictureToggleButton(),
                        new airplaytogglebutton_1.AirPlayToggleButton(),
                        new casttogglebutton_1.CastToggleButton(),
                        new vrtogglebutton_1.VRToggleButton(),
                        new settingstogglebutton_1.SettingsToggleButton({
                            settingsPanel: audioTrackSettingsPanel,
                            cssClass: 'ui-audiotracksettingstogglebutton',
                        }),
                        new settingstogglebutton_1.SettingsToggleButton({
                            settingsPanel: subtitleSettingsPanel,
                            cssClass: 'ui-subtitlesettingstogglebutton',
                        }),
                        new settingstogglebutton_1.SettingsToggleButton({ settingsPanel: settingsPanel }),
                        new fullscreentogglebutton_1.FullscreenToggleButton(),
                    ],
                    cssClasses: ['controlbar-bottom'],
                }),
            ],
        });
        return new uicontainer_1.UIContainer({
            components: [
                subtitleOverlay,
                new bufferingoverlay_1.BufferingOverlay(),
                new playbacktoggleoverlay_1.PlaybackToggleOverlay(),
                new caststatusoverlay_1.CastStatusOverlay(),
                controlBar,
                new titlebar_1.TitleBar(),
                new recommendationoverlay_1.RecommendationOverlay(),
                new watermark_1.Watermark(),
                new errormessageoverlay_1.ErrorMessageOverlay(),
            ],
        });
    }
})(DemoFactory = exports.DemoFactory || (exports.DemoFactory = {}));
