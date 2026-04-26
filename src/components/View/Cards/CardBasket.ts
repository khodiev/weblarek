import { ensureElement } from "../../../utils/utils";
import { Card } from "./Card";
import { ICardActions } from "../../../types";

interface ICardBasket {
    index: number;
}

export class CardBasket extends Card<ICardBasket>{
    protected indexElement: HTMLElement;
    protected delButtonElement: HTMLButtonElement;
    
    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.delButtonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

        if (actions?.onClick) {
            this.delButtonElement.addEventListener('click', actions.onClick);
        }
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}