import { useNavigate } from 'react-router-dom';
import { useLeads } from '../hooks/useLeads';
import { useTheme } from '../context/ThemeContext';
import { StatCard, Button } from '../components/ui';
import { Users, UserPlus, Phone, CheckCircle2, TrendingUp, ArrowRight } from 'lucide-react';
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
} from 'recharts';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { Link } from 'react-router-dom';

const COLORS = {
  new: '#3B82F6',
  contacted: '#F59E0B',
  converted: '#10B981',
};

export function Dashboard() {
  const { leads, getStats } = useLeads();
  const { accentConfig } = useTheme();
  const stats = getStats();
  const navigate = useNavigate();

  const recentLeads = leads.slice(0, 5);

  const statusData = [
    { name: 'New', value: stats.new, color: COLORS.new },
    { name: 'Contacted', value: stats.contacted, color: COLORS.contacted },
    { name: 'Converted', value: stats.converted, color: COLORS.converted },
  ];

  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date(),
  });

  const leadsByDay = last7Days.map((day) => {
    const formattedDay = format(day, 'yyyy-MM-dd');
    const leadsOnDay = leads.filter((lead) => {
      const leadDate = format(new Date(lead.created_at), 'yyyy-MM-dd');
      return leadDate === formattedDay;
    });

    return {
      day: format(day, 'EEE'),
      new: leadsOnDay.filter((l) => l.status === 'new').length,
      contacted: leadsOnDay.filter((l) => l.status === 'contacted').length,
      converted: leadsOnDay.filter((l) => l.status === 'converted').length,
    };
  });

  const conversionRate = stats.total > 0 ? Math.round((stats.converted / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--theme-text)' }}>Dashboard</h1>
          <p className="mt-1" style={{ color: 'var(--theme-text-muted)' }}>Welcome to your CRM dashboard</p>
        </div>
        <Button onClick={() => navigate('/leads/new')}>
          <UserPlus className="w-4 h-4" />
          Add Lead
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          title="Total Leads"
          value={stats.total}
          icon={Users}
        />
        <StatCard
          title="New Leads"
          value={stats.new}
          icon={UserPlus}
        />
        <StatCard
          title="Contacted"
          value={stats.contacted}
          icon={Phone}
        />
        <StatCard
          title="Converted"
          value={stats.converted}
          icon={CheckCircle2}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className="lg:col-span-2 rounded-2xl border p-6"
          style={{
            backgroundColor: 'var(--theme-bg-secondary)',
            borderColor: 'var(--theme-border)'
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--theme-text)' }}>Lead Trend</h3>
              <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>Last 7 days</p>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+{conversionRate}% conversion</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={leadsByDay}>
              <defs>
                <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={accentConfig.primary} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={accentConfig.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border)" />
              <XAxis dataKey="day" stroke="var(--theme-text-muted)" fontSize={12} />
              <YAxis stroke="var(--theme-text-muted)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--theme-bg-secondary)',
                  border: '1px solid var(--theme-border)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                }}
              />
              <Area type="monotone" dataKey="new" stroke={accentConfig.primary} fill="url(#colorNew)" strokeWidth={2} />
              <Area type="monotone" dataKey="contacted" stroke={COLORS.contacted} fill="transparent" strokeWidth={2} />
              <Area type="monotone" dataKey="converted" stroke={COLORS.converted} fill="transparent" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div
          className="rounded-2xl border p-6"
          style={{
            backgroundColor: 'var(--theme-bg-secondary)',
            borderColor: 'var(--theme-border)'
          }}
        >
          <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--theme-text)' }}>Status Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--theme-bg-secondary)',
                  border: '1px solid var(--theme-border)',
                  borderRadius: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4 space-y-2">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>{item.name}</span>
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="rounded-2xl border p-6"
          style={{
            backgroundColor: 'var(--theme-bg-secondary)',
            borderColor: 'var(--theme-border)'
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--theme-text)' }}>Recent Leads</h3>
            <Link to="/leads" className="text-sm flex items-center gap-1" style={{ color: 'var(--accent-primary)' }}>
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentLeads.length === 0 ? (
              <div className="text-center py-8" style={{ color: 'var(--theme-text-muted)' }}>
                No leads yet. Add your first lead to get started.
              </div>
            ) : (
              recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  to={`/leads/${lead.id}`}
                  className="flex items-center gap-4 p-4 rounded-xl transition-colors"
                  style={{
                    backgroundColor: 'var(--theme-bg-tertiary)',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                    style={{
                      background: `linear-gradient(135deg, var(--accent-primary), var(--accent-primary-dark))`
                    }}
                  >
                    {lead.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate" style={{ color: 'var(--theme-text)' }}>{lead.name}</p>
                    <p className="text-sm truncate" style={{ color: 'var(--theme-text-muted)' }}>{lead.company || lead.email}</p>
                  </div>
                  <span
                    className="px-2 py-1 text-xs rounded-full"
                    style={{
                      backgroundColor: lead.status === 'new' ? 'rgba(59,130,246,0.1)' : lead.status === 'contacted' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                      color: lead.status === 'new' ? '#3B82F6' : lead.status === 'contacted' ? '#F59E0B' : '#10B981'
                    }}
                  >
                    {lead.status}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        <div
          className="rounded-2xl border p-6"
          style={{
            backgroundColor: 'var(--theme-bg-secondary)',
            borderColor: 'var(--theme-border)'
          }}
        >
          <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--theme-text)' }}>Source Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={[
                { name: 'Website', count: leads.filter((l) => l.source === 'website').length },
                { name: 'Referral', count: leads.filter((l) => l.source === 'referral').length },
                { name: 'Social', count: leads.filter((l) => l.source === 'social').length },
                { name: 'Email', count: leads.filter((l) => l.source === 'email').length },
                { name: 'Phone', count: leads.filter((l) => l.source === 'phone').length },
              ].filter((d) => d.count > 0)}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border)" horizontal={false} />
              <XAxis type="number" stroke="var(--theme-text-muted)" fontSize={12} />
              <YAxis type="category" dataKey="name" stroke="var(--theme-text-muted)" fontSize={12} width={70} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--theme-bg-secondary)',
                  border: '1px solid var(--theme-border)',
                  borderRadius: '12px',
                }}
              />
              <Bar dataKey="count" fill="var(--accent-primary)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
