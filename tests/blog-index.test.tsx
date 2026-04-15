import { render, screen } from "@testing-library/react";
import BlogIndexPage from "@/app/blog/page";

describe("BlogIndexPage", () => {
  it("renders the Chinese writing archive and the demo article", () => {
    render(<BlogIndexPage />);

    expect(screen.getByRole("heading", { level: 1, name: /文章/i })).toBeInTheDocument();
    expect(screen.getByText(/这是一个示例文章/i)).toBeInTheDocument();
  });
});
