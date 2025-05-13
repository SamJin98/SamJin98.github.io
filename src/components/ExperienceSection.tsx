import { workExperience } from "@/lib/data";
import TimelineItem from "./TimelineItem";
import { Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import MotionWrapper from "./MotionWrapper";
import React, { useState, useRef } from "react";

export default function ExperienceSection() {
  const [showAll, setShowAll] = useState(false);
  const displayedExperiences = showAll ? workExperience : workExperience.slice(0, 3);
  const isButtonAtEnd = displayedExperiences.length === workExperience.length;
  const hasAnimated = useRef(false);

  const handleToggle = () => {
    if (showAll) {
      hasAnimated.current = true;
    }
    setShowAll((prev) => !prev);
  };

  return (
    <section
      id="experience"
      className="py-12"
    >
      <div className="container max-w-4xl mx-auto px-6 md:px-4">
        <MotionWrapper>
          <h2 className="text-2xl font-bold pt-8 mb-8 text-center md:text-left flex items-center md:inline-block">
            <motion.span
              className="inline-block mr-2"
              initial={{ rotate: 0 }}
              whileInView={{ rotate: [0, -10, 10, -5, 5, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              💼
            </motion.span>{" "}
            Work Experience
          </h2>
        </MotionWrapper>
        <div className="mb-8">
          {displayedExperiences.map((job, index) => (
            <TimelineItem
              key={job.company + job.period}
              title={`${job.position} | ${job.company}`}
              subtitle={`${job.location}`}
              date={`${job.period}`}
              isLast={index === displayedExperiences.length - 1 && isButtonAtEnd}
              index={index}
            >
              <motion.div
                className="mt-3 p-4 bg-background/80 backdrop-blur-sm backdrop-filter rounded-lg border border-blue-400/20 dark:bg-card/10 dark:border-blue-400/10 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-3">
                  <div className="h-6 w-6 flex items-center justify-center rounded-full bg-blue-400/10 mr-2">
                    <Briefcase className="h-4 w-4 text-blue-500" />
                  </div>
                  <h4 className="text-sm font-medium">Key Achievements</h4>
                </div>
                <ul className="list-none ml-4 space-y-2 text-sm">
                  {job.achievements.slice(0, 4).map((achievement, i) => (
                    <motion.li
                      key={i}
                      className="text-foreground/90 relative pl-6 before:content-['•'] before:absolute before:left-0 before:text-blue-500 before:font-bold before:text-lg"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * i }}
                      viewport={{ once: true }}
                    >
                      {achievement}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </TimelineItem>
          ))}
          {!isButtonAtEnd ? (
            <TimelineItem
              title=""
              subtitle=""
              date=""
              isLast={isButtonAtEnd}
              index={displayedExperiences.length}
            >
              <div className="flex justify-start w-full mt-2">
                <motion.button
                  className="px-4 py-1 rounded-md border border-blue-400/30 bg-background/70 text-sm font-medium text-blue-700 hover:bg-blue-50 dark:bg-blue-800/30 dark:text-blue-200 dark:border-blue-400 dark:hover:bg-blue-800/60 transition-colors cursor-pointer"
                  onClick={handleToggle}
                  aria-pressed={showAll}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showAll ? "Show Less" : "Show All"}
                </motion.button>
              </div>
            </TimelineItem>
          ) : (
            <div className="flex justify-start w-full mt-6">
              <div className="pl-[40px]">
                <motion.button
                  className="px-4 py-1 rounded-md border border-blue-400/30 bg-background/70 text-sm font-medium text-blue-700 hover:bg-blue-50 dark:bg-blue-800/30 dark:text-blue-200 dark:border-blue-400 dark:hover:bg-blue-800/60 transition-colors cursor-pointer"
                  onClick={handleToggle}
                  aria-pressed={showAll}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ 
                    type: "animate",
                    stiffness: 300,
                    damping: 15,
                    duration: 0.7, 
                    delay: 0.3 
                  }}
                >
                  {showAll ? "Show Less" : "Show All"}
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
