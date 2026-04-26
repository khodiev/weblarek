import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface ModalData {
    content: HTMLElement;
}

export class Modal extends Component<ModalData> {
    protected closeButton: HTMLButtonElement;
    protected modalContent: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this.modalContent = ensureElement<HTMLElement>('.modal__content', this.container);

        this.closeButton.addEventListener('click', () => {
            this.close();
        })

        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.close();
            }
        })
    }
    
    set content(content: HTMLElement) {
        this.modalContent.replaceChildren(content);
    }

    open(content: HTMLElement): void {
        this.content = content;
        this.container.classList.add('modal_active');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this.modalContent.innerHTML = '';
    }
}