import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

async function loadHeroLike() {
  vi.resetModules();

  const [{ HERO_LIKE_STORAGE_KEY }, { HeroLikeButton }] = await Promise.all([
    import("@/lib/hero-like"),
    import("@/components/home/hero-like-button")
  ]);

  return { HERO_LIKE_STORAGE_KEY, HeroLikeButton };
}

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

describe("HeroLikeButton", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("loads the shared count from the likes API", async () => {
    const { HeroLikeButton } = await loadHeroLike();
    const fetchMock = vi.fn(async () => jsonResponse({ count: 12, liked: false }));
    vi.stubGlobal("fetch", fetchMock);

    render(<HeroLikeButton />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /appreciate this site/i })).toHaveTextContent("12");
    });
    expect(fetchMock.mock.calls[0]?.[0]).toMatch(/^\/api\/likes\?visitorId=/);
  });

  it("increments the shared total once and persists the visitor state", async () => {
    const { HeroLikeButton, HERO_LIKE_STORAGE_KEY } = await loadHeroLike();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ count: 12, liked: false }))
      .mockResolvedValueOnce(jsonResponse({ count: 13, liked: true }));
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    render(<HeroLikeButton />);

    const button = await screen.findByRole("button", { name: /appreciate this site/i });
    await waitFor(() => expect(button).toHaveTextContent("12"));
    await user.click(button);

    expect(await screen.findByRole("button", { name: /you appreciated this site/i })).toHaveTextContent("13");
    expect(JSON.parse(window.localStorage.getItem(HERO_LIKE_STORAGE_KEY) ?? "{}")).toMatchObject({ liked: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1]?.[1]).toMatchObject({ method: "POST" });
  });

  it("does not submit again when this visitor already liked", async () => {
    const { HeroLikeButton, HERO_LIKE_STORAGE_KEY } = await loadHeroLike();
    window.localStorage.setItem(
      HERO_LIKE_STORAGE_KEY,
      JSON.stringify({ visitorId: "visitor_already_liked_123", liked: true })
    );
    const fetchMock = vi.fn(async () => jsonResponse({ count: 19, liked: true }));
    vi.stubGlobal("fetch", fetchMock);

    render(<HeroLikeButton />);

    const button = await screen.findByRole("button", { name: /you appreciated this site/i });
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("19");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("shows the static baseline when the shared API is temporarily unavailable", async () => {
    const { HeroLikeButton } = await loadHeroLike();
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error("network down"))
      .mockResolvedValueOnce(jsonResponse({ count: 12 }));
    vi.stubGlobal("fetch", fetchMock);

    render(<HeroLikeButton />);

    const button = await screen.findByRole("button", { name: /appreciate this site/i });
    await waitFor(() => expect(button).toHaveTextContent("12"));
    expect(button).toBeEnabled();
    expect(screen.getByText(/shared counter unavailable/i)).toBeInTheDocument();
  });

  it("does not store a like when the shared update fails", async () => {
    const { HeroLikeButton, HERO_LIKE_STORAGE_KEY } = await loadHeroLike();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ count: 12, liked: false }))
      .mockResolvedValueOnce(jsonResponse({ error: "write failed" }, 503));
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    render(<HeroLikeButton />);
    const button = await screen.findByRole("button", { name: /appreciate this site/i });
    await waitFor(() => expect(button).toHaveTextContent("12"));
    await user.click(button);

    await waitFor(() => expect(button).toHaveTextContent(/retry/i));
    expect(JSON.parse(window.localStorage.getItem(HERO_LIKE_STORAGE_KEY) ?? "{}")).toMatchObject({ liked: false });
  });
});
