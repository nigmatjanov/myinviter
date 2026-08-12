const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed"
    });
  }

  try {
    const {
      accessToken,
      groomName,
      brideName,
      eventDate,
      venue,
      address,
      mapsUrl,
      photoUrl,
      musicUrl
    } = req.body || {};

    // ============================
    // VALIDATION
    // ============================

    if (!accessToken) {
      return res.status(401).json({
        ok: false,
        error: "Access token kerak."
      });
    }

    if (!groomName) {
      return res.status(400).json({
        ok: false,
        error: "Kuyov ismini kiriting."
      });
    }

    if (!brideName) {
      return res.status(400).json({
        ok: false,
        error: "Kelin ismini kiriting."
      });
    }

    if (!eventDate) {
      return res.status(400).json({
        ok: false,
        error: "To‘y sanasini tanlang."
      });
    }

    // ============================
    // CHECK PAYMENT
    // ============================

    const paymentResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/payments` +
      `?access_token=eq.${encodeURIComponent(accessToken)}` +
      `&status=eq.paid` +
      `&used=eq.false` +
      `&limit=1`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization:
            `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
        }
      }
    );

    if (!paymentResponse.ok) {
      console.error(
        "PAYMENT CHECK:",
        await paymentResponse.text()
      );

      return res.status(500).json({
        ok: false,
        error: "To‘lovni tekshirib bo‘lmadi."
      });
    }

    const payments =
      await paymentResponse.json();

    if (
      !Array.isArray(payments) ||
      payments.length === 0
    ) {
      return res.status(403).json({
        ok: false,
        error:
          "To‘lov topilmadi yoki bu link allaqachon ishlatilgan."
      });
    }

    const payment = payments[0];

    // ============================
    // CREATE INVITATION
    // ============================

    const invitationResponse =
      await fetch(
        `${SUPABASE_URL}/rest/v1/invitations`,
        {
          method: "POST",

          headers: {
            apikey:
              SUPABASE_SERVICE_ROLE_KEY,

            Authorization:
              `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,

            "Content-Type":
              "application/json",

            Prefer:
              "return=representation"
          },

          body: JSON.stringify({
            groom_name:
              groomName,

            bride_name:
              brideName,

            event_date:
              eventDate,

            venue:
              venue || "",

            address:
              address || "",

            maps_url:
              mapsUrl || "",

            photo_url:
              photoUrl || "",

            music_url:
              musicUrl || ""
          })
        }
      );

    const invitationText =
      await invitationResponse.text();

    if (!invitationResponse.ok) {
      console.error(
        "INVITATION CREATE:",
        invitationText
      );

      return res.status(500).json({
        ok: false,
        error:
          "Taklifnoma yaratilmadi."
      });
    }

    let invitationData;

    try {
      invitationData =
        JSON.parse(invitationText);
    } catch {
      return res.status(500).json({
        ok: false,
        error:
          "Server javobini o‘qib bo‘lmadi."
      });
    }

    if (
      !Array.isArray(invitationData) ||
      invitationData.length === 0
    ) {
      return res.status(500).json({
        ok: false,
        error:
          "Taklifnoma ID olinmadi."
      });
    }

    const invitationId =
      invitationData[0].id;

    // ============================
    // MARK ACCESS AS USED
    // ============================

    const usedResponse =
      await fetch(
        `${SUPABASE_URL}/rest/v1/payments?id=eq.${payment.id}`,
        {
          method: "PATCH",

          headers: {
            apikey:
              SUPABASE_SERVICE_ROLE_KEY,

            Authorization:
              `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,

            "Content-Type":
              "application/json",

            Prefer:
              "return=minimal"
          },

          body: JSON.stringify({
            used: true,
            invitation_id:
              invitationId
          })
        }
      );

    if (!usedResponse.ok) {
      console.error(
        "ACCESS UPDATE:",
        await usedResponse.text()
      );

      return res.status(500).json({
        ok: false,
        error:
          "Access holatini yangilab bo‘lmadi."
      });
    }

    // ============================
    // SUCCESS
    // ============================

    return res.status(200).json({
      ok: true,
      invitationId
    });

  } catch (error) {

    console.error(
      "CREATE INVITATION ERROR:",
      error
    );

    return res.status(500).json({
      ok: false,
      error:
        "Serverda xatolik yuz berdi."
    });
  }
}