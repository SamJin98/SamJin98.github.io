import React from "react";

export default function StarryBackground() {
  // Create an array of 30 stars
  const stars = Array.from({ length: 30 }, (_, i) => i + 1);
  
  // Determine star size class based on index
  const getStarSizeClass = (index: number) => {
    if (index % 10 === 0) return "large";
    if (index % 5 === 0) return "medium";
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
            animationDuration: `${4 + (index % 3) * 2}s, ${10 + (index % 5) * 2}s, ${25 + (index % 7) * 5}s`,
            animationTimingFunction: "ease-in-out, ease-in-out, linear",
            animationIterationCount: "infinite, infinite, infinite",
            animationDelay: `${(index * 0.5) % 5}s, ${(index * 0.3) % 3}s, ${(index * 0.2) % 5}s`
          }}
        />
      ))}
    </div>
  );
} 