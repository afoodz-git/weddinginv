let WEDDING_DATA = {
    couple: {
        monogram: "W",
        title: "The Wedding of",
        weddingDateShort: "01 . 01 . 2027",
        
        groom: {
            nickname: "Groom",
            fullname: "Nama Mempelai Pria",
            parents: "Putra dari Bapak ... & Ibu ...",
            instagram: "https://www.instagram.com/",
            photo: "assets/images/couple-main.jpg"
        },
        
        bride: {
            nickname: "Bride",
            fullname: "Nama Mempelai Wanita",
            parents: "Putri dari Bapak ... & Ibu ...",
            instagram: "https://www.instagram.com/",
            photo: "assets/images/couple-main.jpg"
        }
    },

    quotes: {
        text: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.",
        source: "(Qs. Ar-Rum : 21)"
    },

    greetings: {
        salam: "Assalamu'alaikum Wr. Wb",
        intro: "Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i serta kerabat sekalian untuk menghadiri acara pernikahan kami."
    },

    countdown: {
        title: "Save The Date",
        quote: "Dan kami bersyukur, dipertemukan Allah di waktu terbaik, Kini kami menanti hari istimewa kami."
    },

    story: {
        title: "Love Story",
        story1Title: "Awal Cerita",
        story1Desc: "Berawal dari pertemuan sederhana, kami saling mengenal dan mulai berbagi banyak cerita. Tanpa disadari, kebersamaan itu tumbuh menjadi rasa nyaman yang semakin kuat dari hari ke hari.",
        story2Title: "Lamaran",
        story2Desc: "Dengan niat yang tulus dan restu keluarga, kami memutuskan untuk melangkah ke tahap yang lebih serius. Momen lamaran menjadi awal dari perjalanan baru yang penuh harapan dan doa baik.",
        story3Title: "Pernikahan",
        story3Desc: "Kini kami sampai pada hari yang kami nantikan, hari di mana dua hati dipersatukan dalam ikatan suci pernikahan. Semoga langkah ini menjadi awal kehidupan baru yang penuh cinta, kebahagiaan, dan keberkahan."
    },

    photos: {
        coverBg: "assets/images/cover-bg.webp",
        mainCouple: "assets/images/couple-main.jpg",
        storyPhoto: "assets/images/couple-main.jpg"
    },

    events: {
        countdownTarget: "2026-10-07T09:00:00+07:00",
        
        akad: {
            title: "Akad Nikah",
            dayDate: "Rabu, 7 Oktober 2026",
            time: "Pukul : 09.00 WIB",
            placeTitle: "KEDIAMAN MEMPELAI WANITA",
            address: "Jl. Contoh Alamat Acara Pernikahan No. 123, Kota",
            mapsUrl: "https://maps.google.com"
        },
        
        resepsi: {
            title: "Resepsi",
            dayDate: "Rabu, 7 Oktober 2026",
            time: "Pukul : 11.00 WIB - Selesai",
            placeTitle: "KEDIAMAN MEMPELAI WANITA",
            address: "Jl. Contoh Alamat Acara Pernikahan No. 123, Kota",
            mapsUrl: "https://maps.google.com"
        }
    },

    gifts: {
        title: "Amplop Digital",
        description: "Doa restu Anda merupakan karunia yang sangat berarti bagi kami, dan jika memberi adalah ungkapan tanda kasih, Anda dapat memberi kado secara cashless.",
        bank: {
            bankName: "SeaBank",
            logo: "assets/images/bank-seabank.svg",
            accountNumber: "1234567890",
            accountHolder: "Nama Pemilik Rekening"
        },
        bankGroom: {
            bankName: "SeaBank",
            logo: "assets/images/bank-seabank.svg",
            accountNumber: "1234567890",
            accountHolder: "Fahmi Fakih"
        },
        bankBride: {
            bankName: "SeaBank",
            logo: "assets/images/bank-seabank.svg",
            accountNumber: "0987654321",
            accountHolder: "Okta"
        },
        physicalGift: {
            recipientName: "Nama Penerima Kado",
            phone: "08123456789",
            address: "Jl. Alamat Pengiriman Kado Fisik No. 123"
        }
    },

    rsvp: {
        title: "Ucapkan Sesuatu",
        subtitle: "Berikan Ucapan & Doa Restu"
    },

    closing: {
        message: "Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu. Atas kehadiran dan doa restunya, kami mengucapkan terima kasih.",
        salam: "Wassalamu'alaikum Wr. Wb."
    },

    audio: {
        src: "assets/audio/howls-moving.mp3"
    },

    api: {
        configUrl: "https://wedding-api.fahmifakih89.workers.dev/api/config",
        rsvpUrl: "https://wedding-api.fahmifakih89.workers.dev/api/rsvp"
    }
};

function deepMergeConfig(target, source) {
    if (!source || typeof source !== 'object') return target;
    for (const key of Object.keys(source)) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            if (!target[key] || typeof target[key] !== 'object') target[key] = {};
            deepMergeConfig(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}

const localData = typeof localStorage !== 'undefined' ? localStorage.getItem('CUSTOM_WEDDING_DATA') : null;
if (localData) {
    try {
        const parsed = JSON.parse(localData);
        deepMergeConfig(WEDDING_DATA, parsed);
    } catch(e) {}
}

async function fetchLiveConfig() {
    const configEndpoint = (WEDDING_DATA.api && WEDDING_DATA.api.configUrl) || "https://wedding-api.fahmifakih89.workers.dev/api/config";
    try {
        const res = await fetch(configEndpoint);
        if (res.ok) {
            const result = await res.json();
            if (result.success && result.data && typeof result.data === 'object') {
                deepMergeConfig(WEDDING_DATA, result.data);
                applyWeddingData();
            }
        }
    } catch(err) {
        console.warn('Gagal memuat konfigurasi cloud:', err);
    }
}

function applyWeddingData() {
    const d = WEDDING_DATA;
    const coupleNames = `${d.couple.groom.nickname} & ${d.couple.bride.nickname}`;

    // Dynamic guest name from URL (?to=Nama+Tamu or ?u=Nama+Tamu or ?guest=Nama)
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get('to') || urlParams.get('u') || urlParams.get('guest') || urlParams.get('nama');
    let guestName = 'Tamu Undangan';
    if (guestParam && guestParam.trim().length > 0) {
        try {
            guestName = decodeURIComponent(guestParam.replace(/\+/g, ' ')).trim();
        } catch(e) {
            guestName = guestParam.trim();
        }
    }

    const rsvpNameInput = document.querySelector('[data-rsvp="name"]');
    if (rsvpNameInput && (!rsvpNameInput.value || rsvpNameInput.value === 'Nama Tamu' || rsvpNameInput.value === 'Tamu Undangan') && guestParam) {
        rsvpNameInput.value = guestName;
    }

    // Dynamic SEO & Document Title
    document.title = `${d.couple.title} ${coupleNames}`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = `Undangan Pernikahan ${coupleNames} - ${d.couple.weddingDateShort}`;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = `${d.couple.title} ${coupleNames}`;
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = `Undangan Pernikahan ${coupleNames} - ${d.couple.weddingDateShort}`;
    const ogSite = document.querySelector('meta[property="og:site_name"]');
    if (ogSite) ogSite.content = `${d.couple.title} ${coupleNames}`;
    const ogImg = document.querySelector('meta[property="og:image"]');
    if (ogImg && d.photos && d.photos.mainCouple) ogImg.content = d.photos.mainCouple;

    const quoteHtml = `"${d.quotes?.text || ''}"<br><br>${d.quotes?.source || ''}`;

    // Resolved Bindings Map
    const bindings = {
        'guestName': guestName,
        'couple.title': d.couple.title,
        'couple.names': coupleNames,
        'couple.namesBreak': `${d.couple.groom.nickname} <br>&amp; ${d.couple.bride.nickname}`,
        'couple.monogram': d.couple.monogram,
        'couple.weddingDateShort': d.couple.weddingDateShort,
        
        'couple.groom.nickname': d.couple.groom.nickname,
        'couple.groom.fullname': d.couple.groom.fullname,
        'couple.groom.parents': d.couple.groom.parents,
        'couple.groom.instagram': d.couple.groom.instagram,
        'couple.groom.photo': d.couple.groom.photo,
        
        'couple.bride.nickname': d.couple.bride.nickname,
        'couple.bride.fullname': d.couple.bride.fullname,
        'couple.bride.parents': d.couple.bride.parents,
        'couple.bride.instagram': d.couple.bride.instagram,
        'couple.bride.photo': d.couple.bride.photo,

        'quotes.fullHtml': quoteHtml,
        'quotes.text': d.quotes?.text || '',
        'quotes.source': d.quotes?.source || '',

        'greetings.salam': d.greetings?.salam || '',
        'greetings.intro': d.greetings?.intro || '',

        'countdown.title': d.countdown?.title || '',
        'countdown.quote': d.countdown?.quote || '',

        'story.title': d.story?.title || '',
        'story.story1Title': d.story?.story1Title || '',
        'story.story1Desc': d.story?.story1Desc || '',
        'story.story2Title': d.story?.story2Title || '',
        'story.story2Desc': d.story?.story2Desc || '',
        'story.story3Title': d.story?.story3Title || '',
        'story.story3Desc': d.story?.story3Desc || '',
        
        'photos.coverBg': d.photos.coverBg,
        'photos.mainCouple': d.photos.mainCouple,
        'photos.storyPhoto': d.photos.storyPhoto,
        
        'events.countdownTarget': d.events.countdownTarget,
        'events.akad.title': d.events.akad.title,
        'events.akad.dayDate': d.events.akad.dayDate,
        'events.akad.time': d.events.akad.time,
        'events.akad.placeTitle': d.events.akad.placeTitle,
        'events.akad.address': d.events.akad.address,
        'events.akad.placeHtml': `Tempat : <span class="niku-multiline"><strong>${d.events.akad.placeTitle || 'KEDIAMAN MEMPELAI'}</strong><br class="niku-lb">${(d.events.akad.address || '').replace(/\n/g, '<br class="niku-lb">')}</span>`,
        'events.akad.mapsUrl': d.events.akad.mapsUrl,
        
        'events.resepsi.title': d.events.resepsi.title,
        'events.resepsi.dayDate': d.events.resepsi.dayDate,
        'events.resepsi.time': d.events.resepsi.time,
        'events.resepsi.placeTitle': d.events.resepsi.placeTitle,
        'events.resepsi.address': d.events.resepsi.address,
        'events.resepsi.placeHtml': `Tempat : <span class="niku-multiline"><strong>${d.events.resepsi.placeTitle || 'KEDIAMAN MEMPELAI'}<br class="niku-lb"></strong>${(d.events.resepsi.address || '').replace(/\n/g, '<br class="niku-lb">')}</span>`,
        'events.resepsi.mapsUrl': d.events.resepsi.mapsUrl,
        
        'gifts.title': d.gifts?.title || 'Amplop Digital',
        'gifts.description': d.gifts?.description || '',
        'gifts.bankGroom.logo': (d.gifts.bankGroom || d.gifts.bank).logo || 'assets/images/bank-seabank.svg',
        'gifts.bankGroom.accountNumber': (d.gifts.bankGroom || d.gifts.bank).accountNumber,
        'gifts.bankGroom.accountHolderWithNick': `${(d.gifts.bankGroom || d.gifts.bank).accountHolder} (${d.couple.groom.nickname || 'Mempelai Pria'})`,
        'gifts.bankBride.logo': d.gifts.bankBride?.logo || (d.gifts.bankGroom || d.gifts.bank).logo || 'assets/images/bank-seabank.svg',
        'gifts.bankBride.accountNumber': d.gifts.bankBride ? d.gifts.bankBride.accountNumber : '',
        'gifts.bankBride.accountHolderWithNick': d.gifts.bankBride ? `${d.gifts.bankBride.accountHolder} (${d.couple.bride.nickname || 'Mempelai Wanita'})` : '',
        
        'gifts.physicalGift.recipientName': d.gifts.physicalGift ? d.gifts.physicalGift.recipientName : '',
        'gifts.physicalGift.phone': d.gifts.physicalGift ? d.gifts.physicalGift.phone : '',
        'gifts.physicalGift.address': d.gifts.physicalGift ? d.gifts.physicalGift.address : '',

        'rsvp.title': d.rsvp?.title || 'Ucapkan Sesuatu',
        'rsvp.subtitle': d.rsvp?.subtitle || 'Berikan Ucapan & Doa Restu',

        'closing.message': d.closing?.message || '',
        'closing.salam': d.closing?.salam || '',
        
        'audio.src': d.audio.src
    };

    // 1. Apply data-bind (innerText)
    document.querySelectorAll('[data-bind]').forEach(el => {
        const key = el.getAttribute('data-bind');
        if (bindings[key] !== undefined) {
            el.innerText = bindings[key];
        }
    });

    // 2. Apply data-bind-html (innerHTML)
    document.querySelectorAll('[data-bind-html]').forEach(el => {
        const key = el.getAttribute('data-bind-html');
        if (bindings[key] !== undefined) {
            el.innerHTML = bindings[key];
        }
    });

    // 3. Apply data-bind-img (src & srcset)
    document.querySelectorAll('[data-bind-img]').forEach(el => {
        const key = el.getAttribute('data-bind-img');
        if (bindings[key]) {
            el.src = bindings[key];
            el.srcset = bindings[key];
        }
    });

    // 4. Apply data-bind-bg (backgroundImage)
    document.querySelectorAll('[data-bind-bg]').forEach(el => {
        const key = el.getAttribute('data-bind-bg');
        if (bindings[key]) {
            el.style.backgroundImage = `url("${bindings[key]}")`;
        }
    });

    // 5. Apply data-bind-href (href)
    document.querySelectorAll('[data-bind-href]').forEach(el => {
        const key = el.getAttribute('data-bind-href');
        if (bindings[key]) {
            el.href = bindings[key];
        }
    });

    // 6. Apply data-bind-copy (data-copy attribute for clipboard copy boxes)
    document.querySelectorAll('[data-bind-copy]').forEach(el => {
        const key = el.getAttribute('data-bind-copy');
        if (bindings[key]) {
            el.setAttribute('data-copy', bindings[key]);
        }
    });

    // 7. Apply data-bind-audio (audio src)
    document.querySelectorAll('[data-bind-audio]').forEach(el => {
        const key = el.getAttribute('data-bind-audio');
        if (bindings[key]) {
            el.src = bindings[key];
            const audioParent = el.closest('audio');
            if (audioParent && audioParent.load) {
                audioParent.load();
            }
        }
    });

    // 8. Apply data-bind-countdown & Live Real-Time Countdown Engine
    initLiveCountdown(d);
}

let _countdownTimerInterval = null;

function _parseIndoDateTimeToIso(dateStr, timeStr) {
    if (!dateStr) return null;
    const months = {
        'januari': 1, 'jan': 1, 'februari': 2, 'feb': 2, 'maret': 3, 'mar': 3,
        'april': 4, 'apr': 4, 'mei': 5, 'may': 5, 'juni': 6, 'jun': 6,
        'juli': 7, 'jul': 7, 'agustus': 8, 'agu': 8, 'agt': 8,
        'september': 9, 'sep': 9, 'oktober': 10, 'okt': 10, 'oct': 10,
        'november': 11, 'nov': 11, 'desember': 12, 'des': 12, 'dec': 12
    };

    const cleanDate = dateStr.toLowerCase().trim();
    let day, month, year;

    const textMatch = cleanDate.match(/(\d{1,2})\s+([a-z]+)\s+(\d{4})/i);
    if (textMatch && months[textMatch[2]]) {
        day = parseInt(textMatch[1], 10);
        month = months[textMatch[2]];
        year = parseInt(textMatch[3], 10);
    } else {
        const numMatch = cleanDate.match(/(\d{1,2})\s*[\.\/\-]\s*(\d{1,2})\s*[\.\/\-]\s*(\d{4})/);
        if (numMatch) {
            day = parseInt(numMatch[1], 10);
            month = parseInt(numMatch[2], 10);
            year = parseInt(numMatch[3], 10);
        }
    }

    if (!day || !month || !year) return null;

    let hour = 8, minute = 0;
    if (timeStr) {
        const timeMatch = timeStr.match(/(\d{1,2})[:\.](\d{2})/);
        if (timeMatch) {
            hour = parseInt(timeMatch[1], 10);
            minute = parseInt(timeMatch[2], 10);
        }
    }

    const pad = (n) => (n < 10 ? '0' : '') + n;
    return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00+07:00`;
}

function initLiveCountdown(d) {
    if (_countdownTimerInterval) {
        clearInterval(_countdownTimerInterval);
        _countdownTimerInterval = null;
    }

    const countdownElements = document.querySelectorAll('[data-bind-countdown], .idb-countdown');
    if (!countdownElements || !countdownElements.length) return;

    function tick() {
        let rawTarget = d && d.events && d.events.countdownTarget;
        
        // If countdownTarget is missing or still points to legacy 2027 while akad is different
        if (!rawTarget || rawTarget === '2027-01-01T08:00:00+07:00') {
            if (d && d.events && d.events.akad && d.events.akad.dayDate) {
                const parsed = _parseIndoDateTimeToIso(d.events.akad.dayDate, d.events.akad.time);
                if (parsed) rawTarget = parsed;
            }
        }
        if (!rawTarget) rawTarget = '2026-10-07T09:00:00+07:00';

        let targetDate = new Date(rawTarget);
        if (isNaN(targetDate.getTime())) {
            targetDate = new Date('2026-10-07T09:00:00+07:00');
        }

        const now = Date.now();
        const distance = Math.max(0, targetDate.getTime() - now);

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const pad = (n) => (n < 10 ? '0' : '') + n;
        const timeMap = {
            days: String(days),
            hours: pad(hours),
            minutes: pad(minutes),
            seconds: pad(seconds)
        };

        countdownElements.forEach(el => {
            el.setAttribute('data-target', targetDate.getTime().toString());
            el.setAttribute('data-target-iso', targetDate.toISOString());

            const items = el.querySelectorAll('.idb-countdown__item');
            items.forEach(item => {
                const part = item.getAttribute('data-part');
                const numEl = item.querySelector('[data-role="num"]');
                if (part && numEl && timeMap[part] !== undefined) {
                    if (numEl.textContent !== timeMap[part]) {
                        numEl.textContent = timeMap[part];
                    }
                }
            });
        });
    }

    tick();
    _countdownTimerInterval = setInterval(tick, 1000);
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

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        applyWeddingData();
        fetchLiveConfig();
        initRsvpSystem();
        setTimeout(applyWeddingData, 100);
        setTimeout(applyWeddingData, 400);
        setTimeout(applyWeddingData, 1200);
    });
}
if (typeof window !== 'undefined') {
    window.addEventListener('load', applyWeddingData);
}

