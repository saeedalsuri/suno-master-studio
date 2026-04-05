import React, { useState, useEffect } from "react";
import "./LyricStudio.css";

// V5 Compliance Engine
const V5LyricEngine = {
  // Check for negative prompts (Pink Elephant)
  detectNegativePrompts: (text) => {
    const negatives = ["no drums", "no bass", "no piano", "no guitar", "no vocals", "no synth", "no beat"];
    return negatives.filter(n => text.toLowerCase().includes(n));
  },

  // Validate BPM format
  validateBPM: (bpm) => {
    if (!bpm) return { valid: false, message: "No BPM found" };
    if (!bpm.includes("BPM")) return { valid: false, message: `Should be "128 BPM" not "${bpm}"` };
    const num = parseInt(bpm);
    if (isNaN(num) || num < 40 || num > 300) return { valid: false, message: "BPM should be between 40-300" };
    return { valid: true, message: "Valid BPM format" };
  },

  // Check extended solos in structure
  checkExtendedSolos: (structure) => {
    const soloPattern = /\[([\w\s]+)\s+Solo\]/gi;
    const matches = structure.match(soloPattern) || [];
    const missing = matches.filter(m => !m.includes("[Extended"));
    return {
      hasSolos: matches.length > 0,
      missingExtended: missing.length > 0,
      count: matches.length
    };
  },

  // Validate character count
  validateCharCount: (text) => {
    const SUNO_LIMIT = 5000;
    const count = text.length;
    if (count > SUNO_LIMIT) return { valid: false, message: `${count} chars - OVER LIMIT (${SUNO_LIMIT})` };
    if (count > SUNO_LIMIT * 0.9) return { valid: false, message: `${count} chars - WARNING: >90% of limit` };
    return { valid: true, message: `${count} chars - OK` };
  },

  // Top-load style into lyrics
  topLoadStyle: (lyrics, style, bpm) => {
    if (!lyrics) return "";
    // Extract genre and BPM for top-loading
    const genre = style.split(",")[0]?.trim() || "";
    const bpmMatch = bpm.match(/(\d+)/)?.[0] || "";
    
    // Create V5 style tag
    const styleTag = `[Style: ${genre}${bpmMatch ? `, ${bpmMatch} BPM` : ''}]`;
    
    // Check if already has a style tag
    if (lyrics.includes("[Style:") || lyrics.includes("[STYLE:")) {
      return lyrics;
    }
    
    return `${styleTag}\n\n${lyrics}`;
  },

  // Enforce extended solos
  enforceExtendedSolos: (structure) => {
    if (!structure) return structure;
    return structure.replace(/\[([\w\s]+)\s+Solo\]/gi, (match, instrument) => {
      if (match.includes("[Extended")) return match;
      return `[Extended ${instrument.trim()} Solo]`;
    });
  },

  // V5 Check for all issues
  fullValidation: (lyrics, style, bpm, structure) => {
    const issues = [];
    const warnings = [];

    // Check BPM
    const bpmResult = V5LyricEngine.validateBPM(bpm);
    if (!bpmResult.valid) issues.push({ type: 'bpm', message: bpmResult.message });

    // Check solos
    const soloResult = V5LyricEngine.checkExtendedSolos(structure);
    if (soloResult.missingExtended) {
      issues.push({ type: 'solo', message: `${soloResult.count} solo(s) need [Extended] prefix` });
    }

    // Check char count
    const charResult = V5LyricEngine.validateCharCount(lyrics);
    if (!charResult.valid) {
      if (charResult.message.includes("OVER")) {
        issues.push({ type: 'chars', message: charResult.message });
      } else {
        warnings.push({ type: 'chars', message: charResult.message });
      }
    }

    // Check negative prompts in style
    const negatives = V5LyricEngine.detectNegativePrompts(style);
    if (negatives.length > 0) {
      issues.push({ 
        type: 'negative', 
        message: `Pink Elephant: ${negatives.join(", ")} - Use positive descriptors instead` 
      });
    }

    return {
      compliant: issues.length === 0,
      issues,
      warnings
    };
  }
};

function LyricStudio({ externalTemplate, externalStyle }) {
  const [lyricsTemplate, setLyricsTemplate] = useState(externalTemplate || "");
  const [rawLyrics, setRawLyrics] = useState("");
  const [finalLyrics, setFinalLyrics] = useState("");
  const [formattedLyrics, setFormattedLyrics] = useState("");
  const [title, setTitle] = useState("");
  const [vocalGender, setVocalGender] = useState("m");
  
  // V5 State
  const [style, setStyle] = useState(externalStyle || "");
  const [bpm, setBpm] = useState("120 BPM");
  const [v5Validation, setV5Validation] = useState(null);
  const [topLoadEnabled, setTopLoadEnabled] = useState(true);
  const [enforceSolos, setEnforceSolos] = useState(true);

  // Sync with props
  useEffect(() => {
    if (externalTemplate) setLyricsTemplate(externalTemplate);
    if (externalStyle) setStyle(externalStyle);
  }, [externalTemplate, externalStyle]);

  const mergeLyrics = () => {
    let template = lyricsTemplate;
    let userStyle = style;
    
    // V5: Enforce extended solos if enabled
    if (enforceSolos) {
      template = V5LyricEngine.enforceExtendedSolos(template);
    }

    const userStanzas = rawLyrics
      .split(/\n\s*\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (userStanzas.length === 0) {
      let result = template;
      if (topLoadEnabled) result = V5LyricEngine.topLoadStyle(result, userStyle, bpm);
      setFinalLyrics(result);
      setFormattedLyrics(result.replace(/\{.*?\}/g, "[...]"));
      return;
    }

    // Ordered sequence to ensure proper stanza distribution
    const tags = [
      "{V1}",
      "{V2}",
      "{CHORUS}",
      "{V3}",
      "{VPRE}",
      "{V4}",
      "{BRIDGE}",
      "{OUTRO}",
    ];
    let stanzaPtr = 0;
    let usedChorus = null;

    tags.forEach((t) => {
      while (template.includes(t)) {
        let replacement = "";

        if (t === "{CHORUS}" && usedChorus !== null) {
          replacement = usedChorus;
        } else {
          replacement = userStanzas[stanzaPtr++] || `[Missing ${t}]`;
          if (t === "{CHORUS}") usedChorus = replacement;
        }

        // SMART TAG HARMONIZATION
        const tagIdx = template.indexOf(t);
        const linesBefore = template.substring(0, tagIdx).split("\n");

        let templateTagLineIdx = -1;
        for (
          let i = linesBefore.length - 1;
          i >= Math.max(0, linesBefore.length - 2);
          i--
        ) {
          const line = linesBefore[i].trim();
          if (line.startsWith("[") && line.endsWith("]")) {
            templateTagLineIdx = i;
            break;
          }
        }

        if (templateTagLineIdx !== -1 && replacement.trim().startsWith("[")) {
          const templateTagRaw = linesBefore[templateTagLineIdx]
            .trim()
            .slice(1, -1);
          const userTagMatch = replacement.match(/^\[(.*?)\]/);
          const userTagRaw = userTagMatch ? userTagMatch[1] : "";

          const cleanUserTag = userTagRaw
            .replace(/Verse \d\s*[:-]?\s*/i, "")
            .replace(/Chorus\s*[:-]?\s*/i, "")
            .trim();

          const harmonizedTag = `[${templateTagRaw}${cleanUserTag ? " | " + cleanUserTag : ""}]`;

          replacement = replacement.replace(/^\[.*?\]\s*\n?/, "").trim();

          const beforeTag = linesBefore.slice(0, templateTagLineIdx).join("\n");
          const afterTag = linesBefore.slice(templateTagLineIdx + 1).join("\n");

          template =
            (beforeTag ? beforeTag + "\n" : "") +
            harmonizedTag +
            "\n" +
            afterTag +
            template.substring(tagIdx);
        }

        template = template.replace(t, replacement);
      }
    });

    let result = template.trim();
    
    // V5: Top-load style if enabled
    if (topLoadEnabled) {
      result = V5LyricEngine.topLoadStyle(result, userStyle, bpm);
    }

    setFinalLyrics(result);

    // Generate Clean Formatted Version
    const cleanLyrics = result
      .replace(/\[.*?Energy:.*?\]/gi, "")
      .replace(/\[.*?Add Tension.*?\]/gi, "")
      .replace(/\[Intro.*?\]/gi, "[INTRO]")
      .replace(/\[Chorus.*?\]/gi, "[CHORUS]")
      .replace(/\[Verse.*?\]/gi, (match) =>
        match.toUpperCase().replace(/\|.*/, "]"),
      )
      .replace(/\[Outro.*?\]/gi, "[OUTRO]")
      .replace(/\n\s*\n\s*\n/g, "\n\n")
      .trim();

    const titlePrefix = title ? `TITLE: ${title}\n` : "";
    const stylePrefix = userStyle ? `STYLE: ${userStyle}\n\n` : "";
    
    setFormattedLyrics(`${titlePrefix}${stylePrefix}${cleanLyrics}`);

    // V5: Run validation
    const validation = V5LyricEngine.fullValidation(result, userStyle, bpm, template);
    setV5Validation(validation);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="lyric-studio">
      <div className="studio-card">
        <header className="card-header">
          <h2>Lyric Studio <span className="v5-badge">V5</span></h2>
          <p>Merge your poem into the Suno skeleton with V5 compliance.</p>
        </header>

        {/* V5 Validation Status */}
        {v5Validation && (
          <div className={`v5-validation-panel ${v5Validation.compliant ? 'pass' : 'fail'}`}>
            {v5Validation.compliant ? (
              <div className="v5-status pass">
                <span className="v5-icon">✓</span>
                <span>V5 Compliant - Ready for Suno</span>
              </div>
            ) : (
              <div className="v5-status fail">
                <span className="v5-icon">⚠</span>
                <span>{v5Validation.issues.length} V5 issues found</span>
              </div>
            )}
            
            {/* V5 Issues */}
            {v5Validation.issues.length > 0 && (
              <ul className="v5-issues-list">
                {v5Validation.issues.map((issue, i) => (
                  <li key={i} className={`v5-issue ${issue.type}`}>
                    {issue.type === 'bpm' && '🔴 '}
                    {issue.type === 'solo' && '🟡 '}
                    {issue.type === 'chars' && '🔴 '}
                    {issue.type === 'negative' && '🟡 '}
                    {issue.message}
                  </li>
                ))}
              </ul>
            )}
            
            {/* V5 Warnings */}
            {v5Validation.warnings.length > 0 && (
              <ul className="v5-warnings-list">
                {v5Validation.warnings.map((warning, i) => (
                  <li key={i} className="v5-warning">{warning.message}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="form-grid">
          <div className="form-group half">
            <label>Song Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Moonlight over Herat"
            />
          </div>
          <div className="form-group half">
            <label>Vocal Gender</label>
            <select
              value={vocalGender}
              onChange={(e) => setVocalGender(e.target.value)}
            >
              <option value="m">Male</option>
              <option value="f">Female</option>
              <option value="duet">Duet (Male/Female)</option>
            </select>
          </div>

          {/* V5 Style & BPM */}
          <div className="form-group half">
            <label>V5 Style (from Prompt Forge)</label>
            <textarea
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              rows={3}
              placeholder="Paste style from Prompt Forge..."
            />
          </div>
          <div className="form-group half">
            <label>V5 BPM (e.g., 128 BPM)</label>
            <input
              type="text"
              value={bpm}
              onChange={(e) => setBpm(e.target.value)}
              placeholder="120 BPM"
              className={!bpm.includes("BPM") ? "v5-invalid" : ""}
            />
            {!bpm.includes("BPM") && (
              <span className="v5-hint">Use format: "128 BPM"</span>
            )}
          </div>

          {/* V5 Options */}
          <div className="form-group full v5-options">
            <label>V5 Options:</label>
            <div className="v5-toggles">
              <label className="v5-toggle">
                <input
                  type="checkbox"
                  checked={topLoadEnabled}
                  onChange={(e) => setTopLoadEnabled(e.target.checked)}
                />
                <span className="slider"></span>
                <span>Top-Load Style</span>
                <span className="v5-toggle-hint">Auto-add [Style: ...] to lyrics</span>
              </label>
              <label className="v5-toggle">
                <input
                  type="checkbox"
                  checked={enforceSolos}
                  onChange={(e) => setEnforceSolos(e.target.checked)}
                />
                <span className="slider"></span>
                <span>Extended Solos</span>
                <span className="v5-toggle-hint">Auto-fix to [Extended Instrument Solo]</span>
              </label>
            </div>
          </div>

          <div className="form-group full">
            <label>1. Structure Template (from Prompt Forge)</label>
            <textarea
              value={lyricsTemplate}
              onChange={(e) => setLyricsTemplate(e.target.value)}
              rows={5}
              placeholder="[Intro]... {V1}..."
            />
          </div>

          <div className="form-group full">
            <label>2. Your Raw Poem / Lyrics</label>
            <textarea
              value={rawLyrics}
              onChange={(e) => setRawLyrics(e.target.value)}
              rows={6}
              placeholder="Line 1\nLine 2\n\nStanza 2..."
            />
            <button className="merge-btn" onClick={mergeLyrics}>
              Assemble Song Prompt
            </button>
          </div>

          <div className="results-container">
            <div className="form-group">
              <label>3. Final Suno Prompt (Lyrics Box)</label>
              <div className="final-output-wrapper">
                <textarea
                  className="final-output"
                  value={finalLyrics}
                  onChange={(e) => setFinalLyrics(e.target.value)}
                  rows={10}
                  readOnly={!finalLyrics}
                />
                {finalLyrics && (
                  <button
                    className="float-copy"
                    onClick={() => copyToClipboard(finalLyrics)}
                  >
                    Copy to Suno
                  </button>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>4. Formatted Lyrics (For Display)</label>
              <div className="final-output-wrapper formatted-wrapper">
                <textarea
                  className="final-output formatted-output"
                  value={formattedLyrics}
                  onChange={(e) => setFormattedLyrics(e.target.value)}
                  rows={10}
                  readOnly={!formattedLyrics}
                />
                {formattedLyrics && (
                  <button
                    className="float-copy"
                    onClick={() => copyToClipboard(formattedLyrics)}
                  >
                    Copy Clean
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <span className={`char-counter ${finalLyrics.length > 5000 ? 'over-limit' : ''}`}>
            {finalLyrics.length} / 5000 characters
            {finalLyrics.length > 5000 && " - OVER LIMIT!"}
          </span>
        </div>

        {/* V5 Tips */}
        <div className="v5-studio-tips">
          <h4>V5 Lyric Tips:</h4>
          <ul>
            <li><strong>Top-Load:</strong> Use `[Style: Genre, BPM]` at the top of lyrics box</li>
            <li><strong>Extended:</strong> Use `[Extended Guitar Solo]` not `[Guitar Solo]`</li>
            <li><strong>Limit:</strong> 5000 character limit for lyrics box</li>
            <li><strong>Pink Elephant:</strong> Don't say "No drums" - Suno ignores "No" and plays drums</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default LyricStudio;
