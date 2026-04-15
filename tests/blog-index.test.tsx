import { render, screen } from "@testing-library/react";
import BlogIndexPage from "@/app/blog/page";

describe("BlogIndexPage", () => {
  it("renders the Jared 01 Home journal archive", () => {
    render(<BlogIndexPage />);

    expect(screen.getByRole("heading", { level: 1, name: /jared 01 home/i })).toBeInTheDocument();
    expect(screen.getByText(/technical notes & build logs/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /featured note/i })).toBeInTheDocument();
    expect(
      screen.getByText(/AI Intelligent Network Diagnostics: from signal capture to actionable diagnosis/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Building Jared 01 Home: from personal profile to technical brand/i)).toBeInTheDocument();
  });
});
