import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export interface IFormState {
    valid: boolean;
    errors: string;
}

export class Form<T> extends Component<IFormState & T> {
    protected button: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(protected events: IEvents, container: HTMLFormElement) {
        super(container);
        
        this.button = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this.errorsElement = ensureElement<HTMLElement>('.form__errors', container);
        
        container.addEventListener('submit', (event) => {
            event.preventDefault();
            this.events.emit(`form.${container.name}:submit`);
        });
    }

    set valid(value: boolean) {
        this.button.disabled = !value;
    }

    set errors(value: string) {
        this.errorsElement.textContent = value;
    }
}