import mongoose from "mongoose";
import { OrderModel } from "../models/Order";
import { ProductModel } from "../models/Product";
import { createOrder, getMyOrders } from "../services/orderService";

// Mock models
jest.mock("../models/Order");
jest.mock("../models/Product");

describe("orderService", () => {
  let mockSession: any;

  beforeEach(() => {
    mockSession = {
      withTransaction: jest.fn((fn) => fn()),
      endSession: jest.fn(),
    };
    (mongoose.startSession as jest.Mock) = jest.fn().mockResolvedValue(mockSession);
  });

  afterEach(() => jest.clearAllMocks());

  describe("createOrder", () => {
    it("should create an order successfully", async () => {
      const req = {
        body: {
          items: [{ product: "prod1", variant: { size: "M", color: "red" }, qty: 2 }],
          shippingAddress: { street: "123 rue", city: "Paris" },
        },
        user: { id: "user1" },
      } as any;

      const mockProduct = {
        id: "prod1",
        variants: [{ size: "M", color: "red", stock: 10, priceOverride: undefined }],
        price: 100,
        currency: "eur",
      };
      (ProductModel.findOne as jest.Mock).mockResolvedValue(mockProduct);
      (ProductModel.updateOne as jest.Mock).mockResolvedValue({ modifiedCount: 1 });
      (OrderModel.create as jest.Mock).mockResolvedValue([{ _id: "order1", total: 200 }]);

      const result = await createOrder(req as any, {} as any);
      expect(result).toBeDefined();
      expect(OrderModel.create).toHaveBeenCalled();
    });

    it("should throw error if stock insufficient", async () => {
      const req = {
        body: {
          items: [{ product: "prod1", variant: { size: "M", color: "red" }, qty: 100 }],
        },
        user: { id: "user1" },
      } as any;

      const mockProduct = {
        variants: [{ size: "M", color: "red", stock: 5 }],
      };
      (ProductModel.findOne as jest.Mock).mockResolvedValue(mockProduct);
      (ProductModel.updateOne as jest.Mock).mockResolvedValue({ modifiedCount: 0 });

      await expect(createOrder(req as any, {} as any)).rejects.toThrow("Insufficient stock");
    });
  });

  describe("getMyOrders", () => {
    it("should return orders for user", async () => {
      const req = { user: { id: "user1" } } as any;
      (OrderModel.find as jest.Mock).mockResolvedValue([{ _id: "order1" }]);

      const result = await getMyOrders(req as any, {} as any);
      expect(result).toHaveLength(1);
      expect(OrderModel.find).toHaveBeenCalledWith({ user: "user1" });
    });
  });
});
