export const personalInfo = {
  name: 'Ruilin (Sam) Jin',
  location: 'San Francisco Bay Area, California',
  email: 'sam_ruilin@hotmail.com', // You can add this if you want it public
  github: 'https://github.com/SamJin98', // Add your GitHub if public
  linkedin: 'https://www.linkedin.com/in/ruilinjin1998/' // Add your LinkedIn if public
}

export const workExperience = [
  {
    company: 'ByteDance',
    location: 'San Francisco Bay Area, California',
    position: 'Software Engineer - Lynx',
    period: 'Jun 2025 - Present',
    achievements: [
      'Build AI tools to support and streamline Lynx development',
      'Improve workflows with RAG, MCP, and code reasoning',
      'Develop toward autonomous app building with agent-based systems'
    ]
  },
  {
    company: 'Case Western Reserve University',
    location: 'Cleveland, Ohio',
    position: 'Research Assistant',
    period: 'Feb 2024 - May 2025',
    achievements: [
      'Optimized LLM inference via KV Cache pooling and attention selection, improving generation speed by 30%',
      'Enhanced AI agent accuracy for educational queries with multi-source retrieval strategies',
      'Automated deployment pipeline, reducing research tool delivery time by 40%',
      'Implemented secure JWT authentication with university SSO for role-based access'
    ]
  },
  {
    company: 'CREC Cloud Net Information Technology Co., Ltd.',
    location: 'Beijing, China',
    position: 'Software Engineer',
    period: 'Jun 2021 - Aug 2023',
    achievements: [
      'Built BERT-based text similarity system, reducing processing from 3 hours to 2 minutes with 95% accuracy',
      'Fine-tuned ChatGLM-6B using LoRA, increasing domain-specific QA accuracy by 35%',
      'Reduced data processing costs by 60% through Kafka streaming platform optimization',
      'Led 11-person team in developing marketing system with 100+ pages, slashing page load time by 90%'
    ]
  },
  {
    company: 'University of Chinese Academy of Sciences',
    location: 'Beijing, China',
    position: 'Research Assistant',
    period: 'Jan 2018 - Dec 2020',
    achievements: [
      'Led software security threat assessment using fuzz testing and symbolic execution',
      'Applied advanced analysis with AFL, Panda, IDA Pro, and S2E tools',
      'Enhanced AFL fuzzing strategies, improving vulnerability detection by 25%'
    ]
  },
  {
    company: 'IBM',
    location: 'New York',
    position: 'Software Engineer Intern',
    period: 'Sep 2019 - Dec 2019',
    achievements: [
      'Developed Watson digital twin prototype using React and GoLang with REST APIs',
      'Performed market analysis for Watson applications, generating $108k+ revenue insights',
      'Created data visualizations using Pandas and Tableau for strategic planning'
    ]
  }
]

export const education = [
  {
    institution: 'Case Western Reserve University',
    location: 'Cleveland, Ohio',
    degree: 'MS in Computer Science',
    period: '2023 - 2025',
    achievements: [
      'Focus on Artificial Intelligence, Generative Models, and LLMs',
      'Projects on deep generative models, causal reasoning, and scalable AI systems'
    ]
  },
  {
    institution: 'Rensselaer Polytechnic Institute',
    location: 'Troy, New York',
    degree: 'BS in IT and Web Science, Minor in Philosophy',
    period: '2016 - 2021',
    achievements: []
  }
]

export const skills = {
  programmingLanguages: [
    'Python',
    'TypeScript',
    'Swift',
    'Go',
    'C++',
    'SQL',
    'Java'
  ],
  frontendDevelopment: ['Vue.js', 'React.js', 'Next.js', 'SwiftUI'],
  backendDevelopment: ['Flask', 'FastAPI', 'Node.js', 'Gin'],
  databaseAndStorage: [
    'Pinecone',
    'MySQL',
    'PostgreSQL',
    'MongoDB',
    'DynamoDB',
    'AWS S3'
  ],
  cloudAndDevOps: ['Docker', 'Kafka', 'AWS', 'Git'],
  toolsAndServices: ['PyTorch', 'MLFlow', 'TensorFlow']
}

export const projects = [
  {
    title: 'Hello Algo: Data Structures and Algorithms Crash Course',
    github: 'https://www.hello-algo.com/',
    showStars: true,
    description: [
      "Contributed to 'Hello Algo,' an open-source project providing a beginner-friendly crash course on data structures and algorithms.",
      'Enhanced learning materials with animated illustrations and code implementations in multiple programming languages, including Python, Java, C++, JavaScript, and more',
      'Collaborated with a global community to improve content accessibility and educational value.'
    ]
  },
  {
    title: 'AI4EDU, AI-Powered Study Assistant',
    github: 'https://github.com/os-computational-economics/ai4edu-ios',
    description: [
      'Built a cross-platform AI-powered study assistant featuring both a web app and an iOS mobile app that transforms lecture notes and class materials into personalized AI-powered study tools',
      'Leveraged large language models to analyze raw content and generate tailored learning experiences for students on the go.',
      "Integrated backend with CWRU's SSO and JWT-based authentication; implemented RBAC access control to ensure secure user management.",
      'Improved system performance with Pinecone-based multi-tenant data retrieval, cutting fetch times from 45s to 10s.',
      'Optimized backend infrastructure with Vercel, GitHub Actions, and LangChain, increasing query accuracy and supporting 8,000+ daily requests.'
    ]
  }
]

export const awards = [
  // {
  //   name: 'IEEE YESIST12 Hackathon',
  //   issuer: 'IEEE',
  //   date: 'Sep 2022',
  //   type: 'International',
  //   position: 'Second Place'
  // }
]
