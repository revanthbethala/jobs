import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Services = () => {
  const services = [
    {
      title: "Browse Verified Jobs",
      description:
        "Explore a wide range of verified job listings from trusted companies across various domains.",
      features: [
        "Real-time Job Listings",
        "Verified Employers",
        "Filter by Role, Location, and More",
      ],
      icon: "🔍",
    },
    {
      title: "Easy Job Applications",
      description:
        "Apply to jobs in just a few clicks using your profile details and uploaded resume.",
      features: [
        "Quick Apply",
        "Track Application Status",
        "Email Notifications",
      ],
      icon: "📨",
    },
    {
      title: "Candidate Dashboard",
      description:
        "Manage your applications, update your profile, and keep track of your job search progress.",
      features: ["Application History", "Profile Management", "Saved Jobs"],
      icon: "📊",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
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
    <section id="services" className="py-20 bg-white">
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
            Our Services
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-gray-dark mb-6">
            Everything You Need for Career Success
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive tools and services designed to accelerate your job
            search and career growth.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => (
            <motion.div key={service.title} variants={cardVariants}>
              <Card
                className="h-full bg-white border border-gray-400  rounded-lg shadow-sm transition-all duration-300 group
             hover:shadow-xl  hover:border-brand-blue-light hover:bg-gray-50"
              >
                <CardHeader className="pb-4">
                  <div
                    className="text-4xl mb-4 transition-transform duration-300 ease-out"
                    aria-hidden
                  >
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-brand-gray-dark mb-2 group-hover:text-brand-blue-dark transition-colors duration-300">
                    {service.title}
                  </CardTitle>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.1 + featureIndex * 0.1,
                        }}
                        viewport={{ once: true }}
                        className="flex items-center space-x-2"
                      >
                        <div className="w-2 h-2 bg-brand-blue-light rounded-full"></div>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
