import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { afterEach, test, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import { useAuth } from "../contexts/AuthContext";

// Mock navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock auth context
vi.mock("../contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

// Mock lucide icons
vi.mock("lucide-react", () => ({
  Eye: () => <svg data-testid="eye-icon" />,
  EyeOff: () => <svg data-testid="eyeoff-icon" />,
}));

const renderWithRouter = () => {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  );
};

afterEach(() => {
  vi.clearAllMocks();
});

test("renders login form elements", () => {
  (useAuth as any).mockReturnValue({ login: vi.fn() });

  renderWithRouter();

  expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();

  expect(screen.getByLabelText("Email")).toBeInTheDocument();
  expect(screen.getByLabelText("Password")).toBeInTheDocument();

  expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();

  expect(screen.getByText("Need an account?")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Signup" })).toHaveAttribute(
    "href",
    "/signup",
  );
});

test("shows validation errors on empty submit", async () => {
  (useAuth as any).mockReturnValue({ login: vi.fn() });

  renderWithRouter();

  fireEvent.click(screen.getByRole("button", { name: "Login" }));

  await waitFor(() => {
    expect(screen.getByText("Please enter a valid email")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });
});

test("toggles password visibility", () => {
  (useAuth as any).mockReturnValue({ login: vi.fn() });

  renderWithRouter();

  const passwordInput = screen.getByLabelText("Password");
  const toggleButton = screen.getAllByRole("button")[0];

  expect(passwordInput).toHaveAttribute("type", "password");

  fireEvent.click(toggleButton);

  expect(passwordInput).toHaveAttribute("type", "text");

  fireEvent.click(toggleButton);

  expect(passwordInput).toHaveAttribute("type", "password");
});

test("submits successfully and navigates", async () => {
  const mockLogin = vi.fn().mockResolvedValue(undefined);
  (useAuth as any).mockReturnValue({ login: mockLogin });

  renderWithRouter();

  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "test@example.com" },
  });

  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "password123" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Login" }));

  await waitFor(() => {
    expect(mockLogin).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  expect(mockNavigate).toHaveBeenCalledWith("/dashboard/overview");
});

test("shows error message when login fails", async () => {
  const mockLogin = vi.fn().mockRejectedValue(new Error("Invalid"));
  (useAuth as any).mockReturnValue({ login: mockLogin });

  renderWithRouter();

  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "test@example.com" },
  });

  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "wrongpassword" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Login" }));

  await waitFor(() => {
    expect(
      screen.getByText(
        "Invalid email or password or captcha verification failed",
      ),
    ).toBeInTheDocument();
  });
});

test("shows submitting state", async () => {
  let resolveLogin: any;

  const mockLogin = vi.fn(
    () =>
      new Promise<void>((resolve) => {
        resolveLogin = resolve;
      }),
  );

  (useAuth as any).mockReturnValue({ login: mockLogin });

  renderWithRouter();

  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "test@example.com" },
  });

  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "password123" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Login" }));

  await waitFor(() => {
    expect(screen.getByText("Logging in...")).toBeInTheDocument();
  });

  resolveLogin();

  // Wait for navigation to occur after resolution
  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalled();
  });
});
