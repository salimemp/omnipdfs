import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Pause, Play, SkipBack, SkipForward, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const detectLanguage = (text) => {
  const langPatterns = {
    ar: /[\u0600-\u06FF]/,
    zh: /[\u4E00-\u9FFF]/,
    ja: /[\u3040-\u30FF]/,
    ko: /[\uAC00-\uD7AF]/,
    ru: /[\u0400-\u04FF]/,
    hi: /[\u0900-\u097F]/,
    th: /[\u0E00-\u0E7F]/,
    he: /[\u0590-\u05FF]/,
  };
  
  for (const [lang, pattern] of Object.entries(langPatterns)) {
    if (pattern.test(text)) return lang;
  }
  
  // Check for common language indicators
  const lowerText = text.toLowerCase();
  if (/\b(el|la|los|las|un|una|es|está)\b/.test(lowerText)) return 'es';
  if (/\b(le|la|les|un|une|est|sont)\b/.test(lowerText)) return 'fr';
  if (/\b(der|die|das|ein|eine|ist|sind)\b/.test(lowerText)) return 'de';
  if (/\b(il|lo|la|un|una|è|sono)\b/.test(lowerText)) return 'it';
  if (/\b(o|a|os|as|um|uma|é|são)\b/.test(lowerText)) return 'pt';
  
  return 'en';
};

export default function ReadAloud({ text, isDark = true, onLanguageDetected }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [detectedLang, setDetectedLang] = useState('en');

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        const defaultVoice = availableVoices.find(v => v.default) || availableVoices[0];
        setSelectedVoice(defaultVoice.name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (text) {
      const lang = detectLanguage(text);
      setDetectedLang(lang);
      onLanguageDetected?.(lang);
      
      // Auto-select voice for detected language
      const langVoice = voices.find(v => v.lang.startsWith(lang));
      if (langVoice) {
        setSelectedVoice(langVoice.name);
      }
    }
  }, [text, voices, onLanguageDetected]);

  const speak = useCallback(() => {
    if (!text) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.name === selectedVoice);
    
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    
    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };
    
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  }, [text, selectedVoice, rate, pitch, volume, voices]);

  const pause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const resume = () => {
    window.speechSynthesis.resume();
    setIsPaused(false);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  if (!('speechSynthesis' in window)) {
    return null;
  }

  return (
    <div 
      className={`flex items-center gap-2 p-2 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}
      role="region"
      aria-label="Read aloud controls"
    >
      <Button
        size="icon"
        variant="ghost"
        onClick={isPlaying ? stop : speak}
        aria-label={isPlaying ? 'Stop reading' : 'Start reading aloud'}
        className={isDark ? 'text-slate-300 hover:text-white' : ''}
      >
        {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </Button>

      {isPlaying && (
        <>
          <Button
            size="icon"
            variant="ghost"
            onClick={isPaused ? resume : pause}
            aria-label={isPaused ? 'Resume' : 'Pause'}
            className={isDark ? 'text-slate-300 hover:text-white' : ''}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </Button>
        </>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            aria-label="Voice settings"
            className={isDark ? 'text-slate-300 hover:text-white' : ''}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={`w-64 ${isDark ? 'bg-slate-900 border-slate-700' : ''}`}>
          <div className="space-y-4">
            <div>
              <Label className={`text-xs ${isDark ? 'text-slate-400' : ''}`}>Voice</Label>
              <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                <SelectTrigger className={`mt-1 text-xs ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}>
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
                  {voices.map(voice => (
                    <SelectItem key={voice.name} value={voice.name} className={`text-xs ${isDark ? 'text-white' : ''}`}>
                      {voice.name} ({voice.lang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className={`text-xs ${isDark ? 'text-slate-400' : ''}`}>Speed: {rate}x</Label>
              <Slider
                value={[rate]}
                onValueChange={([v]) => setRate(v)}
                min={0.5}
                max={2}
                step={0.1}
                className="mt-1"
              />
            </div>
            <div>
              <Label className={`text-xs ${isDark ? 'text-slate-400' : ''}`}>Pitch: {pitch}</Label>
              <Slider
                value={[pitch]}
                onValueChange={([v]) => setPitch(v)}
                min={0.5}
                max={2}
                step={0.1}
                className="mt-1"
              />
            </div>
            <div>
              <Label className={`text-xs ${isDark ? 'text-slate-400' : ''}`}>Volume: {Math.round(volume * 100)}%</Label>
              <Slider
                value={[volume]}
                onValueChange={([v]) => setVolume(v)}
                min={0}
                max={1}
                step={0.1}
                className="mt-1"
              />
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Detected language: {detectedLang.toUpperCase()}
            </p>
          </div>
        </PopoverContent>
      </Popover>

      <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`} aria-live="polite">
        {isPlaying ? (isPaused ? 'Paused' : 'Reading...') : 'Read aloud'}
      </span>
    </div>
  );
}