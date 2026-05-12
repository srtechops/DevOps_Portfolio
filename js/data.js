/* =============================================
   data.js — Default Portfolio Data
   Per SRS Section 9: Data Schema
   ============================================= */

/** Default profile (PR-01 through PR-10) */
const DEFAULT_PROFILE = {
  name: "Jane Doe",
  title: "DevOps Engineer & Cloud Architect",
  intro: "Building scalable infrastructure and automating the future, one pipeline at a time.",
  about: "I'm a passionate DevOps engineer with 3+ years of experience in cloud infrastructure, CI/CD pipelines, and container orchestration. I thrive at the intersection of development and operations, creating reliable, scalable systems that empower teams to ship faster and more confidently. My expertise spans AWS, Kubernetes, Terraform, and modern monitoring stacks.",
  resumeUrl: "",
  location: "San Francisco, CA",
  email: "hello@example.com",
  status: "Open to Work",
  education: "B.Tech Computer Science",
  badgeText: "Available for opportunities",
  stats: {
    experience: "3+",
    projects: "20+",
    certs: "5+"
  },
  social: {
    github: "https://github.com/username",
    linkedin: "https://linkedin.com/in/username",
    twitter: "https://twitter.com/username"
  },
  contactDesc: "I'm currently open to new opportunities. Whether you have a question or just want to say hi, my inbox is always open!"
};

/** Default skills (SK-01 through SK-03) */
const DEFAULT_SKILLS = [
  { id: "sk-001", name: "AWS", category: "Cloud", proficiency: 90 },
  { id: "sk-002", name: "Azure", category: "Cloud", proficiency: 75 },
  { id: "sk-003", name: "GCP", category: "Cloud", proficiency: 65 },
  { id: "sk-004", name: "Terraform", category: "DevOps", proficiency: 92 },
  { id: "sk-005", name: "Jenkins", category: "DevOps", proficiency: 85 },
  { id: "sk-006", name: "GitHub Actions", category: "DevOps", proficiency: 88 },
  { id: "sk-007", name: "ArgoCD", category: "DevOps", proficiency: 78 },
  { id: "sk-008", name: "Docker", category: "Containers", proficiency: 95 },
  { id: "sk-009", name: "Kubernetes", category: "Containers", proficiency: 88 },
  { id: "sk-010", name: "Helm", category: "Containers", proficiency: 80 },
  { id: "sk-011", name: "Python", category: "Scripting", proficiency: 82 },
  { id: "sk-012", name: "Bash", category: "Scripting", proficiency: 90 },
  { id: "sk-013", name: "Prometheus", category: "Monitoring", proficiency: 85 },
  { id: "sk-014", name: "Grafana", category: "Monitoring", proficiency: 88 },
  { id: "sk-015", name: "Linux", category: "Other", proficiency: 93 },
  { id: "sk-016", name: "Git", category: "Other", proficiency: 92 }
];

/** Default projects (PJ-01) */
const DEFAULT_PROJECTS = [
  {
    id: "pj-001",
    title: "CI/CD Pipeline Automation",
    description: "Designed and implemented a fully automated CI/CD pipeline using Jenkins, ArgoCD, and Kubernetes, reducing deployment time by 70%.",
    link: "https://github.com/username/cicd-pipeline",
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&h=400&fit=crop",
    tags: ["Jenkins", "ArgoCD", "Kubernetes", "Docker"]
  },
  {
    id: "pj-002",
    title: "Infrastructure as Code Platform",
    description: "Built a comprehensive IaC platform with Terraform modules for multi-cloud provisioning across AWS and Azure environments.",
    link: "https://github.com/username/iac-platform",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop",
    tags: ["Terraform", "AWS", "Azure", "Python"]
  },
  {
    id: "pj-003",
    title: "Kubernetes Monitoring Stack",
    description: "Deployed a production-grade monitoring stack with Prometheus, Grafana, and custom alerting rules for 50+ microservices.",
    link: "https://github.com/username/k8s-monitoring",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    tags: ["Prometheus", "Grafana", "Kubernetes", "Helm"]
  }
];

/** Default experience (EX-01) */
const DEFAULT_EXPERIENCE = [
  {
    id: "ex-001",
    role: "Senior DevOps Engineer",
    company: "Tech Corp Inc.",
    startDate: "Jan 2024",
    endDate: "Present",
    description: "Leading cloud infrastructure initiatives and managing CI/CD pipelines for a platform serving 2M+ users. Reduced infrastructure costs by 35% through optimization and auto-scaling strategies.",
    tags: ["AWS", "Kubernetes", "Terraform", "Jenkins"]
  },
  {
    id: "ex-002",
    role: "DevOps Engineer",
    company: "CloudScale Solutions",
    startDate: "Jun 2022",
    endDate: "Dec 2023",
    description: "Architected and maintained containerized microservices infrastructure. Implemented GitOps workflows using ArgoCD and established monitoring with Prometheus and Grafana.",
    tags: ["Docker", "ArgoCD", "Prometheus", "GitHub Actions"]
  },
  {
    id: "ex-003",
    role: "Junior Systems Engineer",
    company: "StartupHub",
    startDate: "Aug 2021",
    endDate: "May 2022",
    description: "Managed Linux servers, automated deployment scripts with Bash and Python, and supported migration from on-premise to AWS cloud infrastructure.",
    tags: ["Linux", "Bash", "AWS", "Python"]
  }
];

/** Terminal commands for hero animation */
const TERMINAL_COMMANDS = [
  { cmd: "kubectl get pods -n production", output: ["NAME                        READY   STATUS    AGE", "api-server-7d9f4b6c8-x2k9l  1/1    Running   12d", "web-app-5c8d7e9f1-m3n7p     1/1    Running   12d", "redis-cache-8b4a2d1e-q5r8   1/1    Running   30d"] },
  { cmd: "terraform plan", output: ["Refreshing state...", "Plan: 3 to add, 1 to change, 0 to destroy.", "✓ Infrastructure changes ready to apply"] },
  { cmd: "docker ps --format 'table {{.Names}}'", output: ["NAMES", "nginx-proxy", "app-backend", "postgres-db", "redis-cache"] },
  { cmd: "helm list -n monitoring", output: ["NAME         REVISION  STATUS    CHART", "prometheus   3         deployed  prometheus-15.0", "grafana      2         deployed  grafana-6.50"] }
];

/* Skill categories for filter buttons (SK-03) */
const SKILL_CATEGORIES = ["All", "Cloud", "DevOps", "Containers", "Scripting", "Monitoring", "Other"];
