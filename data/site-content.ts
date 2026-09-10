export const siteContent = {
  site: {
    name: "Jared 01 Home",
    label: "Personal Site / Technical Journal",
    description: "聚焦系统、网络与工程实践的技术作品集与记录站点。"
  },
  profile: {
    name: "小陈",
    englishName: "Jared",
    initials: "CJL",
    role: "City University of Hong Kong / Electronic Information Engineering",
    location: "Nanjing / Hong Kong",
    heroTitle: "Engineering Systems with Clarity",
    intro: "",
    summary:
      "我喜欢把模糊的问题拆成可观察的信号，再用工程方法把判断变成稳定、可解释的实现。",
    about:
      "从底层网络诊断到前端交互，我关注的不只是功能是否完成，也关注系统如何被看见、理解和验证。",
    quickFacts: [
      "EAAI 联合作者论文经历",
      "独立完成 AI 网络诊断项目",
      "持续整理技术笔记与项目复盘",
      "关注系统、网络、AI 与工程实现"
    ]
  },
  codingPulse: {
    eyebrow: "Activity",
    title: "Coding Pulse",
    intro: "展示最近一个记录周期内的 WakaTime 活动数据。",
    shareUrl:
      "https://wakatime.com/share/@88aebc6e-75b1-4103-8ebb-63c5ad981afe/1968bd2b-f25f-4ce0-b6eb-394ed6c9f939.json"
  },
  strengths: [
    {
      title: "C++ / Systems",
      description:
        "用 C++ 与 Linux 处理真实系统边界，关注性能、可观测性与长期维护成本。"
    },
    {
      title: "Networks / Protocols",
      description:
        "从 TCP/IP、DNS、ICMP 与 ARP 的信号中定位问题，建立可复用的诊断路径。"
    },
    {
      title: "AI / Analysis",
      description:
        "用 Python、数据与模型辅助方法验证假设，让分析结果回到可以执行的工程决策。"
    }
  ],
  projects: [
    {
      title: "AI Intelligent Network Diagnostics",
      category: "Featured System Case",
      description:
        "基于 dbus、netlink、iptables 与 eBPF 构建网络诊断服务，用于实时监控、状态判断与问题分析。",
      impact: "覆盖网卡状态、RTT、TCP 丢包、流量统计与 AI 辅助分析",
      stack: "C++ / netlink / eBPF / Agent",
      featured: true
    },
    {
      title: "Multi-Agent Traffic Control Research",
      category: "Research",
      description:
        "围绕多智能体强化学习、SUMO 仿真、交通信号协同控制与车流预测开展实验与分析。",
      impact: "包含实验搭建、仿真对比与历史数据建模",
      stack: "Python / SUMO / pandas / scikit-learn"
    },
    {
      title: "Modeling & Competition Practice",
      category: "Awards",
      description:
        "通过建模与竞赛项目积累问题抽象、方案表达、分析建模与结果呈现经验。",
      impact: "包含省级与校级奖项成果",
      stack: "Modeling / Analysis / Presentation"
    }
  ],
  writing: {
    eyebrow: "Journal",
    title: "Jared 01 Home",
    subtitle: "Technical Notes & Build Logs",
    intro: "收录项目复盘、调试记录与实现决策等技术笔记。"
  },
  timeline: [
    {
      period: "2025 - 2026",
      title: "MSc in Electronic Information Engineering",
      place: "City University of Hong Kong",
      description:
        "围绕系统、网络与工程实现相关主题继续开展研究与课程学习。"
    },
    {
      period: "2021 - 2025",
      title: "BSc in Computer Science and Technology",
      place: "Nanjing University of Information Science and Technology",
      description:
        "完成计算机基础、网络、编程与工程方法等方向的系统训练。"
    },
    {
      period: "2025",
      title: "EAAI Co-author Publication",
      place: "Research Contribution",
      description:
        "参与多智能体交通信号控制相关实验与分析工作。"
    }
  ],
  contacts: {
    email: "jaredchan1007@gmail.com",
    phone: "+86 13327829740 / +852 84961406",
    github: "https://github.com/God1007"
  }
} as const;
