import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };
  const navigate = useNavigate();
  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
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
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-blue-dark via-blue-800 to-brand-blue-light overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Find Your Dream Job with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-100">
              Hive
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Connect with top employers, discover exciting opportunities, and
            take the next step in your career journey with our innovative job
            matching platform.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              className="bg-white text-brand-blue-dark hover:bg-gray-100 font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => navigate("/auth")}
            >
              Start Your Search
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
    </section>
  );
};

export default Hero;
