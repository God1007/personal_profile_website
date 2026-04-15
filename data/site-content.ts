export const siteContent = {
  site: {
    name: "Jared 01 Home",
    label: "Personal Site / Technical Journal",
    description: "A personal technical brand space focused on systems, networks, and practical engineering."
  },
  profile: {
    name: "小陈",
    englishName: "Jared Chan",
    initials: "CJL",
    role: "City University of Hong Kong · Electronic Information Engineering",
    location: "Nanjing / Hong Kong",
    heroTitle: "Engineering Systems with Clarity",
    intro:
      "C++行者、Linux 系统编程、网络协议与智能分析，努力有一天也能成为大佬orz",
    summary:
      "本科毕业于南京信息工程大学计算机科学与技术专业，现于香港城市大学攻读电子信息工程硕士，关注系统、网络与工程落地交叉方向。",
    about:
      "我更在意技术如何真正作用于问题本身，而不是只停留在工具堆叠。相比“学过很多”，我更希望把系统拆清楚、把路径跑通、把结果验证出来。这也是我写项目、写博客、做实验时一直坚持的表达方式。",
    quickFacts: [
      "EAAI 联合作者论文经历",
      "独立完成 AI 智能网络诊断项目",
      "持续记录技术复盘与工程实践",
      "关注系统、网络、AI 与工程交叉能力"
    ]
  },
  codingPulse: {
    eyebrow: "Activity",
    title: "Coding Pulse",
    intro:
      "这块区域用于展示持续编码节奏、主要语言、编辑器和项目分布。当前默认使用 mock 数据渲染，接入 WakaTime share JSON 后会自动切换为真实统计。",
    shareUrl:
      "https://wakatime.com/share/@88aebc6e-75b1-4103-8ebb-63c5ad981afe/98b99ee4-1138-466e-bc13-66a3da8206ca.json"
  },
  strengths: [
    {
      title: "C++ / Systems",
      description: "扎实的 C++11 与 Linux 系统开发基础，关注模块边界、性能开销、可维护性与调试体验。"
    },
    {
      title: "Networks / Protocols",
      description: "熟悉 TCP/IP、DNS、ICMP、ARP 与常见网络诊断思路，能把协议理解转成实际排障能力。"
    },
    {
      title: "AI / Analysis",
      description: "结合 Python、数据分析与 AI 模型辅助实验设计、数据处理与系统分析，重视结果可解释性。"
    }
  ],
  projects: [
    {
      title: "AI Intelligent Network Diagnostics",
      category: "Featured System Case",
      description:
        "基于 dbus、netlink、iptables 与 eBPF 构建智能网络诊断服务，对多维网络指标进行实时监控、状态判断与问题分析。",
      impact: "覆盖网卡状态、RTT、TCP 丢包率、流量统计与 AI 辅助分析",
      stack: "C++ · netlink · eBPF · Agent",
      featured: true
    },
    {
      title: "Multi-Agent Traffic Control Research",
      category: "Research",
      description:
        "参与 EAAI 论文相关实验与分析，围绕多智能体强化学习开展 SUMO 仿真、交通信号协同控制与车流预测建模。",
      impact: "完成参数实验、仿真对比与历史数据建模分析",
      stack: "Python · SUMO · pandas · scikit-learn"
    },
    {
      title: "Modeling & Competition Practice",
      category: "Awards",
      description:
        "通过数学建模与创新创业竞赛积累问题抽象、方案表达、模型分析与结果呈现的完整实践经验。",
      impact: "获得省级一等奖、三等奖与校级项目成果",
      stack: "Modeling · Analysis · Presentation"
    }
  ],
  writing: {
    eyebrow: "Journal",
    title: "Jared 01 Home",
    subtitle: "Technical Notes & Build Logs",
    intro:
      "这里记录项目复盘、技术学习、系统调试经验，以及一些关于工程实现、研究方法与个人技术成长的阶段性思考。"
  },
  timeline: [
    {
      period: "2025 - 2026",
      title: "MSc in Electronic Information Engineering",
      place: "City University of Hong Kong",
      description: "继续深入系统、网络与工程实现方向，强化研究与实际工程之间的连接能力。"
    },
    {
      period: "2021 - 2025",
      title: "BSc in Computer Science and Technology",
      place: "Nanjing University of Information Science and Technology",
      description: "系统完成计算机基础、网络、编程与工程方法训练，形成较完整的技术学习路径。"
    },
    {
      period: "2025",
      title: "EAAI Co-author Publication",
      place: "Research Contribution",
      description: "参与多智能体交通信号协同控制研究与实验分析，积累科研协作与实验设计经验。"
    }
  ],
  contacts: {
    email: "jaredchan1007@gmail.com",
    phone: "+86 13327829740 / +852 84961406",
    github: "https://github.com/God1007"
  }
} as const;
