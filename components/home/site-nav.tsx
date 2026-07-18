"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { siteContent } from "@/data/site-content";

const navItems = [
  { href: "#about", label: "About", sectionId: "about" },
  { href: "#pulse", label: "Activity", sectionId: "pulse" },
  { href: "#work", label: "Projects", sectionId: "work" },
  { href: "/blog", label: "Journal", sectionId: null },
  { href: "#timeline", label: "Journey", sectionId: "timeline" },
  { href: "#contact", label: "Contact", sectionId: "contact" }
] as const;

function NavLinks({ activeId }: { activeId: string }) {
  return (
    <>
      {navItems.map((item) => {
        const className = item.sectionId === activeId ? "is-active" : undefined;

        return item.href.startsWith("/") ? (
          <Link key={item.href} href={item.href} className={className}>
            {item.label}
          </Link>
        ) : (
          <a key={item.href} href={item.href} className={className}>
            {item.label}
          </a>
        );
      })}
    </>
  );
}

export function SiteNav() {
  const [activeId, setActiveId] = useState("about");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      return;
    }

    const sections = navItems
      .map((item) => (item.sectionId ? document.getElementById(item.sectionId) : null))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveId(visible.target.id);
        }
      },
      { rootMargin: "-20% 0px -64% 0px", threshold: [0.05, 0.2, 0.45] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="portfolio-nav-wrap">
      <div className="portfolio-nav container">
        <a className="portfolio-brand" href="#top" aria-label="Back to top">
          <span className="portfolio-brand-mark">{siteContent.profile.initials}</span>
          <span>{siteContent.profile.englishName}</span>
        </a>

        <nav className="portfolio-nav-links" aria-label="Main navigation">
          <NavLinks activeId={activeId} />
        </nav>

        <div className="portfolio-nav-action">
          <ThemeToggle />
        </div>

        <details className="portfolio-mobile-menu">
          <summary>Menu</summary>
          <nav aria-label="Mobile navigation">
            <NavLinks activeId={activeId} />
          </nav>
        </details>
      </div>
    </header>
  );
}
