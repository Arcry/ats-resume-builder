// Sample resume shown on first load. Fictional person: example.com / example.org are reserved
// domains (RFC 2606) and +44 20 7946 0xxx is a UK range reserved for fiction.
const DefaultResumeData = {
  name: "Alex Morgan",
  position: "Full Stack Developer",
  contactInformation: "+44 20 7946 0123",
  email: "alex.morgan@example.com",
  address: "London, UK",
  profilePicture: "",
  socialMedia: [
    {
      socialMedia: "Github",
      link: "example.com/github/alexmorgan",
    },
    {
      socialMedia: "LinkedIn",
      link: "example.com/linkedin/alexmorgan",
    },
    {
      socialMedia: "Website",
      link: "alexmorgan.example.org",
    },
  ],
  summary:
    "A Full Stack Developer with 3 years of experience building and shipping web applications for small and mid-sized teams. Comfortable across the stack, from React front ends to Node.js services and PostgreSQL schemas, with a strong interest in developer tooling and automated delivery. Focused on readable code, measurable improvements and clear communication with product and design.",
  education: [
    {
      school: "Example University",
      degree: "BSc Computer Science",
      startYear: "2017-09-01",
      endYear: "2020-06-01",
    },
  ],
  workExperience: [
    {
      company: "Northwind Software",
      position: "Full Stack Developer",
      description:
        "Worked on a customer portal and internal tools for a logistics client, building features end to end with React, Node.js and PostgreSQL. Collaborated with product managers and designers to turn requirements into shipped increments every two weeks.",
      keyAchievements:
        "Delivered 6 client-facing features on schedule across three releases\nReduced portal page load time by 40% by splitting bundles and caching API responses",
      startYear: "2022-01-01",
      endYear: "2024-06-01",
    },
    {
      company: "Acme Digital",
      position: "Frontend Developer Intern",
      description:
        "Built user interfaces for marketing sites and a small e-commerce application. Worked with senior developers to implement responsive layouts and improve accessibility.",
      keyAchievements:
        "Implemented responsive components with React and Tailwind CSS\nRaised the Lighthouse accessibility score of the main site from 71 to 96",
      startYear: "2021-06-01",
      endYear: "2021-12-01",
    },
  ],
  projects: [
    {
      name: "Resume Builder",
      description:
        "Built a resume builder with Next.js: a form on the left, a live preview on the right and PDF export through the browser print dialog. Added optional AI suggestions through an OpenAI-compatible API.",
      keyAchievements:
        "Implemented drag-and-drop reordering of resume sections\nAdded a template switcher with colour presets stored in the resume JSON",
      startYear: "2024-02-01",
      endYear: "2024-04-01",
      link: "https://example.com/alexmorgan/resume-builder",
    },
    {
      name: "Expense Tracker",
      description:
        "Created a personal finance application with Express and PostgreSQL: accounts, categories, recurring transactions and monthly reports. Deployed with Docker and GitHub Actions.",
      keyAchievements:
        "Designed the data model and REST API for accounts and transactions\nSet up CI with automated tests and container builds on every push",
      startYear: "2024-05-01",
      endYear: "2024-07-01",
      link: "https://example.com/alexmorgan/expense-tracker",
    },
  ],
  skills: [
    {
      title: "Technical Skills",
      skills: [
        "React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Express",
        "PostgreSQL", "MongoDB", "Redis", "Python", "Docker", "AWS", "GitHub Actions",
        "Git", "REST API", "GraphQL", "Jest", "Playwright",
      ],
    },
    {
      title: "Soft Skills",
      skills: [
        "Collaboration", "Problem-solving", "Communication", "Time management", "Result-oriented",
      ],
    },
    {
      title: "Additional Skills",
      skills: ["CI/CD", "Microservices", "System Design", "Cloud Architecture"],
    },
  ],
  languages: ["English", "Spanish", "French"],
  certifications: [
    {
      name: "Cloud Fundamentals",
      issuer: "Example Cloud Academy",
    },
    {
      name: "Full Stack Web Development",
      issuer: "Example Bootcamp",
    },
    {
      name: "Agile Project Management",
      issuer: "Example Institute",
    },
    {
      name: "Introduction to Machine Learning",
      issuer: "Example Online Courses",
    },
  ],
  theme: {
    template: "ats",
    accent: "",
    background: "",
  },
};

export default DefaultResumeData;
