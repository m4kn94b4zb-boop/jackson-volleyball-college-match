
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
  MessageCircle,
  Send,
} from 'lucide-react';
import { generateRecruitingEmail } from './lib/generateRecruitingEmail';
import { chatRecruitingEmail } from './lib/chatRecruitingEmail';

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
  playerNotes: '',
};

const DEFAULT_PREFS = {
  division: 'Any Division',
  states: ['Pennsylvania', 'Ohio', 'New York', 'New Jersey', 'Maryland', 'Virginia', 'West Virginia'],
  maxDistance: 'Flexible',
  christianFit: 'Preferred',
  academicLevel: 'Strong',
  campusSize: 'Any',
  competitionLevel: 'Competitive',
  playingTimePriority: 'Balanced',
  fitStrictness: 'Show all ranked',
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
    id: 'grove-city-college',
    name: "Grove City College",
    division: "NCAA D3",
    state: "Pennsylvania",
    city: "Grove City",
    christian: true,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 66,
    campusSize: "Small",
    majors: ["Exercise Science", "Business", "Computer Science", "Mechanical Engineering", "Education"],
    coachEmail: '',
    website: "https://athletics.gcc.edu/sports/mens-volleyball",
    notes: "Strong Christian fit. You have already been to camp before and are planning to go again this summer.",
  },
  {
    id: 'messiah-university',
    name: "Messiah University",
    division: "NCAA D3",
    state: "Pennsylvania",
    city: "Mechanicsburg",
    christian: true,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 66,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences", "Engineering"],
    coachEmail: '',
    website: "https://gomessiah.com/sports/mens-volleyball",
    notes: "Christian university with strong academics and a good athletics environment.",
  },
  {
    id: 'saint-vincent-college',
    name: "Saint Vincent College",
    division: "NCAA D3",
    state: "Pennsylvania",
    city: "Latrobe",
    christian: true,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 66,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences", "Engineering"],
    coachEmail: '',
    website: "https://athletics.stvincent.edu/",
    notes: "Christian/Catholic environment, close to home, and could be a realistic fit.",
  },
  {
    id: 'juniata-college',
    name: "Juniata College",
    division: "NCAA D3",
    state: "Pennsylvania",
    city: "Huntingdon",
    christian: false,
    academicScore: 76,
    volleyballScore: 86,
    recruitingFit: 68,
    opportunityScore: 67,
    personalInterest: 66,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Health Professions"],
    coachEmail: '',
    website: "https://juniatasports.net/sports/mens-volleyball",
    notes: "Very competitive volleyball school. Strong volleyball score, but recruiting fit may be harder.",
  },
  {
    id: 'thiel-college',
    name: "Thiel College",
    division: "NCAA D3",
    state: "Pennsylvania",
    city: "Greenville",
    christian: false,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 66,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://thielathletics.com/sports/mens-volleyball",
    notes: "Nearby D3 option with potentially realistic recruiting fit and playing opportunity.",
  },
  {
    id: 'arcadia-university',
    name: "Arcadia University",
    division: "NCAA D3",
    state: "Pennsylvania",
    city: "Glenside",
    christian: false,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 66,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Health Sciences"],
    coachEmail: '',
    website: "https://arcadiaknights.com/sports/mens-volleyball",
    notes: "Solid academic and volleyball option in Pennsylvania.",
  },
  {
    id: 'wilson-college',
    name: "Wilson College",
    division: "NCAA D3",
    state: "Pennsylvania",
    city: "Chambersburg",
    christian: false,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 66,
    campusSize: "Small",
    majors: ["Exercise Science", "Business", "Education"],
    coachEmail: '',
    website: "https://wilsonphoenix.com/",
    notes: "Possible backup/watchlist school depending on fit and roster needs.",
  },
  {
    id: 'stevenson-university',
    name: "Stevenson University",
    division: "NCAA D3",
    state: "Maryland",
    city: "Owings Mills",
    christian: false,
    academicScore: 95,
    volleyballScore: 76,
    recruitingFit: 64,
    opportunityScore: 74,
    personalInterest: 66,
    campusSize: "Medium",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://gomustangsports.com/sports/mens-volleyball",
    notes: "Competitive D3 option with multiple major fits.",
  },
  {
    id: 'southern-virginia-university',
    name: "Southern Virginia University",
    division: "NCAA D3",
    state: "Virginia",
    city: "Buena Vista",
    christian: true,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 66,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://knightathletics.com/sports/mens-volleyball",
    notes: "Faith-friendly D3 option with possible culture fit.",
  },
  {
    id: 'eastern-mennonite-university',
    name: "Eastern Mennonite University",
    division: "NCAA D3",
    state: "Virginia",
    city: "Harrisonburg",
    christian: true,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 66,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://emuroyals.com/sports/mens-volleyball",
    notes: "Christian/Mennonite environment and D3 volleyball option.",
  },
  {
    id: 'marymount-university',
    name: "Marymount University",
    division: "NCAA D3",
    state: "Virginia",
    city: "Arlington",
    christian: false,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 66,
    campusSize: "Medium",
    majors: ["Business", "Computer Science", "Health Sciences", "Education"],
    coachEmail: '',
    website: "https://marymountsaints.com/sports/mens-volleyball",
    notes: "D3 program near Washington, DC with several major options.",
  },
  {
    id: 'stevens-institute-of-technology',
    name: "Stevens Institute of Technology",
    division: "NCAA D3",
    state: "New Jersey",
    city: "Hoboken",
    christian: false,
    academicScore: 95,
    volleyballScore: 76,
    recruitingFit: 64,
    opportunityScore: 74,
    personalInterest: 66,
    campusSize: "Medium",
    majors: ["Computer Science", "Engineering", "Business", "Data Science", "Mathematics"],
    coachEmail: '',
    website: "https://stevensducks.com/sports/mens-volleyball",
    notes: "High academics and strong volleyball. More of a reach depending on academics and volleyball level.",
  },
  {
    id: 'rutgers-newark',
    name: "Rutgers-Newark",
    division: "NCAA D3",
    state: "New Jersey",
    city: "Newark",
    christian: false,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 66,
    campusSize: "Medium",
    majors: ["Business", "Computer Science", "Education", "Engineering"],
    coachEmail: '',
    website: "https://rutgersnewarkathletics.com/sports/mens-volleyball",
    notes: "Competitive volleyball and strong public university academics.",
  },
  {
    id: 'kean-university',
    name: "Kean University",
    division: "NCAA D3",
    state: "New Jersey",
    city: "Union",
    christian: false,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 66,
    campusSize: "Medium",
    majors: ["Business", "Computer Science", "Education", "Psychology", "Communications"],
    coachEmail: '',
    website: "https://keanathletics.com/sports/mens-volleyball",
    notes: "New Jersey D3 option with competitive volleyball.",
  },
  {
    id: 'ramapo-college',
    name: "Ramapo College",
    division: "NCAA D3",
    state: "New Jersey",
    city: "Mahwah",
    christian: false,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 66,
    campusSize: "Medium",
    majors: ["Business", "Computer Science", "Education", "Psychology", "Communications"],
    coachEmail: '',
    website: "https://ramapoathletics.com/sports/mens-volleyball",
    notes: "New Jersey public college option with D3 volleyball.",
  },
  {
    id: 'new-jersey-city-university',
    name: "New Jersey City University",
    division: "NCAA D3",
    state: "New Jersey",
    city: "Jersey City",
    christian: false,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 66,
    campusSize: "Medium",
    majors: ["Business", "Computer Science", "Education", "Psychology", "Communications"],
    coachEmail: '',
    website: "https://njcugothicknights.com/sports/mens-volleyball",
    notes: "Urban New Jersey D3 option.",
  },
  {
    id: 'new-york-university',
    name: "New York University",
    division: "NCAA D3",
    state: "New York",
    city: "New York",
    christian: false,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 66,
    campusSize: "Large",
    majors: ["Business", "Computer Science", "Education", "Engineering", "Sports Management"],
    coachEmail: '',
    website: "https://gonyuathletics.com/sports/mens-volleyball",
    notes: "Elite academics and strong volleyball, but likely a harder recruiting and culture fit.",
  },
  {
    id: 'vassar-college',
    name: "Vassar College",
    division: "NCAA D3",
    state: "New York",
    city: "Poughkeepsie",
    christian: false,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 66,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Psychology", "Communications"],
    coachEmail: '',
    website: "https://www.vassarathletics.com/sports/mens-volleyball",
    notes: "High-academic D3 program in New York.",
  },
  {
    id: 'suny-new-paltz',
    name: "SUNY New Paltz",
    division: "NCAA D3",
    state: "New York",
    city: "New Paltz",
    christian: false,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 66,
    campusSize: "Medium",
    majors: ["Business", "Computer Science", "Education", "Psychology", "Communications"],
    coachEmail: '',
    website: "https://nphawks.com/sports/mens-volleyball",
    notes: "Very strong D3 volleyball option in New York.",
  },
  {
    id: 'nazareth-university',
    name: "Nazareth University",
    division: "NCAA D3",
    state: "New York",
    city: "Rochester",
    christian: false,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 66,
    campusSize: "Small",
    majors: ["Exercise Science", "Health Sciences", "Biology", "Psychology", "Business"],
    coachEmail: '',
    website: "https://nazathletics.com/sports/mens-volleyball",
    notes: "Solid New York D3 option with health and education majors.",
  },
  {
    id: 'st-john-fisher-university',
    name: "St. John Fisher University",
    division: "NCAA D3",
    state: "New York",
    city: "Rochester",
    christian: false,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 66,
    campusSize: "Small",
    majors: ["Exercise Science", "Health Sciences", "Biology", "Psychology", "Business"],
    coachEmail: '',
    website: "https://sjfathletics.com/sports/mens-volleyball",
    notes: "New York D3 option with strong student support.",
  },
  {
    id: 'elmira-college',
    name: "Elmira College",
    division: "NCAA D3",
    state: "New York",
    city: "Elmira",
    christian: false,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 66,
    campusSize: "Small",
    majors: ["Business", "Education", "Computer Science"],
    coachEmail: '',
    website: "https://athletics.elmira.edu/sports/mens-volleyball",
    notes: "Potential watchlist school if New York is okay.",
  },
  {
    id: 'bard-college',
    name: "Bard College",
    division: "NCAA D3",
    state: "New York",
    city: "Annandale-on-Hudson",
    christian: false,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 66,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Psychology", "Communications"],
    coachEmail: '',
    website: "https://bardathletics.com/sports/mens-volleyball",
    notes: "Small liberal arts D3 option.",
  },
  {
    id: 'baruch-college',
    name: "Baruch College",
    division: "NCAA D3",
    state: "New York",
    city: "New York",
    christian: false,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 66,
    campusSize: "Large",
    majors: ["Business", "Computer Science", "Data Science", "Psychology"],
    coachEmail: '',
    website: "https://athletics.baruch.cuny.edu/sports/mens-volleyball",
    notes: "Urban New York D3 option with business strength.",
  },
  {
    id: 'hunter-college',
    name: "Hunter College",
    division: "NCAA D3",
    state: "New York",
    city: "New York",
    christian: false,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 66,
    campusSize: "Large",
    majors: ["Business", "Computer Science", "Education", "Psychology", "Communications"],
    coachEmail: '',
    website: "https://www.huntercollegeathletics.com/sports/mens-volleyball",
    notes: "CUNY D3 option in New York City.",
  },
  {
    id: 'springfield-college',
    name: "Springfield College",
    division: "NCAA D3",
    state: "Massachusetts",
    city: "Springfield",
    christian: false,
    academicScore: 76,
    volleyballScore: 86,
    recruitingFit: 68,
    opportunityScore: 67,
    personalInterest: 58,
    campusSize: "Small",
    majors: ["Exercise Science", "Sports Management", "Business", "Education", "Health Sciences"],
    coachEmail: '',
    website: "https://springfieldcollegepride.com/sports/mens-volleyball",
    notes: "Very strong volleyball tradition and exercise/sport-related majors.",
  },
  {
    id: 'mit',
    name: "MIT",
    division: "NCAA D3",
    state: "Massachusetts",
    city: "Cambridge",
    christian: false,
    academicScore: 100,
    volleyballScore: 76,
    recruitingFit: 64,
    opportunityScore: 74,
    personalInterest: 58,
    campusSize: "Medium",
    majors: ["Computer Science", "Engineering", "Business", "Data Science", "Mathematics"],
    coachEmail: '',
    website: "https://mitathletics.com/sports/mens-volleyball",
    notes: "Elite academics and difficult recruiting fit.",
  },
  {
    id: 'wentworth-institute-of-technology',
    name: "Wentworth Institute of Technology",
    division: "NCAA D3",
    state: "Massachusetts",
    city: "Boston",
    christian: false,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 58,
    campusSize: "Small",
    majors: ["Computer Science", "Engineering", "Business", "Data Science", "Mathematics"],
    coachEmail: '',
    website: "https://wentworthathletics.com/sports/mens-volleyball",
    notes: "Technical school with D3 volleyball.",
  },
  {
    id: 'lasell-university',
    name: "Lasell University",
    division: "NCAA D3",
    state: "Massachusetts",
    city: "Newton",
    christian: false,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 58,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Psychology", "Communications"],
    coachEmail: '',
    website: "https://laserpride.lasell.edu/sports/mens-volleyball",
    notes: "D3 option near Boston.",
  },
  {
    id: 'endicott-college',
    name: "Endicott College",
    division: "NCAA D3",
    state: "Massachusetts",
    city: "Beverly",
    christian: false,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 58,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Sport Management"],
    coachEmail: '',
    website: "https://www.ecgulls.com/sports/mvball",
    notes: "Competitive New England D3 option.",
  },
  {
    id: 'nichols-college',
    name: "Nichols College",
    division: "NCAA D3",
    state: "Massachusetts",
    city: "Dudley",
    christian: false,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 58,
    campusSize: "Small",
    majors: ["Business", "Sport Management", "Psychology", "Criminal Justice"],
    coachEmail: '',
    website: "https://nicholsathletics.com/sports/mens-volleyball",
    notes: "Possible D3 watchlist school.",
  },
  {
    id: 'rivier-university',
    name: "Rivier University",
    division: "NCAA D3",
    state: "New Hampshire",
    city: "Nashua",
    christian: false,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 58,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Psychology", "Communications"],
    coachEmail: '',
    website: "https://rivierathletics.com/sports/mens-volleyball",
    notes: "New Hampshire D3 option.",
  },
  {
    id: 'north-central-college',
    name: "North Central College",
    division: "NCAA D3",
    state: "Illinois",
    city: "Naperville",
    christian: false,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 58,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://northcentralcardinals.com/sports/mens-volleyball",
    notes: "Competitive Midwest D3 option.",
  },
  {
    id: 'carthage-college',
    name: "Carthage College",
    division: "NCAA D3",
    state: "Wisconsin",
    city: "Kenosha",
    christian: false,
    academicScore: 76,
    volleyballScore: 86,
    recruitingFit: 68,
    opportunityScore: 67,
    personalInterest: 58,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://athletics.carthage.edu/sports/mens-volleyball",
    notes: "Very strong D3 volleyball option.",
  },
  {
    id: 'msoe',
    name: "MSOE",
    division: "NCAA D3",
    state: "Wisconsin",
    city: "Milwaukee",
    christian: false,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 58,
    campusSize: "Small",
    majors: ["Computer Science", "Engineering", "Business", "Data Science", "Mathematics"],
    coachEmail: '',
    website: "https://msoeraiders.com/sports/mens-volleyball",
    notes: "Technical school D3 option.",
  },
  {
    id: 'dominican-university',
    name: "Dominican University",
    division: "NCAA D3",
    state: "Illinois",
    city: "River Forest",
    christian: false,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 58,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Psychology", "Communications"],
    coachEmail: '',
    website: "https://dustars.com/sports/mens-volleyball",
    notes: "Competitive Illinois D3 option.",
  },
  {
    id: 'aurora-university',
    name: "Aurora University",
    division: "NCAA D3",
    state: "Illinois",
    city: "Aurora",
    christian: false,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 58,
    campusSize: "Medium",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://athletics.aurora.edu/sports/mens-volleyball",
    notes: "D3 option with many majors.",
  },
  {
    id: 'trine-university',
    name: "Trine University",
    division: "NCAA D3",
    state: "Indiana",
    city: "Angola",
    christian: false,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 58,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Engineering", "Exercise Science", "Education"],
    coachEmail: '',
    website: "https://trinethunder.com/sports/mens-volleyball",
    notes: "Midwest D3 option with engineering and business.",
  },
  {
    id: 'wabash-college',
    name: "Wabash College",
    division: "NCAA D3",
    state: "Indiana",
    city: "Crawfordsville",
    christian: false,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 58,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Psychology", "Communications"],
    coachEmail: '',
    website: "https://sports.wabash.edu/sports/mens-volleyball",
    notes: "Small Indiana D3 option.",
  },
  {
    id: 'university-of-mount-union',
    name: "University of Mount Union",
    division: "NCAA D3",
    state: "Ohio",
    city: "Alliance",
    christian: false,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 66,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://athletics.mountunion.edu/sports/mens-volleyball",
    notes: "Ohio D3 option with balanced fit.",
  },
  {
    id: 'baldwin-wallace-university',
    name: "Baldwin Wallace University",
    division: "NCAA D3",
    state: "Ohio",
    city: "Berea",
    christian: false,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 66,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://bwyellowjackets.com/sports/mens-volleyball",
    notes: "Ohio D3 option near Cleveland.",
  },
  {
    id: 'hiram-college',
    name: "Hiram College",
    division: "NCAA D3",
    state: "Ohio",
    city: "Hiram",
    christian: false,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 66,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Psychology", "Communications"],
    coachEmail: '',
    website: "https://hiramterriers.com/sports/mens-volleyball",
    notes: "Possible playing-opportunity fit in Ohio.",
  },
  {
    id: 'wittenberg-university',
    name: "Wittenberg University",
    division: "NCAA D3",
    state: "Ohio",
    city: "Springfield",
    christian: false,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 66,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Psychology", "Communications"],
    coachEmail: '',
    website: "https://wittenbergtigers.com/sports/mens-volleyball",
    notes: "Ohio D3 liberal arts option.",
  },
  {
    id: 'adrian-college',
    name: "Adrian College",
    division: "NCAA D3",
    state: "Michigan",
    city: "Adrian",
    christian: false,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 58,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://adrianbulldogs.com/sports/mens-volleyball",
    notes: "Michigan D3 option.",
  },
  {
    id: 'calvin-university',
    name: "Calvin University",
    division: "NCAA D3",
    state: "Michigan",
    city: "Grand Rapids",
    christian: true,
    academicScore: 76,
    volleyballScore: 76,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 58,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Engineering", "Exercise Science"],
    coachEmail: '',
    website: "https://calvinknights.com/sports/mens-volleyball",
    notes: "Christian college option with strong academics.",
  },
  {
    id: 'penn-state',
    name: "Penn State",
    division: "NCAA D1",
    state: "Pennsylvania",
    city: "University Park",
    christian: false,
    academicScore: 82,
    volleyballScore: 86,
    recruitingFit: 62,
    opportunityScore: 55,
    personalInterest: 64,
    campusSize: "Large",
    majors: ["Business", "Computer Science", "Engineering", "Kinesiology", "Education"],
    coachEmail: '',
    website: "https://gopsusports.com/sports/mens-volleyball",
    notes: "High-level NCAA program and likely a reach athletically.",
  },
  {
    id: 'ohio-state-university',
    name: "Ohio State University",
    division: "NCAA D1",
    state: "Ohio",
    city: "Columbus",
    christian: false,
    academicScore: 82,
    volleyballScore: 86,
    recruitingFit: 62,
    opportunityScore: 55,
    personalInterest: 64,
    campusSize: "Large",
    majors: ["Business", "Computer Science", "Engineering", "Exercise Science", "Education"],
    coachEmail: '',
    website: "https://ohiostatebuckeyes.com/sports/mens-volleyball",
    notes: "Big Ten school with high-level volleyball.",
  },
  {
    id: 'ball-state-university',
    name: "Ball State University",
    division: "NCAA D1",
    state: "Indiana",
    city: "Muncie",
    christian: false,
    academicScore: 82,
    volleyballScore: 86,
    recruitingFit: 62,
    opportunityScore: 55,
    personalInterest: 56,
    campusSize: "Large",
    majors: ["Business", "Computer Science", "Exercise Science", "Education"],
    coachEmail: '',
    website: "https://ballstatesports.com/sports/mens-volleyball",
    notes: "Strong Midwest NCAA program.",
  },
  {
    id: 'loyola-chicago',
    name: "Loyola Chicago",
    division: "NCAA D1",
    state: "Illinois",
    city: "Chicago",
    christian: false,
    academicScore: 82,
    volleyballScore: 86,
    recruitingFit: 62,
    opportunityScore: 55,
    personalInterest: 56,
    campusSize: "Large",
    majors: ["Business", "Computer Science", "Health Sciences", "Education"],
    coachEmail: '',
    website: "https://loyolaramblers.com/sports/mens-volleyball",
    notes: "High-level NCAA program in Chicago.",
  },
  {
    id: 'lewis-university',
    name: "Lewis University",
    division: "NCAA D1",
    state: "Illinois",
    city: "Romeoville",
    christian: false,
    academicScore: 82,
    volleyballScore: 86,
    recruitingFit: 62,
    opportunityScore: 55,
    personalInterest: 56,
    campusSize: "Medium",
    majors: ["Business", "Computer Science", "Aviation", "Education", "Health Sciences"],
    coachEmail: '',
    website: "https://lewisflyers.com/sports/mens-volleyball",
    notes: "Competitive NCAA men\u2019s volleyball option.",
  },
  {
    id: 'lindenwood-university',
    name: "Lindenwood University",
    division: "NCAA D1",
    state: "Missouri",
    city: "Saint Charles",
    christian: false,
    academicScore: 82,
    volleyballScore: 86,
    recruitingFit: 62,
    opportunityScore: 55,
    personalInterest: 56,
    campusSize: "Medium",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://lindenwoodlions.com/sports/mens-volleyball",
    notes: "NCAA men\u2019s volleyball option in Missouri.",
  },
  {
    id: 'mckendree-university',
    name: "McKendree University",
    division: "NCAA D1",
    state: "Illinois",
    city: "Lebanon",
    christian: false,
    academicScore: 82,
    volleyballScore: 86,
    recruitingFit: 62,
    opportunityScore: 55,
    personalInterest: 56,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://mckbearcats.com/sports/mens-volleyball",
    notes: "NCAA men\u2019s volleyball option with potentially more realistic fit than top powers.",
  },
  {
    id: 'princeton-university',
    name: "Princeton University",
    division: "NCAA D1",
    state: "New Jersey",
    city: "Princeton",
    christian: false,
    academicScore: 95,
    volleyballScore: 86,
    recruitingFit: 50,
    opportunityScore: 55,
    personalInterest: 64,
    campusSize: "Medium",
    majors: ["Computer Science", "Engineering", "Business", "Data Science", "Mathematics", "Public Policy"],
    coachEmail: '',
    website: "https://goprincetontigers.com/sports/mens-volleyball",
    notes: "Elite academics and very difficult recruiting fit.",
  },
  {
    id: 'harvard-university',
    name: "Harvard University",
    division: "NCAA D1",
    state: "Massachusetts",
    city: "Cambridge",
    christian: false,
    academicScore: 95,
    volleyballScore: 86,
    recruitingFit: 50,
    opportunityScore: 55,
    personalInterest: 56,
    campusSize: "Medium",
    majors: ["Computer Science", "Engineering", "Business", "Data Science", "Mathematics", "Economics"],
    coachEmail: '',
    website: "https://gocrimson.com/sports/mens-volleyball",
    notes: "Elite academics and very difficult recruiting fit.",
  },
  {
    id: 'george-mason-university',
    name: "George Mason University",
    division: "NCAA D1",
    state: "Virginia",
    city: "Fairfax",
    christian: false,
    academicScore: 82,
    volleyballScore: 86,
    recruitingFit: 62,
    opportunityScore: 55,
    personalInterest: 64,
    campusSize: "Large",
    majors: ["Business", "Computer Science", "Engineering", "Education", "Kinesiology"],
    coachEmail: '',
    website: "https://gomason.com/sports/mens-volleyball",
    notes: "NCAA program in Virginia.",
  },
  {
    id: 'njit',
    name: "NJIT",
    division: "NCAA D1",
    state: "New Jersey",
    city: "Newark",
    christian: false,
    academicScore: 82,
    volleyballScore: 86,
    recruitingFit: 62,
    opportunityScore: 55,
    personalInterest: 64,
    campusSize: "Medium",
    majors: ["Computer Science", "Engineering", "Business", "Data Science", "Mathematics"],
    coachEmail: '',
    website: "https://njithighlanders.com/sports/mens-volleyball",
    notes: "Technical school with NCAA men\u2019s volleyball.",
  },
  {
    id: 'daemen-university',
    name: "Daemen University",
    division: "NCAA D1",
    state: "New York",
    city: "Amherst",
    christian: false,
    academicScore: 82,
    volleyballScore: 86,
    recruitingFit: 62,
    opportunityScore: 55,
    personalInterest: 64,
    campusSize: "Small",
    majors: ["Exercise Science", "Health Sciences", "Biology", "Psychology", "Business"],
    coachEmail: '',
    website: "https://daemenwildcats.com/sports/mens-volleyball",
    notes: "NCAA men\u2019s volleyball option in western New York.",
  },
  {
    id: 'merrimack-college',
    name: "Merrimack College",
    division: "NCAA D1",
    state: "Massachusetts",
    city: "North Andover",
    christian: false,
    academicScore: 82,
    volleyballScore: 86,
    recruitingFit: 62,
    opportunityScore: 55,
    personalInterest: 56,
    campusSize: "Medium",
    majors: ["Business", "Computer Science", "Education", "Psychology", "Communications"],
    coachEmail: '',
    website: "https://merrimackathletics.com/sports/mens-volleyball",
    notes: "NCAA men\u2019s volleyball option in Massachusetts.",
  },
  {
    id: 'queens-university-of-charlotte',
    name: "Queens University of Charlotte",
    division: "NCAA D1",
    state: "North Carolina",
    city: "Charlotte",
    christian: false,
    academicScore: 82,
    volleyballScore: 86,
    recruitingFit: 62,
    opportunityScore: 55,
    personalInterest: 56,
    campusSize: "Medium",
    majors: ["Business", "Computer Science", "Exercise Science", "Sports Management"],
    coachEmail: '',
    website: "https://queensathletics.com/sports/mens-volleyball",
    notes: "NCAA men\u2019s volleyball option in North Carolina.",
  },
  {
    id: 'ucla',
    name: "UCLA",
    division: "NCAA D1",
    state: "California",
    city: "Los Angeles",
    christian: false,
    academicScore: 82,
    volleyballScore: 96,
    recruitingFit: 54,
    opportunityScore: 48,
    personalInterest: 56,
    campusSize: "Large",
    majors: ["Business Economics", "Computer Science", "Engineering", "Education", "Psychology"],
    coachEmail: '',
    website: "https://uclabruins.com/sports/mens-volleyball",
    notes: "Elite national-level program and major athletic reach.",
  },
  {
    id: 'usc',
    name: "USC",
    division: "NCAA D1",
    state: "California",
    city: "Los Angeles",
    christian: false,
    academicScore: 82,
    volleyballScore: 86,
    recruitingFit: 62,
    opportunityScore: 55,
    personalInterest: 56,
    campusSize: "Large",
    majors: ["Business", "Computer Science", "Engineering", "Communications", "Education"],
    coachEmail: '',
    website: "https://usctrojans.com/sports/mens-volleyball",
    notes: "High-level NCAA program in California.",
  },
  {
    id: 'long-beach-state',
    name: "Long Beach State",
    division: "NCAA D1",
    state: "California",
    city: "Long Beach",
    christian: false,
    academicScore: 82,
    volleyballScore: 96,
    recruitingFit: 54,
    opportunityScore: 48,
    personalInterest: 56,
    campusSize: "Large",
    majors: ["Business", "Computer Science", "Engineering", "Kinesiology"],
    coachEmail: '',
    website: "https://longbeachstate.com/sports/mens-volleyball",
    notes: "Elite volleyball program in California.",
  },
  {
    id: 'university-of-hawaii',
    name: "University of Hawaii",
    division: "NCAA D1",
    state: "Hawaii",
    city: "Honolulu",
    christian: false,
    academicScore: 82,
    volleyballScore: 96,
    recruitingFit: 54,
    opportunityScore: 48,
    personalInterest: 56,
    campusSize: "Large",
    majors: ["Business", "Computer Science", "Kinesiology", "Education"],
    coachEmail: '',
    website: "https://hawaiiathletics.com/sports/mens-volleyball",
    notes: "Elite volleyball program with major distance factor.",
  },
  {
    id: 'uc-irvine',
    name: "UC Irvine",
    division: "NCAA D1",
    state: "California",
    city: "Irvine",
    christian: false,
    academicScore: 82,
    volleyballScore: 86,
    recruitingFit: 62,
    opportunityScore: 55,
    personalInterest: 56,
    campusSize: "Large",
    majors: ["Computer Science", "Engineering", "Business", "Data Science", "Mathematics", "Business Economics"],
    coachEmail: '',
    website: "https://ucirvinesports.com/sports/mens-volleyball",
    notes: "Strong California NCAA program.",
  },
  {
    id: 'uc-santa-barbara',
    name: "UC Santa Barbara",
    division: "NCAA D1",
    state: "California",
    city: "Santa Barbara",
    christian: false,
    academicScore: 82,
    volleyballScore: 86,
    recruitingFit: 62,
    opportunityScore: 55,
    personalInterest: 56,
    campusSize: "Large",
    majors: ["Computer Science", "Engineering", "Business", "Data Science", "Mathematics", "Economics"],
    coachEmail: '',
    website: "https://ucsbgauchos.com/sports/mens-volleyball",
    notes: "Strong California NCAA program.",
  },
  {
    id: 'uc-san-diego',
    name: "UC San Diego",
    division: "NCAA D1",
    state: "California",
    city: "San Diego",
    christian: false,
    academicScore: 82,
    volleyballScore: 86,
    recruitingFit: 62,
    opportunityScore: 55,
    personalInterest: 56,
    campusSize: "Large",
    majors: ["Computer Science", "Engineering", "Business", "Data Science", "Mathematics", "Biology"],
    coachEmail: '',
    website: "https://ucsdtritons.com/sports/mens-volleyball",
    notes: "Strong academics and NCAA volleyball.",
  },
  {
    id: 'stanford-university',
    name: "Stanford University",
    division: "NCAA D1",
    state: "California",
    city: "Stanford",
    christian: false,
    academicScore: 95,
    volleyballScore: 86,
    recruitingFit: 50,
    opportunityScore: 55,
    personalInterest: 56,
    campusSize: "Medium",
    majors: ["Computer Science", "Engineering", "Business", "Data Science", "Mathematics", "Economics"],
    coachEmail: '',
    website: "https://gostanford.com/sports/mens-volleyball",
    notes: "Elite academics and extremely difficult recruiting fit.",
  },
  {
    id: 'pepperdine-university',
    name: "Pepperdine University",
    division: "NCAA D1",
    state: "California",
    city: "Malibu",
    christian: true,
    academicScore: 82,
    volleyballScore: 86,
    recruitingFit: 62,
    opportunityScore: 55,
    personalInterest: 56,
    campusSize: "Medium",
    majors: ["Business", "Computer Science", "Education", "Psychology", "Sports Medicine"],
    coachEmail: '',
    website: "https://pepperdinewaves.com/sports/mens-volleyball",
    notes: "High-level NCAA program with Christian affiliation.",
  },
  {
    id: 'byu',
    name: "BYU",
    division: "NCAA D1",
    state: "Utah",
    city: "Provo",
    christian: true,
    academicScore: 82,
    volleyballScore: 86,
    recruitingFit: 62,
    opportunityScore: 55,
    personalInterest: 56,
    campusSize: "Large",
    majors: ["Business", "Computer Science", "Exercise Science", "Education", "Engineering"],
    coachEmail: '',
    website: "https://byucougars.com/sports/mens-volleyball",
    notes: "High-level NCAA program with strong faith culture.",
  },
  {
    id: 'belmont-abbey-college',
    name: "Belmont Abbey College",
    division: "NCAA D2",
    state: "North Carolina",
    city: "Belmont",
    christian: true,
    academicScore: 70,
    volleyballScore: 74,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 50,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Exercise Science", "Education"],
    coachEmail: '',
    website: "https://abbeyathletics.com/sports/mens-volleyball",
    notes: "D2/Conference Carolinas option with Catholic fit.",
  },
  {
    id: 'university-of-mount-olive',
    name: "University of Mount Olive",
    division: "NCAA D2",
    state: "North Carolina",
    city: "Mount Olive",
    christian: false,
    academicScore: 70,
    volleyballScore: 74,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 50,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://umotrojans.com/sports/mens-volleyball",
    notes: "D2 option in North Carolina.",
  },
  {
    id: 'king-university',
    name: "King University",
    division: "NCAA D2",
    state: "Tennessee",
    city: "Bristol",
    christian: true,
    academicScore: 70,
    volleyballScore: 74,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 50,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://kingtornado.com/sports/mens-volleyball",
    notes: "D2 Christian university option.",
  },
  {
    id: 'lees-mcrae-college',
    name: "Lees-McRae College",
    division: "NCAA D2",
    state: "North Carolina",
    city: "Banner Elk",
    christian: false,
    academicScore: 70,
    volleyballScore: 74,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 50,
    campusSize: "Small",
    majors: ["Exercise Science", "Health Sciences", "Biology", "Psychology", "Business"],
    coachEmail: '',
    website: "https://lmcbobcats.com/sports/mens-volleyball",
    notes: "D2 option with potential playing opportunity.",
  },
  {
    id: 'north-greenville-university',
    name: "North Greenville University",
    division: "NCAA D2",
    state: "South Carolina",
    city: "Tigerville",
    christian: true,
    academicScore: 70,
    volleyballScore: 74,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 50,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://www.nguathletics.com/sports/mens-volleyball",
    notes: "Christian D2 option in South Carolina.",
  },
  {
    id: 'erskine-college',
    name: "Erskine College",
    division: "NCAA D2",
    state: "South Carolina",
    city: "Due West",
    christian: true,
    academicScore: 70,
    volleyballScore: 74,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 50,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Psychology", "Communications"],
    coachEmail: '',
    website: "https://erskinesports.com/sports/mens-volleyball",
    notes: "Small Christian D2 option.",
  },
  {
    id: 'lincoln-memorial-university',
    name: "Lincoln Memorial University",
    division: "NCAA D2",
    state: "Tennessee",
    city: "Harrogate",
    christian: false,
    academicScore: 70,
    volleyballScore: 74,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 50,
    campusSize: "Medium",
    majors: ["Exercise Science", "Health Sciences", "Biology", "Psychology", "Business"],
    coachEmail: '',
    website: "https://lmurailsplitters.com/sports/mens-volleyball",
    notes: "D2 option in Tennessee.",
  },
  {
    id: 'limestone-university',
    name: "Limestone University",
    division: "NCAA D2",
    state: "South Carolina",
    city: "Gaffney",
    christian: false,
    academicScore: 70,
    volleyballScore: 74,
    recruitingFit: 76,
    opportunityScore: 74,
    personalInterest: 50,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://golimestonesaints.com/sports/mens-volleyball",
    notes: "D2 option in South Carolina.",
  },
  {
    id: 'fort-valley-state-university',
    name: "Fort Valley State University",
    division: "NCAA D1",
    state: "Georgia",
    city: "Fort Valley",
    christian: false,
    academicScore: 82,
    volleyballScore: 86,
    recruitingFit: 62,
    opportunityScore: 55,
    personalInterest: 56,
    campusSize: "Medium",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://fvsusports.com/sports/mens-volleyball",
    notes: "Emerging/accessible NCAA option; verify current program details.",
  },
  {
    id: 'morehouse-college',
    name: "Morehouse College",
    division: "NCAA D1",
    state: "Georgia",
    city: "Atlanta",
    christian: false,
    academicScore: 82,
    volleyballScore: 86,
    recruitingFit: 62,
    opportunityScore: 55,
    personalInterest: 56,
    campusSize: "Medium",
    majors: ["Business", "Computer Science", "Education", "Psychology", "Communications"],
    coachEmail: '',
    website: "https://morehouseathletics.com/sports/mens-volleyball",
    notes: "Atlanta NCAA men\u2019s volleyball option; verify current recruiting needs.",
  },
  {
    id: 'edward-waters-university',
    name: "Edward Waters University",
    division: "NCAA D1",
    state: "Florida",
    city: "Jacksonville",
    christian: false,
    academicScore: 82,
    volleyballScore: 86,
    recruitingFit: 62,
    opportunityScore: 55,
    personalInterest: 56,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://ewutigerpride.com/sports/mens-volleyball",
    notes: "Florida NCAA men\u2019s volleyball option; verify details.",
  },
  {
    id: 'kentucky-state-university',
    name: "Kentucky State University",
    division: "NCAA D1",
    state: "Kentucky",
    city: "Frankfort",
    christian: false,
    academicScore: 82,
    volleyballScore: 86,
    recruitingFit: 62,
    opportunityScore: 55,
    personalInterest: 56,
    campusSize: "Medium",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://ksuthorobreds.com/sports/mens-volleyball",
    notes: "Kentucky men\u2019s volleyball option; verify current details.",
  },
  {
    id: 'grand-view-university',
    name: "Grand View University",
    division: "NAIA",
    state: "Iowa",
    city: "Des Moines",
    christian: false,
    academicScore: 66,
    volleyballScore: 76,
    recruitingFit: 79,
    opportunityScore: 78,
    personalInterest: 48,
    campusSize: "Medium",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://gvvikings.com/sports/mens-volleyball",
    notes: "Strong NAIA volleyball option.",
  },
  {
    id: 'park-university',
    name: "Park University",
    division: "NAIA",
    state: "Missouri",
    city: "Parkville",
    christian: false,
    academicScore: 66,
    volleyballScore: 76,
    recruitingFit: 79,
    opportunityScore: 78,
    personalInterest: 48,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://parkathletics.com/sports/mens-volleyball",
    notes: "Competitive NAIA option.",
  },
  {
    id: 'missouri-baptist-university',
    name: "Missouri Baptist University",
    division: "NAIA",
    state: "Missouri",
    city: "St. Louis",
    christian: true,
    academicScore: 66,
    volleyballScore: 76,
    recruitingFit: 79,
    opportunityScore: 78,
    personalInterest: 48,
    campusSize: "Medium",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://mbuspartans.com/sports/mens-volleyball",
    notes: "Christian NAIA option with strong volleyball.",
  },
  {
    id: 'missouri-valley-college',
    name: "Missouri Valley College",
    division: "NAIA",
    state: "Missouri",
    city: "Marshall",
    christian: false,
    academicScore: 66,
    volleyballScore: 76,
    recruitingFit: 79,
    opportunityScore: 78,
    personalInterest: 48,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Psychology", "Communications"],
    coachEmail: '',
    website: "https://www.valleywillroll.com/sports/mvball",
    notes: "NAIA option with possible opportunity.",
  },
  {
    id: 'william-penn-university',
    name: "William Penn University",
    division: "NAIA",
    state: "Iowa",
    city: "Oskaloosa",
    christian: false,
    academicScore: 66,
    volleyballScore: 76,
    recruitingFit: 79,
    opportunityScore: 78,
    personalInterest: 48,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://statesmenathletics.com/sports/mens-volleyball",
    notes: "NAIA option in Iowa.",
  },
  {
    id: 'mount-mercy-university',
    name: "Mount Mercy University",
    division: "NAIA",
    state: "Iowa",
    city: "Cedar Rapids",
    christian: false,
    academicScore: 66,
    volleyballScore: 76,
    recruitingFit: 79,
    opportunityScore: 78,
    personalInterest: 48,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://mountmercymustangs.com/sports/mens-volleyball",
    notes: "NAIA option in Iowa.",
  },
  {
    id: 'saint-xavier-university',
    name: "Saint Xavier University",
    division: "NAIA",
    state: "Illinois",
    city: "Chicago",
    christian: false,
    academicScore: 66,
    volleyballScore: 76,
    recruitingFit: 79,
    opportunityScore: 78,
    personalInterest: 48,
    campusSize: "Medium",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://sxucougars.com/sports/mens-volleyball",
    notes: "Chicago NAIA option.",
  },
  {
    id: 'lourdes-university',
    name: "Lourdes University",
    division: "NAIA",
    state: "Ohio",
    city: "Sylvania",
    christian: false,
    academicScore: 66,
    volleyballScore: 76,
    recruitingFit: 79,
    opportunityScore: 78,
    personalInterest: 56,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://lourdesathletics.com/sports/mens-volleyball",
    notes: "Ohio NAIA option.",
  },
  {
    id: 'aquinas-college',
    name: "Aquinas College",
    division: "NAIA",
    state: "Michigan",
    city: "Grand Rapids",
    christian: true,
    academicScore: 66,
    volleyballScore: 76,
    recruitingFit: 79,
    opportunityScore: 78,
    personalInterest: 48,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://aqsaints.com/sports/mens-volleyball",
    notes: "Michigan NAIA option with Catholic fit.",
  },
  {
    id: 'indiana-tech',
    name: "Indiana Tech",
    division: "NAIA",
    state: "Indiana",
    city: "Fort Wayne",
    christian: false,
    academicScore: 66,
    volleyballScore: 76,
    recruitingFit: 79,
    opportunityScore: 78,
    personalInterest: 48,
    campusSize: "Medium",
    majors: ["Computer Science", "Engineering", "Business", "Data Science", "Mathematics", "Exercise Science"],
    coachEmail: '',
    website: "https://indianatechwarriors.com/sports/mens-volleyball",
    notes: "NAIA option with technical/business majors.",
  },
  {
    id: 'lawrence-tech',
    name: "Lawrence Tech",
    division: "NAIA",
    state: "Michigan",
    city: "Southfield",
    christian: false,
    academicScore: 66,
    volleyballScore: 76,
    recruitingFit: 79,
    opportunityScore: 78,
    personalInterest: 48,
    campusSize: "Small",
    majors: ["Computer Science", "Engineering", "Business", "Data Science", "Mathematics"],
    coachEmail: '',
    website: "https://ltuathletics.com/sports/mens-volleyball",
    notes: "NAIA technical school option.",
  },
  {
    id: 'mount-vernon-nazarene-university',
    name: "Mount Vernon Nazarene University",
    division: "NAIA",
    state: "Ohio",
    city: "Mount Vernon",
    christian: true,
    academicScore: 66,
    volleyballScore: 76,
    recruitingFit: 79,
    opportunityScore: 78,
    personalInterest: 56,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://mvnu.edu/athletics/mens-volleyball/",
    notes: "Christian NAIA option in Ohio.",
  },
  {
    id: 'university-of-rio-grande',
    name: "University of Rio Grande",
    division: "NAIA",
    state: "Ohio",
    city: "Rio Grande",
    christian: false,
    academicScore: 66,
    volleyballScore: 76,
    recruitingFit: 79,
    opportunityScore: 78,
    personalInterest: 56,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://www.rioredstorm.com/sports/mens-volleyball",
    notes: "Ohio NAIA option.",
  },
  {
    id: 'georgetown-college',
    name: "Georgetown College",
    division: "NAIA",
    state: "Kentucky",
    city: "Georgetown",
    christian: true,
    academicScore: 66,
    volleyballScore: 76,
    recruitingFit: 79,
    opportunityScore: 78,
    personalInterest: 48,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://georgetowncollegeathletics.com/sports/mens-volleyball",
    notes: "Christian/Kentucky NAIA option.",
  },
  {
    id: 'campbellsville-university',
    name: "Campbellsville University",
    division: "NAIA",
    state: "Kentucky",
    city: "Campbellsville",
    christian: true,
    academicScore: 66,
    volleyballScore: 76,
    recruitingFit: 79,
    opportunityScore: 78,
    personalInterest: 48,
    campusSize: "Medium",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://campbellsvilletigers.com/sports/mens-volleyball",
    notes: "Christian NAIA option in Kentucky.",
  },
  {
    id: 'cumberland-university',
    name: "Cumberland University",
    division: "NAIA",
    state: "Tennessee",
    city: "Lebanon",
    christian: false,
    academicScore: 66,
    volleyballScore: 76,
    recruitingFit: 79,
    opportunityScore: 78,
    personalInterest: 48,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://gocumberlandathletics.com/sports/mens-volleyball",
    notes: "NAIA option in Tennessee.",
  },
  {
    id: 'reinhardt-university',
    name: "Reinhardt University",
    division: "NAIA",
    state: "Georgia",
    city: "Waleska",
    christian: true,
    academicScore: 66,
    volleyballScore: 76,
    recruitingFit: 79,
    opportunityScore: 78,
    personalInterest: 48,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://reinhardteagles.com/sports/mens-volleyball",
    notes: "Christian NAIA option in Georgia.",
  },
  {
    id: 'webber-international-university',
    name: "Webber International University",
    division: "NAIA",
    state: "Florida",
    city: "Babson Park",
    christian: false,
    academicScore: 66,
    volleyballScore: 76,
    recruitingFit: 79,
    opportunityScore: 78,
    personalInterest: 48,
    campusSize: "Small",
    majors: ["Business", "Sports Business Management", "Computer Information Systems", "Health Services"],
    coachEmail: '',
    website: "https://webberathletics.com/sports/mens-volleyball",
    notes: "Florida NAIA option.",
  },
  {
    id: 'st-thomas-university',
    name: "St. Thomas University",
    division: "NAIA",
    state: "Florida",
    city: "Miami Gardens",
    christian: true,
    academicScore: 66,
    volleyballScore: 76,
    recruitingFit: 79,
    opportunityScore: 78,
    personalInterest: 48,
    campusSize: "Medium",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://stubobcats.com/sports/mens-volleyball",
    notes: "Florida NAIA option with Catholic identity.",
  },
  {
    id: 'warner-university',
    name: "Warner University",
    division: "NAIA",
    state: "Florida",
    city: "Lake Wales",
    christian: true,
    academicScore: 66,
    volleyballScore: 76,
    recruitingFit: 79,
    opportunityScore: 78,
    personalInterest: 48,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://warnerroyals.com/sports/mens-volleyball",
    notes: "Florida Christian NAIA option.",
  },
  {
    id: 'benedictine-university-mesa',
    name: "Benedictine University Mesa",
    division: "NAIA",
    state: "Arizona",
    city: "Mesa",
    christian: true,
    academicScore: 66,
    volleyballScore: 76,
    recruitingFit: 79,
    opportunityScore: 78,
    personalInterest: 48,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://benuredhawks.com/sports/mens-volleyball",
    notes: "Arizona NAIA option.",
  },
  {
    id: 'ottawa-university-arizona',
    name: "Ottawa University Arizona",
    division: "NAIA",
    state: "Arizona",
    city: "Surprise",
    christian: true,
    academicScore: 66,
    volleyballScore: 76,
    recruitingFit: 79,
    opportunityScore: 78,
    personalInterest: 48,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://ouazspirit.com/sports/mens-volleyball",
    notes: "Arizona NAIA option.",
  },
  {
    id: 'arizona-christian-university',
    name: "Arizona Christian University",
    division: "NAIA",
    state: "Arizona",
    city: "Glendale",
    christian: true,
    academicScore: 66,
    volleyballScore: 76,
    recruitingFit: 79,
    opportunityScore: 78,
    personalInterest: 48,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://acufirestorm.com/sports/mens-volleyball",
    notes: "Christian NAIA option in Arizona.",
  },
  {
    id: 'the-master-s-university',
    name: "The Master\u2019s University",
    division: "NAIA",
    state: "California",
    city: "Santa Clarita",
    christian: true,
    academicScore: 66,
    volleyballScore: 76,
    recruitingFit: 79,
    opportunityScore: 78,
    personalInterest: 48,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://gomustangs.com/sports/mens-volleyball",
    notes: "Christian NAIA option in California.",
  },
  {
    id: 'vanguard-university',
    name: "Vanguard University",
    division: "NAIA",
    state: "California",
    city: "Costa Mesa",
    christian: true,
    academicScore: 66,
    volleyballScore: 76,
    recruitingFit: 79,
    opportunityScore: 78,
    personalInterest: 48,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Exercise Science", "Health Sciences"],
    coachEmail: '',
    website: "https://vanguardlions.com/sports/mens-volleyball",
    notes: "Christian NAIA option in California.",
  },
  {
    id: 'menlo-college',
    name: "Menlo College",
    division: "NAIA",
    state: "California",
    city: "Atherton",
    christian: false,
    academicScore: 66,
    volleyballScore: 76,
    recruitingFit: 79,
    opportunityScore: 78,
    personalInterest: 48,
    campusSize: "Small",
    majors: ["Business", "Psychology", "Computer Science", "Sports Management"],
    coachEmail: '',
    website: "https://menloathletics.com/sports/mens-volleyball",
    notes: "California NAIA option.",
  },
  {
    id: 'westcliff-university',
    name: "Westcliff University",
    division: "NAIA",
    state: "California",
    city: "Irvine",
    christian: false,
    academicScore: 66,
    volleyballScore: 76,
    recruitingFit: 79,
    opportunityScore: 78,
    personalInterest: 48,
    campusSize: "Small",
    majors: ["Business", "Computer Science", "Education", "Health Sciences"],
    coachEmail: '',
    website: "https://westcliffathletics.com/sports/mens-volleyball",
    notes: "California NAIA option.",
  },
  {
    id: 'golden-west-college',
    name: "Golden West College",
    division: "CCCAA",
    state: "California",
    city: "Huntington Beach",
    christian: false,
    academicScore: 58,
    volleyballScore: 76,
    recruitingFit: 85,
    opportunityScore: 86,
    personalInterest: 38,
    campusSize: "Medium",
    majors: ["Business", "Computer Science", "Kinesiology", "Communications"],
    coachEmail: '',
    website: "https://www.gwcathletics.com/sports/mvball",
    notes: "Two-year California option. Verify transfer/recruiting pathway.",
  },
  {
    id: 'irvine-valley-college',
    name: "Irvine Valley College",
    division: "CCCAA",
    state: "California",
    city: "Irvine",
    christian: false,
    academicScore: 58,
    volleyballScore: 76,
    recruitingFit: 85,
    opportunityScore: 86,
    personalInterest: 38,
    campusSize: "Medium",
    majors: ["Business", "Computer Science", "Kinesiology", "Psychology"],
    coachEmail: '',
    website: "https://ivclasers.com/sports/mvball",
    notes: "Strong two-year California option. Verify transfer pathway.",
  },
  {
    id: 'orange-coast-college',
    name: "Orange Coast College",
    division: "CCCAA",
    state: "California",
    city: "Costa Mesa",
    christian: false,
    academicScore: 58,
    volleyballScore: 76,
    recruitingFit: 85,
    opportunityScore: 86,
    personalInterest: 38,
    campusSize: "Medium",
    majors: ["Business", "Computer Science", "Kinesiology", "Engineering"],
    coachEmail: '',
    website: "https://occathletics.com/sports/mvball",
    notes: "Two-year California volleyball option.",
  },
  {
    id: 'long-beach-city-college',
    name: "Long Beach City College",
    division: "CCCAA",
    state: "California",
    city: "Long Beach",
    christian: false,
    academicScore: 58,
    volleyballScore: 86,
    recruitingFit: 77,
    opportunityScore: 79,
    personalInterest: 38,
    campusSize: "Large",
    majors: ["Business", "Computer Science", "Kinesiology", "Education"],
    coachEmail: '',
    website: "https://lbccvikings.com/sports/mens-volleyball",
    notes: "Two-year California volleyball option.",
  },
  {
    id: 'santa-monica-college',
    name: "Santa Monica College",
    division: "CCCAA",
    state: "California",
    city: "Santa Monica",
    christian: false,
    academicScore: 58,
    volleyballScore: 76,
    recruitingFit: 85,
    opportunityScore: 86,
    personalInterest: 38,
    campusSize: "Large",
    majors: ["Business", "Computer Science", "Kinesiology", "Psychology"],
    coachEmail: '',
    website: "https://www.smccorsairs.com/sports/mvball",
    notes: "Two-year California option.",
  },
  {
    id: 'moorpark-college',
    name: "Moorpark College",
    division: "CCCAA",
    state: "California",
    city: "Moorpark",
    christian: false,
    academicScore: 58,
    volleyballScore: 76,
    recruitingFit: 85,
    opportunityScore: 86,
    personalInterest: 38,
    campusSize: "Medium",
    majors: ["Business", "Computer Science", "Kinesiology", "Biology"],
    coachEmail: '',
    website: "https://www.moorparkcollegeathletics.com/sports/mvball",
    notes: "Two-year California option.",
  },
  {
    id: 'grossmont-college',
    name: "Grossmont College",
    division: "CCCAA",
    state: "California",
    city: "El Cajon",
    christian: false,
    academicScore: 58,
    volleyballScore: 76,
    recruitingFit: 85,
    opportunityScore: 86,
    personalInterest: 38,
    campusSize: "Medium",
    majors: ["Business", "Computer Science", "Kinesiology", "Health Sciences"],
    coachEmail: '',
    website: "https://www.grossmontgriffins.com/sports/mvball",
    notes: "Two-year California option.",
  },
  {
    id: 'san-diego-mesa-college',
    name: "San Diego Mesa College",
    division: "CCCAA",
    state: "California",
    city: "San Diego",
    christian: false,
    academicScore: 58,
    volleyballScore: 76,
    recruitingFit: 85,
    opportunityScore: 86,
    personalInterest: 38,
    campusSize: "Large",
    majors: ["Business", "Computer Science", "Kinesiology", "Health Sciences"],
    coachEmail: '',
    website: "https://gosdmesa.com/sports/mens-volleyball",
    notes: "Two-year California option.",
  }
];

const EMAIL_STATUSES = ['Not emailed', 'Draft ready', 'Emailed', 'Replied', 'Follow-up needed', 'Camp/Visit', 'Not interested'];
const ALL_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'Washington, DC',
];
const STATE_ABBR_TO_FULL = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California', CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming', DC: 'Washington, DC',
};
const DIVISION_OPTIONS = ['Any Division', 'NCAA D1', 'NCAA D2', 'NCAA D3', 'NAIA', 'NJCAA', 'CCCAA', 'Club'];
const EXPANDED_MAJOR_OPTIONS = [
  'Accounting', 'Acting', 'Architecture', 'Athletic Training', 'Biology', 'Biomedical Engineering', 'Business', 'Business Analytics', 'Chemistry', 'Coaching', 'Communications', 'Computer Engineering', 'Computer Information Systems', 'Computer Science', 'Criminal Justice', 'Cybersecurity', 'Data Science', 'Digital Media', 'Economics', 'Education', 'Electrical Engineering', 'Engineering', 'English', 'Entrepreneurship', 'Environmental Science', 'Exercise Science', 'Finance', 'Health Sciences', 'History', 'Information Technology', 'International Business', 'Journalism', 'Kinesiology', 'Management', 'Marketing', 'Mathematics', 'Mechanical Engineering', 'Nursing', 'Nutrition', 'Physical Therapy', 'Political Science', 'Pre-Law', 'Pre-Med', 'Psychology', 'Public Policy', 'Social Work', 'Sociology', 'Sport Management', 'Sports Business Management', 'Sports Medicine', 'Statistics', 'Theater', 'Undecided',
];
const MAJOR_OPTIONS = Array.from(new Set([
  ...EXPANDED_MAJOR_OPTIONS,
  ...SAMPLE_SCHOOLS.flatMap((school) => school.majors || []),
])).sort((a, b) => a.localeCompare(b));

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


function fullStateName(value) {
  if (!value) return '';
  const trimmed = String(value).trim();
  return STATE_ABBR_TO_FULL[trimmed.toUpperCase()] || trimmed;
}

function normalizeDivision(value) {
  if (!value) return 'Any Division';
  if (value === 'D1') return 'NCAA D1';
  if (value === 'D2') return 'NCAA D2';
  if (value === 'D3') return 'NCAA D3';
  return value;
}

function normalizePrefs(prefs = {}) {
  const merged = { ...DEFAULT_PREFS, ...prefs };
  return {
    ...merged,
    division: normalizeDivision(merged.division),
    states: Array.from(new Set((merged.states || []).map(fullStateName).filter(Boolean))),
    majors: Array.from(new Set((merged.majors || []).filter(Boolean))),
    fitStrictness: merged.fitStrictness || 'Show all ranked',
  };
}

function parseHeightToInches(value) {
  if (!value) return 0;
  const text = String(value).toLowerCase().replace(/\s/g, '');
  const feetInches = text.match(/(\d+)'(\d+)?/);
  if (feetInches) return Number(feetInches[1]) * 12 + Number(feetInches[2] || 0);
  const feetWords = text.match(/(\d+)ft(\d+)?/);
  if (feetWords) return Number(feetWords[1]) * 12 + Number(feetWords[2] || 0);
  const number = Number(text.replace(/[^0-9.]/g, ''));
  return Number.isFinite(number) ? number : 0;
}

function parseStatNumber(value) {
  if (!value) return 0;
  const number = Number(String(value).replace(/[^0-9.]/g, ''));
  return Number.isFinite(number) ? number : 0;
}

function getDivisionTargetStats(division) {
  if (division === 'NCAA D1') return { height: 75, vertical: 34, gpa: 3.4 };
  if (division === 'NCAA D2') return { height: 73, vertical: 31, gpa: 3.1 };
  if (division === 'NCAA D3') return { height: 72, vertical: 29, gpa: 3.0 };
  if (division === 'NAIA') return { height: 72, vertical: 29, gpa: 2.8 };
  if (division === 'NJCAA' || division === 'CCCAA') return { height: 71, vertical: 28, gpa: 2.5 };
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
  if (school.division === 'NCAA D1' && (!height || !vertical)) score -= 8;
  if (school.division === 'NCAA D3' && gpa >= 3.5) score += 5;
  if (school.division === 'NAIA' || school.division === 'NJCAA' || school.division === 'CCCAA') score += 3;
  return Math.round(normalize(score));
}

function getDivisionFit(school, prefs) {
  const preferred = normalizeDivision(prefs.division);
  if (preferred === 'Any Division') return 100;
  if (school.division === preferred) return 100;
  if (preferred === 'NCAA D1' && school.division === 'NCAA D2') return 62;
  if (preferred === 'NCAA D2' && ['NCAA D1', 'NCAA D3', 'NAIA'].includes(school.division)) return 70;
  if (preferred === 'NCAA D3' && school.division === 'NAIA') return 58;
  if (preferred === 'NAIA' && ['NCAA D2', 'NCAA D3'].includes(school.division)) return 62;
  return 35;
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
  const selectedStates = (prefs.states || []).map(fullStateName);
  if (!selectedStates.length) return 75;
  if (selectedStates.includes(school.state)) return 100;
  if (prefs.maxDistance === 'Anywhere') return 70;
  if (prefs.maxDistance === 'Flexible') return 55;
  return 25;
}

function getAcademicFit(school, prefs) {
  const base = school.academicScore;
  if (prefs.academicLevel === 'Elite') return base >= 90 ? 100 : base >= 80 ? 78 : 50;
  if (prefs.academicLevel === 'Strong') return base >= 80 ? 95 : base >= 70 ? 78 : 58;
  return base;
}

function getVolleyballFit(school, prefs) {
  const base = school.volleyballScore;
  const divisionFit = getDivisionFit(school, prefs);
  let competitionFit = base;
  if (prefs.competitionLevel === 'Very Competitive') {
    competitionFit = base >= 85 ? 100 : base >= 75 ? 82 : 58;
  } else if (prefs.competitionLevel === 'Competitive') {
    competitionFit = base >= 75 ? 95 : base >= 65 ? 78 : 58;
  } else if (prefs.competitionLevel === 'Realistic Playing Time') {
    competitionFit = Math.round((base * 0.45) + (school.opportunityScore * 0.55));
  }
  return Math.round((competitionFit * 0.72) + (divisionFit * 0.28));
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

function calculateSchoolScore(school, prefs, weights, profile = {}) {
  const raw = {
    volleyball: getVolleyballFit(school, prefs),
    academics: getAcademicFit(school, prefs),
    major: getMajorFit(school.majors, prefs.majors),
    recruiting: Math.round((school.recruitingFit * 0.45) + (getProfileFit(profile, school) * 0.55)),
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
        prefs: normalizePrefs(parsed.prefs || {}),
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


function DropdownMultiSelect({ label, options, values, onChange, placeholder = 'Select one...' }) {
  const [selected, setSelected] = useState('');
  const selectedValues = values || [];
  const availableOptions = options.filter((option) => !selectedValues.includes(option));
  function addValue(value) {
    if (!value || selectedValues.includes(value)) return;
    onChange([...selectedValues, value]);
    setSelected('');
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
          {availableOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
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
        score: calculateSchoolScore(school, prefs, weights, profile),
        progress: progress[school.id] || {
          favorite: false,
          emailStatus: 'Not emailed',
          notes: '',
          lastContact: '',
        },
      }))
      .filter((school) => {
        const text = `${school.name} ${school.city} ${school.state} ${school.division} ${school.notes} ${school.majors.join(' ')}`.toLowerCase();
        const matchesQuery = text.includes(query.toLowerCase());
        const matchesTier = tierFilter === 'All' || school.score.tier === tierFilter;
        const matchesFavorite = !showFavoritesOnly || school.progress.favorite;
        const matchesStrictness = prefs.fitStrictness === 'Strong fits only'
          ? school.score.total >= 75
          : prefs.fitStrictness === 'Close fits only'
            ? school.score.total >= 60
            : true;
        return matchesQuery && matchesTier && matchesFavorite && matchesStrictness;
      })
      .sort((a, b) => b.score.total - a.score.total);
  }, [allSchools, prefs, weights, profile, progress, query, tierFilter, showFavoritesOnly]);

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
      division: normalizeDivision(prefs.division || 'NCAA D3'),
      state: 'Pennsylvania',
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

I like ${school.name} because ${school.christian ? 'it seems like a strong Christian environment and ' : ''}it looks like a school where I could grow as a player, student, and person. I am trying to find colleges that fit me academically and athletically, not just random schools to email.${profile.playerNotes ? `

One thing I want coaches to know about me is: ${profile.playerNotes}` : ''}

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
            Preferences, weights, notes, and progress save on this computer. AI drafts use your secure Vercel API.
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

            <DropdownMultiSelect
              label="Possible Majors"
              options={MAJOR_OPTIONS}
              values={profile.possibleMajors}
              placeholder="Select a possible major..."
              onChange={(values) => {
                updateProfile({ possibleMajors: values });
                updatePrefs({ majors: values });
              }}
            />

            <label className="notes-box profile-notes-box">
              <span><NotebookPen size={16} /> Player Notes for AI Emails</span>
              <textarea
                value={profile.playerNotes || ''}
                onChange={(e) => updateProfile({ playerNotes: e.target.value })}
                placeholder="Write anything you want the AI to remember when making coach emails: your goals, playing style, why you love volleyball, what you are working on, camps you went to, school fit, personality, story, or anything that sounds like you."
              />
            </label>

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
              <SelectField label="Division" value={prefs.division} onChange={(value) => updatePrefs({ division: value })} options={DIVISION_OPTIONS} />
              <SelectField label="Christian Fit" value={prefs.christianFit} onChange={(value) => updatePrefs({ christianFit: value })} options={['Required', 'Preferred', 'Bonus', 'Does not matter']} />
              <SelectField label="Academic Level" value={prefs.academicLevel} onChange={(value) => updatePrefs({ academicLevel: value })} options={['Elite', 'Strong', 'Balanced']} />
              <SelectField label="Campus Size" value={prefs.campusSize} onChange={(value) => updatePrefs({ campusSize: value })} options={['Any', 'Small', 'Medium', 'Large']} />
              <SelectField label="Competition Level" value={prefs.competitionLevel} onChange={(value) => updatePrefs({ competitionLevel: value })} options={['Very Competitive', 'Competitive', 'Realistic Playing Time', 'Balanced']} />
              <SelectField label="Playing Time Priority" value={prefs.playingTimePriority} onChange={(value) => updatePrefs({ playingTimePriority: value })} options={['Balanced', 'Play Early', 'Highest Competition']} />
              <SelectField label="Distance" value={prefs.maxDistance} onChange={(value) => updatePrefs({ maxDistance: value })} options={['Close', 'Flexible', 'Anywhere']} />
              <SelectField label="Fit Strictness" value={prefs.fitStrictness} onChange={(value) => updatePrefs({ fitStrictness: value })} options={['Show all ranked', 'Close fits only', 'Strong fits only']} />
            </div>

            <DropdownMultiSelect
              label="Preferred States"
              options={ALL_STATES}
              values={prefs.states}
              placeholder="Select a state..."
              onChange={(values) => updatePrefs({ states: values })}
            />

            <DropdownMultiSelect
              label="Major Fit"
              options={MAJOR_OPTIONS}
              values={prefs.majors}
              placeholder="Select a major..."
              onChange={(values) => updatePrefs({ majors: values })}
            />

            <div className="database-note">
              <strong>Database note:</strong> This app now has a much larger built-in school list across NCAA, NAIA, and two-year programs. Still verify every coach, roster, division, and major before emailing because programs and majors can change.
            </div>

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
    playerNotes: profile.playerNotes || '',
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
    savedSchoolNotes: school.progress?.notes || '',
    lastContact: school.progress?.lastContact || '',
  };
}

function SchoolCard({ school, profile, prefs, updateProgress, makeEmailDraft, removeCustomSchool, updateCustomSchool }) {
  const [showDraft, setShowDraft] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [aiDraft, setAiDraft] = useState(null);
  const [draftError, setDraftError] = useState('');
  const [draftChatInput, setDraftChatInput] = useState('');
  const [draftChatMessages, setDraftChatMessages] = useState([]);
  const [isChattingAboutDraft, setIsChattingAboutDraft] = useState(false);
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

  async function sendDraftChatMessage() {
    const message = draftChatInput.trim();
    if (!message || !aiDraft || isChattingAboutDraft) return;

    const userChatMessage = {
      role: 'user',
      content: message,
    };

    const nextMessages = [...draftChatMessages, userChatMessage];
    setDraftChatMessages(nextMessages);
    setDraftChatInput('');
    setIsChattingAboutDraft(true);
    setDraftError('');

    try {
      const response = await chatRecruitingEmail({
        playerProfile: buildAIPlayerProfile(profile, prefs),
        schoolProfile: buildAISchoolProfile(school, prefs),
        currentDraft: {
          subject: aiDraft.subject || '',
          body: aiDraft.body || '',
        },
        userMessage: message,
        chatHistory: draftChatMessages,
      });

      setAiDraft((current) => ({
        ...(current || {}),
        subject: response.subject || current?.subject || '',
        body: response.body || current?.body || '',
        editSuggestions: Array.isArray(response.editSuggestions)
          ? response.editSuggestions
          : current?.editSuggestions || [],
        whyThisIsPersonal:
          response.whyThisIsPersonal || current?.whyThisIsPersonal || '',
      }));

      setDraftChatMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content: response.reply || response.changeSummary || 'I updated the draft.',
        },
      ]);
    } catch (error) {
      setDraftChatMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content: error.message || 'I could not update the draft right now.',
        },
      ]);
    } finally {
      setIsChattingAboutDraft(false);
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
          <p className="profile-fit-line">Profile/stat fit estimate: {school.score.raw.recruiting}/100</p>
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

              <div className="ai-draft-chat-box">
                <div className="ai-draft-chat-head">
                  <div>
                    <h4><MessageCircle size={17} /> Ask AI About This Email</h4>
                    <p>Ask for changes like: make it shorter, sound more like me, add my notes, make it more confident, or explain what should be changed.</p>
                  </div>
                </div>

                {draftChatMessages.length > 0 && (
                  <div className="ai-draft-chat-messages">
                    {draftChatMessages.map((message, index) => (
                      <div key={index} className={cn('ai-draft-chat-message', message.role === 'user' ? 'user' : 'assistant')}>
                        <span>{message.role === 'user' ? 'You' : 'AI'}</span>
                        <p>{message.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="ai-draft-chat-row">
                  <input
                    value={draftChatInput}
                    onChange={(e) => setDraftChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendDraftChatMessage();
                      }
                    }}
                    placeholder="Ask AI to change or explain this email..."
                  />
                  <button className="primary small" onClick={sendDraftChatMessage} disabled={isChattingAboutDraft || !draftChatInput.trim()}>
                    <Send size={16} /> {isChattingAboutDraft ? 'Thinking...' : 'Send'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </article>
  );
}

export default App;
