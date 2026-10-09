import { Injectable } from "@nestjs/common";

@Injectable()   
export class ProductService {

    private products = [
        { id: 1, name: "Product 1", price: 10.99, qty: 100 },
        { id: 2, name: "Product 2", price: 19.99, qty: 50 },
        { id: 3, name: "Product 3", price: 5.99, qty: 200 },
    ];

    getProducts() {
        return this.products;
    }
}