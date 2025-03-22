"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Users, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Sample course data (in a real app, this would come from an API)
const ongoingCourses = [
  {
    id: "course-1",
    title: "HSC Physics: Advanced Mechanics",
    image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    instructor: "Dr. Rahman Ahmed",
    students: 1245,
    rating: 4.8,
    duration: "8 weeks",
    price: "৳3,500",
    institution: "Ideal College",
  },
  {
    id: "course-2",
    title: "HSC Chemistry: Organic Chemistry Mastery",
    image: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    instructor: "Nasrin Akter",
    students: 987,
    rating: 4.7,
    duration: "10 weeks",
    price: "৳4,200",
    institution: "Notre Dame College",
  },
  {
    id: "course-3",
    title: "SSC Mathematics: Complete Overview",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    instructor: "Fahim Hossain",
    students: 1568,
    rating: 4.9,
    duration: "12 weeks",
    price: "৳2,800",
    institution: "Govt. Laboratory High School",
  },
  {
    id: "course-4",
    title: "Medical Admission Test Preparation",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    instructor: "Dr. Sabrina Khan",
    students: 2145,
    rating: 4.9,
    duration: "16 weeks",
    price: "৳8,500",
    institution: "Dhaka Medical College",
  },
];

const upcomingCourses = [
  {
    id: "upcoming-1",
    title: "University Admission: English Literature",
    image: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    instructor: "Prof. Tahmina Islam",
    startDate: "May 15, 2023",
    duration: "6 weeks",
    price: "৳3,200",
    institution: "Dhaka University",
  },
  {
    id: "upcoming-2",
    title: "Engineering Admission: Mathematics & Physics",
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    instructor: "Eng. Kamal Hasan",
    startDate: "June 1, 2023",
    duration: "12 weeks",
    price: "৳7,500",
    institution: "BUET",
  },
  {
    id: "upcoming-3",
    title: "BCS Preliminary Test Preparation",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    instructor: "Ashraf Uddin",
    startDate: "June 20, 2023",
    duration: "10 weeks",
    price: "৳5,800",
    institution: "Bangladesh Civil Service",
  },
];

// Course card component
const CourseCard = ({ course, type }: { course: any; type: "ongoing" | "upcoming" }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="group rounded-lg overflow-hidden border border-border bg-card hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10" />
        <div className="absolute top-2 right-2 z-20 bg-primary/90 text-white text-xs px-2 py-1 rounded">{type === "ongoing" ? "Ongoing" : "Upcoming"}</div>
        {course.image ? (
          <Image
            src={course.image}
            alt={course.title}
            width={400}
            height={200}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized // This is for placeholder images - remove in production with real images
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No image available</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent text-white p-4 z-10">
          <h3 className="font-semibold text-lg">{course.title}</h3>
          <p className="text-sm text-white/80">{course.institution}</p>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-2">
              {course.instructor.split(" ")[0][0]}
              {course.instructor.split(" ")[1]?.[0]}
            </div>
            <span className="text-sm font-medium">{course.instructor}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {type === "ongoing" ? (
              <div className="flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1" />
                {course.duration}
              </div>
            ) : (
              <div>Starts: {course.startDate}</div>
            )}
          </div>
        </div>

        {type === "ongoing" && (
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-3.5 w-3.5 mr-1" />
              {course.students} students
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Star className="h-3.5 w-3.5 mr-1 text-yellow-500" />
              {course.rating}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-3 border-t border-border">
          <div className="font-semibold">{course.price}</div>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
            View details
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export function CoursesSection() {
  const [currentPage, setCurrentPage] = useState(0);
  const coursesPerPage = 3;
  const totalPages = Math.ceil(ongoingCourses.length / coursesPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const visibleOngoingCourses = ongoingCourses.slice(currentPage * coursesPerPage, (currentPage + 1) * coursesPerPage);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <motion.h2 initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-3xl font-bold tracking-tight">
            Explore Our Courses
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn from expert instructors and prepare for your exams with our comprehensive course offerings
          </motion.p>
        </div>

        <Tabs defaultValue="ongoing" className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="grid w-[320px] grid-cols-2">
              <TabsTrigger value="ongoing">Ongoing Courses</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming Courses</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="ongoing" className="space-y-6">
            <motion.div variants={containerVariants} initial="hidden" whileInView="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleOngoingCourses.map((course) => (
                <CourseCard key={course.id} course={course} type="ongoing" />
              ))}
            </motion.div>

            <div className="flex justify-between items-center mt-8">
              <div className="text-sm text-muted-foreground">
                Showing {currentPage * coursesPerPage + 1}-{Math.min((currentPage + 1) * coursesPerPage, ongoingCourses.length)} of {ongoingCourses.length} courses
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={prevPage} disabled={currentPage === 0} className={cn("rounded-full", currentPage === 0 && "opacity-50 cursor-not-allowed")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextPage} disabled={currentPage === totalPages - 1} className={cn("rounded-full", currentPage === totalPages - 1 && "opacity-50 cursor-not-allowed")}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-6">
            <motion.div variants={containerVariants} initial="hidden" whileInView="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingCourses.map((course) => (
                <CourseCard key={course.id} course={course} type="upcoming" />
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center">
          <Button size="lg" className="animate-pulse">
            View All Courses
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
