import { IBuyer, TPayment } from "../../types/index.ts";
import { IEvents } from "../base/Events.ts";

const errors = {
    paymentError: "Пожалуйста, выберите способ оплаты",
    addressError: "Пожалуйста, введите ваш адрес",
    phoneError: "Пожалуйста, введите ваш номер телефона",
    emailError: "Пожалуйста, введите вашу электронную почту"
}

type ValidationError = Partial<Record<keyof IBuyer, string>>;

export class Buyer {
    private payment: TPayment;
    private address: string;
    private phone: string;
    private email: string;

    constructor(data: Partial<IBuyer> = {}, protected events: IEvents) {
        this.payment = data.payment || '';
        this.address = data.address || '';
        this.phone = data.phone || '';
        this.email = data.email || '';
    }

    setPaymentType(payment: TPayment): void {
        this.payment = payment;

        this.eventEmit();
    }

    setAddress(address: string): void {
        this.address = address;

        this.eventEmit();
    }

    setPhoneNumber(phone: string): void {
        this.phone = phone;

        this.eventEmit();
    }

    setEmail(email: string): void {
        this.email = email;

        this.eventEmit();
    }

    get buyerData(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            phone: this.phone,
            email: this.email
        }
    }

    clearBuyerData(): void {
        this.payment = '';
        this.address = '';
        this.phone = '';
        this.email = '';

        this.eventEmit();
    }

    validate(): ValidationError {
        const returnErrors: ValidationError = {};
        
        if (!this.payment) {
            returnErrors.payment = errors.paymentError;
        }
        
        if (!this.address) {
            returnErrors.address = errors.addressError;
        }
        
        if (!this.phone) {
            returnErrors.phone = errors.phoneError;
        }
        
        if (!this.email) {
            returnErrors.email = errors.emailError;
        }
        
        return returnErrors;
    }

    private eventEmit() {
        this.events.emit('buyer:changed');
    }
}