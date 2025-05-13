import React, { useEffect, useState } from "react";
import { projects } from "@/lib/data";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Github, Star } from "lucide-react";
import { GlassCard } from "./ui/glass-card";
import MotionWrapper from "./MotionWrapper";
import { motion } from "framer-motion";

function formatStarCount(count: number) {
  if (count >= 1000000) return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (count >= 1000) return (count / 1000).toFixed(count >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'k';
  return count.toString();
}

export default function ProjectsSection() {
  const [helloAlgoStars, setHelloAlgoStars] = useState<number | null>(null);

  useEffect(() => {
    const helloAlgo = projects.find((p) => p.showStars);
    if (!helloAlgo) return;
    fetch("https://api.github.com/repos/krahets/hello-algo")
      .then((res) => res.json())
      .then((data) => {
        setHelloAlgoStars(data.stargazers_count || 0);
      })
      .catch(() => setHelloAlgoStars(null));
  }, []);

  return (
    <section id="projects" className="py-12 relative">
      <div className="container max-w-4xl mx-auto px-6 md:px-4">
        <MotionWrapper>
          <h2 className="text-2xl font-bold mb-8 text-center md:text-left">
            🚀 Projects
          </h2>
        </MotionWrapper>

        <div className="grid grid-cols-1 gap-6">
          {projects.map((project, index) => (
            <MotionWrapper key={project.title} delay={index * 0.2}>
              <GlassCard className="group overflow-hidden dark:border-blue-400/10 h-full flex flex-col">
                <CardHeader className="flex items-center justify-between bg-blue-50/50 dark:bg-blue-900/10">
                  <CardTitle className="text-center md:text-left group-hover:text-blue-600 transition-colors duration-300 flex items-center w-full">
                    {project.title}
                    {project.showStars && helloAlgoStars && (
                      <span className="flex items-center text-sm text-gray-500 dark:text-blue-300 ml-2">
                        <Star className="h-4 w-4 mr-1 stroke-current text-blue-400 dark:text-blue-300" fill="none" />
                        {formatStarCount(helloAlgoStars)}
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col h-full pb-2">
                  <div className="text-sm text-muted-foreground mb-4 mt-4">
                    {Array.isArray(project.description) 
                      ? project.description.map((desc, i) => (
                          <p key={i} className="mb-2">{desc}</p>
                        ))
                      : project.description}
                  </div>
                  <div className="mt-auto pt-2 border-t border-blue-200/20 dark:border-blue-400/10">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-xs md:text-sm text-muted-foreground hover:text-blue-600 transition-colors group/link pt-1 pb-1">
                      <span className="group-hover/link:underline">View on GitHub</span>
                      <Github className="h-3 w-3 ml-1 group-hover/link:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </CardContent>
              </GlassCard>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
