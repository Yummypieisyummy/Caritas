import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import CreatePostPage from "../pages/CreatePostPage";

afterEach(() => {
  vi.clearAllMocks();
});

// Mock console.log to avoid noise in tests
const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

// Helper function to render with router context - button relies on link from react router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

test("renders CreatePostPage with form elements", () => {
  renderWithRouter(<CreatePostPage />);

  // Check for form fields and buttons
  expect(screen.getByText("Create New Post")).toBeInTheDocument();
  expect(screen.getByLabelText("Title")).toBeInTheDocument();
  expect(screen.getByLabelText("Description")).toBeInTheDocument();
  expect(screen.getByText("Event Schedule")).toBeInTheDocument();
  expect(screen.getByText("One-time event")).toBeInTheDocument();
  expect(screen.getByText("Recurring event")).toBeInTheDocument();
  expect(screen.getByLabelText("Event Date")).toBeInTheDocument();
  expect(screen.getByLabelText("Address")).toBeInTheDocument();
  expect(screen.getByLabelText("Contact Email")).toBeInTheDocument();
  expect(screen.getByLabelText("Phone Number")).toBeInTheDocument();
  expect(
    screen.getByLabelText("Additional Details (Optional)"),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Cancel" })).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Create Post" }),
  ).toBeInTheDocument();
});

test("toggles between one-time and recurring event types", () => {
  renderWithRouter(<CreatePostPage />);

  // Check initial state (one-time selected)
  const oneTimeButton = screen.getByText("One-time event");
  const recurringButton = screen.getByText("Recurring event");

  // Check expected functioning with one-time selected
  expect(oneTimeButton).toHaveClass("bg-accent-green");
  expect(recurringButton).not.toHaveClass("bg-accent-green");

  // Check behavior when clicking recurring
  fireEvent.click(recurringButton);
  expect(recurringButton).toHaveClass("bg-accent-green");
  expect(oneTimeButton).not.toHaveClass("bg-accent-green");
  expect(screen.getByLabelText("Start Date")).toBeInTheDocument();
  expect(screen.getByLabelText("End Date (Optional)")).toBeInTheDocument();
  expect(screen.getByText("Select Days")).toBeInTheDocument();

  // Check behavior when clicking back to one-time
  fireEvent.click(oneTimeButton);
  expect(oneTimeButton).toHaveClass("bg-accent-green");
  expect(recurringButton).not.toHaveClass("bg-accent-green");
  expect(
    screen.queryByLabelText("End Date (Optional)"),
  ).not.toBeInTheDocument();
  expect(screen.queryByText("Select Days")).not.toBeInTheDocument();
});

test("selects days for recurring events", () => {
  renderWithRouter(<CreatePostPage />);

  // Switch to recurring
  fireEvent.click(screen.getByText("Recurring event"));

  const mondayCheckbox = screen.getByLabelText("Monday");
  const tuesdayCheckbox = screen.getByLabelText("Tuesday");

  // Check Monday
  fireEvent.click(mondayCheckbox);
  expect(mondayCheckbox).toBeChecked();

  // Check Tuesday
  fireEvent.click(tuesdayCheckbox);
  expect(tuesdayCheckbox).toBeChecked();

  // Uncheck Monday
  fireEvent.click(mondayCheckbox);
  expect(mondayCheckbox).not.toBeChecked();
});

test("shows validation errors for invalid form data", async () => {
  renderWithRouter(<CreatePostPage />);

  const submitButton = screen.getByRole("button", { name: "Create Post" });

  // Submit empty form
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(
      screen.getByText("Title must be at least 5 characters"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Description must be at least 20 characters"),
    ).toBeInTheDocument();
    expect(screen.getByText("Start date is required")).toBeInTheDocument();
    expect(screen.getByText("Address is required")).toBeInTheDocument();
    expect(screen.getByText("Please enter a valid email")).toBeInTheDocument();
    expect(
      screen.getByText("Please enter a valid phone number"),
    ).toBeInTheDocument();
  });
});

/*
test("submits form with valid data", async () => {
  const user = userEvent.setup();

  renderWithRouter(<CreatePostPage />);

  await user.type(
    screen.getByPlaceholderText("Enter post title"),
    "Valid Title",
  );

  await user.type(
    screen.getByPlaceholderText("Enter post description"),
    "This is a valid description with more than 20 characters.",
  );

  await user.type(screen.getByLabelText(/Event Date/i), "2023-12-01");

  await user.type(screen.getByPlaceholderText("Enter address"), "123 Main St");

  await user.type(
    screen.getByPlaceholderText("Enter contact email"),
    "test@example.com",
  );

  await user.type(
    screen.getByPlaceholderText("Enter phone number"),
    "123-456-7890",
  );

  await user.click(screen.getByRole("button", { name: /create post/i }));

  await waitFor(() => {
    expect(consoleSpy).toHaveBeenCalled();
  });

  expect(consoleSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      title: "Valid Title",
      email: "test@example.com",
      phoneNumber: "123-456-7890",
    }),
  );
});
*/
