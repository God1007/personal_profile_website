import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

async function loadHeroLike() {
  vi.resetModules();

  const [{ HERO_LIKE_STORAGE_KEY }, { HeroLikeButton }] = await Promise.all([
    import("@/lib/hero-like"),
    import("@/components/home/hero-like-button"),
  ]);

  return { HERO_LIKE_STORAGE_KEY, HeroLikeButton };
}

describe("HeroLikeButton", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("loads and shows the baseline count from the static json file", async () => {
    const { HeroLikeButton } = await loadHeroLike();

    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(JSON.stringify({ count: 12 }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      )
    );

    render(<HeroLikeButton />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /like this intro/i })).toHaveTextContent("12");
    });
  });

  it("increments once and persists the liked state locally", async () => {
    const { HeroLikeButton, HERO_LIKE_STORAGE_KEY } = await loadHeroLike();
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ count: 12 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    render(<HeroLikeButton />);

    const button = await screen.findByRole("button", { name: /like this intro/i });
    await waitFor(() => {
      expect(button).toHaveTextContent("12");
    });

    await user.click(button);

    expect(await screen.findByRole("button", { name: /you liked this intro/i })).toHaveTextContent("13");
    expect(window.localStorage.getItem(HERO_LIKE_STORAGE_KEY)).toBe("liked");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("shows baseline plus one when this browser already liked", async () => {
    const { HeroLikeButton, HERO_LIKE_STORAGE_KEY } = await loadHeroLike();
    window.localStorage.setItem(HERO_LIKE_STORAGE_KEY, "liked");

    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ count: 12 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    vi.stubGlobal("fetch", fetchMock);

    render(<HeroLikeButton />);

    const button = await screen.findByRole("button", { name: /you liked this intro/i });
    expect(button).toBeDisabled();
    expect(await screen.findByRole("button", { name: /you liked this intro/i })).toHaveTextContent("13");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("falls back safely when the baseline json cannot be loaded", async () => {
    const { HeroLikeButton } = await loadHeroLike();
    const fetchMock = vi.fn().mockRejectedValueOnce(new Error("network down"));

    vi.stubGlobal("fetch", fetchMock);

    render(<HeroLikeButton />);

    const button = await screen.findByRole("button", { name: /like this intro/i });
    await waitFor(() => {
      expect(button).toHaveTextContent("0");
    });
    expect(button).toBeEnabled();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
