const BOT_TOKEN = process.env.BOT_TOKEN;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

const TELEGRAM_API =
  `https://api.telegram.org/bot${BOT_TOKEN}`;

async function telegram(method, data) {

  const response = await fetch(
    `${TELEGRAM_API}/${method}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  );

  return response.json();
}

async function supabaseRequest(path) {

  return fetch(
    `${SUPABASE_URL}/rest/v1/${path}`,
    {
      method: "GET",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization:
          `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      }
    }
  );
}

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed"
    });
  }

  try {

    const {
      invitationId,
      guestName,
      attendance,
      message
    } = req.body || {};

    if (!invitationId) {
      return res.status(400).json({
        ok: false,
        error: "invitationId kerak"
      });
    }

    if (!guestName) {
      return res.status(400).json({
        ok: false,
        error: "guestName kerak"
      });
    }

    /* =========================
       INVITATION TOPISH
    ========================= */

    const invitationResponse =
      await supabaseRequest(
        `invitations?id=eq.${encodeURIComponent(
          invitationId
        )}&select=id,groom_name,bride_name,telegram_user_id`
      );

    const invitationText =
      await invitationResponse.text();

    if (!invitationResponse.ok) {

      console.error(
        "INVITATION ERROR:",
        invitationText
      );

      return res.status(500).json({
        ok: false,
        error: "Taklifnoma topilmadi"
      });
    }

    const invitations =
      JSON.parse(invitationText);

    if (
      !Array.isArray(invitations) ||
      invitations.length === 0
    ) {

      return res.status(404).json({
        ok: false,
        error: "Taklifnoma topilmadi"
      });
    }

    const invitation =
      invitations[0];

    const telegramUserId =
      invitation.telegram_user_id;

    if (!telegramUserId) {

      console.error(
        "Telegram user ID mavjud emas"
      );

      return res.status(400).json({
        ok: false,
        error:
          "Bu taklifnomaga Telegram foydalanuvchisi bog‘lanmagan"
      });
    }

    /* =========================
       TELEGRAM XABAR
    ========================= */

    const text =

      `💌 <b>Yangi RSVP!</b>\n\n` +

      `👰‍♀️ <b>${escapeHtml(
        invitation.bride_name || ""
      )}</b> & ` +

      `🤵 <b>${escapeHtml(
        invitation.groom_name || ""
      )}</b>\n\n` +

      `👤 Mehmon: <b>${escapeHtml(
        guestName
      )}</b>\n` +

      `📋 Ishtiroki: <b>${escapeHtml(
        attendance || "Ko‘rsatilmagan"
      )}</b>\n\n` +

      `💬 Tilak:\n` +

      `${escapeHtml(
        message || "Tilak yozilmagan"
      )}`;

    const telegramResponse =
      await telegram(
        "sendMessage",
        {
          chat_id: telegramUserId,
          text,
          parse_mode: "HTML"
        }
      );

    console.log(
      "TELEGRAM RSVP RESPONSE:",
      telegramResponse
    );

    if (!telegramResponse.ok) {

      return res.status(500).json({
        ok: false,
        error:
          "Telegram xabar yuborilmadi",
        telegram:
          telegramResponse
      });
    }

    return res.status(200).json({
      ok: true,
      message:
        "RSVP Telegramga yuborildi"
    });

  } catch (error) {

    console.error(
      "RSVP ERROR:",
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


/* =========================
   HTML XAVFSIZLIK
========================= */

function escapeHtml(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}