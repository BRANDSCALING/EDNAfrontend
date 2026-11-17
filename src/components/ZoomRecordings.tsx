import React, { useCallback, useEffect, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Folder,
  PlayCircle,
  RefreshCw,
  Video,
} from 'lucide-react';
import { authHelpers } from '../utils/auth/cognito';
import { EDNA_API_BASE } from '../utils/edna';
import { toVimeoEmbed } from '../utils/vimeo';

/**
 * Zoom Recordings — website port of the iOS app feature.
 * Categories (Deal Clinic / Mastermind Days) → monthly folders → recordings → player.
 * Read-only; content is fed by the backend's Vimeo auto-sync.
 *
 * NOTE: this project ships a prebuilt CSS snapshot (no Tailwind build), so any
 * utility class not in src/index.css silently does nothing. Layout-critical
 * styling here is inline, matching the rest of the codebase.
 */

interface ZoomCategory {
  category: string;
  label: string;
  folderCount: number;
  recordingCount: number;
}

interface ZoomFolder {
  id: string;
  category: string;
  title: string;
  periodMonth: string | null;
  description: string | null;
  displayOrder: number;
  videoCount: number;
  documentCount: number;
}

interface ZoomItem {
  id: string;
  itemType: 'video' | 'document';
  title: string | null;
  vimeoUrl: string | null;
  fileId: string | null;
  displayOrder: number;
}

interface ZoomRecording {
  id: string;
  title: string;
  description: string | null;
  recordedOn: string | null;
  displayOrder: number;
  items: ZoomItem[];
}

type Level =
  | { name: 'categories' }
  | { name: 'folders'; category: ZoomCategory }
  | { name: 'folder'; category: ZoomCategory; folder: ZoomFolder }
  | { name: 'recording'; category: ZoomCategory; folder: ZoomFolder; recording: ZoomRecording };

const CATEGORY_STYLES: Record<string, { gradient: string; icon: string }> = {
  deal_clinic: { gradient: 'linear-gradient(135deg, #42047d 0%, #8B5CF6 100%)', icon: '#8B5CF6' },
  mastermind: { gradient: 'linear-gradient(135deg, #f6782f 0%, #F97316 100%)', icon: '#F97316' },
};

const ellipsis: React.CSSProperties = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const rowCard: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  padding: '16px 20px',
  textAlign: 'left',
  cursor: 'pointer',
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
};

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

// 17 Nov 2026: recordings now come from the shared Brandscaling API with the Cognito session
// (same /api/v1/zoom routes the iOS app uses); Supabase and the old backend are retired.
async function zoomFetch<T>(path: string): Promise<T> {
  const { session } = await authHelpers.getSession();
  const token = session?.access_token;
  if (!token) throw new Error('Please sign in to view recordings.');
  const res = await fetch(`${EDNA_API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.success === false) {
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return body as T;
}

export function ZoomRecordings() {
  const [level, setLevel] = useState<Level>({ name: 'categories' });
  const [categories, setCategories] = useState<ZoomCategory[]>([]);
  const [folders, setFolders] = useState<ZoomFolder[]>([]);
  const [recordings, setRecordings] = useState<ZoomRecording[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await zoomFetch<{ categories: ZoomCategory[] }>('/api/v1/zoom/categories');
      setCategories(data.categories);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const openCategory = async (category: ZoomCategory) => {
    setLevel({ name: 'folders', category });
    setLoading(true);
    setError(null);
    try {
      const data = await zoomFetch<{ folders: ZoomFolder[] }>(
        `/api/v1/zoom/folders?category=${encodeURIComponent(category.category)}`
      );
      setFolders(data.folders);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const openFolder = async (category: ZoomCategory, folder: ZoomFolder) => {
    setLevel({ name: 'folder', category, folder });
    setLoading(true);
    setError(null);
    try {
      const data = await zoomFetch<{ recordings: ZoomRecording[] }>(
        `/api/v1/zoom/folders/${folder.id}`
      );
      setRecordings(data.recordings);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const openRecording = (category: ZoomCategory, folder: ZoomFolder, recording: ZoomRecording) => {
    setLevel({ name: 'recording', category, folder, recording });
  };

  const goBack = () => {
    setError(null);
    if (level.name === 'recording') {
      setLevel({ name: 'folder', category: level.category, folder: level.folder });
    } else if (level.name === 'folder') {
      openCategory(level.category);
    } else if (level.name === 'folders') {
      setLevel({ name: 'categories' });
      loadCategories();
    }
  };

  const header = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        {level.name !== 'categories' && (
          <button
            onClick={goBack}
            aria-label="Back"
            style={{
              padding: '8px',
              borderRadius: '8px',
              background: '#f3f4f6',
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
              display: 'flex',
            }}
          >
            <ArrowLeft style={{ width: '20px', height: '20px', color: '#374151' }} />
          </button>
        )}
        <div style={{ minWidth: 0 }}>
          <h1
            style={{
              ...ellipsis,
              fontSize: '24px',
              fontWeight: 700,
              backgroundImage: 'linear-gradient(to right, #42047d, #f6782f)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {level.name === 'categories' && 'Zoom Recordings'}
            {level.name === 'folders' && level.category.label}
            {level.name === 'folder' && level.folder.title}
            {level.name === 'recording' && level.recording.title}
          </h1>
          <p style={{ ...ellipsis, fontSize: '14px', color: '#6b7280', marginTop: '2px' }}>
            {level.name === 'categories' && 'Recorded Deal Clinics and Mastermind Days'}
            {level.name === 'folders' && 'Browse by month'}
            {level.name === 'folder' && level.category.label}
            {level.name === 'recording' &&
              (formatDate(level.recording.recordedOn) || level.folder.title)}
          </p>
        </div>
      </div>
    </div>
  );

  const emptyState = (icon: React.ReactNode, text: string) => (
    <div style={{ padding: '96px 16px', textAlign: 'center', color: '#6b7280' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>{icon}</div>
      <p>{text}</p>
    </div>
  );

  const renderBody = () => {
    if (loading) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '96px 0',
            color: '#6b7280',
          }}
        >
          <RefreshCw
            className="animate-spin"
            style={{ width: '32px', height: '32px', marginBottom: '12px', color: '#8B5CF6' }}
          />
          <p style={{ fontSize: '14px' }}>Loading…</p>
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ padding: '96px 16px', textAlign: 'center' }}>
          <p style={{ color: '#374151', fontWeight: 500, marginBottom: '8px' }}>
            Couldn't load recordings
          </p>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>{error}</p>
          <button
            onClick={() => {
              if (level.name === 'categories') loadCategories();
              else if (level.name === 'folders') openCategory(level.category);
              else if (level.name === 'folder') openFolder(level.category, level.folder);
            }}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              color: '#ffffff',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              background: 'linear-gradient(to right, #8B5CF6 0%, #F97316 100%)',
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    if (level.name === 'categories') {
      return (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            maxWidth: '768px',
          }}
        >
          {categories.map((cat) => {
            const style = CATEGORY_STYLES[cat.category] || CATEGORY_STYLES.deal_clinic;
            return (
              <button
                key={cat.category}
                onClick={() => openCategory(cat)}
                style={{
                  textAlign: 'left',
                  borderRadius: '16px',
                  padding: '24px',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  background: style.gradient,
                }}
              >
                <Video style={{ width: '32px', height: '32px', marginBottom: '16px', opacity: 0.9 }} />
                <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '4px' }}>{cat.label}</h3>
                <p style={{ fontSize: '14px', opacity: 0.8 }}>
                  {cat.folderCount} {cat.folderCount === 1 ? 'folder' : 'folders'} ·{' '}
                  {cat.recordingCount} {cat.recordingCount === 1 ? 'recording' : 'recordings'}
                </p>
              </button>
            );
          })}
        </div>
      );
    }

    if (level.name === 'folders') {
      if (folders.length === 0) {
        return emptyState(
          <Folder style={{ width: '48px', height: '48px', color: '#d1d5db' }} />,
          'No recordings published yet — check back soon.'
        );
      }
      const iconColor = (CATEGORY_STYLES[level.category.category] || CATEGORY_STYLES.deal_clinic).icon;
      return (
        <div style={{ maxWidth: '768px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {folders.map((folder) => (
            <button key={folder.id} onClick={() => openFolder(level.category, folder)} style={rowCard}>
              <Folder style={{ width: '24px', height: '24px', flexShrink: 0, color: iconColor }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ ...ellipsis, fontWeight: 600, color: '#111827' }}>{folder.title}</p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>
                  {folder.videoCount} {folder.videoCount === 1 ? 'video' : 'videos'}
                  {folder.description ? ` · ${folder.description}` : ''}
                </p>
              </div>
              <ChevronRight style={{ width: '20px', height: '20px', color: '#9ca3af', flexShrink: 0 }} />
            </button>
          ))}
        </div>
      );
    }

    if (level.name === 'folder') {
      if (recordings.length === 0) {
        return emptyState(
          <PlayCircle style={{ width: '48px', height: '48px', color: '#d1d5db' }} />,
          'No recordings in this folder yet.'
        );
      }
      return (
        <div style={{ maxWidth: '768px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recordings.map((rec) => {
            const date = formatDate(rec.recordedOn);
            const videoCount = rec.items.filter((i) => i.itemType === 'video').length;
            return (
              <button
                key={rec.id}
                onClick={() => openRecording(level.category, level.folder, rec)}
                style={rowCard}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    background: 'linear-gradient(135deg, #42047d 0%, #f6782f 100%)',
                  }}
                >
                  <PlayCircle style={{ width: '24px', height: '24px', color: '#ffffff' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ ...ellipsis, fontWeight: 600, color: '#111827' }}>{rec.title}</p>
                  <p
                    style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {date ? (
                      <>
                        <Calendar style={{ width: '14px', height: '14px' }} />
                        {date}
                      </>
                    ) : (
                      `${videoCount} ${videoCount === 1 ? 'video' : 'videos'}`
                    )}
                  </p>
                </div>
                <ChevronRight style={{ width: '20px', height: '20px', color: '#9ca3af', flexShrink: 0 }} />
              </button>
            );
          })}
        </div>
      );
    }

    // recording player
    const videos = level.recording.items.filter((i) => i.itemType === 'video' && i.vimeoUrl);
    return (
      <div style={{ maxWidth: '896px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {videos.length === 0 &&
          emptyState(
            <Video style={{ width: '48px', height: '48px', color: '#d1d5db' }} />,
            "This recording has no playable video."
          )}
        {videos.map((item) => {
          const embed = toVimeoEmbed(item.vimeoUrl);
          return (
            <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {item.title && <p style={{ fontWeight: 500, color: '#1f2937' }}>{item.title}</p>}
              {embed ? (
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    paddingBottom: '56.25%',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: '#000000',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  }}
                >
                  <iframe
                    src={embed.src}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 0,
                    }}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={item.title || level.recording.title}
                  />
                </div>
              ) : (
                <p style={{ fontSize: '14px', color: '#6b7280' }}>
                  This video can't be embedded.{' '}
                  {item.vimeoUrl && (
                    <a
                      href={item.vimeoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#2563eb', textDecoration: 'underline' }}
                    >
                      Open on Vimeo
                    </a>
                  )}
                </p>
              )}
            </div>
          );
        })}
        {level.recording.description && (
          <p style={{ color: '#4b5563', fontSize: '14px', lineHeight: 1.6 }}>
            {level.recording.description}
          </p>
        )}
      </div>
    );
  };

  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto', background: '#f9fafb' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
        {header}
        {renderBody()}
      </div>
    </div>
  );
}
