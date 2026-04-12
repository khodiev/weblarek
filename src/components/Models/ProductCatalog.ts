import { IProduct } from "../../types/index"; 

export class ProductCatalog {
    private allProducts: IProduct[];
    private selectedProduct: IProduct | null;

    constructor() {
        this.allProducts = [];
        this.selectedProduct = null;
    }

    saveProducts(allProducts: IProduct[]): void {
        this.allProducts = allProducts;
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
    }

    get returnCurrentProduct(): IProduct | null {
        return this.selectedProduct;
    }
}

