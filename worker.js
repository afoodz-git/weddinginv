/**
 * Cloudflare Worker API for Wedding RSVP & Wishes
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
    const path = url.pathname;

    // Verify D1 binding
    if (!env.DB) {
      return jsonResponse({
        success: false,
        error: "Database D1 (DB) belum dikonfigurasi pada Cloudflare Worker.",
      }, 500);
    }

    try {
      // 1. GET /api/rsvp - Ambil daftar ucapan & statistik
      if (request.method === "GET" && (path === "/api/rsvp" || path === "/api/wishes")) {
        const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
        const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "20")));
        const offset = (page - 1) * limit;

        // Ambil data ucapan
        const { results: wishes } = await env.DB.prepare(
          "SELECT id, name, presence, message, created_at FROM wishes ORDER BY created_at DESC LIMIT ? OFFSET ?"
        ).bind(limit, offset).all();

        // Ambil statistik total
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

      // 2. POST /api/rsvp - Kirim ucapan & kehadiran baru
      if (request.method === "POST" && (path === "/api/rsvp" || path === "/api/wishes")) {
        const body = await request.json().catch(() => ({}));
        const name = (body.name || "").trim();
        const presence = (body.presence || "hadir").trim().toLowerCase();
        const message = (body.message || "").trim();
        const honeypot = (body.hp || "").trim();

        // Anti-spam Honeypot Check
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

        // Insert ke Cloudflare D1
        const result = await env.DB.prepare(
          "INSERT INTO wishes (name, presence, message, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)"
        ).bind(name, validPresence, message).run();

        return jsonResponse({
          success: true,
          message: "Ucapan dan konfirmasi kehadiran berhasil dikirim!",
          id: result.meta?.last_row_id,
        }, 201);
      }

      // 3. DELETE /api/rsvp?id=123 - Hapus ucapan (Moderasi Admin)
      if (request.method === "DELETE" && (path === "/api/rsvp" || path === "/api/wishes")) {
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

      // 4. Default 404
      return jsonResponse({ success: false, error: "Endpoint tidak ditemukan." }, 404);

    } catch (err) {
      return jsonResponse({
        success: false,
        error: err.message || "Terjadi kesalahan internal server.",
      }, 500);
    }
  },
};
