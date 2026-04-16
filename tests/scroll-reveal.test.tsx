import { render, screen } from "@testing-library/react";
import { ScrollReveal } from "@/components/home/scroll-reveal";

describe("ScrollReveal", () => {
  it("renders variant classes and custom reveal variables", () => {
    render(
      <ScrollReveal
        variant="slide-left"
        delay={120}
        offset={40}
        scale={0.94}
        className="probe"
      >
        <span>Probe</span>
      </ScrollReveal>
    );

    const wrapper = screen.getByText("Probe").parentElement;
    expect(wrapper).toHaveClass("scroll-reveal");
    expect(wrapper).toHaveClass("scroll-reveal-slide-left");
    expect(wrapper).toHaveClass("probe");
    expect(wrapper).toHaveStyle({
      "--reveal-delay": "120ms",
      "--reveal-offset": "40px",
      "--reveal-scale": "0.94"
    });
  });
});
