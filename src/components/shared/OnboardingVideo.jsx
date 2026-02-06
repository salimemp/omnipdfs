import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, X, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const tutorialSlides = [
  {
    title: 'Welcome to OmniPDFs',
    description: 'Your complete document management and conversion platform',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=450&fit=crop',
    points: [
      'Convert 50+ file formats instantly',
      'AI-powered document analysis',
      'Enterprise-grade security',
      'Real-time collaboration'
    ]
  },
  {
    title: 'Upload & Convert',
    description: 'Drag and drop any document for instant conversion',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=450&fit=crop',
    points: [
      'Support for PDF, DOCX, XLSX, images & more',
      'Batch conversion for multiple files',
      'Advanced quality settings',
      'OCR for scanned documents'
    ]
  },
  {
    title: 'AI Assistant',
    description: 'Let AI help you work smarter with your documents',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop',
    points: [
      'Auto-summarization of documents',
      'Smart document analysis',
      'AI-powered translations',
      'Intelligent search & extraction'
    ]
  },
  {
    title: 'Collaborate in Real-Time',
    description: 'Work together with your team seamlessly',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=450&fit=crop',
    points: [
      'Share documents with permissions',
      'Real-time comments & annotations',
      'Version control & history',
      'Team workspaces'
    ]
  },
  {
    title: 'Security & Compliance',
    description: 'Enterprise-grade security for your documents',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=450&fit=crop',
    points: [
      'AES-256 encryption',
      'GDPR, HIPAA, SOC 2 compliant',
      'Two-factor authentication',
      'Complete audit trails'
    ]
  }
];

export default function OnboardingVideo({ isDark = true }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handlePlay = () => {
    setIsPlaying(true);
    setCurrentSlide(0);
  };

  const handleClose = () => {
    setIsPlaying(false);
  };

  const nextSlide = () => {
    if (currentSlide < tutorialSlides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const slide = tutorialSlides[currentSlide];

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
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=450&fit=crop" 
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
                <span className="text-white text-sm font-medium">5 Steps</span>
              </div>

              {/* Title Overlay */}
              <div className="absolute bottom-4 left-4">
                <h3 className="text-white font-semibold text-lg mb-1">
                  Getting Started with OmniPDFs
                </h3>
                <p className="text-white/80 text-sm">
                  Interactive tutorial - Learn in 5 minutes
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Tutorial Modal */}
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
              className="relative w-full max-w-5xl"
            >
              {/* Close Button */}
              <Button
                size="icon"
                variant="ghost"
                onClick={handleClose}
                className="absolute -top-12 right-0 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm z-10"
              >
                <X className="w-5 h-5" />
              </Button>

              {/* Tutorial Content */}
              <Card className={isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}>
                {/* Slide Image */}
                <div className="relative aspect-video overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentSlide}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  </AnimatePresence>

                  {/* Progress Indicator */}
                  <div className="absolute top-4 left-4 right-4 flex gap-2">
                    {tutorialSlides.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          i === currentSlide 
                            ? 'bg-violet-400' 
                            : i < currentSlide 
                            ? 'bg-emerald-400' 
                            : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Step Number */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-violet-500/90 text-white">
                      Step {currentSlide + 1} of {tutorialSlides.length}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {slide.title}
                      </h2>
                      <p className={`text-lg mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {slide.description}
                      </p>

                      <div className="space-y-3">
                        {slide.points.map((point, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * i }}
                            className="flex items-start gap-3"
                          >
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                              {point}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
                    <Button
                      variant="outline"
                      onClick={prevSlide}
                      disabled={currentSlide === 0}
                      className={isDark ? 'border-slate-700' : 'border-slate-300'}
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>

                    <div className="flex gap-2">
                      {tutorialSlides.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentSlide(i)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            i === currentSlide 
                              ? 'bg-violet-400 w-6' 
                              : 'bg-slate-600 hover:bg-slate-500'
                          }`}
                        />
                      ))}
                    </div>

                    {currentSlide < tutorialSlides.length - 1 ? (
                      <Button
                        onClick={nextSlide}
                        className="bg-gradient-to-r from-violet-500 to-cyan-500"
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleClose}
                        className="bg-gradient-to-r from-emerald-500 to-green-500"
                      >
                        Get Started
                        <CheckCircle2 className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}