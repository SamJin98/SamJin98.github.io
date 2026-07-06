export const personalInfo = {
  name: 'Ruilin (Sam) Jin',
  location: 'San Francisco Bay Area, California',
  email: 'sam_ruilin@hotmail.com', // You can add this if you want it public
  github: 'https://github.com/SamJin98', // Add your GitHub if public
  linkedin: 'https://www.linkedin.com/in/samjin98/' // Add your LinkedIn if public
}

export const workExperience = [
  {
    company: 'ByteDance',
    location: 'San Francisco Bay Area, California',
    position: 'AI Software Engineer',
    period: 'Jun 2025 - Present',
    summary:
      'Building AI agents that help developers write <a href="https://lynxjs.org/" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline underline-offset-4">Lynx</a> more effectively, and training models to write Lynx code.',
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
    summary:
      'Researched LLM inference optimization with KV-cache pooling and attention selection, and built multi-source retrieval for an educational AI agent.',
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
    summary:
      'Built NLP systems for document matching and domain question answering, and led a team developing a large marketing platform.',
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
    summary:
      'Software security research on vulnerability discovery with fuzzing and symbolic execution.',
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
    summary:
      'Prototyped a digital twin for Watson with React and Go, and supported market analysis for the Watson product line.',
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

// Project pages are driven by the content collection in src/content/projects/.
