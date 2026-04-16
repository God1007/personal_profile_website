import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("shows dedicated snap panels for each major homepage section", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /engineering systems with clarity/i
      })
    ).toBeInTheDocument();

    expect(screen.getAllByText(/jared 01 home/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/小陈/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /toggle theme/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /coding pulse/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /selected projects/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /jared 01 home/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /education & journey/i })).toBeInTheDocument();
    expect(screen.getByText(/build, measure, iterate/i)).toBeInTheDocument();
    expect(document.querySelector(".home-snap-shell")).toBeTruthy();
    expect(document.querySelectorAll(".home-panel")).toHaveLength(7);
    expect(document.querySelector("#work")).toBeTruthy();
    expect(document.querySelector("#writing")).toBeTruthy();
    expect(document.querySelector("#timeline")).toBeTruthy();
    expect(document.querySelector("#contact")).toBeTruthy();
  });
});
