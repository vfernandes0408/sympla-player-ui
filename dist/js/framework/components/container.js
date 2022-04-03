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
exports.Container = void 0;
var component_1 = require("./component");
var dom_1 = require("../dom");
var arrayutils_1 = require("../arrayutils");
var i18n_1 = require("../localization/i18n");
/**
 * A container component that can contain a collection of child components.
 * Components can be added at construction time through the {@link ContainerConfig#components} setting, or later
 * through the {@link Container#addComponent} method. The UIManager automatically takes care of all components, i.e. it
 * initializes and configures them automatically.
 *
 * In the DOM, the container consists of an outer <div> (that can be configured by the config) and an inner wrapper
 * <div> that contains the components. This double-<div>-structure is often required to achieve many advanced effects
 * in CSS and/or JS, e.g. animations and certain formatting with absolute positioning.
 *
 * DOM example:
 * <code>
 *     <div class='ui-container'>
 *         <div class='container-wrapper'>
 *             ... child components ...
 *         </div>
 *     </div>
 * </code>
 */
var Container = /** @class */ (function (_super) {
    __extends(Container, _super);
    function Container(config) {
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-container',
            components: [],
        }, _this.config);
        _this.componentsToAdd = [];
        _this.componentsToRemove = [];
        return _this;
    }
    /**
     * Adds a child component to the container.
     * @param component the component to add
     */
    Container.prototype.addComponent = function (component) {
        this.config.components.push(component);
        this.componentsToAdd.push(component);
    };
    /**
     * Removes a child component from the container.
     * @param component the component to remove
     * @returns {boolean} true if the component has been removed, false if it is not contained in this container
     */
    Container.prototype.removeComponent = function (component) {
        if (arrayutils_1.ArrayUtils.remove(this.config.components, component) != null) {
            this.componentsToRemove.push(component);
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * Gets an array of all child components in this container.
     * @returns {Component<ComponentConfig>[]}
     */
    Container.prototype.getComponents = function () {
        return this.config.components;
    };
    /**
     * Removes all child components from the container.
     */
    Container.prototype.removeComponents = function () {
        for (var _i = 0, _a = this.getComponents().slice(); _i < _a.length; _i++) {
            var component = _a[_i];
            this.removeComponent(component);
        }
    };
    /**
     * Updates the DOM of the container with the current components.
     */
    Container.prototype.updateComponents = function () {
        /* We cannot just clear the container to remove all elements and then re-add those that should stay, because
         * IE looses the innerHTML of unattached elements, leading to empty elements within the container (e.g. missing
         * subtitle text in SubtitleLabel).
         * Instead, we keep a list of elements to add and remove, leaving remaining elements alone. By keeping them in
         * the DOM, their content gets preserved in all browsers.
         */
        var component;
        while (component = this.componentsToRemove.shift()) {
            component.getDomElement().remove();
        }
        while (component = this.componentsToAdd.shift()) {
            this.innerContainerElement.append(component.getDomElement());
        }
    };
    Container.prototype.toDomElement = function () {
        // Create the container element (the outer <div>)
        var containerElement = new dom_1.DOM(this.config.tag, {
            'id': this.config.id,
            'class': this.getCssClasses(),
            'role': this.config.role,
            'aria-label': i18n_1.i18n.performLocalization(this.config.ariaLabel),
        });
        // Create the inner container element (the inner <div>) that will contain the components
        var innerContainer = new dom_1.DOM(this.config.tag, {
            'class': this.prefixCss('container-wrapper'),
        });
        this.innerContainerElement = innerContainer;
        for (var _i = 0, _a = this.config.components; _i < _a.length; _i++) {
            var initialComponent = _a[_i];
            this.componentsToAdd.push(initialComponent);
        }
        this.updateComponents();
        containerElement.append(innerContainer);
        return containerElement;
    };
    return Container;
}(component_1.Component));
exports.Container = Container;
