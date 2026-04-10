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

    validate(): void {
        if (!this.payment) {
            throw new Error(errors.paymentError)
        }

        if (!this.address) {
            throw new Error(errors.addressError)
        }

        if (!this.phone) {
            throw new Error(errors.phoneError)
        }

        if (!this.email) {
            throw new Error(errors.emailError)
        }
    }
}