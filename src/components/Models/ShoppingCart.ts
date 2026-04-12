import { IProduct } from "../../types/index.ts"; 

export class ShoppingCart {
    private cartProducts: IProduct[];

    constructor(cartProducts: IProduct[] = []) {
        this.cartProducts = cartProducts;
    }

    get cartProductsFromModel(): IProduct[] {
        return this.cartProducts;
    }

    addToCart(product: IProduct): void {
        if (!this.hasProduct(product.id)) {
            this.cartProducts.push(product);
        }
    }

    delFromCart(product: IProduct): void {
        if (this.hasProduct(product.id)) {
            this.cartProducts = this.cartProducts.filter(p => p.id !== product.id);
        }
    }

    clearCart(): void {
        this.cartProducts = [];
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