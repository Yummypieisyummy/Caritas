import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi, it } from "vitest";
import HomePage from "../pages/HomePage";

// Mock FunctionCards component
vi.mock("../components/home/FunctionCards", () => ({
  default: () => <div data-testid="function-cards">Function Cards</div>,
}));

/*test("HomePage contains text info", () => {
  render(<HomePage />);
  const container = screen.getByTestId("home-page-container");
  expect(container.textContent).toContain(
    "Caritas is a tool that thoughtfully infuses love for humankind into its design. Cutting through the confusion of other platforms, Caritas aims to provide a simple avenue for connecting community organizations with charity recipients.",
  );
});*/

describe("HomePage", () => {
  it("renders the FunctionCards component", () => {
    render(<HomePage />);
    const functionCards = screen.getByTestId("function-cards");
    expect(functionCards).toBeInTheDocument();
  });
});
