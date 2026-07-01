"use client"

import { motion } from "framer-motion"

interface FadeUpProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
}

export function FadeUp({
  children,
  className,
  delay = 0,
  duration = 0.5,
}: FadeUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({
  children,
  className,
  delayChildren = 0,
  staggerChildren = 0.1,
}: {
  children: React.ReactNode
  className?: string
  delayChildren?: number
  staggerChildren?: number
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerChildren,
            delayChildren: delayChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { ease: [0.21, 0.47, 0.32, 0.98], duration: 0.5 },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
