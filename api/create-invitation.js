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

    const body = req.body || {};

    const accessToken =
      body.accessToken;

    const groomName =
      body.groomName?.trim();

    const brideName =
      body.brideName?.trim();

    const eventDate =
      body.eventDate;

    const venue =
      body.venue?.trim() || "";

    const address =
      body.address?.trim() || "";

    const mapsUrl =
      body.mapsUrl?.trim() || "";

    const photoUrl =
      body.photoUrl || "";

    const musicUrl =
      body.musicUrl || "";


    /* =========================
       VALIDATION
    ========================= */

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


    /* =========================
       CHECK PAYMENT
    ========================= */

    const paymentResponse =
      await fetch(
        `${SUPABASE_URL}/rest/v1/payments` +
        `?access_token=eq.${encodeURIComponent(accessToken)}` +
        `&status=eq.paid` +
        `&used=eq.false` +
        `&select=id,telegram_user_id,access_token,status,used` +
        `&limit=1`,
        {
          method: "GET",

          headers: {
            apikey:
              SUPABASE_SERVICE_ROLE_KEY,

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
        error:
          "Payment database error: " +
          paymentText
      });
    }


    let payments;

    try {

      payments =
        JSON.parse(paymentText);

    } catch {

      return res.status(500).json({
        ok: false,
        error:
          "Payment javobini o‘qib bo‘lmadi"
      });

    }


    if (
      !Array.isArray(payments) ||
      payments.length === 0
    ) {

      return res.status(403).json({
        ok: false,
        error:
          "To‘lov topilmadi yoki access link ishlatilgan"
      });
    }


    const payment =
      payments[0];


    /* =========================
       CREATE INVITATION
    ========================= */

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

          body:
            JSON.stringify({

              groom_name:
                groomName,

              bride_name:
                brideName,

              event_date:
                eventDate,

              venue:
                venue,

              address:
                address,

              maps_url:
                mapsUrl,

              photo_url:
                photoUrl,

              music_url:
                musicUrl

             telegram_user_id:
                payment.telegram_user_id
  
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
          "Taklifnoma yaratilmadi: " +
          invitationText
      });
    }


    let invitationData;

    try {

      invitationData =
        JSON.parse(
          invitationText
        );

    } catch {

      return res.status(500).json({
        ok: false,
        error:
          "Invitation javobini o‘qib bo‘lmadi"
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


    /* =========================
       MARK TOKEN USED
    ========================= */

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

          body:
            JSON.stringify({

              used: true

            })
        }
      );


    const usedText =
      await usedResponse.text();


    if (!usedResponse.ok) {

      console.error(
        "USED UPDATE ERROR:",
        usedText
      );

      return res.status(500).json({
        ok: false,
        error:
          "Tokenni yopib bo‘lmadi: " +
          usedText
      });
    }


    /* =========================
       SUCCESS
    ========================= */

    return res.status(200).json({

      ok: true,

      invitationId:
        invitationId,

      message:
        "Taklifnoma muvaffaqiyatli yaratildi"

    });


  } catch (error) {

    console.error(
      "CREATE INVITATION ERROR:",
      error
    );

    return res.status(500).json({

      ok: false,

      error:
        error.message ||
        "Server error"

    });

  }

}