import { LocalizationConfig } from '../uimanager.js';
export declare const defaultVocabularies: Vocabularies;
declare type Localizer = () => string;
export declare type LocalizableText = string | Localizer;
interface Vocabulary {
    'settings.video.quality': string;
    'settings.audio.quality': string;
    'settings.audio.track': string;
    'settings.audio.mute': string;
    'settings.audio.volume': string;
    'settings.subtitles': string;
    'settings.subtitles.font.color': string;
    'settings.subtitles.font.opacity': string;
    'settings.subtitles.background.color': string;
    'settings.subtitles.background.opacity': string;
    'settings.subtitles.font.size': string;
    'settings.subtitles.characterEdge': string;
    'settings.subtitles.characterEdge.raised': string;
    'settings.subtitles.characterEdge.depressed': string;
    'settings.subtitles.characterEdge.uniform': string;
    'settings.subtitles.characterEdge.dropshadowed': string;
    'settings.subtitles.font.family': string;
    'settings.subtitles.font.family.monospacedserif': string;
    'settings.subtitles.font.family.proportionalserif': string;
    'settings.subtitles.font.family.monospacedsansserif': string;
    'settings.subtitles.font.family.proportionalsansserif': string;
    'settings.subtitles.font.family.casual': string;
    'settings.subtitles.font.family.cursive': string;
    'settings.subtitles.font.family.smallcapital': string;
    'settings.subtitles.window.color': string;
    'settings.subtitles.window.opacity': string;
    'play': string;
    'settings.time.hours': string;
    'settings.time.minutes': string;
    'settings.time.seconds': string;
    'colors.white': string;
    'colors.black': string;
    'colors.red': string;
    'colors.green': string;
    'colors.blue': string;
    'colors.cyan': string;
    'colors.yellow': string;
    'colors.magenta': string;
    'percent': string;
    'settings': string;
    'ads.remainingTime': string;
    'pictureInPicture': string;
    'appleAirplay': string;
    'googleCast': string;
    'vr': string;
    'off': string;
    'auto': string;
    'back': string;
    'reset': string;
    'replay': string;
    'normal': string;
    'default': string;
    'open': string;
    'close': string;
    'fullscreen': string;
    'speed': string;
    'playPause': string;
    'live': string;
    'subtitle.example': string;
    'subtitle.select': string;
    'playingOn': string;
    'connectingTo': string;
    'watermarkLink': string;
    'controlBar': string;
    'player': string;
    'seekBar': string;
    'seekBar.value': string;
    'seekBar.timeshift': string;
    'seekBar.durationText': string;
}
export declare type CustomVocabulary<V> = V & Partial<Vocabulary>;
export interface Vocabularies {
    [key: string]: CustomVocabulary<Record<string, string>>;
}
declare class I18n {
    private language;
    private vocabulary;
    constructor(config: LocalizationConfig);
    setConfig(config: LocalizationConfig): void;
    private static containsLanguage;
    private mergeVocabulariesWithDefaultVocabularies;
    private initializeLanguage;
    private initializeVocabulary;
    private replaceVariableWithPlaceholderIfExists;
    getLocalizer<V extends CustomVocabulary<Record<string, string>> = CustomVocabulary<Record<string, string>>>(key: keyof V, config?: Record<string, string | number>): Localizer;
    performLocalization(text: LocalizableText): string;
}
export declare const i18n: I18n;
export {};