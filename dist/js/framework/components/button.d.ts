import { ComponentConfig, Component } from './component';
import { DOM } from '../dom';
import { NoArgs, Event } from '../eventdispatcher';
import { LocalizableText } from '../localization/i18n';
/**
 * Configuration interface for a {@link Button} component.
 */
export interface ButtonConfig extends ComponentConfig {
    /**
     * The text as string or localize callback on the button.
     */
    text?: LocalizableText;
}
/**
 * A simple clickable button.
 */
export declare class Button<Config extends ButtonConfig> extends Component<Config> {
    private buttonEvents;
    constructor(config: Config);
    protected toDomElement(): DOM;
    /**
     * Sets text on the label of the button.
     * @param text the text to put into the label of the button
     */
    setText(text: LocalizableText): void;
    protected onClickEvent(): void;
    /**
     * Gets the event that is fired when the button is clicked.
     * @returns {Event<Button<Config>, NoArgs>}
     */
    get onClick(): Event<Button<Config>, NoArgs>;
}
