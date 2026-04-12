import { IBuyer } from "../../types/index.ts";

const errors = {
    paymentError: "Пожалуйста, выберите способ оплаты",
    addressError: "Пожалуйста, введите ваш адрес",
    phoneError: "Пожалуйста, введите ваш номер телефона",
    emailError: "Пожалуйста, введите вашу электронную почту"
}

export class Buyer {
    private payment: 'card' | 'cash' | '';
    private address: string;
    private phone: string;
    private email: string;

    constructor(data: Partial<IBuyer> = {}) {
        this.payment = data.payment || '';
        this.address = data.address || '';
        this.phone = data.phone || '';
        this.email = data.email || '';
    }

    setPaymentType(payment: 'card' | 'cash' | ''): void {
        this.payment = payment;
    }

    setAddress(address: string): void {
        this.address = address;
    }

    setPhoneNumber(phone: string): void {
        this.phone = phone;
    }

    setEmail(email: string): void {
        this.email = email;
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
    }

    validate(): Partial<Record<keyof IBuyer, string>> {
        const returnErrors: Partial<Record<keyof IBuyer, string>> = {};
        
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