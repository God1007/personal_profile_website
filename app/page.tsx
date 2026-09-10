import Link from "next/link";
import { HeroLikeButton } from "@/components/home/hero-like-button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { getFeaturedPosts } from "@/lib/blog";
import styles from "./profile.module.css";

export default function HomePage() {
  const featuredPosts = getFeaturedPosts().slice(0, 3);

  return (
    <div className={styles.profilePage}>
      <div className={styles.readingProgress} aria-hidden="true" />
      <a className={styles["skip-link"]} href="#main">跳转到正文</a>
      <header className={styles["site-header"]}>
        <a className={styles.wordmark} href="#main" aria-label="陈嘉乐，回到首页">JIALE<span aria-hidden="true">.</span></a>
        <nav aria-label="主导航">
          <a href="#projects">作品</a>
          <a href="#experience">想法</a>
          <a href="#about">关于</a>
          <Link href="/blog">笔记</Link>
        </nav>
        <div className={styles.navTools}>
          <ThemeToggle />
          <a className={styles["nav-contact"]} href="#contact">打个招呼 <span aria-hidden="true">↗</span></a>
        </div>
      </header>

      <main id="main">
        <section className={`${styles.hero} ${styles["section-wrap"]}`} aria-labelledby="intro-title">
          <div className={styles["hero-copy"]}>
            <p className={styles["identity-role"]}>写代码，做工具，理解系统。</p>
            <h1 id="intro-title">你好，我是陈嘉乐。<span lang="en">Chen Jiale</span></h1>
            <p className={styles["hero-description"]}>我关注 AI Agent、网络与系统，也喜欢把一个想法慢慢做成能用的东西。这里放着我做过的项目、正在探索的问题，以及一路留下的笔记。</p>
            <div className={styles["hero-actions"]}>
              <a className={`${styles.button} ${styles.primary}`} href="#projects">看看我的作品 <span aria-hidden="true">↗</span></a>
              <Link className={styles["text-link"]} href="/blog">读几篇笔记 <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
          <aside className={styles["profile-summary"]} aria-label="探索与记录">
            <p className={styles.focusLabel}>好奇心，通常是个不错的开始。</p>
            <ol className={styles.workFlow} aria-label="从想法到记录">
              <li><span>遇到问题</span><strong>为什么会这样？</strong></li>
              <li><span>动手试试</span><strong>能做点什么？</strong></li>
              <li><span>留下记录</span><strong>学到了什么？</strong></li>
            </ol>
            <p className={styles.asideNote}>最近的探索围绕多智能体协作与系统诊断展开。写下实现的过程，也写下那些还没想清楚的问题。</p>
          </aside>
        </section>

        <section className={`${styles.projects} ${styles["section-wrap"]} ${styles["section-space"]}`} id="projects" aria-labelledby="projects-title">
          <div className={styles["section-heading"]}>
            <h2 id="projects-title">做过的一些东西</h2>
            <p>有些想法，动手做了才知道答案。</p>
          </div>
          <div className={styles["project-grid"]}>
            <article className={`${styles.project} ${styles["project-agent"]}`}>
              <div className={styles["project-meta"]}><span>AI AGENTS</span></div>
              <h3>EvoAgent</h3>
              <p className={styles["project-subtitle"]}>让代码审查多一点证据。</p>
              <p>AI 能指出代码里的风险，但它的判断可靠吗？我做了 EvoAgent，让不同的 Agent 分工阅读、质疑和验证，把一次审查变成可以追溯的过程。</p>
              <figure className={styles.agentFlow}>
                <figcaption>一条发现，怎样变得可信</figcaption>
                <ol aria-label="EvoAgent 审查流程"><li>读代码</li><li>提出疑问</li><li>复现问题</li><li>验证修改</li></ol>
              </figure>
              <p>我关心的是它能否说清楚：问题在哪里，依据是什么，以及修改是否真的有效。</p>
              <details>
                <summary>再聊一点这个项目 <span className={styles["detail-plus"]} aria-hidden="true">+</span></summary>
                <div className={styles["detail-body"]}>
                  <p>设计的重点是把判断和验证放在一起。每条发现都要对应到实际改动，修复需要经过测试，不确定时保留给人判断的空间。任务中断后怎样继续、不同 Agent 怎样协作，也都是这个项目里有意思的部分。</p>
                </div>
              </details>
            </article>

            <article className={`${styles.project} ${styles["project-network"]}`}>
              <div className={styles["project-meta"]}><span>NETWORK SYSTEMS</span></div>
              <h3>智能网络诊断</h3>
              <p className={styles["project-subtitle"]}>给“网络怎么又慢了”找个解释。</p>
              <p>一次卡顿背后，可能藏着链路、连接或进程的问题。这个项目从 Linux 系统里收集线索，再把它们组织成看得懂的诊断信息。</p>
              <div className={styles["signal-list"]} aria-label="网络诊断的思路">
                <div><span>观察</span><p>系统发生了什么</p></div>
                <div><span>关联</span><p>哪些线索有关</p></div>
                <div><span>解释</span><p>下一步查哪里</p></div>
              </div>
              <p>我想把零散的信号串起来，让一次异常有上下文，也让排查更有方向。</p>
              <details>
                <summary>再聊一点这个项目 <span className={styles["detail-plus"]} aria-hidden="true">+</span></summary>
                <div className={styles["detail-body"]}>
                  <p>从网卡状态到连接流量，先把数据采集做好，再用清楚的接口把它们交给看板和 AI。这个过程让我更深入地理解了 Linux 网络，也不断提醒我：一个有用的解释，需要可靠的原始线索。</p>
                </div>
              </details>
            </article>
          </div>
        </section>

        <section className={`${styles.experience} ${styles["section-wrap"]} ${styles["section-space"]}`} id="experience" aria-labelledby="experience-title">
          <div className={styles["experience-heading"]}>
            <h2 id="experience-title">我在意什么</h2>
            <p className={styles.approachIntro}>找原因，做工具，<br />也把过程写下来。</p>
            <Link className={styles["text-link"]} href="/blog">去笔记里看看 <span aria-hidden="true">↗</span></Link>
          </div>
          <div className={styles["experience-list"]}>
            <article><div className={styles["experience-title"]}><h3>先把问题看清楚</h3></div><p>日志、请求和看似偶然的异常，常常是理解系统的入口。找到一个问题为什么发生，再动手修改，是我在排障中一直练习的事。</p></article>
            <article><div className={styles["experience-title"]}><h3>让工具少打扰人</h3></div><p>收集信息、同步状态、跟进结果，这些重复的小事也值得被认真设计。我对 Agent 的兴趣，有一部分就来自这里：让人能把注意力留给真正需要判断的地方。</p></article>
            <article><div className={styles["experience-title"]}><h3>把过程也留下来</h3></div><p>做成一个功能之外，排除过哪些可能、为什么选了这条路，同样值得记下来。技术笔记是对这些过程的整理，也方便下一次重新出发。</p></article>
          </div>
        </section>

        <section className={`${styles.about} ${styles["section-wrap"]} ${styles["section-space"]}`} id="about" aria-labelledby="about-title">
          <div className={styles["about-heading"]}><h2 id="about-title">再认识我一点</h2></div>
          <div className={styles.aboutStory}>
            <p>我在南京信息工程大学学习计算机，后来来到香港城市大学继续读书。现在也在字节跳动参与 TikTok 的工程实践，在具体问题中理解系统如何运转。</p>
            <p>之前参与过多智能体交通信号控制的研究，现在把这份兴趣延续到 Agent 与工程工具里。这里会继续放一些尝试，也留一点空间给新的方向。</p>
          </div>
        </section>

        <section className={`${styles.journal} ${styles["section-wrap"]} ${styles["section-space"]}`} id="writing" aria-labelledby="journal-title">
          <div className={styles["section-heading"]}><h2 id="journal-title">写下来，慢慢想</h2><p>关于调试、构建，以及做选择时的思考。</p></div>
          <div className={styles["journal-list"]}>
            {featuredPosts.map((post) => (
              <article key={post.slug}>
                <time dateTime={post.date}>{post.date}</time>
                <h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
                <p>{post.summary}</p>
              </article>
            ))}
          </div>
          <Link className={styles["text-link"]} href="/blog">查看全部笔记 ↗</Link>
        </section>

        <section className={`${styles.contact} ${styles["section-wrap"]} ${styles["section-space"]}`} id="contact" aria-labelledby="contact-title">
          <h2 id="contact-title">有个想法？聊聊。</h2>
          <p className={styles.contactNote}>关于一个项目、一个问题，或者只是打个招呼。</p>
          <div className={styles["contact-links"]}>
            <a className={styles["email-link"]} href="mailto:jaredchan1007@gmail.com">jaredchan1007@gmail.com <span aria-hidden="true">↗</span></a>
            <a className={styles["text-link"]} href="https://github.com/God1007" target="_blank" rel="noopener noreferrer">GitHub / God1007 <span aria-hidden="true">↗</span></a>
          </div>
        </section>
      </main>

      <footer className={`${styles["site-footer"]} ${styles["section-wrap"]}`}>
        <span>© 2026 陈嘉乐</span>
        <div className={styles["footer-tools"]}><HeroLikeButton /></div>
        <a href="#main">回到顶部 ↑</a>
      </footer>
    </div>
  );
}
