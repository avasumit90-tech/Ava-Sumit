import React, { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star, Sparkles, Heart, Pause, Play, Award } from 'lucide-react';

export interface Testimonial {
  id: string;
  volunteerName: string;
  role: string;
  projectName: string;
  avatarUrl: string;
  location: string;
  quote: string;
  story: string;
  impactMetric: string;
  rating: number;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    volunteerName: 'Anjali Sharma',
    role: 'Astha Didi • Digital Educator',
    projectName: 'Digital Literacy Drive - Senior Citizens',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    location: 'Pune, Maharashtra',
    quote: 'Teaching grandmothers how to make video calls to their children abroad brought tears of joy to my eyes.',
    story: 'Over 8 weeks, our team empowered 45 elderly citizens with smartphone skills, mobile banking safety, and cyber threat awareness.',
    impactMetric: '45 Seniors Trained',
    rating: 5,
  },
  {
    id: '2',
    volunteerName: 'Rohan Deshmukh',
    role: 'Rural Education Mentor',
    projectName: 'Rural School STEM Lab Setup',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    location: 'Satara District',
    quote: 'When a 10-year-old girl coded her first robot sensor, I knew we were building true equality in rural education.',
    story: 'We converted a vacant classroom into a solar-powered STEM laboratory with 15 laptops and robotic kits for 200+ village students.',
    impactMetric: '200+ Students Reached',
    rating: 5,
  },
  {
    id: '3',
    volunteerName: 'Priya Kulkarni',
    role: 'Healthcare & Hygiene Coordinator',
    projectName: 'Maternal & Adolescent Health Drive',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
    location: 'Nashik Tribal Belt',
    quote: 'Demystifying health and hygiene taboos has given adolescent girls the confidence to stay in school without interruption.',
    story: 'Conducted 12 health screening camps and distributed eco-friendly hygiene kits alongside certified medical professionals.',
    impactMetric: '1,200 Hygiene Kits Delivered',
    rating: 5,
  },
  {
    id: '4',
    volunteerName: 'Siddharth Patil',
    role: 'Youth Empowerment Officer',
    projectName: 'Vocational Skill Workshops for Women',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    location: 'Thane District',
    quote: 'Seeing women launch their own tailoring micro-enterprises proves that targeted mentorship changes whole families.',
    story: 'Provided hands-on micro-entrepreneurship training and sewing equipment to 35 local women entrepreneurs.',
    impactMetric: '35 Micro-Businesses Started',
    rating: 5,
  },
];

interface TestimonialSliderProps {
  autoPlayInterval?: number;
}

export const TestimonialSlider: React.FC<TestimonialSliderProps> = ({
  autoPlayInterval = 6000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isPlaying, autoPlayInterval]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-2xl border border-slate-800">
      {/* Background Decorative Accent Gradients */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-6 mb-8">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-500/15 rounded-xl text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
              Volunteer Voices & Impact
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Stories From The Field
            </h3>
          </div>
        </div>

        {/* Play / Pause Toggle */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs font-bold flex items-center gap-2 border border-slate-700/50"
          title={isPlaying ? 'Pause Auto-slide' : 'Resume Auto-slide'}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Pause Slider</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              <span className="hidden sm:inline">Auto Play</span>
            </>
          )}
        </button>
      </div>

      {/* Main Slide Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[320px]">
        {/* Left Column: Volunteer Card & Profile */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
          <div className="relative">
            {/* Avatar Ring */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-orange-500 to-blue-500 shadow-xl">
              <img
                src={current.avatarUrl}
                alt={current.volunteerName}
                className="w-full h-full object-cover rounded-full border-2 border-slate-900"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-950 font-extrabold text-[10px] px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <Award className="w-3 h-3" />
              <span>Verified</span>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-extrabold text-white tracking-tight">{current.volunteerName}</h4>
            <p className="text-xs font-bold text-amber-400 mt-0.5">{current.role}</p>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">{current.location}</p>
          </div>

          {/* Project Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-slate-200 text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/20" />
            <span className="truncate max-w-[220px]">{current.projectName}</span>
          </div>

          {/* Impact Badge */}
          <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 px-4 py-2 rounded-2xl text-xs font-black">
            🚀 Impact Outcome: {current.impactMetric}
          </div>
        </div>

        {/* Right Column: Quote & Details */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6 text-left">
          <div className="space-y-4 relative">
            <Quote className="w-10 h-10 text-amber-500/20 absolute -top-4 -left-2 pointer-events-none" />

            <div className="flex items-center gap-1 text-amber-400 pt-2">
              {[...Array(current.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>

            <p className="text-lg sm:text-xl font-extrabold text-slate-100 italic leading-snug tracking-tight">
              "{current.quote}"
            </p>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
              {current.story}
            </p>
          </div>

          {/* Slider Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {/* Pagination Dots */}
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`transition-all cursor-pointer rounded-full ${
                    idx === currentIndex
                      ? 'w-8 h-2.5 bg-amber-400'
                      : 'w-2.5 h-2.5 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-all border border-slate-700 cursor-pointer hover:scale-105 active:scale-95"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-3 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all font-bold cursor-pointer hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
