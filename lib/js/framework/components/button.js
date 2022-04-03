"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
var component_1 = require("./component");
var dom_1 = require("../dom");
var eventdispatcher_1 = require("../eventdispatcher");
var i18n_1 = require("../localization/i18n");
/**
 * A simple clickable button.
 */
var Button = /** @class */ (function (_super) {
    __extends(Button, _super);
    function Button(config) {
        var _this = _super.call(this, config) || this;
        _this.buttonEvents = {
            onClick: new eventdispatcher_1.EventDispatcher(),
        };
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-button',
            role: 'button',
            tabIndex: 0,
        }, _this.config);
        return _this;
    }
    Button.prototype.toDomElement = function () {
        var _this = this;
        var buttonElementAttributes = {
            'id': this.config.id,
            'aria-label': i18n_1.i18n.performLocalization(this.config.ariaLabel || this.config.text),
            'class': this.getCssClasses(),
            'type': 'button',
            /**
            * WCAG20 standard to display if a button is pressed or not
            */
            'aria-pressed': 'false',
            'tabindex': this.config.tabIndex.toString(),
        };
        if (this.config.role != null) {
            buttonElementAttributes['role'] = this.config.role;
        }
        // Create the button element with the text label
        var buttonElement = new dom_1.DOM('button', buttonElementAttributes).append(new dom_1.DOM('span', {
            'class': this.prefixCss('label'),
        }).html(i18n_1.i18n.performLocalization(this.config.text)));
        // Listen for the click event on the button element and trigger the corresponding event on the button component
        buttonElement.on('click', function () {
            _this.onClickEvent();
        });
        return buttonElement;
    };
    /**
     * Sets text on the label of the button.
     * @param text the text to put into the label of the button
     */
    Button.prototype.setText = function (text) {
        this.getDomElement().find('.' + this.prefixCss('label')).html(i18n_1.i18n.performLocalization(text));
    };
    Button.prototype.onClickEvent = function () {
        this.buttonEvents.onClick.dispatch(this);
    };
    Object.defineProperty(Button.prototype, "onClick", {
        /**
         * Gets the event that is fired when the button is clicked.
         * @returns {Event<Button<Config>, NoArgs>}
         */
        get: function () {
            return this.buttonEvents.onClick.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    return Button;
}(component_1.Component));
exports.Button = Button;
