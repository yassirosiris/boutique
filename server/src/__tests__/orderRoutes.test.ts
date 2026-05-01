import request from "supertest";
import { app } from "../../index"; // Assuming app is exported from index.ts
import { OrderModel } from "../../models/Order";
import { ProductModel } from "../../models/Product";

jest.mock("../../models/Order");
jest.mock("../../models/Product");

describe("POST /orders", () => {
  it("should create order with valid data", async () => {
    (ProductModel.findOne as jest.Mock).mockResolvedValue({
      _id: "prod1",
      variants: [{ size: "M", color: "red", stock: 10 }],
      price: 100,
    });
    (OrderModel.create as jest.Mock).mockResolvedValue([{ _id: "order1", total: 200 }]);

    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", "Bearer faketoken")
      .send({
        items: [{ product: "prod1", variant: { size: "M", color: "red" }, qty: 2 }],
        shippingAddress: { street: "123 rue" },
      });

    expect(res.status).toBe(201);
    expect(res.body._id).toBe("order1");
  });

  it("should return 401 without auth", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({ items: [] });

    expect(res.status).toBe(401);
  });
});
