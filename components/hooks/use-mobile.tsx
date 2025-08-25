"use client"

import { useEffect, useState } from "react"

/**
 * Hook to detect if the user is on a mobile device
 * Based on window width breakpoint
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768) // Tailwind's md breakpoint
    }

    // Check on mount
    checkIsMobile()

    // Listen for window resize
    window.addEventListener("resize", checkIsMobile)

    return () => {
      window.removeEventListener("resize", checkIsMobile)
    }
  }, [])

  return isMobile
}