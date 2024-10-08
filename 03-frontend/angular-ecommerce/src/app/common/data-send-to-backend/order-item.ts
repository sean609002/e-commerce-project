import { CartItem } from "../cart-item";

export class OrderItem {
    public imageUrl: string | undefined;
    public name: string | undefined;
    public quantity:number | undefined;
    public unitPrice:number | undefined;
    public productId:number | undefined;

    constructor(cartItem: CartItem){
        this.imageUrl = cartItem.imgUrl;
        this.name = cartItem.name;
        this.quantity = cartItem.quantity;
        this.unitPrice = cartItem.unitPrice;
        this.productId = cartItem.id;
    }
}
