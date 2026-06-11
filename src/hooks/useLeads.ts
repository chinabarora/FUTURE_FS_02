import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Lead, LeadStats, LeadNote } from '../types';
import { useAuth } from '../context/AuthContext';

export function useLeads() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setLeads(data || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const addLead = async (lead: Omit<Lead, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { error: 'No user logged in' };

    const { error: insertError } = await supabase
      .from('leads')
      .insert([{ ...lead, user_id: user.id }]);

    if (insertError) {
      return { error: insertError.message };
    }

    await fetchLeads();
    return { error: null };
  };

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    const { error: updateError } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id);

    if (updateError) {
      return { error: updateError.message };
    }

    await fetchLeads();
    return { error: null };
  };

  const deleteLead = async (id: string) => {
    const { error: deleteError } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return { error: deleteError.message };
    }

    await fetchLeads();
    return { error: null };
  };

  const getLead = async (id: string): Promise<Lead | null> => {
    const { data, error: fetchError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      setError(fetchError.message);
      return null;
    }

    return data;
  };

  const getStats = useCallback((): LeadStats => {
    const stats: LeadStats = {
      total: leads.length,
      new: leads.filter((l) => l.status === 'new').length,
      contacted: leads.filter((l) => l.status === 'contacted').length,
      converted: leads.filter((l) => l.status === 'converted').length,
    };
    return stats;
  }, [leads]);

  return { leads, loading, error, addLead, updateLead, deleteLead, getLead, getStats, refetch: fetchLeads };
}

export function useLeadNotes(leadId: string) {
  const { user } = useAuth();
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!leadId) return;

      setLoading(true);
      const { data } = await supabase
        .from('lead_notes')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: true });

      setNotes(data || []);
      setLoading(false);
    };

    fetchNotes();
  }, [leadId]);

  const addNote = async (content: string) => {
    if (!user) return { error: 'No user logged in' };

    const { error } = await supabase
      .from('lead_notes')
      .insert([{ lead_id: leadId, user_id: user.id, content }]);

    if (!error) {
      const { data } = await supabase
        .from('lead_notes')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: true });
      setNotes(data || []);
    }

    return { error };
  };

  const updateNote = async (noteId: string, content: string) => {
    const { error } = await supabase
      .from('lead_notes')
      .update({ content })
      .eq('id', noteId);

    if (!error) {
      setNotes(notes.map((n) => (n.id === noteId ? { ...n, content } : n)));
    }

    return { error };
  };

  const deleteNote = async (noteId: string) => {
    const { error } = await supabase
      .from('lead_notes')
      .delete()
      .eq('id', noteId);

    if (!error) {
      setNotes(notes.filter((n) => n.id !== noteId));
    }

    return { error };
  };

  return { notes, loading, addNote, updateNote, deleteNote };
}
