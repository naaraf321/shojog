import { UnauthenticatedLayout } from "@/components/layout/UnauthenticatedLayout";
import { HeroSection } from "@/components/landing/HeroSection";
import { BentoGridSection } from "@/components/landing/BentoGridSection";
import { AcademicLevelSection } from "@/components/landing/AcademicLevelSection";
import { CoursesSection } from "@/components/landing/CoursesSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";

export default function Home() {
  return (
    <UnauthenticatedLayout>
      <HeroSection />
      <BentoGridSection />
      <AcademicLevelSection />
      <CoursesSection />
      <TestimonialsSection />
    </UnauthenticatedLayout>
  );
}
