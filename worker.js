/**
 * Cloudflare Worker API for Wedding RSVP & Dynamic Settings
 * Database Binding: DB (Cloudflare D1)
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Key",
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...CORS_HEADERS,
    },
  });
}

export default {
  async fetch(request, env, ctx) {
    // Handle CORS Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, ""); // normalize trailing slash

    // Root Welcome Endpoint
    if (path === "" || path === "/") {
      return jsonResponse({
        success: true,
        message: "Wedding API & D1 Database is running!",
        endpoints: {
          config: "/api/config (GET, POST)",
          rsvp: "/api/rsvp (GET, POST, DELETE)",
        },
      });
    }

    // Verify D1 binding
    if (!env.DB) {
      return jsonResponse({
        success: false,
        error: "Database D1 (DB) belum dikonfigurasi pada Cloudflare Worker.",
      }, 500);
    }

    try {
      // ==========================================
      // 1. CONFIG API (GET & POST SETTINGS)
      // ==========================================
      if (path === "/api/config" || path === "/api/settings") {
        // GET /api/config - Ambil seluruh pengaturan website dari D1
        if (request.method === "GET") {
          const row = await env.DB.prepare(
            "SELECT value, updated_at FROM config WHERE key = 'wedding_data' LIMIT 1"
          ).first();

          if (row && row.value) {
            try {
              const data = JSON.parse(row.value);
              return jsonResponse({
                success: true,
                data,
                updated_at: row.updated_at,
              });
            } catch(e) {}
          }

          return jsonResponse({
            success: true,
            data: null,
            message: "Belum ada konfigurasi kustom di database.",
          });
        }

        // POST /api/config - Simpan pengaturan baru ke D1
        if (request.method === "POST") {
          const body = await request.json().catch(() => null);
          if (!body || typeof body !== "object") {
            return jsonResponse({ success: false, error: "Format payload konfigurasi tidak valid." }, 400);
          }

          const jsonStr = JSON.stringify(body);

          await env.DB.prepare(
            `INSERT INTO config (key, value, updated_at) 
             VALUES ('wedding_data', ?, CURRENT_TIMESTAMP)
             ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`
          ).bind(jsonStr).run();

          return jsonResponse({
            success: true,
            message: "Pengaturan pernikahan berhasil disimpan di Cloudflare D1 secara global!",
          });
        }
      }

      // ==========================================
      // 2. RSVP & UCAPAN API (GET, POST, DELETE)
      // ==========================================
      if (path === "/api/rsvp" || path === "/api/wishes") {
        // GET /api/rsvp - Ambil daftar ucapan & statistik kehadiran
        if (request.method === "GET") {
          const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
          const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "50")));
          const offset = (page - 1) * limit;

          const { results: wishes } = await env.DB.prepare(
            "SELECT id, name, presence, message, created_at FROM wishes ORDER BY created_at DESC LIMIT ? OFFSET ?"
          ).bind(limit, offset).all();

          const stats = await env.DB.prepare(
            `SELECT 
              COUNT(*) as total,
              SUM(CASE WHEN presence = 'hadir' THEN 1 ELSE 0 END) as total_hadir,
              SUM(CASE WHEN presence = 'tidak' THEN 1 ELSE 0 END) as total_tidak
             FROM wishes`
          ).first();

          return jsonResponse({
            success: true,
            page,
            limit,
            stats: {
              total: stats?.total || 0,
              hadir: stats?.total_hadir || 0,
              tidak: stats?.total_tidak || 0,
            },
            wishes: wishes || [],
          });
        }

        // POST /api/rsvp - Simpan ucapan tamu & konfirmasi kehadiran
        if (request.method === "POST") {
          const body = await request.json().catch(() => ({}));
          const name = (body.name || "").trim();
          const presence = (body.presence || "hadir").trim().toLowerCase();
          const message = (body.message || "").trim();
          const honeypot = (body.hp || "").trim();

          if (honeypot.length > 0) {
            return jsonResponse({ success: false, error: "Bot detected" }, 400);
          }

          if (!name || name.length < 2) {
            return jsonResponse({ success: false, error: "Nama wajib diisi minimal 2 karakter." }, 400);
          }

          if (!message || message.length < 2) {
            return jsonResponse({ success: false, error: "Ucapan & Doa wajib diisi." }, 400);
          }

          const validPresence = ["hadir", "tidak"].includes(presence) ? presence : "hadir";

          const result = await env.DB.prepare(
            "INSERT INTO wishes (name, presence, message, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)"
          ).bind(name, validPresence, message).run();

          return jsonResponse({
            success: true,
            message: "Ucapan dan konfirmasi kehadiran berhasil dikirim!",
            id: result.meta?.last_row_id,
          }, 201);
        }

        // DELETE /api/rsvp?id=123 - Hapus ucapan spam
        if (request.method === "DELETE") {
          const id = url.searchParams.get("id");
          if (!id) {
            return jsonResponse({ success: false, error: "ID ucapan wajib disertakan." }, 400);
          }

          await env.DB.prepare("DELETE FROM wishes WHERE id = ?").bind(id).run();

          return jsonResponse({
            success: true,
            message: `Ucapan #${id} berhasil dihapus.`,
          });
        }
      }

      // Default 404
      return jsonResponse({ success: false, error: "Endpoint tidak ditemukan." }, 404);

    } catch (err) {
      return jsonResponse({
        success: false,
        error: err.message || "Terjadi kesalahan internal server.",
      }, 500);
    }
  },
};
