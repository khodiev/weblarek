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
        
        console.log("------PRODUCT CATALOG TESTS------");

        const productCatalog = new ProductCatalog();
        productCatalog.saveProducts(products.items);
        console.log("Вывод всех товаров", productCatalog.productsFromModel);
        console.log("Вторая карточка по айди", productCatalog.getProductById(products.items[2].id));

        productCatalog.currentProduct(products.items[1]);
        console.log("Выбранный товар", productCatalog.returnCurrentProduct);

        console.log("------SHOPPING CART TESTS------");
        
        const shoppingCart = new ShoppingCart();
        console.log("Все товары в корзине", shoppingCart.cartProductsFromModel);
        shoppingCart.addToCart(products.items[1]);
        shoppingCart.addToCart(products.items[2]);
        shoppingCart.addToCart(products.items[3]);
        console.log("Все товари в корзине после пополнения", shoppingCart.cartProductsFromModel);

        console.log("Общая цена товаров в корзине", shoppingCart.calculateTotalPrice);
        console.log("Общее кол-во предметов в корзине", shoppingCart.itemCount);
        shoppingCart.delFromCart(products.items[2]);
        console.log("Все товары в корзине после удаления одного", shoppingCart.cartProductsFromModel)
        shoppingCart.clearCart();
        console.log("Все товары в корзине после ее очистки", shoppingCart.cartProductsFromModel);

        console.log("------BUYER TESTS------");

        const buyer = new Buyer({
            payment: "card",
            address: "dudarova street",
            phone: "+7-918-100-21-15",
            email: "khodiev.tamerlan@yandex.ru"
        });
        
        console.log("Данные о покупателе", buyer.buyerData);
        console.log("Валидация данных", buyer.validate());
        buyer.clearBuyerData();
        console.log("Вывод данных о покупателе после их очистки", buyer.buyerData);

        buyer.setAddress("genetal Pliev");
        buyer.setPaymentType("cash");
        console.log("Вывод данных о покупателе после получения двух параметров", buyer.buyerData);
        console.log("Валидация, где не полностью заполненны данные", buyer.validate())
        
    } catch (error) {
        console.error('Ошибка инициализации приложения:', error);
    }
}

init();