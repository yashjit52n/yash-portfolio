/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Central configuration file for Yash Jit's 3D Portfolio.
 * Edit this file to update your personal details, ratings, projects, and roadmap milestones!
 */

import algoVisualizerImg from '../assets/images/project_algorithm_visualizer_1793291350878.jpg';
import aiWorkspaceImg from '../assets/images/project_ai_workspace_1793291351498.jpg';
import devPlatformImg from '../assets/images/project_web_platform_1793291351762.jpg';

export interface ProjectCaseStudy {
  overview: string;
  problemStatement: string;
  solution: string;
  architecture: string;
  features: string[];
  metrics?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  technologies: string[];
  image: string;
  githubUrl: string;
  liveUrl?: string;
  isPlaceholder: boolean;
  highlights: string[];
  caseStudy?: ProjectCaseStudy;
}

export interface BadgeItem {
  id: string;
  title: string;
  issuer: string;
  category: 'competitive' | 'academic' | 'technical' | 'community';
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
  iconName: string;
  description: string;
  skills: string[];
  verified: boolean;
}

export interface ResumeData {
  title: string;
  summary: string;
  education: {
    institution: string;
    degree: string;
    duration: string;
    location: string;
    highlights: string[];
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
  competitiveProgramming: {
    platform: string;
    rating: string;
    solved: string;
    profile: string;
    highlights: string[];
  };
  featuredProjects: {
    name: string;
    tech: string;
    bullets: string[];
  }[];
  certifications: string[];
}

export interface SkillItem {
  name: string;
  category: 'languages' | 'web' | 'competitive';
  status: 'Learning' | 'Practicing' | 'Working knowledge';
  description: string;
  iconName: string;
  topics?: string[];
}

export interface RoadmapItem {
  id: string;
  title: string;
  status: 'Active Focus' | 'In Progress' | 'Hands-On' | 'Upcoming';
  description: string;
  goals: string[];
}

export interface CollegeYearCheckpoint {
  year: number;
  phase: string;
  theme: string;
  status: 'Current Status' | 'Upcoming Milestone';
  duration: string;
  focus: string;
  coreSubjects: string[];
  milestonesAndProjects: string[];
  industryTakeaway: string;
}

export interface PortfolioData {
  personal: {
    name: string;
    monogram: string;
    title: string;
    headlineRoles: string[];
    education: string;
    college: string;
    collegeUrl: string;
    currentYear: string;
    careerGoal: string;
    bio: string;
    availability: string;
    email: string;
    location: string;
  };
  socials: {
    github: string;
    linkedin: string;
    instagram: string;
    codeforces: string;
    email: string;
  };
  collegeCurriculum: CollegeYearCheckpoint[];
  competitiveProgramming: {
    platform: string;
    rating: number;
    rankName: string;
    rankColor: string;
    solvedProblems: string;
    profileUrl: string;
    topicsPracticed: string[];
    focusStatement: string;
  };
  skills: SkillItem[];
  projects: ProjectItem[];
  roadmap: RoadmapItem[];
  certifications: BadgeItem[];
  resumeData: ResumeData;
}

export const initialPortfolioData: PortfolioData = {
  personal: {
    name: "Yash Jit",
    monogram: "YJ",
    title: "Aspiring Software Engineer",
    headlineRoles: [
      "Aspiring Software Engineer",
      "Competitive Programmer",
      "Web Developer",
      "Problem Solver"
    ],
    education: "1st Year B.Tech in Computer Science and Artificial Intelligence",
    college: "Newton School of Technology (Rishihood University)",
    collegeUrl: "https://www.newtonschool.co/newton-school-of-technology-nst/home",
    currentYear: "1st Year Undergrad",
    careerGoal: "Become a skilled software engineer and build impactful software products.",
    bio: "I’m a 1st Year Computer Science and AI student at Newton School of Technology (Rishihood University) passionate about programming, problem-solving, and building useful digital experiences. I enjoy turning ideas into code and continuously improving my skills.",
    availability: "Open to Learning & Opportunities",
    email: "yashjit52@gmail.com",
    location: "Delhi NCR, India"
  },
  collegeCurriculum: [
    {
      year: 1,
      phase: "BUILD",
      theme: "Foundations, Algorithmic Thinking & Full-Stack Web",
      status: "Current Status",
      duration: "Year 1 (Active Focus)",
      focus: "Setting up core programming logic from week one, mastering data structures, mathematical foundations for computing, and shipping interactive web applications.",
      coreSubjects: [
        "Data Structures & Algorithms (C++ / Python)",
        "Python Programming & Algorithmic Problem Solving",
        "Responsive Modern Web Development (HTML5, CSS3, JavaScript)",
        "Discrete Mathematics & Computation Theory",
        "Linear Algebra & Logic Foundations for AI"
      ],
      milestonesAndProjects: [
        "100+ Problems Solved on Codeforces (Active 999 Rating)",
        "Interactive Algorithmic & Sorting Visualizer Platform",
        "Participating in Algorithm vs. AI Coding Sprints",
        "Early Open-Source & Git/GitHub Team Workflows"
      ],
      industryTakeaway: "Building sharp problem-solving instincts, writing clean scalable code, and understanding algorithmic complexity."
    },
    {
      year: 2,
      phase: "ACHIEVE",
      theme: "Scalable Systems, Backend Mastery & Applied Machine Learning",
      status: "Upcoming Milestone",
      duration: "Year 2",
      focus: "Transitioning to scalable backend architectures, distributed databases, high-throughput APIs, and foundational machine learning modeling.",
      coreSubjects: [
        "Advanced Data Structures & Dynamic Programming",
        "Backend Architecture & RESTful Services (Node.js / Express)",
        "Relational & Distributed Databases (PostgreSQL, MongoDB)",
        "Foundations of Machine Learning & Exploratory Data Analysis",
        "Probability & Statistical Models for AI Systems"
      ],
      milestonesAndProjects: [
        "Designing End-to-End Scalable Microservice Architectures",
        "High-Volume Data Pipeline & Aggregation Engine",
        "Industry-Facing Paid Technical Internships",
        "Benchmarking Supervised & Unsupervised ML Classifiers"
      ],
      industryTakeaway: "Architecting reliable, distributed web services backed by robust database schemas and applied ML algorithms."
    },
    {
      year: 3,
      phase: "SCALE",
      theme: "Deep Learning, System Design & Cloud DevOps",
      status: "Upcoming Milestone",
      duration: "Year 3",
      focus: "Deepening specialization across Deep Learning, Natural Language Processing, distributed systems, cloud infrastructure, and enterprise system design.",
      coreSubjects: [
        "High-Level & Low-Level System Design (HLD / LLD)",
        "Deep Learning, Neural Architectures & NLP",
        "Cloud Computing, Docker Containers & Kubernetes",
        "DevOps Pipelines, CI/CD & Cloud Security",
        "Computer Vision & Generative AI Systems"
      ],
      milestonesAndProjects: [
        "Comprehensive Capstone Product Development",
        "Participation in International Hackathons & Competitive Sprints",
        "Global Study & Tech Hub Immersion Tours (Silicon Valley / Singapore)",
        "Deploying Resilient Multi-Region Cloud Workloads"
      ],
      industryTakeaway: "Designing fault-tolerant systems handling millions of requests with modern cloud-native architectures."
    },
    {
      year: 4,
      phase: "LAUNCH",
      theme: "Industry Immersion, Capstone Venture & Placement Launch",
      status: "Upcoming Milestone",
      duration: "Year 4",
      focus: "Complete transition into the global technology workforce through an intensive full-semester industry internship and major capstone deployment.",
      coreSubjects: [
        "Full-Semester Industry Immersion & Software Engineering Internship",
        "Major B.Tech Capstone Project & Venture Demo Day",
        "Advanced Production Code Quality & Architectural Reviews",
        "Enterprise System Optimization & Distributed Observability"
      ],
      milestonesAndProjects: [
        "6-Month Full-Time Tech Industry Co-op / Internship Execution",
        "Production-Grade Launch of Flagship Software Venture",
        "Campus Placement Launch Across Global Tier-1 Tech Companies",
        "Seamless Transition into a High-Impact Software Engineering Career"
      ],
      industryTakeaway: "Executing at professional engineering standards in production teams, delivering measurable business and user impact."
    }
  ],
    socials: {
    github: "https://github.com/yashjit52n",
    linkedin: "https://www.linkedin.com/in/yash-jit-8698a23b8/",
    instagram: "https://www.instagram.com/yashhhh.251/",
    codeforces: "https://codeforces.com/profile/Yash2207",
    email: "yashjit52@gmail.com"
  },
  competitiveProgramming: {
    platform: "Codeforces",
    rating: 999,
    rankName: "Newbie",
    rankColor: "#94a3b8", // Codeforces gray/slate for Newbie tier
    solvedProblems: "100+",
    profileUrl: "https://codeforces.com/profile/Yash2207",
    topicsPracticed: [
      "Implementation",
      "Greedy Algorithms",
      "Math & Number Theory",
      "Constructive Algorithms",
      "Sorting & Searching",
      "String Processing"
    ],
    focusStatement: "Consistently training on problem-solving speed, edge-case analysis, and algorithmic correctness."
  },
  skills: [
    // Programming Languages
    {
      name: "Python",
      category: "languages",
      status: "Practicing",
      description: "Writing clean script automation, AI/ML experimentation, and algorithmic implementations.",
      iconName: "Terminal",
      topics: ["OOP Principles", "Data Structures", "Standard Library", "Scripting"]
    },
    {
      name: "C++",
      category: "languages",
      status: "Practicing",
      description: "Core language for competitive programming, fast I/O, memory control, and STL algorithms.",
      iconName: "Code2",
      topics: ["STL Containers", "Vectors & Sets", "Time Complexity Analysis", "Fast I/O"]
    },
    {
      name: "Java",
      category: "languages",
      status: "Working knowledge",
      description: "Object-oriented program architecture, design patterns, and core algorithmic solutions.",
      iconName: "FileCode",
      topics: ["Object-Oriented Design", "Collections Framework", "Generics", "Exception Handling"]
    },
    {
      name: "JavaScript",
      category: "languages",
      status: "Working knowledge",
      description: "Developing dynamic client-side logic, event-driven programming, and web applications.",
      iconName: "FileJson",
      topics: ["ES6+ Syntax", "Async/Await", "DOM Manipulation", "Event Loop"]
    },
    // Web Development
    {
      name: "HTML5",
      category: "web",
      status: "Working knowledge",
      description: "Semantic web architecture, accessible markup hierarchies, and modern web standards.",
      iconName: "Layout",
      topics: ["Semantic Tags", "Accessibility (a11y)", "Document Structure", "Web Forms"]
    },
    {
      name: "CSS3",
      category: "web",
      status: "Working knowledge",
      description: "Modern layout engines (Flexbox & CSS Grid), fluid typography, and responsive styling.",
      iconName: "Palette",
      topics: ["Flexbox & Grid", "Transitions & Keyframes", "Media Queries", "Glassmorphic Design"]
    },
    {
      name: "Web Interactivity",
      category: "web",
      status: "Working knowledge",
      description: "Building responsive components, state-driven interfaces, and interactive user experiences.",
      iconName: "MonitorSmartphone",
      topics: ["Client-Side State", "Interactive Elements", "Event Listeners", "Responsive Breakpoints"]
    },
    // Competitive Programming & DSA
    {
      name: "Codeforces Practice",
      category: "competitive",
      status: "Practicing",
      description: "Solving timed contest challenges, edge-case verification, and rating growth.",
      iconName: "Trophy",
      topics: ["Rating 999", "100+ Solved", "Contest Simulation", "Problem Upsolving"]
    },
    {
      name: "Algorithmic Problem-Solving",
      category: "competitive",
      status: "Learning",
      description: "Analytical problem formulation, mathematical patterns, greedy choices, and brute-force optimizations.",
      iconName: "Cpu",
      topics: ["Greedy Techniques", "Two Pointers", "Binary Search", "Modulo Arithmetic"]
    },
    {
      name: "Data Structures & Algorithms",
      category: "competitive",
      status: "Learning",
      description: "Foundational computer science study area focused on theoretical and practical DS concepts.",
      iconName: "Network",
      topics: ["Arrays & Linked Lists", "Stacks & Queues", "Trees & Graphs (Basics)", "Big-O Notation"]
    }
  ],
  projects: [
    {
      id: "algo-visualizer",
      title: "Algorithmic Visualizer & Solver",
      subtitle: "Interactive Data Structures & Sorting Visualizer",
      description: "An educational web utility designed to animate step-by-step sorting, binary search, and graph traversal algorithms to build visual intuition.",
      technologies: ["C++", "JavaScript", "HTML5", "CSS3"],
      image: algoVisualizerImg,
      githubUrl: "https://github.com/yashjit52n",
      liveUrl: "https://github.com/yashjit52n",
      isPlaceholder: false,
      highlights: [
        "Step-by-step playback with speed and array size controls",
        "Visual comparisons of time and space complexity",
        "Clean, interactive dark-mode user interface"
      ],
      caseStudy: {
        overview: "An algorithmic analysis and educational platform providing real-time visual step execution of classic sorting and graph traversal algorithms.",
        problemStatement: "Understanding asymptotic complexity and internal pointer movements in algorithms like QuickSort, MergeSort, and Dijkstra often lacks visceral visual representation during algorithmic problem solving.",
        solution: "Engineered an in-browser animator decoupling execution logic from rendering frames, allowing learners to scrub through time, adjust array sizes, and inspect swap/comparison counts in real time.",
        architecture: "Pure modular ES6 state machine driving CSS Grid bars and SVG node networks with zero external overhead.",
        features: [
          "Interactive QuickSort, MergeSort, BubbleSort, and HeapSort with step scrubbing",
          "Color-coded comparison, swap, and sorted index pointers",
          "Live telemetry counters tracking elapsed operations and memory frames",
          "Asymptotic Big-O complexity comparison matrix"
        ],
        metrics: "Sub-millisecond frame rendering across 100+ dynamic array elements"
      }
    },
    {
      id: "ai-workspace",
      title: "AI & Neural Network Workspace",
      subtitle: "Computational AI Model Explorer & Playground",
      description: "An exploratory application created as part of B.Tech Computer Science and AI coursework to study neural activation functions and dataset flow.",
      technologies: ["Python", "Machine Learning", "Data Processing", "NumPy"],
      image: aiWorkspaceImg,
      githubUrl: "https://github.com/yashjit52n",
      liveUrl: "https://github.com/yashjit52n",
      isPlaceholder: false,
      highlights: [
        "Interactive node parameter visualizer",
        "Sample dataset testing and accuracy telemetry",
        "Clean modular Python codebase"
      ],
      caseStudy: {
        overview: "A lightweight computational playground built during B.Tech CS & AI coursework to demystify feedforward network propagation and loss calculation.",
        problemStatement: "Abstract mathematical formulations of gradient descent and activation functions (ReLU, Sigmoid, Softmax) are difficult to debug without interactive weight inspection.",
        solution: "Built a Python-backed matrix calculation suite exposing layer-by-layer forward activations and loss convergence graphs for small synthetic classification datasets.",
        architecture: "Modular Python modules with NumPy vectorization and clean JSON serialization for web telemetry visualizers.",
        features: [
          "Layer parameter adjustment (nodes, weights, biases, learning rate)",
          "Real-time decision boundary 2D contour rendering",
          "Loss curve convergence telemetry across epochs",
          "Exportable weights configuration for inference pipelines"
        ],
        metrics: "Demonstrated 94%+ convergence on non-linear synthetic spiral datasets"
      }
    },
    {
      id: "dev-platform",
      title: "Developer Utility Suite & Dashboard",
      subtitle: "Modern Web Productivity Hub",
      description: "A centralized responsive web application featuring developer tools such as code snippet organizers, JSON validators, and time converters.",
      technologies: ["JavaScript", "HTML5", "CSS3", "Modern UI"],
      image: devPlatformImg,
      githubUrl: "https://github.com/yashjit52n",
      liveUrl: "https://github.com/yashjit52n",
      isPlaceholder: false,
      highlights: [
        "Offline-capable developer quick utilities",
        "High-contrast glassmorphic design system",
        "Lightweight, zero-bloat vanilla client logic"
      ],
      caseStudy: {
        overview: "A suite of daily developer micro-utilities combining JSON formatters, regex analyzers, UNIX epoch converters, and snippet vaults into a unified zero-lag dashboard.",
        problemStatement: "Developers frequently navigate multiple ad-heavy web tools that risk leaking sensitive code snippets or formatted payloads to external tracking servers.",
        solution: "Designed a 100% client-side, privacy-first utility hub executing all transformations in browser memory without sending data to external endpoints.",
        architecture: "Local-first responsive single page application utilizing Web Workers for regex parsing and localStorage for persistent snippet drafts.",
        features: [
          "Bi-directional JSON format, minify, and schema validation engine",
          "Interactive Regular Expression tester with syntax highlighting",
          "Timestamp, UNIX epoch, and timezone converter",
          "Local snippet repository with syntax detection and instant copy"
        ],
        metrics: "Zero external network calls; 100% offline capable"
      }
    }
  ],
  roadmap: [
    {
      id: "dsa-core",
      title: "Strengthening Data Structures & Algorithms",
      status: "Active Focus",
      description: "Deepening mastery over trees, graph theory, recursion, and dynamic programming patterns to enhance problem formulation capabilities.",
      goals: [
        "Master binary search and two-pointer techniques on complex constraints",
        "Practice tree traversals, BST validation, and heap operations",
        "Understand dynamic programming memoization and bottom-up tables"
      ]
    },
    {
      id: "competitive-prog",
      title: "Practicing Competitive Programming",
      status: "In Progress",
      description: "Consistently practicing on Codeforces, analyzing editorial writeups, and solving problems in the 900–1200 rating range.",
      goals: [
        "Participate regularly in Codeforces Div. 3 & Div. 4 contests",
        "Increase total solved problems past 200+ landmark",
        "Improve speed and zero-penalty submissions on initial problems"
      ]
    },
    {
      id: "fullstack-dev",
      title: "Building Full-Stack Web Projects",
      status: "Hands-On",
      description: "Transitioning frontend capabilities into complete end-to-end applications with resilient database backends and authenticated APIs.",
      goals: [
        "Connect client frontends to Express and REST APIs",
        "Design relational database schemas and queries",
        "Deploy production-grade full-stack web applications"
      ]
    },
    {
      id: "ai-exploration",
      title: "Exploring Artificial Intelligence & ML",
      status: "Upcoming",
      description: "Leveraging university curriculum in Computer Science and Artificial Intelligence to bridge foundational math with practical machine learning tools.",
      goals: [
        "Implement basic supervised and unsupervised models from scratch",
        "Experiment with modern deep learning libraries in Python",
        "Integrate intelligent models into real-world software products"
      ]
    }
  ],
  certifications: [
    {
      id: "cf-active",
      title: "Codeforces Division Competitor",
      issuer: "Codeforces (ITMO University)",
      category: "competitive",
      issueDate: "2026 - Present",
      credentialUrl: "https://codeforces.com/profile/Yash2207",
      iconName: "Trophy",
      description: "Active algorithmic competitor on Codeforces (Handle: Yash2207) with 999 rating, competing in Div. 3 and Div. 4 contests.",
      skills: ["C++", "Greedy Algorithms", "Math & Number Theory", "Constructive Logic"],
      verified: true
    },
    {
      id: "nst-scholar",
      title: "B.Tech CS & AI Undergraduate Scholar",
      issuer: "Newton School of Technology (Rishihood University)",
      category: "academic",
      issueDate: "2026 - 2030 (Class of 2030)",
      credentialUrl: "https://www.newtonschool.co/newton-school-of-technology-nst/home",
      iconName: "GraduationCap",
      description: "Enrolled in intensive 4-year Computer Science and AI curriculum focusing on engineering fundamentals, data structures, and production tech.",
      skills: ["Data Structures", "Computer Architecture", "Linear Algebra", "Python"],
      verified: true
    },
    {
      id: "dsa-cpp",
      title: "Algorithmic Problem Solving in C++",
      issuer: "Newton School of Technology",
      category: "technical",
      issueDate: "2026",
      iconName: "Code2",
      description: "Comprehensive hands-on validation in C++ standard template library (STL), algorithmic complexity analysis, and competitive coding logic.",
      skills: ["C++ STL", "Time & Space Complexity", "Sorting & Searching", "Two Pointers"],
      verified: true
    },
    {
      id: "web-dev",
      title: "Modern Web Engineering Foundations",
      issuer: "NST Tech Community",
      category: "technical",
      issueDate: "2026",
      iconName: "Layout",
      description: "Certification in modern semantic markup, responsive CSS architectures, asynchronous JavaScript, and client-side performance.",
      skills: ["HTML5", "CSS3 / Tailwind", "JavaScript ES6+", "DOM Engineering"],
      verified: true
    }
  ],
  resumeData: {
    title: "Yash Jit - Software Engineer Resume",
    summary: "1st Year B.Tech Computer Science and Artificial Intelligence student at Newton School of Technology (Rishihood University). Active competitive programmer on Codeforces (999 rating, 100+ solved problems) with strong foundational knowledge of C++, Python, Java, JavaScript, and responsive modern web architectures. Focused on building clean, high-performance software systems.",
    education: [
      {
        institution: "Newton School of Technology (Rishihood University)",
        degree: "B.Tech in Computer Science and Artificial Intelligence",
        duration: "2026 – Present",
        location: "Delhi NCR, India",
        highlights: [
          "Core coursework: Data Structures & Algorithms, Python Programming, Modern Web Development, Discrete Mathematics, Linear Algebra",
          "Active division competitor on Codeforces (Handle: Yash2207)"
        ]
      }
    ],
    skills: [
      {
        category: "Programming Languages",
        items: ["Python", "C++", "Java", "JavaScript (ES6+)", "HTML5", "CSS3"]
      },
      {
        category: "Frameworks & Libraries",
        items: ["React", "Three.js", "Tailwind CSS", "Framer Motion", "Node.js (Basics)"]
      },
      {
        category: "Core Competencies",
        items: ["Data Structures & Algorithms", "Competitive Programming", "Object-Oriented Programming (OOP)", "Git / GitHub", "Responsive Web Design"]
      }
    ],
    competitiveProgramming: {
      platform: "Codeforces",
      rating: "999 (Newbie)",
      solved: "100+ Algorithmic Problems Solved",
      profile: "https://codeforces.com/profile/Yash2207",
      highlights: [
        "Regular participant in Codeforces Division 3 and 4 contests",
        "Consistent practice in Greedy, Math, Implementation, and Two-Pointer strategies"
      ]
    },
    featuredProjects: [
      {
        name: "Algorithmic Visualizer & Solver",
        tech: "C++, JavaScript, HTML5, CSS3",
        bullets: [
          "Interactive step-by-step sorting, binary search, and traversal visualizer",
          "Real-time visual playback, complexity metrics, and dark-mode UI"
        ]
      },
      {
        name: "AI & Neural Network Workspace",
        tech: "Python, Machine Learning, NumPy",
        bullets: [
          "Exploratory environment to analyze neural activations, weight matrices, and loss convergence",
          "Demonstrates mathematical foundations of machine learning models"
        ]
      },
      {
        name: "Developer Utility Suite & Dashboard",
        tech: "JavaScript, HTML5, CSS3",
        bullets: [
          "Privacy-first, client-side productivity hub with JSON validators and epoch converters",
          "Zero external dependencies, fast local execution"
        ]
      }
    ],
    certifications: [
      "Codeforces Division Competitor (Handle: Yash2207)",
      "B.Tech CS & AI Academic Scholar - Newton School of Technology",
      "Algorithmic Problem Solving in C++ - NST Tech Track",
      "Modern Web Engineering Foundations - NST Tech Community"
    ]
  }
};
