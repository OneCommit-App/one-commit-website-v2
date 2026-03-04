"use client"

import { motion } from "framer-motion"

const schools = [
  "MIT", "Stanford", "Williams", "Amherst", "Bowdoin", "Pomona",
  "Middlebury", "Tufts", "NYU", "Emory", "Johns Hopkins", "Carnegie Mellon",
  "Haverford", "Colby", "Bates", "Wesleyan", "Swarthmore", "Carleton",
  "Grinnell", "Oberlin", "Macalester", "Kenyon", "Whitman", "Colorado College",
  "Claremont McKenna", "Davidson", "Hamilton", "Vassar", "Bucknell", "Lehigh",
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}

export default function SchoolMarquee() {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="pb-10 flex flex-col items-center overflow-hidden"
    >
      <span className="text-white/30 text-xs uppercase tracking-widest mb-4">
        Colleges matching our athletes
      </span>
      <div className="relative w-full max-w-5xl">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0f1a14] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0f1a14] to-transparent z-10 pointer-events-none" />

        <div className="flex gap-3 animate-marquee">
          {[...schools, ...schools].map((name, i) => (
            <span
              key={i}
              className="text-white/40 text-xs font-medium px-3 py-1.5 border border-white/[0.08] rounded-full whitespace-nowrap flex-shrink-0"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
