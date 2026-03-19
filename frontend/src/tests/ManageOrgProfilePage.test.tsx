import { render, screen, fireEvent } from "@testing-library/react";
import { test, expect } from "vitest";
import ManageOrgProfilePage from "../pages/ManageOrgProfilePage";
import "@testing-library/jest-dom";

test("renders ManageOrgProfilePage elements", () => {
  render(<ManageOrgProfilePage />);

  expect(
    screen.getByRole("heading", { name: "Edit Organization Profile" }),
  ).toBeInTheDocument();
  expect(
    screen.getByText("Manage your organization's public profile and branding."),
  ).toBeInTheDocument();

  expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Save Changes" }),
  ).toBeInTheDocument();

  expect(screen.getByRole("heading", { name: "Branding" })).toBeInTheDocument();
  expect(
    screen.getByText("This will be displayed on your public profile."),
  ).toBeInTheDocument();

  expect(screen.getByText("Cover Image")).toBeInTheDocument();
  expect(screen.getByText("Upload Cover")).toBeInTheDocument();

  expect(screen.getByText("Logo")).toBeInTheDocument();
});

test("allows cover image upload", () => {
  render(<ManageOrgProfilePage />);

  const fileInput = screen.getByTestId("cover-upload") as HTMLInputElement;

  const file = new File(["dummy"], "cover.png", { type: "image/png" });

  fireEvent.change(fileInput, {
    target: { files: [file] },
  });

  expect(fileInput.files && fileInput.files[0]).toBe(file);
  expect(fileInput.files && fileInput.files.length).toBe(1);
});

test("allows file upload for logo", async () => {
  render(<ManageOrgProfilePage />);

  const file = new File(["dummy content"], "logo.jpg", { type: "image/jpeg" });
  const fileInput = screen.getByTestId("logo-upload") as HTMLInputElement;

  fireEvent.change(fileInput, { target: { files: [file] } });

  expect(fileInput.files && fileInput.files[0]).toBe(file);
  expect(fileInput.files && fileInput.files.length).toBe(1);
});
