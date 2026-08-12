const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_ID;

const SITE_URL =
  process.env.SITE_URL || "https://myinviter.vercel.app";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

const TELEGRAM_API =
  `https://api.telegram.org/bot${BOT_TOKEN}`;


/* =====================================================
   TELEGRAM
===================================================== */

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


async function sendMessage(
  chatId,
  text,
  extra = {}
) {

  return telegram(
    "sendMessage",
    {
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      ...extra
    }
  );

}


/* =====================================================
   SUPABASE
===================================================== */

async function supabaseRequest(
  path,
  options = {}
) {

  return fetch(
    `${SUPABASE_URL}/rest/v1/${path}`,
    {

      ...options,

      headers: {

        "apikey":
          SUPABASE_SERVICE_ROLE_KEY,

        "Authorization":
          `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,

        "Content-Type":
          "application/json",

        ...(options.headers || {})

      }

    }
  );

}


/* =====================================================
   MAIN MENU
===================================================== */

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


/* =====================================================
   HANDLER
===================================================== */

export default async function handler(
  req,
  res
) {

  if (req.method !== "POST") {

    return res.status(200).json({

      ok: true,

      message:
        "MyInviter bot ishlayapti"

    });

  }


  try {

    const update = req.body;


    /* =================================================
       START
    ================================================= */

    if (
      update.message?.text === "/start"
    ) {

      const chatId =
        update.message.chat.id;


      await sendMessage(

        chatId,

        "💌 <b>MyInviter</b> botiga xush kelibsiz!\n\n" +

        "Taklifnoma yaratish uchun avval to‘lovni amalga oshiring.\n\n" +

        "Quyidagi tugmalardan foydalaning:",

        {

          reply_markup:
            mainMenu()

        }

      );


      return res.status(200).json({
        ok: true
      });

    }


    /* =================================================
       PAYMENT
    ================================================= */

    if (
      update.callback_query?.data ===
      "payment"
    ) {

      const chatId =
        update.callback_query.message.chat.id;


      await telegram(

        "answerCallbackQuery",

        {

          callback_query_id:
            update.callback_query.id

        }

      );


      await sendMessage(

        chatId,

        "💳 <b>To‘lov</b>\n\n" +

        "Taklifnoma narxi: <b>199 000 so‘m</b>\n\n" +

        "Karta raqami:\n\n" +

        "<code>9860 6067 4864 5904</code>\n\n" +

        "To‘lovni amalga oshirgandan so‘ng " +

        "chekni shu botga yuboring.",

        {

          reply_markup: {

            inline_keyboard: [

              [

                {

                  text:
                    "📸 Chek yuborish",

                  callback_data:
                    "receipt"

                }

              ],

              [

                {

                  text:
                    "🌐 Saytga qaytish",

                  url:
                    SITE_URL

                }

              ]

            ]

          }

        }

      );


      return res.status(200).json({
        ok: true
      });

    }


    /* =================================================
       RECEIPT BUTTON
    ================================================= */

    if (
      update.callback_query?.data ===
      "receipt"
    ) {

      const chatId =
        update.callback_query.message.chat.id;


      await telegram(

        "answerCallbackQuery",

        {

          callback_query_id:
            update.callback_query.id

        }

      );


      await sendMessage(

        chatId,

        "📸 <b>Chekni yuboring</b>\n\n" +

        "To‘lov qilganingizdan keyin " +

        "bank ilovasidagi chekni rasm sifatida " +

        "shu yerga yuboring."

      );


      return res.status(200).json({
        ok: true
      });

    }


    /* =================================================
       PHOTO / RECEIPT
    ================================================= */

    if (
      update.message?.photo
    ) {

      const chatId =
        update.message.chat.id;


      const photos =
        update.message.photo;


      const biggestPhoto =
        photos[
          photos.length - 1
        ];


      const caption =
        update.message.caption ||
        "Izoh yozilmagan";


      /*
      Oldingi pending paymentlarni
      hisobga olmaymiz.

      Yangi payment yaratamiz.
      */

      const paymentResponse =
        await supabaseRequest(

          "payments",

          {

            method: "POST",

            headers: {

              "Prefer":
                "return=minimal"

            },

            body:
              JSON.stringify({

                telegram_user_id:
                  chatId,

                amount:
                  199000,

                status:
                  "pending",

                access_token:
                  null

              })

          }

        );


      if (
        !paymentResponse.ok
      ) {

        console.error(

          "PAYMENT INSERT ERROR:",

          await paymentResponse.text()

        );

      }


      await sendMessage(

        chatId,

        "📸 <b>Chekingiz qabul qilindi.</b>\n\n" +

        "⏳ To‘lov tekshirilmoqda..."

      );


      /* ===============================================
         ADMIN
      =============================================== */

      if (ADMIN_ID) {

        await telegram(

          "sendPhoto",

          {

            chat_id:
              ADMIN_ID,

            photo:
              biggestPhoto.file_id,

            caption:

              `💳 <b>Yangi to‘lov cheki</b>\n\n` +

              `👤 User ID: <code>${chatId}</code>\n` +

              `💰 Summa: <b>199 000 so‘m</b>\n` +

              `📝 Izoh: ${caption}`,

            parse_mode:
              "HTML",

            reply_markup: {

              inline_keyboard: [

                [

                  {

                    text:
                      "✅ Tasdiqlash",

                    callback_data:
                      `approve_${chatId}`

                  },

                  {

                    text:
                      "❌ Rad etish",

                    callback_data:
                      `reject_${chatId}`

                  }

                ]

              ]

            }

          }

        );

      }


      return res.status(200).json({
        ok: true
      });

    }


    /* =================================================
       APPROVE
    ================================================= */

    if (
      update.callback_query?.data?.startsWith(
        "approve_"
      )
    ) {

      const query =
        update.callback_query;


      const adminId =
        query.message.chat.id;


      /* ===============================================
         ADMIN CHECK
      =============================================== */

      if (
        String(adminId) !==
        String(ADMIN_ID)
      ) {

        await telegram(

          "answerCallbackQuery",

          {

            callback_query_id:
              query.id,

            text:
              "Siz admin emassiz."

          }

        );


        return res.status(200).json({
          ok: true
        });

      }


      /* ===============================================
         USER ID
      =============================================== */

      const userId =
        query.data.replace(
          "approve_",
          ""
        );


      /* ===============================================
         FIND PAYMENT
      =============================================== */

      const findResponse =
        await supabaseRequest(

          `payments?telegram_user_id=eq.${userId}` +

          `&status=eq.pending` +

          `&order=created_at.desc` +

          `&limit=1`,

          {

            method:
              "GET"

          }

        );


      const payments =
        await findResponse.json();


      if (
        !Array.isArray(payments) ||
        payments.length === 0
      ) {

        await telegram(

          "answerCallbackQuery",

          {

            callback_query_id:
              query.id,

            text:
              "Pending to‘lov topilmadi."

          }

        );


        await sendMessage(

          adminId,

          "⚠️ Bu foydalanuvchi uchun pending to‘lov topilmadi."

        );


        return res.status(200).json({
          ok: true
        });

      }


      const payment =
        payments[0];


      /* ===============================================
         ACCESS TOKEN
      =============================================== */

      const accessToken =
        crypto.randomUUID();


      /* ===============================================
         MARK AS PAID
      =============================================== */

      const updateResponse =
        await supabaseRequest(

          `payments?id=eq.${payment.id}`,

          {

            method:
              "PATCH",

            headers: {

              "Prefer":
                "return=minimal"

            },

            body:

              JSON.stringify({

                status:
                  "paid",

                approved_at:
                  new Date().toISOString(),

                access_token:
                  accessToken

              })

          }

        );


      if (
        !updateResponse.ok
      ) {

        const errorText =
          await updateResponse.text();


        console.error(

          "PAYMENT UPDATE ERROR:",

          errorText

        );


        throw new Error(
          "To‘lov statusini saqlab bo‘lmadi."
        );

      }


      /* ===============================================
         ADMIN BUTTON
      =============================================== */

      await telegram(

        "answerCallbackQuery",

        {

          callback_query_id:
            query.id,

          text:
            "To‘lov tasdiqlandi ✅"

        }

      );


      /* ===============================================
         CREATE URL
      =============================================== */

      const createUrl =
        `${SITE_URL}/create.html?token=${encodeURIComponent(accessToken)}`;


      /* ===============================================
         USER ACCESS
      =============================================== */

      await sendMessage(

        userId,

        "✅ <b>To‘lovingiz tasdiqlandi!</b>\n\n" +

        "Endi taklifnomangizni yaratishingiz mumkin.\n\n" +

        "Quyidagi tugmani bosing:",

        {

          reply_markup: {

            inline_keyboard: [

              [

                {

                  text:
                    "💌 Taklifnoma yaratish",

                  url:
                    createUrl

                }

              ]

            ]

          }

        }

      );


      /* ===============================================
         ADMIN MESSAGE
      =============================================== */

      await sendMessage(

        adminId,

        `✅ <b>To‘lov tasdiqlandi.</b>\n\n` +

        `👤 User ID: <code>${userId}</code>\n` +

        `💰 199 000 so‘m\n` +

        `🗄 Status: <b>paid</b>\n\n` +

        `🔐 Access token yaratildi.`

      );


      return res.status(200).json({
        ok: true
      });

    }


    /* =================================================
       REJECT
    ================================================= */

    if (
      update.callback_query?.data?.startsWith(
        "reject_"
      )
    ) {

      const query =
        update.callback_query;


      const adminId =
        query.message.chat.id;


      if (
        String(adminId) !==
        String(ADMIN_ID)
      ) {

        return res.status(200).json({
          ok: true
        });

      }


      const userId =
        query.data.replace(
          "reject_",
          ""
        );


      /* ===============================================
         FIND PAYMENT
      =============================================== */

      const findResponse =
        await supabaseRequest(

          `payments?telegram_user_id=eq.${userId}` +

          `&status=eq.pending` +

          `&order=created_at.desc` +

          `&limit=1`,

          {

            method:
              "GET"

          }

        );


      const payments =
        await findResponse.json();


      if (
        Array.isArray(payments) &&
        payments.length > 0
      ) {

        const payment =
          payments[0];


        await supabaseRequest(

          `payments?id=eq.${payment.id}`,

          {

            method:
              "PATCH",

            headers: {

              "Prefer":
                "return=minimal"

            },

            body:

              JSON.stringify({

                status:
                  "rejected"

              })

          }

        );

      }


      await telegram(

        "answerCallbackQuery",

        {

          callback_query_id:
            query.id,

          text:
            "To‘lov rad etildi ❌"

        }

      );


      await sendMessage(

        userId,

        "❌ <b>To‘lov tasdiqlanmadi.</b>\n\n" +

        "Iltimos, to‘lov chekini qayta yuboring."

      );


      await sendMessage(

        adminId,

        `❌ To‘lov rad etildi.\n\n` +

        `👤 User ID: <code>${userId}</code>`

      );


      return res.status(200).json({
        ok: true
      });

    }


    /* =================================================
       DEFAULT
    ================================================= */

    return res.status(200).json({
      ok: true
    });


  } catch (error) {

    console.error(
      "BOT ERROR:",
      error
    );


    return res.status(500).json({

      ok: false,

      error:
        error.message

    });

  }

}