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
      'Building AI for <a href="https://lynxjs.org/" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline underline-offset-4">Lynx</a>: an internal coding agent and knowledge base for Lynx developers, a Lynx code-generation benchmark, and RL training for models that write better Lynx code.',
    achievements: [
      'Build the Lynx knowledge base that powers the team\'s AI tools',
      'Develop our internal agent for Lynx development, using RAG, MCP, and code reasoning',
      'Build a Lynx code-generation benchmark end to end: infrastructure, case generation, and evaluation',
      'Train models to generate better Lynx code with reinforcement learning',
      'Work toward autonomous app building with agent-based systems'
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

// The home page's experience list and the checkpoints on its training curve.
// `at` is where the checkpoint sits on the curve's time axis.
export const timeline = [
  {
    key: 'bytedance',
    label: 'ByteDance',
    at: 2025.45,
    years: '2025 – now',
    title: 'AI Software Engineer',
    place: 'ByteDance',
    line: 'Knowledge base, coding agent, code-generation benchmark, and RL training for Lynx.'
  },
  {
    key: 'cwru',
    label: 'Case Western',
    at: 2023.7,
    years: '2023 – 25',
    title: 'MS CS, Research Assistant',
    place: 'Case Western Reserve',
    line: 'LLM inference research: KV-cache pooling and attention selection, about 30% faster generation.'
  },
  {
    key: 'crec',
    label: 'CREC',
    at: 2021.5,
    years: '2021 – 23',
    title: 'Software Engineer',
    place: 'CREC Cloud Net',
    line: 'BERT document matching (3 hours to 2 minutes), LoRA fine-tuning, led a team of 11.'
  },
  {
    key: 'ibm',
    label: 'IBM',
    at: 2019.8,
    years: '2019',
    title: 'Software Engineer Intern',
    place: 'IBM',
    line: 'Digital twin prototype for Watson in React and Go, plus market analysis for the Watson product line.'
  },
  {
    key: 'ucas',
    label: 'UCAS',
    at: 2018.2,
    years: '2018 – 20',
    title: 'Research Assistant',
    place: 'Chinese Academy of Sciences',
    line: 'Software security: finding vulnerabilities with fuzzing and symbolic execution, and improving AFL fuzzing strategies.'
  }
]

// Current work at ByteDance, drawn on the projects page as four steps that
// feed each other.
export const pipeline = [
  {
    title: 'Knowledge base',
    line: 'The docs and code examples that the tools retrieve from.'
  },
  {
    title: 'Coding agent',
    line: 'Answers questions and writes Lynx code, using the knowledge base.'
  },
  {
    title: 'Benchmark',
    line: 'Checks whether the generated app actually builds, runs, and behaves.'
  },
  {
    title: 'RL training',
    line: "Uses the benchmark's score to train a model that writes better code."
  }
]

// Lists on the projects page. `href` starting with `/` is a page on this
// site; anything else opens in a new tab. No `href` means no public write-up.
export interface ProjectItem {
  title: string
  meta: string
  line: string
  href?: string
}

export const sideProjects: ProjectItem[] = [
  {
    title: 'e2e on Lynx',
    meta: '2026 · GitHub',
    line: 'A ReactLynx shop page tested by LLM agents. The same drag-and-checkout flow, run with two different models and compared.',
    href: 'https://github.com/SamJin98/lynx-e2e-demo'
  },
  {
    title: 'Second Look',
    meta: '2026 · live demo',
    line: 'A second opinion on your photos. Suggests color fixes and crops from fixed rules, entirely in the browser, with no model.',
    href: 'https://secondlook.samjin98.dev'
  },
  {
    title: 'AI4EDU study assistant',
    meta: '2025',
    line: 'Turns lecture notes and class materials into personalized study tools. Used across courses.',
    href: '/projects/2025-03-10_ai4edu'
  },
  {
    title: 'Hello Algo',
    meta: 'open source',
    line: 'Contributor to an open-source data structures and algorithms course.',
    href: '/projects/2024-01-15_hello-algo'
  }
]

export const research: ProjectItem[] = [
  {
    title: 'KV-cache pooling and attention selection',
    meta: 'Case Western · 2024',
    line: 'Reusing KV cache across requests for about 30% faster generation.',
    href: '/blog/2024-10-11_optimizing-kv-cache-llm-inference'
  },
  {
    title: 'Distributed GPT-2 training with FSDP',
    meta: '2023',
    line: 'A custom MPI-based FSDP framework for scalable training of GPT-2 and BERT.',
    href: '/projects/2023-12-25_fsdp'
  },
  {
    title: 'CausalVAE for image inpainting',
    meta: '2023',
    line: 'Causal reasoning inside a VAE, for more coherent reconstructions.',
    href: '/projects/2023-12-15_causal-vae'
  }
]

export const earlierWork: ProjectItem[] = [
  {
    title: 'BERT document matching',
    meta: 'CREC · 2021 – 23',
    line: 'Text similarity that cut a 3 hour matching job to 2 minutes.'
  },
  {
    title: 'LoRA fine-tuning of ChatGLM-6B',
    meta: 'CREC · 2022 – 23',
    line: 'Domain question answering, about 35% more accurate after fine-tuning.'
  },
  {
    title: 'Fuzzing strategy improvements for AFL',
    meta: 'UCAS · 2018 – 20',
    line: 'Vulnerability discovery with fuzzing and symbolic execution.'
  }
]
