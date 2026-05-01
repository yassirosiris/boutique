import { connectDb } from "../config/db.js";
import { ProductModel } from "../models/Product.js";
const samples = Array.from({ length: 10 }).map((_, index) => ({
    name: `Produit ${index + 1}`,
    description: `Description du produit ${index + 1}`,
    price: 49 + index * 5,
    category: ["homme", "femme", "enfant"][index % 3],
    images: ["https://placehold.co/600x800?text=Boutique"],
    variants: [
        { size: "S", color: "Noir", stock: 20 - index },
        { size: "M", color: "Blanc", stock: 12 - Math.floor(index / 2) }
    ]
}));
const run = async () => {
    await connectDb();
    await ProductModel.deleteMany({});
    await ProductModel.insertMany(samples);
    // eslint-disable-next-line no-console
    console.log("10 sample products inserted.");
    process.exit(0);
};
run().catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
});
