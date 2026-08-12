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
    // BASIC VALIDATION
    // =========================

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

    // =========================
    // CHECK PAYMENT
    // =========================

    const paymentUrl =
      `${SUPABASE_URL}/rest/v1/payments` +
      `?access_token=eq.${encodeURIComponent(accessToken)}` +
      `&status=eq.paid` +
      `&used=eq.false` +
      `&limit=1`;

    const paymentResponse = await fetch(
      paymentUrl,
      {
        method: "GET",
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization:
            `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
        }
      }
    );

    const paymentText =
      await paymentResponse.text();

    if (!paymentResponse.ok) {
      console.error(
        "PAYMENT CHECK ERROR:",
        paymentText
      );

      return res.status(500).json({
        ok: false,
        error: "To‘lovni tekshirib bo‘lmadi."
      });
    }

    let payments;

    try {
      payments = JSON.parse(paymentText);
    } catch (error) {
      return res.status(500).json({
        ok: false,
        error: "To‘lov ma’lumotlarini o‘qib bo‘lmadi."
      });
    }

    if (
      !Array.isArray(payments) ||
      payments.length === 0
    ) {
      return res.status(403).json({
        ok: false,
        error:
          "To‘lov topilmadi yoki access link allaqachon ishlatilgan."
      });
    }

    const payment = payments[0];

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
            groom_name: groomName,
            bride_name: brideName,
            event_date: eventDate,
            venue: venue || "",
            address: address || "",
            maps_url: mapsUrl || "",
            photo_url: photoUrl || "",
            music_url: musicUrl || ""
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

      let errorMessage =
        "Taklifnoma yaratilmadi.";

      try {
        const errorData =
          JSON.parse(invitationText);

        errorMessage =
          errorData.message ||
          errorData.hint ||
          errorData.error ||
          errorMessage;

      } catch (error) {}

      return res.status(500).json({
        ok: false,
        error: errorMessage
      });
    }

    let invitationData;

    try {
      invitationData =
        JSON.parse(invitationText);
    } catch (error) {
      return res.status(500).json({
        ok: false,
        error:
          "Taklifnoma javobini o‘qib bo‘lmadi."
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

    // =========================
    // MARK PAYMENT AS USED
    // =========================

    const updatePaymentResponse =
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
            invitation_id: invitationId
          })
        }
      );

    const updatePaymentText =
      await updatePaymentResponse.text();

    if (!updatePaymentResponse.ok) {
      console.error(
        "PAYMENT UPDATE ERROR:",
        updatePaymentText
      );

      return res.status(500).json({
        ok: false,
        error:
          "To‘lov holatini yangilab bo‘lmadi."
      });
    }

    // =========================
    // SUCCESS
    // =========================

    return res.status(200).json({
      ok: true,
      invitationId: invitationId
    });

  } catch (error) {

    console.error(
      "CREATE INVITATION ERROR:",
      error
    );

    return res.status(500).json({
      ok: false,
      error:
        "Serverda kutilmagan xatolik yuz berdi."
    });
  }
}