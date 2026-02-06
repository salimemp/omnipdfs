import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, X, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function OnboardingVideo({ isDark = true }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const videoThumbnail = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=450&fit=crop";

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleClose = () => {
    setIsPlaying(false);
  };

  return (
    <>
      {/* Thumbnail Card */}
      {!isPlaying && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className={`overflow-hidden cursor-pointer group ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}
            onClick={handlePlay}
          >
            <div className="relative aspect-video">
              <img 
                src={videoThumbnail} 
                alt="Video tutorial"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-all" />
              
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl"
                >
                  <PlayCircle className="w-12 h-12 text-violet-600 ml-1" />
                </motion.div>
              </div>

              {/* Duration Badge */}
              <div className="absolute bottom-4 right-4 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-sm">
                <span className="text-white text-sm font-medium">5:30</span>
              </div>

              {/* Title Overlay */}
              <div className="absolute bottom-4 left-4">
                <h3 className="text-white font-semibold text-lg mb-1">
                  Getting Started with OmniPDFs
                </h3>
                <p className="text-white/80 text-sm">
                  Learn the basics in under 6 minutes
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Video Player Modal */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl ${isFullscreen ? 'max-w-none h-screen' : ''}`}
            >
              {/* Video Player */}
              <div className={`relative ${isFullscreen ? 'h-full' : 'aspect-video'} bg-black`}>
                <video
                  className="w-full h-full"
                  controls
                  autoPlay
                  muted={isMuted}
                  poster={videoThumbnail}
                >
                  <source src="https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Custom Controls Overlay */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsMuted(!isMuted)}
                    className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
                  >
                    {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleClose}
                    className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Video Info */}
              {!isFullscreen && (
                <div className={`p-6 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                  <h3 className={`font-semibold text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Getting Started with OmniPDFs
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    This tutorial covers the basics of uploading, converting, and managing documents on OmniPDFs. 
                    You'll learn about our core features, AI tools, and collaboration capabilities.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}