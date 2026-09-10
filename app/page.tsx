import Image from "next/image";
import Link from "next/link";
import { CodingPulse } from "@/components/home/coding-pulse";
import { HeroLikeButton } from "@/components/home/hero-like-button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { siteContent } from "@/data/site-content";
import { getFeaturedPosts } from "@/lib/blog";
import styles from "./profile.module.css";

export default function HomePage() {
  const featuredPosts = getFeaturedPosts().slice(0, 3);
  const shareUrl = siteContent.codingPulse.shareUrl ?? process.env.NEXT_PUBLIC_WAKATIME_SHARE_URL ?? null;

  return <div className={styles.profilePage}>
  <a className={styles["skip-link"]} href="#main">跳转到正文</a>
  <header className={styles["site-header"]}>
    <a className={styles["wordmark"]} href="#main" aria-label="陈嘉乐，回到首页">JIALE<span aria-hidden="true">.</span></a>
    <nav aria-label="主导航">
      <a href="#projects">项目</a>
      <a href="#experience">经历</a>
      <a href="#about">关于我</a><Link href="/blog">博客</Link>
    </nav>
    <a className={styles["nav-contact"]} href="#contact">联系我 <span aria-hidden="true">↗</span></a>
  </header>

  <main id="main">
    <section className={[styles["hero"], styles["section-wrap"]].join(" ")} aria-labelledby="intro-title">
      <div className={styles["hero-copy"]}>
        <div className={styles["identity"]}><Image src="/assets/portrait.png" alt="陈嘉乐" width="80" height="96" fetchPriority="high" /><div><h1 id="intro-title">陈嘉乐 <span lang="en">Chen Jiale</span></h1><p className={styles["identity-role"]}>AI Agent 开发 / 系统与网络工程</p></div></div>
        <p className={styles["hero-description"]}>香港城市大学电子信息工程硕士在读，目前在字节跳动 TikTok 团队实习。独立开发多智能体代码审查平台与 Linux 网络诊断平台，关注可靠性、可观测性和 AI 工程落地。</p>
        <div className={styles["hero-actions"]}>
          <a className={[styles["button"], styles["primary"]].join(" ")} href="https://github.com/God1007" target="_blank" rel="noopener noreferrer">GitHub / God1007 <span aria-hidden="true">↗</span></a>
          <a className={styles["text-link"]} href="/assets/chen-jiale-resume.pdf" download="陈嘉乐-简历.pdf">下载简历 <span aria-hidden="true">↓</span></a>
        </div>
      </div>
      <aside className={styles["profile-summary"]} aria-label="个人概况"><dl><div><dt>目前</dt><dd><strong>字节跳动 · TikTok</strong><span>AI Agent 开发工程师（实习） / 2026.04 起</span></dd></div><div><dt>教育</dt><dd><strong>香港城市大学</strong><span>电子信息工程硕士 / GPA 3.58 / 4.0</span></dd></div><div><dt>方向</dt><dd>多智能体协作、Linux 网络诊断、性能优化</dd></div><div><dt>联系</dt><dd><a href="mailto:jaredchan1007@gmail.com">jaredchan1007@gmail.com</a></dd></div></dl></aside>
    </section>

    <section className={[styles["impact"], styles["section-wrap"]].join(" ")} aria-label="工程成果概览">
      <div className={styles["impact-intro"]}><span className={styles["small-label"]}>工程实践</span><p>关键成果</p></div>
      <div className={styles["impact-item"]}><strong>+2.3<span>%</span></strong><p>TikTok 天窗接口成功率</p><span className={styles["metric-note"]}>请求发送时机优化后，约提升</span></div>
      <div className={styles["impact-item"]}><strong>−400<span>ms</span></strong><p>端到端 P90 耗时</p><span className={styles["metric-note"]}>Inbox 天窗链路，约降低 8%</span></div>
      <div className={styles["impact-item"]}><strong>500<span>+</span></strong><p>EvoAgent 自动化测试</p><span className={styles["metric-note"]}>整体行覆盖率约 85%</span></div>
    </section>

    <section className={[styles["projects"], styles["section-wrap"], styles["section-space"]].join(" ")} id="projects" aria-labelledby="projects-title">
      <div className={styles["section-heading"]}><h2 id="projects-title">项目经历</h2><p>独立设计与开发，覆盖 AI 应用、基础设施和系统可观测性。</p></div>
      <div className={styles["project-grid"]}>
        <article className={[styles["project"], styles["project-agent"]].join(" ")}>
          <div className={styles["project-meta"]}><span>AI ENGINEERING</span><time dateTime="2026-06">2026.06 - 至今</time></div>
          <h3>EvoAgent</h3>
          <p className={styles["project-subtitle"]}>多智能体 PR 代码审查与安全修复平台</p>
          <p>独立构建从代码分析、证据过滤到风险复现与安全修复的闭环，让审查结论经得起验证。</p>
          <ul className={styles["project-highlights"]}><li><strong>多 Agent 协作：</strong>Planner、Reviewer、Critic 与 Verifier 形成证据审查链。</li><li><strong>可靠异步：</strong>Outbox + Redis Streams，支持崩溃接管与死信重放。</li><li><strong>保守修复：</strong>28/28 个可修复风险通过门禁，覆盖受控风险样本的 70%。</li></ul>
          <div className={styles["project-stat"]}><strong>82.5<span>%</span></strong><div>多智能体审查 F1<small>受控合成 PR 评测，由 75.0% 提升</small></div></div>
          <div className={styles["tech-list"]} aria-label="EvoAgent 技术栈"><span>Python</span><span>LangGraph</span><span>PostgreSQL</span><span>Redis</span><span>Docker</span></div>
          <details>
            <summary>查看工程细节 <span className={styles["detail-plus"]} aria-hidden="true">+</span></summary>
            <div className={styles["detail-body"]}>
              <h4>让发现有证据</h4><p>Planner、Reviewer、Critic、Test 与 Verifier 协作，约束 Finding 命中 Diff 新增行。L1-L4 Proof Runner 验证补丁前失败、补丁后通过及回归测试通过。</p>
              <h4>让异步任务可恢复</h4><p>PostgreSQL Transactional Outbox 与 Redis Streams/Cluster 提供持久任务管线，覆盖幂等、租约心跳、崩溃接管、退避重试与死信重放。</p>
              <h4>可复现的评测</h4><p>100 条受控合成 PR Diff 按仓库划分 Validation/Holdout。高风险召回由 89.5% 提升至 94.7%；28/28 个可修复风险通过全部门禁，覆盖风险样本的 70%（28/40）。</p>
              <p className={styles["detail-note"]}>性能基线：本地单进程读请求在 4,000 RPS 下，p99 为 6.7 ms，0 错误。</p>
            </div>
          </details>
        </article>
        <article className={[styles["project"], styles["project-network"]].join(" ")}>
          <div className={styles["project-meta"]}><span>SYSTEMS ENGINEERING</span><time dateTime="2025-06">2025.06 - 2025.10</time></div>
          <h3>智能网络诊断</h3>
          <p className={styles["project-subtitle"]}>基于 gRPC 的诊断、监控与 AI 分析</p>
          <p>独立打通内核指标采集、服务化接口与 Web 数据看板，把网络异常转化为可读的诊断结论。</p>
          <ul className={styles["project-highlights"]}><li><strong>指标采集：</strong>Netlink 感知网卡变化，ICMP 探测 RTT，eBPF 统计连接流量。</li><li><strong>服务接口：</strong>D-Bus 本机通信与 gRPC + Protobuf 标准化调用。</li><li><strong>异常验证：</strong>tc/iptables 模拟网络场景，结构化指标接入 AI 分析。</li></ul>
          <div className={styles["signal-list"]} aria-label="网络观测指标"><div><span>RTT</span><p>主动连通性探测</p></div><div><span>eBPF</span><p>连接与进程级流量</p></div><div><span>RSSI</span><p>无线链路质量</p></div></div>
          <div className={styles["tech-list"]} aria-label="网络诊断技术栈"><span>C++17</span><span>Linux</span><span>gRPC</span><span>Netlink</span><span>eBPF</span></div>
          <details>
            <summary>查看工程细节 <span className={styles["detail-plus"]} aria-hidden="true">+</span></summary>
            <div className={styles["detail-body"]}>
              <h4>从内核获取真实信号</h4><p>使用 Netlink 监听网卡、地址与路由变化，读取 TCP 丢包及重传统计；通过 wpa_supplicant 获取 WiFi RSSI，结合 ICMP 周期探测计算 RTT。</p>
              <h4>从本机通信到标准接口</h4><p>先后实现 D-Bus 与 gRPC + Protobuf 两套架构，封装网卡查询、健康检测、Ping 与事件订阅，支持跨语言调用与平台扩展。</p>
              <h4>验证异常判断</h4><p>通过 tc/iptables 模拟网络质量场景；周期读取 eBPF Map，计算连接级 Bps/PPS，并将指标与事件结构化输出至看板和 AI 分析链路。</p>
            </div>
          </details>
        </article>
      </div>
    </section>

    <section className={[styles["experience"], styles["section-wrap"], styles["section-space"]].join(" ")} id="experience" aria-labelledby="experience-title">
      <div className={styles["experience-heading"]}><h2 id="experience-title">实习经历</h2><p>字节跳动 · TikTok</p><p className={styles["role"]}>AI Agent 开发工程师（实习）<br /><time dateTime="2026-04">2026.04 - 至今</time></p></div>
      <div className={styles["experience-list"]}>
        <article><div className={styles["experience-title"]}><h3>让请求更有效</h3><span>可靠性</span></div><p>优化 Friends、Follow、FYP 的 Polling 与 Inbox 的 Preload 时机，减少后台态及非必要场景的无效失败请求，接口成功率提升约 2.3%。</p></article>
        <article><div className={styles["experience-title"]}><h3>在 12 小时内定位与止损</h3><span>故障治理</span></div><p>定位 US 区 Highlight 空数据触发的客户端重复请求，完成客户端止损后，服务端 QPS 下降约 20%，回落至告警线以下。</p></article>
        <article><div className={styles["experience-title"]}><h3>让内容更早到达</h3><span>性能优化</span></div><p>优先返回轻量展示字段，优化低端机与弱网下的缓存读写，Inbox 天窗消费场景约提升 1.87%。拆解端到端链路并提出 Chunk 流式返回方案，P90 约降低 400 ms。</p></article>
        <article><div className={styles["experience-title"]}><h3>把排障与协作串起来</h3><span>工程效率</span></div><p>开发 SkylightDiagnose，以 SPI 隔离业务与调试能力，保留分场景最近 20 次请求；验证日志采集、Tmates 分析与飞书结果卡片的原型链路，并实现 Meego 需求节点自动流转与状态通知。</p></article>
      </div>
    </section>

    <section className={[styles["about"], styles["section-wrap"], styles["section-space"]].join(" ")} id="about" aria-labelledby="about-title">
      <div className={styles["about-heading"]}><div><h2 id="about-title">教育、研究与技能</h2></div></div>
      <div className={styles["about-grid"]}>
        <div className={styles["education"]}><h3>教育经历</h3><article><time dateTime="2025-09">2025.09 - 2027.02（预计）</time><h4>香港城市大学</h4><p>电子信息工程 · 理学硕士在读</p><span>GPA 3.58 / 4.0</span></article><article><time dateTime="2021-09">2021.09 - 2025.06</time><h4>南京信息工程大学</h4><p>计算机科学与技术 · 理学学士</p><span>GPA 3.516 / 5.0</span></article></div>
        <div className={styles["research"]}><h3>研究与探索</h3><p className={styles["research-meta"]}>EAAI · 联合作者 · 2025.07</p><h4>基于多智能体强化学习的部分观测车辆网络协同交通信号控制</h4><p>使用 Python 构建多层强化学习框架，对比不同渗透率、联合控制及 LSTM / Attention 机制下的交通控制效果，并通过时间序列分析与特征工程支持车流强度预测。</p><div className={styles["awards"]}><h4>数学建模竞赛</h4><p>2023 全国大学生数学建模竞赛<br /><strong>江苏赛区一等奖</strong></p><p>2024 江苏省“五一数模”竞赛<br /><strong>三等奖</strong></p></div></div>
      </div>
      <div className={styles["skills"]}><h3>技术与工具</h3><dl><div><dt>AI 工程</dt><dd>Python / LangGraph / 多 Agent 编排 / Prompt 与离线评测</dd></div><div><dt>系统与网络</dt><dd>C++ / Linux / TCP/IP / eBPF / Netlink / gRPC</dd></div><div><dt>可靠性与观测</dt><dd>PostgreSQL / Redis / Docker / OpenTelemetry / Prometheus</dd></div><div><dt>语言</dt><dd>IELTS 7.0 / CET-6 457 / CET-4 586</dd></div></dl></div>
    </section>

    <section className={[styles["journal"], styles["section-wrap"], styles["section-space"]].join(" ")} id="writing" aria-labelledby="journal-title">
      <div className={styles["section-heading"]}><h2 id="journal-title">技术笔记</h2></div>
      <div className={styles["journal-list"]}>{featuredPosts.map((post) => <article key={post.slug}><time dateTime={post.date}>{post.date}</time><h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3><p>{post.summary}</p></article>)}</div>
      <Link className={styles["text-link"]} href="/blog">查看全部文章 ↗</Link>
      <details className={styles["activity-disclosure"]}><summary>编码动态 <span className={styles["detail-plus"]} aria-hidden="true">+</span></summary><CodingPulse shareUrl={shareUrl} /></details>
    </section>
    <section className={[styles["contact"], styles["section-wrap"], styles["section-space"]].join(" ")} id="contact" aria-labelledby="contact-title">
      <h2 id="contact-title">联系方式</h2>
      <div className={styles["contact-links"]}><a className={styles["email-link"]} href="mailto:jaredchan1007@gmail.com">jaredchan1007@gmail.com <span aria-hidden="true">↗</span></a><a className={styles["text-link"]} href="https://github.com/God1007" target="_blank" rel="noopener noreferrer">GitHub / God1007 <span aria-hidden="true">↗</span></a></div>
      <div className={styles["phone-links"]}><a href="tel:+8613327829740">+86 133 2782 9740</a><a href="tel:+85284961406">+852 8496 1406</a></div>
    </section>
  </main>
  <footer className={[styles["site-footer"], styles["section-wrap"]].join(" ")}><span>© 2026 陈嘉乐</span><div className={styles["footer-tools"]}><ThemeToggle /><HeroLikeButton /></div><a href="#main">回到顶部 ↑</a></footer>

  </div>;
}
