import React, { useState, useEffect } from 'react';
import templates from '../data/templates.json';
import { V5_RULES } from '../data/options.js';

// ==========================================
// V5 TEMPLATE ENGINE COMPONENT
// ==========================================

const PLURAL_MAP = {
  "Male Vocals": "Male vocal",
  "Female Vocals": "Female vocal",
  "Electric Oud Riffs": "Electric Oud riff",
  "String Sections": "String section",
  "Orchestral Strings": "Orchestral string",
  "808 Bass": "808 bass",
  "War Drums": "War Drum",
  "hi-hats": "hi-hat",
  "Hi-Hats": "hi-hat",
  "Vocal Harmonies": "Vocal harmony",
  "Synth Strings": "Synth string",
  "Guitar Solos": "Guitar Solo",
  "Bass Guitar": "Bass Guitar",
  "Heavy Bass": "Heavy bass",
  "Synths": "Synth",
  "Analog Synths": "Analog Synth",
  "Distorted Bass": "Distorted bass",
  "Electric Guitars": "Electric Guitar",
  "Drums": "Drum",
  "Slap Bass": "Slap bass",
  "Sub Bass": "Sub bass",
  "Sub-bass": "Sub bass",
  "Melodic Bass": "Melodic bass",
  "Mijwiz riffs": "Mijwiz riff",
  "Darbuka Rolls": "Darbuka roll",
  "Fast Darbuka": "Fast Darbuka",
  "Tar strikes": "Tar strike",
  "Rhythmic Hand-claps": "Rhythmic Hand-claps",
  "Hand-claps": "Hand-claps",
  "Vocal chops": "Vocal chop",
  "Electric Guitar riffs": "Electric Guitar riff",
  "Guitar riffs": "Guitar riff",
  "Saxophone solos": "Saxophone Solo",
  "Congo rolls": "Congo roll",
  "Congas": "Conga",
  "Tremolos": "Tremolo",
  "Qanoon Tremolos": "Qanoon Tremolo",
  "Mirwas accents": "Mirwas accent",
  "Accents": "Accent",
  "Rhythms": "Rhythm",
  "Melodies": "Melody",
  "Riffs": "Riff"
};

const SPAM_WORDS = [
  "High Quality", "Polished", "Radio-Ready", "Mastered for Radio",
  "High Fidelity", "2026 Production", "Polished Pop Vocals",
  "No Bollywood", "No Pop", "No Ghazal", "No Adlibs",
  "No Vocal Runs", "No Vibrato", "No Electronic Elements",
  "Raw and Steady", "Clean Vocal", "Straightforward Folk Vocals"
];

// ==========================================
// V5 FIX FUNCTIONS
// ==========================================

const fixPlurals = (text) => {
  if (!text) return text;
  let fixed = text;
  Object.entries(PLURAL_MAP).forEach(([plural, singular]) => {
    const regex = new RegExp(`\\b${plural}\\b`, 'gi');
    fixed = fixed.replace(regex, singular);
  });
  return fixed;
};

const removeSpam = (text) => {
  if (!text) return text;
  let clean = text;
  SPAM_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    clean = clean.replace(regex, "");
  });
  clean = clean.replace(/,\s*,/g, ",").replace(/^\s*,\s*/, "").replace(/\s*,\s*$/, "").trim();
  return clean;
};

const fixBPM = (bpm) => {
  if (!bpm) return "120 BPM";
  const num = parseInt(bpm);
  if (isNaN(num)) return bpm.includes("BPM") ? bpm : `${bpm} BPM`;
  return `${num} BPM`;
};

const enforceExtendedSolo = (structure) => {
  if (!structure) return structure;
  return structure.replace(/\[([\w\s]+) Solo\]/gi, (match, instrument) => {
    if (match.includes("Extended")) return match;
    return `[Extended ${instrument.trim()} Solo]`;
  });
};

const validateTemplate = (template) => {
  const issues = [];
  const style = template.style || "";
  const structure = template.structure || "";
  const bpm = template.bpm || "";

  // Check plurals
  Object.entries(PLURAL_MAP).forEach(([plural]) => {
    if (style.toLowerCase().includes(plural.toLowerCase())) {
      issues.push({ type: 'plural', found: plural, expected: PLURAL_MAP[plural] });
    }
  });

  // Check spam words
  SPAM_WORDS.forEach(word => {
    if (style.toLowerCase().includes(word.toLowerCase())) {
      issues.push({ type: 'spam', found: word });
    }
  });

  // Check BPM format
  if (bpm && !bpm.includes("BPM")) {
    issues.push({ type: 'bpm', found: bpm, expected: `${bpm} BPM` });
  }

  // Check extended solos
  if (structure && !structure.includes("[Extended") && structure.includes("[") && structure.includes("Solo]")) {
    issues.push({ type: 'solo', found: 'Missing [Extended] format' });
  }

  return {
    compliant: issues.length === 0,
    issues: issues
  };
};

const fixTemplate = (template) => ({
  ...template,
  name: template.name?.replace(/\s*\(Edited\)/g, '').replace(/\s*\(Accent Force\)/g, '') || template.name,
  style: removeSpam(fixPlurals(template.style || "")),
  bpm: fixBPM(template.bpm),
  structure: enforceExtendedSolo(template.structure || "")
});

// ==========================================
// V5 TEMPLATE ENGINE COMPONENT
// ==========================================

export const V5TemplateEngine = ({ templates: templateList }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showV5Only, setShowV5Only] = useState(false);
  const [compareMode, setCompareMode] = useState(false);

  const allTemplates = templateList || templates;
  
  // Apply fixes to all templates
  const fixedTemplates = allTemplates.map((t, i) => ({
    ...t,
    _original: t,
    _fixed: fixTemplate(t),
    _validation: validateTemplate(t)
  }));

  // Filter templates
  const filteredTemplates = fixedTemplates.filter(t => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      t.name?.toLowerCase().includes(searchLower) ||
      t.style?.toLowerCase().includes(searchLower);
    
    const matchesV5 = !showV5Only || t._validation.compliant;
    
    const matchesFilter = filter === 'all' || 
      t.name?.toLowerCase().includes(filter.toLowerCase());

    return matchesSearch && matchesV5 && matchesFilter;
  });

  const selectedTemplate = filteredTemplates[selectedIndex];
  const v5CompliantCount = fixedTemplates.filter(t => t._validation.compliant).length;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const copyFullPrompt = () => {
    if (!selectedTemplate) return;
    const { _fixed } = selectedTemplate;
    const prompt = `[${_fixed.name}]\nStyle: ${_fixed.style}\nBPM: ${_fixed.bpm}\n\nStructure:\n${_fixed.structure}`;
    copyToClipboard(prompt);
  };

  return (
    <div className="v5-template-engine">
      {/* Header */}
      <div className="v5-header">
        <h2>SUNO V5 Template Engine</h2>
        <div className="v5-stats">
          <span className="v5-badge">
            V5 Compliant: {v5CompliantCount}/{allTemplates.length}
          </span>
          <span className="v5-badge warning">
            Needs Fix: {allTemplates.length - v5CompliantCount}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="v5-controls">
        <input
          type="text"
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="v5-search"
        />
        
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="v5-filter"
        >
          <option value="all">All Genres</option>
          <option value="arabic">Arabic</option>
          <option value="khaleeji">Khaleeji</option>
          <option value="maghreb">Maghreb</option>
          <option value="persian">Persian</option>
          <option value="bollywood">Bollywood</option>
          <option value="qawwali">Qawwali</option>
          <option value="electronic">Electronic</option>
          <option value="rock">Rock</option>
        </select>

        <label className="v5-checkbox">
          <input
            type="checkbox"
            checked={showV5Only}
            onChange={(e) => setShowV5Only(e.target.checked)}
          />
          V5 Compliant Only
        </label>

        <button 
          className="v5-btn secondary"
          onClick={() => setCompareMode(!compareMode)}
        >
          {compareMode ? 'Hide Compare' : 'Compare Mode'}
        </button>
      </div>

      {/* Template List */}
      <div className="v5-content">
        <div className="v5-list">
          {filteredTemplates.map((t, i) => (
            <div
              key={i}
              className={`v5-item ${t._validation.compliant ? 'v5-compliant' : 'v5-needs-fix'}`}
              onClick={() => setSelectedIndex(i)}
            >
              <span className="v5-item-name">{t.name}</span>
              <span className="v5-item-bpm">{t.bpm}</span>
              {!t._validation.compliant && (
                <span className="v5-issue-count">
                  {t._validation.issues.length} issues
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Template Details */}
        {selectedTemplate && (
          <div className="v5-details">
            <div className="v5-details-header">
              <h3>{selectedTemplate._fixed.name}</h3>
              <span className="v5-badge">{selectedTemplate._fixed.bpm}</span>
            </div>

            {/* Validation Issues */}
            {!selectedTemplate._validation.compliant && (
              <div className="v5-issues">
                <h4>Issues Found:</h4>
                <ul>
                  {selectedTemplate._validation.issues.map((issue, i) => (
                    <li key={i} className={`v5-issue ${issue.type}`}>
                      {issue.type === 'plural' && (
                        <>Plural: "{issue.found}" → "{issue.expected}"</>
                      )}
                      {issue.type === 'spam' && (
                        <>Spam word: "{issue.found}"</>
                      )}
                      {issue.type === 'bpm' && (
                        <>BPM format: "{issue.found}" → "{issue.expected}"</>
                      )}
                      {issue.type === 'solo' && (
                        <>{issue.found}</>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Compare Mode */}
            {compareMode ? (
              <div className="v5-compare">
                <div className="v5-compare-col">
                  <h4>BEFORE (Original)</h4>
                  <pre className="v5-original">
                    {selectedTemplate._original.style}
                  </pre>
                </div>
                <div className="v5-compare-col">
                  <h4>AFTER (V5 Fixed)</h4>
                  <pre className="v5-fixed">
                    {selectedTemplate._fixed.style}
                  </pre>
                </div>
              </div>
            ) : (
              <>
                {/* Style */}
                <div className="v5-section">
                  <h4>Style (V5 Fixed)</h4>
                  <pre className="v5-style">{selectedTemplate._fixed.style}</pre>
                </div>

                {/* Structure */}
                <div className="v5-section">
                  <h4>Structure</h4>
                  <pre className="v5-structure">{selectedTemplate._fixed.structure}</pre>
                </div>
              </>
            )}

            {/* Actions */}
            <div className="v5-actions">
              <button 
                className="v5-btn primary"
                onClick={copyFullPrompt}
              >
                Copy Full Prompt
              </button>
              <button 
                className="v5-btn secondary"
                onClick={() => copyToClipboard(selectedTemplate._fixed.style)}
              >
                Copy Style Only
              </button>
              <button 
                className="v5-btn secondary"
                onClick={() => copyToClipboard(selectedTemplate._fixed.structure)}
              >
                Copy Structure Only
              </button>
            </div>
          </div>
        )}
      </div>

      {/* V5 Rules Reference */}
      <div className="v5-rules">
        <h4>SUNO V5 Compliance Rules:</h4>
        <div className="v5-rules-grid">
          <div className="v5-rule">
            <strong>Singular Instruments</strong>
            <span>Guitar not Guitars</span>
          </div>
          <div className="v5-rule">
            <strong>BPM Format</strong>
            <span>"128 BPM" not "128"</span>
          </div>
          <div className="v5-rule">
            <strong>Extended Solos</strong>
            <span>[Extended Guitar Solo]</span>
          </div>
          <div className="v5-rule">
            <strong>No Spam Words</strong>
            <span>Remove: High Quality, Polished, etc.</span>
          </div>
          <div className="v5-rule">
            <strong>Pink Elephant</strong>
            <span>Convert "No Drums" → positive</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default V5TemplateEngine;
