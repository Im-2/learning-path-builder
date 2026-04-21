import React from 'react';
import { ArrowRight, Sparkles, Zap, Target, Layers } from 'lucide-react';
import './HeroSection.css';

interface HeroSectionProps {
  goal: string;
  setGoal: (goal: string) => void;
  onGenerate: (e: React.FormEvent) => void;
  error: string | null;
}

export function HeroSection({ goal, setGoal, onGenerate, error }: HeroSectionProps) {
  return (
    <div className="hero-container">
      {/* Decorative Background Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      
      <div className="hero-content">
        <div className="badge glass-panel animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <Sparkles size={16} className="text-gradient" />
          <span>AI-Powered Career Paths</span>
        </div>
        
        <h1 className="hero-title animate-fade-up" style={{ animationDelay: '0.2s' }}>
          Map Your Journey to <br />
          <span className="text-gradient dynamic-gradient">Any Career</span>
        </h1>
        
        <p className="hero-subtitle animate-fade-up" style={{ animationDelay: '0.3s' }}>
          Tell us what you want to become, and our AI will generate a personalized, 
          step-by-step roadmap with courses, projects, and timelines.
        </p>

        <div className="features-row animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <div className="feature-item">
            <Zap size={16} className="feature-icon text-gradient" />
            <span>Fast</span>
          </div>
          <div className="feature-item">
            <Target size={16} className="feature-icon text-gradient" />
            <span>Accurate</span>
          </div>
          <div className="feature-item">
            <Layers size={16} className="feature-icon text-gradient" />
            <span>Structured</span>
          </div>
        </div>

        <form onSubmit={onGenerate} className="hero-form animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <div className="input-group glass-panel input-glow">
            <span className="input-prefix">I want to become a</span>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Blockchain Developer..."
              className="hero-input"
              autoFocus
            />
            <button type="submit" className="hero-submit pulse-btn">
              <ArrowRight size={20} />
            </button>
          </div>
          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    </div>
  );
}
