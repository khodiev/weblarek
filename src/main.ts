import './scss/styles.scss';
import { ProductCatalog } from './components/Models/ProductCatalog';
import { ShoppingCart } from './components/Models/ShoppingCart';
import { Buyer } from './components/Models/Buyer';

import { apiProducts } from './utils/data';

const productCatalog = new ProductCatalog(apiProducts.items);
console.log(productCatalog.productsFromModel)

const shoppingCart = new ShoppingCart(apiProducts.items);
console.log(shoppingCart.cartProductsFromModel)


const buyer = new Buyer({
    payment: "card",
    address: "dudarova street",
    phone: "+7-918-100-21-15",
    email: "khodiev.tamerlan@yandex.ru"
});

console.log(buyer.buyerData);