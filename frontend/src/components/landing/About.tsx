import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const About = () => {
  const values = [
    {
      title: "Innovation",
      description:
        "Cutting-edge technology to match candidates with perfect opportunities.",
      icon: "💡",
    },
    {
      title: "Trust",
      description:
        "Building reliable connections between job seekers and employers.",
      icon: "🤝",
    },
    {
      title: "Excellence",
      description:
        "Committed to delivering exceptional results for all our users.",
      icon: "⭐",
    },
    {
      title: "Growth",
      description:
        "Empowering career development and professional advancement.",
      icon: "📈",
    },
  ];

  const containerVariants:Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants:Variants= {
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
    <section id="about" className="py-20 bg-white">
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
            About JobQuest
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-gray-dark mb-6">
            Revolutionizing Job Search
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            At JobQuest, we believe that finding the right job should be an
            exciting journey, not a frustrating process. Our mission is to
            connect talented professionals with innovative companies through
            intelligent matching and personalized experiences.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {values.map((value, index) => (
            <motion.div key={value.title} variants={cardVariants}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-gray-200">
                <CardHeader className="text-center pb-4">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <CardTitle className="text-xl font-bold text-brand-gray-dark">
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default About;
