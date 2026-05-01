export type UserRole = "user" | "admin";
export type ProductSize = "XS" | "S" | "M" | "L" | "XL" | "XXL";
export interface ProductVariant {
    size: ProductSize;
    color: string;
    stock: number;
}
export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: "homme" | "femme" | "enfant";
    images: string[];
    variants: ProductVariant[];
    isActive: boolean;
    createdAt: string;
}
export interface CartItem {
    product: Product;
    variant: ProductVariant;
    qty: number;
}
