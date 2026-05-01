import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useCartStore } from "../store/cartStore";
import { CheckoutPage } from "../pages/CheckoutPage";
import { http } from "../api/http";
import toast from "react-hot-toast";

jest.mock("../store/cartStore");
jest.mock("../api/http");
jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

describe("CheckoutPage", () => {
  const mockItems = [
    { productId: "1", name: "Produit Test", price: 50, qty: 2, size: "M", color: "red", image: "" },
  ];

  beforeEach(() => {
    (useCartStore as unknown as jest.Mock).mockReturnValue({
      items: mockItems,
      clear: jest.fn(),
    });
    (http.post as jest.Mock).mockResolvedValue({ data: { paymentIntentId: "pi_123" } });
  });

  it("submits checkout successfully", async () => {
    render(<CheckoutPage />);

    // Fill form fields (using placeholder names)
    fireEvent.change(screen.getByPlaceholderText(/fullName/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/phone/i), { target: { value: "0123456789" } });
    fireEvent.change(screen.getByPlaceholderText(/street/i), { target: { value: "123 Rue" } });
    fireEvent.change(screen.getByPlaceholderText(/city/i), { target: { value: "Paris" } });
    fireEvent.change(screen.getByPlaceholderText(/country/i), { target: { value: "FR" } });
    fireEvent.change(screen.getByPlaceholderText(/postalCode/i), { target: { value: "75001" } });

    fireEvent.click(screen.getByRole("button", { name: /valider/i }));

    await waitFor(() => expect(http.post).toHaveBeenCalledTimes(2));
    expect(toast.success).toHaveBeenCalledWith("Commande creee");
  });

  it("shows validation error when form is invalid", async () => {
    render(<CheckoutPage />);
    fireEvent.click(screen.getByRole("button", { name: /valider/i }));
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
