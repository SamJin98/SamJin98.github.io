import React, { useEffect, useState } from "react";
import { projects } from "@/lib/data";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ArrowRight, Star } from "lucide-react";
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
    <section id="project" className="py-12 relative">
      <div className="container max-w-4xl mx-auto px-6 md:px-4 pt-8">
        <MotionWrapper>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-center md:text-left">
              🚀 Featured Projects
            </h2>
            <a 
              href="/projects" 
              className="text-sm md:text-base text-foreground/80 hover:text-blue-600 transition-colors flex items-center"
            >
              See All Projects
              <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </div>
        </MotionWrapper>

        <div className="grid grid-cols-1 gap-6">
          {projects.map((project, index) => (
            <MotionWrapper key={project.title} delay={index * 0.2}>
              <GlassCard 
                className="overflow-hidden dark:border-blue-400/10 h-full flex flex-col" 
                hoverEffect={false}
              >
                <CardHeader className="flex items-center justify-between bg-blue-50/50 dark:bg-blue-900/10">
                  <CardTitle className="text-center md:text-left text-foreground transition-colors duration-300 flex items-center w-full">
                    {project.title}
                    {project.showStars && helloAlgoStars && (
                      <span className="flex items-center text-sm text-gray-500 dark:text-blue-300 ml-2">
                        <Star className="h-4 w-4 mr-1 stroke-current text-blue-400 dark:text-blue-300" fill="none" />
                        {formatStarCount(helloAlgoStars)}
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col h-full pb-4">
                  <div className="text-sm text-muted-foreground mb-4 mt-4">
                    {Array.isArray(project.description) 
                      ? project.description.map((desc, i) => (
                          <p key={i} className="mb-2">{desc}</p>
                        ))
                      : project.description}
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
