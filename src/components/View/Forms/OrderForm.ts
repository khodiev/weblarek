import { Form } from './Form';
import { IEvents } from '../../base/Events';
import { ensureElement } from '../../../utils/utils';
import { TPayment } from '../../../types';

export interface IOrderFormData {
    payment: TPayment;
    address: string;
}

export class OrderForm extends Form<IOrderFormData> {
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;
    protected addressInput: HTMLInputElement;

    constructor(events: IEvents, container: HTMLFormElement) {
        super(events, container);
        
        this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        
        this.cardButton.addEventListener('click', () => {
            events.emit('order:payment', { payment: 'card' });
        });
        
        this.cashButton.addEventListener('click', () => {
            events.emit('order:payment', { payment: 'cash' });
        });
        
        this.addressInput.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            events.emit('order:address', { address: target.value });
        });
    }

    set payment(value: TPayment) {
        if (value === 'card') {
            this.cardButton.classList.add('button_alt-active');
            this.cashButton.classList.remove('button_alt-active');
        } else if (value === 'cash') {
            this.cashButton.classList.add('button_alt-active');
            this.cardButton.classList.remove('button_alt-active');
        } else {
            this.cardButton.classList.remove('button_alt-active');
            this.cashButton.classList.remove('button_alt-active');
        }
    }

    set address(value: string) {
        this.addressInput.value = value;
    }
}