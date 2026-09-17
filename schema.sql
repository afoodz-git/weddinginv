-- Skema Database Cloudflare D1 untuk RSVP & Ucapan Pernikahan
CREATE TABLE IF NOT EXISTS wishes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    presence TEXT NOT NULL, -- 'hadir' | 'tidak' | 'ragu'
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_wishes_created_at ON wishes (created_at DESC);

-- Tabel Pengaturan Dinamis Website Undangan
CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
