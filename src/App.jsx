import React, { useEffect, useMemo, useState } from "react";
import {
  Search, Star, MapPin, GraduationCap, Trophy, Cross, Mail, User,
  SlidersHorizontal, Save, RotateCcw, ExternalLink, CheckCircle2,
  AlertCircle, XCircle, Plus, Trash2, NotebookPen, Target, Filter,
  School, BookOpen, Sparkles, Heart, ClipboardList, MessageCircle, Send,
} from "lucide-react";

import { generateRecruitingEmail } from "./lib/generateRecruitingEmail";
import { chatRecruitingEmail } from "./lib/chatRecruitingEmail";
import { VOLLEYBALL_SCHOOLS, BUILT_IN_SCHOOL_COUNT } from "./data/volleyballSchools";
import { ALL_STATES, fullStateName } from "./data/states";
import { EXPANDED_MAJOR_OPTIONS } from "./data/majors";

const STORAGE_KEY = "jackson_college_match_v2";

const DEFAULT_PROFILE = {
  name: "Jackson DeMarco",
  gradYear: "",
  position: "",
  height: "",
  vertical: "",
  approachTouch: "",
  standingReach: "",
  gpa: "",
  highSchool: "",
  clubTeam: "",
  possibleMajors: ["Exercise Science", "Business", "Computer Science"],
  coachReferenceName: "",
  coachReferenceRole: "",
  coachReferenceEmail: "",
  coachReferencePhone: "",
  videoLink: "",
  email: "",
  phone: "",
  playerNotes: "",
};

const DEFAULT_PREFS = {
  division: "Any Division",
  states: ["Pennsylvania", "Ohio", "New York", "New Jersey", "Maryland", "Virginia", "West Virginia"],
  maxDistance: "Flexible",
  christianFit: "Preferred",
  academicLevel: "Strong",
  campusSize: "Any",
  competitionLevel: "Competitive",
  playingTimePriority: "Balanced",
  fitStrictness: "Show all ranked",
  majors: ["Exercise Science", "Business", "Computer Science"],
};

const DEFAULT_WEIGHTS = {
  volleyball: 0,
  academics: 0,
  major: 0,
  recruiting: 0,
  culture: 0,
  location: 0,
  opportunity: 0,
  interest: 0,
};

const RECOMMENDED_WEIGHTS = {
  volleyball: 20,
  academics: 15,
  major: 15,
  recruiting: 20,
  culture: 10,
  location: 5,
  opportunity: 10,
  interest: 5,
};

const EMAIL_STATUSES = ["Not emailed", "Draft ready", "Emailed", "Replied", "Follow-up needed", "Camp/Visit", "Not interested"];
const DIVISION_OPTIONS = ["Any Division", "NCAA D1", "NCAA D2", "NCAA D3", "NAIA", "NJCAA", "CCCAA", "Club"];

const MAJOR_OPTIONS = Array.from(
  new Set([...EXPANDED_MAJOR_OPTIONS, ...VOLLEYBALL_SCHOOLS.flatMap((school) => school.majors || [])])
).sort((a, b) => a.localeCompare(b));

const RATING_SCALE_GUIDE = [
  ["volleyball", "Volleyball Level", "Low means the team is not very competitive or does not seem like a serious volleyball fit.", "High means the team is competitive, well-coached, and would push you to get better."],
  ["academics", "Academics", "Low means the school is not as strong academically or does not support your future enough.", "High means the school has strong academics and helps your future."],
  ["major", "Major Fit", "Low means the school does not have majors you are seriously interested in.", "High means the school has majors you could actually see yourself studying."],
  ["recruiting", "Recruiting Fit", "Low means it might be unrealistic right now based on roster level, height, position, academics, or coach needs.", "High means you seem like a realistic recruit and should contact the program."],
  ["culture", "Culture / Faith Fit", "Low means the school does not match the environment, values, or culture you want.", "High means the school feels like a place where you could grow as a player, student, and person."],
  ["location", "Location", "Low means it is too far or in an area you do not like.", "High means the location works well for you and your family."],
  ["opportunity", "Playing Opportunity", "Low means roster/position fit could make playing time harder.", "High means there may be a realistic path to compete for time."],
  ["interest", "Personal Interest", "Low means you are not excited about the school.", "High means you would be excited to visit, email, and possibly go there."],
].map(([key, title, low, high]) => ({ key, title, low, high }));

function safeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalize(score) {
  return Math.max(0, Math.min(100, safeNumber(score)));
}

function scoreFrom100(raw, maxPoints) {
  return Math.round((normalize(raw) / 100) * maxPoints * 10) / 10;
}

function parseHeightToInches(value) {
  if (!value) return 0;
  const text = String(value).toLowerCase().replace(/\s/g, "");
  const feetInches = text.match(/(\d+)'(\d+)?/);
  if (feetInches) return Number(feetInches[1]) * 12 + Number(feetInches[2] || 0);
  const feetWords = text.match(/(\d+)ft(\d+)?/);
  if (feetWords) return Number(feetWords[1]) * 12 + Number(feetWords[2] || 0);
  const number = Number(text.replace(/[^0-9.]/g, ""));
  return Number.isFinite(number) ? number : 0;
}

function parseStatNumber(value) {
  if (!value) return 0;
  const number = Number(String(value).replace(/[^0-9.]/g, ""));
  return Number.isFinite(number) ? number : 0;
}

function normalizeDivision(value) {
  if (!value) return "Any Division";
  if (value === "D1") return "NCAA D1";
  if (value === "D2") return "NCAA D2";
  if (value === "D3") return "NCAA D3";
  return value;
}

function normalizePrefs(prefs = {}) {
  const merged = { ...DEFAULT_PREFS, ...prefs };
  return {
    ...merged,
    division: normalizeDivision(merged.division),
    states: Array.from(new Set((merged.states || []).map(fullStateName).filter(Boolean))),
    majors: Array.from(new Set((merged.majors || []).filter(Boolean))),
    fitStrictness: merged.fitStrictness || "Show all ranked",
  };
}

function getDivisionTargetStats(division) {
  if (division === "NCAA D1") return { height: 75, vertical: 34, gpa: 3.4 };
  if (division === "NCAA D2") return { height: 73, vertical: 31, gpa: 3.1 };
  if (division === "NCAA D3") return { height: 72, vertical: 29, gpa: 3.0 };
  if (division === "NAIA") return { height: 72, vertical: 29, gpa: 2.8 };
  if (division === "NJCAA" || division === "CCCAA") return { height: 71, vertical: 28, gpa: 2.5 };
  return { height: 72, vertical: 29, gpa: 3.0 };
}

function getProfileFit(profile = {}, school = {}) {
  const height = parseHeightToInches(profile.height);
  const vertical = parseStatNumber(profile.vertical);
  const gpa = parseStatNumber(profile.gpa);
  const target = getDivisionTargetStats(school.division);
  let score = 70;

  if (height) score += Math.max(-18, Math.min(15, (height - target.height) * 4));
  if (vertical) score += Math.max(-18, Math.min(16, (vertical - target.vertical) * 2.4));
  if (gpa) score += Math.max(-12, Math.min(14, (gpa - target.gpa) * 14));
  if (school.division === "NCAA D1" && (!height || !vertical)) score -= 8;
  if (school.division === "NCAA D3" && gpa >= 3.5) score += 5;
  if (["NAIA", "NJCAA", "CCCAA"].includes(school.division)) score += 3;

  return Math.round(normalize(score));
}

function getDivisionFit(school, prefs) {
  const preferred = normalizeDivision(prefs.division);
  if (preferred === "Any Division") return 100;
  if (school.division === preferred) return 100;
  if (preferred === "NCAA D1" && school.division === "NCAA D2") return 62;
  if (preferred === "NCAA D2" && ["NCAA D1", "NCAA D3", "NAIA"].includes(school.division)) return 70;
  if (preferred === "NCAA D3" && school.division === "NAIA") return 58;
  if (preferred === "NAIA" && ["NCAA D2", "NCAA D3"].includes(school.division)) return 62;
  return 35;
}

function getMajorFit(schoolMajors, preferredMajors) {
  if (!preferredMajors.length) return 70;
  const lowerSchoolMajors = schoolMajors.map((m) => m.toLowerCase());
  const matches = preferredMajors.filter((major) =>
    lowerSchoolMajors.some((schoolMajor) =>
      schoolMajor.includes(major.toLowerCase()) || major.toLowerCase().includes(schoolMajor)
    )
  );
  const ratio = matches.length / preferredMajors.length;
  if (ratio >= 0.75) return 95;
  if (ratio >= 0.5) return 85;
  if (ratio >= 0.25) return 72;
  return 40;
}

function getCultureFit(school, prefs) {
  if (prefs.christianFit === "Required") return school.christian ? 100 : 15;
  if (prefs.christianFit === "Preferred") return school.christian ? 100 : 65;
  if (prefs.christianFit === "Bonus") return school.christian ? 85 : 75;
  return 75;
}

function getLocationFit(school, prefs) {
  const selectedStates = (prefs.states || []).map(fullStateName);
  if (!selectedStates.length) return 75;
  if (selectedStates.includes(school.state)) return 100;
  if (prefs.maxDistance === "Anywhere") return 70;
  if (prefs.maxDistance === "Flexible") return 55;
  return 25;
}

function getAcademicFit(school, prefs) {
  const base = school.academicScore;
  if (prefs.academicLevel === "Elite") return base >= 90 ? 100 : base >= 80 ? 78 : 50;
  if (prefs.academicLevel === "Strong") return base >= 80 ? 95 : base >= 70 ? 78 : 58;
  return base;
}

function getVolleyballFit(school, prefs) {
  const base = school.volleyballScore;
  const divisionFit = getDivisionFit(school, prefs);
  let competitionFit = base;

  if (prefs.competitionLevel === "Very Competitive") {
    competitionFit = base >= 85 ? 100 : base >= 75 ? 82 : 58;
  } else if (prefs.competitionLevel === "Competitive") {
    competitionFit = base >= 75 ? 95 : base >= 65 ? 78 : 58;
  } else if (prefs.competitionLevel === "Realistic Playing Time") {
    competitionFit = Math.round(base * 0.45 + school.opportunityScore * 0.55);
  }

  return Math.round(competitionFit * 0.72 + divisionFit * 0.28);
}

function getOpportunityFit(school, prefs) {
  if (prefs.playingTimePriority === "Play Early") {
    return Math.round(school.opportunityScore * 0.75 + school.recruitingFit * 0.25);
  }
  if (prefs.playingTimePriority === "Highest Competition") {
    return Math.round(school.opportunityScore * 0.35 + school.volleyballScore * 0.65);
  }
  return school.opportunityScore;
}

function getTier(score) {
  if (score >= 85) return "Priority A+";
  if (score >= 75) return "Strong Target";
  if (score >= 65) return "Watchlist";
  if (score >= 50) return "Backup";
  return "Skip for now";
}

function getAction(score) {
  if (score >= 85) return "Email now and try to build contact before camp/visit.";
  if (score >= 75) return "Add to target list and prepare a coach email.";
  if (score >= 65) return "Keep on watchlist. Research roster and coach needs.";
  if (score >= 50) return "Only email if something specific stands out.";
  return "Do not focus on this school right now.";
}

function calculateSchoolScore(school, prefs, weights, profile = {}) {
  const raw = {
    volleyball: getVolleyballFit(school, prefs),
    academics: getAcademicFit(school, prefs),
    major: getMajorFit(school.majors, prefs.majors),
    recruiting: Math.round(school.recruitingFit * 0.45 + getProfileFit(profile, school) * 0.55),
    culture: getCultureFit(school, prefs),
    location: getLocationFit(school, prefs),
    opportunity: getOpportunityFit(school, prefs),
    interest: school.personalInterest,
  };

  const breakdown = Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [key, scoreFrom100(value, weights[key])])
  );
  const total = Math.round(Object.values(breakdown).reduce((sum, value) => sum + value, 0));

  return { total, raw, breakdown, tier: getTier(total), action: getAction(total) };
}

function cn(...items) {
  return items.filter(Boolean).join(" ");
}

function getWeightTotal(weights) {
  return Object.values(weights).reduce((sum, value) => sum + Number(value || 0), 0);
}

function sanitizeBudgetWeights(weights) {
  const clean = { ...DEFAULT_WEIGHTS };
  Object.keys(clean).forEach((key) => {
    const value = Number(weights?.[key] || 0);
    clean[key] = Math.max(0, Math.min(30, Number.isFinite(value) ? value : 0));
  });

  let total = getWeightTotal(clean);
  const keys = Object.keys(clean).reverse();

  while (total > 100) {
    const keyToLower = keys.find((key) => clean[key] > 0);
    if (!keyToLower) break;
    clean[keyToLower] -= 1;
    total -= 1;
  }
  return clean;
}

function useLocalStorageAppState() {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        return { profile: DEFAULT_PROFILE, prefs: DEFAULT_PREFS, weights: DEFAULT_WEIGHTS, weightsMode: "budgetV2", customSchools: [], progress: {} };
      }
      const parsed = JSON.parse(saved);
      return {
        profile: { ...DEFAULT_PROFILE, ...(parsed.profile || {}) },
        prefs: normalizePrefs(parsed.prefs || {}),
        weights: parsed.weightsMode !== "budgetV2" ? DEFAULT_WEIGHTS : sanitizeBudgetWeights(parsed.weights),
        weightsMode: "budgetV2",
        customSchools: parsed.customSchools || [],
        progress: parsed.progress || {},
      };
    } catch {
      return { profile: DEFAULT_PROFILE, prefs: DEFAULT_PREFS, weights: DEFAULT_WEIGHTS, weightsMode: "budgetV2", customSchools: [], progress: {} };
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return [state, setState];
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </label>
  );
}

function TextAreaField({ label, value, onChange, placeholder }) {
  return (
    <label className="field profile-notes-box">
      <span>{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function DropdownMultiSelect({ label, options, values, onChange, placeholder = "Select one..." }) {
  const [selected, setSelected] = useState("");
  const selectedValues = values || [];
  const availableOptions = options.filter((option) => !selectedValues.includes(option));

  function addValue(value) {
    if (!value || selectedValues.includes(value)) return;
    onChange([...selectedValues, value]);
    setSelected("");
  }

  function removeValue(value) {
    onChange(selectedValues.filter((item) => item !== value));
  }

  return (
    <div className="dropdown-multi">
      <div className="multi-title">{label}</div>
      <div className="select-row">
        <select value={selected} onChange={(e) => addValue(e.target.value)}>
          <option value="">{placeholder}</option>
          {availableOptions.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </div>
      <div className="selected-values">
        {selectedValues.length === 0 && <span className="empty-chip">None selected</span>}
        {selectedValues.map((value) => (
          <button key={value} type="button" className="chip active removable-chip" onClick={() => removeValue(value)}>
            {value} ×
          </button>
        ))}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, helper }) {
  return (
    <div className="stat-card">
      <Icon size={20} />
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        {helper && <span>{helper}</span>}
      </div>
    </div>
  );
}

export default function App() {
  const [appState, setAppState] = useLocalStorageAppState();
  const { profile, prefs, weights, customSchools, progress } = appState;
  const [activeTab, setActiveTab] = useState("matches");
  const [query, setQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("All");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const totalWeightUsed = getWeightTotal(weights);
  const pointsRemaining = 100 - totalWeightUsed;
  const allSchools = useMemo(() => [...VOLLEYBALL_SCHOOLS, ...customSchools], [customSchools]);

  const scoredSchools = useMemo(() => {
    return allSchools
      .map((school) => ({
        ...school,
        score: calculateSchoolScore(school, prefs, weights, profile),
        progress: progress[school.id] || { favorite: false, emailStatus: "Not emailed", notes: "", lastContact: "" },
      }))
      .filter((school) => {
        const text = `${school.name} ${school.city} ${school.state} ${school.division} ${school.notes} ${(school.majors || []).join(" ")}`.toLowerCase();
        const matchesQuery = text.includes(query.toLowerCase());
        const matchesTier = tierFilter === "All" || school.score.tier === tierFilter;
        const matchesFavorite = !showFavoritesOnly || school.progress.favorite;
        const matchesStrictness =
          prefs.fitStrictness === "Strong fits only" ? school.score.total >= 75 :
          prefs.fitStrictness === "Close fits only" ? school.score.total >= 60 : true;
        return matchesQuery && matchesTier && matchesFavorite && matchesStrictness;
      })
      .sort((a, b) => b.score.total - a.score.total);
  }, [allSchools, prefs, weights, profile, progress, query, tierFilter, showFavoritesOnly]);

  const favoriteCount = Object.values(progress).filter((item) => item.favorite).length;
  const emailedCount = Object.values(progress).filter((item) => ["Emailed", "Replied", "Follow-up needed", "Camp/Visit"].includes(item.emailStatus)).length;
  const priorityCount = scoredSchools.filter((school) => school.score.total >= 85).length;

  function updateProfile(patch) {
    setAppState((current) => ({ ...current, profile: { ...current.profile, ...patch } }));
  }

  function updatePrefs(patch) {
    setAppState((current) => ({ ...current, prefs: normalizePrefs({ ...current.prefs, ...patch }) }));
  }

  function updateWeightsBudget(changedKey, newValue) {
    setAppState((current) => {
      const currentWeights = sanitizeBudgetWeights(current.weights);
      const oldValue = currentWeights[changedKey];
      const requestedValue = Math.max(0, Math.min(30, Number(newValue)));
      const totalWithoutChanged = getWeightTotal(currentWeights) - oldValue;
      const maxAllowedForThisSlider = Math.min(30, 100 - totalWithoutChanged);
      const finalValue = Math.min(requestedValue, maxAllowedForThisSlider);
      return { ...current, weightsMode: "budgetV2", weights: { ...currentWeights, [changedKey]: finalValue } };
    });
  }

  function resetWeightsToZero() {
    setAppState((current) => ({ ...current, weightsMode: "budgetV2", weights: DEFAULT_WEIGHTS }));
  }

  function useRecommendedWeights() {
    setAppState((current) => ({ ...current, weightsMode: "budgetV2", weights: RECOMMENDED_WEIGHTS }));
  }

  function updateProgress(schoolId, patch) {
    setAppState((current) => ({
      ...current,
      progress: {
        ...current.progress,
        [schoolId]: { favorite: false, emailStatus: "Not emailed", notes: "", lastContact: "", ...(current.progress[schoolId] || {}), ...patch },
      },
    }));
  }

  function resetSavedData() {
    const ok = window.confirm("Reset saved app data on this computer? This clears profile edits, favorites, notes, and email progress.");
    if (!ok) return;
    localStorage.removeItem(STORAGE_KEY);
    setAppState({ profile: DEFAULT_PROFILE, prefs: DEFAULT_PREFS, weights: DEFAULT_WEIGHTS, weightsMode: "budgetV2", customSchools: [], progress: {} });
  }

  function addCustomSchool() {
    const name = window.prompt("School name:");
    if (!name) return;
    const newSchool = {
      id: `custom-${Date.now()}`,
      name,
      division: normalizeDivision(prefs.division || "NCAA D3"),
      state: prefs.states?.[0] || "Pennsylvania",
      city: "",
      christian: false,
      academicScore: 70,
      volleyballScore: 70,
      recruitingFit: 70,
      opportunityScore: 70,
      personalInterest: 70,
      campusSize: "Small",
      majors: ["Business"],
      coachEmail: "",
      website: "",
      notes: "Custom school. Edit this school after adding more details.",
      custom: true,
    };
    setAppState((current) => ({ ...current, customSchools: [...current.customSchools, newSchool] }));
  }

  function removeCustomSchool(id) {
    setAppState((current) => ({
      ...current,
      customSchools: current.customSchools.filter((school) => school.id !== id),
      progress: Object.fromEntries(Object.entries(current.progress).filter(([key]) => key !== id)),
    }));
  }

  function updateCustomSchool(id, patch) {
    setAppState((current) => ({
      ...current,
      customSchools: current.customSchools.map((school) => school.id === id ? { ...school, ...patch } : school),
    }));
  }

  function makeEmailDraft(school) {
    const majors = prefs.majors.join(", ") || "[major]";
    return `Hi Coach [Last Name],

My name is ${profile.name || "Jackson DeMarco"}, and I wanted to reach out because I am interested in ${school.name} men's volleyball.

I am a ${profile.gradYear || "[graduation year]"} at ${profile.highSchool || "[high school]"}, and I play ${profile.position || "[position]"}. My height is ${profile.height || "[height]"}, my vertical is ${profile.vertical || "[vertical]"}, and I play for ${profile.clubTeam || "[club team]"}. Academically, my GPA is ${profile.gpa || "[GPA]"}, and I am interested in studying ${majors}.

I like ${school.name} because ${school.christian ? "it seems like a strong Christian environment and " : ""}it looks like a school where I could grow as a player, student, and person.${profile.playerNotes ? `

One thing I want coaches to know about me is: ${profile.playerNotes}` : ""}

Thank you for your time.

${profile.name || "Jackson DeMarco"}
Grad Year: ${profile.gradYear || "[year]"}
Position: ${profile.position || "[position]"}
Height: ${profile.height || "[height]"}
Vertical: ${profile.vertical || "[vertical]"}
GPA: ${profile.gpa || "[GPA]"}
Coach Reference: ${profile.coachReferenceName || "[coach name]"} - ${profile.coachReferenceRole || "[role]"} - ${profile.coachReferenceEmail || "[email]"}
Video: ${profile.videoLink || "[video link]"}`;
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-content">
          <div className="badge"><Sparkles size={16} /> Local save enabled</div>
          <h1>Jackson Volleyball College Match</h1>
          <p>Search a hard-coded men's college volleyball database across NCAA, NAIA, and two-year programs. Preferences, weights, notes, and progress save on this computer.</p>
          <div className="hero-actions">
            <button className="primary" onClick={() => setActiveTab("matches")}><Search size={18} /> Find Schools</button>
            <button className="secondary" onClick={() => setActiveTab("profile")}><User size={18} /> Edit Profile</button>
          </div>
        </div>
        <div className="score-panel">
          <StatCard icon={Target} label="Current Matches" value={scoredSchools.length} helper="filtered schools" />
          <StatCard icon={School} label="Built-In Schools" value={BUILT_IN_SCHOOL_COUNT} helper="coded database" />
          <StatCard icon={Star} label="Favorites" value={favoriteCount} helper="saved locally" />
          <StatCard icon={Mail} label="Contacted" value={emailedCount} helper="email progress" />
          <StatCard icon={Trophy} label="Priority" value={priorityCount} helper="85+ score" />
        </div>
      </header>

      <nav className="tabs">
        <button className={cn(activeTab === "matches" && "active")} onClick={() => setActiveTab("matches")}><School size={18} /> Matches</button>
        <button className={cn(activeTab === "profile" && "active")} onClick={() => setActiveTab("profile")}><User size={18} /> Player Profile</button>
        <button className={cn(activeTab === "prefs" && "active")} onClick={() => setActiveTab("prefs")}><SlidersHorizontal size={18} /> Preferences</button>
        <button className={cn(activeTab === "algorithm" && "active")} onClick={() => setActiveTab("algorithm")}><ClipboardList size={18} /> Algorithm</button>
      </nav>

      {activeTab === "matches" && (
        <main className="main-grid">
          <section className="panel controls">
            <div className="panel-title"><Filter size={20} /><div><h2>Find Schools</h2><p>Uses saved preferences and algorithm until you change them.</p></div></div>
            <label className="search-box"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by school, state, city, division, or major..." /></label>
            <SelectField label="Tier Filter" value={tierFilter} onChange={setTierFilter} options={["All", "Priority A+", "Strong Target", "Watchlist", "Backup", "Skip for now"]} />
            <button className={cn("favorite-toggle", showFavoritesOnly && "active")} onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}><Heart size={18} />{showFavoritesOnly ? "Showing Favorites" : "Show Favorites Only"}</button>
            <button className="secondary full" onClick={addCustomSchool}><Plus size={18} /> Add Custom School</button>
            <div className="mini-note"><Save size={18} /><span>Your favorites, notes, preferences, algorithm, and email progress save automatically in this browser.</span></div>
          </section>
          <section className="school-list">
            {scoredSchools.map((school) => (
              <SchoolCard key={school.id} school={school} profile={profile} prefs={prefs} updateProgress={updateProgress} makeEmailDraft={makeEmailDraft} removeCustomSchool={removeCustomSchool} updateCustomSchool={updateCustomSchool} />
            ))}
          </section>
        </main>
      )}

      {activeTab === "profile" && (
        <main className="single-panel"><section className="panel">
          <div className="panel-title"><User size={20} /><div><h2>Player Profile</h2><p>This is used for recruiting fit, AI email drafts, and draft chat.</p></div></div>
          <div className="form-grid">
            <Field label="Name" value={profile.name} onChange={(value) => updateProfile({ name: value })} />
            <Field label="Graduation Year" value={profile.gradYear} onChange={(value) => updateProfile({ gradYear: value })} />
            <Field label="Position" value={profile.position} onChange={(value) => updateProfile({ position: value })} placeholder="OH, MB, S, RS, Libero..." />
            <Field label="Height" value={profile.height} onChange={(value) => updateProfile({ height: value })} placeholder={"6'0"} />
            <Field label="Vertical" value={profile.vertical} onChange={(value) => updateProfile({ vertical: value })} placeholder="ex: 30 inches" />
            <Field label="Approach Touch" value={profile.approachTouch} onChange={(value) => updateProfile({ approachTouch: value })} />
            <Field label="Standing Reach" value={profile.standingReach} onChange={(value) => updateProfile({ standingReach: value })} />
            <Field label="GPA" value={profile.gpa} onChange={(value) => updateProfile({ gpa: value })} />
            <Field label="High School" value={profile.highSchool} onChange={(value) => updateProfile({ highSchool: value })} />
            <Field label="Club Team" value={profile.clubTeam} onChange={(value) => updateProfile({ clubTeam: value })} />
            <Field label="Email" value={profile.email} onChange={(value) => updateProfile({ email: value })} />
            <Field label="Phone" value={profile.phone} onChange={(value) => updateProfile({ phone: value })} />
            <Field label="Video / Hudl / YouTube Link" value={profile.videoLink} onChange={(value) => updateProfile({ videoLink: value })} />
          </div>
          <DropdownMultiSelect label="Possible Majors" options={MAJOR_OPTIONS} values={profile.possibleMajors} placeholder="Select a possible major..." onChange={(values) => { updateProfile({ possibleMajors: values }); updatePrefs({ majors: values }); }} />
          <TextAreaField label="Player Notes for AI Emails" value={profile.playerNotes || ""} onChange={(value) => updateProfile({ playerNotes: value })} placeholder="Goals, playing style, camps, what you are improving, what sounds like you..." />
          <h3 className="subhead">Coach Reference</h3>
          <div className="form-grid">
            <Field label="Coach Name" value={profile.coachReferenceName} onChange={(value) => updateProfile({ coachReferenceName: value })} />
            <Field label="Coach Role" value={profile.coachReferenceRole} onChange={(value) => updateProfile({ coachReferenceRole: value })} placeholder="High school coach / club coach" />
            <Field label="Coach Email" value={profile.coachReferenceEmail} onChange={(value) => updateProfile({ coachReferenceEmail: value })} />
            <Field label="Coach Phone" value={profile.coachReferencePhone} onChange={(value) => updateProfile({ coachReferencePhone: value })} />
          </div>
        </section></main>
      )}

      {activeTab === "prefs" && (
        <main className="single-panel"><section className="panel">
          <div className="panel-title"><SlidersHorizontal size={20} /><div><h2>Preferences</h2><p>These settings save and control rankings every time you click Find Schools.</p></div></div>
          <div className="form-grid">
            <SelectField label="Division" value={prefs.division} onChange={(value) => updatePrefs({ division: value })} options={DIVISION_OPTIONS} />
            <SelectField label="Christian Fit" value={prefs.christianFit} onChange={(value) => updatePrefs({ christianFit: value })} options={["Required", "Preferred", "Bonus", "Does not matter"]} />
            <SelectField label="Academic Level" value={prefs.academicLevel} onChange={(value) => updatePrefs({ academicLevel: value })} options={["Elite", "Strong", "Balanced"]} />
            <SelectField label="Campus Size" value={prefs.campusSize} onChange={(value) => updatePrefs({ campusSize: value })} options={["Any", "Small", "Medium", "Large"]} />
            <SelectField label="Competition Level" value={prefs.competitionLevel} onChange={(value) => updatePrefs({ competitionLevel: value })} options={["Very Competitive", "Competitive", "Realistic Playing Time", "Balanced"]} />
            <SelectField label="Playing Time Priority" value={prefs.playingTimePriority} onChange={(value) => updatePrefs({ playingTimePriority: value })} options={["Balanced", "Play Early", "Highest Competition"]} />
            <SelectField label="Distance" value={prefs.maxDistance} onChange={(value) => updatePrefs({ maxDistance: value })} options={["Close", "Flexible", "Anywhere"]} />
            <SelectField label="Fit Strictness" value={prefs.fitStrictness} onChange={(value) => updatePrefs({ fitStrictness: value })} options={["Show all ranked", "Close fits only", "Strong fits only"]} />
          </div>
          <DropdownMultiSelect label="Preferred States" options={ALL_STATES} values={prefs.states} placeholder="Select a state..." onChange={(values) => updatePrefs({ states: values })} />
          <DropdownMultiSelect label="Major Fit" options={MAJOR_OPTIONS} values={prefs.majors} placeholder="Select a major..." onChange={(values) => updatePrefs({ majors: values })} />
          <div className="database-note"><strong>Database note:</strong> This app uses a large hard-coded men's volleyball school list across NCAA, NAIA, NJCAA, and CCCAA programs. Verify every coach, roster, division, and major before emailing.</div>
          <div className="danger-zone"><button className="danger" onClick={resetSavedData}><RotateCcw size={18} /> Reset Saved Local Data</button></div>
        </section></main>
      )}

      {activeTab === "algorithm" && (
        <main className="single-panel"><section className="panel">
          <div className="panel-title"><ClipboardList size={20} /><div><h2>Fit Score Algorithm</h2><p>Spend your 100 points like a 2K build. Sliders stay where you put them.</p></div></div>
          <div className="budget-bar">
            <div><span>Points Used</span><strong>{totalWeightUsed} / 100</strong></div>
            <div><span>Points Left</span><strong className={pointsRemaining === 0 ? "ready" : ""}>{pointsRemaining}</strong></div>
            <div className="budget-actions"><button className="secondary small" onClick={resetWeightsToZero}>Reset Build</button><button className="primary small" onClick={useRecommendedWeights}>Use Recommended</button></div>
          </div>
          <div className="algorithm-grid">
            {Object.entries(weights).map(([key, value]) => (
              <label className="weight-card" key={key}>
                <span>{key}</span><strong>{value} pts</strong><small>Points left: {pointsRemaining} | Max for this: {Math.min(30, value + pointsRemaining)}</small>
                <div className="weight-controls">
                  <button type="button" className="secondary tiny" onClick={() => updateWeightsBudget(key, value - 1)}>−</button>
                  <input type="range" min="0" max="30" value={value} onChange={(e) => updateWeightsBudget(key, Number(e.target.value))} />
                  <button type="button" className="secondary tiny" onClick={() => updateWeightsBudget(key, value + 1)}>+</button>
                </div>
                <input className="weight-number" type="number" min="0" max={Math.min(30, value + pointsRemaining)} value={value} onChange={(e) => updateWeightsBudget(key, Number(e.target.value))} />
              </label>
            ))}
          </div>
          <div className="formula-card">
            <h3>How it works</h3><p>The app scores every coded school using saved preferences, player stats, and the 100-point algorithm.</p>
            <div className="tier-list"><span><CheckCircle2 /> 85–100: Priority A+</span><span><Target /> 75–84: Strong Target</span><span><AlertCircle /> 65–74: Watchlist</span><span><NotebookPen /> 50–64: Backup</span><span><XCircle /> Under 50: Skip for now</span></div>
          </div>
          <div className="rating-guide"><div className="rating-guide-head"><h3>Rating Scale Guide</h3><p>Low = not a strong fit. High = strong fit.</p></div><div className="rating-grid">
            {RATING_SCALE_GUIDE.map((item) => (
              <div className="rating-card" key={item.key}><div className="rating-card-title"><span>{item.title}</span><strong>0–100</strong></div><div className="rating-row low"><b>Low Rating</b><p>{item.low}</p></div><div className="rating-row high"><b>High Rating</b><p>{item.high}</p></div></div>
            ))}
          </div></div>
        </section></main>
      )}
    </div>
  );
}

function buildAIPlayerProfile(profile, prefs) {
  const coachReference = [profile.coachReferenceName, profile.coachReferenceRole, profile.coachReferenceEmail, profile.coachReferencePhone].filter(Boolean).join(" - ");
  return {
    name: profile.name || "Jackson DeMarco",
    gradYear: profile.gradYear || "",
    position: profile.position || "",
    height: profile.height || "",
    vertical: profile.vertical || "",
    approachTouch: profile.approachTouch || "",
    standingReach: profile.standingReach || "",
    gpa: profile.gpa || "",
    highSchool: profile.highSchool || "",
    clubTeam: profile.clubTeam || "",
    academicInterests: (profile.possibleMajors || prefs.majors || []).join(", "),
    highlightLink: profile.videoLink || "",
    coachReferences: coachReference,
    email: profile.email || "",
    phone: profile.phone || "",
    playerNotes: profile.playerNotes || "",
  };
}

function buildAISchoolProfile(school, prefs) {
  return {
    schoolName: school.name || "",
    coachName: "",
    coachEmail: school.coachEmail || "",
    programLevel: school.division || prefs.division || "",
    majorFit: (school.majors || []).join(", "),
    whyInterested: school.notes || "",
    programNotes: `${school.name} is a ${school.division || ""} men's volleyball program in ${school.city ? `${school.city}, ` : ""}${school.state || ""}. Fit tier: ${school.score?.tier || ""}. Fit score: ${school.score?.total || ""}.`,
    teamNotes: `Christian fit: ${school.christian ? "Yes" : "No"}. Campus size: ${school.campusSize || ""}. Volleyball score: ${school.volleyballScore || ""}. Recruiting fit: ${school.recruitingFit || ""}. Opportunity score: ${school.opportunityScore || ""}.`,
    websiteUrl: school.website || "",
    savedSchoolNotes: school.progress?.notes || "",
    lastContact: school.progress?.lastContact || "",
  };
}

function SchoolCard({ school, profile, prefs, updateProgress, makeEmailDraft, removeCustomSchool, updateCustomSchool }) {
  const [showDraft, setShowDraft] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [aiDraft, setAiDraft] = useState(null);
  const [draftError, setDraftError] = useState("");
  const [draftChatInput, setDraftChatInput] = useState("");
  const [draftChatMessages, setDraftChatMessages] = useState([]);
  const [isChattingAboutDraft, setIsChattingAboutDraft] = useState(false);

  const progress = school.progress;
  const tierClass = school.score.total >= 85 ? "elite" : school.score.total >= 75 ? "strong" : school.score.total >= 65 ? "watch" : "backup";

  async function generateAIDraft() {
    setShowDraft(true);
    setCopied(false);
    setDraftError("");
    if (aiDraft) return;
    setIsGeneratingDraft(true);
    try {
      const email = await generateRecruitingEmail({
        playerProfile: buildAIPlayerProfile(profile, prefs),
        schoolProfile: buildAISchoolProfile(school, prefs),
        emailType: "intro",
        tone: "confident, respectful, natural, motivated, not robotic, like a high school volleyball player wrote it",
        includeWebResearch: true,
      });
      setAiDraft(email);
      updateProgress(school.id, { emailStatus: "Draft ready" });
    } catch (error) {
      setDraftError(error.message || "AI draft failed, so the regular draft is shown instead.");
      setAiDraft({
        subject: `${profile.gradYear || "[Grad Year]"} ${profile.position || "[Position]"} Interested in ${school.name} Men's Volleyball`,
        body: makeEmailDraft(school),
        personalizationScore: 35,
        personalizationLevel: "Low",
        whyThisIsPersonal: "This is the regular fallback draft because the AI draft could not be generated.",
        editSuggestions: ["Add one specific reason you like this program before sending."],
      });
    } finally {
      setIsGeneratingDraft(false);
    }
  }

  async function copyDraft() {
    const subject = aiDraft?.subject || `${profile.gradYear || "[Grad Year]"} ${profile.position || "[Position]"} Interested in ${school.name} Men's Volleyball`;
    const body = aiDraft?.body || makeEmailDraft(school);
    try {
      await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
      setCopied(true);
      updateProgress(school.id, { emailStatus: "Draft ready" });
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.alert("Copy failed. You can still select and copy the draft manually.");
    }
  }

  async function sendDraftChatMessage() {
    const message = draftChatInput.trim();
    if (!message || !aiDraft || isChattingAboutDraft) return;
    const userChatMessage = { role: "user", content: message };
    const nextMessages = [...draftChatMessages, userChatMessage];
    setDraftChatMessages(nextMessages);
    setDraftChatInput("");
    setIsChattingAboutDraft(true);
    setDraftError("");

    try {
      const response = await chatRecruitingEmail({
        playerProfile: buildAIPlayerProfile(profile, prefs),
        schoolProfile: buildAISchoolProfile(school, prefs),
        currentDraft: { subject: aiDraft.subject || "", body: aiDraft.body || "" },
        userMessage: message,
        chatHistory: draftChatMessages,
      });
      setAiDraft((current) => ({
        ...(current || {}),
        subject: response.subject || current?.subject || "",
        body: response.body || current?.body || "",
        editSuggestions: Array.isArray(response.editSuggestions) ? response.editSuggestions : current?.editSuggestions || [],
        whyThisIsPersonal: response.whyThisIsPersonal || current?.whyThisIsPersonal || "",
      }));
      setDraftChatMessages([...nextMessages, { role: "assistant", content: response.reply || response.changeSummary || "I updated the draft." }]);
    } catch (error) {
      setDraftChatMessages([...nextMessages, { role: "assistant", content: error.message || "I could not update the draft right now." }]);
    } finally {
      setIsChattingAboutDraft(false);
    }
  }

  return (
    <article className="school-card">
      <div className="school-top">
        <div><div className="school-meta"><span><MapPin size={15} /> {school.city ? `${school.city}, ` : ""}{school.state}</span><span><GraduationCap size={15} /> {school.division}</span>{school.christian && <span><Cross size={15} /> Christian fit</span>}</div><h2>{school.name}</h2><p>{school.notes}</p></div>
        <div className={cn("score-badge", tierClass)}><strong>{school.score.total}</strong><span>{school.score.tier}</span></div>
      </div>

      <div className="school-actions">
        <button className={cn("icon-button", progress.favorite && "favorited")} onClick={() => updateProgress(school.id, { favorite: !progress.favorite })}><Star size={18} fill={progress.favorite ? "currentColor" : "none"} />{progress.favorite ? "Favorited" : "Favorite"}</button>
        <select value={progress.emailStatus} onChange={(e) => updateProgress(school.id, { emailStatus: e.target.value })}>{EMAIL_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}</select>
        <a
          className="link-button"
          href={
            school.website ||
            `https://www.google.com/search?q=${encodeURIComponent(`${school.name} men's volleyball official athletics`)}`
          }
          target="_blank"
          rel="noreferrer"
          title={school.website ? "Open official team site" : "Search for the official team site"}
        >
          {school.website ? "Team Site" : "Search Team Site"} <ExternalLink size={16} />
        </a>

        <button className="secondary small" onClick={generateAIDraft} disabled={isGeneratingDraft}><Mail size={17} /> {isGeneratingDraft ? "Generating AI Draft..." : "Email Draft"}</button>
        {school.custom && <button className="danger small" onClick={() => removeCustomSchool(school.id)}><Trash2 size={16} /> Delete</button>}
      </div>

      <div className="breakdown">{Object.entries(school.score.breakdown).map(([key, value]) => <div key={key} className="breakdown-item"><span>{key}</span><strong>{value}</strong></div>)}</div>

      <div className="details-grid"><div><h4><BookOpen size={16} /> Majors</h4><p>{school.majors.join(", ")}</p></div><div><h4><Target size={16} /> Next Action</h4><p>{school.score.action}</p><p className="profile-fit-line">Profile/stat fit estimate: {school.score.raw.recruiting}/100</p></div></div>

      {school.custom && <div className="custom-edit"><Field label="City" value={school.city} onChange={(value) => updateCustomSchool(school.id, { city: value })} /><Field label="State" value={school.state} onChange={(value) => updateCustomSchool(school.id, { state: value })} /><Field label="Website" value={school.website} onChange={(value) => updateCustomSchool(school.id, { website: value })} /><Field label="Majors, comma separated" value={school.majors.join(", ")} onChange={(value) => updateCustomSchool(school.id, { majors: value.split(",").map((x) => x.trim()).filter(Boolean) })} /></div>}

      <label className="notes-box"><span><NotebookPen size={16} /> My Notes</span><textarea value={progress.notes} onChange={(e) => updateProgress(school.id, { notes: e.target.value })} placeholder="Coach replied, camp date, roster notes, what you like, what to ask next..." /></label>
      <label className="field last-contact"><span>Last Contact / Follow-up Date</span><input value={progress.lastContact} onChange={(e) => updateProgress(school.id, { lastContact: e.target.value })} placeholder="ex: emailed 6/9, follow up after camp" /></label>

      {showDraft && <div className="draft-box ai-draft-box"><div className="draft-head"><div><h3>AI Coach Email Draft</h3><p className="draft-helper">Generated for {school.name}. Review and edit before sending.</p></div><div className="draft-actions"><button className="secondary small" onClick={() => setAiDraft(null)} disabled={isGeneratingDraft}>Regenerate Next Click</button><button className="primary small" onClick={copyDraft}>{copied ? "Copied!" : "Copy Draft"}</button></div></div>
        {draftError && <p className="draft-error">{draftError}</p>}{isGeneratingDraft && <p className="draft-loading">Building a personalized draft with your profile and this school...</p>}
        {aiDraft && <><label className="field"><span>Subject</span><input value={aiDraft.subject || ""} onChange={(e) => setAiDraft({ ...aiDraft, subject: e.target.value })} /></label><label className="field"><span>Email Body</span><textarea className="ai-draft-textarea" value={aiDraft.body || ""} onChange={(e) => setAiDraft({ ...aiDraft, body: e.target.value })} /></label>
        <div className="ai-draft-meta"><div><span>Personalization</span><strong>{aiDraft.personalizationScore || 0}/100</strong><small>{aiDraft.personalizationLevel || "Low"}</small></div>{aiDraft.whyThisIsPersonal && <div className="ai-draft-wide"><span>Why this is personal</span><p>{aiDraft.whyThisIsPersonal}</p></div>}</div>
        {aiDraft.editSuggestions?.length > 0 && <div className="ai-draft-suggestions"><strong>Edit Suggestions</strong><ul>{aiDraft.editSuggestions.map((s, i) => <li key={i}>{s}</li>)}</ul></div>}
        <div className="ai-draft-chat-box"><div className="ai-draft-chat-head"><h4><MessageCircle size={17} /> Ask AI About This Email</h4><p>Ask for changes like: make it shorter, sound more like me, add my notes, or make it more confident.</p></div>{draftChatMessages.length > 0 && <div className="ai-draft-chat-messages">{draftChatMessages.map((message, index) => <div key={index} className={cn("ai-draft-chat-message", message.role === "user" ? "user" : "assistant")}><span>{message.role === "user" ? "You" : "AI"}</span><p>{message.content}</p></div>)}</div>}<div className="ai-draft-chat-row"><input value={draftChatInput} onChange={(e) => setDraftChatInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendDraftChatMessage(); } }} placeholder="Ask AI to change or explain this email..." /><button className="primary small" onClick={sendDraftChatMessage} disabled={isChattingAboutDraft || !draftChatInput.trim()}><Send size={16} /> {isChattingAboutDraft ? "Thinking..." : "Send"}</button></div></div></>}
      </div>}
    </article>
  );
}
