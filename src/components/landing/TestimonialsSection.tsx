"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Tanvir Ahmed",
    role: "HSC Candidate",
    institution: "Dhaka College",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    quote: "ShudhuMCQ has been instrumental in my HSC preparation. The practice tests are accurate and helped me improve my weak areas.",
  },
  {
    id: 2,
    name: "Nusrat Jahan",
    role: "University Student",
    institution: "BUET",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    quote: "The doubt forum is amazing! I get quick answers to all my questions, and the community is very supportive.",
  },
  {
    id: 3,
    name: "Mohammad Rahman",
    role: "Medical Student",
    institution: "Dhaka Medical College",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    quote: "I used ShudhuMCQ for my medical admission test preparation. The question bank is extensive and covers all important topics.",
  },
  {
    id: 4,
    name: "Ayesha Khan",
    role: "SSC Student",
    institution: "Viqarunnisa Noon School",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    quote: "The gamification elements make studying fun! I love earning points and competing with my friends on the leaderboard.",
  },
];

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const next = () => {
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prev = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      next();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay]);

  return (
    <section className="w-full py-20 bg-gradient-to-b from-background/60 to-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">What Our Students Say</h2>
          <div className="h-1 w-20 bg-primary my-4"></div>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">Join thousands of satisfied students who have improved their exam scores using ShudhuMCQ</p>
        </div>

        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-xl bg-background/50 backdrop-blur-sm p-6 shadow-lg" onMouseEnter={() => setAutoplay(false)} onMouseLeave={() => setAutoplay(true)}>
          <div className="absolute top-4 left-4 z-10">
            <Quote className="h-10 w-10 text-primary opacity-40" />
          </div>

          <div className="relative h-[400px] overflow-hidden">
            <AnimatePresence mode="wait">
              {testimonials.map(
                (testimonial, index) =>
                  index === current && (
                    <motion.div key={testimonial.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-10">
                      <div className="relative mb-6 h-24 w-24 overflow-hidden rounded-full border-4 border-primary/20">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 96px"
                          onError={(e) => {
                            e.currentTarget.src = "https://randomuser.me/api/portraits/lego/1.jpg";
                          }}
                        />
                      </div>
                      <blockquote className="mb-6 text-lg md:text-xl text-foreground italic">&ldquo;{testimonial.quote}&rdquo;</blockquote>
                      <div className="text-center">
                        <h3 className="font-semibold text-foreground">{testimonial.name}</h3>
                        <p className="text-muted-foreground">
                          {testimonial.role} • {testimonial.institution}
                        </p>
                      </div>
                    </motion.div>
                  )
              )}
            </AnimatePresence>
          </div>

          <div className="absolute inset-0 flex items-center justify-between px-4">
            <button onClick={prev} className="rounded-full bg-background/80 p-2 text-foreground shadow-lg backdrop-blur-sm transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary" aria-label="Previous testimonial">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button onClick={next} className="rounded-full bg-background/80 p-2 text-foreground shadow-lg backdrop-blur-sm transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary" aria-label="Next testimonial">
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          <div className="absolute bottom-4 left-0 right-0">
            <div className="flex justify-center space-x-2">
              {testimonials.map((_, index) => (
                <button key={index} onClick={() => setCurrent(index)} className={cn("h-2 w-2 rounded-full transition-all", current === index ? "bg-primary w-6" : "bg-primary/30 hover:bg-primary/60")} aria-label={`Go to testimonial ${index + 1}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
