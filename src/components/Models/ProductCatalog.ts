import { IProduct } from "../../types/index"; 

export class ProductCatalog {
    private allProducts: IProduct[];
    private selectedProduct?: IProduct;

    constructor(allProducts: IProduct[], selectedProduct?: IProduct) {
        this.allProducts = allProducts;
        this.selectedProduct = selectedProduct;
    }

    saveProducts(allProducts: IProduct[]): void {
        this.allProducts = allProducts;
    }

    get productsFromModel(): IProduct[] {
        return this.allProducts;
    }

    getProductById(productId: string): IProduct {
        const product = this.allProducts.find(p => p.id === productId);

        if (!product) {
            throw new Error(`Товар с id - ${productId} не найден`);
        }

        return product;
    }

    currentProduct(selectedProduct: IProduct): void {
        this.selectedProduct = selectedProduct;
    }

    get returnCurrentProduct(): IProduct {
        if (!this.selectedProduct) {
            throw new Error(`Выбранная карточка не найдена`)
        }
        return this.selectedProduct;
    }
}

