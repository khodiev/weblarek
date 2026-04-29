import './scss/styles.scss';
import { ProductCatalog } from './components/Models/ProductCatalog';
import { ShoppingCart } from './components/Models/ShoppingCart';
import { Buyer } from './components/Models/Buyer';

/* import { apiProducts } from './utils/data'; */
import { ProductFetcher } from './components/Communication/ProductFetcher';
import { Api } from './components/base/Api';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { ensureElement } from './utils/utils';

import { Header } from './components/View/Header';
import { Gallery } from './components/View/Gallery';
import { Modal } from './components/View/Modal';
import { OrderSucces } from './components/View/OrderSuccess';
import { Basket } from './components/View/Basket';

import { OrderForm } from './components/View/Forms/OrderForm';
import { ContactsForm } from './components/View/Forms/ContactsForm';

import { CardCatalog } from './components/View/Cards/CardCatalog';
import { CardPrewiew } from './components/View/Cards/CardPrewiew';
import { CardBasket } from './components/View/Cards/CardBasket';
import { cloneTemplate } from './utils/utils';
import { IProduct, TPayment } from './types';


async function init() {
    try {
        const events = new EventEmitter();

        // API
        const api = new Api(API_URL);
        const productFetcher = new ProductFetcher(api);
        
        // Карточки
        const products = await productFetcher.getProducts();

        const processedProducts = {
            ...products,
            items: products.items.map(item => ({
                ...item,
                image: `${CDN_URL}${item.image}`
            }))
        };

        // Инициализация Моделей данных
        const productCatalog = new ProductCatalog(events);
        const shoppingCart = new ShoppingCart(events);
        const buyer = new Buyer({}, events);

        // Темплейты
        const cardCatalogTemplateSelector = '#card-catalog';
        const basketTemplateSelector = '#basket';
        const orderTemplateSelector = '#order';
        const contactsTemplateSelector = '#contacts';
        const successTemplateSelector = '#success';
        const cardPreviewTemplateSelector = '#card-preview';
        const cardBasketTemplateSelector = '#card-basket';

        // Инициализация Классов Представления
        const gallery = new Gallery(ensureElement<HTMLElement>('.page__wrapper'));
        const header = new Header(events, ensureElement<HTMLElement>('.header__container'));
        const modal = new Modal(ensureElement<HTMLElement>('#modal-container'));
        const previewCard = new CardPrewiew(events, cloneTemplate(cardPreviewTemplateSelector));
        const basket = new Basket(events, cloneTemplate(basketTemplateSelector));
        const orderForm = new OrderForm(events, cloneTemplate(orderTemplateSelector) as HTMLFormElement);
        const contactsForm = new ContactsForm(events, cloneTemplate(contactsTemplateSelector) as HTMLFormElement);
        const orderSuccess = new OrderSucces(events, cloneTemplate(successTemplateSelector) as HTMLElement);

        events.on('catalog:products-loaded', () => {
            const itemCards = productCatalog.productsFromModel.map((item) => {
                const card = new CardCatalog(cloneTemplate(cardCatalogTemplateSelector), {
                    onClick: () => events.emit('card:select', item)
                })
                return card.render(item)
            })

            gallery.render({ catalog: itemCards })
        });

        events.on('card:select', (item: IProduct) => {
            productCatalog.currentProduct(item);
        });

        events.on('catalog:product-selected', () => {
            const currentProduct = productCatalog.returnCurrentProduct;
            
            if (!currentProduct) return;
            
            previewCard.image = currentProduct.image;
            previewCard.title = currentProduct.title;
            previewCard.category = currentProduct.category;
            previewCard.description = currentProduct.description;
            previewCard.price = currentProduct.price;
            
            if (currentProduct.price === null) {
                previewCard.buttonText = 'Недоступно';
                previewCard.disabled = true;
            } else {
                previewCard.disabled = false;
                if (shoppingCart.hasProduct(currentProduct.id)) {
                    previewCard.buttonText = 'Удалить из корзины';
                } else {
                    previewCard.buttonText = 'В корзину';
                }
            }

            modal.open(previewCard.render());
        });        

        events.on('preview:add', () => {
            const currentProduct = productCatalog.returnCurrentProduct;
            
            if (currentProduct && currentProduct.price !== null) {
                if (shoppingCart.hasProduct(currentProduct.id)) {
                    shoppingCart.delFromCart(currentProduct);
                    previewCard.buttonText = 'В корзину';
                } else {
                    shoppingCart.addToCart(currentProduct);
                    previewCard.buttonText = 'Удалить из корзины';
                }
            }
        });

        events.on('basket:changed', () => {
            const cartProducts = shoppingCart.cartProductsFromModel;
            header.counter = shoppingCart.itemCount;
            
            const basketItems = cartProducts.map((item, index) => {
                const cardBasket = new CardBasket(cloneTemplate(cardBasketTemplateSelector), {
                    onClick: () => {
                        shoppingCart.delFromCart(item);
                    }
                });
                
                cardBasket.title = item.title;
                cardBasket.price = item.price;
                cardBasket.index = index + 1;
                
                return cardBasket.render();
            });
            
            basket.content = basketItems;
            basket.price = shoppingCart.calculateTotalPrice;
        });

        events.on('basket:open', () => {
            modal.open(basket.render());
        });

        events.on('buyer:changed', () => {
            const buyerData = buyer.buyerData;
            const errors = buyer.validate();
            
            orderForm.payment = buyerData.payment;
            orderForm.address = buyerData.address;
            
            const orderErrors = [errors.address, errors.payment].filter(Boolean).join('; ');
            orderForm.errors = orderErrors;
            orderForm.valid = orderErrors.length === 0;
            
            contactsForm.email = buyerData.email;
            contactsForm.phone = buyerData.phone;
            
            const contactsErrors = [errors.phone, errors.email].filter(Boolean).join('; ');
            contactsForm.errors = contactsErrors;
            contactsForm.valid = contactsErrors.length === 0;
        });

        events.on('order:create', () => {
            modal.open(orderForm.render());
        });

        events.on('order:payment', (data: { payment: TPayment }) => {
            buyer.setPaymentType(data.payment);
        });

        events.on('order:address', (data: { address: string }) => {
            buyer.setAddress(data.address);
        });

        events.on('form.order:submit', () => {
            modal.open(contactsForm.render());
        });

        events.on('contacts:email', (data: { email: string }) => {
            buyer.setEmail(data.email);
        });

        events.on('contacts:phone', (data: { phone: string }) => {
            buyer.setPhoneNumber(data.phone);
        });

        events.on('form.contacts:submit', async () => {
            try {
                const orderData = {
                    payment: buyer.buyerData.payment,
                    address: buyer.buyerData.address,
                    email: buyer.buyerData.email,
                    phone: buyer.buyerData.phone,
                    items: shoppingCart.cartProductsFromModel.map(item => item.id),
                    total: shoppingCart.calculateTotalPrice
                };
                
                const response = await productFetcher.postOrder(orderData);
                
                if (response.id) {
                    orderSuccess.updateSpentAmount = response.total;
                    
                    shoppingCart.clearCart();
                    buyer.clearBuyerData();
                    
                    modal.open(orderSuccess.render());
                }
            } catch (error) {
                contactsForm.valid = false;
                contactsForm.errors = 'Ошибка при оформлении заказа. Попробуйте еще раз.';
            }
        });
        
        events.on('success:close', () => {
            modal.close();
        });

        productCatalog.saveProducts(processedProducts.items);

    } catch (error) {
        console.error('Ошибка инициализации приложения:', error);
    }
}

init();