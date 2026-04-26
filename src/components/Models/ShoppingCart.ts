import { IProduct } from "../../types/index.ts"; 
import { IEvents } from "../base/Events.ts";

export class ShoppingCart {
    private cartProducts: IProduct[];

    constructor(cartProducts: IProduct[] = [], protected events: IEvents) {
        this.cartProducts = cartProducts;
    }

    get cartProductsFromModel(): IProduct[] {
        return this.cartProducts;
    }

    addToCart(product: IProduct): void {
        if (!this.hasProduct(product.id)) {
            this.cartProducts.push(product);
        }

        this.events.emit('basket:add');
    }

    delFromCart(product: IProduct): void {
        if (this.hasProduct(product.id)) {
            this.cartProducts = this.cartProducts.filter(p => p.id !== product.id);
        }

        this.events.emit('basket:del');
    }

    clearCart(): void {
        this.cartProducts = [];

        this.events.emit('basket:clear');
    }

    get calculateTotalPrice(): number {
        return this.cartProducts.reduce((total, product) => {
            return total + (product.price || 0);
        }, 0);
    }

    get itemCount(): number {
        return this.cartProducts.length;
    }

    hasProduct(productId: string): boolean {
        return this.cartProducts.some(product => product.id === productId);
    }
}