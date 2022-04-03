"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.version = void 0;
exports.version = '4.0.2';
// Management
var uimanager_1 = require("./uimanager");
Object.defineProperty(exports, "UIManager", { enumerable: true, get: function () { return uimanager_1.UIManager; } });
Object.defineProperty(exports, "UIInstanceManager", { enumerable: true, get: function () { return uimanager_1.UIInstanceManager; } });
// Factories
var uifactory_1 = require("./uifactory");
Object.defineProperty(exports, "UIFactory", { enumerable: true, get: function () { return uifactory_1.UIFactory; } });
var demofactory_1 = require("./demofactory");
Object.defineProperty(exports, "DemoFactory", { enumerable: true, get: function () { return demofactory_1.DemoFactory; } });
// Utils
var arrayutils_1 = require("./arrayutils");
Object.defineProperty(exports, "ArrayUtils", { enumerable: true, get: function () { return arrayutils_1.ArrayUtils; } });
var stringutils_1 = require("./stringutils");
Object.defineProperty(exports, "StringUtils", { enumerable: true, get: function () { return stringutils_1.StringUtils; } });
var playerutils_1 = require("./playerutils");
Object.defineProperty(exports, "PlayerUtils", { enumerable: true, get: function () { return playerutils_1.PlayerUtils; } });
var uiutils_1 = require("./uiutils");
Object.defineProperty(exports, "UIUtils", { enumerable: true, get: function () { return uiutils_1.UIUtils; } });
var browserutils_1 = require("./browserutils");
Object.defineProperty(exports, "BrowserUtils", { enumerable: true, get: function () { return browserutils_1.BrowserUtils; } });
var storageutils_1 = require("./storageutils");
Object.defineProperty(exports, "StorageUtils", { enumerable: true, get: function () { return storageutils_1.StorageUtils; } });
var errorutils_1 = require("./errorutils");
Object.defineProperty(exports, "ErrorUtils", { enumerable: true, get: function () { return errorutils_1.ErrorUtils; } });
// Components
var button_1 = require("./components/button");
Object.defineProperty(exports, "Button", { enumerable: true, get: function () { return button_1.Button; } });
var controlbar_1 = require("./components/controlbar");
Object.defineProperty(exports, "ControlBar", { enumerable: true, get: function () { return controlbar_1.ControlBar; } });
var fullscreentogglebutton_1 = require("./components/fullscreentogglebutton");
Object.defineProperty(exports, "FullscreenToggleButton", { enumerable: true, get: function () { return fullscreentogglebutton_1.FullscreenToggleButton; } });
var hugeplaybacktogglebutton_1 = require("./components/hugeplaybacktogglebutton");
Object.defineProperty(exports, "HugePlaybackToggleButton", { enumerable: true, get: function () { return hugeplaybacktogglebutton_1.HugePlaybackToggleButton; } });
var playbacktimelabel_1 = require("./components/playbacktimelabel");
Object.defineProperty(exports, "PlaybackTimeLabel", { enumerable: true, get: function () { return playbacktimelabel_1.PlaybackTimeLabel; } });
Object.defineProperty(exports, "PlaybackTimeLabelMode", { enumerable: true, get: function () { return playbacktimelabel_1.PlaybackTimeLabelMode; } });
var playbacktogglebutton_1 = require("./components/playbacktogglebutton");
Object.defineProperty(exports, "PlaybackToggleButton", { enumerable: true, get: function () { return playbacktogglebutton_1.PlaybackToggleButton; } });
var seekbar_1 = require("./components/seekbar");
Object.defineProperty(exports, "SeekBar", { enumerable: true, get: function () { return seekbar_1.SeekBar; } });
var selectbox_1 = require("./components/selectbox");
Object.defineProperty(exports, "SelectBox", { enumerable: true, get: function () { return selectbox_1.SelectBox; } });
var itemselectionlist_1 = require("./components/itemselectionlist");
Object.defineProperty(exports, "ItemSelectionList", { enumerable: true, get: function () { return itemselectionlist_1.ItemSelectionList; } });
var settingspanel_1 = require("./components/settingspanel");
Object.defineProperty(exports, "SettingsPanel", { enumerable: true, get: function () { return settingspanel_1.SettingsPanel; } });
var settingstogglebutton_1 = require("./components/settingstogglebutton");
Object.defineProperty(exports, "SettingsToggleButton", { enumerable: true, get: function () { return settingstogglebutton_1.SettingsToggleButton; } });
var togglebutton_1 = require("./components/togglebutton");
Object.defineProperty(exports, "ToggleButton", { enumerable: true, get: function () { return togglebutton_1.ToggleButton; } });
var videoqualityselectbox_1 = require("./components/videoqualityselectbox");
Object.defineProperty(exports, "VideoQualitySelectBox", { enumerable: true, get: function () { return videoqualityselectbox_1.VideoQualitySelectBox; } });
var volumetogglebutton_1 = require("./components/volumetogglebutton");
Object.defineProperty(exports, "VolumeToggleButton", { enumerable: true, get: function () { return volumetogglebutton_1.VolumeToggleButton; } });
var vrtogglebutton_1 = require("./components/vrtogglebutton");
Object.defineProperty(exports, "VRToggleButton", { enumerable: true, get: function () { return vrtogglebutton_1.VRToggleButton; } });
var watermark_1 = require("./components/watermark");
Object.defineProperty(exports, "Watermark", { enumerable: true, get: function () { return watermark_1.Watermark; } });
var uicontainer_1 = require("./components/uicontainer");
Object.defineProperty(exports, "UIContainer", { enumerable: true, get: function () { return uicontainer_1.UIContainer; } });
var container_1 = require("./components/container");
Object.defineProperty(exports, "Container", { enumerable: true, get: function () { return container_1.Container; } });
var label_1 = require("./components/label");
Object.defineProperty(exports, "Label", { enumerable: true, get: function () { return label_1.Label; } });
var audioqualityselectbox_1 = require("./components/audioqualityselectbox");
Object.defineProperty(exports, "AudioQualitySelectBox", { enumerable: true, get: function () { return audioqualityselectbox_1.AudioQualitySelectBox; } });
var audiotrackselectbox_1 = require("./components/audiotrackselectbox");
Object.defineProperty(exports, "AudioTrackSelectBox", { enumerable: true, get: function () { return audiotrackselectbox_1.AudioTrackSelectBox; } });
var caststatusoverlay_1 = require("./components/caststatusoverlay");
Object.defineProperty(exports, "CastStatusOverlay", { enumerable: true, get: function () { return caststatusoverlay_1.CastStatusOverlay; } });
var casttogglebutton_1 = require("./components/casttogglebutton");
Object.defineProperty(exports, "CastToggleButton", { enumerable: true, get: function () { return casttogglebutton_1.CastToggleButton; } });
var component_1 = require("./components/component");
Object.defineProperty(exports, "Component", { enumerable: true, get: function () { return component_1.Component; } });
var errormessageoverlay_1 = require("./components/errormessageoverlay");
Object.defineProperty(exports, "ErrorMessageOverlay", { enumerable: true, get: function () { return errormessageoverlay_1.ErrorMessageOverlay; } });
var recommendationoverlay_1 = require("./components/recommendationoverlay");
Object.defineProperty(exports, "RecommendationOverlay", { enumerable: true, get: function () { return recommendationoverlay_1.RecommendationOverlay; } });
var seekbarlabel_1 = require("./components/seekbarlabel");
Object.defineProperty(exports, "SeekBarLabel", { enumerable: true, get: function () { return seekbarlabel_1.SeekBarLabel; } });
var subtitleoverlay_1 = require("./components/subtitleoverlay");
Object.defineProperty(exports, "SubtitleOverlay", { enumerable: true, get: function () { return subtitleoverlay_1.SubtitleOverlay; } });
var subtitleselectbox_1 = require("./components/subtitleselectbox");
Object.defineProperty(exports, "SubtitleSelectBox", { enumerable: true, get: function () { return subtitleselectbox_1.SubtitleSelectBox; } });
var titlebar_1 = require("./components/titlebar");
Object.defineProperty(exports, "TitleBar", { enumerable: true, get: function () { return titlebar_1.TitleBar; } });
var volumecontrolbutton_1 = require("./components/volumecontrolbutton");
Object.defineProperty(exports, "VolumeControlButton", { enumerable: true, get: function () { return volumecontrolbutton_1.VolumeControlButton; } });
var clickoverlay_1 = require("./components/clickoverlay");
Object.defineProperty(exports, "ClickOverlay", { enumerable: true, get: function () { return clickoverlay_1.ClickOverlay; } });
var adskipbutton_1 = require("./components/adskipbutton");
Object.defineProperty(exports, "AdSkipButton", { enumerable: true, get: function () { return adskipbutton_1.AdSkipButton; } });
var admessagelabel_1 = require("./components/admessagelabel");
Object.defineProperty(exports, "AdMessageLabel", { enumerable: true, get: function () { return admessagelabel_1.AdMessageLabel; } });
var adclickoverlay_1 = require("./components/adclickoverlay");
Object.defineProperty(exports, "AdClickOverlay", { enumerable: true, get: function () { return adclickoverlay_1.AdClickOverlay; } });
var playbackspeedselectbox_1 = require("./components/playbackspeedselectbox");
Object.defineProperty(exports, "PlaybackSpeedSelectBox", { enumerable: true, get: function () { return playbackspeedselectbox_1.PlaybackSpeedSelectBox; } });
var hugereplaybutton_1 = require("./components/hugereplaybutton");
Object.defineProperty(exports, "HugeReplayButton", { enumerable: true, get: function () { return hugereplaybutton_1.HugeReplayButton; } });
var bufferingoverlay_1 = require("./components/bufferingoverlay");
Object.defineProperty(exports, "BufferingOverlay", { enumerable: true, get: function () { return bufferingoverlay_1.BufferingOverlay; } });
var castuicontainer_1 = require("./components/castuicontainer");
Object.defineProperty(exports, "CastUIContainer", { enumerable: true, get: function () { return castuicontainer_1.CastUIContainer; } });
var playbacktoggleoverlay_1 = require("./components/playbacktoggleoverlay");
Object.defineProperty(exports, "PlaybackToggleOverlay", { enumerable: true, get: function () { return playbacktoggleoverlay_1.PlaybackToggleOverlay; } });
var closebutton_1 = require("./components/closebutton");
Object.defineProperty(exports, "CloseButton", { enumerable: true, get: function () { return closebutton_1.CloseButton; } });
var metadatalabel_1 = require("./components/metadatalabel");
Object.defineProperty(exports, "MetadataLabel", { enumerable: true, get: function () { return metadatalabel_1.MetadataLabel; } });
Object.defineProperty(exports, "MetadataLabelContent", { enumerable: true, get: function () { return metadatalabel_1.MetadataLabelContent; } });
var airplaytogglebutton_1 = require("./components/airplaytogglebutton");
Object.defineProperty(exports, "AirPlayToggleButton", { enumerable: true, get: function () { return airplaytogglebutton_1.AirPlayToggleButton; } });
var volumeslider_1 = require("./components/volumeslider");
Object.defineProperty(exports, "VolumeSlider", { enumerable: true, get: function () { return volumeslider_1.VolumeSlider; } });
var pictureinpicturetogglebutton_1 = require("./components/pictureinpicturetogglebutton");
Object.defineProperty(exports, "PictureInPictureToggleButton", { enumerable: true, get: function () { return pictureinpicturetogglebutton_1.PictureInPictureToggleButton; } });
var spacer_1 = require("./components/spacer");
Object.defineProperty(exports, "Spacer", { enumerable: true, get: function () { return spacer_1.Spacer; } });
var backgroundcolorselectbox_1 = require("./components/subtitlesettings/backgroundcolorselectbox");
Object.defineProperty(exports, "BackgroundColorSelectBox", { enumerable: true, get: function () { return backgroundcolorselectbox_1.BackgroundColorSelectBox; } });
var backgroundopacityselectbox_1 = require("./components/subtitlesettings/backgroundopacityselectbox");
Object.defineProperty(exports, "BackgroundOpacitySelectBox", { enumerable: true, get: function () { return backgroundopacityselectbox_1.BackgroundOpacitySelectBox; } });
var characteredgeselectbox_1 = require("./components/subtitlesettings/characteredgeselectbox");
Object.defineProperty(exports, "CharacterEdgeSelectBox", { enumerable: true, get: function () { return characteredgeselectbox_1.CharacterEdgeSelectBox; } });
var fontcolorselectbox_1 = require("./components/subtitlesettings/fontcolorselectbox");
Object.defineProperty(exports, "FontColorSelectBox", { enumerable: true, get: function () { return fontcolorselectbox_1.FontColorSelectBox; } });
var fontfamilyselectbox_1 = require("./components/subtitlesettings/fontfamilyselectbox");
Object.defineProperty(exports, "FontFamilySelectBox", { enumerable: true, get: function () { return fontfamilyselectbox_1.FontFamilySelectBox; } });
var fontopacityselectbox_1 = require("./components/subtitlesettings/fontopacityselectbox");
Object.defineProperty(exports, "FontOpacitySelectBox", { enumerable: true, get: function () { return fontopacityselectbox_1.FontOpacitySelectBox; } });
var fontsizeselectbox_1 = require("./components/subtitlesettings/fontsizeselectbox");
Object.defineProperty(exports, "FontSizeSelectBox", { enumerable: true, get: function () { return fontsizeselectbox_1.FontSizeSelectBox; } });
var subtitlesettingselectbox_1 = require("./components/subtitlesettings/subtitlesettingselectbox");
Object.defineProperty(exports, "SubtitleSettingSelectBox", { enumerable: true, get: function () { return subtitlesettingselectbox_1.SubtitleSettingSelectBox; } });
var subtitlesettingslabel_1 = require("./components/subtitlesettings/subtitlesettingslabel");
Object.defineProperty(exports, "SubtitleSettingsLabel", { enumerable: true, get: function () { return subtitlesettingslabel_1.SubtitleSettingsLabel; } });
var windowcolorselectbox_1 = require("./components/subtitlesettings/windowcolorselectbox");
Object.defineProperty(exports, "WindowColorSelectBox", { enumerable: true, get: function () { return windowcolorselectbox_1.WindowColorSelectBox; } });
var windowopacityselectbox_1 = require("./components/subtitlesettings/windowopacityselectbox");
Object.defineProperty(exports, "WindowOpacitySelectBox", { enumerable: true, get: function () { return windowopacityselectbox_1.WindowOpacitySelectBox; } });
var subtitlesettingsresetbutton_1 = require("./components/subtitlesettings/subtitlesettingsresetbutton");
Object.defineProperty(exports, "SubtitleSettingsResetButton", { enumerable: true, get: function () { return subtitlesettingsresetbutton_1.SubtitleSettingsResetButton; } });
var listbox_1 = require("./components/listbox");
Object.defineProperty(exports, "ListBox", { enumerable: true, get: function () { return listbox_1.ListBox; } });
var subtitlelistbox_1 = require("./components/subtitlelistbox");
Object.defineProperty(exports, "SubtitleListBox", { enumerable: true, get: function () { return subtitlelistbox_1.SubtitleListBox; } });
var audiotracklistbox_1 = require("./components/audiotracklistbox");
Object.defineProperty(exports, "AudioTrackListBox", { enumerable: true, get: function () { return audiotracklistbox_1.AudioTrackListBox; } });
var settingspanelpage_1 = require("./components/settingspanelpage");
Object.defineProperty(exports, "SettingsPanelPage", { enumerable: true, get: function () { return settingspanelpage_1.SettingsPanelPage; } });
var settingspanelpagebackbutton_1 = require("./components/settingspanelpagebackbutton");
Object.defineProperty(exports, "SettingsPanelPageBackButton", { enumerable: true, get: function () { return settingspanelpagebackbutton_1.SettingsPanelPageBackButton; } });
var settingspanelpageopenbutton_1 = require("./components/settingspanelpageopenbutton");
Object.defineProperty(exports, "SettingsPanelPageOpenButton", { enumerable: true, get: function () { return settingspanelpageopenbutton_1.SettingsPanelPageOpenButton; } });
var subtitlesettingspanelpage_1 = require("./components/subtitlesettings/subtitlesettingspanelpage");
Object.defineProperty(exports, "SubtitleSettingsPanelPage", { enumerable: true, get: function () { return subtitlesettingspanelpage_1.SubtitleSettingsPanelPage; } });
var settingspanelitem_1 = require("./components/settingspanelitem");
Object.defineProperty(exports, "SettingsPanelItem", { enumerable: true, get: function () { return settingspanelitem_1.SettingsPanelItem; } });
// Object.assign polyfill for ES5/IE9
// https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
if (typeof Object.assign !== 'function') {
    Object.assign = function (target) {
        'use strict';
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }
        target = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source != null) {
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
        }
        return target;
    };
}
