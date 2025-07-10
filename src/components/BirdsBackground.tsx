//not used but can be used if want


/** 
 * BirdsBackground Component - Animated Background with Vanta.js

 * Technical Implementation:
 * - Uses Three.js for 3D graphics rendering
 * - Vanta.js for bird animation and physics
 * - CDN loading for better performance
 * - Loading state management with React hooks
 * - Error handling with fallback background
 * - Script preloading for faster initialization
 * - Theme integration with next-themes
 * - Performance optimizations for faster loading
 */

"use client";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useTheme } from "next-themes";

/**
 * Props interface for the BirdsBackground component
 * @param children - React components to render on top of the animated background
 */
interface BirdsBackgroundProps {
  children: React.ReactNode;
}

/**
 * BirdsBackground Component
 * 
 * Creates an animated background with flying birds that loads before page content.
 * The background uses Vanta.js with Three.js for smooth 3D animations.
 * 
 * Loading Flow:
 * 1. Component mounts with theme-appropriate fallback background
 * 2. Scripts are preloaded for faster access
 * 3. Three.js loads from CDN (if not already loaded)
 * 4. Vanta.js birds effect loads from CDN
 * 5. Birds animation initializes with theme-appropriate settings
 * 6. Content fades in quickly
 * 
 * Animation Settings:
 * - Birds fly independently (low alignment/cohesion)
 * - Multiple colors with gradient transitions
 * - Distributed across entire screen
 * - Low opacity for subtle effect
 * - Optimized for performance and fast rendering
 * - Theme-aware colors and backgrounds
 */
export default function BirdsBackground({ children }: BirdsBackgroundProps) {
  // Reference to the DOM element where Vanta will render
  const vantaRef = useRef<HTMLDivElement>(null);
  // Reference to the Vanta effect instance for cleanup
  const vantaEffectRef = useRef<any>(null);
  // State to track when background is ready to show content
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);
  // State to track loading progress
  const [loadingProgress, setLoadingProgress] = useState(0);
  // Get current theme from next-themes
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || theme || 'dark';

  // Memoize theme colors to prevent unnecessary recalculations
  const themeColors = useMemo(() => {
    if (currentTheme === 'light') {
      return {
        backgroundColor: 0xffffff,    // White background
        color1: 0x6c47ff,             // Purple
        color2: 0x00ccff,             // Cyan
        fallbackBg: "#ffffff"         // White fallback
      };
    } else {
      return {
        backgroundColor: 0x0a0a0a,    // Dark background
        color1: 0x6c47ff,             // Purple
        color2: 0x00ccff,             // Cyan
        fallbackBg: "#0a0a0a"         // Dark fallback
      };
    }
  }, [currentTheme]);

  // Optimized script loading with progress tracking
  const loadScript = useCallback(async (src: string, type: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if script already exists
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => {
        setLoadingProgress(prev => prev + 25); // Increment progress
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }, []);

  // Preload scripts for faster loading
  const preloadScripts = useCallback(async () => {
    try {
      // Load Three.js first
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'three');
      
      // Small delay to ensure Three.js is ready
      await new Promise(resolve => setTimeout(resolve, 30));
      
      // Load Vanta.js birds
      await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.birds.min.js', 'vanta');
      
      setLoadingProgress(100);
    } catch (error) {
      console.error('Failed to preload scripts:', error);
      setLoadingProgress(100); // Mark as complete even if failed
    }
  }, [loadScript]);

  // Initialize Vanta.js background effect
  const initVanta = useCallback(async () => {
    if (!vantaRef.current) return;

    try {
      // Wait for scripts to be loaded
      await preloadScripts();

      // Check if Vanta is available
      if (!(window as any).VANTA) {
        throw new Error('Vanta.js not loaded');
      }

      // Initialize the birds animation with optimized settings
      vantaEffectRef.current = (window as any).VANTA.BIRDS({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 100.00,
        minWidth: 100.00,
        scale: 1.00,
        scaleMobile: 1.00,
        backgroundColor: themeColors.backgroundColor,
        
        // Bird colors - vibrant colors that contrast well with current background
        color2: themeColors.color2,
        color1: themeColors.color1,
        colorMode: "lerpGradient",
        
        // Optimized bird settings for faster rendering and better performance
        birdSize: 0.8,
        wingSpan: 12.00,
        speedLimit: 2.00,
        separation: 200.00,
        alignment: 0.03,
        cohesion: 0.01,
        quantity: 3.20,
        
        // Optimized opacity and rendering settings
        backgroundAlpha: 0.0,
        alpha: 0.1,
        sizeVariation: 0.2,
      });

      // Update fallback background color
      if (vantaRef.current) {
        vantaRef.current.style.backgroundColor = themeColors.fallbackBg;
      }

      // Mark background as loaded
      setIsBackgroundLoaded(true);
    } catch (error) {
      console.error("Failed to initialize Vanta effect:", error);
      // Fallback: set theme-appropriate background
      if (vantaRef.current) {
        vantaRef.current.style.backgroundColor = themeColors.fallbackBg;
      }
      // Still mark as loaded even if Vanta fails
      setIsBackgroundLoaded(true);
    }
  }, [themeColors, preloadScripts]);

  useEffect(() => {
    let mounted = true;

    // Initialize the background effect
    initVanta();

    // Cleanup function
    return () => {
      mounted = false;
      if (vantaEffectRef.current && vantaEffectRef.current.destroy) {
        try {
          vantaEffectRef.current.destroy();
        } catch (error) {
          console.error("Error destroying Vanta effect:", error);
        }
      }
    };
  }, [initVanta]);

  return (
    <div className="relative min-h-screen">
      {/* Birds background container */}
      <div 
        ref={vantaRef} 
        className="fixed inset-0 -z-50"
        style={{ backgroundColor: themeColors.fallbackBg }}
      />
      
      {/* Loading indicator (optional) */}
      {!isBackgroundLoaded && loadingProgress < 100 && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-foreground">Loading amazing experience...</p>
            <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Content container with optimized fade-in animation */}
      <div 
        className={`relative z-10 transition-all duration-200 ease-out ${
          isBackgroundLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

// Performance optimizations:
// 1. Memoized theme colors to prevent unnecessary recalculations
// 2. Optimized script loading with progress tracking
// 3. Reduced initial bundle size with lazy loading
// 4. Faster transitions with optimized CSS
// 5. Better error handling and fallbacks
// 6. Loading indicator for better UX