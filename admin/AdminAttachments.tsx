import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabaseAdmin } from '../supabase';

const BUCKET = 'attachments';
const MAX_FILE_SIZE_MB = 25;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

interface AttachmentFile {
  name: string;
  url: string;
  size: number;
  created_at: string;
  type: string; // derived from extension
}

function extToType(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext)) return 'image';
  if (['pdf'].includes(ext)) return 'pdf';
  if (['mp4', 'webm', 'mov', 'avi'].includes(ext)) return 'video';
  if (['mp3', 'wav', 'ogg', 'aac'].includes(ext)) return 'audio';
  if (['doc', 'docx', 'odt'].includes(ext)) return 'word';
  if (['xls', 'xlsx', 'csv'].includes(ext)) return 'spreadsheet';
  if (['ppt', 'pptx'].includes(ext)) return 'presentation';
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'archive';
  return 'file';
}

function fileIcon(type: string): string {
  switch (type) {
    case 'image': return '🖼️';
    case 'pdf': return '📄';
    case 'video': return '🎬';
    case 'audio': return '🎵';
    case 'word': return '📝';
    case 'spreadsheet': return '📊';
    case 'presentation': return '📑';
    case 'archive': return '🗜️';
    default: return '📎';
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

const AdminAttachments: React.FC = () => {
  const [files, setFiles] = useState<AttachmentFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<AttachmentFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const loadFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await supabaseAdmin.storage.createBucket(BUCKET, { public: true }).catch(() => {});
      const { data, error: listError } = await supabaseAdmin.storage
        .from(BUCKET)
        .list('', { sortBy: { column: 'created_at', order: 'desc' } });

      if (listError) throw new Error(listError.message);

      const list: AttachmentFile[] = (data ?? [])
        .filter(f => f.name !== '.emptyFolderPlaceholder')
        .map(f => {
          const { data: { publicUrl } } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(f.name);
          return {
            name: f.name,
            url: publicUrl,
            size: f.metadata?.size ?? 0,
            created_at: f.created_at ?? '',
            type: extToType(f.name),
          };
        });

      setFiles(list);
    } catch (err: any) {
      setError(err.message || 'Failed to load attachments.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFiles(); }, [loadFiles]);

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setError(null);

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      setUploadProgress(`Uploading ${i + 1} of ${fileList.length}: ${file.name}`);

      if (file.size > MAX_FILE_SIZE) {
        failCount++;
        showToast(`⚠️ "${file.name}" exceeds ${MAX_FILE_SIZE_MB} MB limit. Skipped.`);
        continue;
      }

      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const fileName = `${timestamp}_${safeName}`;

      try {
        await supabaseAdmin.storage.createBucket(BUCKET, { public: true }).catch(() => {});
        const { error: uploadErr } = await supabaseAdmin.storage
          .from(BUCKET)
          .upload(fileName, file, { cacheControl: '3600', upsert: false });

        if (uploadErr) throw new Error(uploadErr.message);
        successCount++;
      } catch (err: any) {
        failCount++;
        console.error('Upload error:', err);
      }
    }

    setUploading(false);
    setUploadProgress(null);
    await loadFiles();

    if (successCount > 0 && failCount === 0) {
      showToast(`✅ ${successCount} file${successCount > 1 ? 's' : ''} uploaded successfully!`);
    } else if (successCount > 0 && failCount > 0) {
      showToast(`⚠️ ${successCount} uploaded, ${failCount} failed.`);
    } else {
      setError('All uploads failed. Check Supabase Storage settings.');
    }
  };

  const handleDelete = async (fileName: string) => {
    const { error } = await supabaseAdmin.storage.from(BUCKET).remove([fileName]);
    if (error) {
      showToast('❌ Failed to delete file.');
    } else {
      showToast('🗑️ File deleted.');
      setDeleteConfirm(null);
      await loadFiles();
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(url);
      showToast('📋 URL copied to clipboard!');
      setTimeout(() => setCopiedUrl(null), 2000);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleUpload(e.dataTransfer.files);
  };

  const filtered = files.filter(f => {
    const matchSearch = !search.trim() || f.name.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || f.type === filterType;
    return matchSearch && matchType;
  });

  const typeOptions = ['all', 'image', 'pdf', 'video', 'audio', 'word', 'spreadsheet', 'presentation', 'archive', 'file'];

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  const S: Record<string, any> = {
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12, marginBottom: 24 },
    statCard: { background: '#141414', border: '1px solid #1e1e1e', borderRadius: 14, padding: '16px 14px' },
    statVal: { fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1 },
    statLabel: { fontSize: 11, color: '#6b7280', marginTop: 4, fontWeight: 500 },
    dropZone: (dragging: boolean): React.CSSProperties => ({
      border: `2px dashed ${dragging ? '#9c1c22' : '#2a2a2a'}`,
      borderRadius: 16, padding: '40px 24px', textAlign: 'center',
      background: dragging ? 'rgba(156,28,34,0.05)' : '#0f0f0f',
      cursor: 'pointer', transition: 'all 0.2s', marginBottom: 24,
    }),
    toolbar: { display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' as const, alignItems: 'center' },
    searchInput: { flex: '1 1 200px', background: '#141414', border: '1px solid #2a2a2a', borderRadius: 10, color: '#fff', fontSize: 14, padding: '10px 16px', outline: 'none' },
    filterSelect: { background: '#141414', border: '1px solid #2a2a2a', borderRadius: 10, color: '#d1d5db', fontSize: 13, padding: '10px 12px', outline: 'none', cursor: 'pointer' },
    uploadBtn: { padding: '10px 20px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #9c1c22, #7a1219)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' as const, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 },
    fileCard: { background: '#141414', border: '1px solid #1e1e1e', borderRadius: 14, overflow: 'hidden' as const, transition: 'border-color 0.15s', cursor: 'pointer' },
    fileThumb: { height: 120, background: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' as const, position: 'relative' as const },
    fileInfo: { padding: '12px 14px' },
    fileName: { fontSize: 12, fontWeight: 600, color: '#d1d5db', wordBreak: 'break-all' as const, lineHeight: 1.4, marginBottom: 4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden' },
    fileMeta: { fontSize: 11, color: '#4b5563', marginBottom: 10 },
    fileActions: { display: 'flex', gap: 6 },
    copyBtn: { flex: 1, padding: '6px 0', borderRadius: 7, border: '1px solid #2a2a2a', background: 'transparent', color: '#9ca3af', fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' },
    openBtn: { padding: '6px 10px', borderRadius: 7, border: '1px solid rgba(156,28,34,0.3)', background: 'rgba(156,28,34,0.1)', color: '#fca5a5', fontSize: 11, cursor: 'pointer' },
    delBtn: { padding: '6px 10px', borderRadius: 7, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.08)', color: '#fca5a5', fontSize: 11, cursor: 'pointer' },
    empty: { textAlign: 'center' as const, padding: '60px 20px', color: '#4b5563' },
    toastStyle: { position: 'fixed' as const, bottom: 24, right: 24, background: '#1e1e1e', border: '1px solid #2a2a2a', borderRadius: 12, padding: '14px 20px', color: '#fff', fontSize: 14, fontWeight: 600, zIndex: 9999, boxShadow: '0 10px 40px rgba(0,0,0,0.4)' },
    modal: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20, backdropFilter: 'blur(4px)' },
    modalCard: { background: '#141414', border: '1px solid #2a2a2a', borderRadius: 20, padding: 32, maxWidth: 440, width: '100%', textAlign: 'center' as const },
  };

  return (
    <div>
      <style>{`
        .attachment-card:hover { border-color: rgba(156,28,34,0.35) !important; }
        .copy-btn:hover { background: rgba(156,28,34,0.1) !important; color: #fca5a5 !important; border-color: rgba(156,28,34,0.3) !important; }
        .attach-search:focus { border-color: #9c1c22 !important; }
        .drop-zone-label:hover { opacity: 0.85; }
      `}</style>

      {/* Stats */}
      <div style={S.statsRow}>
        {[
          { icon: '📎', val: files.length, label: 'Total Files' },
          { icon: '🖼️', val: files.filter(f => f.type === 'image').length, label: 'Images' },
          { icon: '📄', val: files.filter(f => f.type === 'pdf').length, label: 'PDFs' },
          { icon: '💾', val: formatBytes(totalSize), label: 'Total Size' },
        ].map((s, i) => (
          <div key={i} style={S.statCard}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
            <div style={S.statVal}>{s.val}</div>
            <div style={S.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Drop Zone */}
      <div
        style={S.dropZone(isDragging)}
        className="drop-zone-label"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div style={{ fontSize: 42, marginBottom: 14 }}>📎</div>
        <div style={{ color: '#d1d5db', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>
          {uploading ? (uploadProgress ?? 'Uploading...') : 'Drag & drop files here, or click to browse'}
        </div>
        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
          Images, PDFs, Videos, Documents — max {MAX_FILE_SIZE_MB} MB per file. Multiple files supported.
        </div>
        {!uploading && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 10, background: 'linear-gradient(135deg, #9c1c22, #7a1219)', color: '#fff', fontSize: 14, fontWeight: 700, pointerEvents: 'none' }}>
            ⬆ Upload Files
          </div>
        )}
        {uploading && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 22px', borderRadius: 10, background: 'rgba(156,28,34,0.2)', color: '#fca5a5', fontSize: 14, fontWeight: 700 }}>
            <div style={{ width: 16, height: 16, border: '2px solid rgba(252,165,165,0.3)', borderTopColor: '#fca5a5', borderRadius: '50%', animation: 'aSpin 0.7s linear infinite' }} />
            Uploading...
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={e => handleUpload(e.target.files)}
        accept="*/*"
      />
      <style>{`@keyframes aSpin { to { transform: rotate(360deg); } }`}</style>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '14px 18px', marginBottom: 20, color: '#fca5a5', fontSize: 13 }}>
          ⚠️ {error}
          <button onClick={loadFiles} style={{ marginLeft: 12, padding: '4px 12px', borderRadius: 7, border: 'none', background: 'rgba(239,68,68,0.15)', color: '#fca5a5', fontSize: 12, cursor: 'pointer' }}>Retry</button>
        </div>
      )}

      {/* Toolbar */}
      <div style={S.toolbar}>
        <input
          className="attach-search"
          style={S.searchInput}
          placeholder="🔍 Search files..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select style={S.filterSelect} value={filterType} onChange={e => setFilterType(e.target.value)}>
          {typeOptions.map(t => (
            <option key={t} value={t}>
              {t === 'all' ? 'All Types' : `${fileIcon(t)} ${t.charAt(0).toUpperCase() + t.slice(1)}s`}
            </option>
          ))}
        </select>
        <button style={S.uploadBtn} onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          ⬆ Upload
        </button>
      </div>

      {/* Files Grid */}
      {loading ? (
        <div style={S.empty}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          Loading attachments...
        </div>
      ) : filtered.length === 0 ? (
        <div style={S.empty}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>📎</div>
          <div style={{ color: '#9ca3af', fontWeight: 600, marginBottom: 8 }}>
            {files.length === 0 ? 'No attachments yet.' : 'No files match your search.'}
          </div>
          {files.length === 0 && (
            <div style={{ fontSize: 13, color: '#4b5563' }}>Upload your first file using the drop zone above.</div>
          )}
        </div>
      ) : (
        <div style={S.grid}>
          {filtered.map(f => (
            <div key={f.name} className="attachment-card" style={S.fileCard}>
              {/* Thumbnail */}
              <div style={S.fileThumb} onClick={() => setPreviewFile(f)}>
                {f.type === 'image' ? (
                  <img
                    src={f.url}
                    alt={f.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 42 }}>{fileIcon(f.type)}</div>
                    <div style={{ fontSize: 10, color: '#4b5563', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>
                      {f.name.split('.').pop()}
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={S.fileInfo}>
                <div style={S.fileName} title={f.name}>{f.name.replace(/^\d+_/, '')}</div>
                <div style={S.fileMeta}>
                  {formatBytes(f.size)}
                  {f.created_at && ` · ${new Date(f.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                </div>
                <div style={S.fileActions}>
                  <button
                    className="copy-btn"
                    style={{ ...S.copyBtn, background: copiedUrl === f.url ? 'rgba(34,197,94,0.1)' : 'transparent', color: copiedUrl === f.url ? '#4ade80' : '#9ca3af', borderColor: copiedUrl === f.url ? 'rgba(34,197,94,0.3)' : '#2a2a2a' }}
                    onClick={() => handleCopy(f.url)}
                    title="Copy public URL"
                  >
                    {copiedUrl === f.url ? '✓ Copied' : '📋 Copy URL'}
                  </button>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <button style={S.openBtn} title="Open in new tab">↗</button>
                  </a>
                  <button style={S.delBtn} onClick={() => setDeleteConfirm(f.name)} title="Delete file">🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div style={S.modal} onClick={() => setDeleteConfirm(null)}>
          <div style={S.modalCard} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 42, marginBottom: 12 }}>⚠️</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Delete File?</div>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 6 }}>
              <span style={{ color: '#9ca3af', fontWeight: 600 }}>{deleteConfirm.replace(/^\d+_/, '')}</span>
            </div>
            <div style={{ fontSize: 13, color: '#4b5563', marginBottom: 24 }}>
              This action cannot be undone. Any pages using this file's URL will be broken.
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                style={{ padding: '10px 28px', borderRadius: 10, border: 'none', background: 'rgba(239,68,68,0.15)', color: '#fca5a5', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
                onClick={() => handleDelete(deleteConfirm)}
              >Delete</button>
              <button
                style={{ padding: '10px 22px', borderRadius: 10, border: '1px solid #2a2a2a', background: 'transparent', color: '#9ca3af', fontSize: 14, cursor: 'pointer' }}
                onClick={() => setDeleteConfirm(null)}
              >Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <div style={S.modal} onClick={() => setPreviewFile(null)}>
          <div
            style={{ background: '#141414', border: '1px solid #2a2a2a', borderRadius: 20, padding: 24, maxWidth: 680, width: '100%', maxHeight: '90vh', overflow: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', wordBreak: 'break-all' }}>{previewFile.name.replace(/^\d+_/, '')}</div>
              <button onClick={() => setPreviewFile(null)} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}>✕</button>
            </div>

            {previewFile.type === 'image' ? (
              <img src={previewFile.url} alt={previewFile.name} style={{ width: '100%', borderRadius: 12, maxHeight: 400, objectFit: 'contain', background: '#0f0f0f' }} />
            ) : previewFile.type === 'pdf' ? (
              <iframe src={previewFile.url} style={{ width: '100%', height: 480, border: 'none', borderRadius: 10 }} title="PDF Preview" />
            ) : previewFile.type === 'video' ? (
              <video src={previewFile.url} controls style={{ width: '100%', borderRadius: 12, maxHeight: 380 }} />
            ) : previewFile.type === 'audio' ? (
              <audio src={previewFile.url} controls style={{ width: '100%', marginTop: 16 }} />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
                <div style={{ fontSize: 60, marginBottom: 16 }}>{fileIcon(previewFile.type)}</div>
                <div style={{ fontSize: 14, marginBottom: 4 }}>No preview available for this file type.</div>
                <div style={{ fontSize: 12, color: '#4b5563' }}>{formatBytes(previewFile.size)}</div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button
                style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #9c1c22, #7a1219)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                onClick={() => handleCopy(previewFile.url)}
              >
                {copiedUrl === previewFile.url ? '✓ Copied!' : '📋 Copy URL'}
              </button>
              <a href={previewFile.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', flex: 1 }}>
                <button style={{ width: '100%', padding: '10px 0', borderRadius: 10, border: '1px solid #2a2a2a', background: 'transparent', color: '#d1d5db', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  ↗ Open Full Size
                </button>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div style={S.toastStyle}>{toast}</div>}
    </div>
  );
};

export default AdminAttachments;
