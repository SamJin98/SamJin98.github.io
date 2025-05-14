import React from "react";
import { skills } from "@/lib/data";
import { motion } from "framer-motion";
import MotionWrapper from "./MotionWrapper";
import { GlassCard } from "./ui/glass-card";

function SkillTag({ skill, index }: { skill: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.05 * index,
      }}
      whileHover={{ scale: 1.05, y: -2 }}
      className="px-3 py-1 bg-muted/80 backdrop-blur-sm rounded-md text-sm border border-blue-400/10 shadow-sm"
    >
      {skill}
    </motion.div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const skillCategoryVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function SkillsSection() {
  return (
    <section
      id="skills"
      className="py-12"
    >
      <div className="container max-w-4xl mx-auto px-6 md:px-4 pt-8">
        <MotionWrapper>
          <h2 className="text-2xl font-bold mb-8 text-center md:text-left">
            🛠️ Skills
          </h2>
        </MotionWrapper>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div variants={skillCategoryVariants}>
            <GlassCard className="p-3 md:p-4">
              <h3 className="text-base md:text-lg font-medium mb-2 flex items-center justify-center md:justify-start">
                <span className="mr-2 text-xl">💻</span> Programming Languages
              </h3>
              <div className="flex flex-wrap gap-1 md:gap-2 justify-center md:justify-start">
                {skills.programmingLanguages.map((skill, index) => (
                  <SkillTag key={skill} skill={skill} index={index} />
                ))}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div variants={skillCategoryVariants}>
            <GlassCard className="p-3 md:p-4">
              <h3 className="text-base md:text-lg font-medium mb-2 flex items-center justify-center md:justify-start">
                <span className="mr-2 text-xl">🎨</span> Frontend Development
              </h3>
              <div className="flex flex-wrap gap-1 md:gap-2 justify-center md:justify-start">
                {skills.frontendDevelopment.map((skill, index) => (
                  <SkillTag key={skill} skill={skill} index={index} />
                ))}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div variants={skillCategoryVariants}>
            <GlassCard className="p-3 md:p-4">
              <h3 className="text-base md:text-lg font-medium mb-2 flex items-center justify-center md:justify-start">
                <span className="mr-2 text-xl">⚙️</span> Backend Development
              </h3>
              <div className="flex flex-wrap gap-1 md:gap-2 justify-center md:justify-start">
                {skills.backendDevelopment.map((skill, index) => (
                  <SkillTag key={skill} skill={skill} index={index} />
                ))}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div variants={skillCategoryVariants}>
            <GlassCard className="p-3 md:p-4">
              <h3 className="text-base md:text-lg font-medium mb-2 flex items-center justify-center md:justify-start">
                <span className="mr-2 text-xl">🗄️</span> Database & Storage
              </h3>
              <div className="flex flex-wrap gap-1 md:gap-2 justify-center md:justify-start">
                {skills.databaseAndStorage.map((skill, index) => (
                  <SkillTag key={skill} skill={skill} index={index} />
                ))}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div variants={skillCategoryVariants}>
            <GlassCard className="p-3 md:p-4">
              <h3 className="text-base md:text-lg font-medium mb-2 flex items-center justify-center md:justify-start">
                <span className="mr-2 text-xl">☁️</span> Cloud & DevOps
              </h3>
              <div className="flex flex-wrap gap-1 md:gap-2 justify-center md:justify-start">
                {skills.cloudAndDevOps.map((skill, index) => (
                  <SkillTag key={skill} skill={skill} index={index} />
                ))}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div variants={skillCategoryVariants}>
            <GlassCard className="p-3 md:p-4">
              <h3 className="text-base md:text-lg font-medium mb-2 flex items-center justify-center md:justify-start">
                <span className="mr-2 text-xl">🧰</span> Tools & Services
              </h3>
              <div className="flex flex-wrap gap-1 md:gap-2 justify-center md:justify-start">
                {skills.toolsAndServices.map((skill, index) => (
                  <SkillTag key={skill} skill={skill} index={index} />
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
