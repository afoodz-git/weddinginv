let WEDDING_DATA = {
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

    photos: {
        coverBg: "assets/images/cover-bg.webp",
        mainCouple: "assets/images/main-couple.jpg",
        storyPhoto: "assets/images/story-bg.jpg"
    },

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
            time: "Pukul : 10.00 WIB - Selesai",
            placeTitle: "KEDIAMAN MEMPELAI WANITA",
            address: "Ds Pagu, Wates, Kediri, Jawa Timur",
            mapsUrl: "https://maps.app.goo.gl/GgLwpE6Qq8GZYBJh9"
        }
    },

    gifts: {
        bank: {
            bankName: "BCA",
            logo: "assets/images/bank-bca.webp",
            accountNumber: "12345678",
            accountHolder: "Habib Yulianto (Mempelai Pria)"
        },
        bankGroom: {
            bankName: "BCA",
            logo: "assets/images/bank-bca.webp",
            accountNumber: "12345678",
            accountHolder: "Habib Yulianto (Mempelai Pria)"
        },
        bankBride: {
            bankName: "BCA",
            logo: "assets/images/bank-bca.webp",
            accountNumber: "87654321",
            accountHolder: "Adiba Putri Syakila (Mempelai Wanita)"
        },
        physicalGift: {
            recipientName: "Habib Yulianto",
            phone: "081234567890",
            address: "Ds Pagu Kec.Wates Kab. Kediri"
        }
    },

    audio: {
        src: "assets/audio/howls-moving.mp3"
    },

    api: {
        rsvpUrl: "https://wedding-api.fahmifakih89.workers.dev/api/rsvp"
    }
};

const localData = localStorage.getItem('CUSTOM_WEDDING_DATA');
if (localData) {
    try {
        const parsed = JSON.parse(localData);
        WEDDING_DATA = Object.assign(WEDDING_DATA, parsed);
    } catch(e) {}
}

function applyWeddingData() {
    const d = WEDDING_DATA;
    const coupleNames = `${d.couple.groom.nickname} & ${d.couple.bride.nickname}`;

    document.title = `${d.couple.title} ${coupleNames}`;

    // Dynamic guest name from URL (?to=Nama+Tamu or ?u=Nama+Tamu)
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get('to') || urlParams.get('u');
    const guestName = guestParam ? guestParam.trim() : 'Tamu Undangan';

    // Headings, Monogram, and Guest Name
    document.querySelectorAll('.elementor-heading-title').forEach(el => {
        const txt = el.innerText.trim();
        if (txt === 'HA' || txt === 'A&M' || txt === 'A|M') el.innerText = d.couple.monogram;
        if (txt.includes('Habib & Adiba') || txt.includes('Habib &amp; Adiba')) el.innerText = coupleNames;
        if (txt === 'Habib Yulianto') el.innerText = d.couple.groom.fullname;
        if (txt === 'Adiba Putri Syakila') el.innerText = d.couple.bride.fullname;
        if (txt === 'Nama Tamu' || txt === 'Tamu Undangan') el.innerText = guestName;
    });

    // Populate RSVP name input if empty
    const rsvpNameInput = document.querySelector('[data-rsvp="name"]');
    if (rsvpNameInput && !rsvpNameInput.value && guestParam) {
        rsvpNameInput.value = guestName;
    }

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
    const headings = document.querySelectorAll('.elementor-heading-title');
    headings.forEach(el => {
        if (el.innerText.includes('Senin, 28 Desember 2026')) {
            el.innerText = d.events.akad.dayDate;
        }
    });

    // Maps Links
    const akadMapBtn = document.querySelector('a[aria-label="Akad Nikah"]');
    if (akadMapBtn && d.events.akad.mapsUrl) {
        akadMapBtn.href = d.events.akad.mapsUrl;
    }
    const resepsiMapBtn = document.querySelector('a[aria-label="Resepsi"]');
    if (resepsiMapBtn && d.events.resepsi.mapsUrl) {
        resepsiMapBtn.href = d.events.resepsi.mapsUrl;
    }

    // Rekening 1: Groom (Mempelai Pria)
    const groomBank = d.gifts.bankGroom || d.gifts.bank;
    if (groomBank) {
        const rekNum = document.querySelector('.no-rekening-marker');
        if (rekNum) rekNum.innerText = groomBank.accountNumber;
        const rekName = document.querySelector('.idb-copy-rek__name');
        if (rekName) rekName.innerText = `${groomBank.accountHolder} (${d.couple.groom.nickname || 'Mempelai Pria'})`;
        const copyBox = document.querySelector('#idb-copy-rek-4f00a6c9-0');
        if (copyBox) copyBox.setAttribute('data-copy', groomBank.accountNumber);
    }

    // Rekening 2: Bride (Mempelai Wanita)
    const brideBank = d.gifts.bankBride;
    if (brideBank) {
        const rekNumBride = document.querySelector('.no-rekening-marker-bride');
        if (rekNumBride) rekNumBride.innerText = brideBank.accountNumber;
        const rekNameBride = document.querySelector('.idb-copy-rek__name-bride');
        if (rekNameBride) rekNameBride.innerText = `${brideBank.accountHolder} (${d.couple.bride.nickname || 'Mempelai Wanita'})`;
        const copyBoxBride = document.querySelector('#idb-copy-rek-bride');
        if (copyBoxBride) copyBoxBride.setAttribute('data-copy', brideBank.accountNumber);
    }

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

function initRsvpSystem() {
    const apiEndpoint = (WEDDING_DATA.api && WEDDING_DATA.api.rsvpUrl) || "https://wedding-api.fahmifakih89.workers.dev/api/rsvp";
    const pills = document.querySelectorAll('[data-rsvp-pill]');
    let selectedPresence = 'hadir';

    // Presence Pill Selection
    pills.forEach(pill => {
        pill.addEventListener('click', function() {
            pills.forEach(p => {
                p.setAttribute('data-active', '0');
                p.classList.remove('is-active', 'active');
            });
            this.setAttribute('data-active', '1');
            this.classList.add('is-active', 'active');
            selectedPresence = this.getAttribute('data-rsvp-pill') || 'hadir';
        });
    });

    // Default presence pill state
    const hadirPill = document.querySelector('[data-rsvp-pill="hadir"]');
    if (hadirPill) {
        hadirPill.setAttribute('data-active', '1');
        hadirPill.classList.add('is-active', 'active');
    }

    const sendBtn = document.querySelector('[data-rsvp="send"]');
    const nameInput = document.querySelector('[data-rsvp="name"]');
    const messageInput = document.querySelector('[data-rsvp="message"]');
    const hpInput = document.querySelector('[data-rsvp="hp"]');
    const liveAlert = document.querySelector('.rsvp-live');
    const listWrap = document.querySelector('.rsvp-list');

    // Function to format relative time
    function timeAgo(dateStr) {
        try {
            const date = new Date(dateStr.replace(' ', 'T') + 'Z');
            const now = new Date();
            const diffSec = Math.floor((now - date) / 1000);
            if (isNaN(diffSec) || diffSec < 60) return 'Baru saja';
            if (diffSec < 3600) return `${Math.floor(diffSec / 60)} menit yang lalu`;
            if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} jam yang lalu`;
            return `${Math.floor(diffSec / 86400)} hari yang lalu`;
        } catch(e) {
            return 'Baru saja';
        }
    }

    // Function to render wish items
    function renderWishes(wishes) {
        if (!listWrap) return;
        if (!wishes || wishes.length === 0) {
            listWrap.innerHTML = `
                <li style="text-align:center; padding: 24px 16px; color: #888; font-style: italic; list-style:none;">
                    Belum ada ucapan. Jadilah yang pertama memberikan do'a & ucapan selamat!
                </li>`;
            return;
        }

        listWrap.innerHTML = wishes.map(w => {
            const isHadir = (w.presence || '').toLowerCase() === 'hadir';
            const badgeBg = isHadir ? 'rgba(46, 174, 79, 0.12)' : 'rgba(242, 13, 22, 0.12)';
            const badgeColor = isHadir ? '#2FAE4F' : '#F20D16';
            const badgeText = isHadir ? 'Hadir' : 'Tidak Hadir';
            const initial = (w.name || 'T').trim().charAt(0).toUpperCase();

            return `
                <li class="rsvp-item" style="display:flex; gap:12px; padding:14px 16px; margin-bottom:12px; background:rgba(255,255,255,0.85); border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.04); list-style:none; border:1px solid rgba(0,0,0,0.05); text-align:left;">
                    <div style="width:38px; height:38px; border-radius:50%; background:#d4af37; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:15px; flex-shrink:0;">
                        ${initial}
                    </div>
                    <div style="flex:1; min-width:0;">
                        <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:4px; flex-wrap:wrap;">
                            <span style="font-weight:600; color:#2c3e50; font-size:14px;">${escapeHtml(w.name)}</span>
                            <div style="display:flex; align-items:center; gap:6px;">
                                <span style="font-size:11px; font-weight:600; padding:2px 8px; border-radius:10px; background:${badgeBg}; color:${badgeColor};">
                                    ${badgeText}
                                </span>
                                <span style="font-size:11px; color:#999;">${timeAgo(w.created_at)}</span>
                            </div>
                        </div>
                        <div style="font-size:13px; color:#555; line-height:1.5; white-space:pre-wrap; word-break:break-word;">${escapeHtml(w.message)}</div>
                    </div>
                </li>
            `;
        }).join('');
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // Load Wishes
    async function loadWishes() {
        if (!listWrap) return;
        try {
            const res = await fetch(`${apiEndpoint}?limit=50`);
            if (res.ok) {
                const data = await res.json();
                if (data.success && Array.isArray(data.wishes)) {
                    renderWishes(data.wishes);
                }
            }
        } catch (err) {
            console.warn('Gagal memuat ucapan dari server:', err);
        }
    }

    // Submit Wish Form
    if (sendBtn) {
        sendBtn.addEventListener('click', async function() {
            const name = (nameInput ? nameInput.value : '').trim();
            const message = (messageInput ? messageInput.value : '').trim();
            const hp = (hpInput ? hpInput.value : '').trim();

            if (!name) {
                alert('Silakan masukkan nama Anda.');
                if (nameInput) nameInput.focus();
                return;
            }

            if (!message) {
                alert('Silakan tuliskan ucapan & do\'a untuk kedua mempelai.');
                if (messageInput) messageInput.focus();
                return;
            }

            const originalBtnText = sendBtn.innerText;
            sendBtn.disabled = true;
            sendBtn.innerText = 'Mengirimkan Ucapan...';

            try {
                const res = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name,
                        presence: selectedPresence,
                        message,
                        hp
                    })
                });

                const result = await res.json();

                if (res.ok && result.success) {
                    if (liveAlert) {
                        liveAlert.innerHTML = `
                            <div style="padding:12px 16px; background:#e8f8ec; color:#1e7e34; border-radius:8px; margin:12px 0; font-size:13px; text-align:center; font-weight:500;">
                                ✨ Terima kasih atas do'a dan konfirmasi kehadiran Anda!
                            </div>`;
                        setTimeout(() => { liveAlert.innerHTML = ''; }, 6000);
                    }

                    if (messageInput) messageInput.value = '';
                    await loadWishes();
                } else {
                    alert(result.error || 'Terjadi kendala saat mengirim ucapan. Silakan coba lagi.');
                }
            } catch (err) {
                alert('Gagal terhubung ke server database. Pastikan koneksi internet aktif.');
            } finally {
                sendBtn.disabled = false;
                sendBtn.innerText = originalBtnText;
            }
        });
    }

    // Initial load
    loadWishes();
}

document.addEventListener('DOMContentLoaded', () => {
    applyWeddingData();
    initRsvpSystem();
});
