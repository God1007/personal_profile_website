export const siteContent = {
  profile: {
    name: "陈嘉乐",
    initials: "CJL",
    role: "香港城市大学电子信息工程硕士在读 | C++ / Linux / 网络方向",
    location: "南京 / 香港",
    intro:
      "我专注于 C++、Linux 系统编程、网络编程与智能分析方向，关注把底层能力、工程实现和真实问题结合起来，做出可落地的系统与服务。",
    summary:
      "南京信息工程大学计算机科学与技术本科毕业，现于香港城市大学攻读电子信息工程硕士，持续积累网络系统与工程实现相关项目经验。",
    about:
      "我目前的重点方向是网络系统、系统编程、AI 辅助分析和工程化实现。相比只停留在概念层面，我更关注如何把协议、内核交互、数据分析与服务能力真正串起来，形成能运行、能调试、能验证的完整方案。这个网站后续会持续记录我的项目、学习过程和技术思考。"
  },
  strengths: [
    {
      title: "C++ 与系统编程",
      description:
        "具备扎实的 C++11 基础，熟悉 STL、现代 C++ 特性，以及 Linux 环境下的系统开发方式。"
    },
    {
      title: "网络协议与调试分析",
      description:
        "熟悉 TCP/IP、UDP、DNS、ICMP、ARP 等协议，能够结合常用 Linux 工具进行网络问题排查与分析。"
    },
    {
      title: "AI 与数据驱动分析",
      description:
        "能结合 Python、pandas、scikit-learn 以及 AI 模型辅助实验分析、数据处理和工程验证。"
    }
  ],
  projects: [
    {
      title: "AI 智能网络诊断监控分析",
      category: "独立开发项目",
      description:
        "基于 dbus 通信模式开发智能网络诊断服务，监控多项网络指标，并结合 AI 分析当前设备与链路的网络状态。",
      impact: "覆盖网卡状态、RTT、TCP 丢包率、流量统计与 AI 辅助分析",
      stack: "C++ / netlink / eBPF / iptables / Agent"
    },
    {
      title: "多智能体交通信号协同研究",
      category: "科研经历",
      description:
        "作为联合作者参与 EAAI 论文研究，围绕部分观测车辆网络协同交通信号控制，搭建强化学习实验与对比分析流程。",
      impact: "完成多组参数实验、SUMO 仿真与历史车流预测分析",
      stack: "Python / SUMO / pandas / scikit-learn"
    },
    {
      title: "数学建模与竞赛积累",
      category: "竞赛与实践",
      description:
        "参与创新创业和数学建模相关竞赛，积累了从问题拆解、建模到结果表达的完整实践经验。",
      impact: "获得省级一等奖、三等奖及校级创新创业成果",
      stack: "建模分析 / 论文表达 / 团队协作"
    }
  ],
  writing: {
    eyebrow: "博客",
    title: "文章与笔记",
    intro:
      "这里会逐步整理我的项目复盘、技术学习记录、网络调试经验，以及关于 C++、Linux 和工程实现的一些思考。"
  },
  timeline: [
    {
      period: "2025.09 - 2026.10",
      title: "电子信息工程理学硕士",
      place: "香港城市大学",
      description:
        "聚焦电子信息工程方向，继续深入系统、网络与工程实现相关能力建设。"
    },
    {
      period: "2021.09 - 2025.07",
      title: "计算机科学与技术理学学士",
      place: "南京信息工程大学",
      description:
        "GPA 3.516/5（85.36/100），系统学习计算机基础、编程、网络与工程方法。"
    },
    {
      period: "2025.07",
      title: "EAAI 联合作者论文发表",
      place: "研究经历",
      description:
        "参与《基于多智能体强化学习的部分观测车辆网络协同交通信号控制》相关研究与实验分析。"
    }
  ],
  contacts: {
    email: "jaredchan1007@gmail.com",
    phone: "+86 13327829740 / +852 84961406",
    github: "https://github.com/God1007"
  }
} as const;
