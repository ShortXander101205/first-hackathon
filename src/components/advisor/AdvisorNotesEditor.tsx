'use client';

import React, { useState } from 'react';
import { ADVISOR_COPY } from '@/content/advisorCopy';
import { FileText, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export interface AdvisorNoteItem {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

interface AdvisorNotesEditorProps {
  submissionId: string;
  initialNotes: AdvisorNoteItem[];
  defaultAuthorName?: string;
  onNoteAdded?: (note: AdvisorNoteItem) => void;
}

export const AdvisorNotesEditor: React.FC<AdvisorNotesEditorProps> = ({
  submissionId,
  initialNotes,
  defaultAuthorName = ADVISOR_COPY.notes.authorDefault,
  onNoteAdded,
}) => {
  const [notes, setNotes] = useState<AdvisorNoteItem[]>(initialNotes);
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState(defaultAuthorName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const MAX_CHARS = 2000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/advisor/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId,
          content: trimmed,
          authorName: authorName.trim() || ADVISOR_COPY.notes.authorDefault,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.note) {
        const newNote: AdvisorNoteItem = data.note;
        const updated = [...notes, newNote];
        setNotes(updated);
        setContent('');
        setFeedback({ type: 'success', message: ADVISOR_COPY.notes.savedNotice });
        if (onNoteAdded) {
          onNoteAdded(newNote);
        }
      } else {
        setFeedback({
          type: 'error',
          message: data.detail || ADVISOR_COPY.notes.errorMessage,
        });
      }
    } catch {
      setFeedback({ type: 'error', message: ADVISOR_COPY.notes.errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Existing Notes List */}
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <span>{ADVISOR_COPY.drawer.notesSectionTitle}</span>
          <span className="text-xs font-normal text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
            {notes.length}
          </span>
        </h3>

        {notes.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            {ADVISOR_COPY.drawer.noNotesNotice}
          </p>
        ) : (
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-sm"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {note.authorName}
                  </span>
                  <span>{formatDate(note.createdAt)}</span>
                </div>
                <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Note Composer */}
      <form onSubmit={handleSubmit} className="border-t border-slate-200 dark:border-slate-800 pt-5">
        {feedback && (
          <div
            role="status"
            aria-live="polite"
            className={`mb-3.5 p-3 rounded-xl flex items-center gap-2 text-sm ${
              feedback.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600 dark:text-red-400" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="advisor-note-input"
              className="text-sm font-semibold text-slate-800 dark:text-slate-200"
            >
              {ADVISOR_COPY.notes.composerLabel}
            </label>
            <div className="flex items-center gap-2">
              <label htmlFor="advisor-note-author" className="text-xs text-slate-500">
                {ADVISOR_COPY.notes.authorLabel}:
              </label>
              <input
                id="advisor-note-author"
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="text-xs px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 w-28"
              />
            </div>
          </div>

          <textarea
            id="advisor-note-input"
            rows={3}
            maxLength={MAX_CHARS}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={ADVISOR_COPY.notes.composerPlaceholder}
            className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
            aria-describedby="advisor-note-char-count"
          />

          <div className="flex items-center justify-between pt-1">
            <span
              id="advisor-note-char-count"
              aria-live="polite"
              className="text-xs text-slate-500 dark:text-slate-400"
            >
              {ADVISOR_COPY.notes.charCount(content.length, MAX_CHARS)}
            </span>

            <button
              type="submit"
              disabled={isSubmitting || content.trim().length === 0}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm shadow disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Send className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                {isSubmitting ? ADVISOR_COPY.notes.savingButton : ADVISOR_COPY.notes.saveButton}
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
