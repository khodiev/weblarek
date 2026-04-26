import { IProduct } from "../../types/index"; 
import { IEvents } from "../base/Events";

export class ProductCatalog {
    private allProducts: IProduct[];
    private selectedProduct: IProduct | null;

    constructor(protected events: IEvents) {
        this.allProducts = [];
        this.selectedProduct = null;
    }

    saveProducts(allProducts: IProduct[]): void {
        this.allProducts = allProducts;

        this.events.emit('catalog:products-loaded');
    }

    get productsFromModel(): IProduct[] {
        return this.allProducts;
    }

    getProductById(productId: string): IProduct | null {
        const product = this.allProducts.find(p => p.id === productId);

        return product || null;
    }

    currentProduct(selectedProduct: IProduct): void {
        this.selectedProduct = selectedProduct;

        this.events.emit('catalog:product-selected');
    }

    get returnCurrentProduct(): IProduct | null {
        return this.selectedProduct;
    }
}

