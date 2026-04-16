import { render } from "@testing-library/react";
import { HomeSnapShell } from "@/components/home/home-snap-shell";

describe("HomeSnapShell", () => {
  function installAnimationMocks() {
    let now = 0;
    const frameQueue: Array<FrameRequestCallback> = [];
    const performanceNowSpy = vi.spyOn(performance, "now").mockImplementation(() => now);
    const cancelAnimationFrameMock = vi.fn();

    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      frameQueue.push(callback);
      return frameQueue.length;
    });

    vi.stubGlobal("cancelAnimationFrame", cancelAnimationFrameMock);

    return {
      flushFrame(ms = 16) {
        const callback = frameQueue.shift();
        if (!callback) {
          return;
        }

        now += ms;
        callback(now);
      },
      hasFrames() {
        return frameQueue.length > 0;
      },
      restore() {
        performanceNowSpy.mockRestore();
        vi.unstubAllGlobals();
      }
    };
  }

  it("moves by one panel after three accumulated wheel gestures on desktop", () => {
    const animation = installAnimationMocks();
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

    while (animation.hasFrames()) {
      animation.flushFrame(100);
    }

    expect(scrollToMock.mock.calls.at(-1)?.[0]).toEqual({
      behavior: "auto",
      left: 0,
      top: 1000
    });

    animation.restore();
  });

  it("ignores extra wheel gestures while a panel transition is locked", () => {
    vi.useFakeTimers();
    const animation = installAnimationMocks();

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

    expect(scrollToMock).toHaveBeenCalledTimes(0);

    for (let i = 0; i < 20; i += 1) {
      window.dispatchEvent(new WheelEvent("wheel", { deltaY: 30, cancelable: true }));
    }

    expect(scrollToMock).toHaveBeenCalledTimes(0);

    while (animation.hasFrames()) {
      animation.flushFrame(100);
    }

    expect(scrollToMock.mock.calls.at(-1)?.[0]).toEqual({
      behavior: "auto",
      left: 0,
      top: 1000
    });

    animation.restore();
    vi.runAllTimers();
    vi.useRealTimers();
  });
});
