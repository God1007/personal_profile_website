import Link from "next/link";
import { siteContent } from "@/data/site-content";
import { getFeaturedPosts } from "@/lib/blog";

export default function HomePage() {
  const { profile, strengths, projects, timeline, contacts, writing } = siteContent;
  const featuredPosts = getFeaturedPosts().slice(0, 3);

  return (
    <main>
      <section className="hero-shell">
        <header className="site-nav container">
          <a className="brand-mark" href="#top" aria-label="Back to top">
            {profile.initials}
          </a>
          <nav className="nav-links" aria-label="Main navigation">
            <a href="#about">关于</a>
            <a href="#work">项目</a>
            <Link href="/blog">博客</Link>
            <a href="#timeline">经历</a>
            <a href="#contact">联系</a>
          </nav>
        </header>

        <div className="hero-grid container" id="top">
          <div className="hero-copy">
            <p className="eyebrow">{profile.role}</p>
            <h1>专注网络系统、工程实现与智能分析的开发者。</h1>
            <p className="hero-text">{profile.intro}</p>
            <div className="hero-actions">
              <a className="button primary" href="#work">
                查看项目经历
              </a>
              <a className="button secondary" href={`mailto:${contacts.email}`}>
                发送邮件联系
              </a>
            </div>
          </div>

          <aside className="hero-card" aria-label="Quick profile">
            <p className="card-label">当前状态</p>
            <h2>{profile.location}</h2>
            <p>{profile.summary}</p>
            <ul className="metric-list">
              <li>
                <strong>2025</strong>
                <span>南京信息工程大学本科毕业，进入港城大硕士阶段</span>
              </li>
              <li>
                <strong>1</strong>
                <span>EAAI 联合作者论文发表，参与强化学习交通控制研究</span>
              </li>
              <li>
                <strong>3</strong>
                <span>核心方向：C++、Linux 系统编程、网络分析</span>
              </li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="section container section-split" id="about">
        <div className="section-heading">
          <p className="eyebrow">Profile</p>
          <h2>关于我</h2>
        </div>
        <div className="section-body">
          <p>{profile.about}</p>
          <div className="pill-row" aria-label="Strengths">
            {strengths.map((item) => (
              <span key={item.title} className="pill">
                {item.title}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section showcase-section" id="work">
        <div className="container">
          <div className="section-heading narrow">
            <p className="eyebrow">Projects</p>
            <h2>项目经历</h2>
            <p className="section-intro">
              这里展示的是目前最能代表我方向与能力的几段经历，重点放在网络系统、工程实现、研究分析和实践成果上。
            </p>
          </div>

          <div className="project-grid">
            {projects.map((project) => (
              <article key={project.title} className="project-card">
                <div className="project-surface">
                  <p className="project-kicker">{project.category}</p>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
                <div className="project-meta">
                  <span>{project.impact}</span>
                  <span>{project.stack}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section container" id="writing">
        <div className="section-heading narrow">
          <p className="eyebrow">{writing.eyebrow}</p>
          <h2>{writing.title}</h2>
          <p className="section-intro">{writing.intro}</p>
        </div>

        <div className="article-preview-grid">
          {featuredPosts.map((post) => (
            <article key={post.slug} className="article-preview-card">
              <p className="article-preview-meta">
                {post.category} · {post.date}
              </p>
              <h3>{post.title}</h3>
              <p>{post.summary}</p>
              <Link href={`/blog/${post.slug}`}>阅读全文</Link>
            </article>
          ))}
        </div>

        <div className="section-cta">
          <Link className="button secondary" href="/blog">
            查看全部文章
          </Link>
        </div>
      </section>

      <section className="section container section-split">
        <div className="section-heading">
          <p className="eyebrow">Skills</p>
          <h2>技能与方向</h2>
        </div>
        <div className="strength-grid">
          {strengths.map((item) => (
            <article key={item.title} className="strength-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section container section-split" id="timeline">
        <div className="section-heading">
          <p className="eyebrow">Timeline</p>
          <h2>教育与经历</h2>
        </div>
        <div className="timeline-list">
          {timeline.map((item) => (
            <article key={`${item.period}-${item.title}`} className="timeline-item">
              <div>
                <p className="timeline-period">{item.period}</p>
                <h3>{item.title}</h3>
                <p className="timeline-place">{item.place}</p>
              </div>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section container contact-band" id="contact">
        <div>
          <p className="eyebrow">Contact</p>
          <h2>欢迎交流与合作</h2>
          <p className="section-intro">
            如果你对我的项目经历、研究方向或技术能力感兴趣，欢迎通过邮箱、电话或 GitHub 与我联系。
          </p>
        </div>
        <div className="contact-grid">
          <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
          <a href={`tel:${contacts.phone.replace(/[^+\d]/g, "")}`}>{contacts.phone}</a>
          <a href={contacts.github}>GitHub</a>
        </div>
      </section>

      <footer className="site-footer container">
        <p>{profile.name}</p>
        <p>以清晰表达、工程能力与持续积累为核心。</p>
      </footer>
    </main>
  );
}
