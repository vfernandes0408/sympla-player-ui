import { ComponentConfig, Component } from './component';
import { DOM } from '../dom';
import { Event, NoArgs } from '../eventdispatcher';
import { LocalizableText } from '../localization/i18n';
/**
 * Configuration interface for a {@link Label} component.
 */
export interface LabelConfig extends ComponentConfig {
    /**
     * The text as string or localize callback on the label.
     */
    text?: LocalizableText;
    /**
     * WCAG20 standard: Associate label to form control.
     */
    for?: string;
}
/**
 * A simple text label.
 *
 * DOM example:
 * <code>
 *     <span class='ui-label'>...some text...</span>
 * </code>
 */
export declare class Label<Config extends LabelConfig> extends Component<Config> {
    private text;
    private labelEvents;
    constructor(config?: Config);
    protected toDomElement(): DOM;
    /**
     * Set the text on this label.
     * @param text
     */
    setText(text: LocalizableText): void;
    /**
     * Gets the text on this label.
     * @return {string} The text on the label
     */
    getText(): string;
    /**
     * Clears the text on this label.
     */
    clearText(): void;
    /**
     * Tests if the label is empty and does not contain any text.
     * @return {boolean} True if the label is empty, else false
     */
    isEmpty(): boolean;
    /**
     * Fires the {@link #onClick} event.
     * Can be used by subclasses to listen to this event without subscribing an event listener by overwriting the method
     * and calling the super method.
     */
    protected onClickEvent(): void;
    /**
     * Fires the {@link #onClick} event.
     * Can be used by subclasses to listen to this event without subscribing an event listener by overwriting the method
     * and calling the super method.
     */
    protected onTextChangedEvent(text: string): void;
    /**
     * Gets the event that is fired when the label is clicked.
     * @returns {Event<Label<LabelConfig>, NoArgs>}
     */
    get onClick(): Event<Label<LabelConfig>, NoArgs>;
    /**
     * Gets the event that is fired when the text on the label is changed.
     * @returns {Event<Label<LabelConfig>, string>}
     */
    get onTextChanged(): Event<Label<LabelConfig>, string>;
}
