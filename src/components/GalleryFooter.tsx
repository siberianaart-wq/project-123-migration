import { motion } from 'framer-motion';

export default function GalleryFooter() {
  return (
    <footer className="flex flex-col items-center gap-6 py-16 px-12">
      <motion.a
        href="https://www.instagram.com/si.beriana/"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="no-underline transition-colors duration-300"
        style={{
          fontSize: 'clamp(0.7rem, 1.2vw, 1rem)',
          letterSpacing: '0.5em',
          fontWeight: 300,
          color: 'hsl(var(--gallery-text-dim))',
        }}
        whileHover={{ color: 'hsl(340, 82%, 56%)' }}
      >
        INSTAGRAM
      </motion.a>
      <motion.a
        href="mailto:siberiana.art@gmail.com"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        viewport={{ once: true }}
        className="no-underline transition-colors duration-300"
        style={{
          fontSize: 'clamp(0.7rem, 1.2vw, 1rem)',
          letterSpacing: '0.3em',
          fontWeight: 300,
          color: 'hsl(var(--gallery-text-faint))',
        }}
        whileHover={{ color: 'hsl(340, 82%, 56%)' }}
      >
        siberiana.art@gmail.com
      </motion.a>
    </footer>
  );
}
