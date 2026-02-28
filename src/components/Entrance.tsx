import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const title = "SI.BERIANA";
const subtitle = "LIVING GALLERY";

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.6,
      ease: "easeOut" as const
    }
  })
};

const subtitleVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: title.length * 0.12 + 0.5,
      duration: 1.2
    }
  }
};

export default function Entrance() {
  return (
    <section className="h-screen flex flex-col items-center justify-center gap-[clamp(0.8rem,2vw,1.5rem)] px-4 box-border">
      <div className="flex items-baseline flex-nowrap justify-center max-w-full">
        {title.split('').map((char, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            className="inline-block"
            style={{
              fontSize: 'clamp(2rem, 10vw, 9rem)',
              fontWeight: 200,
              letterSpacing: 'clamp(0.01em, 0.08em, 0.08em)',
              color: char === '.' ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
            }}
          >
            {char}
          </motion.span>
        ))}
      </div>
      <Link to="/gallery" className="no-underline">
        <motion.p
          variants={subtitleVariants}
          initial="hidden"
          animate="visible"
          className="m-0 text-center cursor-pointer transition-colors duration-300"
          style={{
            fontSize: 'clamp(0.55rem, 1.5vw, 1.1rem)',
            letterSpacing: 'clamp(0.2em, 0.45em, 0.45em)',
            fontWeight: 300,
            color: 'hsl(var(--gallery-text-dim))',
          }}
          whileHover={{ color: 'hsl(340, 82%, 56%)' }}
        >
          {subtitle}
        </motion.p>
      </Link>
    </section>
  );
}
