import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AppLogo({ size = 'default', showText = true, isDark = true }) {
  const [logoUrl, setLogoUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateLogo = async () => {
      try {
        const result = await base44.integrations.Core.GenerateImage({
          prompt: "Modern minimalist logo icon for OmniPDF document management app. A sleek geometric design combining a document/paper shape with flowing lines representing AI and collaboration. Vibrant gradient from violet purple (#8B5CF6) to cyan blue (#06B6D4). Clean, professional, tech-forward design on transparent or white background. Simple memorable icon that works at small sizes. Vector style, flat design, no text, just the icon symbol."
        });
        setLogoUrl(result.url);
      } catch (e) {
        console.error('Logo generation failed:', e);
      } finally {
        setLoading(false);
      }
    };

    generateLogo();
  }, []);

  const sizeClasses = {
    small: 'w-8 h-8',
    default: 'w-11 h-11',
    large: 'w-16 h-16'
  };

  const textSizeClasses = {
    small: 'text-base',
    default: 'text-xl',
    large: 'text-2xl'
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg overflow-hidden`}>
        {loading ? (
          <Loader2 className="w-5 h-5 text-white animate-spin" />
        ) : logoUrl ? (
          <img src={logoUrl} alt="OmniPDF Logo" className="w-full h-full object-cover" />
        ) : (
          <FileText className="w-6 h-6 text-white" />
        )}
      </div>
      {showText && (
        <span className={`font-bold ${textSizeClasses[size]} ${isDark ? 'text-white' : 'text-slate-900'}`}>
          OmniPDF
        </span>
      )}
    </div>
  );
}