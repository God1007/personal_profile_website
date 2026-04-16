import Link from "next/link";
import { CodingPulse } from "@/components/home/coding-pulse";
import { HeroLikeButton } from "@/components/home/hero-like-button";
import { HeroOrbit } from "@/components/home/hero-orbit";
import { HomeSnapShell } from "@/components/home/home-snap-shell";
import { ScrollReveal } from "@/components/home/scroll-reveal";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { siteContent } from "@/data/site-content";
import { getFeaturedPosts } from "@/lib/blog";
import { loadCachedWakaTimeShare } from "@/lib/wakatime-cache.server";

export default async function HomePage() {
  const { site, profile, codingPulse, strengths, projects, timeline, contacts, writing } = siteContent;
  const featuredPosts = getFeaturedPosts().slice(0, 3);
  const [featuredProject, ...secondaryProjects] = projects;
  const codingPulseData = await loadCachedWakaTimeShare(
    codingPulse.shareUrl ?? process.env.NEXT_PUBLIC_WAKATIME_SHARE_URL ?? null
  );

  return (
    <HomeSnapShell>
      <section className="hero-shell home-panel home-panel-hero">
        <div className="hero-backdrop" aria-hidden="true">
          <span className="hero-backdrop-image hero-backdrop-image-light" />
          <span className="hero-backdrop-image hero-backdrop-image-dark" />
          <span className="hero-backdrop-fade" />
          <span className="hero-glow hero-glow-a" />
          <span className="hero-glow hero-glow-b" />
          <span className="hero-gridline" />
          <span className="hero-noise" />
        </div>

        <header className="site-nav site-nav-framed container surface-panel">
          <a className="brand-lockup" href="#top" aria-label="Back to top">
            <span className="brand-mark">{profile.initials}</span>
            <span className="brand-copy">
              <strong>{site.name}</strong>
              <small>{site.label}</small>
            </span>
          </a>

          <nav className="nav-links" aria-label="Main navigation">
            <a href="#about">About</a>
            <a href="#pulse">Activity</a>
            <a href="#work">Projects</a>
            <Link href="/blog">Journal</Link>
            <a href="#timeline">Journey</a>
            <a href="#contact">Contact</a>
          </nav>

          <ThemeToggle />
        </header>

        <div className="hero-grid container hero-grid-cover" id="top">
          <ScrollReveal className="hero-copy hero-copy-cover surface-panel surface-panel-strong" offset={36} variant="expand">
            <div className="hero-brand-cloud" aria-hidden="true">
              <span className="hero-brand-serial">JARED 01 / SYSTEMS / SIGNAL</span>
            </div>
            <p className="eyebrow">{profile.role}</p>
            <ScrollReveal className="hero-cover-ribbon" delay={40} offset={18} variant="slide-left">
              <span className="hero-cover-ribbon-text">Personal Brand / Systems / Networks / Analysis</span>
              <HeroLikeButton baseCount={12} />
            </ScrollReveal>
            <p className="hero-kicker">Technical Brand / Systems / Networks / Analysis</p>
            <h1 aria-label="Engineering Systems with Clarity" className="hero-title-fixed">
              <span className="hero-title-line">Engineering Systems</span>
              <span className="hero-title-line">with Clarity</span>
            </h1>

            <div className="hero-actions">
              <a className="button primary" href="#about">
                Enter Profile
              </a>
              <a className="button secondary hero-button-ghost" href="#work">
                View Projects
              </a>
            </div>

          </ScrollReveal>
        </div>
      </section>

      <section className="section section-frame container home-panel" id="about">
        <div className="frame-grid">
          <div className="frame-heading frame-heading-sticky">
            <ScrollReveal offset={20} variant="slide-left">
              <p className="eyebrow">Profile</p>
              <h2>About the Engineer</h2>
              <p className="section-intro">{profile.about}</p>
              <div className="identity-strip surface-panel">
                <span className="identity-strip-label">Current handle</span>
                <strong>{profile.name}</strong>
                <span>{profile.location}</span>
              </div>
            </ScrollReveal>
          </div>

          <div className="frame-content stack-grid">
            <ScrollReveal className="snapshot-card surface-panel surface-panel-strong" delay={40} variant="expand">
              <p className="snapshot-label">Current Focus</p>
              <h3>{profile.location}</h3>
              <p>{profile.summary}</p>
            </ScrollReveal>

            <ScrollReveal className="snapshot-card surface-panel" delay={120} variant="slide-right">
              <p className="snapshot-label">Quick Facts</p>
              <ul className="fact-list">
                {profile.quickFacts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
            </ScrollReveal>

            <ScrollReveal className="snapshot-card surface-panel hero-profile-card" delay={180} variant="slide-left">
              <p className="snapshot-label">{site.name}</p>
              <h3 className="identity-name">{profile.englishName}</h3>
              <p className="snapshot-label">Build, Measure, Iterate</p>
              <p>{profile.summary}</p>
              <p className="panel-note">{site.description}</p>
            </ScrollReveal>

            <ScrollReveal className="snapshot-card surface-panel hero-orbit-card" delay={240} variant="expand">
              <div className="hero-orbit-wrap">
                <HeroOrbit />
              </div>

              <div className="hero-metrics" aria-label="Profile metrics">
                <div className="metric-card">
                  <span className="metric-value">4</span>
                  <span className="metric-label">technical tracks</span>
                </div>
                <div className="metric-card">
                  <span className="metric-value">2025</span>
                  <span className="metric-label">research publication</span>
                </div>
                <div className="metric-card">
                  <span className="metric-value">J01</span>
                  <span className="metric-label">personal tech journal</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="section section-frame container home-panel" id="about-strengths">
        <div className="frame-grid frame-grid-wide">
          <div className="frame-heading">
            <ScrollReveal offset={20} variant="slide-left">
              <p className="eyebrow">Capabilities</p>
              <h2>Core Technical Tracks</h2>
              <p className="section-intro">
                分别展示系统、网络与分析相关能力，避免单个页面信息堆叠过多。
              </p>
            </ScrollReveal>
          </div>

          <div className="frame-content strength-grid">
            {strengths.map((item, index) => (
              <ScrollReveal
                key={item.title}
                className="strength-card surface-panel"
                delay={60 + index * 80}
                offset={24}
                variant={index % 2 === 0 ? "slide-right" : "expand"}
              >
                <p className="card-label">{item.title}</p>
                <p>{item.description}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-frame container home-panel" id="pulse">
        <div className="frame-grid frame-grid-wide">
          <div className="frame-heading frame-heading-sticky">
            <ScrollReveal offset={20} variant="slide-left">
              <p className="eyebrow">{codingPulse.eyebrow}</p>
              <h2>{codingPulse.title}</h2>
              <p className="section-intro">{codingPulse.intro}</p>
            </ScrollReveal>
          </div>

          <div className="frame-content">
            <ScrollReveal offset={30} variant="expand">
              <CodingPulse
                data={codingPulseData}
                shareUrl={codingPulse.shareUrl ?? process.env.NEXT_PUBLIC_WAKATIME_SHARE_URL ?? null}
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="section section-frame container home-panel" id="work">
        <div className="frame-grid frame-grid-wide">
          <div className="frame-heading frame-heading-sticky">
            <ScrollReveal offset={20} variant="slide-left">
              <p className="eyebrow">Projects</p>
              <h2>Selected Projects</h2>
              <p className="section-intro">
                按问题定义、实现路径、验证方式与结果表现展示代表性项目。
              </p>
            </ScrollReveal>
          </div>

          <div className="frame-content">
            <ScrollReveal className="project-hero-card surface-panel surface-panel-strong" delay={40} variant="expand">
              <p className="project-kicker">{featuredProject.category}</p>
              <h3>{featuredProject.title}</h3>
              <p>{featuredProject.description}</p>
              <div className="project-feature-band">
                <div className="project-feature-stat">
                  <span className="feature-stat-label">Impact</span>
                  <strong>{featuredProject.impact}</strong>
                </div>
                <div className="project-feature-stat">
                  <span className="feature-stat-label">Stack</span>
                  <strong>{featuredProject.stack}</strong>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="section section-frame container home-panel" id="work-notes">
        <div className="frame-grid frame-grid-wide">
          <div className="frame-heading">
            <ScrollReveal offset={20} variant="slide-left">
              <p className="eyebrow">More Work</p>
              <h2>Supporting Projects</h2>
              <p className="section-intro">
                其余项目单独展示，用于补充研究、竞赛与建模相关经历。
              </p>
            </ScrollReveal>
          </div>

          <div className="frame-content project-side-grid">
            {secondaryProjects.map((project, index) => (
              <ScrollReveal
                key={project.title}
                className="project-note-card surface-panel"
                delay={80 + index * 90}
                offset={28}
                variant={index % 2 === 0 ? "slide-right" : "slide-left"}
              >
                <p className="project-kicker">{project.category}</p>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-meta">
                  <span>{project.impact}</span>
                  <span>{project.stack}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-frame container home-panel" id="writing">
        <div className="frame-grid frame-grid-wide">
          <div className="frame-heading">
            <ScrollReveal offset={20} variant="slide-left">
              <p className="eyebrow">{writing.eyebrow}</p>
              <h2>{writing.title}</h2>
              <p className="section-subtitle">{writing.subtitle}</p>
              <p className="section-intro">{writing.intro}</p>
              <div className="section-cta">
                <Link className="button secondary" href="/blog">
                  Open {writing.title}
                </Link>
              </div>
            </ScrollReveal>
          </div>

          <div className="frame-content article-preview-grid">
            {featuredPosts.map((post, index) => (
              <ScrollReveal
                key={post.slug}
                className="article-preview-card surface-panel"
                delay={index * 90}
                offset={30}
                variant={index === 1 ? "expand" : index === 0 ? "slide-left" : "slide-right"}
              >
                <div className="article-preview-head">
                  <p className="article-preview-index">0{index + 1}</p>
                  <p className="article-preview-meta">
                    {post.category} / {post.date}
                  </p>
                </div>
                <h3>{post.title}</h3>
                <p>{post.summary}</p>
                <Link href={`/blog/${post.slug}`}>Read Note</Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-frame container home-panel" id="timeline">
        <div className="frame-grid">
          <div className="frame-heading frame-heading-sticky">
            <ScrollReveal offset={20} variant="slide-left">
              <p className="eyebrow">Journey</p>
              <h2>Education & Journey</h2>
              <p className="section-intro">
                以时间线方式概述学习经历、研究参与与工程实践过程。
              </p>
            </ScrollReveal>
          </div>

          <div className="frame-content timeline-stack">
            {timeline.map((item, index) => (
              <ScrollReveal
                key={`${item.period}-${item.title}`}
                className="timeline-item surface-panel"
                delay={index * 90}
                offset={32}
                variant="slide-right"
              >
                <div>
                  <p className="timeline-period">{item.period}</p>
                  <h3>{item.title}</h3>
                  <p className="timeline-place">{item.place}</p>
                </div>
                <p>{item.description}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section container home-panel home-panel-contact" id="contact">
        <ScrollReveal className="contact-band surface-panel" offset={28} variant="expand">
          <div>
            <p className="eyebrow">Contact</p>
            <h2>Connect for Technical Work</h2>
            <p className="section-intro">
              联系方式集中列于此处，用于技术交流、项目沟通与合作联络。
            </p>
          </div>
          <div className="contact-grid">
            <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
            <a href={`tel:${contacts.phone.replace(/[^+\d]/g, "")}`}>{contacts.phone}</a>
            <a href={contacts.github}>GitHub</a>
          </div>
        </ScrollReveal>

        <footer className="site-footer container">
          <p>{site.name}</p>
          <p>Built around systems thinking, engineering clarity, and continuous iteration.</p>
        </footer>
      </section>
    </HomeSnapShell>
  );
}
