export interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
  }
  
  export interface CartItem {
    product: Product;
    qty: number;
  }