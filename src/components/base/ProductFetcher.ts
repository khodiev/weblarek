import { IApi, IGetProductsResponse, IOrder, IOrderResponse } from '../../types/index.ts';

export class ProductFetcher {

    constructor(private api: IApi) {}

    getProducts(): Promise<IGetProductsResponse> {
        return this.api.get<IGetProductsResponse>('/api/weblarek/product');
    }

    postOrder(order: IOrder): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/api/weblarek/order', order);
    }
}