"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export const HeroSection = () => {
  const [imageError, setImageError] = useState(false);

  return (
    <section className="relative overflow-hidden py-20 md:py-28 px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90 z-0" />

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] z-0" />

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                Master MCQs with <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">ShudhuMCQ</span>
              </h1>
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }} className="text-lg md:text-xl text-muted-foreground max-w-[600px]">
              Elevate your exam preparation with personalized practice, mock exams, and detailed performance analysis. Join thousands of students excelling in their academic journey.
            </motion.p>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }} className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>

              <Button size="lg" variant="outline" asChild>
                <Link href="/question-bank">Explore Questions</Link>
              </Button>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.6 }} className="flex items-center space-x-4 text-sm text-muted-foreground pt-4">
              <div className="flex -space-x-2">
                {["https://randomuser.me/api/portraits/women/44.jpg", "https://randomuser.me/api/portraits/men/86.jpg", "https://randomuser.me/api/portraits/women/63.jpg", "https://randomuser.me/api/portraits/men/29.jpg"].map((avatar, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background overflow-hidden">
                    <Image src={avatar} alt={`User avatar ${i + 1}`} width={32} height={32} className="object-cover w-full h-full" />
                  </div>
                ))}
              </div>
              <p>
                Join <span className="font-medium text-foreground">10,000+</span> students already using ShudhuMCQ
              </p>
            </motion.div>
          </motion.div>

          {/* Image/Illustration */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.7 }} className="relative w-full h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-indigo-600/20 rounded-xl z-0" />
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              {!imageError ? (
                <Image src="https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80" alt="Students using ShudhuMCQ platform" fill className="object-cover" priority onError={() => setImageError(true)} />
              ) : (
                <div className="flex items-center justify-center h-full p-8 text-center">
                  <p className="text-muted-foreground">
                    Image could not be loaded.
                    <br />
                    <code className="block mt-2 p-2 bg-muted rounded">Please check your internet connection</code>
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
