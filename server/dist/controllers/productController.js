import { StatusCodes } from "http-status-codes";
import { ProductModel } from "../models/Product.js";
/**
 * List active products with filters and pagination.
 */
export const listProducts = async (req, res) => {
    const { category, size, minPrice, maxPrice, sort = "newest", page = "1", limit = "12" } = req.query;
    const query = { isActive: true };
    if (category)
        query.category = category;
    if (size)
        query["variants.size"] = size;
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice)
            query.price.$gte = Number(minPrice);
        if (maxPrice)
            query.price.$lte = Number(maxPrice);
    }
    const sortMap = {
        newest: { createdAt: -1 },
        price_asc: { price: 1 },
        price_desc: { price: -1 },
        popularity: { createdAt: -1 }
    };
    const parsedPage = Number(page);
    const parsedLimit = Number(limit);
    const products = await ProductModel.find(query)
        .sort(sortMap[String(sort)] ?? sortMap.newest)
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit);
    const total = await ProductModel.countDocuments(query);
    res.status(StatusCodes.OK).json({ products, total, page: parsedPage, pages: Math.ceil(total / parsedLimit) });
};
/**
 * Get a single active product by id.
 */
export const getProduct = async (req, res) => {
    const product = await ProductModel.findOne({ _id: req.params.id, isActive: true });
    if (!product) {
        res.status(StatusCodes.NOT_FOUND).json({ message: "Product not found" });
        return;
    }
    res.status(StatusCodes.OK).json(product);
};
/**
 * List available static categories.
 */
export const getCategories = async (_req, res) => {
    res.status(StatusCodes.OK).json(["homme", "femme", "enfant"]);
};
