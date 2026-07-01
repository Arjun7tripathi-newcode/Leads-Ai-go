import { Navbar } from "@/components/sections/navbar"
import { HeroSection } from "@/components/sections/hero-section"
import { TrustedBy } from "@/components/sections/trusted-by"
import { ProblemSection } from "@/components/sections/problem-section"
import { SolutionSection } from "@/components/sections/solution-section"
import { FeatureShowcase } from "@/components/sections/features"
import { HowItWorks } from "@/components/sections/how-it-works"
import { ProductDemo } from "@/components/sections/product-demo"
import { BenefitsSection } from "@/components/sections/benefits-section"
import { Statistics } from "@/components/sections/statistics"
import { Testimonials } from "@/components/sections/testimonials"
import { Pricing } from "@/components/sections/pricing"
import { FAQ } from "@/components/sections/faq"
import { CTASection } from "@/components/sections/cta-section"
import { Footer } from "@/components/sections/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <TrustedBy />
      <ProblemSection />
      <SolutionSection />
      <FeatureShowcase />
      <HowItWorks />
      <ProductDemo />
      <BenefitsSection />
      <Statistics />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTASection />
      <Footer />
    </main>
  )
}
