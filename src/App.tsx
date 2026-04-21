import React, { useState } from 'react';
import { generateLearningPath, LearningPath } from './lib/gemini';
import { HeroSection } from './components/HeroSection';
import { Roadmap } from './components/Roadmap';
import { Loader2 } from 'lucide-react';
import './App.css';

function App() {
  const [goal, setGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [path, setPath] = useState<LearningPath | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;
    
    // Read the API key from environment variables
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      setError("API Key is missing! Please set VITE_GEMINI_API_KEY in your environment variables.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const generatedPath = await generateLearningPath(goal, apiKey);
      setPath(generatedPath);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo text-gradient">Career pathbuilder</div>
      </header>

      <main className="main-content">
        {!path && !isLoading && (
          <HeroSection 
            goal={goal} 
            setGoal={setGoal} 
            onGenerate={handleGenerate} 
            error={error}
          />
        )}

        {isLoading && (
          <div className="loading-state animate-fade-in">
            <Loader2 className="spinner text-gradient" size={48} />
            <h2 className="text-gradient">Designing your custom path...</h2>
            <p className="text-muted">Analyzing industry trends and compiling resources.</p>
          </div>
        )}

        {path && !isLoading && (
          <div className="roadmap-view animate-fade-in">
            <div className="roadmap-header text-center">
              <h1 className="text-gradient">{path.role} Roadmap</h1>
              <p className="text-muted">{path.description}</p>
              <button className="secondary-btn" onClick={() => setPath(null)}>
                Generate Another
              </button>
            </div>
            <Roadmap nodes={path.nodes} />
          </div>
        )}
      </main>

      <footer style={{ textAlign: 'center', padding: '1rem', color: '#888' }}>
        <p>
          &copy; created by <a href="https://x.com/Nuelcrypt" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 500 }}>nuelcrypt</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
