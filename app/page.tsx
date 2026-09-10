import Link from "next/link";
import { HeroLikeButton } from "@/components/home/hero-like-button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { getAllPosts } from "@/lib/blog";
import styles from "./profile.module.css";

export default function HomePage() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <div className={styles.profilePage}>
      <a className={styles.skipLink} href="#main">跳转到正文</a>
      <header className={styles.header}>
        <div className={styles.navInner}>
          <a className={styles.wordmark} href="#main" aria-label="陈嘉乐，回到首页">Chen Jiale</a>
          <nav aria-label="主导航">
            <a href="#projects">项目</a>
            <a href="#about">关于</a>
            <Link href="/blog">笔记</Link>
            <a className={styles.navContact} href="#contact">联系</a>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className={`${styles.hero} ${styles.wrap}`} aria-labelledby="intro-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>AI AGENT / SYSTEMS ENGINEERING</p>
            <h1 id="intro-title">陈嘉乐<span lang="en">Chen Jiale</span></h1>
          </div>
          <div className={styles.heroIntro}>
            <p className={styles.heroLead}>AI Agent · 网络与系统</p>
            <p className={styles.heroDescription}>多智能体代码审查、Linux 网络诊断，以及工程实践中的技术记录。</p>
            <div className={styles.heroActions}>
              <a className={styles.button} href="#projects">浏览项目</a>
              <Link className={styles.textLink} href="/blog">技术笔记 <span aria-hidden="true">›</span></Link>
            </div>
          </div>
        </section>

        <section className={`${styles.projects} ${styles.section}`} id="projects" aria-labelledby="projects-title">
          <div className={styles.wrap}>
            <div className={styles.sectionHeading}>
              <h2 id="projects-title">项目</h2>
              <span lang="en">Selected work</span>
            </div>
            <div className={styles.projectGrid}>
              <article className={`${styles.project} ${styles.agentProject}`}>
                <div className={styles.projectCopy}>
                  <p className={styles.projectCategory}>AI AGENT</p>
                  <h3>EvoAgent</h3>
                  <p className={styles.projectLead}>从代码审查，到验证修复。</p>
                  <p className={styles.projectDescription}>让不同的 Agent 分工审阅、质疑和验证，为每条审查结论保留依据。</p>
                </div>
                <figure className={styles.agentDiagram}>
                  <ol aria-label="EvoAgent 协作流程">
                    <li><span lang="en">Review</span><strong>审阅</strong><small>代码与上下文</small></li>
                    <li><span lang="en">Critique</span><strong>质疑</strong><small>核对问题与证据</small></li>
                    <li><span lang="en">Verify</span><strong>验证</strong><small>复现与测试</small></li>
                  </ol>
                  <figcaption>多智能体协作流程</figcaption>
                </figure>
                <details className={styles.projectDetails}>
                  <summary>项目介绍 <span aria-hidden="true">+</span></summary>
                  <div className={styles.detailBody}>
                    <p>EvoAgent 将代码审查拆成相互校验的步骤：定位改动中的问题，在隔离环境里复现，再检查修复结果。记录与任务状态一起保存，便于追溯和继续处理。</p>
                    <p>基于 Python、LangGraph、PostgreSQL 和 Docker 构建。</p>
                  </div>
                </details>
              </article>

              <article className={`${styles.project} ${styles.networkProject}`}>
                <div className={styles.projectCopy}>
                  <p className={styles.projectCategory}>NETWORK SYSTEMS</p>
                  <h3>智能网络诊断</h3>
                  <p className={styles.projectLead}>把异常，放回完整链路。</p>
                  <p className={styles.projectDescription}>从 Linux 底层收集网络信号，关联连接与进程，为排查提供清楚的上下文。</p>
                </div>
                <figure className={styles.networkDiagram}>
                  <div className={styles.signalSources}><span>网卡</span><span>连接</span><span>进程</span></div>
                  <div className={styles.signalLines} aria-hidden="true"><i /><i /><i /></div>
                  <div className={styles.signalCore}><span lang="en">Linux</span><strong>采集 · 关联 · 诊断</strong></div>
                  <figcaption>从系统信号到诊断信息</figcaption>
                </figure>
                <details className={styles.projectDetails}>
                  <summary>项目介绍 <span aria-hidden="true">+</span></summary>
                  <div className={styles.detailBody}>
                    <p>通过 Netlink、eBPF 与 ICMP 获取接口状态、流量和链路信息。采集服务向看板与 AI 提供统一接口，让零散的观测结果成为可理解的诊断线索。</p>
                    <p>基于 C++、gRPC 和 D-Bus 构建。</p>
                  </div>
                </details>
              </article>
            </div>
          </div>
        </section>

        <section className={`${styles.about} ${styles.wrap} ${styles.section}`} id="about" aria-labelledby="about-title">
          <div className={styles.aboutTitle}><p className={styles.eyebrow}>ABOUT</p><h2 id="about-title">关于</h2></div>
          <div className={styles.aboutCopy}>
            <p className={styles.aboutLead}>在香港城市大学读研，<br />在字节跳动参与 TikTok 的研发。</p>
            <p>本科就读于南京信息工程大学计算机专业。参与过多智能体交通信号控制研究，目前关注 Agent 在代码审查、系统诊断与工程自动化中的应用。</p>
            <a className={styles.textLink} href="https://github.com/God1007" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
          </div>
        </section>

        <section className={`${styles.journal} ${styles.section}`} id="writing" aria-labelledby="journal-title">
          <div className={styles.wrap}>
            <div className={styles.sectionHeading}><h2 id="journal-title">技术笔记</h2><Link className={styles.textLink} href="/blog">全部文章 <span aria-hidden="true">›</span></Link></div>
            <div className={styles.journalList}>
              {posts.map((post) => (
                <article key={post.slug}>
                  <div className={styles.postMeta}><span>{post.category}</span><time dateTime={post.date}>{post.date}</time></div>
                  <div><h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3><p>{post.summary}</p></div>
                  <span className={styles.postArrow} aria-hidden="true">↗</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={`${styles.contact} ${styles.wrap} ${styles.section}`} id="contact" aria-labelledby="contact-title">
          <div><p className={styles.eyebrow}>CONTACT</p><h2 id="contact-title">保持联系</h2></div>
          <div className={styles.contactLinks}>
            <a className={styles.email} href="mailto:jaredchan1007@gmail.com">jaredchan1007@gmail.com <span aria-hidden="true">↗</span></a>
            <a className={styles.textLink} href="https://github.com/God1007" target="_blank" rel="noopener noreferrer">GitHub / God1007 <span aria-hidden="true">↗</span></a>
          </div>
        </section>
      </main>

      <footer className={`${styles.footer} ${styles.wrap}`}>
        <span>© 2026 陈嘉乐</span>
        <div className={styles.footerTools}><HeroLikeButton /><ThemeToggle /><a href="#main">回到顶部 ↑</a></div>
      </footer>
    </div>
  );
}
