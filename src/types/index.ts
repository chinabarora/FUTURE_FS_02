export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source: string;
  status: 'new' | 'contacted' | 'converted';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  converted: number;
}

export type LeadStatus = 'new' | 'contacted' | 'converted';
export type LeadSource = 'website' | 'referral' | 'social' | 'email' | 'phone' | 'other';
