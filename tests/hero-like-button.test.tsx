import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HeroLikeButton } from "@/components/home/hero-like-button";

describe("HeroLikeButton", () => {
  it("shows the base like count and increments after clicking once", async () => {
    const user = userEvent.setup();

    render(<HeroLikeButton baseCount={12} />);

    expect(screen.getByRole("button", { name: /like this intro/i })).toHaveTextContent("12");
    expect(screen.getByRole("button", { name: /like this intro/i })).toHaveTextContent("Like");

    await user.click(screen.getByRole("button", { name: /like this intro/i }));

    expect(screen.getByRole("button", { name: /you liked this intro/i })).toHaveTextContent("13");
    expect(screen.getByRole("button", { name: /you liked this intro/i })).toHaveTextContent("Liked");
  });
});
