import { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, User, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, logOut } = useAuthStore();
  const setCurrentStep = useAuthStore((state) => state.setCurrentStep);
  const MotionNavLink = motion(NavLink);

  const [showDropdown, setShowDropdown] = useState(false);
  const heroHeight = 600;
  const handleSignupClick = () => {
    setCurrentStep("signup");
    navigate("/auth");
  };
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > heroHeight) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const navItems = [
    { name: "Home", href: !isLoggedIn ? "#home" : "/" },
    { name: "Dashboard", href: "#about" },
    { name: "Jobs", href: "#services" },
  ];

  const menuVariants: Variants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const itemVariants: Variants = {
    closed: { opacity: 0, y: -10 },
    open: { opacity: 1, y: 0 },
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300 ${
        isScrolled
          ? "bg-white border-gray-300"
          : "bg-gray-900/30 backdrop-blur-md border-gray-200/20"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <h1
              className={`text-2xl font-bold ${
                isScrolled ? "text-gray-900" : "text-white"
              }`}
            >
              Skill
              <span
                className={`${
                  isScrolled
                    ? "text-brand-blue-light" // or adjust if you want a different shade
                    : "text-brand-blue-light"
                }`}
              >
                ora
              </span>
            </h1>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item, index) => (
              <MotionNavLink
                key={item.name}
                to={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={` ${
                  isScrolled
                    ? "text-gray-900 hover:text-brand-blue-light"
                    : "text-white hover:text-brand-blue-light"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.name}
              </MotionNavLink>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          {!isLoggedIn ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="hidden md:flex items-center gap-5"
            >
              <Button
                variant={isScrolled ? "ghost" : "ghost"}
                className={`hover:bg-white/10 ${
                  isScrolled
                    ? "text-gray-900 hover:text-brand-blue-light"
                    : "text-white hover:text-brand-blue-light"
                }`}
              >
                <NavLink to="/auth">Sign In</NavLink>
              </Button>
              <Button
                onClick={handleSignupClick}
                className={`${
                  isScrolled
                    ? "bg-brand-blue-light hover:bg-blue-600 text-white"
                    : "bg-brand-blue-light hover:bg-blue-600 text-white"
                }`}
              >
                Sign Up
              </Button>
            </motion.div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              >
                <User className="w-6 h-6" />
              </button>
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute right-0 mt-2 w-40 rounded-md shadow-lg z-50 ${
                      isScrolled ? "bg-white" : "bg-gray-800"
                    }`}
                  >
                    <div className="py-1">
                      <button
                        onClick={() => navigate("/profile")}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          isScrolled
                            ? "text-gray-900 hover:bg-gray-100"
                            : "text-white hover:bg-gray-700"
                        }`}
                      >
                        Profile
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            className={`w-full text-left px-4 py-2 text-sm ${
                              isScrolled
                                ? "text-gray-900 hover:bg-gray-100"
                                : "text-white hover:bg-gray-700"
                            }`}
                          >
                            Logout
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              You will be logged out from your account.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={() => setShowDropdown(false)}
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                logOut();
                                setShowDropdown(false);
                                navigate("/");
                              }}
                            >
                              Logout
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Mobile Menu Button */}
          <motion.button
            className={`md:hidden p-2  ${
              isScrolled ? "text-black" : "text-white"
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle menu"
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className={`md:hidden overflow-hidden ${
                isScrolled ? "bg-white" : "bg-gray-900/30 backdrop-blur-md"
              }`}
            >
              <div className="py-4 space-y-4 px-4">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                    transition={{ delay: index * 0.1 }}
                    className={`block font-medium transition-colors duration-200 ${
                      isScrolled
                        ? "text-gray-900 hover:text-brand-blue-light"
                        : "text-white/90 hover:text-white"
                    }`}
                    // onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </motion.a>
                ))}
                <div className="pt-4  flex gap-3 items-center">
                  <Button
                    variant="ghost"
                    className={`w-full hover:bg-white/10 ${
                      isScrolled
                        ? "text-gray-900 hover:text-brand-blue-light hover:bg-slate-200/10 hover:border hover:border-gray-200"
                        : "text-white hover:text-brand-blue-light"
                    }`}
                  >
                    <NavLink to="/auth">Sign In</NavLink>
                  </Button>
                  <Button
                    onClick={handleSignupClick}
                    className={`w-full text-white ${
                      isScrolled
                        ? "bg-brand-blue-light hover:bg-blue-600"
                        : "bg-brand-blue-light hover:bg-blue-600"
                    }`}
                  >
                    Sign Up
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
