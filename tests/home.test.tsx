import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("shows the stronger technical brand hero and key sections", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /engineering systems with clarity/i
      })
    ).toBeInTheDocument();

    expect(screen.getAllByText(/jared 01 home/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/小陈/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /toggle theme/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /selected projects/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /jared 01 home/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /education & journey/i })).toBeInTheDocument();
    expect(screen.getByText(/build, measure, iterate/i)).toBeInTheDocument();
  });
});
