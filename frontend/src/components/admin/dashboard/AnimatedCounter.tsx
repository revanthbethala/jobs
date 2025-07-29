import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
}

const AnimatedCounter = ({ value, duration = 2 }: AnimatedCounterProps) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const animation = animate(count, value, { duration });
    return animation.stop;
  }, [count, value, duration]);

  return <motion.span>{rounded}</motion.span>;
};

export default AnimatedCounter;
