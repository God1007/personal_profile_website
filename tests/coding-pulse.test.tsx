import { render, screen } from "@testing-library/react";
import { CodingPulse } from "@/components/home/coding-pulse";

describe("CodingPulse", () => {
  it("renders only the real-data coding pulse sections", () => {
    render(<CodingPulse />);

    expect(screen.getByRole("heading", { level: 3, name: /coding pulse/i })).toBeInTheDocument();
    expect(screen.getByText(/mock preview/i)).toBeInTheDocument();
    expect(screen.getByText(/total time/i)).toBeInTheDocument();
    expect(screen.getByText(/fluctuation/i)).toBeInTheDocument();
    expect(screen.queryByText(/languages/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/editors/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/projects/i)).not.toBeInTheDocument();
  });
});
