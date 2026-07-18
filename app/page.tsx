import Link from "next/link";
import { CodingPulse } from "@/components/home/coding-pulse";
import { HeroLikeButton } from "@/components/home/hero-like-button";
import { HeroSignalField } from "@/components/home/hero-signal-field";
import { ScrollReveal } from "@/components/home/scroll-reveal";
import { SiteNav } from "@/components/home/site-nav";
import { siteContent } from "@/data/site-content";
import { getFeaturedPosts } from "@/lib/blog";
import { loadCachedWakaTimeShare } from "@/lib/wakatime-cache.server";

export default async function HomePage() {
  const { site, profile, codingPulse, strengths, projects, timeline, contacts, writing } = siteContent;
  const featuredPosts = getFeaturedPosts().slice(0, 3);
  const codingPulseData = await loadCachedWakaTimeShare(
    codingPulse.shareUrl ?? process.env.NEXT_PUBLIC_WAKATIME_SHARE_URL ?? null
  );

  return (
    <main className="portfolio-home">
      <SiteNav />

      <section className="portfolio-hero container" id="top">
        <ScrollReveal className="portfolio-hero-copy" offset={34} variant="slide-left">
          <p className="portfolio-eyebrow">Systems engineer and curious builder</p>
          <h1 aria-label="Systems, made clear.">
            <span>Systems,</span>
            <span>made clear.</span>
          </h1>
          <p className="portfolio-hero-intro">
            在系统、网络与交互之间，把复杂问题做成可理解、可验证、可使用的作品。
          </p>
          <div className="portfolio-hero-actions">
            <a className="portfolio-button portfolio-button-primary" href="#work">
              View Projects
            </a>
            <Link className="portfolio-button portfolio-button-secondary" href="/blog">
              Read Journal
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal className="portfolio-hero-media" delay={90} offset={24} variant="expand">
          <div className="portfolio-hero-visual">
            <span className="portfolio-hero-image portfolio-hero-image-light" aria-hidden="true" />
            <span className="portfolio-hero-image portfolio-hero-image-dark" aria-hidden="true" />
            <span className="portfolio-hero-scrim" aria-hidden="true" />
            <HeroSignalField />
          </div>
          <div className="portfolio-hero-caption">
            <p>Move across the image to perturb a live signal field.</p>
            <HeroLikeButton />
          </div>
        </ScrollReveal>
      </section>

      <section className="portfolio-section portfolio-about container" id="about">
        <ScrollReveal className="portfolio-section-heading" offset={22} variant="slide-left">
          <h2>A systems thinker who cares about visible feedback.</h2>
          <p>{profile.about}</p>
        </ScrollReveal>

        <div className="portfolio-about-grid">
          <ScrollReveal className="portfolio-about-statement" delay={40} offset={24} variant="expand">
            <p className="portfolio-about-name">{profile.englishName}</p>
            <p className="portfolio-about-role">{profile.role}</p>
            <p className="portfolio-about-summary">{profile.summary}</p>
            <div className="portfolio-facts" aria-label="Profile highlights">
              {profile.quickFacts.map((fact) => (
                <span key={fact}>{fact}</span>
              ))}
            </div>
          </ScrollReveal>

          <div className="portfolio-capabilities" id="about-strengths">
            {strengths.map((item, index) => (
              <ScrollReveal
                key={item.title}
                className="portfolio-capability"
                delay={80 + index * 70}
                offset={18}
                variant="slide-right"
              >
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="portfolio-section portfolio-pulse" id="pulse">
        <div className="container">
          <ScrollReveal className="portfolio-section-heading portfolio-section-heading-compact" offset={20}>
            <h2>Work leaves a pulse.</h2>
            <p>{codingPulse.intro}</p>
          </ScrollReveal>
          <ScrollReveal delay={70} offset={28} variant="expand">
            <CodingPulse
              data={codingPulseData}
              shareUrl={codingPulse.shareUrl ?? process.env.NEXT_PUBLIC_WAKATIME_SHARE_URL ?? null}
            />
          </ScrollReveal>
        </div>
      </section>

      <section className="portfolio-section portfolio-work container" id="work">
        <ScrollReveal className="portfolio-section-heading" offset={20} variant="slide-left">
          <p className="portfolio-eyebrow">Selected work</p>
          <h2>Problems I chose to stay with.</h2>
          <p>从问题定义到验证结果，项目不只展示技术名词，也展示判断过程。</p>
        </ScrollReveal>

        <div className="portfolio-project-grid" id="work-notes">
          {projects.map((project, index) => (
            <ScrollReveal
              key={project.title}
              className={`portfolio-project-card portfolio-project-card-${index + 1}`}
              delay={50 + index * 80}
              offset={28}
              variant={index === 0 ? "expand" : index === 1 ? "slide-right" : "slide-left"}
            >
              {index === 0 ? <span className="portfolio-project-image" aria-hidden="true" /> : null}
              <div className="portfolio-project-content">
                <p className="portfolio-project-category">{project.category}</p>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <dl className="portfolio-project-meta">
                  <div>
                    <dt>Outcome</dt>
                    <dd>{project.impact}</dd>
                  </div>
                  <div>
                    <dt>Built with</dt>
                    <dd>{project.stack}</dd>
                  </div>
                </dl>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="portfolio-section portfolio-writing container" id="writing">
        <ScrollReveal className="portfolio-writing-heading" offset={22} variant="slide-left">
          <h2>{writing.subtitle}</h2>
          <p>{writing.intro}</p>
          <Link className="portfolio-text-link" href="/blog">
            Open journal
          </Link>
        </ScrollReveal>

        <div className="portfolio-article-stream">
          {featuredPosts.map((post, index) => (
            <ScrollReveal
              key={post.slug}
              className="portfolio-article-row"
              delay={index * 70}
              offset={22}
              variant="slide-right"
            >
              <div className="portfolio-article-meta">
                <span>{post.category}</span>
                <time dateTime={post.date}>{post.date}</time>
              </div>
              <div>
                <h3>{post.title}</h3>
                <p>{post.summary}</p>
              </div>
              <Link href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>
                Read note
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="portfolio-section portfolio-journey" id="timeline">
        <div className="container portfolio-journey-grid">
          <ScrollReveal className="portfolio-journey-heading" offset={20} variant="slide-left">
            <h2>Learning in public, building in layers.</h2>
            <p>教育、研究与工程实践共同塑造了现在的技术视角。</p>
          </ScrollReveal>

          <div className="portfolio-timeline">
            {timeline.map((item, index) => (
              <ScrollReveal
                key={`${item.period}-${item.title}`}
                className="portfolio-timeline-item"
                delay={index * 80}
                offset={24}
                variant="slide-right"
              >
                <time>{item.period}</time>
                <div>
                  <h3>{item.title}</h3>
                  <p className="portfolio-timeline-place">{item.place}</p>
                  <p>{item.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="portfolio-contact container" id="contact">
        <ScrollReveal className="portfolio-contact-inner" offset={24} variant="expand">
          <div>
            <h2>Have a hard problem?</h2>
            <p>欢迎交流系统、网络、AI 与前端体验，也欢迎认真而具体的合作想法。</p>
          </div>
          <div className="portfolio-contact-links">
            <a href={`mailto:${contacts.email}`}>Email</a>
            <a href={contacts.github}>GitHub</a>
            <a href={`tel:${contacts.phone.replace(/[^+\d]/g, "")}`}>Phone</a>
          </div>
        </ScrollReveal>

        <footer className="portfolio-footer">
          <p>{site.name}</p>
          <p>Designed and built by {profile.englishName}.</p>
        </footer>
      </section>
    </main>
  );
}
