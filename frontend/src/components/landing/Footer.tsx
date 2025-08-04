import { motion } from "framer-motion";
import { Github } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    company: [
      { name: "About Us", href: "#about" },
      { name: "Services", href: "#services" },
      { name: "How it Works", href: "#how-it-works" },
    ],
    services: [
      { name: "Job Search", href: "#services" },
      { name: "Manage Applications", href: "#services" },
      { name: "Salary Insights", href: "#services" },
    ],
    support: [
      { name: "Help Center", href: "#help" },
      { name: "Contact Us", href: "#contact" },
      { name: "Privacy Policy", href: "#privacy" },
      { name: "Terms of Service", href: "#terms" },
    ],
  };

  return (
    <footer className="bg-brand-blue-dark text-white flex justify-around px-20 ">
      <div className="">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <h2 className="text-2xl font-bold mb-4">
                Job<span className="text-brand-blue-light">Quest</span>
              </h2>
              <p className="text-blue-200 mb-6 leading-relaxed">
                Empowering careers and connecting talent with opportunity. Your
                journey to professional success starts here.
              </p>
            </motion.div>

            {/* Company Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-blue-200 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Services Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold mb-4 text-white">Services</h4>
              <ul className="space-y-2">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-blue-200 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Support Links */}
          </div>
        </div>

        <hr className="bg-white/10" />

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="py-6 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4 text-sm text-blue-200"
        >
          <div>© 2025 Hive. All rights reserved.</div>
          <div>💙 Made by Shuriken</div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
