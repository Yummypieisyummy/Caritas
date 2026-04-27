import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CreatePostPage from "../pages/CreatePostPage";

// ---- Mock UI components ----
vi.mock("../components/ui/Input", () => ({
  default: ({ label, id, error, ...props }: any) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} {...props} />
      {error && <span>{error}</span>}
    </div>
  ),
}));

vi.mock("../components/ui/Select", () => ({
  default: ({ label, id, name, options, error, ...props }: any) => {
    const inputId = id || name;

    return (
      <div>
        <label htmlFor={inputId}>{label}</label>
        <select id={inputId} name={name} {...props}>
          <option value="">Select</option>
          {options.map((opt: string) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {error && <span>{error}</span>}
      </div>
    );
  },
}));

vi.mock("../components/ui/Button", () => ({
  default: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

// ---- Mock hooks ----
const mocks = vi.hoisted(() => ({
  createPost: vi.fn(),
  navigate: vi.fn(),
}));

vi.mock("../hooks/useOrgPosts", () => ({
  useOrgPosts: () => ({
    createPost: mocks.createPost,
  }),
}));

vi.mock("../hooks/useAvailableTags", () => ({
  useAvailableTags: () => ({
    tags: [
      {
        id: 1,
        name: "Requires Credentials",
        color: "purple",
        display: true,
      },
      {
        id: 2,
        name: "Orientation Needed",
        color: "blue",
        display: true,
      },
      {
        id: 3,
        name: "Requires Driver's License",
        color: "orange",
        display: true,
      },
      {
        id: 4,
        name: "Food Handling Certification",
        color: "green",
        display: true,
      },
    ],
    status: "success",
  }),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mocks.navigate,
}));

// ---- Helper ----
const fillValidForm = () => {
  fireEvent.change(screen.getByLabelText(/title/i), {
    target: { value: "Valid Title" },
  });

  fireEvent.change(screen.getByLabelText(/description/i), {
    target: { value: "This is a valid description with enough length." },
  });

  fireEvent.change(screen.getByLabelText(/post type/i), {
    target: { value: "Volunteer Request" },
  });

  fireEvent.change(screen.getByLabelText(/event date/i), {
    target: { value: "2026-01-01" },
  });

  fireEvent.change(screen.getByLabelText(/address/i), {
    target: { value: "123 Main St" },
  });

  fireEvent.change(screen.getByLabelText(/contact email/i), {
    target: { value: "test@email.com" },
  });

  fireEvent.change(screen.getByLabelText(/phone number/i), {
    target: { value: "1234567890" },
  });
};

describe("CreatePostPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all fields", () => {
    render(<CreatePostPage />);

    expect(screen.getByText(/create new post/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/post type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/event date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contact email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
  });

  it("shows validation errors on submit", async () => {
    render(<CreatePostPage />);

    fireEvent.click(screen.getByText(/create post/i));

    await waitFor(() => {
      expect(screen.getByText(/title must be at least 5/i)).toBeInTheDocument();
      expect(
        screen.getByText(/description must be at least 20/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/address is required/i)).toBeInTheDocument();
    });
  });

  it("toggles to recurring event and shows extra fields", () => {
    render(<CreatePostPage />);

    fireEvent.click(screen.getByText(/recurring event/i));

    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
    expect(screen.getByText(/select days/i)).toBeInTheDocument();
  });

  it("toggles days for recurring events", () => {
    render(<CreatePostPage />);

    fireEvent.click(screen.getByText(/recurring event/i));

    const mondayCheckbox = screen.getByLabelText(/monday/i);

    fireEvent.click(mondayCheckbox);
    expect(mondayCheckbox).toBeChecked();

    fireEvent.click(mondayCheckbox);
    expect(mondayCheckbox).not.toBeChecked();
  });

  it("resets recurring days when switching back to one-time", () => {
    render(<CreatePostPage />);

    fireEvent.click(screen.getByText(/recurring event/i));
    fireEvent.click(screen.getByLabelText(/monday/i));

    fireEvent.click(screen.getByText(/one-time event/i));

    expect(screen.queryByLabelText(/monday/i)).not.toBeInTheDocument();
  });

  it("submits form successfully", async () => {
    mocks.createPost.mockResolvedValueOnce({});

    render(<CreatePostPage />);

    fillValidForm();

    fireEvent.click(screen.getByText(/create post/i));

    await waitFor(() => {
      expect(mocks.createPost).toHaveBeenCalled();
      expect(mocks.navigate).toHaveBeenCalledWith("/dashboard/posts");
    });
  });

  it("submits selected requirement tags", async () => {
    mocks.createPost.mockResolvedValueOnce({});

    render(<CreatePostPage />);

    fillValidForm();
    fireEvent.click(screen.getByLabelText(/requires credentials/i));
    fireEvent.click(screen.getByLabelText(/food handling certification/i));
    fireEvent.click(screen.getByText(/create post/i));

    await waitFor(() => {
      expect(mocks.createPost).toHaveBeenCalledWith(
        expect.objectContaining({
          tagIds: [1, 4],
        }),
      );
    });
  });

  it("handles submission error", async () => {
    mocks.createPost.mockRejectedValueOnce(new Error("fail"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<CreatePostPage />);

    fillValidForm();

    fireEvent.click(screen.getByText(/create post/i));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it("disables button while submitting", async () => {
    mocks.createPost.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );

    render(<CreatePostPage />);

    fillValidForm();

    const button = screen.getByText(/create post/i);

    fireEvent.click(button);

    expect(button).toBeDisabled();
  });
});
