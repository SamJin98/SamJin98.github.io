import ThemeToggle from "./ui/theme-toggle";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Home, FolderGit2, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Define BASE navigation items for the main page
interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  divider?: boolean;
}

const mainPageNavItems: NavItem[] = [
  { label: "Home", href: "#hero", icon: <Home size={18} /> }, // Back to #hero
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#project" },
  { label: "Education", href: "#education", divider: true },
  { label: "All Projects", href: "/projects" }, // Added Projects Page link
  { label: "Blog", href: "/blog" }, // Blog is now part of main page items with divider
];

// Define navigation items specifically for the blog page
const blogPageNavItems: NavItem[] = [
  { label: "Home", href: "/", icon: <Home size={18} /> }, // Links back to main page
  { label: "All Projects", href: "/projects" }, // Added Projects link to blog page nav

  { label: "Blog", href: "/blog" }, // Stays on blog page (can be used for active state)
];

// Define navigation items specifically for the projects page
const projectsPageNavItems: NavItem[] = [
  { label: "Home", href: "/", icon: <Home size={18} /> }, // Links back to main page
  { label: "All Projects", href: "/projects" }, // Stays on projects page (can be used for active state)
  { label: "Blog", href: "/blog" }, // Links to blog page
];

// Define component props interface
interface GlassHeaderProps {
  pathname: string; // Add pathname prop
}

export default function GlassHeader({ pathname }: GlassHeaderProps) { // Destructure pathname prop
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Determine nav items based on pathname
  const isHomePage = pathname === '/';
  const isBlogPage = pathname === '/blog';
  const isBlogPostPage = pathname.startsWith('/blog/') && pathname !== '/blog';
  const isProjectsPage = pathname === '/projects';
  const isProjectPostPage = pathname.startsWith('/projects/') && pathname !== '/projects';

  // Choose navigation items based on the current page
  const navItems = isProjectPostPage 
    ? projectsPageNavItems
    : isProjectsPage 
      ? projectsPageNavItems
      : isBlogPostPage 
        ? blogPageNavItems
        : isBlogPage 
          ? blogPageNavItems 
          : mainPageNavItems;

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
    const minWidthEstimate = 750; // Increased minimum width to cover all items

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
          navElement.classList.remove("w-[85%]", "max-w-6xl"); // Let inline style take over
        } else {
          // Reset width when scrolled to top
          navElement.style.removeProperty("width");
          navElement.classList.add("w-[85%]", "max-w-6xl"); // Re-apply initial width classes
        }
      } else {
        // Reset width styles on mobile
        navElement.style.removeProperty("width");
        navElement.classList.remove("w-[85%]", "max-w-6xl");
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

  // Smooth scroll handler / Navigation handler
  const handleNavLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    // If it's a hash link (including #hero) on the main page, smooth scroll
    if (href.startsWith("#") && pathname === '/') {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
        });
        // Manually set active section on click for immediate feedback
        setActiveSection(targetId); 
      } else if (href === '#hero') { // Special case for #hero if element isn't found immediately (rare)
         window.scrollTo({ top: 0, behavior: 'smooth' });
         setActiveSection('hero');
      }
    } 
    // For absolute paths (like '/' or '/blog'), let the default anchor behavior handle navigation.
    // No preventDefault() here.

    if (isMenuOpen) {
      toggleMenu(); // Close mobile menu on click
    }
  };

  // Intersection Observer for active link highlighting (only on main page)
  useEffect(() => {
    // Only run observer logic on the main page
    if (pathname !== '/') {
       setActiveSection(null); // Clear active section if not on main page
       return; 
    }

    const sectionIds = navItems
      .map(item => item.href.startsWith('#') ? item.href.substring(1) : null)
      .filter((id): id is string => id !== null);
      
    // Ensure 'hero' is included if it exists, even if not explicitly in filtered navItems for observer
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
         // Ensure we only process sections we are observing
         if (sectionIds.includes(targetElement.id)) { 
            if (entry.isIntersecting) {
            // Find the intersecting element whose top is closest to the top margin (-40%)
            const topRelativeToRoot = entry.boundingClientRect.top;
            // Consider elements whose top is within or just below the top margin
            if (topRelativeToRoot <= 0 && Math.abs(topRelativeToRoot) < minTop) {
                minTop = Math.abs(topRelativeToRoot);
                bestCandidateId = targetElement.id;
            }
            }
        }
      });

      if (bestCandidateId) {
        setActiveSection(bestCandidateId);
      } else {
         const anyIntersecting = entries.find(e => e.isIntersecting && sectionIds.includes((e.target as HTMLElement).id));
         if (anyIntersecting) {
             setActiveSection((anyIntersecting.target as HTMLElement).id);
         } 
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((section) => observer.observe(section));

    // Simplified Initial Check
    const checkInitialSection = () => {
      let currentActiveSection: string | null = null;
      let minTop = Infinity;

      sections.forEach(section => {
        if (sectionIds.includes(section.id)) {
            const rect = section.getBoundingClientRect();
            if (rect.top >= 0 && rect.top < window.innerHeight && rect.top < minTop) {
            minTop = rect.top;
            currentActiveSection = section.id;
            }
        }
      });

      const heroIsObserved = sections.some(s => s.id === 'hero');
      const heroElement = document.getElementById('hero');
      // Set active section, prioritizing 'hero' if visible or if nothing else is found
      setActiveSection(currentActiveSection || 
        (heroIsObserved && heroElement && heroElement.getBoundingClientRect().top >= 0 ? 'hero' : null));
    };

    const timeoutId = setTimeout(checkInitialSection, 100);

    return () => {
      clearTimeout(timeoutId);
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, [pathname, navItems]); // Add pathname and navItems to dependencies

  return (
    <>
      {/* Desktop Navigation - Centered, transforms on scroll */}
      <nav
        ref={navRef}
        className={cn(
          "hidden md:flex fixed left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ease-in-out",
          "items-center justify-center px-4 py-2 text-sm font-medium",
          "w-[85%] max-w-6xl", // Further increased max-width and width percentage
          isScrolling
            ? "top-4 bg-component-bg/80 dark:bg-component-bg-dark/80 border border-border/10 rounded-full shadow-lg backdrop-blur-lg"
            : "top-6 bg-transparent" // Initial state: transparent background
        )}
      >
        <div className="flex items-center gap-2"> {/* Increased gap */} 
          {navItems.map((item, index) => (
            <motion.a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavLinkClick(e, item.href)}
              className={cn(
                "relative px-3 py-1.5 rounded-full transition-colors duration-200 ease-in-out hover:text-foreground",
                // Adjust active logic: 
                // - On blog page, check href directly
                // - On projects page, check href directly
                // - On main page, check activeSection based on hash
                ((pathname === '/blog' && pathname === item.href) || 
                 (pathname === '/projects' && item.href === '/projects') ||
                 (activeSection === item.href.substring(1)))
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
              {
                // Adjust active pill logic for both blog and projects pages
                ((pathname === '/blog' && pathname === item.href) || 
                 (pathname === '/projects' && item.href === '/projects') ||
                 (activeSection === item.href.substring(1))) && (
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
          )).reduce((acc: React.ReactNode[], item, index) => {
            // Add elements to the accumulator
            acc.push(item);
            
            // Add divider after specific items
            if (navItems[index]?.divider) {
              acc.push(
                <div 
                  key={`divider-${index}`} 
                  className="h-5 w-px bg-border/40 mx-1 dark:bg-border/30"
                />
              );
            }
            
            return acc;
          }, [])}
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
                     // Adjust active logic for mobile
                    ((pathname === '/blog' && pathname === item.href) || 
                     (pathname === '/projects' && item.href === '/projects') ||
                     (activeSection === item.href.substring(1)))
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
