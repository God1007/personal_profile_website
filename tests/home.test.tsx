import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("introduces the person and projects without a photo or resume scorecard", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(JSON.stringify({ count: 12, liked: false }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        })
      )
    );
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /陈嘉乐.*Chen Jiale/i
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "EvoAgent" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "智能网络诊断" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "关于" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "笔记" })).toHaveAttribute("href", "/blog");
    expect(screen.queryByRole("link", { name: /下载简历/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/GPA|P90|82\.5|2\.3%|IELTS|受控合成 PR 评测|你好，我是|我叫陈嘉乐|我在意什么|慢慢想/);
    expect(screen.getByRole("button", { name: /toggle theme/i })).toBeInTheDocument();
    const likeButton = screen.getByRole("button", { name: /appreciate this site/i });
    await waitFor(() => expect(likeButton).toBeEnabled());
    expect(screen.getByRole("heading", { name: "技术笔记" })).toBeInTheDocument();
    for (const link of screen.getAllByRole("link")) {
      const href = link.getAttribute("href");
      if (href?.startsWith("#")) {
        expect(document.getElementById(href.slice(1)), href).toBeTruthy();
      }
    }
  });
});
