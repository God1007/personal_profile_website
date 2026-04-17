import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const HERO_LIKE_API_URL = "https://example.test/hero-like";

async function loadHeroLike(apiUrl: string | null = HERO_LIKE_API_URL) {
  vi.resetModules();
  if (apiUrl === null) {
    delete process.env.NEXT_PUBLIC_HERO_LIKE_API_URL;
  } else {
    process.env.NEXT_PUBLIC_HERO_LIKE_API_URL = apiUrl;
  }

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
    delete process.env.NEXT_PUBLIC_HERO_LIKE_API_URL;
  });

  it("loads and shows the shared count", async () => {
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
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ count: 12 }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ count: 13, liked: true }), {
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
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not submit again when this browser already liked", async () => {
    const { HeroLikeButton, HERO_LIKE_STORAGE_KEY } = await loadHeroLike();
    window.localStorage.setItem(HERO_LIKE_STORAGE_KEY, "liked");

    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ count: 13 }), {
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

  it("disables the button when the endpoint is missing", async () => {
    const { HeroLikeButton } = await loadHeroLike(null);

    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(<HeroLikeButton />);

    const button = await screen.findByRole("button", { name: /like this intro/i });
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("0");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows an error state when the like submission fails", async () => {
    const { HeroLikeButton } = await loadHeroLike();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ count: 12 }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ error: "boom" }), {
          status: 500,
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

    const errorButton = await screen.findByRole("button", { name: /like this intro unavailable/i });
    expect(errorButton).toHaveClass("is-error");
    expect(errorButton).toBeDisabled();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
