import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("presents the resume with working navigation and retained site integrations", async () => {
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
    expect(screen.getByRole("heading", { name: "实习经历" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "教育、研究与技能" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /下载简历/ })).toHaveAttribute("href", "/assets/chen-jiale-resume.pdf");
    expect(screen.getByRole("link", { name: "博客" })).toHaveAttribute("href", "/blog");
    expect(screen.getAllByText(/受控合成 PR 评测/)).not.toHaveLength(0);
    expect(screen.getByRole("button", { name: /toggle theme/i })).toBeInTheDocument();
    const likeButton = screen.getByRole("button", { name: /appreciate this site/i });
    await waitFor(() => expect(likeButton).toBeEnabled());
    expect(screen.getByRole("img", { name: "陈嘉乐" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "技术笔记" })).toBeInTheDocument();
    expect(document.querySelector("#writing details .coding-pulse")).toBeTruthy();
    for (const link of screen.getAllByRole("link")) {
      const href = link.getAttribute("href");
      if (href?.startsWith("#")) {
        expect(document.getElementById(href.slice(1)), href).toBeTruthy();
      }
    }
  });
});
