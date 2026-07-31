import React, { useState } from 'react';
import { Award, Trophy, Medal, Star, Clock, Flame, Search, ChevronRight, ShieldCheck, Heart, Sparkles, Filter } from 'lucide-react';

export interface LeaderboardVolunteer {
  rank: number;
  id: string;
  name: string;
  role: string;
  hours: number;
  projectsCompleted: number;
  badgesCount: number;
  avatarUrl: string;
  region: string;
  isCurrentMember?: boolean;
  topBadge: string;
}

export const DEFAULT_LEADERBOARD_DATA: LeaderboardVolunteer[] = [
  {
    rank: 1,
    id: 'VOL-8820',
    name: 'Sarah Student',
    role: 'Senior Volunteer Lead',
    hours: 124,
    projectsCompleted: 14,
    badgesCount: 6,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    region: 'Pune West',
    isCurrentMember: true,
    topBadge: 'Youth Mentor Lead',
  },
  {
    rank: 2,
    id: 'VOL-7741',
    name: 'Anjali Sharma',
    role: 'Digital Literacy Facilitator',
    hours: 118,
    projectsCompleted: 12,
    badgesCount: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    region: 'Pune East',
    topBadge: 'Senior Tech Educator',
  },
  {
    rank: 3,
    id: 'VOL-6612',
    name: 'Rohan Deshmukh',
    role: 'STEM Lab Mentor',
    hours: 105,
    projectsCompleted: 10,
    badgesCount: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    region: 'Satara District',
    topBadge: 'Rural Educator',
  },
  {
    rank: 4,
    id: 'VOL-5534',
    name: 'Priya Kulkarni',
    role: 'Health Drive Coordinator',
    hours: 92,
    projectsCompleted: 9,
    badgesCount: 4,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    region: 'Nashik',
    topBadge: 'Healthcare Champion',
  },
  {
    rank: 5,
    id: 'VOL-4421',
    name: 'Siddharth Patil',
    role: 'Youth Skill Trainer',
    hours: 86,
    projectsCompleted: 8,
    badgesCount: 4,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    region: 'Thane',
    topBadge: 'Vocational Trainer',
  },
  {
    rank: 6,
    id: 'VOL-3310',
    name: 'Neha Verma',
    role: 'Community Outreach Lead',
    hours: 78,
    projectsCompleted: 7,
    badgesCount: 3,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    region: 'Mumbai Suburban',
    topBadge: 'Community Builder',
  },
  {
    rank: 7,
    id: 'VOL-2299',
    name: 'Amit Kumar',
    role: 'Clean Energy Volunteer',
    hours: 71,
    projectsCompleted: 6,
    badgesCount: 3,
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200',
    region: 'Kolhapur',
    topBadge: 'Eco Warrior',
  }
];

interface VolunteerLeaderboardProps {
  volunteers?: LeaderboardVolunteer[];
  title?: string;
  compact?: boolean;
  onViewAll?: () => void;
}

export const VolunteerLeaderboard: React.FC<VolunteerLeaderboardProps> = ({
  volunteers = DEFAULT_LEADERBOARD_DATA,
  title = 'Volunteer Honor Roll',
  compact = false,
  onViewAll,
}) => {
  const [timeframe, setTimeframe] = useState<'all' | 'monthly' | 'weekly'>('monthly');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVolunteers = volunteers.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topThree = volunteers.slice(0, 3);
  const remaining = compact ? filteredVolunteers.slice(3, 6) : filteredVolunteers.slice(3);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20 shrink-0">
            <Trophy className="w-5 h-5 fill-slate-950/20" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-100 px-2.5 py-0.5 rounded-full">
                Top Performers
              </span>
              <span className="text-[10px] text-slate-400 font-bold">Updated Live</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">{title}</h3>
          </div>
        </div>

        {/* Timeframe Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl self-start sm:self-auto border border-slate-200">
          {[
            { id: 'monthly', label: 'This Month' },
            { id: 'weekly', label: 'This Week' },
            { id: 'all', label: 'All-Time' },
          ].map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                timeframe === tf.id
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 2nd Place */}
        {topThree[1] && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center text-center space-y-2 relative overflow-hidden order-2 sm:order-1 hover:border-slate-300 transition-all">
            <div className="absolute top-3 left-3 bg-slate-200 text-slate-700 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
              <Medal className="w-3 h-3 text-slate-500" />
              <span>2nd Rank</span>
            </div>
            <div className="w-16 h-16 rounded-full p-0.5 bg-slate-300 mt-2 relative">
              <img
                src={topThree[1].avatarUrl}
                alt={topThree[1].name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 truncate max-w-[140px]">{topThree[1].name}</h4>
              <p className="text-[11px] font-semibold text-slate-500 truncate max-w-[140px]">{topThree[1].role}</p>
            </div>
            <div className="bg-white px-3 py-1 rounded-xl border border-slate-200 text-xs font-black text-slate-900 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{topThree[1].hours} Hours</span>
            </div>
          </div>
        )}

        {/* 1st Place Gold Champion */}
        {topThree[0] && (
          <div className="bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-white border-2 border-amber-400 rounded-2xl p-5 flex flex-col items-center text-center space-y-2.5 relative shadow-md order-1 sm:order-2 scale-102">
            <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
              <Trophy className="w-3 h-3 fill-slate-950/20" />
              <span>1st Champion</span>
            </div>
            {topThree[0].isCurrentMember && (
              <div className="absolute top-3 right-3 bg-blue-950 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                You
              </div>
            )}
            <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-amber-400 to-orange-500 shadow-md relative mt-1">
              <img
                src={topThree[0].avatarUrl}
                alt={topThree[0].name}
                className="w-full h-full object-cover rounded-full border-2 border-white"
              />
            </div>
            <div>
              <h4 className="font-black text-base text-slate-900 truncate max-w-[160px]">{topThree[0].name}</h4>
              <p className="text-xs font-bold text-amber-700 truncate max-w-[160px]">{topThree[0].role}</p>
            </div>
            <div className="bg-amber-500 text-slate-950 px-4 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xs">
              <Clock className="w-4 h-4 fill-slate-950/20" />
              <span>{topThree[0].hours} Volunteered Hours</span>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {topThree[2] && (
          <div className="bg-amber-500/5 border border-amber-200 rounded-2xl p-4 flex flex-col items-center text-center space-y-2 relative overflow-hidden order-3 hover:border-amber-300 transition-all">
            <div className="absolute top-3 left-3 bg-amber-200 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
              <Medal className="w-3 h-3 text-amber-700" />
              <span>3rd Rank</span>
            </div>
            <div className="w-16 h-16 rounded-full p-0.5 bg-amber-400/60 mt-2 relative">
              <img
                src={topThree[2].avatarUrl}
                alt={topThree[2].name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 truncate max-w-[140px]">{topThree[2].name}</h4>
              <p className="text-[11px] font-semibold text-slate-500 truncate max-w-[140px]">{topThree[2].role}</p>
            </div>
            <div className="bg-white px-3 py-1 rounded-xl border border-amber-200 text-xs font-black text-slate-900 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{topThree[2].hours} Hours</span>
            </div>
          </div>
        )}
      </div>

      {/* Search Input for Ranks 4+ */}
      {!compact && (
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search volunteers by name, region or role..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all"
          />
        </div>
      )}

      {/* Ranks List Table */}
      <div className="space-y-2">
        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">
          Honorable Mentions & Rankings
        </p>

        {remaining.length === 0 ? (
          <p className="text-xs text-slate-500 italic p-4 text-center">No volunteers found matching search.</p>
        ) : (
          remaining.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                item.isCurrentMember
                  ? 'bg-amber-50/80 border-amber-300 shadow-2xs'
                  : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-6 text-center font-black text-xs text-slate-400 shrink-0">
                  #{item.rank}
                </span>

                <img
                  src={item.avatarUrl}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-300 shrink-0"
                />

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-extrabold text-xs text-slate-900 truncate">{item.name}</p>
                    {item.isCurrentMember && (
                      <span className="bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-md uppercase shrink-0">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium truncate">
                    {item.role} • <span className="text-slate-400">{item.region}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 text-right">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-extrabold text-slate-900">{item.projectsCompleted} Projects</p>
                  <p className="text-[10px] text-slate-400 font-semibold">{item.badgesCount} Badges</p>
                </div>

                <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-black text-slate-900 flex items-center gap-1 shadow-2xs">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>{item.hours}h</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View All / Footer link */}
      {compact && onViewAll && (
        <div className="pt-2 text-center border-t border-slate-100">
          <button
            onClick={onViewAll}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center justify-center gap-1 mx-auto cursor-pointer"
          >
            <span>View Full Leaderboard Directory</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
