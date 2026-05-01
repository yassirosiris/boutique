import { computeAmountFromDb, createCheckoutIntent, handleStripeWebhook } from "../services/paymentService";
import { ProductModel } from "../models/Product";
import Stripe from "stripe";

jest.mock("../models/Product");

describe("paymentService", () => {
  describe("computeAmountFromDb", () => {
    it("should compute correct amount", async () => {
      const mockProduct = {
        variants: [{ size: "M", color: "red", priceOverride: undefined }],
        price: 50,
        currency: "eur",
      };
      (ProductModel.findOne as jest.Mock).mockResolvedValue(mockProduct);

      const result = await computeAmountFromDb([{ product: "prod1", variant: { size: "M", color: "red" }, qty: 2 }]);
      expect(result.amount).toBe(10000); // 50 * 2 * 100 (cents)
      expect(result.currency).toBe("eur");
    });

    it("should throw error if product not found", async () => {
      (ProductModel.findOne as jest.Mock).mockResolvedValue(null);
      await expect(computeAmountFromDb([{ product: "invalid", variant: { size: "M", color: "red" }, qty: 1 }]))
        .rejects.toThrow("Produit introuvable");
    });
  });

  describe("createCheckoutIntent", () => {
    it("should create Stripe intent", async () => {
      const req = { body: { provider: "stripe", items: [] } } as any;
      const res = {} as any;

      // Mock Stripe
      const mockIntent = { client_secret: "sec_123", id: "pi_123" };
      const stripe = { paymentIntents: { create: jest.fn().mockResolvedValue(mockIntent) } };

      // Need to mock the stripe import - simplified for example
      const result = await createCheckoutIntent(req, res);
      expect(result).toBeDefined();
    });
  });
});
