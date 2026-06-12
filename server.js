const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');
// Perbaikan Impor: Menggunakan Destructuring untuk mengambil objek Snap secara spesifik
const { Snap } = require('midtrans-client'); 

const app = express();
app.use(cors());
app.use(bodyParser.json());

// =========================================================
// 1. KONEKSI KE DATABASE MYSQL (phpMyAdmin)
// =========================================================
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',          // User bawaan XAMPP
    password: '',          // Password bawaan XAMPP (kosong)
    database: 'nexmed_db'  // Database NexMed kamu
});

db.connect((err) => {
    if (err) {
        console.error('Gagal terhubung ke MySQL:', err.message);
        return;
    }
    console.log('Database NexMed Terhubung!');
});

// =========================================================
// CONFIGURE MIDTRANS SDK (MODE SANDBOX / UJI COBA)
// =========================================================
// Diinisialisasi sekali secara Global di atas supaya bisa dipakai di semua Route tanpa error 'undefined'
const snap = new Snap({
    isProduction : false, 
    serverKey : 'Mid-server-4JlPRpSOabIJns_F5rU3reQd'
});

// =========================================================
// 2. API REGISTER (Pendaftaran Akun Baru)
// =========================================================
app.post('/api/register', async (req, res) => {
    const { email, nomor_telepon, password, nama_lengkap } = req.body;

    // Validasi input kosong
    if (!email || !nomor_telepon || !password || !nama_lengkap) {
        return res.status(400).json({ message: 'Semua kolom wajib diisi!' });
    }

    try {
        // Enkripsi password sebelum disimpan ke database agar aman
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const sql = `INSERT INTO users (nama_lengkap, email, nomor_telepon, password) VALUES (?, ?, ?, ?)`;
        db.query(sql, [nama_lengkap, email, nomor_telepon, hashedPassword], (err, result) => {
            if (err) {
                // Jika email sudah pernah didaftarkan sebelumnya
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: 'Email sudah terdaftar!' });
                }
                return res.status(500).json({ message: 'Terjadi kesalahan pada database.' });
            }
            res.status(201).json({ message: 'Registrasi Berhasil!' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error saat enkripsi.' });
    }
});

// =========================================================
// 3. API LOGIN (Verifikasi Akun Masuk)
// =========================================================
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email dan password wajib diisi!' });
    }

    const sql = `SELECT * FROM users WHERE email = ?`;
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error pada database.' });
        
        // Jika email tidak ditemukan di database
        if (results.length === 0) {
            return res.status(400).json({ message: 'Email atau Password salah!' });
        }

        const user = results[0];

        // Cocokkan password yang diinput dengan password yang sudah di-hash di database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email atau Password salah!' });
        }

        // Jika berhasil cocok, kirim response sukses dan data user
        res.status(200).json({
            message: 'Login Berhasil!',
            user: {
                id: user.id,
                nama: user.nama_lengkap,
                email: user.email
            }
        });
    });
});

// =========================================================
// 4. API CREATE PAYMENT (Generate Token Transaksi Midtrans)
// =========================================================
app.post('/api/create-payment', async (req, res) => {
    try {
        const { orderId, grossAmount, itemName, customerName } = req.body;
        
        let parameter = {
            "transaction_details": { 
                "order_id": orderId, 
                "gross_amount": grossAmount 
            },
            "item_details": [{ 
                "id": "MED-" + Date.now(), 
                "price": grossAmount, 
                "quantity": 1, 
                "name": itemName 
            }],
            "customer_details": { 
                "first_name": customerName 
            }
        };

        // Memanggil fungsi transaksi aman Midtrans menggunakan objek snap global di atas
        const transaction = await snap.createTransaction(parameter);
        
        // Kirim Token kembali ke aplikasi frontend
        res.json({ token: transaction.token });
        
    } catch (error) {
        console.error("Kesalahan transaksi Midtrans:", error.message);
        res.status(500).json({ message: error.message });
    }
});

// =========================================================
// 5. JALANKAN SERVER DI PORT 5000
// =========================================================
app.listen(5000, () => {
    console.log('Server NexMed berjalan di port 5000');
});
