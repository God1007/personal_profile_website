import Link from "next/link";
import { CodingPulse } from "@/components/home/coding-pulse";
import { HeroOrbit } from "@/components/home/hero-orbit";
import { HomeSnapShell } from "@/components/home/home-snap-shell";
import { ScrollReveal } from "@/components/home/scroll-reveal";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { siteContent } from "@/data/site-content";
import { getFeaturedPosts } from "@/lib/blog";

export default function HomePage() {
  const { site, profile, codingPulse, strengths, projects, timeline, contacts, writing } = siteContent;
  const featuredPosts = getFeaturedPosts().slice(0, 3);
  const [featuredProject, ...secondaryProjects] = projects;

  return (
    <HomeSnapShell>
      <section className="hero-shell home-panel home-panel-hero">
        <div className="hero-backdrop" aria-hidden="true">
          <span className="hero-glow hero-glow-a" />
          <span className="hero-glow hero-glow-b" />
          <span className="hero-gridline" />
          <span className="hero-noise" />
        </div>

        <header className="site-nav container">
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

        <div className="hero-grid container" id="top">
          <ScrollReveal className="hero-copy surface-panel surface-panel-strong" offset={36}>
            <p className="eyebrow">{profile.role}</p>
            <p className="hero-kicker">Technical Brand / Systems / Networks / Analysis</p>
            <h1>{profile.heroTitle}</h1>
            <p className="hero-text">{profile.intro}</p>

            <div className="hero-actions">
              <a className="button primary" href="#work">
                View Projects
              </a>
              <Link className="button secondary" href="/blog">
                Enter Journal
              </Link>
            </div>

            <div className="hero-signal-grid" aria-label="Core signals">
              <ScrollReveal className="signal-card" delay={80} offset={20}>
                <span className="signal-label">Identity</span>
                <strong>{profile.englishName}</strong>
                <p>用系统思维、协议理解与工程实现组织技术表达，而不是只展示工具关键词。</p>
              </ScrollReveal>

              <ScrollReveal className="signal-card" delay={150} offset={24}>
                <span className="signal-label">Approach</span>
                <strong>Build, Measure, Iterate</strong>
                <p>先把系统做出来，再用实验、日志与数据校验判断，让每一次迭代都有依据。</p>
              </ScrollReveal>
            </div>
          </ScrollReveal>

          <ScrollReveal className="hero-panel surface-panel" delay={120} offset={40}>
            <div className="hero-panel-copy">
              <p className="panel-label">{site.name}</p>
              <h2 className="identity-name">{profile.name}</h2>
              <p className="panel-text">{profile.summary}</p>
              <p className="panel-note">{site.description}</p>
            </div>

            <HeroOrbit />

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
      </section>

      <section className="section section-frame container home-panel" id="about">
        <div className="frame-grid">
          <div className="frame-heading frame-heading-sticky">
            <ScrollReveal offset={20}>
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
            <ScrollReveal className="snapshot-card surface-panel surface-panel-strong" delay={40}>
              <p className="snapshot-label">Current Focus</p>
              <h3>{profile.location}</h3>
              <p>{profile.summary}</p>
            </ScrollReveal>

            <ScrollReveal className="snapshot-card surface-panel" delay={120}>
              <p className="snapshot-label">Quick Facts</p>
              <ul className="fact-list">
                {profile.quickFacts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
            </ScrollReveal>

            <div className="strength-grid">
              {strengths.map((item, index) => (
                <ScrollReveal
                  key={item.title}
                  className="strength-card surface-panel"
                  delay={180 + index * 80}
                  offset={24}
                >
                  <p className="card-label">{item.title}</p>
                  <p>{item.description}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-frame container home-panel" id="pulse">
        <div className="frame-grid frame-grid-wide">
          <div className="frame-heading frame-heading-sticky">
            <ScrollReveal offset={20}>
              <p className="eyebrow">{codingPulse.eyebrow}</p>
              <h2>{codingPulse.title}</h2>
              <p className="section-intro">{codingPulse.intro}</p>
            </ScrollReveal>
          </div>

          <div className="frame-content">
            <ScrollReveal offset={30}>
              <CodingPulse shareUrl={codingPulse.shareUrl ?? process.env.NEXT_PUBLIC_WAKATIME_SHARE_URL ?? null} />
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="section section-frame container home-panel" id="work">
        <div className="frame-grid frame-grid-wide">
          <div className="frame-heading frame-heading-sticky">
            <ScrollReveal offset={20}>
              <p className="eyebrow">Projects</p>
              <h2>Selected Projects</h2>
              <p className="section-intro">
                用工程实现、研究分析与系统能力来定义项目表达，而不是简单堆叠经历。每个项目都尽量呈现问题、路径、验证与结果。
              </p>
            </ScrollReveal>
          </div>

          <div className="frame-content project-ledger">
            <ScrollReveal className="project-hero-card surface-panel surface-panel-strong" delay={40}>
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

            <div className="project-side-stack">
              {secondaryProjects.map((project, index) => (
                <ScrollReveal
                  key={project.title}
                  className="project-note-card surface-panel"
                  delay={120 + index * 100}
                  offset={28}
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
        </div>
      </section>

      <section className="section section-frame container home-panel" id="writing">
        <div className="frame-grid frame-grid-wide">
          <div className="frame-heading">
            <ScrollReveal offset={20}>
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
              >
                <div className="article-preview-head">
                  <p className="article-preview-index">0{index + 1}</p>
                  <p className="article-preview-meta">
                    {post.category} 路 {post.date}
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
            <ScrollReveal offset={20}>
              <p className="eyebrow">Journey</p>
              <h2>Education & Journey</h2>
              <p className="section-intro">
                这部分不是传统简历时间轴，而是把学习、研究和工程实践串成一个逐步推进的过程。
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
        <ScrollReveal className="contact-band surface-panel" offset={28}>
          <div>
            <p className="eyebrow">Contact</p>
            <h2>Connect for Technical Work</h2>
            <p className="section-intro">
              如果你对我的项目经历、研究方向、系统开发能力或技术写作感兴趣，欢迎通过邮箱、电话或 GitHub 与我联系。
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
