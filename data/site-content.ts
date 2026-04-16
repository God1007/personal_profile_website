export const siteContent = {
  site: {
    name: "Jared 01 Home",
    label: "Personal Site / Technical Journal",
    description: "Technical portfolio and journal focused on systems, networking, and applied engineering."
  },
  profile: {
    name: "小陈",
    englishName: "Jared Chan",
    initials: "CJL",
    role: "City University of Hong Kong / Electronic Information Engineering",
    location: "Nanjing / Hong Kong",
    heroTitle: "Engineering Systems with Clarity",
    intro: "",
    summary:
      "Graduate study in electronic information engineering with prior training in computer science. Current work centers on systems, networking, and implementation-oriented analysis.",
    about:
      "This section outlines academic background, technical focus, and current engineering direction across systems, networking, and analysis work.",
    quickFacts: [
      "EAAI co-author publication",
      "Independent AI network diagnostics project",
      "Ongoing technical notes and project retrospectives",
      "Focus on systems, networking, AI, and engineering execution"
    ]
  },
  codingPulse: {
    eyebrow: "Activity",
    title: "Coding Pulse",
    intro: "WakaTime activity summary for the latest recorded cycle.",
    shareUrl:
      "https://wakatime.com/share/@88aebc6e-75b1-4103-8ebb-63c5ad981afe/1968bd2b-f25f-4ce0-b6eb-394ed6c9f939.json"
  },
  strengths: [
    {
      title: "C++ / Systems",
      description:
        "Foundation in C++11 and Linux systems programming with attention to module boundaries, performance tradeoffs, and maintainable implementation."
    },
    {
      title: "Networks / Protocols",
      description:
        "Working knowledge of TCP/IP, DNS, ICMP, and ARP with emphasis on protocol behavior, diagnostics, and troubleshooting paths."
    },
    {
      title: "AI / Analysis",
      description:
        "Python-based analysis and model-assisted experimentation for data processing, system inspection, and interpretable evaluation."
    }
  ],
  projects: [
    {
      title: "AI Intelligent Network Diagnostics",
      category: "Featured System Case",
      description:
        "A diagnostics service built with dbus, netlink, iptables, and eBPF for real-time monitoring, status checks, and issue analysis across multiple network signals.",
      impact: "Covers NIC status, RTT, TCP loss, traffic statistics, and AI-assisted analysis",
      stack: "C++ / netlink / eBPF / Agent",
      featured: true
    },
    {
      title: "Multi-Agent Traffic Control Research",
      category: "Research",
      description:
        "Research support work around multi-agent reinforcement learning, SUMO simulation, coordinated traffic signal control, and traffic-flow prediction.",
      impact: "Includes experiment setup, simulation comparison, and historical-data modeling",
      stack: "Python / SUMO / pandas / scikit-learn"
    },
    {
      title: "Modeling & Competition Practice",
      category: "Awards",
      description:
        "Competition work covering problem abstraction, solution presentation, modeling analysis, and structured result reporting.",
      impact: "Includes provincial and university-level awards",
      stack: "Modeling / Analysis / Presentation"
    }
  ],
  writing: {
    eyebrow: "Journal",
    title: "Jared 01 Home",
    subtitle: "Technical Notes & Build Logs",
    intro: "Selected notes covering project retrospectives, debugging records, and implementation decisions."
  },
  timeline: [
    {
      period: "2025 - 2026",
      title: "MSc in Electronic Information Engineering",
      place: "City University of Hong Kong",
      description:
        "Advanced study across systems, networking, and implementation-focused engineering topics."
    },
    {
      period: "2021 - 2025",
      title: "BSc in Computer Science and Technology",
      place: "Nanjing University of Information Science and Technology",
      description:
        "Undergraduate training across core computer science, networking, programming, and engineering methods."
    },
    {
      period: "2025",
      title: "EAAI Co-author Publication",
      place: "Research Contribution",
      description:
        "Research contribution involving multi-agent traffic signal control experiments and supporting analysis."
    }
  ],
  contacts: {
    email: "jaredchan1007@gmail.com",
    phone: "+86 13327829740 / +852 84961406",
    github: "https://github.com/God1007"
  }
} as const;
