"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Edit3, 
  FileText, 
  Lightbulb, 
  Plus, 
  X, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  Pin,
  PinOff,
  Trash2,
  Save,
  Calendar,
  Shield,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import Link from "next/link";

interface TaxProfile {
  firstName: string;
  lastName: string;
  filingStatus: string;
  ssnLast4: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  email: string;
  dependents: number;
  occupation: string;
}

interface TaxNote {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  category: 'deduction' | 'income' | 'general' | 'reminder';
}

interface HelpTip {
  id: string;
  title: string;
  content: string;
  category: 'irs' | 'deduction' | 'filing' | 'general';
  isPinned: boolean;
}

interface TaxProgress {
  personalInfo: boolean;
  income: boolean;
  deductions: boolean;
  credits: boolean;
  review: boolean;
}

const HELP_TIPS: HelpTip[] = [
  {
    id: '1',
    title: 'Standard Deduction 2024',
    content: 'For 2024, the standard deduction is $14,600 for single filers and $29,200 for married filing jointly.',
    category: 'deduction',
    isPinned: false
  },
  {
    id: '2',
    title: 'Tax Filing Deadline',
    content: 'The tax filing deadline for 2024 returns is April 15, 2025. File for an extension if you need more time.',
    category: 'filing',
    isPinned: false
  },
  {
    id: '3',
    title: 'Keep Your Records',
    content: 'Keep tax records for at least 3 years. For major items like home purchases, keep records longer.',
    category: 'general',
    isPinned: false
  },
  {
    id: '4',
    title: 'Business Expenses',
    content: 'Self-employed? Track business expenses throughout the year including mileage, supplies, and home office costs.',
    category: 'deduction',
    isPinned: false
  },
  {
    id: '5',
    title: 'Child Tax Credit',
    content: 'The Child Tax Credit for 2024 is up to $2,000 per qualifying child under 17. Income limits apply.',
    category: 'irs',
    isPinned: false
  }
];

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Existing state
  const [profile, setProfile] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Record<string, any> | null>(null);
  const [saving, setSaving] = useState(false);
  const [completedYears, setCompletedYears] = useState<number[]>([]);
  const [latestYear, setLatestYear] = useState<number>(2024);
  
  // New state for enhanced features
  const [progress, setProgress] = useState<TaxProgress>({
    personalInfo: false,
    income: false,
    deductions: false,
    credits: false,
    review: false
  });
  const [notes, setNotes] = useState<TaxNote[]>([]);
  const [helpTips, setHelpTips] = useState<HelpTip[]>(HELP_TIPS);
  
  // Modal states
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Form states
  const [newNote, setNewNote] = useState({ title: '', content: '', category: 'general' as TaxNote['category'] });
  const [editingNote, setEditingNote] = useState<TaxNote | null>(null);
  const [expandedTips, setExpandedTips] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/main/signin");
      return;
    }
    if (status === "authenticated" && session?.user?.email) {
      loadUserData();
    }
  }, [status, session, router]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const years = [2025, 2024, 2023, 2022];
      
      // Load completed years and find latest
      const results = await Promise.all(
        years.map(async (year) => {
          const res = await fetch(`/api/questionnaire?year=${year}`);
          const data = await res.json();
          return data.questionnaire?.answers && Object.keys(data.questionnaire.answers).length > 0 ? year : null;
        })
      );
      
      const completed = results.filter(Boolean) as number[];
      setCompletedYears(completed);
      
      if (completed.length > 0) {
        setLatestYear(Math.max(...completed));
      }
      
      // Load profile from most recent questionnaire
      let profileData = null;
      for (const year of years) {
        const response = await fetch(`/api/questionnaire?year=${year}`);
        const data = await response.json();
        if (data.questionnaire?.answers && Object.keys(data.questionnaire.answers).length > 0) {
          profileData = data.questionnaire.answers;
          calculateProgress(profileData);
          break;
        }
      }
      
      setProfile(profileData || {});
      setFormData({
        firstName: profileData?.firstName || profileData?.[1] || "",
        lastName: profileData?.lastName || "",
        ...profileData,
      });
      
      // Load notes from localStorage
      const savedNotes = localStorage.getItem('taxNotes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
      
      // Load pinned tips from localStorage
      const savedTips = localStorage.getItem('pinnedTips');
      if (savedTips) {
        const pinnedIds = JSON.parse(savedTips);
        setHelpTips(prev => prev.map(tip => ({
          ...tip,
          isPinned: pinnedIds.includes(tip.id)
        })));
      }
      
    } catch (error) {
      console.error('Error loading user data:', error);
      setProfile({});
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (data: any) => {
    const newProgress: TaxProgress = {
      personalInfo: !!(data.firstName && data.lastName && data.filingStatus),
      income: !!(data.w2Income || data.wages || data.salary || data[10]), // Common income question IDs
      deductions: !!(data.mortgage || data.donations || data.medicalExpenses || data[25]),
      credits: !!(data.childTaxCredit || data.earnedIncomeCredit || data[40]),
      review: false
    };
    setProgress(newProgress);
  };

  const getProgressPercentage = () => {
    const completed = Object.values(progress).filter(Boolean).length;
    return Math.round((completed / Object.keys(progress).length) * 100);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: latestYear, answers: formData }),
      });
      setProfile(formData);
      setEditMode(false);
      setShowEditModal(false);
      calculateProgress(formData);
    } finally {
      setSaving(false);
    }
  };

  const handleAddNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;
    
    const note: TaxNote = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      category: newNote.category,
      createdAt: new Date()
    };
    
    const updatedNotes = [...notes, note];
    setNotes(updatedNotes);
    localStorage.setItem('taxNotes', JSON.stringify(updatedNotes));
    
    setNewNote({ title: '', content: '', category: 'general' });
    setShowNotesModal(false);
  };

  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
    localStorage.setItem('taxNotes', JSON.stringify(updatedNotes));
  };

  const handleTogglePinTip = (tipId: string) => {
    const updatedTips = helpTips.map(tip => 
      tip.id === tipId ? { ...tip, isPinned: !tip.isPinned } : tip
    );
    setHelpTips(updatedTips);
    
    const pinnedIds = updatedTips.filter(tip => tip.isPinned).map(tip => tip.id);
    localStorage.setItem('pinnedTips', JSON.stringify(pinnedIds));
  };

  const toggleTipExpanded = (tipId: string) => {
    const newExpanded = new Set(expandedTips);
    if (newExpanded.has(tipId)) {
      newExpanded.delete(tipId);
    } else {
      newExpanded.add(tipId);
    }
    setExpandedTips(newExpanded);
  };

  const prettyLabel = (key: string) =>
    key
      .replace(/_/g, " ")
      .replace(/\b(ssn|dob)\b/gi, (m) => m.toUpperCase())
      .replace(/\b([a-z])/g, (m) => m.toUpperCase());

  const getFieldType = (key: string, value: any) => {
    if (key.toLowerCase().includes("date") || key.toLowerCase().includes("dob")) return "date";
    if (key.toLowerCase().includes("email")) return "email";
    if (key.toLowerCase().includes("ssn")) return "text";
    if (typeof value === "number") return "number";
    if (typeof value === "string" && value.length > 60) return "textarea";
    return "text";
  };

  const getFieldIcon = (key: string) => {
    if (key.toLowerCase().includes("email")) return <Mail className="w-4 h-4" />;
    if (key.toLowerCase().includes("phone")) return <Phone className="w-4 h-4" />;
    if (key.toLowerCase().includes("address") || key.toLowerCase().includes("city") || key.toLowerCase().includes("state")) return <MapPin className="w-4 h-4" />;
    if (key.toLowerCase().includes("date") || key.toLowerCase().includes("dob")) return <Calendar className="w-4 h-4" />;
    if (key.toLowerCase().includes("ssn")) return <Shield className="w-4 h-4" />;
    return <User className="w-4 h-4" />;
  };

  const pinnedTips = helpTips.filter(tip => tip.isPinned);
  const progressPercentage = getProgressPercentage();

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F3E8FF] via-white to-[#FFF8E1]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[#8000FF] text-xl font-semibold"
        >
          Loading your profile...
        </motion.div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3E8FF] via-white to-[#FFF8E1] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <User className="text-[#8000FF] w-8 h-8" />
              <h1 className="text-3xl font-bold text-[#8000FF]">Tax Profile</h1>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(`/main/${latestYear}`)}
                className="flex items-center gap-2 px-6 py-3 bg-[#FFC107] text-[#8000FF] font-semibold rounded-xl hover:bg-[#FFD54F] transition-all duration-200 shadow-lg"
              >
                <Play className="w-5 h-5" />
                Resume {latestYear} Return
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-[#8000FF] text-white font-semibold rounded-xl hover:bg-[#6a00cc] transition-all duration-200 shadow-lg"
              >
                <Edit3 className="w-5 h-5" />
                Edit Profile
              </motion.button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Return Progress</h2>
              <span className="text-2xl font-bold text-[#8000FF]">{progressPercentage}%</span>
            </div>
            <div className="relative">
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#8000FF] to-[#FFC107] rounded-full"
                />
              </div>
              <div className="flex justify-between mt-3 text-xs text-gray-600">
                <span className={progress.personalInfo ? 'text-[#8000FF] font-semibold' : ''}>Personal</span>
                <span className={progress.income ? 'text-[#8000FF] font-semibold' : ''}>Income</span>
                <span className={progress.deductions ? 'text-[#8000FF] font-semibold' : ''}>Deductions</span>
                <span className={progress.credits ? 'text-[#8000FF] font-semibold' : ''}>Credits</span>
                <span className={progress.review ? 'text-[#8000FF] font-semibold' : ''}>Review</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Pinned Tips */}
        <AnimatePresence>
          {pinnedTips.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <div className="bg-[#FFF8E1] rounded-xl p-6 shadow-lg border border-[#FFC107]/30">
                <div className="flex items-center gap-2 mb-4">
                  <Pin className="text-[#FFC107] w-5 h-5" />
                  <h3 className="text-lg font-semibold text-[#8000FF]">Pinned Tips</h3>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {pinnedTips.map(tip => (
                    <motion.div
                      key={tip.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white rounded-lg p-4 border border-[#FFC107]/20"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-1">{tip.title}</h4>
                          <p className="text-sm text-gray-600">{tip.content}</p>
                        </div>
                        <button
                          onClick={() => handleTogglePinTip(tip.id)}
                          className="text-[#FFC107] hover:text-[#FFB300] ml-2"
                        >
                          <PinOff className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                <span className="text-sm text-gray-500">
                  {completedYears.length > 0 ? `Based on ${Math.max(...completedYears)} return` : 'No data available'}
                </span>
              </div>

              {profile && Object.keys(profile).length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Key profile fields */}
                  {[
                    { key: 'firstName', label: 'First Name', value: profile.firstName || profile[1] || 'Not provided' },
                    { key: 'lastName', label: 'Last Name', value: profile.lastName || 'Not provided' },
                    { key: 'filingStatus', label: 'Filing Status', value: profile.filingStatus || profile[2] || 'Not provided' },
                    { key: 'ssnLast4', label: 'SSN (Last 4)', value: profile.ssnLast4 ? `****-${profile.ssnLast4}` : 'Not provided' },
                    { key: 'email', label: 'Email', value: session?.user?.email || 'Not provided' },
                    { key: 'occupation', label: 'Occupation', value: profile.occupation || 'Not provided' }
                  ].map(({ key, label, value }) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                        {getFieldIcon(key)}
                        {label}
                      </div>
                      <div className="px-4 py-3 bg-gray-50 rounded-lg text-black font-medium">
                        {value}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg mb-2">No profile data found</p>
                  <p className="text-sm">Complete a tax questionnaire to see your profile information here.</p>
                </div>
              )}

              {/* Tax Years Access */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Tax Years</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[2025, 2024, 2023, 2022].map((year) => (
                    <motion.button
                      key={year}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => router.push(`/main/${year}`)}
                      className={`p-3 rounded-lg font-semibold transition-all duration-200 ${
                        completedYears.includes(year)
                          ? 'bg-[#8000FF] text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {year}
                      {completedYears.includes(year) && (
                        <Check className="w-4 h-4 ml-1 inline" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Notes Section */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#8000FF]" />
                  Notes to Self
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowNotesModal(true)}
                  className="text-[#8000FF] hover:bg-[#F3E8FF] p-2 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {notes.length > 0 ? (
                  notes.map(note => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 text-sm">{note.title}</h4>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{note.content}</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                            note.category === 'deduction' ? 'bg-green-100 text-green-800' :
                            note.category === 'income' ? 'bg-blue-100 text-blue-800' :
                            note.category === 'reminder' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {note.category}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(note.id);
                          }}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">No notes yet</p>
                )}
              </div>
            </div>

            {/* Help Tips */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-[#FFC107]" />
                  Help Tips
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowTipsModal(true)}
                  className="text-[#8000FF] hover:bg-[#F3E8FF] p-2 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {helpTips.slice(0, 3).map(tip => (
                  <div key={tip.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleTipExpanded(tip.id)}
                      className="w-full p-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-sm text-gray-800">{tip.title}</span>
                      {expandedTips.has(tip.id) ? 
                        <ChevronUp className="w-4 h-4 text-gray-500" /> : 
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      }
                    </button>
                    <AnimatePresence>
                      {expandedTips.has(tip.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-3 pt-0 border-t border-gray-200">
                            <p className="text-sm text-gray-600 mb-2">{tip.content}</p>
                            <button
                              onClick={() => handleTogglePinTip(tip.id)}
                              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-colors ${
                                tip.isPinned 
                                  ? 'bg-[#FFC107] text-[#8000FF]' 
                                  : 'bg-gray-100 text-gray-600 hover:bg-[#FFC107] hover:text-[#8000FF]'
                              }`}
                            >
                              {tip.isPinned ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
                              {tip.isPinned ? 'Unpin' : 'Pin'}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3 rounded-xl bg-[#FFC107] text-[#8000FF] font-semibold hover:bg-[#FFD54F] transition-all duration-200 shadow-lg"
              >
                <Link
                  href="/main/2024?tab=taxprep"
                  className="block w-full h-full"
                  tabIndex={0}
                  style={{ textAlign: "center" }}
                >
                  View My 1040
                </Link>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/main')}
                className="w-full px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all duration-200"
              >
                ← Back to Main
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => signOut({ callbackUrl: "/main/signin" })}
                className="w-full px-6 py-3 rounded-xl bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition-all duration-200"
              >
                Sign Out
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Edit Profile Modal */}
        <AnimatePresence>
          {showEditModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">Edit Profile</h3>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <form className="space-y-4">
                  {formData && Object.entries(formData)
                    .filter(([key]) => !key.match(/^\d+$/)) // Filter out numeric keys
                    .map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 capitalize">
                          {prettyLabel(key)}
                        </label>
                        {getFieldType(key, value) === "textarea" ? (
                          <textarea
                            name={key}
                            value={typeof value === "string" || typeof value === "number" ? value : ""}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8000FF] focus:border-transparent text-black"
                            rows={3}
                          />
                        ) : (
                          <input
                            name={key}
                            type={getFieldType(key, value)}
                            value={typeof value === "string" || typeof value === "number" ? value : ""}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8000FF] focus:border-transparent text-black"
                          />
                        )}
                      </div>
                    ))}
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 bg-[#8000FF] text-white py-3 rounded-lg hover:bg-[#6a00cc] transition-colors font-semibold disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        setFormData(profile);
                      }}
                      className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notes Modal */}
        <AnimatePresence>
          {showNotesModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 w-full max-w-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Add Note</h3>
                  <button
                    onClick={() => setShowNotesModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={newNote.title}
                      onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8000FF] focus:border-transparent text-black"
                      placeholder="Note title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={newNote.category}
                      onChange={(e) => setNewNote({ ...newNote, category: e.target.value as TaxNote['category'] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8000FF] focus:border-transparent text-black"
                    >
                      <option value="general">General</option>
                      <option value="deduction">Deduction</option>
                      <option value="income">Income</option>
                      <option value="reminder">Reminder</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                      value={newNote.content}
                      onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8000FF] focus:border-transparent text-black resize-none"
                      rows={3}
                      placeholder="Note content"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddNote}
                      className="flex-1 bg-[#8000FF] text-white py-2 rounded-lg hover:bg-[#6a00cc] transition-colors font-semibold"
                    >
                      Add Note
                    </button>
                    <button
                      onClick={() => setShowNotesModal(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tips Modal */}
        <AnimatePresence>
          {showTipsModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">All Help Tips</h3>
                  <button
                    onClick={() => setShowTipsModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {helpTips.map(tip => (
                    <div key={tip.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-2">{tip.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{tip.content}</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                            tip.category === 'irs' ? 'bg-red-100 text-red-800' :
                            tip.category === 'deduction' ? 'bg-green-100 text-green-800' :
                            tip.category === 'filing' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {tip.category}
                          </span>
                        </div>
                        <button
                          onClick={() => handleTogglePinTip(tip.id)}
                          className={`ml-3 p-2 rounded-lg transition-colors ${
                            tip.isPinned 
                              ? 'bg-[#FFC107] text-[#8000FF]' 
                              : 'bg-gray-100 text-gray-600 hover:bg-[#FFC107] hover:text-[#8000FF]'
                          }`}
                        >
                          {tip.isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
