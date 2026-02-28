import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { galleryImages } from '@/lib/galleryImages';
import Lightbox from './Lightbox';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return isMobile;
}

function OrbitGallery({ onOpen }: { onOpen: (i: number) => void }) {
  const count = galleryImages.length;
  const [active, setActive] = useState(0);
  const progressRef = useRef(0);
  const pauseRef = useRef(false);

  useEffect(() => {
    let animFrame: number;
    let lastTime = performance.now();
    const interval = 3500;

    const animate = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;
      if (!pauseRef.current) {
        progressRef.current += delta;
        if (progressRef.current >= interval) {
          progressRef.current = 0;
          setActive((a) => (a + 1) % count);
        }
      }
      animFrame = requestAnimationFrame(animate);
    };

    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [count]);

  const getOffset = (index: number) => {
    let diff = index - active;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    return diff;
  };

  const goTo = (i: number) => {
    setActive(i);
    progressRef.current = 0;
  };

  return (
    <div
      className="absolute left-0 right-0 overflow-hidden"
      style={{ top: '8%', bottom: 0, perspective: '1200px' }}
      onMouseEnter={() => { pauseRef.current = true; }}
      onMouseLeave={() => { pauseRef.current = false; progressRef.current = 0; }}
    >
      {galleryImages.map((src, i) => {
        const offset = getOffset(i);
        const absOff = Math.abs(offset);
        if (absOff > 2) return null;

        const translateX = offset * 52;
        const translateZ = -absOff * 200;
        const rotateY = offset * -22;
        const scale = 1 - absOff * 0.18;
        const opacity = 1 - absOff * 0.3;
        const zIndex = 10 - absOff;

        return (
          <div
            key={i}
            onClick={() => { if (offset === 0) onOpen(i); else goTo(i); }}
            className="absolute cursor-pointer rounded-2xl overflow-hidden"
            style={{
              left: '50%',
              top: '50%',
              width: '40vw',
              height: '40vw',
              maxWidth: 560,
              maxHeight: 560,
              transform: `translate(-50%, -50%) translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
              transition: 'all 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)',
              zIndex,
              opacity,
              transformStyle: 'preserve-3d',
            }}
          >
            <img
              src={src}
              alt={`Work ${i + 1}`}
              className="w-full h-full object-cover block"
              style={{
                filter: offset === 0 ? 'brightness(1)' : 'brightness(0.6)',
                transition: 'filter 0.7s ease',
              }}
            />
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ boxShadow: 'inset 0 0 40px 15px rgba(0,0,0,0.6)' }}
            />
          </div>
        );
      })}
    </div>
  );
}

function MobileCarousel({ onOpen }: { onOpen: (i: number) => void }) {
  const [active, setActive] = useState(0);
  const touchStart = useRef<number | null>(null);
  const count = galleryImages.length;

  const prev = () => setActive((a) => (a - 1 + count) % count);
  const next = () => setActive((a) => (a + 1) % count);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) next(); else prev();
    }
    touchStart.current = null;
  };

  const getOffset = (index: number) => {
    let diff = index - active;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    return diff;
  };

  return (
    <div
      className="relative overflow-hidden"
      style={{ padding: '3rem 0 2rem', height: '85vw', perspective: '800px' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {galleryImages.map((src, i) => {
        const offset = getOffset(i);
        const absOff = Math.abs(offset);
        if (absOff > 2) return null;

        const translateX = offset * 55;
        const translateZ = -absOff * 120;
        const rotateY = offset * -25;
        const scale = 1 - absOff * 0.2;
        const opacity = 1 - absOff * 0.3;
        const zIndex = 10 - absOff;

        return (
          <div
            key={i}
            onClick={() => {
              if (offset === 0) onOpen(i);
              else if (offset > 0) next();
              else prev();
            }}
            className="absolute cursor-pointer rounded-2xl overflow-hidden"
            style={{
              left: '50%',
              top: '50%',
              width: '78vw',
              height: '78vw',
              transform: `translate(-50%, -50%) translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
              transition: 'all 0.45s cubic-bezier(0.25, 0.1, 0.25, 1)',
              zIndex,
              opacity,
              transformStyle: 'preserve-3d',
            }}
          >
            <img
              src={src}
              alt={`Work ${i + 1}`}
              className="w-full h-full object-cover block"
              style={{
                filter: offset === 0 ? 'brightness(1)' : 'brightness(0.5)',
                transition: 'filter 0.45s ease',
              }}
            />
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ boxShadow: 'inset 0 0 40px 15px rgba(0,0,0,0.6)' }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function FloatingGallery() {
  const [mounted, setMounted] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isMobile = useIsMobile();
  useEffect(() => setMounted(true), []);

  const handleOpen = useCallback((i: number) => setOpenIndex(i), []);
  const handleClose = useCallback(() => setOpenIndex(null), []);

  return (
    <section className={isMobile ? '' : 'h-screen relative overflow-visible'}>
      <Link
        to="/gallery"
        className="no-underline"
        style={isMobile ? {} : { position: 'absolute', top: '1.5rem', left: '3rem', zIndex: 20 }}
      >
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          whileHover={{ color: 'hsl(340, 82%, 56%)' }}
          className="cursor-pointer transition-colors duration-300"
          style={{
            ...(isMobile ? { padding: '0 1.5rem', marginBottom: '0.5rem', margin: '0 0 0 1.5rem' } : { margin: 0 }),
            fontSize: 'clamp(0.7rem, 1.2vw, 1rem)',
            letterSpacing: '0.5em',
            fontWeight: 300,
            color: 'hsl(var(--gallery-text-dim))',
          }}
        >
          ART PROJECTS
        </motion.p>
      </Link>

      {mounted && !isMobile && <OrbitGallery onOpen={handleOpen} />}
      {mounted && isMobile && <MobileCarousel onOpen={handleOpen} />}

      <AnimatePresence>
        {openIndex !== null && (
          <Lightbox src={galleryImages[openIndex]} onClose={handleClose} />
        )}
      </AnimatePresence>
    </section>
  );
}
