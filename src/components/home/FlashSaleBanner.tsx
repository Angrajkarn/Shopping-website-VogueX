"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FlashSaleBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 right-4 z-50 max-w-sm w-full"
      >
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-1 rounded-2xl shadow-2xl">
          <div className="bg-black text-white p-4 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
              <button
                onClick={() => setIsVisible(false)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-yellow-400/20 p-3 rounded-full">
                <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Flash Sale! ⚡</h3>
                <p className="text-sm text-gray-300 mb-3">
                  Get an extra 20% off on all streetwear items. Limited time
                  only!
                </p>
                <div className="flex gap-2">
                  <div className="bg-white/10 px-2 py-1 rounded text-xs font-mono">
                    02
                  </div>
                  <span className="text-xs self-center">:</span>
                  <div className="bg-white/10 px-2 py-1 rounded text-xs font-mono">
                    45
                  </div>
                  <span className="text-xs self-center">:</span>
                  <div className="bg-white/10 px-2 py-1 rounded text-xs font-mono">
                    12
                  </div>
                </div>
                <Button
                  size="sm"
                  className="w-full mt-3 bg-yellow-400 text-black hover:bg-yellow-500 font-bold"
                >
                  Shop Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
