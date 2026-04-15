import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("shows the Chinese profile content and the writing preview", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /专注网络系统、工程实现与智能分析的开发者/i
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/陈嘉乐/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /关于我/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /项目经历/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /文章与笔记/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /查看全部文章/i })).toHaveAttribute("href", "/blog");
    expect(screen.getByRole("heading", { level: 2, name: /教育与经历/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /欢迎交流与合作/i })).toBeInTheDocument();
  });
});
