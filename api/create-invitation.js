<!DOCTYPE html>
<html lang="uz">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>MyInviter — Taklifnoma yaratish</title>

<style>
*{
  box-sizing:border-box;
  margin:0;
  padding:0;
}

body{
  background:#f5eee4;
  color:#493d32;
  font-family:Georgia,"Times New Roman",serif;
  padding:25px 15px 50px;
}

.container{
  max-width:600px;
  margin:auto;
}

.header{
  text-align:center;
  padding:25px 0 30px;
}

.logo{
  font-size:34px;
  font-weight:normal;
}

.subtitle{
  margin-top:10px;
  font-size:13px;
  color:#8b7764;
}

.card{
  background:#fffdf9;
  border:1px solid #e3d8ca;
  padding:25px;
  margin-bottom:18px;
  box-shadow:0 8px 30px rgba(60,40,25,.06);
}

.card h2{
  font-size:21px;
  font-weight:normal;
  margin-bottom:20px;
}

label{
  display:block;
  font-size:12px;
  color:#806e5c;
  margin-bottom:7px;
}

input,
select{
  width:100%;
  padding:14px;
  margin-bottom:17px;
  border:1px solid #ded2c4;
  background:#fdfbf8;
  color:#493d32;
  font-family:inherit;
  outline:none;
}

input:focus,
select:focus{
  border-color:#a88b6c;
}

.photos{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:12px;
}

.photo-option{
  cursor:pointer;
}

.photo-option input{
  display:none;
}

.photo-option img{
  width:100%;
  aspect-ratio:9/12;
  object-fit:cover;
  border:3px solid transparent;
  display:block;
}

.photo-option input:checked + img{
  border-color:#9b836c;
}

.upload-box{
  border:1px dashed #bda990;
  padding:18px;
  text-align:center;
  margin-top:15px;
}

.preview{
  display:none;
  width:140px;
  height:140px;
  border-radius:50%;
  object-fit:cover;
  margin:15px auto 0;
}

.music-option{
  border:1px solid #e2d7ca;
  padding:14px;
  margin-bottom:10px;
  background:#fdfbf8;
}

.music-row{
  display:flex;
  align-items:center;
  gap:10px;
}

.music-row input{
  width:auto;
  margin:0;
}

.music-name{
  flex:1;
  font-size:13px;
}

.play-btn{
  border:1px solid #bda990;
  background:#fffdf9;
  color:#5c4d40;
  padding:8px 12px;
  cursor:pointer;
}

.selected{
  padding:12px;
  margin-top:15px;
  background:#f5eee4;
  text-align:center;
  font-size:13px;
  color:#806e5c;
}

audio{
  width:100%;
  margin-top:15px;
}

.button{
  width:100%;
  padding:16px;
  border:1px solid #9b836c;
  background:#5c4d40;
  color:white;
  cursor:pointer;
  font-family:inherit;
  font-size:12px;
  letter-spacing:2px;
}

.button:disabled{
  opacity:.6;
  cursor:not-allowed;
}

.message{
  text-align:center;
  margin-top:18px;
  line-height:1.7;
  font-size:14px;
}

.success{
  color:#527052;
}

.error{
  color:#9b4b4b;
}

.result{
  display:none;
  margin-top:20px;
  padding:20px;
  background:#f5eee4;
  border:1px solid #dfd2c2;
  text-align:center;
}

.result-title{
  font-size:18px;
  margin-bottom:12px;
}

.link-box{
  width:100%;
  padding:12px;
  background:#fffdf9;
  border:1px solid #ddd1c3;
  word-break:break-all;
  font-size:12px;
  margin-bottom:12px;
}

.copy-button,
.open-button{
  width:100%;
  padding:13px;
  border:1px solid #9b836c;
  cursor:pointer;
  font-family:inherit;
  margin-top:8px;
}

.copy-button{
  background:#fffdf9;
  color:#5c4d40;
}

.open-button{
  background:#5c4d40;
  color:#fff;
  text-decoration:none;
  display:block;
}

.small{
  font-size:11px;
  line-height:1.6;
  color:#9b836c;
  margin-top:8px;
}

.footer{
  text-align:center;
  padding:25px;
  color:#9b836c;
  font-size:10px;
  letter-spacing:2px;
}

.lock-screen{
  max-width:500px;
  margin:100px auto;
  padding:30px;
  text-align:center;
}

.lock-screen h2{
  font-weight:normal;
  margin-bottom:15px;
}

.lock-screen p{
  line-height:1.7;
  color:#806e5c;
}

.lock-button{
  display:block;
  margin-top:25px;
  padding:15px;
  background:#5c4d40;
  color:white;
  text-decoration:none;
}

@media(max-width:500px){
  .card{
    padding:20px;
  }

  .photos{
    gap:8px;
  }
}
</style>
</head>

<body>

<div class="container">

  <div class="header">
    <div class="logo">
      MyInviter
    </div>

    <div class="subtitle">
      O‘zingizning chiroyli taklifnomangizni yarating
    </div>
  </div>

  <!-- MA'LUMOTLAR -->

  <div class="card">

    <h2>💍 Taklifnoma ma’lumotlari</h2>

    <label>Kuyov ismi</label>

    <input
      id="groomName"
      type="text"
      placeholder="Masalan: Aziz"
      required
    >

    <label>Kelin ismi</label>

    <input
      id="brideName"
      type="text"
      placeholder="Masalan: Madina"
      required
    >

    <label>To‘y sanasi</label>

    <input
      id="eventDate"
      type="date"
      required
    >

    <label>To‘y joyi</label>

    <input
      id="venue"
      type="text"
      placeholder="Masalan: Ozbegim"
    >

    <label>Manzil</label>

    <input
      id="address"
      type="text"
      placeholder="Masalan: Chirchiq"
    >

    <label>Google Maps link</label>

    <input
      id="mapsUrl"
      type="url"
      placeholder="https://maps.google.com/..."
    >

  </div>

  <!-- RASM -->

  <div class="card">

    <h2>🖼 Rasm tanlang</h2>

    <div class="photos">

      <label class="photo-option">
        <input
          type="radio"
          name="photoChoice"
          value="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"
          checked
        >

        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"
          alt="Wedding photo"
        >
      </label>

      <label class="photo-option">
        <input
          type="radio"
          name="photoChoice"
          value="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80"
        >

        <img
          src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80"
          alt="Wedding photo"
        >
      </label>

      <label class="photo-option">
        <input
          type="radio"
          name="photoChoice"
          value="https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?auto=format&fit=crop&w=800&q=80"
        >

        <img
          src="https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?auto=format&fit=crop&w=800&q=80"
          alt="Wedding photo"
        >
      </label>

      <label class="photo-option">
        <input
          type="radio"
          name="photoChoice"
          value="https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=800&q=80"
        >

        <img
          src="https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=800&q=80"
          alt="Wedding photo"
        >
      </label>

    </div>

    <div class="upload-box">

      <label>
        📸 O‘z rasmingizni yuklang
      </label>

      <input
        id="photoUpload"
        type="file"
        accept="image/*"
      >

      <img
        id="photoPreview"
        class="preview"
        alt="Preview"
      >

      <div class="small">
        O‘z rasmingizni yuklasangiz,
        yuqoridagi tayyor rasmlardan foydalanilmaydi.
      </div>

    </div>

  </div>

  <!-- MUSIQA -->

  <div class="card">

    <h2>🎵 Musiqa</h2>

    <div
      class="small"
      style="margin-bottom:15px;"
    >
      Tayyor qo‘shiqlardan birini tanlang
      yoki o‘z qo‘shig‘ingizni yuklang.
    </div>

    <div class="music-option">
      <div class="music-row">

        <input
          type="radio"
          name="musicChoice"
          value="https://bhqdkzeueunfhompvywm.supabase.co/storage/v1/object/public/invitation-music/Bojalar%20-%20To%20ylar%20muborak%203.mp3"
        >

        <div class="music-name">
          Bojalar — To‘ylar muborak
        </div>

        <button
          type="button"
          class="play-btn"
          onclick="previewMusic(this,'https://bhqdkzeueunfhompvywm.supabase.co/storage/v1/object/public/invitation-music/Bojalar%20-%20To%20ylar%20muborak%203.mp3')"
        >
          ▶️
        </button>

      </div>
    </div>

    <div class="music-option">
      <div class="music-row">

        <input
          type="radio"
          name="musicChoice"
          value="https://bhqdkzeueunfhompvywm.supabase.co/storage/v1/object/public/invitation-music/Ed%20Sheeran%20-%20Perfect%20(Official%20Music%20Video).mp3"
        >

        <div class="music-name">
          Ed Sheeran — Perfect
        </div>

        <button
          type="button"
          class="play-btn"
          onclick="previewMusic(this,'https://bhqdkzeueunfhompvywm.supabase.co/storage/v1/object/public/invitation-music/Ed%20Sheeran%20-%20Perfect%20(Official%20Music%20Video).mp3')"
        >
          ▶️
        </button>

      </div>
    </div>

    <div class="music-option">
      <div class="music-row">

        <input
          type="radio"
          name="musicChoice"
          value="https://bhqdkzeueunfhompvywm.supabase.co/storage/v1/object/public/invitation-music/Indila%20-%20Love%20Story%20(Official%20Music%20Video).mp3"
        >

        <div class="music-name">
          Indila — Love Story
        </div>

        <button
          type="button"
          class="play-btn"
          onclick="previewMusic(this,'https://bhqdkzeueunfhompvywm.supabase.co/storage/v1/object/public/invitation-music/Indila%20-%20Love%20Story%20(Official%20Music%20Video).mp3')"
        >
          ▶️
        </button>

      </div>
    </div>

    <div class="music-option">
      <div class="music-row">

        <input
          type="radio"
          name="musicChoice"
          value="https://bhqdkzeueunfhompvywm.supabase.co/storage/v1/object/public/invitation-music/King%20Macarella,Dilnoz%20-%20Kelibdi%20(VIP%20mix)%202.mp3"
        >

        <div class="music-name">
          King Macarella, Dilnoz — Kelibdi
        </div>

        <button
          type="button"
          class="play-btn"
          onclick="previewMusic(this,'https://bhqdkzeueunfhompvywm.supabase.co/storage/v1/object/public/invitation-music/King%20Macarella,Dilnoz%20-%20Kelibdi%20(VIP%20mix)%202.mp3')"
        >
          ▶️
        </button>

      </div>
    </div>

    <div class="music-option">
      <div class="music-row">

        <input
          type="radio"
          name="musicChoice"
          value="https://bhqdkzeueunfhompvywm.supabase.co/storage/v1/object/public/invitation-music/Sam%20Smith%20-%20Fire%20On%20Fire.mp3"
        >

        <div class="music-name">
          Sam Smith — Fire On Fire
        </div>

        <button
          type="button"
          class="play-btn"
          onclick="previewMusic(this,'https://bhqdkzeueunfhompvywm.supabase.co/storage/v1/object/public/invitation-music/Sam%20Smith%20-%20Fire%20On%20Fire.mp3')"
        >
          ▶️
        </button>

      </div>
    </div>

    <div class="music-option">
      <div class="music-row">

        <input
          type="radio"
          name="musicChoice"
          value="https://bhqdkzeueunfhompvywm.supabase.co/storage/v1/object/public/invitation-music/Ziyoda%20-%20Kelibdi%20%20%20%20%20Uzbek%20music.mp3"
        >

        <div class="music-name">
          Ziyoda — Kelibdi
        </div>

        <button
          type="button"
          class="play-btn"
          onclick="previewMusic(this,'https://bhqdkzeueunfhompvywm.supabase.co/storage/v1/object/public/invitation-music/Ziyoda%20-%20Kelibdi%20%20%20%20%20Uzbek%20music.mp3')"
        >
          ▶️
        </button>

      </div>
    </div>

    <div
      id="selectedMusic"
      class="selected"
    >
      Musiqa tanlanmagan
    </div>

    <audio
      id="musicPreview"
      controls>
    </audio>

    <div class="upload-box">

      <label>
        📱 O‘z qo‘shig‘ingizni yuklang
      </label>

      <input
        id="musicUpload"
        type="file"
        accept="audio/*,.mp3"
      >

      <div class="small">
        MP3 yoki audio fayl, maksimum 30 MB.
      </div>

    </div>

  </div>

  <!-- CREATE -->

  <div class="card">

    <button
      id="createButton"
      class="button"
      type="button"
      onclick="createInvitation()"
      disabled
    >
      💌 TAKLIFNOMA YARATISH
    </button>

    <div
      id="message"
      class="message">
      To‘lov tekshirilmoqda...
    </div>

    <div
      id="result"
      class="result">

      <div class="result-title">
        🎉 Taklifnomangiz tayyor!
      </div>

      <div
        id="invitationLink"
        class="link-box">
      </div>

      <button
        id="copyButton"
        class="copy-button"
        type="button"
        onclick="copyLink()"
      >
        📋 LINKNI NUSXALASH
      </button>

      <a
        id="openButton"
        class="open-button"
        href="#"
      >
        💌 TAKLIFNOMANI OCHISH
      </a>

      <div class="small">
        Linkni mehmonlaringizga yuborishingiz mumkin.
      </div>

    </div>

  </div>

  <div class="footer">
    MYINVITER · 2026
  </div>

</div>

<script>

/* =====================================================
   ACCESS TOKEN
===================================================== */

const accessToken =
  new URLSearchParams(
    window.location.search
  ).get("access");

let accessAllowed = false;


/* =====================================================
   VARIABLES
===================================================== */

let uploadedPhoto = null;
let uploadedMusic = null;
let createdLink = "";


/* =====================================================
   CHECK PAYMENT
===================================================== */

async function checkAccess(){

  if(!accessToken){

    blockPage(
      "Avval Telegram bot orqali to‘lovni amalga oshiring."
    );

    return;
  }

  try{

    const response =
      await fetch(
        "/api/check-access?access=" +
        encodeURIComponent(accessToken)
      );

    const data =
      await response.json();

    if(
      !response.ok ||
      !data.ok
    ){

      blockPage(
        "Bu to‘lov havolasi yaroqsiz yoki allaqachon ishlatilgan."
      );

      return;
    }

    accessAllowed = true;

    document
      .getElementById("createButton")
      .disabled = false;

    document
      .getElementById("message")
      .innerText =
        "✅ To‘lov tasdiqlangan. Taklifnomangizni yarating.";

  }catch(error){

    console.error(
      "ACCESS ERROR:",
      error
    );

    blockPage(
      "To‘lovni tekshirishda xatolik yuz berdi."
    );

  }
}


/* =====================================================
   BLOCK PAGE
===================================================== */

function blockPage(text){

  document.body.innerHTML = `

    <div class="lock-screen">

      <h2>
        🔒 Kirish yopiq
      </h2>

      <p>
        ${text}
      </p>

      <a
        class="lock-button"
        href="https://t.me/MyInviterUzBot"
      >
        💳 Telegram botga qaytish
      </a>

    </div>

  `;

}


/* =====================================================
   PHOTO UPLOAD
===================================================== */

document
.getElementById("photoUpload")
.addEventListener(
  "change",
  function(event){

    const file =
      event.target.files[0];

    if(!file){
      return;
    }

    if(
      !file.type.startsWith("image/")
    ){

      showMessage(
        "Faqat rasm tanlang.",
        true
      );

      this.value = "";
      uploadedPhoto = null;

      return;
    }

    if(
      file.size >
      10 * 1024 * 1024
    ){

      showMessage(
        "Rasm 10 MB dan kichik bo‘lishi kerak.",
        true
      );

      this.value = "";
      uploadedPhoto = null;

      return;
    }

    uploadedPhoto = file;

    const preview =
      document.getElementById(
        "photoPreview"
      );

    preview.src =
      URL.createObjectURL(file);

    preview.style.display =
      "block";

    showMessage(
      "📸 Rasm tanlandi.",
      false
    );

  }
);


/* =====================================================
   MUSIC UPLOAD
===================================================== */

document
.getElementById("musicUpload")
.addEventListener(
  "change",
  function(event){

    const file =
      event.target.files[0];

    if(!file){
      return;
    }

    if(
      !file.type.startsWith("audio/") &&
      !file.name
        .toLowerCase()
        .endsWith(".mp3")
    ){

      showMessage(
        "Faqat audio yoki MP3 fayl tanlang.",
        true
      );

      this.value = "";
      uploadedMusic = null;

      return;
    }

    if(
      file.size >
      30 * 1024 * 1024
    ){

      showMessage(
        "Qo‘shiq 30 MB dan kichik bo‘lishi kerak.",
        true
      );

      this.value = "";
      uploadedMusic = null;

      return;
    }

    uploadedMusic = file;

    document
    .querySelectorAll(
      'input[name="musicChoice"]'
    )
    .forEach(
      function(input){
        input.checked = false;
      }
    );

    document
    .getElementById("selectedMusic")
    .innerText =
      "📱 Tanlangan fayl: " +
      file.name;

  }
);


/* =====================================================
   MUSIC PREVIEW
===================================================== */

function previewMusic(
  button,
  url
){

  const audio =
    document.getElementById(
      "musicPreview"
    );

  if(
    audio.src === url &&
    !audio.paused
  ){

    audio.pause();

    button.innerText =
      "▶️";

    return;
  }

  document
  .querySelectorAll(
    ".play-btn"
  )
  .forEach(
    function(btn){
      btn.innerText =
        "▶️";
    }
  );

  audio.src = url;
  audio.load();

  audio.play()
  .then(
    function(){
      button.innerText =
        "⏸";
    }
  )
  .catch(
    function(error){
      console.log(
        "Preview error:",
        error
      );
    }
  );

  document
  .getElementById(
    "selectedMusic"
  )
  .innerText =
    "🎵 Tanlash uchun radio tugmasini bosing.";

}


/* =====================================================
   MUSIC RADIO
===================================================== */

document
.querySelectorAll(
  'input[name="musicChoice"]'
)
.forEach(
  function(input){

    input.addEventListener(
      "change",
      function(){

        uploadedMusic = null;

        document
        .getElementById(
          "musicUpload"
        )
        .value = "";

        const name =
          this
          .parentElement
          .querySelector(
            ".music-name"
          )
          .innerText;

        document
        .getElementById(
          "selectedMusic"
        )
        .innerText =
          "🎵 Tanlangan: " +
          name;

      }
    );

  }
);


/* =====================================================
   UPLOAD PHOTO TO SUPABASE
===================================================== */

async function uploadPhoto(
  invitationId
){

  if(!uploadedPhoto){
    return "";
  }

  const extension =
    uploadedPhoto.name
    .split(".")
    .pop()
    .toLowerCase();

  const fileName =
    "invitation-" +
    invitationId +
    "-" +
    Date.now() +
    "." +
    extension;

  const response =
    await fetch(
      "https://bhqdkzeueunfhompvywm.supabase.co/storage/v1/object/invitation-photos/" +
      fileName,
      {
        method:"POST",

        headers:{
          "apikey":
            "sb_publishable_CiiL8jno2aCpj8LQBZmemA_H7vFnnS1",

          "Authorization":
            "Bearer sb_publishable_CiiL8jno2aCpj8LQBZmemA_H7vFnnS1",

          "Content-Type":
            uploadedPhoto.type,

          "x-upsert":
            "true"
        },

        body:
          uploadedPhoto
      }
    );

  const text =
    await response.text();

  if(!response.ok){

    throw new Error(
      "Rasm yuklanmadi: " +
      text
    );

  }

  return (
    "https://bhqdkzeueunfhompvywm.supabase.co" +
    "/storage/v1/object/public/invitation-photos/" +
    fileName
  );

}


/* =====================================================
   UPLOAD MUSIC TO SUPABASE
===================================================== */

async function uploadMusic(
  invitationId
){

  if(!uploadedMusic){
    return "";
  }

  const extension =
    uploadedMusic.name
    .split(".")
    .pop()
    .toLowerCase();

  const fileName =
    "invitation-" +
    invitationId +
    "-" +
    Date.now() +
    "." +
    extension;

  const response =
    await fetch(
      "https://bhqdkzeueunfhompvywm.supabase.co/storage/v1/object/invitation-music/" +
      fileName,
      {
        method:"POST",

        headers:{
          "apikey":
            "sb_publishable_CiiL8jno2aCpj8LQBZmemA_H7vFnnS1",

          "Authorization":
            "Bearer sb_publishable_CiiL8jno2aCpj8LQBZmemA_H7vFnnS1",

          "Content-Type":
            uploadedMusic.type ||
            "audio/mpeg",

          "x-upsert":
            "true"
        },

        body:
          uploadedMusic
      }
    );

  const text =
    await response.text();

  if(!response.ok){

    throw new Error(
      "Qo‘shiq yuklanmadi: " +
      text
    );

  }

  return (
    "https://bhqdkzeueunfhompvywm.supabase.co" +
    "/storage/v1/object/public/invitation-music/" +
    fileName
  );

}


/* =====================================================
   CREATE INVITATION
===================================================== */

async function createInvitation(){

  if(!accessAllowed){

    showMessage(
      "❌ Avval to‘lovni tasdiqlang.",
      true
    );

    return;
  }

  const button =
    document.getElementById(
      "createButton"
    );

  button.disabled = true;

  showMessage(
    "Taklifnoma yaratilmoqda...",
    false
  );

  try{

    /* =========================
       FORM
    ========================= */

    const groomName =
      document
      .getElementById(
        "groomName"
      )
      .value
      .trim();

    const brideName =
      document
      .getElementById(
        "brideName"
      )
      .value
      .trim();

    const eventDate =
      document
      .getElementById(
        "eventDate"
      )
      .value;

    const venue =
      document
      .getElementById(
        "venue"
      )
      .value
      .trim();

    const address =
      document
      .getElementById(
        "address"
      )
      .value
      .trim();

    const mapsUrl =
      document
      .getElementById(
        "mapsUrl"
      )
      .value
      .trim();


    /* =========================
       VALIDATION
    ========================= */

    if(!groomName){
      throw new Error(
        "Kuyov ismini kiriting."
      );
    }

    if(!brideName){
      throw new Error(
        "Kelin ismini kiriting."
      );
    }

    if(!eventDate){
      throw new Error(
        "To‘y sanasini tanlang."
      );
    }


    /* =========================
       PHOTO
    ========================= */

    let photoUrl = "";

    const selectedPhoto =
      document.querySelector(
        'input[name="photoChoice"]:checked'
      );

    if(selectedPhoto){
      photoUrl =
        selectedPhoto.value;
    }


    /* =========================
       MUSIC
    ========================= */

    let musicUrl = "";

    const selectedMusic =
      document.querySelector(
        'input[name="musicChoice"]:checked'
      );

    if(selectedMusic){
      musicUrl =
        selectedMusic.value;
    }


    /* =========================
       CREATE BASIC INVITATION
       THROUGH SERVER
    ========================= */

    const createResponse =
      await fetch(
        "/api/create-invitation",
        {
          method:"POST",

          headers:{
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify({

              accessToken:

                accessToken,

              groomName:
                groomName,

              brideName:
                brideName,

              eventDate:
                eventDate,

              venue:
                venue,

              address:
                address,

              mapsUrl:
                mapsUrl,

              photoUrl:
                photoUrl,

              musicUrl:
                musicUrl

            })
        }
      );


    const createText =
      await createResponse.text();

    let createData = {};

    try{

      createData =
        JSON.parse(
          createText
        );

    }catch(error){

      throw new Error(
        "Server javobini o‘qib bo‘lmadi."
      );

    }


    if(
      !createResponse.ok ||
      !createData.ok
    ){

      throw new Error(
        createData.error ||
        "Taklifnoma yaratilmadi."
      );

    }


    const invitationId =
      createData.invitationId;


    /* =========================
       CUSTOM PHOTO
    ========================= */

    if(uploadedPhoto){

      const customPhotoUrl =
        await uploadPhoto(
          invitationId
        );

      if(customPhotoUrl){

        await updateInvitationMedia(
          invitationId,
          customPhotoUrl,
          musicUrl
        );

      }

    }


    /* =========================
       CUSTOM MUSIC
    ========================= */

    if(uploadedMusic){

      const customMusicUrl =
        await uploadMusic(
          invitationId
        );

      if(customMusicUrl){

        let finalPhotoUrl =
          photoUrl;

        if(uploadedPhoto){

          finalPhotoUrl =
            await getCurrentPhotoUrl(
              invitationId
            );

        }

        await updateInvitationMedia(
          invitationId,
          finalPhotoUrl,
          customMusicUrl
        );

      }

    }


    /* =========================
       FINAL LINK
    ========================= */

    createdLink =
      window.location.origin +
      "/invite.html?id=" +
      invitationId;


    document
    .getElementById(
      "invitationLink"
    )
    .innerText =
      createdLink;

    document
    .getElementById(
      "openButton"
    )
    .href =
      createdLink;

    document
    .getElementById(
      "result"
    )
    .style.display =
      "block";

    showMessage(
      "✅ Taklifnoma muvaffaqiyatli yaratildi!",
      false
    );

    /*
      MUHIM:
      Token bir marta ishlatilgani uchun
      qayta create qilib bo‘lmaydi.
    */

    accessAllowed = false;

  }catch(error){

    console.error(
      "CREATE ERROR:",
      error
    );

    showMessage(
      "❌ Xatolik: " +
      error.message,
      true
    );

    button.disabled = false;

  }

}


/* =====================================================
   UPDATE MEDIA
===================================================== */

async function updateInvitationMedia(
  invitationId,
  photoUrl,
  musicUrl
){

  const response =
    await fetch(
      "https://bhqdkzeueunfhompvywm.supabase.co/rest/v1/invitations?id=eq." +
      invitationId,
      {
        method:"PATCH",

        headers:{
          "apikey":
            "sb_publishable_CiiL8jno2aCpj8LQBZmemA_H7vFnnS1",

          "Authorization":
            "Bearer sb_publishable_CiiL8jno2aCpj8LQBZmemA_H7vFnnS1",

          "Content-Type":
            "application/json",

          "Prefer":
            "return=minimal"
        },

        body:
          JSON.stringify({

            photo_url:
              photoUrl || "",

            music_url:
              musicUrl || ""

          })
      }
    );

  const text =
    await response.text();

  if(!response.ok){

    throw new Error(
      "Media ma’lumotlari saqlanmadi: " +
      text
    );

  }

}


/* =====================================================
   GET PHOTO URL
===================================================== */

async function getCurrentPhotoUrl(
  invitationId
){

  const response =
    await fetch(
      "https://bhqdkzeueunfhompvywm.supabase.co/rest/v1/invitations?id=eq." +
      invitationId +
      "&select=photo_url",
      {
        headers:{
          "apikey":
            "sb_publishable_CiiL8jno2aCpj8LQBZmemA_H7vFnnS1",

          "Authorization":
            "Bearer sb_publishable_CiiL8jno2aCpj8LQBZmemA_H7vFnnS1"
        }
      }
    );

  if(!response.ok){
    return "";
  }

  const data =
    await response.json();

  if(
    Array.isArray(data) &&
    data.length
  ){

    return data[0].photo_url || "";

  }

  return "";

}


/* =====================================================
   COPY LINK
===================================================== */

async function copyLink(){

  if(!createdLink){
    return;
  }

  try{

    await navigator
      .clipboard
      .writeText(
        createdLink
      );

    const button =
      document.getElementById(
        "copyButton"
      );

    button.innerText =
      "✅ LINK NUSXALAND";

    setTimeout(
      function(){

        button.innerText =
          "📋 LINKNI NUSXALASH";

      },
      2000
    );

  }catch(error){

    alert(
      "Linkni qo‘lda nusxalang:\n\n" +
      createdLink
    );

  }

}


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(
  text,
  isError
){

  const box =
    document.getElementById(
      "message"
    );

  box.className =
    isError
      ? "message error"
      : "message";

  box.innerText =
    text;

}


/* =====================================================
   START
===================================================== */

checkAccess();

</script>

</body>
</html>