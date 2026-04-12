import './scss/styles.scss';
import { ProductCatalog } from './components/Models/ProductCatalog';
import { ShoppingCart } from './components/Models/ShoppingCart';
import { Buyer } from './components/Models/Buyer';

/* import { apiProducts } from './utils/data'; */
import { ProductFetcher } from './components/Communication/ProductFetcher';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';

async function init() {
    try {
        const api = new Api(API_URL);
        
        const productFetcher = new ProductFetcher(api);
        
        const products = await productFetcher.getProducts();
        
        const productCatalog = new ProductCatalog();
        productCatalog.saveProducts(products.items);
        console.log(productCatalog.productsFromModel);
        
        const shoppingCart = new ShoppingCart();
        console.log(shoppingCart.cartProductsFromModel);

        const buyer = new Buyer({
            payment: "card",
            address: "dudarova street",
            phone: "+7-918-100-21-15",
            email: "khodiev.tamerlan@yandex.ru"
        });
        
        console.log(buyer.buyerData);
        
    } catch (error) {
        console.error('Ошибка инициализации приложения:', error);
    }
}

init();