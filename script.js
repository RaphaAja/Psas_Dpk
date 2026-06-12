const pages =
  document.querySelectorAll(".page");

// STATUS APP SUDAH MASUK ATAU BELUM
let firstOpen = true;

function showPage(pageId) {

  // JIKA PERTAMA KALI MASUK
  if (firstOpen) {

    pages.forEach(page => {
      page.classList.remove("active");
    });

    const targetPage =
      document.getElementById(pageId);

    if (targetPage) {
      targetPage.classList.add("active");
    }

    // MATIKAN STATUS FIRST OPEN
    firstOpen = false;

    return;
  }

  // LOADING NORMAL
  const loader =
    document.getElementById("pageLoader");

  loader.classList.add("show");

  setTimeout(() => {

    pages.forEach(page => {
      page.classList.remove("active");
    });

    const targetPage =
      document.getElementById(pageId);

    if (targetPage) {
      targetPage.classList.add("active");
    }

    setTimeout(() => {

      loader.classList.remove("show");

    }, 300);

  }, 700);
}

window.onload = () => {

  setTimeout(() => {

    showPage("loginPage");

  }, 2000);

};


/* POPUP LOGOUT */

function showLogoutPopup() {
  document.getElementById("logoutPopup")
    .classList.add("show");
}

function closeLogoutPopup() {
  document.getElementById("logoutPopup")
    .classList.remove("show");
}

function confirmLogout() {
  closeLogoutPopup();
  showPage("loginPage");
}


/* CHAT SYSTEM */

function sendMessage() {
  const input =
    document.getElementById("chatInput");

  const text = input.value.trim();

  if (text === "") return;

  const chatBox =
    document.getElementById("chatBox");

  // PESAN USER
  const userMsg =
    document.createElement("div");

  userMsg.classList.add(
    "cs-message",
    "user-message"
  );

  userMsg.innerText = text;
  chatBox.appendChild(userMsg);

  // RESET INPUT
  input.value = "";

  // SCROLL KE BAWAH
  chatBox.scrollTop =
    chatBox.scrollHeight;

  // BALASAN OTOMATIS CS
  setTimeout(() => {

    const csMsg =
      document.createElement("div");

    csMsg.classList.add("cs-message");

    csMsg.innerText =
      "Terimakasih keluhan anda sudah kami terima.";

    chatBox.appendChild(csMsg);

    chatBox.scrollTop =
      chatBox.scrollHeight;

  }, 1000);
}


/* AUTO SLIDER BERITA */

const slider =
  document.getElementById("newsSlider");

const dots =
  document.querySelectorAll(".dot");

let currentIndex = 0;

function autoSlide() {

  currentIndex++;

  if (currentIndex >= dots.length) {
    currentIndex = 0;
  }

  // PINDAH SLIDE
  slider.scrollTo({
    left: slider.clientWidth * currentIndex,
    behavior: "smooth"
  });

  // UPDATE DOT
  dots.forEach(dot => {
    dot.classList.remove("active");
  });

  dots[currentIndex]
    .classList.add("active");
}

// JALANKAN AUTO
setInterval(autoSlide, 3000);


/* ================= OPEN CHECKOUT ================= */

function openCheckout(
  name,
  price,
  image
) {

  // GANTI DATA PRODUK
  document.getElementById(
    "checkoutTitle"
  ).innerText = name;

  document.getElementById(
    "checkoutPrice"
  ).innerText = price;

  document.getElementById(
    "subtotalText"
  ).innerText = price;

  document.getElementById(
    "checkoutImg"
  ).src = image;

  // HITUNG TOTAL
  const numericPrice = parseInt(
    price.replace(/[^0-9]/g, "")
  );

  const subtotalShip = 10000;
  const serviceFee = 2000;

  const total =
    numericPrice +
    subtotalShip +
    serviceFee;

  // CONVERT KE RUPIAH LAGI
  const formattedTotal =
    "Rp. " +
    total.toLocaleString("id-ID");

  document.getElementById(
    "totalText"
  ).innerText = formattedTotal;

  document.getElementById(
    "footerTotal"
  ).innerText = formattedTotal;

  // PINDAH PAGE
  showPage("checkoutPage");
}


/* ================= SYSTEM AUTHENTICATION ================= */

async function prosesRegister() {
  const emailInput = document.getElementById('regEmail');
  const teleponInput = document.getElementById('regPhone');
  const passwordInput = document.getElementById('regPassword');
  const namaInput = document.getElementById('regName');

  const email = emailInput.value.trim();
  const nomor_telepon = teleponInput.value.trim();
  const password = passwordInput.value.trim();
  const nama_lengkap = namaInput.value.trim();

  if (!email || !nomor_telepon || !password || !nama_lengkap) {
    alert("Semua kolom pendaftaran wajib diisi!");
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nama_lengkap,
        email,
        nomor_telepon,
        password
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert('Registrasi Berhasil! Silakan masuk.');
      showPage('loginPage');
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Error saat register:', error);
    alert('Gagal terhubung ke server backend! Pastikan CMD backend masih menyala.');
  }
}

async function prosesLogin() {
  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Email dan password wajib diisi!");
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      alert('Login Berhasil!');

      // 1. Ekstrak nama user dari data backend & ambil huruf pertamanya
      const namaUser = data.user.nama;
      const hurufPertama = namaUser.charAt(0);

      // 2. Terapkan nama dan inisial huruf ke halaman utama (Home)
      const profileName = document.getElementById('userProfileName');
      const profilePic = document.getElementById('userProfilePic');
      if (profileName) profileName.innerText = namaUser;
      if (profilePic) profilePic.innerText = hurufPertama;

      // 3. Terapkan nama dan inisial huruf ke detail halaman Profil
      const profileNameDetail = document.getElementById('userProfileNameDetail');
      const profilePicDetail = document.getElementById('userProfilePicDetail');
      if (profileNameDetail) profileNameDetail.innerText = namaUser;
      if (profilePicDetail) profilePicDetail.innerText = hurufPertama;

      // 4. Generate warna latar belakang acak yang konsisten berdasarkan huruf depan nama
      const daftarWarna = ['#5cc84f', '#3a86ff', '#8338ec', '#ff006e', '#fb5607', '#ffbe0b'];
      const indeksWarna = namaUser.charCodeAt(0) % daftarWarna.length;
      const warnaTerpilih = daftarWarna[indeksWarna];

      if (profilePic) profilePic.style.backgroundColor = warnaTerpilih;
      if (profilePicDetail) profilePicDetail.style.backgroundColor = warnaTerpilih;

      showPage('homePage');
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Error saat login:', error);
    alert('Gagal terhubung ke server backend!');
  }
}


/* ====================================================================
   --- SINKRONISASI UPDATE STATUS, WEIGHT, HEIGHT PROFIL KE HOME PAGE --- 
   ==================================================================== */

function simpanPerubahanProfil() {
  // 1. Ambil elemen input formulir di halaman profil
  const inputStatus = document.getElementById('editStatus').value.trim();
  const inputHeight = document.getElementById('editHeight').value.trim();
  const inputWeight = document.getElementById('editWeight').value.trim();

  // 2. Ambil elemen target penampung teks di halaman utama (homePage)
  const txtHomeStatus = document.getElementById('homeUserStatus');
  const txtHomeHeight = document.getElementById('homeUserHeight');
  const txtHomeWeight = document.getElementById('homeUserWeight');

  // 3. Validasi & Perbarui halaman Home jika input tidak kosong
  if (inputStatus !== "") {
    txtHomeStatus.innerText = inputStatus;
  }
  if (inputHeight !== "") {
    // jika user lupa mengetik satuan 'cm', sistem menambahkannya otomatis
    txtHomeHeight.innerText = inputHeight.toLowerCase().includes('cm') ? inputHeight : inputHeight + " cm";
  }
  if (inputWeight !== "") {
    // jika user lupa mengetik satuan 'kg', sistem menambahkannya otomatis
    txtHomeWeight.innerText = inputWeight.toLowerCase().includes('kg') ? inputWeight : inputWeight + " kg";
  }

  alert("Perubahan profil berhasil disimpan ke Home Page!");

  // 4. Kembalikan navigasi ke halaman utama
  showPage('homePage');
}

// =========================================================
// INTEGRASI TOMBOL PEMBAYARAN MIDTRANS VIA API BACKEND
// =========================================================
async function bayarPakaiMidtrans() {
  const namaObat = document.getElementById("checkoutTitle") ? document.getElementById("checkoutTitle").innerText : "Obat NexMed";
  const totalHargaText = document.getElementById("totalText") ? document.getElementById("totalText").innerText : "0";

  // Membersihkan teks Rp agar tersisa angka murni (Contoh: "Rp. 95.000" -> 95000)
  const totalHargaMurni = parseInt(totalHargaText.replace(/[^0-9]/g, ""));

  // Mengambil nama user yang sedang login aktif dari profil checkout
  const checkoutNameEl = document.getElementById("checkoutUserName");
  const namaUser = checkoutNameEl ? checkoutNameEl.innerText : "Pelanggan NexMed";

  // Membuat ID Transaksi Acak Unik
  const orderIdUnik = "NEXMED-" + Date.now();

  try {
    // 1. Kirim data transaksi ke backend lokal (Port 5000) untuk minta Snap Token
    const response = await fetch('http://localhost:5000/api/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderId: orderIdUnik,
        grossAmount: totalHargaMurni,
        itemName: namaObat,
        customerName: namaUser
      })
    });

    const data = await response.json();

    if (!response.ok) {
      alert("Gagal membuat sesi pembayaran: " + (data.message || "Error Server"));
      return;
    }

    // 2. Panggil Pop-Up Midtrans Snap secara langsung di atas web browser
    window.snap.pay(data.token, {


      onSuccess: function (result) {


        showPaymentSuccess(
          result.order_id,
          namaObat,
          totalHargaText
        );


      },



      onPending: function (result) {


        showPaymentPending(
          result.order_id
        );


      },




      onError: function () {


        showPaymentFailed();


      },




      onClose: function () {


        showPaymentCancel();


      }


    });

  } catch (error) {
    console.error("Kesalahan pembayaran:", error);
    alert("Koneksi bermasalah! Pastikan CMD Node.js Backend Anda dalam kondisi menyala.");
  }
}

function simpanSuratSakit() {

  const dokter =
    document.getElementById("namaDokter").value;

  const klinik =
    document.getElementById("alamatKlinik").value;

  const pasien =
    document.getElementById("namaPasien").value;

  const umur =
    document.getElementById("umurPasien").value;

  const keterangan =
    document.getElementById("keteranganSakit").value;

  const tanggal =
    document.getElementById("lokasiTanggal").value;

  document.getElementById("previewSurat").innerHTML = `
    <p>
      SURAT KETERANGAN SAKIT<br><br>

      Yang bertanda tangan di bawah ini:<br>
      Nama Dokter : ${dokter}<br>
      Alamat Klinik : ${klinik}<br><br>

      Menerangkan bahwa:<br>
      Nama : ${pasien}<br>
      Umur : ${umur} Tahun<br><br>

      ${keterangan}<br><br>

      ${tanggal}
    </p>
  `;
}

function simpanJadwalKontrol() {

  const nama =
    document.getElementById("kontrolNama").value;

  const dokter =
    document.getElementById("kontrolDokter").value;

  const poli =
    document.getElementById("kontrolPoli").value;

  const tanggal =
    document.getElementById("kontrolTanggal").value;

  const jam =
    document.getElementById("kontrolJam").value;

  const catatan =
    document.getElementById("kontrolCatatan").value;

  document.getElementById(
    "jadwalKontrolPreview"
  ).innerHTML = `
    JADWAL KONTROL<br><br>

    Nama Pasien : ${nama}<br>
    Dokter : ${dokter}<br>
    Poli : ${poli}<br>
    Tanggal : ${tanggal}<br>
    Jam : ${jam}<br><br>

    Catatan :<br>
    ${catatan}
  `;

  alert("Jadwal kontrol berhasil diperbarui!");

  showPage("notePage");
}

// ================= PAYMENT RESULT =================


function showPaymentSuccess(
  orderId,
  product,
  total
) {


  const orderBox =
    document.getElementById(
      "successOrderId"
    );


  const totalBox =
    document.getElementById(
      "successTotal"
    );


  if (orderBox) {

    orderBox.innerText =
      orderId;

  }


  if (totalBox) {

    totalBox.innerText =
      total;

  }


  showPage(
    "paymentSuccessPage"
  );


}





function showPaymentPending(
  orderId
) {

  showPage(
    "paymentPendingPage"
  );

}





function showPaymentFailed() {

  showPage(
    "paymentFailedPage"
  );

}





function showPaymentCancel() {

  showPage(
    "paymentCancelPage"
  );

}
