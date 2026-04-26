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
        
        
        
    } catch (error) {
        console.error('Ошибка инициализации приложения:', error);
    }
}

init();