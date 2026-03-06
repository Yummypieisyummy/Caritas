import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import AboutPage from "../pages/AboutPage";

test("AboutPage renders major sections", () => {
  render(<AboutPage />);

  expect(screen.getByText("Who is SVCare?")).toBeInTheDocument();
  expect(screen.getByText("Caritas' Mission")).toBeInTheDocument();
  expect(screen.getByText("How to Use")).toBeInTheDocument();
  expect(screen.getByText("Organizations")).toBeInTheDocument();
  expect(screen.getByText("Recipients")).toBeInTheDocument();
  expect(screen.getByText("Volunteers")).toBeInTheDocument();
  expect(screen.getByText("Reporting")).toBeInTheDocument();
  expect(
    screen.getByText(
      "Submit feedback, suggestions, or issues directly to our team:",
    ),
  ).toBeInTheDocument();

  expect(screen.getByTestId("about-page-container")).toHaveTextContent(
    "The Latin word",
  ); // italics still causing branch testing issues
});
