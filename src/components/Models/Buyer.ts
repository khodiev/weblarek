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

        this.events.emit('payment:change');
    }

    setAddress(address: string): void {
        this.address = address;

        this.events.emit('address:change');
    }

    setPhoneNumber(phone: string): void {
        this.phone = phone;

        this.events.emit('phone:change');
    }

    setEmail(email: string): void {
        this.email = email;

        this.events.emit('email:change');
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

        this.events.emit('order:clear');
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
}