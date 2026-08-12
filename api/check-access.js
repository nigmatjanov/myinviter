const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed"
    });
  }

  const token = req.query.access;

  if (!token) {
    return res.status(401).json({
      ok: false,
      error: "Access token kerak"
    });
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/payments?access_token=eq.${encodeURIComponent(
        token
      )}&status=eq.paid&used=eq.false&select=id,access_token&limit=1`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
        }
      }
    );

    if (!response.ok) {
      return res.status(500).json({
        ok: false,
        error: "Database error"
      });
    }

    const payments = await response.json();

    if (!payments.length) {
      return res.status(403).json({
        ok: false,
        error: "To‘lov topilmadi yoki access link ishlatilgan"
      });
    }

    return res.status(200).json({
      ok: true
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      error: "Server error"
    });
  }
}