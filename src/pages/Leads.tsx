import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../hooks/useLeads';
import { useTheme } from '../context/ThemeContext';
import { Button, StatusBadge, EmptyState } from '../components/ui';
import { Search, Filter, SortDesc, Plus, Users, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { LeadStatus } from '../types';

export function LeadsPage() {
  const { leads, loading } = useLeads();
  const { accentConfig } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const filteredLeads = useMemo(() => {
    let result = [...leads];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (lead) =>
          lead.name.toLowerCase().includes(query) ||
          lead.email.toLowerCase().includes(query) ||
          lead.company?.toLowerCase().includes(query) ||
          lead.phone?.includes(query)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((lead) => lead.status === statusFilter);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [leads, searchQuery, statusFilter, sortOrder]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div
          className="w-12 h-12 border-4 rounded-full animate-spin"
          style={{
            borderColor: 'var(--theme-border)',
            borderTopColor: 'var(--accent-primary)'
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--theme-text)' }}>Leads</h1>
          <p className="mt-1" style={{ color: 'var(--theme-text-muted)' }}>Manage your leads</p>
        </div>
        <Button onClick={() => navigate('/leads/new')}>
          <Plus className="w-4 h-4" />
          Add Lead
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--theme-text-muted)' }} />
          <input
            type="text"
            placeholder="Search by name, email, company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none transition-all duration-200"
            style={{
              backgroundColor: 'var(--theme-bg-secondary)',
              border: '1px solid var(--theme-border)',
              color: 'var(--theme-text)'
            }}
          />
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--theme-text-muted)' }} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'all')}
              className="pl-10 pr-4 py-3 rounded-xl focus:outline-none appearance-none cursor-pointer min-w-[140px]"
              style={{
                backgroundColor: 'var(--theme-bg-secondary)',
                border: '1px solid var(--theme-border)',
                color: 'var(--theme-text)'
              }}
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
            </select>
          </div>

          <div className="relative">
            <SortDesc className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--theme-text-muted)' }} />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
              className="pl-10 pr-4 py-3 rounded-xl focus:outline-none appearance-none cursor-pointer min-w-[140px]"
              style={{
                backgroundColor: 'var(--theme-bg-secondary)',
                border: '1px solid var(--theme-border)',
                color: 'var(--theme-text)'
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {filteredLeads.length === 0 && !loading ? (
        <EmptyState
          icon={Users}
          title="No leads found"
          description={searchQuery || statusFilter !== 'all' ? "Try adjusting your filters or search query" : "Add your first lead to get started"}
          action={
            !searchQuery && statusFilter === 'all' && (
              <Button onClick={() => navigate('/leads/new')}>
                <Plus className="w-4 h-4" />
                Add First Lead
              </Button>
            )
          }
        />
      ) : (
        <div
          className="rounded-2xl border overflow-hidden"
          style={{
            backgroundColor: 'var(--theme-bg-secondary)',
            borderColor: 'var(--theme-border)'
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--theme-border)' }}>
                  <th className="text-left px-4 py-4 text-sm font-medium" style={{ color: 'var(--theme-text-muted)' }}>Lead</th>
                  <th className="text-left px-4 py-4 text-sm font-medium hidden sm:table-cell" style={{ color: 'var(--theme-text-muted)' }}>Contact</th>
                  <th className="text-left px-4 py-4 text-sm font-medium hidden md:table-cell" style={{ color: 'var(--theme-text-muted)' }}>Source</th>
                  <th className="text-left px-4 py-4 text-sm font-medium" style={{ color: 'var(--theme-text-muted)' }}>Status</th>
                  <th className="text-left px-4 py-4 text-sm font-medium hidden lg:table-cell" style={{ color: 'var(--theme-text-muted)' }}>Created</th>
                  <th className="px-4 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => navigate(`/leads/${lead.id}`)}
                    className="cursor-pointer transition-colors group"
                    style={{
                      borderBottom: '1px solid var(--theme-border)',
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--theme-bg-tertiary)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${accentConfig.primary}, ${accentConfig.primaryDark})`
                          }}
                        >
                          {getInitials(lead.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate" style={{ color: 'var(--theme-text)' }}>{lead.name}</p>
                          <p className="text-sm truncate" style={{ color: 'var(--theme-text-muted)' }}>{lead.company}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <div>
                        <p className="text-sm" style={{ color: 'var(--theme-text)' }}>{lead.email}</p>
                        <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>{lead.phone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span
                        className="px-3 py-1 text-sm rounded-lg capitalize"
                        style={{
                          backgroundColor: 'var(--theme-bg-tertiary)',
                          color: 'var(--theme-text-secondary)'
                        }}
                      >
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={lead.status} size="sm" />
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>
                        {format(new Date(lead.created_at), 'MMM d, yyyy')}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <ChevronRight className="w-5 h-5 transition-colors" style={{ color: 'var(--theme-text-muted)' }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
