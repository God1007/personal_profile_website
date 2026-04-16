import { render } from "@testing-library/react";
import { HomeSnapShell } from "@/components/home/home-snap-shell";

describe("HomeSnapShell", () => {
  it("moves by one panel after three accumulated wheel gestures on desktop", () => {
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

    const scrollToMock = vi.fn();
    Object.defineProperty(window, "scrollTo", {
      configurable: true,
      value: scrollToMock
    });

    render(<HomeSnapShell>{panels}</HomeSnapShell>);

    for (let i = 0; i < 5; i += 1) {
      window.dispatchEvent(new WheelEvent("wheel", { deltaY: 30, cancelable: true }));
    }

    expect(scrollToMock).not.toHaveBeenCalled();

    for (let i = 0; i < 5; i += 1) {
      window.dispatchEvent(new WheelEvent("wheel", { deltaY: 30, cancelable: true }));
    }

    expect(scrollToMock).not.toHaveBeenCalled();

    for (let i = 0; i < 5; i += 1) {
      window.dispatchEvent(new WheelEvent("wheel", { deltaY: 30, cancelable: true }));
    }

    expect(scrollToMock).toHaveBeenCalledOnce();
    expect(scrollToMock).toHaveBeenCalledWith({
      behavior: "smooth",
      top: 1000
    });
  });

  it("ignores extra wheel gestures while a panel transition is locked", () => {
    vi.useFakeTimers();

    const panels = Array.from({ length: 3 }, (_, index) => (
      <section
        key={index}
        className="home-panel"
        ref={(node: HTMLElement | null) => {
          if (node) {
            Object.defineProperty(node, "offsetTop", {
              configurable: true,
              value: index * 1000
            });
          }
        }}
      >
        Panel {index}
      </section>
    ));

    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 1280
    });

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      writable: true,
      value: 0
    });

    const scrollToMock = vi.fn();
    Object.defineProperty(window, "scrollTo", {
      configurable: true,
      value: scrollToMock
    });

    render(<HomeSnapShell>{panels}</HomeSnapShell>);

    for (let i = 0; i < 15; i += 1) {
      window.dispatchEvent(new WheelEvent("wheel", { deltaY: 30, cancelable: true }));
    }

    expect(scrollToMock).toHaveBeenCalledTimes(1);

    for (let i = 0; i < 20; i += 1) {
      window.dispatchEvent(new WheelEvent("wheel", { deltaY: 30, cancelable: true }));
    }

    expect(scrollToMock).toHaveBeenCalledTimes(1);

    vi.runAllTimers();
    vi.useRealTimers();
  });
});
