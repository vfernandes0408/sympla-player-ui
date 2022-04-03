"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.i18n = exports.defaultVocabularies = void 0;
var de_json_1 = __importDefault(require("./languages/de.json"));
var en_json_1 = __importDefault(require("./languages/en.json"));
exports.defaultVocabularies = {
    'en': en_json_1.default,
    'de': de_json_1.default,
};
var defaultLocalizationConfig = {
    language: 'en',
    vocabularies: exports.defaultVocabularies,
};
var I18n = /** @class */ (function () {
    function I18n(config) {
        this.setConfig(config);
    }
    I18n.prototype.setConfig = function (config) {
        var mergedConfig = __assign(__assign({}, defaultLocalizationConfig), config);
        var detectBrowserLanguage = mergedConfig.language === 'auto';
        var vocabularies = this.mergeVocabulariesWithDefaultVocabularies(mergedConfig.vocabularies);
        this.initializeLanguage(mergedConfig.language, detectBrowserLanguage, vocabularies);
        this.initializeVocabulary(vocabularies);
    };
    I18n.containsLanguage = function (vocabularies, language) {
        return vocabularies.hasOwnProperty(language);
    };
    I18n.prototype.mergeVocabulariesWithDefaultVocabularies = function (vocabularies) {
        if (vocabularies === void 0) { vocabularies = {}; }
        var rawVocabularies = __assign(__assign({}, exports.defaultVocabularies), vocabularies);
        return Object.keys(rawVocabularies).reduce(function (mergedVocabularies, language) {
            var _a;
            var vocabulary = rawVocabularies[language];
            if (I18n.containsLanguage(exports.defaultVocabularies, language) && I18n.containsLanguage(vocabularies, language)) {
                vocabulary = __assign(__assign({}, exports.defaultVocabularies[language]), vocabularies[language]);
            }
            return __assign(__assign({}, mergedVocabularies), (_a = {}, _a[language] = vocabulary, _a));
        }, {});
    };
    I18n.prototype.initializeLanguage = function (language, browserLanguageDetectionEnabled, vocabularies) {
        if (browserLanguageDetectionEnabled) {
            var userLanguage = window.navigator.language;
            if (I18n.containsLanguage(vocabularies, userLanguage)) {
                this.language = userLanguage;
                return;
            }
            var shortenedUserLanguage = userLanguage.slice(0, 2);
            if (I18n.containsLanguage(vocabularies, shortenedUserLanguage)) {
                this.language = shortenedUserLanguage;
                return;
            }
        }
        this.language = language;
    };
    I18n.prototype.initializeVocabulary = function (vocabularies) {
        this.vocabulary = ['en', this.language]
            .reduce(function (vocab, lang) { return (__assign(__assign({}, vocab), (vocabularies[lang] || {}))); }, {});
    };
    I18n.prototype.replaceVariableWithPlaceholderIfExists = function (text, config) {
        var matches = text.match(new RegExp('{[a-zA-Z0-9]+}', 'g'));
        if (matches.length === 0) {
            return text;
        }
        return matches
            .map(function (m) { return ({ match: m, key: m.slice(1, -1) }); })
            .reduce(function (str, _a) {
            var key = _a.key, match = _a.match;
            return config.hasOwnProperty(key) ? str.replace(match, config[key]) : str;
        }, text);
    };
    I18n.prototype.getLocalizer = function (key, config) {
        var _this = this;
        return function () {
            if (key == null) { // because sometimes we call toDomElement() without configuring the component or setting text...
                return undefined;
            }
            var vocabularyString = _this.vocabulary[key];
            if (vocabularyString == null) {
                vocabularyString = key;
            }
            if (config != null) {
                vocabularyString = _this.replaceVariableWithPlaceholderIfExists(vocabularyString, config);
            }
            return vocabularyString;
        };
    };
    I18n.prototype.performLocalization = function (text) {
        return typeof text === 'function' ? text() : text;
    };
    return I18n;
}());
exports.i18n = new I18n(defaultLocalizationConfig);
