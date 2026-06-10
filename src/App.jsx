
import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Star,
  MapPin,
  GraduationCap,
  Trophy,
  Cross,
  Mail,
  User,
  SlidersHorizontal,
  Save,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Plus,
  Trash2,
  NotebookPen,
  Target,
  Filter,
  School,
  Dumbbell,
  BookOpen,
  Sparkles,
  Heart,
  ClipboardList,
} from 'lucide-react';
import { generateRecruitingEmail } from './lib/generateRecruitingEmail';

const STORAGE_KEY = 'jackson_college_match_v1';

const DEFAULT_PROFILE = {
  name: 'Jackson DeMarco',
  gradYear: '',
  position: '',
  height: '',
  vertical: '',
  approachTouch: '',
  standingReach: '',
  gpa: '',
  highSchool: '',
  clubTeam: '',
  possibleMajors: ['Exercise Science', 'Business', 'Computer Science'],
  coachReferenceName: '',
  coachReferenceRole: '',
  coachReferenceEmail: '',
  coachReferencePhone: '',
  videoLink: '',
  email: '',
  phone: '',
};

const DEFAULT_PREFS = {
  division: 'D3',
  states: ['PA', 'OH', 'NY', 'NJ', 'MD', 'VA', 'WV'],
  maxDistance: 'Flexible',
  christianFit: 'Preferred',
  academicLevel: 'Strong',
  campusSize: 'Any',
  competitionLevel: 'Competitive',
  playingTimePriority: 'Balanced',
  majors: ['Exercise Science', 'Business', 'Computer Science'],
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

const SAMPLE_SCHOOLS = [
  {
    id: 'grove-city',
    name: 'Grove City College',
    division: 'D3',
    state: 'PA',
    city: 'Grove City',
    christian: true,
    academicScore: 88,
    volleyballScore: 78,
    recruitingFit: 82,
    opportunityScore: 78,
    personalInterest: 95,
    campusSize: 'Small',
    majors: ['Exercise Science', 'Business', 'Computer Science', 'Mechanical Engineering', 'Education'],
    coachEmail: '',
    website: 'https://athletics.gcc.edu/sports/mens-volleyball',
    notes: 'Strong Christian fit. You have already been to camp before and are planning to go again this summer.',
  },
  {
    id: 'messiah',
    name: 'Messiah University',
    division: 'D3',
    state: 'PA',
    city: 'Mechanicsburg',
    christian: true,
    academicScore: 84,
    volleyballScore: 80,
    recruitingFit: 77,
    opportunityScore: 74,
    personalInterest: 78,
    campusSize: 'Small',
    majors: ['Exercise Science', 'Business', 'Computer Science', 'Education', 'Engineering'],
    coachEmail: '',
    website: 'https://gomessiah.com/sports/mens-volleyball',
    notes: 'Christian university with strong academics and a good athletics environment.',
  },
  {
    id: 'saint-vincent',
    name: 'Saint Vincent College',
    division: 'D3',
    state: 'PA',
    city: 'Latrobe',
    christian: true,
    academicScore: 78,
    volleyballScore: 66,
    recruitingFit: 83,
    opportunityScore: 82,
    personalInterest: 72,
    campusSize: 'Small',
    majors: ['Exercise Science', 'Business', 'Computer Science', 'Education', 'Engineering'],
    coachEmail: '',
    website: 'https://athletics.stvincent.edu/',
    notes: 'Christian/Catholic environment, close to home, and could be a realistic fit.',
  },
  {
    id: 'juniata',
    name: 'Juniata College',
    division: 'D3',
    state: 'PA',
    city: 'Huntingdon',
    christian: false,
    academicScore: 82,
    volleyballScore: 88,
    recruitingFit: 72,
    opportunityScore: 68,
    personalInterest: 72,
    campusSize: 'Small',
    majors: ['Business', 'Computer Science', 'Education', 'Health Professions'],
    coachEmail: '',
    website: 'https://juniatasports.net/sports/mens-volleyball',
    notes: 'Very competitive volleyball school. Strong volleyball score, but recruiting fit may be harder.',
  },
  {
    id: 'stevens',
    name: 'Stevens Institute of Technology',
    division: 'D3',
    state: 'NJ',
    city: 'Hoboken',
    christian: false,
    academicScore: 94,
    volleyballScore: 86,
    recruitingFit: 70,
    opportunityScore: 65,
    personalInterest: 70,
    campusSize: 'Medium',
    majors: ['Computer Science', 'Business', 'Engineering', 'Data Science'],
    coachEmail: '',
    website: 'https://stevensducks.com/sports/mens-volleyball',
    notes: 'High academics and strong volleyball. More of a reach depending on academics and volleyball level.',
  },
  {
    id: 'nyu',
    name: 'New York University',
    division: 'D3',
    state: 'NY',
    city: 'New York',
    christian: false,
    academicScore: 95,
    volleyballScore: 86,
    recruitingFit: 68,
    opportunityScore: 60,
    personalInterest: 66,
    campusSize: 'Large',
    majors: ['Business', 'Computer Science', 'Education', 'Engineering', 'Sports Management'],
    coachEmail: '',
    website: 'https://gonyuathletics.com/sports/mens-volleyball',
    notes: 'Elite academics and strong volleyball, but likely a harder recruiting and culture fit.',
  },
  {
    id: 'thiel',
    name: 'Thiel College',
    division: 'D3',
    state: 'PA',
    city: 'Greenville',
    christian: false,
    academicScore: 70,
    volleyballScore: 70,
    recruitingFit: 84,
    opportunityScore: 85,
    personalInterest: 65,
    campusSize: 'Small',
    majors: ['Exercise Science', 'Business', 'Computer Science', 'Education'],
    coachEmail: '',
    website: 'https://thielathletics.com/sports/mens-volleyball',
    notes: 'Nearby D3 option with potentially realistic recruiting fit and playing opportunity.',
  },
  {
    id: 'arcadia',
    name: 'Arcadia University',
    division: 'D3',
    state: 'PA',
    city: 'Glenside',
    christian: false,
    academicScore: 78,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 73,
    personalInterest: 66,
    campusSize: 'Small',
    majors: ['Business', 'Computer Science', 'Education', 'Health Sciences'],
    coachEmail: '',
    website: 'https://arcadiaknights.com/sports/mens-volleyball',
    notes: 'Solid academic and volleyball option in PA.',
  },
  {
    id: 'stevenson',
    name: 'Stevenson University',
    division: 'D3',
    state: 'MD',
    city: 'Owings Mills',
    christian: false,
    academicScore: 73,
    volleyballScore: 80,
    recruitingFit: 75,
    opportunityScore: 70,
    personalInterest: 65,
    campusSize: 'Medium',
    majors: ['Business', 'Computer Science', 'Exercise Science', 'Education'],
    coachEmail: '',
    website: 'https://gomustangsports.com/sports/mens-volleyball',
    notes: 'Competitive D3 option with multiple major fits.',
  },
  {
    id: 'rutgers-newark',
    name: 'Rutgers-Newark',
    division: 'D3',
    state: 'NJ',
    city: 'Newark',
    christian: false,
    academicScore: 80,
    volleyballScore: 82,
    recruitingFit: 72,
    opportunityScore: 68,
    personalInterest: 58,
    campusSize: 'Medium',
    majors: ['Business', 'Computer Science', 'Education', 'Engineering'],
    coachEmail: '',
    website: 'https://rutgersnewarkathletics.com/sports/mens-volleyball',
    notes: 'Competitive volleyball and strong public university academics.',
  },
  {
    id: 'elmira',
    name: 'Elmira College',
    division: 'D3',
    state: 'NY',
    city: 'Elmira',
    christian: false,
    academicScore: 70,
    volleyballScore: 74,
    recruitingFit: 78,
    opportunityScore: 77,
    personalInterest: 60,
    campusSize: 'Small',
    majors: ['Business', 'Education', 'Computer Science'],
    coachEmail: '',
    website: 'https://athletics.elmira.edu/sports/mens-volleyball',
    notes: 'Potential watchlist school if New York is okay.',
  },
  {
    id: 'wilson',
    name: 'Wilson College',
    division: 'D3',
    state: 'PA',
    city: 'Chambersburg',
    christian: false,
    academicScore: 68,
    volleyballScore: 62,
    recruitingFit: 82,
    opportunityScore: 84,
    personalInterest: 55,
    campusSize: 'Small',
    majors: ['Exercise Science', 'Business', 'Education'],
    coachEmail: '',
    website: 'https://wilsonphoenix.com/',
    notes: 'Possible backup/watchlist school depending on fit and roster needs.',
  },
];

const EMAIL_STATUSES = ['Not emailed', 'Draft ready', 'Emailed', 'Replied', 'Follow-up needed', 'Camp/Visit', 'Not interested'];
const ALL_STATES = ['PA', 'OH', 'NY', 'NJ', 'MD', 'VA', 'WV', 'MA', 'CT', 'RI', 'NC', 'SC', 'IL', 'WI', 'CA'];
const MAJOR_OPTIONS = ['Exercise Science', 'Business', 'Computer Science', 'Education', 'Engineering', 'Sports Management', 'Health Sciences', 'Data Science'];

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

function getMajorFit(schoolMajors, preferredMajors) {
  if (!preferredMajors.length) return 70;
  const lowerSchoolMajors = schoolMajors.map((m) => m.toLowerCase());
  const matches = preferredMajors.filter((major) =>
    lowerSchoolMajors.some((schoolMajor) => schoolMajor.includes(major.toLowerCase()) || major.toLowerCase().includes(schoolMajor))
  );
  const ratio = matches.length / preferredMajors.length;
  if (ratio >= 0.75) return 95;
  if (ratio >= 0.5) return 85;
  if (ratio >= 0.25) return 72;
  return 40;
}

function getCultureFit(school, prefs) {
  if (prefs.christianFit === 'Required') return school.christian ? 100 : 15;
  if (prefs.christianFit === 'Preferred') return school.christian ? 100 : 65;
  if (prefs.christianFit === 'Bonus') return school.christian ? 85 : 75;
  return 75;
}

function getLocationFit(school, prefs) {
  if (!prefs.states.length) return 75;
  if (prefs.states.includes(school.state)) return 100;
  return prefs.maxDistance === 'Flexible' || prefs.maxDistance === 'Anywhere' ? 65 : 30;
}

function getAcademicFit(school, prefs) {
  const base = school.academicScore;
  if (prefs.academicLevel === 'Elite') return base >= 90 ? 100 : base >= 80 ? 78 : 50;
  if (prefs.academicLevel === 'Strong') return base >= 80 ? 95 : base >= 70 ? 78 : 58;
  return base;
}

function getVolleyballFit(school, prefs) {
  const base = school.volleyballScore;
  if (prefs.competitionLevel === 'Very Competitive') return base >= 85 ? 100 : base >= 75 ? 80 : 58;
  if (prefs.competitionLevel === 'Competitive') return base >= 75 ? 95 : base >= 65 ? 78 : 58;
  if (prefs.competitionLevel === 'Realistic Playing Time') return Math.round((base * 0.55) + (school.opportunityScore * 0.45));
  return base;
}

function getOpportunityFit(school, prefs) {
  if (prefs.playingTimePriority === 'Play Early') {
    return Math.round((school.opportunityScore * 0.75) + (school.recruitingFit * 0.25));
  }
  if (prefs.playingTimePriority === 'Highest Competition') {
    return Math.round((school.opportunityScore * 0.35) + (school.volleyballScore * 0.65));
  }
  return school.opportunityScore;
}

function getTier(score) {
  if (score >= 85) return 'Priority A+';
  if (score >= 75) return 'Strong Target';
  if (score >= 65) return 'Watchlist';
  if (score >= 50) return 'Backup';
  return 'Skip for now';
}

function getAction(score) {
  if (score >= 85) return 'Email now and try to build contact before camp/visit.';
  if (score >= 75) return 'Add to target list and prepare a coach email.';
  if (score >= 65) return 'Keep on watchlist. Research roster and coach needs.';
  if (score >= 50) return 'Only email if something specific stands out.';
  return 'Do not focus on this school right now.';
}

function calculateSchoolScore(school, prefs, weights) {
  const raw = {
    volleyball: getVolleyballFit(school, prefs),
    academics: getAcademicFit(school, prefs),
    major: getMajorFit(school.majors, prefs.majors),
    recruiting: school.recruitingFit,
    culture: getCultureFit(school, prefs),
    location: getLocationFit(school, prefs),
    opportunity: getOpportunityFit(school, prefs),
    interest: school.personalInterest,
  };

  const breakdown = {
    volleyball: scoreFrom100(raw.volleyball, weights.volleyball),
    academics: scoreFrom100(raw.academics, weights.academics),
    major: scoreFrom100(raw.major, weights.major),
    recruiting: scoreFrom100(raw.recruiting, weights.recruiting),
    culture: scoreFrom100(raw.culture, weights.culture),
    location: scoreFrom100(raw.location, weights.location),
    opportunity: scoreFrom100(raw.opportunity, weights.opportunity),
    interest: scoreFrom100(raw.interest, weights.interest),
  };

  const total = Math.round(Object.values(breakdown).reduce((sum, value) => sum + value, 0));

  return {
    total,
    raw,
    breakdown,
    tier: getTier(total),
    action: getAction(total),
  };
}

function cn(...items) {
  return items.filter(Boolean).join(' ');
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

  // If old saved data had more than 100 points, lower categories from the end
  // until the total is valid. This never raises or moves sliders during normal use.
  const keys = Object.keys(clean).reverse();

  while (total > 100) {
    const keyToLower = keys.find((key) => clean[key] > 0);
    if (!keyToLower) break;
    clean[keyToLower] -= 1;
    total -= 1;
  }

  return clean;
}

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

const RATING_SCALE_GUIDE = [
  {
    key: 'volleyball',
    title: 'Volleyball Level',
    low: 'Low means the team is not very competitive, has a weaker record, or does not seem like a serious volleyball fit.',
    high: 'High means the team is competitive, well-coached, plays strong opponents, and would push you to get better.',
  },
  {
    key: 'academics',
    title: 'Academics',
    low: 'Low means the school is not as strong academically or does not seem like it would challenge/support you enough.',
    high: 'High means the school has strong academics, good reputation, good support, and would help your future.',
  },
  {
    key: 'major',
    title: 'Major Fit',
    low: 'Low means the school does not have the majors or career paths you are seriously interested in.',
    high: 'High means the school has multiple majors you could actually see yourself studying.',
  },
  {
    key: 'recruiting',
    title: 'Recruiting Fit',
    low: 'Low means it might be unrealistic right now based on roster level, height, position, academics, or coach needs.',
    high: 'High means you seem like a realistic recruit for that program and could be worth contacting early.',
  },
  {
    key: 'culture',
    title: 'Culture / Faith Fit',
    low: 'Low means the school does not match the environment, values, team culture, or Christian fit you want.',
    high: 'High means the school feels like a place where you could grow as a player, student, and person.',
  },
  {
    key: 'location',
    title: 'Location',
    low: 'Low means it is too far, in an area you do not like, or would be hard for visits/family/travel.',
    high: 'High means the distance and location work well for you and your family.',
  },
  {
    key: 'opportunity',
    title: 'Playing Opportunity',
    low: 'Low means the roster may be crowded, your position has a lot of players, or playing time could be hard to earn.',
    high: 'High means there may be roster openings, your position fits, and you could realistically compete for time.',
  },
  {
    key: 'interest',
    title: 'Personal Interest',
    low: 'Low means you are not that excited about the school even if it looks okay on paper.',
    high: 'High means you would actually be excited to visit, email the coach, and maybe go there.',
  },
];



function useLocalStorageAppState() {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        return {
          profile: DEFAULT_PROFILE,
          prefs: DEFAULT_PREFS,
          weights: DEFAULT_WEIGHTS,
          weightsMode: 'budgetV2',
          customSchools: [],
          progress: {},
        };
      }
      const parsed = JSON.parse(saved);
      const shouldStartWeightsAtZero = parsed.weightsMode !== 'budgetV2';

      return {
        profile: { ...DEFAULT_PROFILE, ...(parsed.profile || {}) },
        prefs: { ...DEFAULT_PREFS, ...(parsed.prefs || {}) },
        weights: shouldStartWeightsAtZero ? DEFAULT_WEIGHTS : sanitizeBudgetWeights(parsed.weights),
        weightsMode: 'budgetV2',
        customSchools: parsed.customSchools || [],
        progress: parsed.progress || {},
      };
    } catch {
      return {
        profile: DEFAULT_PROFILE,
        prefs: DEFAULT_PREFS,
        weights: DEFAULT_WEIGHTS,
        weightsMode: 'budgetV2',
        customSchools: [],
        progress: {},
      };
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return [state, setState];
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function MultiToggle({ label, options, values, onChange }) {
  function toggle(item) {
    if (values.includes(item)) {
      onChange(values.filter((value) => value !== item));
    } else {
      onChange([...values, item]);
    }
  }

  return (
    <div className="multi-toggle">
      <div className="multi-title">{label}</div>
      <div className="chips">
        {options.map((option) => (
          <button
            type="button"
            key={option}
            className={cn('chip', values.includes(option) && 'active')}
            onClick={() => toggle(option)}
          >
            {option}
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

function App() {
  const [appState, setAppState] = useLocalStorageAppState();
  const { profile, prefs, weights, customSchools, progress } = appState;
  const [activeTab, setActiveTab] = useState('matches');
  const [query, setQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const totalWeightUsed = getWeightTotal(weights);
  const pointsRemaining = 100 - totalWeightUsed;

  const allSchools = useMemo(() => [...SAMPLE_SCHOOLS, ...customSchools], [customSchools]);

  const scoredSchools = useMemo(() => {
    return allSchools
      .map((school) => ({
        ...school,
        score: calculateSchoolScore(school, prefs, weights),
        progress: progress[school.id] || {
          favorite: false,
          emailStatus: 'Not emailed',
          notes: '',
          lastContact: '',
        },
      }))
      .filter((school) => {
        const text = `${school.name} ${school.city} ${school.state} ${school.majors.join(' ')}`.toLowerCase();
        const matchesQuery = text.includes(query.toLowerCase());
        const matchesTier = tierFilter === 'All' || school.score.tier === tierFilter;
        const matchesFavorite = !showFavoritesOnly || school.progress.favorite;
        return matchesQuery && matchesTier && matchesFavorite;
      })
      .sort((a, b) => b.score.total - a.score.total);
  }, [allSchools, prefs, weights, progress, query, tierFilter, showFavoritesOnly]);

  const favoriteCount = Object.values(progress).filter((item) => item.favorite).length;
  const emailedCount = Object.values(progress).filter((item) => ['Emailed', 'Replied', 'Follow-up needed', 'Camp/Visit'].includes(item.emailStatus)).length;
  const priorityCount = scoredSchools.filter((school) => school.score.total >= 85).length;

  function updateProfile(patch) {
    setAppState((current) => ({
      ...current,
      profile: { ...current.profile, ...patch },
    }));
  }

  function updatePrefs(patch) {
    setAppState((current) => ({
      ...current,
      prefs: { ...current.prefs, ...patch },
    }));
  }

  function updateWeightsBudget(changedKey, newValue) {
    setAppState((current) => {
      const currentWeights = sanitizeBudgetWeights(current.weights);
      const oldValue = currentWeights[changedKey];
      const requestedValue = Math.max(0, Math.min(30, Number(newValue)));
      const totalWithoutChanged = getWeightTotal(currentWeights) - oldValue;
      const maxAllowedForThisSlider = Math.min(30, 100 - totalWithoutChanged);
      const finalValue = Math.min(requestedValue, maxAllowedForThisSlider);

      return {
        ...current,
        weightsMode: 'budgetV2',
        weights: {
          ...currentWeights,
          [changedKey]: finalValue,
        },
      };
    });
  }

  function resetWeightsToZero() {
    setAppState((current) => ({
      ...current,
      weightsMode: 'budgetV2',
      weights: DEFAULT_WEIGHTS,
    }));
  }

  function useRecommendedWeights() {
    setAppState((current) => ({
      ...current,
      weightsMode: 'budgetV2',
      weights: RECOMMENDED_WEIGHTS,
    }));
  }

  function updateProgress(schoolId, patch) {
    setAppState((current) => ({
      ...current,
      progress: {
        ...current.progress,
        [schoolId]: {
          favorite: false,
          emailStatus: 'Not emailed',
          notes: '',
          lastContact: '',
          ...(current.progress[schoolId] || {}),
          ...patch,
        },
      },
    }));
  }

  function resetSavedData() {
    const ok = window.confirm('Reset saved app data on this computer? This clears profile edits, favorites, notes, and email progress.');
    if (!ok) return;
    localStorage.removeItem(STORAGE_KEY);
    setAppState({
      profile: DEFAULT_PROFILE,
      prefs: DEFAULT_PREFS,
      weights: DEFAULT_WEIGHTS,
      weightsMode: 'budgetV2',
      customSchools: [],
      progress: {},
    });
  }

  function addCustomSchool() {
    const name = window.prompt('School name:');
    if (!name) return;
    const newSchool = {
      id: `custom-${Date.now()}`,
      name,
      division: prefs.division || 'D3',
      state: 'PA',
      city: '',
      christian: false,
      academicScore: 70,
      volleyballScore: 70,
      recruitingFit: 70,
      opportunityScore: 70,
      personalInterest: 70,
      campusSize: 'Small',
      majors: ['Business'],
      coachEmail: '',
      website: '',
      notes: 'Custom school. Edit this school after adding more details.',
      custom: true,
    };
    setAppState((current) => ({
      ...current,
      customSchools: [...current.customSchools, newSchool],
    }));
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
    const majors = prefs.majors.join(', ') || '[major]';
    return `Hi Coach [Last Name],

My name is ${profile.name || 'Jackson DeMarco'}, and I wanted to reach out because I am interested in ${school.name} men's volleyball.

I am a [graduation year] at ${profile.highSchool || '[high school]'}, and I play ${profile.position || '[position]'}. My height is ${profile.height || '[height]'}, my vertical is ${profile.vertical || '[vertical]'}, and I play for ${profile.clubTeam || '[club team]'}. Academically, my GPA is ${profile.gpa || '[GPA]'}, and I am interested in studying ${majors}.

I like ${school.name} because ${school.christian ? 'it seems like a strong Christian environment and ' : ''}it looks like a school where I could grow as a player, student, and person. I am trying to find colleges that fit me academically and athletically, not just random schools to email.

I would appreciate any advice on what I should send you next, whether that is film, my schedule, or more academic information.

Thank you for your time.

${profile.name || 'Jackson DeMarco'}
Grad Year: ${profile.gradYear || '[year]'}
Position: ${profile.position || '[position]'}
Height: ${profile.height || '[height]'}
Vertical: ${profile.vertical || '[vertical]'}
GPA: ${profile.gpa || '[GPA]'}
Coach Reference: ${profile.coachReferenceName || '[coach name]'} - ${profile.coachReferenceRole || '[role]'} - ${profile.coachReferenceEmail || '[email]'}
Video: ${profile.videoLink || '[video link]'}`;
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-content">
          <div className="badge"><Sparkles size={16} /> Local save enabled</div>
          <h1>Jackson Volleyball College Match</h1>
          <p>
            Pick your preferences, rank D3 schools, save favorites, track emails, and keep notes.
            Everything saves on this computer. No backend needed.
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={() => setActiveTab('matches')}><Search size={18} /> Find Schools</button>
            <button className="secondary" onClick={() => setActiveTab('profile')}><User size={18} /> Edit Profile</button>
          </div>
        </div>
        <div className="score-panel">
          <StatCard icon={Target} label="Current Matches" value={scoredSchools.length} helper="filtered schools" />
          <StatCard icon={Star} label="Favorites" value={favoriteCount} helper="saved locally" />
          <StatCard icon={Mail} label="Contacted" value={emailedCount} helper="email progress" />
          <StatCard icon={Trophy} label="Priority" value={priorityCount} helper="85+ score" />
        </div>
      </header>

      <nav className="tabs">
        <button className={cn(activeTab === 'matches' && 'active')} onClick={() => setActiveTab('matches')}><School size={18} /> Matches</button>
        <button className={cn(activeTab === 'profile' && 'active')} onClick={() => setActiveTab('profile')}><User size={18} /> Player Profile</button>
        <button className={cn(activeTab === 'prefs' && 'active')} onClick={() => setActiveTab('prefs')}><SlidersHorizontal size={18} /> Preferences</button>
        <button className={cn(activeTab === 'algorithm' && 'active')} onClick={() => setActiveTab('algorithm')}><ClipboardList size={18} /> Algorithm</button>
      </nav>

      {activeTab === 'matches' && (
        <main className="main-grid">
          <section className="panel controls">
            <div className="panel-title">
              <Filter size={20} />
              <div>
                <h2>Find Schools</h2>
                <p>Use filters to narrow the list, then favorite your best fits.</p>
              </div>
            </div>

            <label className="search-box">
              <Search size={18} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by school, state, city, or major..." />
            </label>

            <SelectField label="Tier Filter" value={tierFilter} onChange={setTierFilter} options={['All', 'Priority A+', 'Strong Target', 'Watchlist', 'Backup', 'Skip for now']} />

            <button className={cn('favorite-toggle', showFavoritesOnly && 'active')} onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}>
              <Heart size={18} />
              {showFavoritesOnly ? 'Showing Favorites' : 'Show Favorites Only'}
            </button>

            <button className="secondary full" onClick={addCustomSchool}><Plus size={18} /> Add Custom School</button>

            <div className="mini-note">
              <Save size={18} />
              <span>Your favorites, notes, and email progress save automatically in this browser.</span>
            </div>
          </section>

          <section className="school-list">
            {scoredSchools.map((school) => (
              <SchoolCard
                key={school.id}
                school={school}
                profile={profile}
                prefs={prefs}
                updateProgress={updateProgress}
                makeEmailDraft={makeEmailDraft}
                removeCustomSchool={removeCustomSchool}
                updateCustomSchool={updateCustomSchool}
              />
            ))}
          </section>
        </main>
      )}

      {activeTab === 'profile' && (
        <main className="single-panel">
          <section className="panel">
            <div className="panel-title">
              <User size={20} />
              <div>
                <h2>Player Profile</h2>
                <p>This is used for your recruiting fit and coach email drafts.</p>
              </div>
            </div>

            <div className="form-grid">
              <Field label="Name" value={profile.name} onChange={(value) => updateProfile({ name: value })} />
              <Field label="Graduation Year" value={profile.gradYear} onChange={(value) => updateProfile({ gradYear: value })} />
              <Field label="Position" value={profile.position} onChange={(value) => updateProfile({ position: value })} placeholder="OH, MB, S, RS, Libero..." />
              <Field label="Height" value={profile.height} onChange={(value) => updateProfile({ height: value })} placeholder="6'0&quot;" />
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

            <MultiToggle
              label="Possible Majors"
              options={MAJOR_OPTIONS}
              values={profile.possibleMajors}
              onChange={(values) => {
                updateProfile({ possibleMajors: values });
                updatePrefs({ majors: values });
              }}
            />

            <h3 className="subhead">Coach Reference</h3>
            <div className="form-grid">
              <Field label="Coach Name" value={profile.coachReferenceName} onChange={(value) => updateProfile({ coachReferenceName: value })} />
              <Field label="Coach Role" value={profile.coachReferenceRole} onChange={(value) => updateProfile({ coachReferenceRole: value })} placeholder="High school coach / club coach" />
              <Field label="Coach Email" value={profile.coachReferenceEmail} onChange={(value) => updateProfile({ coachReferenceEmail: value })} />
              <Field label="Coach Phone" value={profile.coachReferencePhone} onChange={(value) => updateProfile({ coachReferencePhone: value })} />
            </div>
          </section>
        </main>
      )}

      {activeTab === 'prefs' && (
        <main className="single-panel">
          <section className="panel">
            <div className="panel-title">
              <SlidersHorizontal size={20} />
              <div>
                <h2>Preferences</h2>
                <p>This is the Discovery Mode part. Pick what you care about, then the app ranks schools for you.</p>
              </div>
            </div>

            <div className="form-grid">
              <SelectField label="Division" value={prefs.division} onChange={(value) => updatePrefs({ division: value })} options={['D3', 'D2', 'D1']} />
              <SelectField label="Christian Fit" value={prefs.christianFit} onChange={(value) => updatePrefs({ christianFit: value })} options={['Required', 'Preferred', 'Bonus', 'Does not matter']} />
              <SelectField label="Academic Level" value={prefs.academicLevel} onChange={(value) => updatePrefs({ academicLevel: value })} options={['Elite', 'Strong', 'Balanced']} />
              <SelectField label="Campus Size" value={prefs.campusSize} onChange={(value) => updatePrefs({ campusSize: value })} options={['Any', 'Small', 'Medium', 'Large']} />
              <SelectField label="Competition Level" value={prefs.competitionLevel} onChange={(value) => updatePrefs({ competitionLevel: value })} options={['Very Competitive', 'Competitive', 'Realistic Playing Time', 'Balanced']} />
              <SelectField label="Playing Time Priority" value={prefs.playingTimePriority} onChange={(value) => updatePrefs({ playingTimePriority: value })} options={['Balanced', 'Play Early', 'Highest Competition']} />
              <SelectField label="Distance" value={prefs.maxDistance} onChange={(value) => updatePrefs({ maxDistance: value })} options={['Close', 'Flexible', 'Anywhere']} />
            </div>

            <MultiToggle label="Preferred States" options={ALL_STATES} values={prefs.states} onChange={(values) => updatePrefs({ states: values })} />
            <MultiToggle label="Major Fit" options={MAJOR_OPTIONS} values={prefs.majors} onChange={(values) => updatePrefs({ majors: values })} />

            <div className="danger-zone">
              <button className="danger" onClick={resetSavedData}><RotateCcw size={18} /> Reset Saved Local Data</button>
            </div>
          </section>
        </main>
      )}

      {activeTab === 'algorithm' && (
        <main className="single-panel">
          <section className="panel">
            <div className="panel-title">
              <ClipboardList size={20} />
              <div>
                <h2>Fit Score Algorithm</h2>
                <p>Spend your 100 points like a 2K build. Sliders stay where you put them, and you manually lower one if you want more points back.</p>
              </div>
            </div>

            <div className="budget-bar">
              <div>
                <span>Points Used</span>
                <strong>{totalWeightUsed} / 100</strong>
              </div>
              <div>
                <span>Points Left</span>
                <strong className={pointsRemaining === 0 ? 'ready' : ''}>{pointsRemaining}</strong>
              </div>
              <div className="budget-actions">
                <button className="secondary small" onClick={resetWeightsToZero}>Reset Build</button>
                <button className="primary small" onClick={useRecommendedWeights}>Use Recommended</button>
              </div>
            </div>

            <div className="algorithm-grid">
              {Object.entries(weights).map(([key, value]) => (
                <label className="weight-card" key={key}>
                  <span>{key}</span>
                  <strong>{value} pts</strong>
                  <small>
                    Points left: {pointsRemaining} | Max for this: {Math.min(30, value + pointsRemaining)}
                  </small>

                  <div className="weight-controls">
                    <button
                      type="button"
                      className="secondary tiny"
                      onClick={() => updateWeightsBudget(key, value - 1)}
                    >
                      −
                    </button>

                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={value}
                      onChange={(e) => updateWeightsBudget(key, Number(e.target.value))}
                    />

                    <button
                      type="button"
                      className="secondary tiny"
                      onClick={() => updateWeightsBudget(key, value + 1)}
                    >
                      +
                    </button>
                  </div>

                  <input
                    className="weight-number"
                    type="number"
                    min="0"
                    max={Math.min(30, value + pointsRemaining)}
                    value={value}
                    onChange={(e) => updateWeightsBudget(key, Number(e.target.value))}
                  />
                </label>
              ))}
            </div>

            <div className="formula-card">
              <h3>How it works</h3>
              <p>
                You start with 100 points to spend across the categories. A slider can only go higher if you have points left. Nothing moves automatically. If you want more points, manually lower another category.
              </p>
              <div className="tier-list">
                <span><CheckCircle2 /> 85–100: Priority A+</span>
                <span><Target /> 75–84: Strong Target</span>
                <span><AlertCircle /> 65–74: Watchlist</span>
                <span><NotebookPen /> 50–64: Backup</span>
                <span><XCircle /> Under 50: Skip for now</span>
              </div>
            </div>


            <div className="rating-guide">
              <div className="rating-guide-head">
                <h3>Rating Scale Guide</h3>
                <p>
                  This explains what a low rating vs. a high rating means when the app scores each school.
                  Think of it like: low = not a strong fit, high = strong fit for Jackson.
                </p>
              </div>

              <div className="rating-grid">
                {RATING_SCALE_GUIDE.map((item) => (
                  <div className="rating-card" key={item.key}>
                    <div className="rating-card-title">
                      <span>{item.title}</span>
                      <strong>0–100</strong>
                    </div>

                    <div className="rating-row low">
                      <b>Low Rating</b>
                      <p>{item.low}</p>
                    </div>

                    <div className="rating-row high">
                      <b>High Rating</b>
                      <p>{item.high}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}
    </div>
  );
}

function buildAIPlayerProfile(profile, prefs) {
  const coachReference = [
    profile.coachReferenceName,
    profile.coachReferenceRole,
    profile.coachReferenceEmail,
    profile.coachReferencePhone,
  ]
    .filter(Boolean)
    .join(' - ');

  return {
    name: profile.name || 'Jackson DeMarco',
    gradYear: profile.gradYear || '',
    position: profile.position || '',
    height: profile.height || '',
    vertical: profile.vertical || '',
    approachTouch: profile.approachTouch || '',
    standingReach: profile.standingReach || '',
    gpa: profile.gpa || '',
    highSchool: profile.highSchool || '',
    clubTeam: profile.clubTeam || '',
    academicInterests: (profile.possibleMajors || prefs.majors || []).join(', '),
    highlightLink: profile.videoLink || '',
    coachReferences: coachReference,
    email: profile.email || '',
    phone: profile.phone || '',
  };
}

function buildAISchoolProfile(school, prefs) {
  return {
    schoolName: school.name || '',
    coachName: '',
    coachEmail: school.coachEmail || '',
    programLevel: school.division || prefs.division || '',
    majorFit: (school.majors || []).join(', '),
    whyInterested: school.notes || '',
    programNotes: `${school.name} is a ${school.division || ''} men's volleyball program in ${school.city ? `${school.city}, ` : ''}${school.state || ''}. Fit tier: ${school.score?.tier || ''}. Fit score: ${school.score?.total || ''}.`,
    teamNotes: `Christian fit: ${school.christian ? 'Yes' : 'No'}. Campus size: ${school.campusSize || ''}. Volleyball score: ${school.volleyballScore || ''}. Recruiting fit: ${school.recruitingFit || ''}. Opportunity score: ${school.opportunityScore || ''}.`,
    websiteUrl: school.website || '',
  };
}

function SchoolCard({ school, profile, prefs, updateProgress, makeEmailDraft, removeCustomSchool, updateCustomSchool }) {
  const [showDraft, setShowDraft] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [aiDraft, setAiDraft] = useState(null);
  const [draftError, setDraftError] = useState('');
  const progress = school.progress;

  const tierClass = school.score.total >= 85 ? 'elite' : school.score.total >= 75 ? 'strong' : school.score.total >= 65 ? 'watch' : 'backup';

  async function generateAIDraft() {
    setShowDraft(true);
    setCopied(false);
    setDraftError('');

    if (aiDraft) return;

    setIsGeneratingDraft(true);

    try {
      const email = await generateRecruitingEmail({
        playerProfile: buildAIPlayerProfile(profile, prefs),
        schoolProfile: buildAISchoolProfile(school, prefs),
        emailType: 'intro',
        tone: 'confident, respectful, natural, motivated, not robotic, like a high school volleyball player wrote it',
        includeWebResearch: true,
      });

      setAiDraft(email);
      updateProgress(school.id, { emailStatus: 'Draft ready' });
    } catch (error) {
      setDraftError(error.message || 'AI draft failed, so the regular draft is shown instead.');
      setAiDraft({
        subject: `${profile.gradYear || '[Grad Year]'} ${profile.position || '[Position]'} Interested in ${school.name} Men's Volleyball`,
        body: makeEmailDraft(school),
        personalizationScore: 35,
        personalizationLevel: 'Low',
        whyThisIsPersonal: 'This is the regular fallback draft because the AI draft could not be generated.',
        personalDetailsUsed: ['Saved player profile'],
        programDetailsUsed: ['School name and saved school notes'],
        editSuggestions: ['Add one specific reason you like this program before sending.'],
        warnings: ['AI generation was unavailable for this draft.'],
      });
    } finally {
      setIsGeneratingDraft(false);
    }
  }

  function updateDraftSubject(value) {
    setAiDraft((current) => ({
      ...(current || {}),
      subject: value,
    }));
  }

  function updateDraftBody(value) {
    setAiDraft((current) => ({
      ...(current || {}),
      body: value,
    }));
  }

  async function copyDraft() {
    const subject = aiDraft?.subject || `${profile.gradYear || '[Grad Year]'} ${profile.position || '[Position]'} Interested in ${school.name} Men's Volleyball`;
    const body = aiDraft?.body || makeEmailDraft(school);
    const draft = `Subject: ${subject}\n\n${body}`;

    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      updateProgress(school.id, { emailStatus: 'Draft ready' });
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.alert('Copy failed. You can still select and copy the draft manually.');
    }
  }

  return (
    <article className="school-card">
      <div className="school-top">
        <div>
          <div className="school-meta">
            <span><MapPin size={15} /> {school.city ? `${school.city}, ` : ''}{school.state}</span>
            <span><GraduationCap size={15} /> {school.division}</span>
            {school.christian && <span><Cross size={15} /> Christian fit</span>}
          </div>
          <h2>{school.name}</h2>
          <p>{school.notes}</p>
        </div>

        <div className={cn('score-badge', tierClass)}>
          <strong>{school.score.total}</strong>
          <span>{school.score.tier}</span>
        </div>
      </div>

      <div className="school-actions">
        <button
          className={cn('icon-button', progress.favorite && 'favorited')}
          onClick={() => updateProgress(school.id, { favorite: !progress.favorite })}
        >
          <Star size={18} fill={progress.favorite ? 'currentColor' : 'none'} />
          {progress.favorite ? 'Favorited' : 'Favorite'}
        </button>

        <select value={progress.emailStatus} onChange={(e) => updateProgress(school.id, { emailStatus: e.target.value })}>
          {EMAIL_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>

        {school.website && (
          <a className="link-button" href={school.website} target="_blank" rel="noreferrer">
            Team Site <ExternalLink size={16} />
          </a>
        )}

        <button className="secondary small" onClick={generateAIDraft} disabled={isGeneratingDraft}>
          <Mail size={17} /> {isGeneratingDraft ? 'Generating AI Draft...' : 'Email Draft'}
        </button>

        {school.custom && (
          <button className="danger small" onClick={() => removeCustomSchool(school.id)}><Trash2 size={16} /> Delete</button>
        )}
      </div>

      <div className="breakdown">
        {Object.entries(school.score.breakdown).map(([key, value]) => (
          <div key={key} className="breakdown-item">
            <span>{key}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <div className="details-grid">
        <div>
          <h4><BookOpen size={16} /> Majors</h4>
          <p>{school.majors.join(', ')}</p>
        </div>
        <div>
          <h4><Target size={16} /> Next Action</h4>
          <p>{school.score.action}</p>
        </div>
      </div>

      {school.custom && (
        <div className="custom-edit">
          <Field label="City" value={school.city} onChange={(value) => updateCustomSchool(school.id, { city: value })} />
          <Field label="State" value={school.state} onChange={(value) => updateCustomSchool(school.id, { state: value })} />
          <Field label="Website" value={school.website} onChange={(value) => updateCustomSchool(school.id, { website: value })} />
          <Field label="Majors, comma separated" value={school.majors.join(', ')} onChange={(value) => updateCustomSchool(school.id, { majors: value.split(',').map((x) => x.trim()).filter(Boolean) })} />
        </div>
      )}

      <label className="notes-box">
        <span><NotebookPen size={16} /> My Notes</span>
        <textarea
          value={progress.notes}
          onChange={(e) => updateProgress(school.id, { notes: e.target.value })}
          placeholder="Coach replied, camp date, roster notes, what you like, what to ask next..."
        />
      </label>

      <label className="field last-contact">
        <span>Last Contact / Follow-up Date</span>
        <input value={progress.lastContact} onChange={(e) => updateProgress(school.id, { lastContact: e.target.value })} placeholder="ex: emailed 6/9, follow up after camp" />
      </label>

      {showDraft && (
        <div className="draft-box ai-draft-box">
          <div className="draft-head">
            <div>
              <h3>AI Coach Email Draft</h3>
              <p className="draft-helper">Generated for {school.name}. Review and edit before sending.</p>
            </div>
            <div className="draft-actions">
              <button className="secondary small" onClick={() => setAiDraft(null)} disabled={isGeneratingDraft}>Regenerate Next Click</button>
              <button className="primary small" onClick={copyDraft}>{copied ? 'Copied!' : 'Copy Draft'}</button>
            </div>
          </div>

          {draftError && <p className="draft-error">{draftError}</p>}
          {isGeneratingDraft && <p className="draft-loading">Building a personalized draft with your profile and this school...</p>}

          {aiDraft && (
            <>
              <label className="field">
                <span>Subject</span>
                <input value={aiDraft.subject || ''} onChange={(e) => updateDraftSubject(e.target.value)} />
              </label>

              <label className="field">
                <span>Email Body</span>
                <textarea
                  className="ai-draft-textarea"
                  value={aiDraft.body || ''}
                  onChange={(e) => updateDraftBody(e.target.value)}
                />
              </label>

              <div className="ai-draft-meta">
                <div>
                  <span>Personalization</span>
                  <strong>{aiDraft.personalizationScore || 0}/100</strong>
                  <small>{aiDraft.personalizationLevel || 'Low'}</small>
                </div>

                {aiDraft.whyThisIsPersonal && (
                  <div className="ai-draft-wide">
                    <span>Why this is personal</span>
                    <p>{aiDraft.whyThisIsPersonal}</p>
                  </div>
                )}
              </div>

              {aiDraft.editSuggestions?.length > 0 && (
                <div className="ai-draft-suggestions">
                  <strong>Edit Suggestions</strong>
                  <ul>
                    {aiDraft.editSuggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </article>
  );
}

export default App;