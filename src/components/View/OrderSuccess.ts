import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface OrderSuccesData {
    updateSpentAmount: number;
}

export class OrderSucces extends Component<OrderSuccesData> {
    protected successButton: HTMLButtonElement;
    protected spentAmount: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.successButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
        this.spentAmount = ensureElement<HTMLElement>('.order-success__description', this.container);

        this.successButton.addEventListener('click', () => {
            this.events.emit('success:close')
        })
    }

    set updateSpentAmount(value: number) {
        this.spentAmount.textContent = `Списано ${String(value)} синапсов`
    }
}