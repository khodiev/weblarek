import { ensureElement } from "../../../utils/utils";
import { Card } from "./Card";
import { IEvents } from "../../base/Events";
import { IProduct } from "../../../types";
import { categoryMap } from "../../../utils/constants";

type CategoryKey = keyof typeof categoryMap;
type ICardPrewiew = Pick<IProduct, 'image' | 'category' | 'description'>;

export class CardPrewiew extends Card<ICardPrewiew> {
     protected categoryElement: HTMLElement;
     protected imageElement: HTMLImageElement;
     protected descriptionElement: HTMLElement;
     protected buttonElement: HTMLButtonElement;

     constructor(protected events: IEvents, container: HTMLElement) {
        super(container)

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('preview:add');
        })
     }

    set category(value: string) {
        this.categoryElement.textContent = value;

        for (const key in categoryMap) {
            this.categoryElement.classList.toggle(
                categoryMap[key as CategoryKey],
                key == value
            )
        }
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set image(value: string) {
        this.setImage(this.imageElement, value)
    }

    set buttonText(value: string) {
        this.buttonElement.textContent = value;
    }
}