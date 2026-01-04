require('dotenv').config();
const mongoose = require('mongoose');

// import models
const Project = require('./models/Project');
const Experience = require('./models/Experience');
const Education = require('./models/Education');
const Certificate = require('./models/Certificate');
const Skill = require('./models/Skill');

// data projects
const seedProjects = [
  {
    title: "CampGear App",
    category: "Mobile Dev",
    techStack: ["Flutter", "Laravel", "Firebase"],
    description: "A comprehensive mobile application for renting camping equipment. Features include real-time chat between admin and customers, payment proof upload, and catalog management.",
    problemSolved: "Solved the issue of manual equipment tracking and simplified the rental process for outdoor enthusiasts.",
    imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=1000",
    githubLink: "#",
    demoLink: "#"
  },
  {
    title: "WonderAI",
    category: "Web Dev",
    techStack: ["React", "Tailwind CSS", "AI Integration"],
    description: "A web platform designed to detect misinformation using AI. Features a modern UI.",
    problemSolved: "Helping users verify news credibility in the era of hoaxes.",
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000",
    githubLink: "#",
    demoLink: "#"
  },
  {
    title: "Spotify Portfolio",
    category: "Web Dev",
    techStack: ["MERN Stack", "Tailwind", "Framer Motion"],
    description: "This current website! A portfolio designed with Spotify's UI/UX principles.",
    problemSolved: "Creating a unique, interactive way to showcase skills.",
    imageUrl: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&q=80&w=1000",
    githubLink: "#",
    demoLink: "#"
  }
];

// data experience
const seedExperience = [
  {
    role: "Frontend Developer Intern",
    company: "Tech Startup Inc.",
    location: "Jakarta, Indonesia",
    period: "Aug 2025 - Present",
    type: "Full-time",
    description: "Developing responsive web applications using React.js and Tailwind CSS. Collaborating with UI/UX designers to implement pixel-perfect interfaces.",
    skills: ["React", "Tailwind", "Figma", "Git"]
  },
  {
    role: "Laboratory Assistant",
    company: "University Computer Lab",
    location: "Depok, Indonesia",
    period: "Jan 2024 - Jul 2024",
    type: "Part-time",
    description: "Assisted students with C++ and Java programming assignments. Maintained lab equipment and software environments.",
    skills: ["C++", "Java", "Teaching", "Linux"]
  }
];

// data education
const seedEducation = [
  {
    degree: "Bachelor of Informatics Engineering",
    school: "Universitas Teknologi",
    year: "2023 - 2027 (Expected)",
    grade: "GPA: 3.85/4.00",
    desc: "Focusing on Software Engineering and Artificial Intelligence. Active member of the Computer Science Student Association."
  },
  {
    degree: "Full Stack Web Development Bootcamp",
    school: "NF Academy",
    year: "2024",
    grade: "Certified",
    desc: "Intensive 6-month bootcamp covering MERN Stack (MongoDB, Express, React, Node.js)."
  }
];

// data certificates
const seedCertificates = [
  { 
    title: "Google UX Design Professional Certificate", 
    issuer: "Coursera", 
    date: "Mar 2024", 
    credentialId: "ID: 123456", 
    verifyLink: "https://coursera.org",
    imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000",
    description: "Completed a rigorous 7-course professional certificate. Gained expertise in the design process."
  },
  { 
    title: "React (Basic) Certificate", 
    issuer: "HackerRank", 
    date: "Jan 2024", 
    credentialId: "ID: ABC-DEF", 
    verifyLink: "https://hackerrank.com",
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000",
    description: "Validated fundamental knowledge of React including components, props, state management, and lifecycle methods."
  }
];

// data skills (tech stack)
// note: icon keys refer to react-icons names we will map in frontend
const seedSkills = [
  {
    category: "Frontend",
    iconName: "Layout",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    items: [
      { name: "React", iconKey: "SiReact", color: "#61DAFB" },
      { name: "Vue", iconKey: "SiVuedotjs", color: "#4FC08D" },
      { name: "Tailwind", iconKey: "SiTailwindcss", color: "#06B6D4" },
      { name: "Framer", iconKey: "SiFramer", color: "#0055FF" }
    ]
  },
  {
    category: "Backend",
    iconName: "Server",
    color: "text-green-400",
    bg: "bg-green-500/10",
    items: [
      { name: "Node.js", iconKey: "SiNodedotjs", color: "#339933" },
      { name: "Express", iconKey: "SiExpress", color: "#ffffff" }, 
      { name: "Laravel", iconKey: "SiLaravel", color: "#FF2D20" },
      { name: "Go", iconKey: "SiGo", color: "#00ADD8" }
    ]
  },
  {
    category: "Database & Cloud",
    iconName: "Database",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    items: [
      { name: "MongoDB", iconKey: "SiMongodb", color: "#47A248" },
      { name: "MySQL", iconKey: "SiMysql", color: "#4479A1" },
      { name: "Firebase", iconKey: "SiFirebase", color: "#FFCA28" },
      { name: "AWS", iconKey: "SiAmazonwebservices", color: "#FF9900" }
    ]
  },
  {
    category: "Tools",
    iconName: "Wrench",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    items: [
      { name: "Github", iconKey: "SiGithub", color: "#ffffff" },
      { name: "Docker", iconKey: "SiDocker", color: "#2496ED" },
      { name: "Figma", iconKey: "SiFigma", color: "#F24E1E" },
      { name: "Postman", iconKey: "SiPostman", color: "#FF6C37" }
    ]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for Seeding');

    // clear existing data
    await Project.deleteMany({});
    await Experience.deleteMany({});
    await Education.deleteMany({});
    await Certificate.deleteMany({});
    await Skill.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // insert new data
    await Project.insertMany(seedProjects);
    await Experience.insertMany(seedExperience);
    await Education.insertMany(seedEducation);
    await Certificate.insertMany(seedCertificates);
    await Skill.insertMany(seedSkills);
    
    console.log('🌱 Database Seeded Successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();