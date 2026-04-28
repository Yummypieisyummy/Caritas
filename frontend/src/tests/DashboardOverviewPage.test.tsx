import { render, screen } from "@testing-library/react";
import { beforeEach, describe, test, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import DashboardOverviewPage from "../pages/DashboardOverviewPage";

const mocks = vi.hoisted(() => ({
  org: { id: "org-123", name: "Habitat Restore", verified: true },
  orgPosts: [
    {
      id: "post-1",
      org_id: "org-123",
      post_type: "volunteer_request",
      event_type: "one-time",
      title: "Saturday Build",
      description: "Help build shelving",
      additional_details: null,
      location: "Latrobe, PA",
      latitude: null,
      longitude: null,
      requirements: [],
      date_start: "2026-05-01",
      date_end: null,
      days_of_week: null,
      contact_email: "hello@example.com",
      interested: 0,
      status: "active",
      contact_phone: "555-0000",
      created_at: "2026-04-20T00:00:00.000Z",
    },
    {
      id: "post-2",
      org_id: "org-123",
      post_type: "item_request",
      event_type: "one-time",
      title: "Paint Supplies",
      description: "Need paint trays",
      additional_details: null,
      location: "Latrobe, PA",
      latitude: null,
      longitude: null,
      requirements: [],
      date_start: "2026-05-03",
      date_end: null,
      days_of_week: null,
      contact_email: "hello@example.com",
      interested: 0,
      status: "closed",
      contact_phone: "555-0000",
      created_at: "2026-04-18T00:00:00.000Z",
    },
  ],
  teamMembers: [
    { id: "user-1", email: "admin@example.com", role: "admin" },
    { id: "user-2", email: "member@example.com", role: "member" },
  ],
}));

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({
    org: mocks.org,
  }),
}));

vi.mock("../hooks/useOrgPosts", () => ({
  useOrgPosts: () => ({
    orgPosts: mocks.orgPosts,
    status: "success",
  }),
}));

vi.mock("../hooks/useTeamMembers", () => ({
  useTeamMembers: () => ({
    teamMembers: mocks.teamMembers,
    teamQuery: { isPending: false, isError: false },
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
    expect(screen.getByText("Active Posts")).toBeInTheDocument();
    expect(screen.getByText("Volunteer Requests")).toBeInTheDocument();
    expect(screen.getByText("Team Members")).toBeInTheDocument();

    expect(screen.getAllByText("2")).toHaveLength(2);
    expect(screen.getAllByText("1")).toHaveLength(2);
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
    const createPostButton = screen.getByRole("link", { name: "Create Post" });
    const teamButton = screen.getByRole("link", { name: "Manage Team" });
    const settingsButton = screen.getByRole("link", {
      name: "Organization Settings",
    });

    expect(postsButton).toHaveAttribute("href", "/dashboard/posts");
    expect(createPostButton).toHaveAttribute("href", "/dashboard/posts/create");
    expect(teamButton).toHaveAttribute("href", "/dashboard/team");
    expect(settingsButton).toHaveAttribute("href", "/dashboard/settings");
  });

  test("renders all quick action buttons", () => {
    renderWithRouter(<DashboardOverviewPage />);

    expect(screen.getByText("View All Posts")).toBeInTheDocument();
    expect(screen.getByText("Create Post")).toBeInTheDocument();
    expect(screen.getByText("Manage Team")).toBeInTheDocument();
    expect(screen.getByText("Organization Settings")).toBeInTheDocument();
  });

  test("renders recent posts from organization data", () => {
    renderWithRouter(<DashboardOverviewPage />);

    expect(screen.getByRole("heading", { name: "Recent Posts" })).toBeInTheDocument();
    expect(screen.getByText("Saturday Build")).toBeInTheDocument();
    expect(screen.getByText("Paint Supplies")).toBeInTheDocument();
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
