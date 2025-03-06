"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Zap, Brain, FileText } from "lucide-react"
import { motion } from "framer-motion"
import spiderAnimation from "@/public/spider.json"
import Lottie from "lottie-react"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="text-white py-24 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div 
              className="absolute inset-0 bg-repeat" 
              style={{ 
                backgroundImage: 'url(/spider-web.jpg)',
                backgroundSize: '400px',
                opacity: 0.85
              }}
            ></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-500 to-transparent"></div>
          </div>
          
          {/* Spider Animation */}
          <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 opacity-70 pointer-events-none">
            <Lottie animationData={spiderAnimation} loop={false} />
          </div>
          
          <motion.div 
            className="container mx-auto px-4 relative z-10"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.7 }}
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6 gradient-text"
              variants={fadeIn}
            >
              WordWeaver
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 max-w-2xl mx-auto text-gray-300"
              variants={fadeIn}
              transition={{ delay: 0.2 }}
            >
              Create high-quality, engaging content in minutes with the power of advanced AI technology
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeIn}
              transition={{ delay: 0.4 }}
            >
              <Link href="/register">
                <Button size="lg" className="font-medium bg-white text-black hover:bg-gray-200 transition-colors">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="font-medium border-white text-white hover:bg-white/10 transition-colors relative z-10 bg-black/30">
                  View Pricing
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-4 text-center gradient-text">Key Features</h2>
              <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                Our platform combines cutting-edge AI with intuitive tools to streamline your content creation process
              </p>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {[
                {
                  icon: Brain,
                  title: "AI-Powered Research",
                  description: "Gather information from various sources with our intelligent AI assistant to build a solid foundation for your content"
                },
                {
                  icon: FileText,
                  title: "Smart Outlines",
                  description: "Generate and customize content outlines effortlessly, ensuring your content has a logical structure and flow"
                },
                {
                  icon: Zap,
                  title: "Content Generation",
                  description: "Create engaging, SEO-friendly content based on your outlines and research with just a few clicks"
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 gradient-border"
                  variants={fadeIn}
                >
                  <div className="mb-4 text-black">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 gradient-bg-animate text-white">
          <div className="container mx-auto px-4">
            <motion.h2 
              className="text-3xl font-bold mb-12 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Why Choose Us
            </motion.h2>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {[
                "Save hours of research and writing time",
                "Generate content that ranks well in search engines",
                "Maintain a consistent publishing schedule",
                "Scale your content production effortlessly",
                "Customize content to match your brand voice",
                "Access advanced AI models for superior quality"
              ].map((benefit, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-start space-x-3"
                  variants={fadeIn}
                >
                  <CheckCircle className="h-6 w-6 text-white flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300">{benefit}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-white py-20">
          <motion.div 
            className="container mx-auto px-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold mb-4 gradient-text">Ready to supercharge your content?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-600">
              Join thousands of content creators who are already saving time and producing better content
            </p>
            <Link href="/register">
              <Button size="lg" className="font-medium gradient-bg-animate text-white hover:opacity-90 transition-opacity">
                Get Started Today
              </Button>
            </Link>
          </motion.div>
        </section>
      </main>

      <footer className="gradient-bg-animate text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 WordWeaver. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

