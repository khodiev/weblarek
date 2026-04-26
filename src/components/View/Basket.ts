import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface BasketData {
    items: HTMLElement[];
    price: number;
}

export class Basket extends Component<BasketData> {
    protected basketContent: HTMLElement;
    protected basketPrice: HTMLElement;
    protected basketButton: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.basketContent = ensureElement<HTMLElement>('.basket__list', this.container);
        this.basketPrice = ensureElement<HTMLElement>('.basket__price', this.container);
        this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.basketButton.addEventListener('click', () => {
            this.events.emit('order:create');
        })
    }

    set content(items: HTMLElement[]) {
        this.basketContent.innerHTML = '';

        this.basketContent.replaceChildren(...items);
    }

    set price(value: number) {
        this.basketPrice.textContent = `${value} синапсов`;
    }
}