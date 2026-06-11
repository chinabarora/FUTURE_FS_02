import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLeads } from '../hooks/useLeads';
import { Button, Input, Select, TextArea } from '../components/ui';
import { ArrowLeft, Save } from 'lucide-react';
import { LeadSource, LeadStatus } from '../types';

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'converted', label: 'Converted' },
];

const sourceOptions = [
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'social', label: 'Social Media' },
  { value: 'email', label: 'Email Campaign' },
  { value: 'phone', label: 'Phone Inquiry' },
  { value: 'other', label: 'Other' },
];

export function LeadFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addLead, updateLead, getLead } = useLeads();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: 'website' as LeadSource,
    status: 'new' as LeadStatus,
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  useEffect(() => {
    if (id) {
      const fetchLead = async () => {
        const lead = await getLead(id);
        if (lead) {
          setFormData({
            name: lead.name,
            email: lead.email,
            phone: lead.phone || '',
            company: lead.company || '',
            source: lead.source as LeadSource,
            status: lead.status,
            notes: lead.notes || '',
          });
        } else {
          navigate('/leads');
        }
        setInitialLoading(false);
      };
      fetchLead();
    }
  }, [id]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    const result = isEditing
      ? await updateLead(id!, formData)
      : await addLead(formData);

    setLoading(false);

    if (result.error) {
      setErrors({ submit: result.error });
    } else {
      navigate('/leads');
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <div className="rounded-2xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            {isEditing ? 'Edit Lead' : 'Add New Lead'}
          </h1>
          <p className="text-slate-400 mt-1">
            {isEditing ? 'Update lead information' : 'Fill in the details to create a new lead'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              placeholder="John Doe"
            />

            <Input
              type="email"
              label="Email Address"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              placeholder="john@example.com"
            />

            <Input
              type="tel"
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 234 567 8900"
            />

            <Input
              label="Company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Acme Inc."
            />

            <Select
              label="Lead Source"
              options={sourceOptions}
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value as LeadSource })}
            />

            <Select
              label="Status"
              options={statusOptions}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as LeadStatus })}
            />
          </div>

          <TextArea
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Add any notes about this lead..."
            rows={4}
          />

          {errors.submit && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {errors.submit}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-4 border-t border-slate-700">
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              <Save className="w-4 h-4" />
              {isEditing ? 'Save Changes' : 'Create Lead'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
