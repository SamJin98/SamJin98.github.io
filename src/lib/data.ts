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
    position: 'Software Engineer',
    period: 'Jun 2025 - Present',
    achievements: ['Coming Soon!']
  },
  {
    company: 'Case Western Reserve University',
    location: 'Cleveland, Ohio',
    position: 'Research Assistant',
    period: 'Feb 2024 - May 2025',
    achievements: [
      'Optimized inference efficiency of large language models through KV Cache pooling, attention selection, and speculative decoding enhancements.',
      'Improved token generation performance and responsiveness by refining attention mechanisms.',
      'Automated deployment pipeline to streamline research tool delivery and reduce manual workload.',
      'Implemented secure authentication with JWT and university SSO for scalable, role-based access control.',
      'Restructured vector database architecture to optimize data retrieval for multi-tenant educational content.',
      'Enhanced AI agent accuracy for educational queries by integrating multi-source retrieval strategies.'
    ]
  },
  {
    company: 'CREC Cloud Net Information Technology Co., Ltd.',
    location: 'Beijing, China',
    position: 'Software Engineer',
    period: 'Jun 2021 - Aug 2023',
    achievements: [
      'Built a text similarity system using BERT, reducing processing from 3 hours to 2 minutes with 95% accuracy.',
      'Fine-tuned ChatGLM-6B using LoRA and P-Tuning for improved QA accuracy and satisfaction.',
      'Streamlined Kafka-based streaming platform, reducing data processing costs by 60%.',
      'Designed a Vue.js component library in a micro-frontend architecture, improving delivery speed by 40%.',
      'Led a team of 11 in building a marketing system with 8 modules and 100+ pages in 3 months, slashing page load by 90%.'
    ]
  },
  {
    company: 'University of Chinese Academy of Sciences',
    location: 'Beijing, China',
    position: 'Research Assistant',
    period: 'Jan 2018 - Dec 2020',
    achievements: [
      'Led threat assessment and policy formulation for software security using advanced analysis techniques.',
      'Applied fuzz testing, symbolic execution, and static/dynamic analysis with AFL, Panda, IDA Pro, S2E.',
      'Enhanced AFL fuzzing strategies, improving vulnerability detection rates.'
    ]
  },
  {
    company: 'IBM',
    location: 'New York',
    position: 'Software Engineer Intern',
    period: 'Sep 2019 - Dec 2019',
    achievements: [
      "Developed a prototype for IBM Watson's digital twin using React and GoLang with REST APIs.",
      "Performed market and technical analysis for Watson's applications, generating $108k+ revenue insights.",
      'Used Pandas and Tableau for data analysis and visualization in strategic planning.'
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
