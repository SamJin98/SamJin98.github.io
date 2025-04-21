import ThemeToggle from "./ui/theme-toggle";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Home, FolderGit2, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Define navigation items
const navItems = [
  { label: "Home", href: "#hero", icon: <Home size={18} /> },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  // { label: "Awards", href: "#awards", icon: "🏆" },
  { label: "Education", href: "#education" },
  // { label: "Contact", href: "#contact", icon: <Send size={18} /> }
];

export default function GlassHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Handle scroll event for styling and width animation
  useEffect(() => {
    let rafId: number | null = null;

    const navElement = navRef.current;
    if (!navElement) return; // Exit if nav ref is not set yet

    const maxScroll = 300; // Pixels scrolled to reach minimum width
    const maxWidthPercent = 0.8; // Initial width as a percentage of window width
    // Estimate or calculate minWidth based on content. Adjust as needed.
    // We'll let the content define min-width naturally in scrolled state,
    // but need a value for the animation calculation.
    const minWidthEstimate = 550; // Example: Estimate based on items + padding

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const isCurrentlyScrolling = scrollY > 10;
      setIsScrolling(isCurrentlyScrolling);

      // Width animation logic (desktop only)
      if (window.innerWidth >= 768) {
        if (isCurrentlyScrolling) {
          const scrollProgress = Math.min(scrollY / maxScroll, 1);
          // Use an easing function (easeOutQuad)
          const easeProgress = scrollProgress * (2 - scrollProgress);

          const maxWidth = window.innerWidth * maxWidthPercent;
          const currentWidth = maxWidth - (maxWidth - minWidthEstimate) * easeProgress;

          navElement.style.setProperty("width", `${Math.max(currentWidth, minWidthEstimate)}px`);
          navElement.classList.remove("w-[80%]", "max-w-4xl"); // Let inline style take over
        } else {
          // Reset width when scrolled to top
          navElement.style.removeProperty("width");
          navElement.classList.add("w-[80%]", "max-w-4xl"); // Re-apply initial width classes
        }
      } else {
        // Reset width styles on mobile
        navElement.style.removeProperty("width");
        navElement.classList.remove("w-[80%]", "max-w-4xl");
      }

      rafId = null; // Allow next frame request
    };

    const requestUpdate = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(handleScroll);
      }
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    handleScroll(); // Initial check on mount

    // Add resize listener to potentially recalculate maxWidth/minWidth if needed
    // For simplicity, we'll just re-run the initial check on resize here
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []); // Empty dependency array: runs once on mount

  // Smooth scroll handler
  const handleNavLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
      });
    }
    if (isMenuOpen) {
      toggleMenu(); // Close mobile menu on click
    }
  };

  // Intersection Observer for active link highlighting
  useEffect(() => {
    const sectionIds = navItems.map(item => item.href.substring(1));
    // Ensure 'hero' (or your main top section ID) is observed if it exists
    const heroElement = document.getElementById('hero');
    if (heroElement && !sectionIds.includes('hero')) {
      sectionIds.unshift('hero');
    }

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -60% 0px", // Target zone: roughly middle 20% of viewport height
      threshold: 0, // Trigger as soon as any part enters/leaves the margin zone
    };

    // Simplified Observer Callback
    const observerCallback: IntersectionObserverCallback = (entries) => {
      let bestCandidateId: string | null = null;
      let minTop = Infinity;

      entries.forEach((entry) => {
        const targetElement = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          // Find the intersecting element whose top is closest to the top margin (-40%)
          const topRelativeToRoot = entry.boundingClientRect.top;
          // Consider elements whose top is within or just below the top margin
          // We check <= 0 because the rootMargin is negative from the top
          if (topRelativeToRoot <= 0 && Math.abs(topRelativeToRoot) < minTop) {
             minTop = Math.abs(topRelativeToRoot);
             bestCandidateId = targetElement.id;
          }
        }
      });

      // If we found a candidate intersecting near the top margin, set it
      if (bestCandidateId) {
        setActiveSection(bestCandidateId);
      } else {
         // Fallback: If nothing is intersecting *near the top margin*,
         // check if any section is intersecting *at all*. 
         // Take the first one found (usually the highest visible one).
         const anyIntersecting = entries.find(e => e.isIntersecting);
         if (anyIntersecting) {
             setActiveSection((anyIntersecting.target as HTMLElement).id);
         } 
         // Optional: if nothing is intersecting at all, maybe default to first/last?
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((section) => observer.observe(section));

    // Simplified Initial Check
    const checkInitialSection = () => {
      let currentActiveSection: string | null = null;
      let minTop = Infinity;

      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        // Find section whose top is closest to the viewport top (but still visible)
        if (rect.top >= 0 && rect.top < window.innerHeight && rect.top < minTop) {
          minTop = rect.top;
          currentActiveSection = section.id;
        }
      });

      // Default to 'hero' if no section is found initially or hero is closest
      setActiveSection(currentActiveSection || (sections.find(s=>s.id === 'hero') ? 'hero' : null));
    };

    const timeoutId = setTimeout(checkInitialSection, 100);

    return () => {
      clearTimeout(timeoutId);
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []); // Dependencies: navItems if it can change dynamically

  return (
    <>
      {/* Desktop Navigation - Centered, transforms on scroll */}
      <nav
        ref={navRef}
        className={cn(
          "hidden md:flex fixed left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ease-in-out",
          "items-center justify-center p-2 text-sm font-medium",
          "w-[80%] max-w-4xl", // Initial width defined here
          isScrolling
            ? "top-4 bg-component-bg/80 dark:bg-component-bg-dark/80 border border-border/10 rounded-full shadow-lg backdrop-blur-lg"
            : "top-6 bg-transparent" // Initial state: transparent background
        )}
      >
        <div className="flex items-center gap-1"> {/* Reduced gap */} 
          {navItems.map((item, index) => (
            <motion.a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavLinkClick(e, item.href)}
              className={cn(
                "relative px-3 py-1.5 rounded-full transition-colors duration-200 ease-in-out hover:text-foreground",
                activeSection === item.href.substring(1)
                  ? "text-foreground font-semibold"
                  : "text-foreground/60",
                isScrolling ? "hover:bg-background/50 dark:hover:bg-background-dark/50" : ""
              )}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {activeSection === item.href.substring(1) && (
                <motion.span
                  className="absolute inset-0 bg-muted/50 rounded-full -z-10"
                  layoutId="activePill"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {/* Render icon only when scrolling for a cleaner look initially? Optional. */}
                {/* {isScrolling && item.icon} */}
                {item.icon} 
                {item.label}
              </span>
            </motion.a>
          ))}
          {/* Theme Toggle integrated into the nav bar */} 
          <div className="pl-2"> {/* Add some padding */} 
             <ThemeToggle />
          </div>
        </div>
      </nav>

       {/* Mobile Controls - Fixed top right */}
       <div className="md:hidden fixed top-4 right-4 z-[100] flex items-center gap-2">
           <ThemeToggle />
           <motion.button
                className="p-3 bg-background/80 dark:bg-background/80 backdrop-blur-sm border border-border/10 rounded-full shadow-lg text-foreground"
                onClick={toggleMenu}
                aria-label="Toggle menu"
                whileTap={{ scale: 0.95 }}
            >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
       </div>

      {/* Mobile Navigation Menu - Full width fly-out */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            // Adjusted styles for full screen overlay that doesn't rely on header height
            className="md:hidden fixed inset-0 z-[90] p-4 bg-background/95 dark:bg-background/95 backdrop-blur-lg flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {/* Content centered vertically and horizontally */} 
            <div className="flex flex-col space-y-5 text-xl font-medium items-center">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavLinkClick(e, item.href)}
                  className={cn(
                    "transition-colors hover:text-foreground py-2",
                    activeSection === item.href.substring(1)
                      ? "text-foreground font-semibold"
                      : "text-foreground/70"
                  )}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 + 0.1 }}
                >
                  <span className="flex items-center justify-center gap-2">
                    {item.icon}
                    {item.label}
                  </span>
                </motion.a>
              ))}
            </div>
             {/* Optional: Close button inside the mobile menu itself */}
             {/* <button onClick={toggleMenu} className="absolute top-4 right-4 p-2"><X size={24} /></button> */} 
          </motion.nav>
        )}
      </AnimatePresence>

      {/* No body padding needed specifically for this nav structure anymore */} 
    </>
  );
}
