import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLeads } from '../hooks/useLeads';
import { useLeadNotes } from '../hooks/useLeads';
import { Button, StatusBadge, Modal } from '../components/ui';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  Calendar,
  Edit,
  Trash2,
  MessageSquare,
  Clock,
  Plus,
  X,
  Check,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Lead } from '../types';

export function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getLead, updateLead, deleteLead } = useLeads();
  const { notes, loading: notesLoading, addNote, updateNote, deleteNote } = useLeadNotes(id!);

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editNoteContent, setEditNoteContent] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    const fetchLead = async () => {
      if (id) {
        const data = await getLead(id);
        setLead(data);
        setLoading(false);
      }
    };
    fetchLead();
  }, [id]);

  const handleStatusChange = async (newStatus: 'new' | 'contacted' | 'converted') => {
    if (!lead) return;
    setStatusUpdating(true);
    await updateLead(lead.id, { status: newStatus });
    setLead({ ...lead, status: newStatus });
    setStatusUpdating(false);
  };

  const handleDelete = async () => {
    if (!lead) return;
    const result = await deleteLead(lead.id);
    if (!result.error) {
      navigate('/leads');
    }
    setShowDeleteModal(false);
  };

  const handleAddNote = async () => {
    if (!newNoteContent.trim()) return;
    const result = await addNote(newNoteContent);
    if (!result.error) {
      setNewNoteContent('');
      setShowNoteModal(false);
    }
  };

  const handleUpdateNote = async (noteId: string) => {
    if (!editNoteContent.trim()) return;
    await updateNote(noteId, editNoteContent);
    setEditingNoteId(null);
    setEditNoteContent('');
  };

  const handleDeleteNote = async (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      await deleteNote(noteId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold text-white mb-2">Lead not found</h2>
        <Button onClick={() => navigate('/leads')}>Back to Leads</Button>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/leads')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Leads
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
                  {getInitials(lead.name)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{lead.name}</h1>
                  <p className="text-slate-400">{lead.company || 'No company'}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/leads/${lead.id}/edit`)}
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/50">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <a href={`mailto:${lead.email}`} className="text-white hover:text-blue-400 transition-colors">
                    {lead.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/50">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Phone className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Phone</p>
                  <a href={`tel:${lead.phone}`} className="text-white hover:text-emerald-400 transition-colors">
                    {lead.phone || 'Not provided'}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/50">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Building className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Company</p>
                  <p className="text-white">{lead.company || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/50">
                <div className="p-2 rounded-lg bg-cyan-500/10">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Created</p>
                  <p className="text-white">
                    {format(new Date(lead.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            </div>

            {lead.notes && (
              <div className="mt-6 p-4 rounded-xl bg-slate-900/50 border border-slate-700">
                <h3 className="text-sm font-medium text-slate-400 mb-2">Notes</h3>
                <p className="text-white whitespace-pre-wrap">{lead.notes}</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Activity & Notes</h3>
              </div>
              <Button size="sm" onClick={() => setShowNoteModal(true)}>
                <Plus className="w-4 h-4" />
                Add Note
              </Button>
            </div>

            {notes.length === 0 && !notesLoading ? (
              <div className="text-center py-8 text-slate-500">
                No notes yet. Add your first note to track activity.
              </div>
            ) : (
              <div className="space-y-4">
                {notes.map((note) => (
                  <div key={note.id} className="relative pl-6 pb-4 border-l-2 border-slate-700 last:border-0">
                    <div className="absolute left-0 top-0 w-3 h-3 -translate-x-[7px] rounded-full bg-blue-500 ring-4 ring-slate-800" />

                    <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                      {editingNoteId === note.id ? (
                        <div className="space-y-3">
                          <textarea
                            value={editNoteContent}
                            onChange={(e) => setEditNoteContent(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white resize-none focus:outline-none focus:border-blue-500"
                            rows={3}
                          />
                          <div className="flex gap-2 justify-end">
                            <Button size="sm" variant="ghost" onClick={() => setEditingNoteId(null)}>
                              <X className="w-4 h-4" />
                            </Button>
                            <Button size="sm" onClick={() => handleUpdateNote(note.id)}>
                              <Check className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-white whitespace-pre-wrap">{note.content}</p>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <Clock className="w-4 h-4" />
                              <span title={format(new Date(note.created_at), 'PPpp')}>
                                {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
                              </span>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => {
                                  setEditingNoteId(note.id);
                                  setEditNoteContent(note.content);
                                }}
                                className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-slate-700/50 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteNote(note.id)}
                                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Lead Status</h3>
            <div className="space-y-2">
              {(['new', 'contacted', 'converted'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={statusUpdating}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${
                    lead.status === status
                      ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/50'
                      : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  <StatusBadge status={status} size="sm" />
                  <span className="text-sm text-white capitalize">{status}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Lead Source</h3>
            <span className="px-4 py-2 text-sm bg-slate-900/50 text-slate-300 rounded-xl capitalize">
              {lead.source}
            </span>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Lead"
      >
        <p className="text-slate-400 mb-6">
          Are you sure you want to delete {lead.name}? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Lead
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={showNoteModal}
        onClose={() => {
          setShowNoteModal(false);
          setNewNoteContent('');
        }}
        title="Add Note"
      >
        <textarea
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          placeholder="Enter your note..."
          className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 resize-none focus:outline-none focus:border-blue-500"
          rows={5}
        />
        <div className="flex gap-3 justify-end mt-4">
          <Button variant="secondary" onClick={() => setShowNoteModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddNote}>Add Note</Button>
        </div>
      </Modal>
    </div>
  );
}
