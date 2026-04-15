import { render, screen } from "@testing-library/react";
import { CodingPulse } from "@/components/home/coding-pulse";

describe("CodingPulse", () => {
  it("renders the mock coding pulse preview by default", () => {
    render(<CodingPulse />);

    expect(screen.getByRole("heading", { level: 3, name: /coding pulse/i })).toBeInTheDocument();
    expect(screen.getByText(/mock preview/i)).toBeInTheDocument();
    expect(screen.getByText(/languages/i)).toBeInTheDocument();
    expect(screen.getByText(/editors/i)).toBeInTheDocument();
  });
});
