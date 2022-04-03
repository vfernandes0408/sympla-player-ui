import {ListSelector, ListSelectorConfig} from './listselector';
import {DOM} from '../dom';
import { i18n, LocalizableText } from '../localization/i18n';

/**
 * A simple select box providing the possibility to select a single item out of a list of available items.
 *
 * DOM example:
 * <code>
 *     <select class='ui-selectbox'>
 *         <option value='key'>label</option>
 *         ...
 *     </select>
 * </code>
 */

export class SelectBox extends ListSelector<ListSelectorConfig> {

  private selectElement: DOM;

  constructor(config: ListSelectorConfig = {}) {
    super(config);

    this.config = this.mergeConfig(config, {
      cssClass: 'ui-selectbox',
    }, this.config);
  }

  protected toDomElement(): DOM {
    let selectElement = new DOM('select', {
      'id': this.config.id,
      'class': this.getCssClasses(),
      'aria-label': i18n.performLocalization(this.config.ariaLabel),
    });

    this.selectElement = selectElement;
    this.updateDomItems();

    selectElement.on('change', () => {
      let value = selectElement.val();
      this.onItemSelectedEvent(value, false);
    });

    return selectElement;
  }

  protected updateDomItems(selectedValue: string = null) {
    // Delete all children
    this.selectElement.empty();

    // Add updated children
    for (let item of this.items) {
      let optionElement = new DOM('option', {
        'value': String(item.key),
      }).html(i18n.performLocalization(item.label));

      if (item.key === String(selectedValue)) { // convert selectedValue to string to catch 'null'/null case
        optionElement.attr('selected', 'selected');
      }

      this.selectElement.append(optionElement);
    }
  }

  protected onItemAddedEvent(value: string) {
    super.onItemAddedEvent(value);
    this.updateDomItems(this.selectedItem);
  }

  protected onItemRemovedEvent(value: string) {
    super.onItemRemovedEvent(value);
    this.updateDomItems(this.selectedItem);
  }

  protected onItemSelectedEvent(value: string, updateDomItems: boolean = true) {
    super.onItemSelectedEvent(value);
    if (updateDomItems) {
      this.updateDomItems(value);
    }
  }
}
