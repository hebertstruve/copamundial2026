'use client';
import { motion, AnimatePresence } from 'framer-motion';

export interface FxMessage {
  kicker?: string;
  title: string;
  subtitle?: string;
}

export function FxOverlay({ message }: { message: FxMessage | null }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(4px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          key="fx"
        >
          <motion.div
            className="text-center max-w-4xl"
            initial={{ scale: 0.85, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 1.05, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          >
            {message.kicker && (
              <div
                className="font-mono uppercase tracking-[0.3em] mb-3"
                style={{ fontSize: 12, color: 'var(--accent)' }}
              >
                {message.kicker}
              </div>
            )}
            <div
              className="font-display uppercase leading-[0.9]"
              style={{
                fontSize: 'clamp(52px, 11vw, 150px)',
                color: 'var(--paper)',
              }}
            >
              {message.title}
            </div>
            {message.subtitle && (
              <div
                className="font-headline italic mt-3"
                style={{
                  fontSize: 'clamp(16px, 2.2vw, 26px)',
                  color: 'var(--gold)',
                }}
              >
                {message.subtitle}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
