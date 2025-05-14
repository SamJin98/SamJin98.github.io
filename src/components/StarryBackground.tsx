import React from "react";

export default function StarryBackground() {
  // Create an array of 40 stars (increased from 30)
  const stars = Array.from({ length: 40 }, (_, i) => i + 1);
  
  // Determine star size class based on index
  const getStarSizeClass = (index: number) => {
    if (index % 8 === 0) return "large"; // Increased frequency of large stars
    if (index % 4 === 0) return "medium"; // Increased frequency of medium stars
    return "";
  };
  
  return (
    <div className="stars">
      {stars.map((index) => (
        <div 
          key={index} 
          className={`star ${getStarSizeClass(index)}`}
          style={{
            animationName: `twinkle, float, scroll`,
            animationDuration: `${3 + (index % 3) * 1.5}s, ${8 + (index % 5) * 1.5}s, ${18 + (index % 7) * 3}s`, // Faster animations
            animationTimingFunction: "ease-in-out, ease-in-out, linear",
            animationIterationCount: "infinite, infinite, infinite",
            animationDelay: `${(index * 0.4) % 4}s, ${(index * 0.2) % 2}s, ${(index * 0.1) % 3}s` // Shorter delays
          }}
        />
      ))}
    </div>
  );
} 