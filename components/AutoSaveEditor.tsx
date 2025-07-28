'use client';

import { useState, useEffect, useCallback } from 'react';
import { Save, Clock } from 'lucide-react';

interface AutoSaveEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSave: (isDraft: boolean) => void;
  placeholder?: string;
  className?: string;
  autoSaveInterval?: number; // in milliseconds
}

export default function AutoSaveEditor({
  value,
  onChange,
  onSave,
  placeholder = "Start typing...",
  className = "",
  autoSaveInterval = 30000 // 30 seconds
}: AutoSaveEditorProps) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const saveAsDraft = useCallback(async () => {
    if (!hasUnsavedChanges) return;
    
    setIsSaving(true);
    try {
      await onSave(true); // Save as draft
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, [hasUnsavedChanges, onSave]);

  // Auto-save effect
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const timer = setTimeout(() => {
      saveAsDraft();
    }, autoSaveInterval);

    return () => clearTimeout(timer);
  }, [hasUnsavedChanges, saveAsDraft, autoSaveInterval]);

  // Handle value changes
  const handleChange = (newValue: string) => {
    onChange(newValue);
    setHasUnsavedChanges(true);
  };

  // Manual save
  const handleManualSave = () => {
    saveAsDraft();
  };

  // Format last saved time
  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-2">
      {/* Auto-save status bar */}
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {isSaving ? (
            <span className="text-blue-600 dark:text-blue-400">Saving...</span>
          ) : lastSaved ? (
            <span>Last saved: {formatLastSaved(lastSaved)}</span>
          ) : (
            <span>Not saved yet</span>
          )}
        </div>
        
        {hasUnsavedChanges && (
          <button
            onClick={handleManualSave}
            disabled={isSaving}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors disabled:opacity-50"
          >
            <Save className="w-3 h-3" />
            Save now
          </button>
        )}
      </div>

      {/* Editor textarea */}
      <textarea
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full min-h-[400px] p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${className}`}
      />
      
      {/* Unsaved changes indicator */}
      {hasUnsavedChanges && (
        <div className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
          You have unsaved changes
        </div>
      )}
    </div>
  );
}