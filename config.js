// =============================================================================
// KONFIGURASI DATA UNDANGAN PERNIKAHAN
// =============================================================================

let WEDDING_DATA = {
    // 1. DATA MEMPELAI
    couple: {
        monogram: "HA",
        title: "The Wedding of",
        weddingDateShort: "28. 12. 2026",
        
        groom: {
            nickname: "Habib",
            fullname: "Habib Yulianto",
            parents: "Putra Kedua dari Bapak M. Dawam<br>(Almh) Ibu Dewi Sudarwati",
            instagram: "https://www.instagram.com/",
            photo: "assets/images/groom.jpg"
        },
        
        bride: {
            nickname: "Adiba",
            fullname: "Adiba Putri Syakila",
            parents: "Putri Pertama dari Bapak Ahmad<br>Ibu Siti",
            instagram: "https://www.instagram.com/",
            photo: "assets/images/bride.jpg"
        }
    },

    // 2. FOTO UTAMA & COVER
    photos: {
        coverBg: "assets/images/cover-bg.webp",
        mainCouple: "assets/images/main-couple.jpg",
        storyPhoto: "assets/images/story-bg.jpg"
    },

    // 3. JADWAL ACARA
    events: {
        countdownTarget: "2026-12-28T08:00:00+07:00",
        
        akad: {
            title: "Akad Nikah",
            dayDate: "Senin, 28 Desember 2026",
            time: "Pukul : 08.00 WIB",
            placeTitle: "KEDIAMAN MEMPELAI WANITA",
            address: "Ds Pagu, Wates, Kediri, Jawa Timur",
            mapsUrl: "https://maps.app.goo.gl/GgLwpE6Qq8GZYBJh9"
        },
        
        resepsi: {
            title: "Resepsi",
            dayDate: "Senin, 28 Desember 2026",
            time: "Pukul : 10.00 WIB – Selesai",
            placeTitle: "KEDIAMAN MEMPELAI WANITA",
            address: "Ds Pagu, Wates, Kediri, Jawa Timur",
            mapsUrl: "https://www.google.com/maps"
        }
    },

    // 4. REKENING & KADO
    gifts: {
        bank: {
            bankName: "BCA",
            logo: "assets/images/bank-bca.webp",
            accountNumber: "12345678",
            accountHolder: "Habib"
        },
        physicalGift: {
            recipientName: "Habib Yulianto",
            phone: "081234567890",
            address: "Ds Pagu Kec.Wates Kab. Kediri"
        }
    },

    audio: {
        src: "assets/audio/howls-moving.mp3"
    }
};

// Check if localStorage has custom data from admin.html
const localData = localStorage.getItem('CUSTOM_WEDDING_DATA');
if (localData) {
    try {
        const parsed = JSON.parse(localData);
        WEDDING_DATA = Object.assign(WEDDING_DATA, parsed);
    } catch(e) {}
}

// Fungsi inject data otomatis ke seluruh elemen website
function applyWeddingData() {
    const d = WEDDING_DATA;
    const coupleNames = `${d.couple.groom.nickname} & ${d.couple.bride.nickname}`;

    document.title = `${d.couple.title} ${coupleNames}`;

    // Headings & Monogram
    document.querySelectorAll('.elementor-heading-title').forEach(el => {
        const txt = el.innerText.trim();
        if (txt === 'HA' || txt === 'A&M' || txt === 'A|M') el.innerText = d.couple.monogram;
        if (txt.includes('Habib & Adiba') || txt.includes('Habib &amp; Adiba')) el.innerText = coupleNames;
        if (txt === 'Habib Yulianto') el.innerText = d.couple.groom.fullname;
        if (txt === 'Adiba Putri Syakila') el.innerText = d.couple.bride.fullname;
    });

    // Subtitle date
    document.querySelectorAll('.elementor-heading-title').forEach(el => {
        if (el.innerText.includes('28. 12. 2026') || el.innerText.includes('22 . 09 . 2026')) el.innerText = d.couple.weddingDateShort;
    });

    // Groom & Bride parents
    const groomParents = document.querySelector('.ayah-marker[data-idb-mempelai-side="pria"]')?.closest('.elementor-widget-text-editor');
    if (groomParents) {
        groomParents.querySelector('.elementor-widget-container').innerHTML = d.couple.groom.parents;
    }
    const brideParents = document.querySelector('.ayah-marker[data-idb-mempelai-side="wanita"]')?.closest('.elementor-widget-text-editor');
    if (brideParents) {
        brideParents.querySelector('.elementor-widget-container').innerHTML = d.couple.bride.parents;
    }

    // Akad & Resepsi
    const akadDate = document.querySelectorAll('.elementor-heading-title');
    akadDate.forEach(el => {
        if (el.innerText.includes('Senin, 28 Desember 2026')) {
            el.innerText = d.events.akad.dayDate;
        }
    });

    // Rekening & Gift
    const rekNum = document.querySelector('.no-rekening-marker');
    if (rekNum) rekNum.innerText = d.gifts.bank.accountNumber;
    const rekName = document.querySelector('.idb-copy-rek__name');
    if (rekName) rekName.innerText = d.gifts.bank.accountHolder;
    const copyBox = document.querySelector('.idb-copy-rek');
    if (copyBox) copyBox.setAttribute('data-copy', d.gifts.bank.accountNumber);

    // Kado Fisik
    const giftValues = document.querySelectorAll('.idb-kirim-hadiah__value');
    if (giftValues.length >= 3) {
        giftValues[0].innerText = d.gifts.physicalGift.recipientName;
        giftValues[1].innerText = d.gifts.physicalGift.phone;
        giftValues[2].innerText = d.gifts.physicalGift.address;
    }

    // Dynamic Photos Injection
    if (d.photos && d.photos.mainCouple) {
        document.querySelectorAll('img[src*="main-couple"], .elementor-element-68beddea img').forEach(img => {
            img.src = d.photos.mainCouple;
            img.srcset = d.photos.mainCouple;
        });
    }
    if (d.couple && d.couple.groom && d.couple.groom.photo) {
        document.querySelectorAll('img[src*="groom"], .elementor-element-1dd7eecf img').forEach(img => {
            img.src = d.couple.groom.photo;
            img.srcset = d.couple.groom.photo;
        });
    }
    if (d.couple && d.couple.bride && d.couple.bride.photo) {
        document.querySelectorAll('img[src*="bride"], .elementor-element-504750fb img').forEach(img => {
            img.src = d.couple.bride.photo;
            img.srcset = d.couple.bride.photo;
        });
    }
    if (d.photos && d.photos.storyPhoto) {
        document.querySelectorAll('img[src*="story"]').forEach(img => {
            img.src = d.photos.storyPhoto;
            img.srcset = d.photos.storyPhoto;
        });
    }
}

document.addEventListener('DOMContentLoaded', applyWeddingData);
