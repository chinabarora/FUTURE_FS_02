import { useLeads } from '../hooks/useLeads';
import {
  Users,
  Target,
  Zap,
  BarChart3,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
} from 'recharts';
import { format, subDays, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, eachMonthOfInterval } from 'date-fns';
import { StatCard } from '../components/ui';

const COLORS = {
  new: '#3B82F6',
  contacted: '#F59E0B',
  converted: '#10B981',
};

export function AnalyticsPage() {
  const { leads, getStats } = useLeads();
  const stats = getStats();

  const last30Days = eachDayOfInterval({
    start: subDays(new Date(), 29),
    end: new Date(),
  });

  const dailyTrend = last30Days.map((day) => {
    const formattedDay = format(day, 'yyyy-MM-dd');
    const leadsOnDay = leads.filter((lead) => {
      const leadDate = format(new Date(lead.created_at), 'yyyy-MM-dd');
      return leadDate === formattedDay;
    });

    return {
      date: format(day, 'MMM d'),
      leads: leadsOnDay.length,
      converted: leadsOnDay.filter((l) => l.status === 'converted').length,
    };
  });

  const last6Months = eachMonthOfInterval({
    start: subMonths(new Date(), 5),
    end: new Date(),
  });

  const monthlyTrend = last6Months.map((month) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const leadsInMonth = leads.filter((lead) => {
      const leadDate = new Date(lead.created_at);
      return leadDate >= monthStart && leadDate <= monthEnd;
    });

    return {
      month: format(month, 'MMM'),
      leads: leadsInMonth.length,
      converted: leadsInMonth.filter((l) => l.status === 'converted').length,
    };
  });

  const statusDistribution = [
    { name: 'New', value: stats.new, color: COLORS.new },
    { name: 'Contacted', value: stats.contacted, color: COLORS.contacted },
    { name: 'Converted', value: stats.converted, color: COLORS.converted },
  ];

  const sourceDistribution = [
    { name: 'Website', count: leads.filter((l) => l.source === 'website').length },
    { name: 'Referral', count: leads.filter((l) => l.source === 'referral').length },
    { name: 'Social', count: leads.filter((l) => l.source === 'social').length },
    { name: 'Email', count: leads.filter((l) => l.source === 'email').length },
    { name: 'Phone', count: leads.filter((l) => l.source === 'phone').length },
    { name: 'Other', count: leads.filter((l) => l.source === 'other').length },
  ].filter((d) => d.count > 0);

  const conversionRate = stats.total > 0 ? Math.round((stats.converted / stats.total) * 100) : 0;
  const contactRate = stats.total > 0 ? Math.round(((stats.contacted + stats.converted) / stats.total) * 100) : 0;

  const recentActivity = leads
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Analytics</h1>
        <p className="text-slate-400 mt-1">Performance metrics and insights</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          title="Total Leads"
          value={stats.total}
          change="All time"
          changeType="neutral"
          icon={Users}
          gradient="from-blue-500 to-cyan-500"
        />
        <StatCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          change={conversionRate >= 20 ? 'Good performance' : 'Needs improvement'}
          changeType={conversionRate >= 20 ? 'positive' : 'negative'}
          icon={Target}
          gradient="from-emerald-500 to-teal-500"
        />
        <StatCard
          title="Contact Rate"
          value={`${contactRate}%`}
          icon={Zap}
          gradient="from-amber-500 to-orange-500"
        />
        <StatCard
          title="Active Leads"
          value={stats.new + stats.contacted}
          icon={BarChart3}
          gradient="from-cyan-500 to-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Lead Trend</h3>
              <p className="text-sm text-slate-400">Last 30 days</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyTrend}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorConverted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                }}
              />
              <Area
                type="monotone"
                dataKey="leads"
                stroke="#3B82F6"
                fill="url(#colorLeads)"
                strokeWidth={2}
                name="New Leads"
              />
              <Area
                type="monotone"
                dataKey="converted"
                stroke="#10B981"
                fill="url(#colorConverted)"
                strokeWidth={2}
                name="Converted"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4 space-y-2">
            {statusDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-400">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Monthly Growth</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                }}
              />
              <Line type="monotone" dataKey="leads" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6' }} name="Total Leads" />
              <Line type="monotone" dataKey="converted" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981' }} name="Converted" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Lead Sources</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={sourceDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                }}
              />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Leads" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
                  {lead.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{lead.name}</p>
                  <p className="text-sm text-slate-500">
                    Updated {format(new Date(lead.updated_at), 'MMM d, h:mm a')}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    lead.status === 'new'
                      ? 'bg-blue-500/10 text-blue-400'
                      : lead.status === 'contacted'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-emerald-500/10 text-emerald-400'
                  }`}
                >
                  {lead.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Quick Stats</h3>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Lead to Contact</span>
                <span className="text-lg font-bold text-white">{contactRate}%</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all"
                  style={{ width: `${contactRate}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Contact to Convert</span>
                <span className="text-lg font-bold text-white">
                  {stats.contacted > 0 ? Math.round((stats.converted / (stats.contacted + stats.converted)) * 100) : 0}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
                  style={{
                    width: `${stats.contacted > 0 ? Math.round((stats.converted / (stats.contacted + stats.converted)) * 100) : 0}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Overall Conversion</span>
                <span className="text-lg font-bold text-white">{conversionRate}%</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all"
                  style={{ width: `${conversionRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
