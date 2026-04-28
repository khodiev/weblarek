import { IProduct } from "../../types/index.ts"; 
import { IEvents } from "../base/Events.ts";

export class ShoppingCart {
    private cartProducts: IProduct[];

    constructor(protected events: IEvents) {
        this.cartProducts = [];
    }

    get cartProductsFromModel(): IProduct[] {
        return this.cartProducts;
    }

    addToCart(product: IProduct): void {
        if (!this.hasProduct(product.id)) {
            this.cartProducts.push(product);
        }

        this.eventEmit();
    }

    delFromCart(product: IProduct): void {
        if (this.hasProduct(product.id)) {
            this.cartProducts = this.cartProducts.filter(p => p.id !== product.id);
        }

        this.eventEmit();
    }

    clearCart(): void {
        this.cartProducts = [];

        this.eventEmit();
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

    private eventEmit() {
        this.events.emit('basket:changed');
    }
}