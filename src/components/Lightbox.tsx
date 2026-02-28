import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface LightboxProps {
  src: string;
  onClose: () => void;
}

export default function Lightbox({ src, onClose }: LightboxProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      className="fixed inset-0 flex items-center justify-center z-[1000] cursor-pointer"
      style={{ background: 'hsl(var(--gallery-overlay))' }}
    >
      <motion.img
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        src={src}
        alt="Expanded work"
        onClick={(e) => e.stopPropagation()}
        className="cursor-default"
        style={{
          maxWidth: '85vw',
          maxHeight: '85vh',
          objectFit: 'contain',
          borderRadius: 6,
          boxShadow: '0 20px 80px rgba(0,0,0,0.8)',
        }}
      />
      <div
        className="absolute top-8 right-8 z-[1001] cursor-pointer leading-none"
        style={{
          color: 'hsl(var(--gallery-text-dim))',
          fontSize: '1.5rem',
          fontWeight: 200,
        }}
        onClick={onClose}
      >
        ✕
      </div>
    </motion.div>
  );
}
