import './scss/styles.scss';
import { ProductCatalog } from './components/Models/ProductCatalog';
import { ShoppingCart } from './components/Models/ShoppingCart';
import { Buyer } from './components/Models/Buyer';

/* import { apiProducts } from './utils/data'; */
import { ProductFetcher } from './components/Communication/ProductFetcher';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
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

        // Инициализация Моделей данных
        const productCatalog = new ProductCatalog(events);
        const shoppingCart = new ShoppingCart(events);
        const buyer = new Buyer({}, events);

        // Темплейты
        const cardCatalogTemplate = '#card-catalog';
        const basketTemplate = '#basket';
        const orderTemplate = '#order';
        const contactsTemplate = '#contacts';
        const successTemplate = '#success';
        const cardPreviewTemplate = '#card-preview';
        const cardBasketTemplate = '#card-basket';

        // Инициализация Классов Представления
        const gallery = new Gallery(ensureElement<HTMLElement>('.page__wrapper'));
        const header = new Header(events, ensureElement<HTMLElement>('.header__container'));
        const modal = new Modal(ensureElement<HTMLElement>('#modal-container'));

        events.on('catalog:products-loaded', () => {
            const itemCards = productCatalog.productsFromModel.map((item) => {
                const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
                    onClick: () => events.emit('card:select', item)
                })
                return card.render(item)
            })

            gallery.render({ catalog: itemCards })
        });

        events.on('card:select', (item: IProduct) => {
            productCatalog.currentProduct(item);

            const previewCard = new CardPrewiew(events, cloneTemplate(cardPreviewTemplate));
            
            previewCard.image = item.image;
            previewCard.title = item.title;
            previewCard.category = item.category;
            previewCard.description = item.description;
            previewCard.price = item.price;
            
            if (item.price === null) {
                previewCard.buttonText = 'Недоступно';
                const button = previewCard['buttonElement'];
                if (button) {
                    button.disabled = true;
                }
            } else {
                if (shoppingCart.hasProduct(item.id)) {
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
                const modalContent = document.querySelector('.modal__content');
                const button = modalContent?.querySelector('.card__button') as HTMLButtonElement;

                if (shoppingCart.hasProduct(currentProduct.id)) {
                    shoppingCart.delFromCart(currentProduct);

                    if (button) {
                        button.textContent = 'В корзину';
                    }
                } else {
                    shoppingCart.addToCart(currentProduct);

                    if (button) {
                        button.textContent = 'Удалить из корзины';
                    }
                }
                
                header.counter = shoppingCart.itemCount;
            }
        });

        events.on('basket:open', () => {
            const basket = new Basket(events, cloneTemplate(basketTemplate));
            
            const cartProducts = shoppingCart.cartProductsFromModel;
            
            const basketItems = cartProducts.map((item, index) => {
                const cardBasket = new CardBasket(cloneTemplate(cardBasketTemplate), {
                    onClick: () => {
                        shoppingCart.delFromCart(item);

                        header.counter = shoppingCart.itemCount;

                        events.emit('basket:open');
                    }
                });
                
                cardBasket.title = item.title;
                cardBasket.price = item.price;
                cardBasket.index = index + 1;
                
                return cardBasket.render();
            });
            
            basket.content = basketItems;
            basket.price = shoppingCart.calculateTotalPrice;
            
            modal.open(basket.render());
        });

        events.on('order:create', () => {
            const orderFormContainer = cloneTemplate(orderTemplate) as HTMLFormElement;
            const orderForm = new OrderForm(events, orderFormContainer);
            
            const buyerData = buyer.buyerData;
            orderForm.payment = buyerData.payment;
            orderForm.address = buyerData.address;
            
            events.on('order:payment', (data: { payment: TPayment }) => {
                buyer.setPaymentType(data.payment);
                orderForm.payment = data.payment;
                
                const errors = buyer.validate();
                if (errors.payment || errors.address) {
                    orderForm.valid = false;
                    orderForm.errors = errors.payment || errors.address || '';
                } else {
                    orderForm.valid = true;
                    orderForm.errors = '';
                }
            });
            
            events.on('order:address', (data: { address: string }) => {
                buyer.setAddress(data.address);
                orderForm.address = data.address;
                
                const errors = buyer.validate();
                if (errors.payment || errors.address) {
                    orderForm.valid = false;
                    orderForm.errors = errors.payment || errors.address || '';
                } else {
                    orderForm.valid = true;
                    orderForm.errors = '';
                }
            });
            
            events.on('form.order:submit', () => {
                const errors = buyer.validate();
                
                if (!errors.payment && !errors.address) {
                    const contactsFormContainer = cloneTemplate(contactsTemplate) as HTMLFormElement;
                    const contactsForm = new ContactsForm(events, contactsFormContainer);
                    contactsForm.email = buyerData.email;
                    contactsForm.phone = buyerData.phone;
                    
                    events.on('contacts:email', (data: { email: string }) => {
                        buyer.setEmail(data.email);
                        contactsForm.email = data.email;
                        
                        const validationErrors = buyer.validate();
                        if (validationErrors.phone || validationErrors.email) {
                            contactsForm.valid = false;
                            contactsForm.errors = validationErrors.phone || validationErrors.email || '';
                        } else {
                            contactsForm.valid = true;
                            contactsForm.errors = '';
                        }
                    });
                    
                    events.on('contacts:phone', (data: { phone: string }) => {
                        buyer.setPhoneNumber(data.phone);
                        contactsForm.phone = data.phone;
                        
                        const validationErrors = buyer.validate();
                        if (validationErrors.phone || validationErrors.email) {
                            contactsForm.valid = false;
                            contactsForm.errors = validationErrors.phone || validationErrors.email || '';
                        } else {
                            contactsForm.valid = true;
                            contactsForm.errors = '';
                        }
                    });
                    
                    events.on('form.contacts:submit', () => {
                        const finalErrors = buyer.validate();
                        
                        if (!finalErrors.phone && !finalErrors.email) {
                            const totalPrice = shoppingCart.calculateTotalPrice;
                            const successContainer = cloneTemplate(successTemplate);
                            const orderSuccess = new OrderSucces(events, successContainer);
                            orderSuccess.updateSpentAmount = totalPrice;
                            shoppingCart.clearCart();
                            header.counter = 0;
                            modal.open(orderSuccess.render());
                        } else {
                            contactsForm.valid = false;
                            contactsForm.errors = finalErrors.phone || finalErrors.email || '';
                        }
                    });
                    
                    modal.open(contactsForm.render());
                } else {
                    orderForm.valid = false;
                    orderForm.errors = errors.payment || errors.address || '';
                }
            });
            
            modal.open(orderForm.render());
        });
        
        events.on('success:close', () => {
            modal.close();
        });

        productCatalog.saveProducts(products.items);

    } catch (error) {
        console.error('Ошибка инициализации приложения:', error);
    }
}

init();