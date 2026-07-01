"use client"

import { useEffect, useRef, useState } from "react"
import { useInView, useMotionValue, useSpring } from "framer-motion"

interface CounterProps {
  value: number
  duration?: number
  format?: (value: number) => string
  className?: string
}

export function Counter({
  value,
  duration = 2,
  format = (v) => v.toLocaleString(),
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })
  const [displayValue, setDisplayValue] = useState(format(0))

  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  })

  useEffect(() => {
    if (inView) {
      motionValue.set(value)
    }
  }, [inView, motionValue, value])

  useEffect(() => {
    return springValue.on("change", (latest) => {
      setDisplayValue(format(Math.floor(latest)))
    })
  }, [springValue, format])

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  )
}
