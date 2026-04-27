import { render, screen } from "@testing-library/react";
import { beforeEach, describe, test, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import DashboardOverviewPage from "../pages/DashboardOverviewPage";

const mocks = vi.hoisted(() => ({
  org: { id: "org-123", name: "Habitat Restore", verified: true },
}));

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({
    org: mocks.org,
  }),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe("DashboardOverviewPage", () => {
  beforeEach(() => {
    mocks.org = { id: "org-123", name: "Habitat Restore", verified: true };
  });

  test("renders welcome header and description", () => {
    renderWithRouter(<DashboardOverviewPage />);

    expect(
      screen.getByRole("heading", { name: "Welcome, Habitat Restore" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Here's a quick overview of your organization"),
    ).toBeInTheDocument();
  });

  test("displays dashboard statistics", () => {
    renderWithRouter(<DashboardOverviewPage />);

    expect(screen.getByText("Total Posts")).toBeInTheDocument();
    expect(screen.getByText("Pending Posts")).toBeInTheDocument();
    expect(screen.getByText("Team Members")).toBeInTheDocument();

    expect(screen.getByText("24")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
  });

  test("renders quick actions section", () => {
    renderWithRouter(<DashboardOverviewPage />);

    expect(
      screen.getByRole("heading", { name: "Quick Actions" }),
    ).toBeInTheDocument();
  });

  test("renders navigation buttons with correct routes", () => {
    renderWithRouter(<DashboardOverviewPage />);

    const postsButton = screen.getByRole("link", { name: "View All Posts" });
    const teamButton = screen.getByRole("link", { name: "Manage Team" });
    const settingsButton = screen.getByRole("link", {
      name: "Organization Settings",
    });

    expect(postsButton).toHaveAttribute("href", "/dashboard/posts");
    expect(teamButton).toHaveAttribute("href", "/dashboard/team");
    expect(settingsButton).toHaveAttribute("href", "/dashboard/settings");
  });

  test("renders all quick action buttons", () => {
    renderWithRouter(<DashboardOverviewPage />);

    expect(screen.getByText("View All Posts")).toBeInTheDocument();
    expect(screen.getByText("Manage Team")).toBeInTheDocument();
    expect(screen.getByText("Organization Settings")).toBeInTheDocument();
  });

  test("renders limited access banner for unverified organizations", () => {
    mocks.org = { id: "org-123", name: "Habitat Restore", verified: false };

    renderWithRouter(<DashboardOverviewPage />);

    expect(screen.getByText("Action Required")).toBeInTheDocument();
    expect(
      screen.getByText(/limited access mode/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "Manage Org Profile" }),
    ).toHaveAttribute("href", "/dashboard/profile");
  });
});
