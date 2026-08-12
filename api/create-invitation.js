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

    // =========================
    // VALIDATION
    // =========================

    if (!accessToken) {
      return res.status(401).json({
        ok: false,
        error: "Access token kerak"
      });
    }

    if (!groomName) {
      return res.status(400).json({
        ok: false,
        error: "Kuyov ismini kiriting"
      });
    }

    if (!brideName) {
      return res.status(400).json({
        ok: false,
        error: "Kelin ismini kiriting"
      });
    }

    if (!eventDate) {
      return res.status(400).json({
        ok: false,
        error: "To‘y sanasini kiriting"
      });
    }

    // =========================
    // CHECK PAYMENT
    // =========================

    const paymentResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/payments` +
      `?access_token=eq.${encodeURIComponent(accessToken)}` +
      `&status=eq.paid` +
      `&used=eq.false` +
      `&select=id` +
      `&limit=1`,
      {
        method: "GET",

        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization:
            `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
        }
      }
    );

    if (!paymentResponse.ok) {
      const errorText =
        await paymentResponse.text();

      console.error(
        "PAYMENT CHECK ERROR:",
        errorText
      );

      return res.status(500).json({
        ok: false,
        error: "Database error"
      });
    }

    const payments =
      await paymentResponse.json();

    if (!payments.length) {
      return res.status(403).json({
        ok: false,
        error:
          "To‘lov topilmadi yoki access link ishlatilgan"
      });
    }

    const paymentId =
      payments[0].id;

    // =========================
    // CREATE INVITATION
    // =========================

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
        "INVITATION CREATE ERROR:",
        invitationText
      );

      return res.status(500).json({
        ok: false,
        error:
          "Taklifnoma yaratilmadi"
      });
    }

    let invitationData;

    try {

      invitationData =
        JSON.parse(
          invitationText
        );

    } catch (error) {

      console.error(
        "JSON ERROR:",
        invitationText
      );

      return res.status(500).json({
        ok: false,
        error:
          "Database javobini o‘qib bo‘lmadi"
      });
    }

    const invitationId =
      invitationData?.[0]?.id;

    if (!invitationId) {

      return res.status(500).json({
        ok: false,
        error:
          "Invitation ID olinmadi"
      });
    }

    // =========================
    // MARK PAYMENT AS USED
    // =========================

    const usedResponse =
      await fetch(
        `${SUPABASE_URL}/rest/v1/payments?id=eq.${paymentId}`,
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
            used: true
          })
        }
      );

    if (!usedResponse.ok) {

      const usedError =
        await usedResponse.text();

      console.error(
        "USED UPDATE ERROR:",
        usedError
      );

      return res.status(500).json({
        ok: false,
        error:
          "Access tokenni yopib bo‘lmadi"
      });
    }

    // =========================
    // SUCCESS
    // =========================

    return res.status(200).json({
      ok: true,
      invitationId:
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
        "Server error"
    });
  }
}