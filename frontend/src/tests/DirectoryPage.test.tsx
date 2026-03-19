import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import DirectoryPage from "../pages/DirectoryPage";
import { MemoryRouter } from "react-router-dom";

// Mock usePosts context
const mockGetPublicPosts = vi.fn();

vi.mock("../contexts/PostsContext", () => ({
  usePosts: () => ({
    publicPosts: Array.from({ length: 10 }, (_, i) => ({
      id: i,
    })),
    getPublicPosts: mockGetPublicPosts,
  }),
}));

// Mock Filters component
vi.mock("../components/directory/Filters", () => ({
  default: ({ onClose }: { onClose?: () => void }) => (
    <div data-testid="filters">
      Filters Component
      {onClose && (
        <button data-testid="close-filters" onClick={onClose}>
          Close
        </button>
      )}
    </div>
  ),
}));

// Mock VolunteerCard component
vi.mock("../components/directory/VolunteerCard", () => ({
  default: () => <div data-testid="volunteer-card">Volunteer Card</div>,
}));

// Router context for button
const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe("DirectoryPage", () => {
  test("renders main directory layout", () => {
    renderWithRouter(<DirectoryPage />);

    expect(screen.getByTestId("directory-page-container")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Local Charity Posts" }),
    ).toBeInTheDocument();
  });

  test("renders volunteer cards", () => {
    renderWithRouter(<DirectoryPage />);

    const cards = screen.getAllByTestId("volunteer-card");
    expect(cards).toHaveLength(10);
  });

  test("renders desktop filters sidebar", () => {
    renderWithRouter(<DirectoryPage />);

    const filters = screen.getAllByTestId("filters");
    expect(filters.length).toBeGreaterThan(0);
  });

  test("opens mobile filters panel when button clicked", () => {
    renderWithRouter(<DirectoryPage />);

    const toggleButton = screen.getByRole("button", {
      name: "Show Filters",
    });

    fireEvent.click(toggleButton);

    expect(screen.getByText("Hide Filters")).toBeInTheDocument();
    expect(screen.getAllByTestId("filters").length).toBeGreaterThan(1);
  });

  test("closes filters when clicking backdrop", () => {
    renderWithRouter(<DirectoryPage />);

    const toggleButton = screen.getByRole("button", {
      name: "Show Filters",
    });

    fireEvent.click(toggleButton);

    const backdrop = document.querySelector(".bg-black\\/50");
    expect(backdrop).toBeInTheDocument();

    fireEvent.click(backdrop!);

    expect(screen.getByText("Show Filters")).toBeInTheDocument();
  });

  test("toggles button text correctly", () => {
    renderWithRouter(<DirectoryPage />);

    const toggleButton = screen.getByRole("button", {
      name: "Show Filters",
    });

    fireEvent.click(toggleButton);
    expect(screen.getByText("Hide Filters")).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(screen.getByText("Show Filters")).toBeInTheDocument();
  });
});
