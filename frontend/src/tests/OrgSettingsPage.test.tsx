import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import OrgSettingsPage from "../pages/OrgSettingsPage";

// Mocking child components
vi.mock("../components/ui/Button", () => ({
  default: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

vi.mock("../components/ui/Toggle", () => ({
  default: () => <div data-testid="toggle" />,
}));

vi.mock("../components/ui/Select", () => ({
  default: ({ defaultValue }: any) => (
    <select data-testid="select" defaultValue={defaultValue}>
      <option>1 month</option>
      <option>6 months</option>
      <option>1 year</option>
      <option>Indefinite</option>
    </select>
  ),
}));

vi.mock("../components/dashboard/ConfirmActionModal", () => ({
  default: ({ isOpen, onClose, onConfirm, title, confirmText }: any) =>
    isOpen ? (
      <div role="dialog">
        <h3>{title}</h3>
        <button onClick={onConfirm}>{confirmText}</button>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

describe("OrgSettingsPage", () => {
  test("renders page headings", () => {
    render(<OrgSettingsPage />);

    expect(screen.getByText("Manage Settings")).toBeInTheDocument();
    expect(
      screen.getByText("Handle Organization Settings and Preferences"),
    ).toBeInTheDocument();
  });

  test("renders account information", () => {
    render(<OrgSettingsPage />);

    expect(screen.getByText("Organization Name")).toBeInTheDocument();
    expect(screen.getByText("Habitat Restore")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("habitatrestore@gmal.com")).toBeInTheDocument();
    expect(screen.getByText("Member Since")).toBeInTheDocument();
    expect(screen.getByText("Feb 29, 2026")).toBeInTheDocument();
  });

  test("renders toggle components", () => {
    render(<OrgSettingsPage />);

    const toggles = screen.getAllByTestId("toggle");
    expect(toggles.length).toBe(2);
  });

  test("renders select component with default value", () => {
    render(<OrgSettingsPage />);

    const select = screen.getByTestId("select");
    expect(select).toBeInTheDocument();
  });

  test("opens delete org data modal", () => {
    render(<OrgSettingsPage />);

    fireEvent.click(screen.getByText("Delete Organization Data"));

    expect(screen.getByText("Delete Data")).toBeInTheDocument();
  });

  test("confirm delete org data action", async () => {
    const consoleSpy = vi.spyOn(console, "log");

    render(<OrgSettingsPage />);
    fireEvent.click(screen.getByText("Delete Data"));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const buttons = screen.getAllByText("Delete Data");

    fireEvent.click(buttons[1]);

    expect(consoleSpy).toHaveBeenCalledWith("delete data test");
  });

  test("opens reset password modal", () => {
    render(<OrgSettingsPage />);

    fireEvent.click(screen.getByText("Reset Password"));

    expect(
      screen.getByText("Reset Organization Password?"),
    ).toBeInTheDocument();
  });

  test("confirm reset password action", () => {
    const consoleSpy = vi.spyOn(console, "log");

    render(<OrgSettingsPage />);

    fireEvent.click(screen.getByText("Reset Password"));
    fireEvent.click(screen.getByText("Send Reset Link"));

    expect(consoleSpy).toHaveBeenCalledWith("reset password test");
  });

  test("opens delete account modal", () => {
    render(<OrgSettingsPage />);

    fireEvent.click(screen.getByText("Delete Account"));

    expect(
      screen.getByText("Delete Organization Account?"),
    ).toBeInTheDocument();
  });

  test("confirm delete account action", () => {
    const consoleSpy = vi.spyOn(console, "log");

    render(<OrgSettingsPage />);

    fireEvent.click(screen.getByText("Delete Account"));
    fireEvent.click(screen.getByText("Delete Organization"));

    expect(consoleSpy).toHaveBeenCalledWith("delete org account test");
  });

  test("closes modal when close clicked", () => {
    render(<OrgSettingsPage />);

    fireEvent.click(screen.getByText("Delete Data"));

    fireEvent.click(screen.getByText("Close"));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
