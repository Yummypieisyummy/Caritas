import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import OrganizationProfilePage from "../pages/OrganizationProfilePage";
import { describe, test, expect, vi } from "vitest";

// Mocking child components
vi.mock("../components/directory/Filters.tsx", () => ({
  default: () => <div data-testid="filters" />,
}));

vi.mock("../components/organization profile/MiniVolunteerCard.tsx", () => ({
  default: ({ onOpen }: any) => (
    <button data-testid="mini-card" onClick={onOpen}>
      Open Post
    </button>
  ),
}));

vi.mock("../components/directory/VolunteerCard.tsx", () => ({
  default: () => <div data-testid="volunteer-card">VolunteerCard</div>,
}));

vi.mock("../components/ui/Button.tsx", () => ({
  default: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

const renderPage = (state?: any, paramId = "123") => {
  return render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: `/organization/${paramId}`,
          state,
        },
      ]}
    >
      <Routes>
        <Route path="/organization/:id" element={<OrganizationProfilePage />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("OrganizationProfilePage", () => {
  test("renders filters sidebar", () => {
    renderPage();
    expect(screen.getByTestId("filters")).toBeInTheDocument();
  });

  test("renders fallback organization name from param id", () => {
    renderPage();
    expect(screen.getByText("123")).toBeInTheDocument();
  });

  test("renders organization data from router state", () => {
    const org = {
      name: "Habitat Restore",
      address: "123 Main St",
      contact: {
        phone: "555-555-5555",
        email: "test@test.com",
        website: "habitat.org",
      },
    };

    renderPage({ org });

    expect(screen.getByText("Habitat Restore")).toBeInTheDocument();
    expect(screen.getByText(/123 Main St/)).toBeInTheDocument();
    expect(screen.getByText(/555-555-5555/)).toBeInTheDocument();
    expect(screen.getByText(/test@test.com/)).toBeInTheDocument();
  });

  test("formats website without http", () => {
    const org = {
      name: "Habitat Restore",
      address: "123 Main St",
      contact: {
        phone: "555-555-5555",
        email: "test@test.com",
        website: "habitat.org",
      },
    };

    renderPage({ org });

    const link = screen.getByRole("link", { name: "habitat.org" });
    expect(link).toHaveAttribute("href", "https://habitat.org");
  });

  test("keeps website if already has http", () => {
    const org = {
      name: "Habitat Restore",
      address: "123 Main St",
      contact: {
        phone: "555-555-5555",
        email: "test@test.com",
        website: "http://habitat.org",
      },
    };

    renderPage({ org });

    const link = screen.getByRole("link", { name: "http://habitat.org" });
    expect(link).toHaveAttribute("href", "http://habitat.org");
  });

  test("renders two MiniVolunteerCards", () => {
    renderPage();
    const cards = screen.getAllByTestId("mini-card");
    expect(cards).toHaveLength(2);
  });

  test("opens modal when MiniVolunteerCard clicked", () => {
    renderPage();

    fireEvent.click(screen.getAllByTestId("mini-card")[0]);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByTestId("volunteer-card")).toBeInTheDocument();
  });

  test("closes modal when close button clicked", () => {
    renderPage();

    fireEvent.click(screen.getAllByTestId("mini-card")[0]);

    fireEvent.click(screen.getByLabelText("Close"));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("closes modal when clicking backdrop", () => {
    renderPage();

    fireEvent.click(screen.getAllByTestId("mini-card")[0]);

    const backdrop = screen.getByRole("dialog");
    fireEvent.click(backdrop);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("modal stays open when clicking inside modal content", () => {
    renderPage();

    fireEvent.click(screen.getAllByTestId("mini-card")[0]);

    fireEvent.click(screen.getByTestId("volunteer-card"));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  test("renders about section", () => {
    renderPage();

    expect(screen.getByText("About")).toBeInTheDocument();
    expect(
      screen.getByText(/Habitat Restore accepts home goods/),
    ).toBeInTheDocument();
  });

  test("renders back to directory button", () => {
    renderPage();

    expect(screen.getByText(/Back to Directory/)).toBeInTheDocument();
  });
});
