import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { ThemeToggle } from "@/components/theme/theme-toggle";

describe("ThemeToggle", () => {
  it("toggles between light and dark labels", () => {
    const handleToggle = vi.fn();

    render(<ThemeToggle initialTheme="light" onToggle={handleToggle} />);

    const button = screen.getByRole("button", { name: /toggle theme/i });
    expect(button).toHaveTextContent(/light/i);

    fireEvent.click(button);
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });
});
