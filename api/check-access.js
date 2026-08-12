export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed"
    });
  }

  try {
    const token = req.query.token;

    if (!token) {
      return res.status(400).json({
        ok: false,
        error: "Token topilmadi"
      });
    }

    const SUPABASE_URL =
      process.env.SUPABASE_URL;

    const SUPABASE_SERVICE_ROLE_KEY =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/payments` +
      `?access_token=eq.${encodeURIComponent(token)}` +
      `&status=eq.paid` +
      `&used=eq.false` +
      `&select=id,telegram_user_id,status,used` +
      `&limit=1`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization:
            `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
        }
      }
    );

    if (!response.ok) {
      return res.status(500).json({
        ok: false,
        error: "Supabase xatosi"
      });
    }

    const payments =
      await response.json();

    if (
      !Array.isArray(payments) ||
      payments.length === 0
    ) {
      return res.status(403).json({
        ok: false,
        error:
          "To‘lov tasdiqlanmagan yoki token eskirgan"
      });
    }

    return res.status(200).json({
      ok: true,
      payment: payments[0]
    });

  } catch (error) {

    console.error(
      "CHECK ACCESS ERROR:",
      error
    );

    return res.status(500).json({
      ok: false,
      error: "Server xatosi"
    });
  }
}