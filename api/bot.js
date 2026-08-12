 // api/bot.js

const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_ID;
const SITE_URL = process.env.SITE_URL || "https://myinviter.vercel.app";

const API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function telegram(method, data) {
  const response = await fetch(`${API}/${method}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return response.json();
}

async function sendMessage(chatId, text, extra = {}) {
  return telegram("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    ...extra
  });
}

function mainMenu() {
  return {
    inline_keyboard: [
      [
        {
          text: "💳 To‘lov qilish",
          callback_data: "payment"
        }
      ],
      [
        {
          text: "📸 Chek yuborish",
          callback_data: "receipt"
        }
      ],
      [
        {
          text: "🌐 Saytga qaytish",
          url: SITE_URL
        }
      ]
    ]
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({
      ok: true,
      message: "MyInviter bot ishlayapti"
    });
  }

  try {
    const update = req.body;

    // =========================
    // /start
    // =========================

    if (update.message?.text === "/start") {
      const chatId = update.message.chat.id;

      await sendMessage(
        chatId,
        "💌 <b>MyInviter</b> botiga xush kelibsiz!\n\n" +
        "Taklifnoma yaratish uchun avval to‘lovni amalga oshiring.\n\n" +
        "Quyidagi tugmalardan foydalaning:",
        {
          reply_markup: mainMenu()
        }
      );

      return res.status(200).json({ ok: true });
    }

    // =========================
    // PHOTO / CHEK
    // =========================

    if (update.message?.photo) {
      const chatId = update.message.chat.id;
      const photos = update.message.photo;

      const biggestPhoto = photos[photos.length - 1];
      const caption = update.message.caption || "Izoh yozilmagan";

      // Foydalanuvchiga
      await sendMessage(
        chatId,
        "📸 Chekingiz qabul qilindi.\n\n" +
        "⏳ To‘lov tekshirilmoqda..."
      );

      // Admin bo‘lsa unga yuboramiz
      if (ADMIN_ID) {
        await telegram("sendPhoto", {
          chat_id: ADMIN_ID,
          photo: biggestPhoto.file_id,
          caption:
            `💳 <b>Yangi to‘lov cheki</b>\n\n` +
            `👤 User ID: <code>${chatId}</code>\n` +
            `📝 Izoh: ${caption}`,
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "✅ Tasdiqlash",
                  callback_data: `approve_${chatId}`
                },
                {
                  text: "❌ Rad etish",
                  callback_data: `reject_${chatId}`
                }
              ]
            ]
          }
        });
      }

      return res.status(200).json({ ok: true });
    }

    // =========================
    // BUTTON
    // =========================

    if (update.callback_query) {
      const query = update.callback_query;

      const chatId = query.message.chat.id;
      const data = query.data;

      await telegram("answerCallbackQuery", {
        callback_query_id: query.id
      });

      // TO‘LOV
      if (data === "payment") {
        await sendMessage(
          chatId,
          "💳 <b>To‘lov</b>\n\n" +
          "Taklifnoma narxi: <b>199 000 so‘m</b>\n\n" +
          "Karta raqami:\n" +
          "<code>9860 6067 4864 5904</code>\n\n" +
          "To‘lovni amalga oshirgandan so‘ng, " +
          "chekni shu botga yuboring.",
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "📸 Chek yuborish",
                    callback_data: "receipt"
                  }
                ],
                [
                  {
                    text: "🌐 Saytga qaytish",
                    url: SITE_URL
                  }
                ]
              ]
            }
          }
        );

        return res.status(200).json({ ok: true });
      }

      // CHEK
      if (data === "receipt") {
        await sendMessage(
          chatId,
          "📸 <b>Chekni yuboring</b>\n\n" +
          "To‘lov qilganingizdan keyin bank ilovasidagi " +
          "chekni rasm sifatida shu yerga yuboring."
        );

        return res.status(200).json({ ok: true });
      }

      // ADMIN TASDIQLASH
      if (data.startsWith("approve_")) {
        if (String(chatId) !== String(ADMIN_ID)) {
          return res.status(200).json({ ok: true });
        }

        const userId = data.replace("approve_", "");

        await sendMessage(
          userId,
          "✅ <b>To‘lovingiz tasdiqlandi!</b>\n\n" +
          "Endi taklifnomangizni yaratishingiz mumkin.",
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "💌 Taklifnoma yaratish",
                    url: `${SITE_URL}/create.html`
                  }
                ]
              ]
            }
          }
        );

        await sendMessage(
          chatId,
          `✅ ${userId} foydalanuvchining to‘lovi tasdiqlandi.`
        );

        return res.status(200).json({ ok: true });
      }

      // ADMIN RAD ETISH
      if (data.startsWith("reject_")) {
        if (String(chatId) !== String(ADMIN_ID)) {
          return res.status(200).json({ ok: true });
        }

        const userId = data.replace("reject_", "");

        await sendMessage(
          userId,
          "❌ <b>To‘lov tasdiqlanmadi.</b>\n\n" +
          "Iltimos, to‘lov chekini qayta yuboring."
        );

        await sendMessage(
          chatId,
          `❌ ${userId} foydalanuvchining to‘lovi rad etildi.`
        );

        return res.status(200).json({ ok: true });
      }
    }

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error("BOT ERROR:", error);

    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}