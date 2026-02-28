import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { galleryImages } from '@/lib/galleryImages';

export default function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [animPhase, setAnimPhase] = useState<'idle' | 'from' | 'to'>('idle');
  const [columns, setColumns] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const [startRect, setStartRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const imgRefs = useRef<Record<number, HTMLDivElement>>({});

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      if (w < 768) setColumns(2); else setColumns(3);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [openIndex]);

  const handleOpen = useCallback((i: number) => {
    const el = imgRefs.current[i];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setStartRect({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
    setOpenIndex(i);
    setAnimPhase('from');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimPhase('to');
      });
    });
  }, []);

  const handleClose = useCallback(() => {
    if (openIndex === null) return;
    const el = imgRefs.current[openIndex];
    if (el) {
      const rect = el.getBoundingClientRect();
      setStartRect({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
    }
    setAnimPhase('from');
    setTimeout(() => {
      setOpenIndex(null);
      setAnimPhase('idle');
    }, 450);
  }, [openIndex]);

  const canExpand = !isMobile && columns < 6;
  const canShrink = !isMobile && columns > 3;
  const isActive = openIndex !== null;

  const getExpandedStyle = (): React.CSSProperties => {
    if (!startRect) return {};
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (animPhase === 'to') {
      return {
        top: vh * 0.075,
        left: vw * 0.075,
        width: vw * 0.85,
        height: vh * 0.85,
        borderRadius: 8,
        opacity: 1,
      };
    }
    return {
      top: startRect.top,
      left: startRect.left,
      width: startRect.width,
      height: startRect.height,
      borderRadius: 2,
      opacity: 1,
    };
  };

  return (
    <div className="min-h-screen box-border" style={{ padding: isMobile ? '1.5rem 1rem' : '3rem' }}>
      <div className="flex items-center justify-between" style={{ marginBottom: isMobile ? '1.5rem' : '2.5rem' }}>
        <Link to="/" className="no-underline">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="cursor-pointer transition-colors duration-300"
            style={{
              fontSize: 'clamp(0.6rem, 1.2vw, 0.9rem)',
              letterSpacing: '0.4em',
              fontWeight: 300,
              color: 'hsl(var(--gallery-text-dim))',
            }}
            whileHover={{ color: 'hsl(340, 82%, 56%)' }}
          >
            ← SI.BERIANA
          </motion.span>
        </Link>

        {!isMobile && (
          <div className="flex gap-3 items-center">
            <button
              onClick={() => canShrink && setColumns(c => c - 1)}
              className="bg-transparent cursor-pointer transition-all duration-300"
              style={{
                border: '1px solid hsl(var(--border))',
                color: canShrink ? 'hsl(var(--gallery-text-dim))' : 'hsl(var(--border))',
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
                padding: '0.4rem 0.8rem',
                cursor: canShrink ? 'pointer' : 'default',
              }}
            >
              −
            </button>
            <span
              className="text-center"
              style={{
                fontSize: '0.7rem',
                letterSpacing: '0.2em',
                color: 'hsl(var(--gallery-text-faint))',
                minWidth: '1.5rem',
              }}
            >
              {columns}
            </span>
            <button
              onClick={() => canExpand && setColumns(c => c + 1)}
              className="bg-transparent cursor-pointer transition-all duration-300"
              style={{
                border: '1px solid hsl(var(--border))',
                color: canExpand ? 'hsl(var(--gallery-text-dim))' : 'hsl(var(--border))',
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
                padding: '0.4rem 0.8rem',
                cursor: canExpand ? 'pointer' : 'default',
              }}
            >
              +
            </button>
          </div>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: isMobile ? '0.5rem' : '1rem',
        }}
      >
        {galleryImages.map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            ref={(el) => { if (el) imgRefs.current[i] = el; }}
            onClick={() => handleOpen(i)}
            className="cursor-pointer overflow-hidden"
            style={{ aspectRatio: '1', borderRadius: 2 }}
          >
            <img
              src={src}
              alt={`Work ${i + 1}`}
              className="w-full h-full object-cover block transition-all duration-400"
              style={{
                filter: 'brightness(0.7)',
                visibility: (openIndex === i && animPhase !== 'idle') ? 'hidden' : 'visible',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.filter = 'brightness(1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.filter = 'brightness(0.7)';
              }}
            />
          </motion.div>
        ))}
      </div>

      {isActive && startRect && (
        <>
          <div
            onClick={handleClose}
            className="fixed inset-0 z-[999]"
            style={{
              background: 'hsl(var(--gallery-overlay))',
              opacity: animPhase === 'to' ? 1 : 0,
              transition: 'opacity 0.35s ease',
            }}
          />
          <div
            onClick={handleClose}
            className="fixed z-[1000] cursor-pointer flex items-center justify-center overflow-hidden"
            style={{
              ...getExpandedStyle(),
              transition: 'top 0.45s cubic-bezier(0.25,0.1,0.25,1), left 0.45s cubic-bezier(0.25,0.1,0.25,1), width 0.45s cubic-bezier(0.25,0.1,0.25,1), height 0.45s cubic-bezier(0.25,0.1,0.25,1), border-radius 0.45s cubic-bezier(0.25,0.1,0.25,1)',
            }}
          >
            <img
              src={galleryImages[openIndex!]}
              alt="Expanded work"
              onClick={(e) => e.stopPropagation()}
              className="w-full h-full object-contain cursor-default"
            />
          </div>
          <div
            className="fixed top-8 right-8 z-[1001] cursor-pointer leading-none"
            style={{
              color: 'hsl(var(--gallery-text-dim))',
              fontSize: '1.5rem',
              fontWeight: 200,
              opacity: animPhase === 'to' ? 1 : 0,
              transition: 'opacity 0.3s ease 0.15s',
            }}
            onClick={handleClose}
          >
            ✕
          </div>
        </>
      )}
    </div>
  );
}
