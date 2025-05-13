import React from "react";
import { awards } from "@/lib/data";
import { Trophy } from "lucide-react";
import MotionWrapper from "./MotionWrapper";
import { GlassCard } from "./ui/glass-card";
import { motion } from "framer-motion";

export default function AwardsSection() {
  return (
    <section
      id="awards"
      className="py-12"
    >
      <div className="container max-w-4xl mx-auto px-6 md:px-4">
        <MotionWrapper>
          <h2 className="text-2xl font-bold mb-8 text-center md:text-left">
            🏆 Awards
          </h2>
        </MotionWrapper>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {awards.map((award, index) => (
            <motion.div
              key={award.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              viewport={{ once: true, margin: "-50px" }}
              className="mb-4 md:mb-0"
            >
              <GlassCard className="p-4 dark:border-blue-500/10 hover:border-blue-400/30 transition-all duration-300 flex flex-col h-full">
                <h3 className="font-medium mb-1">{award.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {award.issuer} • {award.date}
                </p>
                <p className="text-sm text-muted-foreground mt-auto">{award.description}</p>
                {award.categories && award.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {award.categories.map((category) => (
                      <span
                        key={category}
                        className="text-xs px-2 py-1 bg-blue-400/10 rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
