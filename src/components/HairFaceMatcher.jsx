import React, { useState, useMemo } from 'react';
import { useSalon } from '../context/SalonContext';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  RotateCcw,
  Star,
  ShieldCheck,
  ChevronRight,
  Info,
  Calendar,
  Sliders,
  Scissors,
  Eye,
  Heart,
  HelpCircle,
} from 'lucide-react';

// Face Shape Definitions with custom SVG outlines & expert Indian atelier coiffure insights
const FACE_SHAPES = [
  {
    id: 'oval',
    name: 'Oval Face',
    subtitle: 'Balanced symmetry & soft curves',
    description:
      'Forehead is slightly wider than the gently rounded chin. Proportions are naturally harmonious.',
    bestFor:
      'Almost all styles flatter oval shapes. Voluminous Bollywood curtain layers and soft waves enhance cheekbone definition.',
    idealLayer: 'Collarbone-grazing layers with outward flicks',
    iconPath: (
      <svg viewBox="0 0 100 120" className="w-12 h-14 stroke-current fill-none stroke-[2.2]">
        <ellipse cx="50" cy="60" rx="30" ry="42" className="text-[#D4AF37]" />
        {/* Subtle symmetry markers */}
        <line x1="50" y1="22" x2="50" y2="98" strokeDasharray="3 3" className="stroke-white/20" />
        <line x1="24" y1="60" x2="76" y2="60" strokeDasharray="3 3" className="stroke-white/20" />
      </svg>
    ),
  },
  {
    id: 'round',
    name: 'Round Face',
    subtitle: 'Soft curved jawline & fuller cheeks',
    description:
      'Face width and length are roughly equal with soft, non-angular jaw contours.',
    bestFor:
      'Elongating vertical styles, cascading Bollywood layers starting below the chin, and sweeping side-part bangs that slenderize cheek fullness.',
    idealLayer: 'Deep curtain bangs parting at eye level, cascading below shoulders',
    iconPath: (
      <svg viewBox="0 0 100 120" className="w-12 h-14 stroke-current fill-none stroke-[2.2]">
        <circle cx="50" cy="60" r="36" className="text-[#D4AF37]" />
        <line x1="50" y1="26" x2="50" y2="94" strokeDasharray="3 3" className="stroke-white/20" />
        <line x1="18" y1="60" x2="82" y2="60" strokeDasharray="3 3" className="stroke-white/20" />
      </svg>
    ),
  },
  {
    id: 'square',
    name: 'Square Face',
    subtitle: 'Chiseled angular jawline & broad brow',
    description:
      'Forehead, cheekbones, and jawline have equal width with strong, pronounced angular jaw points.',
    bestFor:
      'Softening angular edges with wispy textured fringes, rounded layers, soft waves, or low skin fades that taper cleanly into a contoured beard line.',
    idealLayer: 'Soft, airy graduated layers and rounded neckline transitions',
    iconPath: (
      <svg viewBox="0 0 100 120" className="w-12 h-14 stroke-current fill-none stroke-[2.2]">
        <rect x="22" y="28" width="56" height="64" rx="14" className="text-[#D4AF37]" />
        <line x1="50" y1="28" x2="50" y2="92" strokeDasharray="3 3" className="stroke-white/20" />
      </svg>
    ),
  },
  {
    id: 'heart',
    name: 'Heart Face',
    subtitle: 'Wider forehead & delicate pointed chin',
    description:
      'Prominent cheekbones with a broader brow tapering down gracefully to a petite, defined chin.',
    bestFor:
      'Styles that add volume near the jawline—collarbone lobs, bouncy flicked ends, low textured royal braids, or classic temple tapers.',
    idealLayer: 'Chin-length textured flips that fill space around the jaw',
    iconPath: (
      <svg viewBox="0 0 100 120" className="w-12 h-14 stroke-current fill-none stroke-[2.2]">
        <path
          d="M 50 96 C 30 78, 20 54, 20 42 C 20 28, 34 26, 50 36 C 66 26, 80 28, 80 42 C 80 54, 70 78, 50 96 Z"
          className="text-[#D4AF37]"
        />
      </svg>
    ),
  },
  {
    id: 'diamond',
    name: 'Diamond Face',
    subtitle: 'High dramatic cheekbones & narrow brow',
    description:
      'Cheekbones are the widest feature with a narrower hairline and tapered chin line.',
    bestFor:
      'Chin-framing bob layers, caramel balayage dimension around temples, and textured blowouts that accentuate cheekbone structure.',
    idealLayer: 'Mid-length layers with face-framing softness around jawline',
    iconPath: (
      <svg viewBox="0 0 100 120" className="w-12 h-14 stroke-current fill-none stroke-[2.2]">
        <polygon points="50,22 82,60 50,98 18,60" className="text-[#D4AF37]" />
      </svg>
    ),
  },
  {
    id: 'oblong',
    name: 'Oblong / Rectangle',
    subtitle: 'Elongated facial symmetry & slender frame',
    description:
      'Face is visibly longer than it is wide, with straight cheek contours and slender jaw.',
    bestFor:
      'Adding horizontal body and width: voluminous blowouts, full curtain bangs, side-swept waves, and fuller beard architecture to balance length.',
    idealLayer: 'Crown-level side volume with curtain bangs to shorten forehead',
    iconPath: (
      <svg viewBox="0 0 100 120" className="w-12 h-14 stroke-current fill-none stroke-[2.2]">
        <rect x="26" y="20" width="48" height="80" rx="20" className="text-[#D4AF37]" />
        <line x1="26" y1="60" x2="74" y2="60" strokeDasharray="3 3" className="stroke-white/20" />
      </svg>
    ),
  },
];

// Hair Length Options
const HAIR_LENGTHS = [
  {
    id: 'short',
    name: 'Short / Fade / Crop',
    range: 'Above chin or precision barber fade',
    icon: '✂️',
  },
  {
    id: 'medium',
    name: 'Medium / Lob / Collarbone',
    range: 'Shoulder to collarbone length',
    icon: '✨',
  },
  {
    id: 'long',
    name: 'Long / Mermaid Cascades',
    range: 'Below shoulder blades to waist',
    icon: '👑',
  },
  {
    id: 'beard_grooming',
    name: 'Royal Beard & Head Champi',
    range: 'Focused on beard architecture & scalp',
    icon: '🧔🏽',
  },
];

// Hair Texture & Prakriti Options
const HAIR_TEXTURES = [
  {
    id: 'fine_straight',
    name: 'Fine & Silky Straight',
    trait: 'Needs bounce, root lift & anti-limpness',
    prakriti: 'Pitta / Vata',
  },
  {
    id: 'wavy_frizz',
    name: 'Lustrous Wavy (Desi Wave)',
    trait: 'Seeks definition, humidity protection & shine',
    prakriti: 'Kapha / Pitta',
  },
  {
    id: 'curly_coily',
    name: 'Voluminous Curly / Coily',
    trait: 'Seeks intense Ayurvedic hydration & shape retention',
    prakriti: 'Vata Dominant',
  },
  {
    id: 'dense_coarse',
    name: 'Thick, Dense or Chemically Treated',
    trait: 'Needs weight redistribution, softness & scalp detox',
    prakriti: 'Kapha Dominant',
  },
];

// Primary Styling Goal
const STYLING_GOALS = [
  {
    id: 'glam_volume',
    name: 'Bollywood Red Carpet Volume',
    focus: 'Dynamic movement, flicked layers & glossy blowout',
    badge: 'Red Carpet Glam',
  },
  {
    id: 'ayurvedic_spa',
    name: 'Ayurvedic Shirodhara & Scalp Healing',
    focus: 'Stress dissolving, third-eye oil flow & follicle revival',
    badge: 'Vedic Healing',
  },
  {
    id: 'nawabi_fade',
    name: 'Nawabi Sharp Fade & Beard Architecture',
    focus: 'Crisp ustara straight razor lineup & sandalwood champi',
    badge: 'Royal Barbering',
  },
  {
    id: 'color_henna',
    name: 'Warm Caramel Balayage / Sojat Henna',
    focus: 'Dimensional tones tailored to Indian skin undertones',
    badge: 'Artisan Color',
  },
  {
    id: 'bridal_festive',
    name: 'Desi Bridal & Mogra Gajra Artistry',
    focus: 'Royal festive coiffure, mathapatti & fresh Madurai jasmine',
    badge: 'Bridal Atelier',
  },
];

export const HairFaceMatcher = () => {
  const { services, stylists, applyMatcherRecommendation, openBookingModal } = useSalon();

  // Quiz state: steps 1 (Face Shape), 2 (Length), 3 (Texture), 4 (Goal)
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFace, setSelectedFace] = useState(FACE_SHAPES[0]);
  const [selectedLength, setSelectedLength] = useState(HAIR_LENGTHS[1]); // Medium default
  const [selectedTexture, setSelectedTexture] = useState(HAIR_TEXTURES[1]); // Wavy default
  const [selectedGoal, setSelectedGoal] = useState(STYLING_GOALS[0]);
  const [isCalculated, setIsCalculated] = useState(false);

  // Dynamic Recommendation Engine Logic
  const recommendation = useMemo(() => {
    let serviceId = 'srv-1'; // Default Bollywood Layers
    let stylistId = 'stylist-1'; // Priya Sundaram

    // Intelligent decision tree matching combinations
    if (selectedLength.id === 'beard_grooming' || selectedGoal.id === 'nawabi_fade') {
      serviceId = 'srv-3'; // Royal Nawabi Shahi Haircut & Sandalwood Champi
      stylistId = 'stylist-2'; // Aarav Kapoor
    } else if (selectedGoal.id === 'ayurvedic_spa' || selectedTexture.id === 'curly_coily') {
      serviceId = 'srv-2'; // Authentic Kerala Shirodhara & Kesh Raksha Spa
      stylistId = 'stylist-3'; // Vaidya Rajeshwar Nair
    } else if (selectedGoal.id === 'color_henna') {
      serviceId = 'srv-6'; // Organic Sojat Henna & Hibiscus Gloss
      stylistId = 'stylist-4'; // Devika Sen
    } else if (selectedGoal.id === 'bridal_festive') {
      serviceId = 'srv-5'; // Desi Bridal / Sangeet Hair & Mogra Gajra Artistry
      stylistId = 'stylist-1'; // Priya Sundaram
    } else if (selectedFace.id === 'square' && selectedLength.id === 'short') {
      serviceId = 'srv-10'; // Modern Desi Precision Fade & Textured Crop
      stylistId = 'stylist-2'; // Aarav Kapoor
    } else {
      // Default & Volume Layers
      serviceId = 'srv-1';
      stylistId = 'stylist-1';
    }

    const matchedService = services.find((s) => s.id === serviceId) || services[0];
    const matchedStylist = stylists.find((st) => st.id === stylistId) || stylists[1];

    // Harmony explanation for the specific face shape
    let harmonyExplanation = '';
    switch (selectedFace.id) {
      case 'round':
        harmonyExplanation = `For your Round face and ${selectedTexture.name}, sweeping face-framing angles elongate your silhouette and slim down cheek contours with glamorous vertical bounce.`;
        break;
      case 'square':
        harmonyExplanation = `Your Square jawline has gorgeous natural definition. Our textured layers and soft curved styling soften the jaw corners while spotlighting high cheekbones.`;
        break;
      case 'heart':
        harmonyExplanation = `Your Heart face features an elegant brow and delicate chin. The recommended treatment balances your jawline with bouncy fullness at the collarbone.`;
        break;
      case 'diamond':
        harmonyExplanation = `For your Diamond bone structure, this look opens up your temple area and balances your dramatic high cheekbones with flowing organic texture.`;
        break;
      case 'oblong':
        harmonyExplanation = `For your Oblong facial symmetry, lateral layers and face-framing curtain sweeps create horizontal fullness and effortless proportion.`;
        break;
      case 'oval':
      default:
        harmonyExplanation = `Your Oval face provides the gold-standard canvas. This ritual maximizes dimensional bounce, lustrous shine, and personalized facial framing.`;
        break;
    }

    return {
      service: matchedService,
      stylist: matchedStylist,
      harmonyExplanation,
      matchScore: 98 + (selectedFace.id === 'oval' ? 2 : 1), // 98% - 100%
      summary: `${selectedFace.name} + ${selectedLength.name} (${selectedTexture.name}) -> ${matchedService.name}`,
      stylistBrief: `Visual Face Matcher Profile: Client has ${selectedFace.name} (${selectedFace.subtitle}), ${selectedLength.name} length with ${selectedTexture.name} texture. Desired goal: ${selectedGoal.name}. Recommended technique: ${selectedFace.idealLayer}.`,
    };
  }, [selectedFace, selectedLength, selectedTexture, selectedGoal, services, stylists]);

  // Handle quiz next step
  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsCalculated(true);
    }
  };

  // Reset quiz
  const handleReset = () => {
    setCurrentStep(1);
    setIsCalculated(false);
  };

  // Direct Book Matcher Action
  const handleBookMatcher = () => {
    applyMatcherRecommendation({
      service: recommendation.service,
      stylist: recommendation.stylist,
      matcherProfile: {
        faceShape: selectedFace.name,
        hairLength: selectedLength.name,
        hairTexture: selectedTexture.name,
        goal: selectedGoal.name,
        summary: recommendation.summary,
        stylistBrief: recommendation.stylistBrief,
        harmonyExplanation: recommendation.harmonyExplanation,
      },
    });
  };

  return (
    <section id="matcher" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[#D4AF37]/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#8C6B1B]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs uppercase tracking-widest font-bold mb-4 shadow-lg shadow-[#D4AF37]/10 animate-gold-glow">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>30-Second Interactive Consultation</span>
          </div>

          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Visual Hair & Face Architecture Matcher
          </h2>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Answer 3 quick visual questions to unlock your scientifically harmonized Indian salon ritual,
            exact treatment duration, and matched master stylist specialization.
          </p>
        </div>

        {/* Main Quiz / Results Container */}
        <div className="glass-panel-gold rounded-3xl border border-[#D4AF37]/30 shadow-2xl p-6 sm:p-10 relative overflow-hidden">
          {!isCalculated ? (
            <div>
              {/* Stepper Progress Indicator */}
              <div className="flex items-center justify-between pb-8 mb-8 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#D4AF37] text-black font-bold flex items-center justify-center text-sm shadow-md font-display">
                    {currentStep}
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#D4AF37] font-semibold block">
                      Step {currentStep} of 4
                    </span>
                    <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-white">
                      {currentStep === 1 && 'Select Your Face Shape'}
                      {currentStep === 2 && 'Select Your Hair Length'}
                      {currentStep === 3 && 'Select Hair Texture & Prakriti'}
                      {currentStep === 4 && 'Your Primary Styling Goal'}
                    </h3>
                  </div>
                </div>

                {/* Step Pills */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {[1, 2, 3, 4].map((step) => (
                    <button
                      key={step}
                      onClick={() => setCurrentStep(step)}
                      className={`h-2 rounded-full transition-all ${
                        step === currentStep
                          ? 'w-8 bg-[#D4AF37]'
                          : step < currentStep
                          ? 'w-5 bg-emerald-400'
                          : 'w-2 bg-white/20'
                      }`}
                      aria-label={`Jump to step ${step}`}
                    />
                  ))}
                </div>
              </div>

              {/* STEP 1: FACE SHAPE GRID */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <p className="text-xs sm:text-sm text-gray-300">
                    Your bone structure dictates where layers should begin and how volume should be
                    distributed. Choose the contour closest to yours:
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                    {FACE_SHAPES.map((face) => {
                      const isSelected = selectedFace.id === face.id;
                      return (
                        <div
                          key={face.id}
                          onClick={() => setSelectedFace(face)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center group ${
                            isSelected
                              ? 'bg-[#1F2332] border-[#D4AF37] shadow-xl shadow-[#D4AF37]/20 ring-1 ring-[#D4AF37] scale-102'
                              : 'bg-white/5 border-white/10 hover:border-[#D4AF37]/50 hover:bg-[#181B26]'
                          }`}
                        >
                          <div
                            className={`p-2.5 rounded-xl mb-3 transition-colors ${
                              isSelected
                                ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                                : 'bg-white/5 text-gray-300 group-hover:text-white'
                            }`}
                          >
                            {face.iconPath}
                          </div>

                          <span className="font-serif-luxury text-sm font-bold text-white mb-1">
                            {face.name}
                          </span>

                          <span className="text-[11px] text-gray-400 line-clamp-2 leading-snug">
                            {face.subtitle}
                          </span>

                          <div className="mt-3 pt-2 border-t border-white/5 w-full flex items-center justify-center">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isSelected
                                  ? 'bg-[#D4AF37] text-black'
                                  : 'text-gray-400 opacity-60'
                              }`}
                            >
                              {isSelected ? 'Selected' : 'Select'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Highlight card for selected face */}
                  <div className="p-4 rounded-2xl bg-[#141722] border border-[#D4AF37]/20 flex items-start gap-3 text-xs text-gray-300">
                    <Info className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white font-serif-luxury">{selectedFace.name} Insight: </strong>
                      {selectedFace.bestFor}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: HAIR LENGTH */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <p className="text-xs sm:text-sm text-gray-300">
                    Select your current hair length or grooming focus:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {HAIR_LENGTHS.map((len) => {
                      const isSelected = selectedLength.id === len.id;
                      return (
                        <div
                          key={len.id}
                          onClick={() => setSelectedLength(len)}
                          className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-[#1F2332] border-[#D4AF37] shadow-xl shadow-[#D4AF37]/20 ring-1 ring-[#D4AF37]'
                              : 'bg-white/5 border-white/10 hover:border-[#D4AF37]/50 hover:bg-[#181B26]'
                          }`}
                        >
                          <div>
                            <span className="text-3xl block mb-3">{len.icon}</span>
                            <h4 className="font-serif-luxury text-base font-bold text-white mb-1">
                              {len.name}
                            </h4>
                            <p className="text-xs text-gray-400 leading-relaxed">{len.range}</p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[10px] uppercase tracking-wider text-gray-500">
                              Target Canvas
                            </span>
                            <span
                              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                                isSelected ? 'bg-[#D4AF37] text-black' : 'text-gray-400'
                              }`}
                            >
                              {isSelected ? 'Selected' : 'Select'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: HAIR TEXTURE & PRAKRITI */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <p className="text-xs sm:text-sm text-gray-300">
                    Identify your hair density, natural curl pattern, or scalp condition:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {HAIR_TEXTURES.map((tex) => {
                      const isSelected = selectedTexture.id === tex.id;
                      return (
                        <div
                          key={tex.id}
                          onClick={() => setSelectedTexture(tex)}
                          className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-[#1F2332] border-[#D4AF37] shadow-xl shadow-[#D4AF37]/20 ring-1 ring-[#D4AF37]'
                              : 'bg-white/5 border-white/10 hover:border-[#D4AF37]/50 hover:bg-[#181B26]'
                          }`}
                        >
                          <div>
                            <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold bg-[#D4AF37]/10 px-2 py-0.5 rounded-full inline-block mb-3">
                              {tex.prakriti}
                            </span>
                            <h4 className="font-serif-luxury text-base font-bold text-white mb-1">
                              {tex.name}
                            </h4>
                            <p className="text-xs text-gray-400 leading-relaxed">{tex.trait}</p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-end">
                            <span
                              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                                isSelected ? 'bg-[#D4AF37] text-black' : 'text-gray-400'
                              }`}
                            >
                              {isSelected ? 'Selected' : 'Select'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4: PRIMARY STYLING GOAL */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <p className="text-xs sm:text-sm text-gray-300">
                    What is your main aesthetic or rejuvenation priority for this visit?
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {STYLING_GOALS.map((goal) => {
                      const isSelected = selectedGoal.id === goal.id;
                      return (
                        <div
                          key={goal.id}
                          onClick={() => setSelectedGoal(goal)}
                          className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-[#1F2332] border-[#D4AF37] shadow-xl shadow-[#D4AF37]/20 ring-1 ring-[#D4AF37]'
                              : 'bg-white/5 border-white/10 hover:border-[#D4AF37]/50 hover:bg-[#181B26]'
                          }`}
                        >
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold bg-[#D4AF37]/10 px-2.5 py-1 rounded-full inline-block mb-3">
                              {goal.badge}
                            </span>
                            <h4 className="font-serif-luxury text-base font-bold text-white mb-1">
                              {goal.name}
                            </h4>
                            <p className="text-xs text-gray-400 leading-relaxed">{goal.focus}</p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-end">
                            <span
                              className={`text-xs font-bold px-3 py-1 rounded-full ${
                                isSelected ? 'bg-[#D4AF37] text-black' : 'text-gray-400'
                              }`}
                            >
                              {isSelected ? 'Selected' : 'Select'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stepper Navigation Footer */}
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <div>
                  {currentStep > 1 ? (
                    <button
                      onClick={() => setCurrentStep((p) => p - 1)}
                      className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold border border-white/10 cursor-pointer"
                    >
                      Back
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400">Step 1 of 4</span>
                  )}
                </div>

                <button
                  onClick={handleNext}
                  className="gold-shimmer-btn text-black font-bold text-xs sm:text-sm px-6 py-3 rounded-xl flex items-center gap-2 shadow-xl cursor-pointer"
                >
                  <span>
                    {currentStep === 4 ? 'Calculate Tailored Match' : 'Continue to Next Step'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* RESULTS SCREEN: BEAUTIFULLY HARMONIZED TAILORED MATCH */
            <div className="space-y-8 animate-in zoom-in-95 duration-400">
              {/* Match Header with Gold Score */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                      Harmonized Match Found ({recommendation.matchScore}% Compatibility)
                    </span>
                  </div>
                  <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white">
                    Your Personalized Indian Atelier Consultation
                  </h3>
                </div>

                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Retake Quiz</span>
                </button>
              </div>

              {/* Analysis Summary Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#141720] border border-white/5">
                  <span className="text-gray-400 uppercase tracking-wider text-[10px] block mb-1">
                    Face Shape
                  </span>
                  <span className="font-serif-luxury text-sm font-bold text-white">
                    {selectedFace.name}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#141720] border border-white/5">
                  <span className="text-gray-400 uppercase tracking-wider text-[10px] block mb-1">
                    Hair Length
                  </span>
                  <span className="font-serif-luxury text-sm font-bold text-white">
                    {selectedLength.name}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#141720] border border-white/5">
                  <span className="text-gray-400 uppercase tracking-wider text-[10px] block mb-1">
                    Texture & Prakriti
                  </span>
                  <span className="font-serif-luxury text-sm font-bold text-white">
                    {selectedTexture.name}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#141720] border border-white/5">
                  <span className="text-gray-400 uppercase tracking-wider text-[10px] block mb-1">
                    Primary Goal
                  </span>
                  <span className="font-serif-luxury text-sm font-bold text-[#D4AF37]">
                    {selectedGoal.badge}
                  </span>
                </div>
              </div>

              {/* Face Harmony Rationale Callout */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#D4AF37]/15 via-[#1A1D28] to-[#12141C] border border-[#D4AF37]/30 flex items-start gap-4 shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37] text-black flex items-center justify-center shrink-0 shadow-md">
                  <Sparkles className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h4 className="font-serif-luxury text-base font-bold text-white mb-1">
                    Why This Fits Your {selectedFace.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                    {recommendation.harmonyExplanation}
                  </p>
                  <div className="mt-2 text-[11px] text-[#F3E5AB] font-medium flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Stylist Blueprint: {selectedFace.idealLayer}</span>
                  </div>
                </div>
              </div>

              {/* 2-Column Showcase: Matched Treatment & Matched Master Stylist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Recommended Treatment Card */}
                <div className="p-5 rounded-2xl bg-[#151824] border border-[#D4AF37]/40 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-bold bg-[#D4AF37]/10 px-2.5 py-1 rounded-full border border-[#D4AF37]/30">
                        Ideal Recommended Treatment
                      </span>
                      <span className="text-lg font-bold text-[#D4AF37] font-display">
                        ₹{recommendation.service.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex gap-4 items-start mb-4">
                      <img
                        src={recommendation.service.image}
                        alt={recommendation.service.name}
                        className="w-20 h-20 rounded-xl object-cover border border-white/10 shrink-0"
                      />
                      <div>
                        <h4 className="font-serif-luxury text-base font-bold text-white leading-snug">
                          {recommendation.service.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                          <span>{recommendation.service.categoryName}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-[#D4AF37] font-semibold">
                            <Clock className="w-3 h-3" />
                            {recommendation.service.duration} mins
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed mb-4">
                      {recommendation.service.description}
                    </p>

                    {/* Includes checklist */}
                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                        Included Rituals:
                      </span>
                      {recommendation.service.includes?.slice(0, 3).map((inc, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Matched Stylist Specialization Card */}
                <div className="p-5 rounded-2xl bg-[#151824] border border-[#D4AF37]/40 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        Recommended Stylist Specialization
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold text-[#F3E5AB]">
                        <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                        <span>{recommendation.stylist.rating}</span>
                        <span className="text-gray-400">({recommendation.stylist.reviews})</span>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start mb-4">
                      <img
                        src={recommendation.stylist.image}
                        alt={recommendation.stylist.name}
                        className="w-20 h-20 rounded-xl object-cover border border-white/10 shrink-0"
                      />
                      <div>
                        <h4 className="font-serif-luxury text-base font-bold text-white leading-snug">
                          {recommendation.stylist.name}
                        </h4>
                        <div className="text-xs text-[#D4AF37] font-medium mt-0.5">
                          {recommendation.stylist.role}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-1">
                          {recommendation.stylist.experience}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed mb-4">
                      {recommendation.stylist.bio}
                    </p>

                    {/* Stylist specialties */}
                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                        Artisan Match Specializations:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {recommendation.stylist.specialties?.map((spec, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-semibold bg-white/5 text-gray-200 px-2.5 py-1 rounded-lg border border-white/10"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-gray-400 text-center sm:text-left">
                  <span>* Clicking below will pre-load your recommended treatment, stylist, and face shape notes into </span>
                  <strong className="text-[#D4AF37]">Step 4 of checkout</strong>.
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleBookMatcher}
                    className="w-full sm:w-auto gold-shimmer-btn text-black font-bold text-sm px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-2xl cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-black" />
                    <span>Book Harmonized Ritual (1-Click)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
