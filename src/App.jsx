
import React, { useState } from 'react';
import { SunoLogicCore } from './utils/sunoLogic';
import LyricStudio from './components/LyricStudio';
import V5TemplateEngine from './components/V5TemplateEngine';
import templates from './data/templates.json';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('forge');
  
  // Shared state between Forge and Studio
  const [genreInput, setGenreInput] = useState('');
  const [isDuet, setIsDuet] = useState(false);
  const [isSoftBlend, setIsSoftBlend] = useState(false);
  const [generatedStyle, setGeneratedStyle] = useState('');
  const [generatedTemplate, setGeneratedTemplate] = useState('');
  const [versionInfo] = useState('V6 (V5 Compliant)');

  // V5 Compliance State
  const [v5Compliance, setV5Compliance] = useState(null);

  const handleGenerate = () => {
    const query = genreInput.toLowerCase().trim();
    if (!query) return;

    const data = SunoLogicCore.generateCreativePrompt(query, isDuet, isSoftBlend);
    setGeneratedStyle(data.style);
    setGeneratedTemplate(data.structure);
    
    // Check V5 compliance
    const compliance = SunoLogicCore.checkV5Compliance({
      style: data.style,
      bpm: data.bpm,
      structure: data.structure
    });
    setV5Compliance(compliance);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="studio-app">
      {/* SIDEBAR NAVIGATION */}
      <aside className="sidebar">
        <div className="logo">
          <div className="icon">S</div>
          <span>SUNO MASTER</span>
        </div>
        <nav>
          <button 
            className={activeTab === 'forge' ? 'nav-item active' : 'nav-item'} 
            onClick={() => setActiveTab('forge')}
          >
            <span className="dot"></span> Prompt Forge
          </button>
          <button 
            className={activeTab === 'studio' ? 'nav-item active' : 'nav-item'} 
            onClick={() => setActiveTab('studio')}
          >
            <span className="dot"></span> Lyric Studio
          </button>
          <button 
            className={activeTab === 'v5engine' ? 'nav-item active' : 'nav-item'} 
            onClick={() => setActiveTab('v5engine')}
          >
            <span className="dot v5"></span> V5 Templates
          </button>
        </nav>
        <div className="footer-info">
          <p className="v5-version">{versionInfo}</p>
          <p className="v5-core">Logic Core V6</p>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="content">
        
        {activeTab === 'forge' && (
          <div className="forge-view">
            <header className="page-header">
              <h1>Prompt Forge <span className="v5-badge">V5</span></h1>
              <p>Generate V5-compliant style anchors and song structures.</p>
            </header>

            <div className="glass-panel">
              <div className="input-group">
                <label>Genre or Musical Description</label>
                <div className="search-bar">
                  <input 
                    type="text" 
                    placeholder="e.g. 1970s Googoosh style, Lebanese Dabke-Pop, Saudi Ballad..." 
                    value={genreInput}
                    onChange={(e) => setGenreInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  />
                  <button className="generate-btn" onClick={handleGenerate}>Forge Style</button>
                </div>
                <div className="options-row">
                   <label className="toggle">
                     <input type="checkbox" checked={isDuet} onChange={(e) => setIsDuet(e.target.checked)} />
                     <span className="slider"></span>
                     <span className="label">Duet Mode</span>
                  </label>
                  <label className="toggle">
                     <input type="checkbox" checked={isSoftBlend} onChange={(e) => setIsSoftBlend(e.target.checked)} />
                     <span className="slider"></span>
                     <span className="label">Soft Blend (Smooth Fusion)</span>
                  </label>
                </div>
              </div>

              {generatedStyle && (
                <>
                  {/* V5 Compliance Status */}
                  <div className={`v5-compliance-status ${v5Compliance?.compliant ? 'pass' : 'fail'}`}>
                    {v5Compliance?.compliant ? (
                      <>
                        <span className="v5-icon">✓</span>
                        <span>V5 Compliant</span>
                      </>
                    ) : (
                      <>
                        <span className="v5-icon">⚠</span>
                        <span>{v5Compliance?.issues?.length || 0} issues found</span>
                      </>
                    )}
                  </div>

                  {/* V5 Issues */}
                  {v5Compliance && !v5Compliance.compliant && (
                    <div className="v5-issues-panel">
                      <h4>V5 Issues:</h4>
                      <ul>
                        {v5Compliance.issues.map((issue, i) => (
                          <li key={i}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="results-grid">
                    <div className="result-card">
                      <div className="card-top">
                        <label>1. STYLE ANCHOR <span className={generatedStyle.length > 120 ? "char-count warning" : "char-count"}>({generatedStyle.length} chars)</span></label>
                        <button className="copy-icon-btn" onClick={() => copyToClipboard(generatedStyle)}>Copy</button>
                      </div>
                      <textarea value={generatedStyle} readOnly rows={4} />
                    </div>

                    <div className="result-card">
                      <div className="card-top">
                        <label>2. STRUCTURE SKELETON</label>
                        <button className="copy-icon-btn" onClick={() => copyToClipboard(generatedTemplate)}>Copy</button>
                      </div>
                      <textarea value={generatedTemplate} readOnly rows={8} />
                    </div>

                    {/* Quick Copy Full Prompt */}
                    <div className="result-card full-width">
                      <div className="card-top">
                        <label>3. FULL PROMPT (Copy to SUNO)</label>
                        <button 
                          className="copy-icon-btn primary" 
                          onClick={() => copyToClipboard(`Style: ${generatedStyle}\n\nStructure:\n${generatedTemplate}`)}
                        >
                          Copy All
                        </button>
                      </div>
                      <pre className="full-prompt">{`Style: ${generatedStyle}`}</pre>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* V5 Tips */}
            <div className="v5-tips glass-panel">
              <h4>SUNO V5 Tips:</h4>
              <ul>
                <li><strong>Singular:</strong> Use "Guitar" not "Guitars"</li>
                <li><strong>BPM:</strong> Include "BPM" suffix: "128 BPM"</li>
                <li><strong>Extended:</strong> Use "[Extended Guitar Solo]" for solos</li>
                <li><strong>Spam:</strong> Avoid "High Quality", "Polished", "Radio-Ready"</li>
                <li><strong>Pink Elephant:</strong> "No Drums" → "Acoustic, Ambient"</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'studio' && (
          <LyricStudio 
            externalTemplate={generatedTemplate} 
            externalStyle={generatedStyle} 
          />
        )}

        {activeTab === 'v5engine' && (
          <div className="v5engine-view">
            <header className="page-header">
              <h1>V5 Template Engine</h1>
              <p>Browse, validate, and fix templates to SUNO V5 compliance.</p>
            </header>
            <V5TemplateEngine templates={templates} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
