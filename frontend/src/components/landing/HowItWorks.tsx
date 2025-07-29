import { motion, Variants } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Navigate, NavLink } from "react-router-dom";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Create Your Profile",
      description:
        "Build a comprehensive profile showcasing your skills, experience, and career goals.",
      icon: "👤",
    },
    {
      number: "02",
      title: "Get Matched",
      description:
        "Our AI algorithm finds relevant job opportunities that align with your profile and preferences.",
      icon: "🔍",
    },
    {
      number: "03",
      title: "Apply & Interview",
      description:
        "Apply to matched positions and ace your interviews with our preparation tools.",
      icon: "📝",
    },
    {
      number: "04",
      title: "Land Your Dream Job",
      description:
        "Negotiate offers and start your new career journey with confidence and support.",
      icon: "🎉",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.2,
      },
    },
  };

  const stepVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-4 text-brand-blue-dark border-brand-blue-dark"
          >
            How It Works
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-gray-dark mb-6">
            Your Path to Career Success
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Follow our simple 4-step process to find and land your dream job
            with JobQuest.
          </p>
        </motion.div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            {/* Connection Line - positioned to align with step icons */}
            <div className="absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-blue-dark to-brand-blue-light z-0"></div>

            <div className="grid grid-cols-4 gap-8 relative z-10">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  variants={stepVariants}
                  className="text-center"
                >
                  <div className="relative">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-20 h-20 mx-auto bg-gradient-to-tr from-gray-300 to-white rounded-full flex items-center justify-center mb-6 shadow-lg"
                    >
                      <span className="text-2xl">{step.icon}</span>
                    </motion.div>
                    <Badge
                      variant="secondary"
                      className="absolute -top-2 -right-2 bg-white text-brand-blue-dark border-2 border-brand-blue-dark font-bold"
                    >
                      {step.number}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-brand-gray-dark mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                variants={stepVariants}
                className="flex items-start space-x-6"
              >
                <div className="flex-shrink-0">
                  <div className="relative">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-16 h-16 bg-gradient-to-br from-brand-blue-dark to-brand-blue-light rounded-full flex items-center justify-center shadow-lg"
                    >
                      <span className="text-xl">{step.icon}</span>
                    </motion.div>
                    <Badge
                      variant="secondary"
                      className="absolute -top-2 -right-2 bg-white text-brand-blue-dark border-2 border-brand-blue-dark font-bold text-xs"
                    >
                      {step.number}
                    </Badge>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-brand-gray-dark mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="mb-8" />
          <div className="text-center">
            <h3 className="text-2xl font-bold text-brand-gray-dark mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of professionals who have transformed their careers
              with JobQuest.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-brand-blue-dark to-brand-blue-light text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <NavLink to="/auth" >Start Your Journey</NavLink>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
