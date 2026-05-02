import { render, screen } from "@testing-library/react";
import { useCartStore } from "../store/cartStore";
import { CartPage } from "../pages/CartPage";

// Mock the cart store
jest.mock("../store/cartStore");

describe("CartPage", () => {
  beforeEach(() => {
    (useCartStore as unknown as jest.Mock).mockReturnValue({
      items: [
        { productId: "1", name: "Test Product", price: 100, qty: 2, size: "M", color: "red", image: "" }
      ],
      removeItem: jest.fn(),
      updateQty: jest.fn(),
      clear: jest.fn(),
    });
  });

  it("renders cart items", () => {
    render(<CartPage />);
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText(/200/)).toBeInTheDocument(); // 100 * 2
  });

  it("shows empty cart message when no items", () => {
    (useCartStore as unknown as jest.Mock).mockReturnValue({ items: [], removeItem: jest.fn() });
    render(<CartPage />);
    expect(screen.getByText(/panier vide/i)).toBeInTheDocument();
  });
});
