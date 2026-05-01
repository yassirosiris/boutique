import { listProducts, getProduct, getCategories } from "../services/productService";
import { ProductModel } from "../models/Product";

jest.mock("../models/Product");

describe("productService", () => {
  describe("listProducts", () => {
    it("should return paginated products", async () => {
      const mockProducts = [{ _id: "p1", name: "Prod1" }];
      (ProductModel.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockProducts),
      });
      (ProductModel.countDocuments as jest.Mock).mockResolvedValue(1);

      const req = { query: {} } as any;
      const result = await listProducts(req, {} as any);
      expect(result.products).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe("getProduct", () => {
    it("should return product when found", async () => {
      const mockProduct = { _id: "p1", name: "Prod1" };
      (ProductModel.findOne as jest.Mock).mockResolvedValue(mockProduct);
      const req = { params: { id: "p1" } } as any;
      const result = await getProduct(req, {} as any);
      expect(result).toEqual(mockProduct);
    });

    it("should throw when not found", async () => {
      (ProductModel.findOne as jest.Mock).mockResolvedValue(null);
      const req = { params: { id: "missing" } } as any;
      await expect(getProduct(req, {} as any)).rejects.toThrow("Produit introuvable");
    });
  });

  describe("getCategories", () => {
    it("should return static categories", async () => {
      const result = await getCategories();
      expect(result).toEqual(["homme", "femme", "enfant"]);
    });
  });
});
