import { render } from "@testing-library/react";
import { HomeSnapShell } from "@/components/home/home-snap-shell";

describe("HomeSnapShell", () => {
  it("moves by one panel after accumulated wheel input on desktop", () => {
    const scrollMocks = Array.from({ length: 3 }, () => vi.fn());
    const panels = Array.from({ length: 3 }, (_, index) => {
      return (
        <section
          key={index}
          className="home-panel"
          ref={(node: HTMLElement | null) => {
            if (node) {
              Object.defineProperty(node, "offsetTop", {
                configurable: true,
                value: index * 1000
              });
              node.scrollIntoView = scrollMocks[index] as typeof node.scrollIntoView;
            }
          }}
        >
          Panel {index}
        </section>
      );
    });

    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 1280
    });

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      writable: true,
      value: 0
    });

    render(<HomeSnapShell>{panels}</HomeSnapShell>);

    window.dispatchEvent(new WheelEvent("wheel", { deltaY: 60, cancelable: true }));
    window.dispatchEvent(new WheelEvent("wheel", { deltaY: 60, cancelable: true }));
    window.dispatchEvent(new WheelEvent("wheel", { deltaY: 60, cancelable: true }));

    expect(scrollMocks[0]).not.toHaveBeenCalled();
    expect(scrollMocks[1]).toHaveBeenCalledOnce();
    expect(scrollMocks[2]).not.toHaveBeenCalled();
  });
});
