import Navbar from "../components/Landing/Navbar";
import Hero from "../components/Landing/Hero";
import Stats from "../components/Landing/Stats";
import Features from "../components/Landing/Features";
import HowItWorks from "../components/Landing/HowItWorks";
import AnalyticsPreview from "../components/Landing/AnalyticsPreview";
import Testimonials from "../components/Landing/Testimonials";
import CTA from "../components/Landing/CTA";
import Footer from "../components/Landing/Footer";

export default function LandingPage() {
  return (
    <div className="bg-white overflow-x-hidden">
      <Navbar />

      <Hero />

      <Stats />

      <Features />

      <HowItWorks />

      <AnalyticsPreview />

      <Testimonials />

      <CTA />

      <Footer />
    </div>
  );
}