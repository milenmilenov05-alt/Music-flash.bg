// ════════════════════════════════════════
// Music Flash — Website JS (v9.0)
// ════════════════════════════════════════

const SUPABASE_URL = 'https://iopwawtryvvisnynxovb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_1xwPYlArEKCtLB03chrUAA_MM6t-2mH';

// ── Mobile Bottom Nav Active State ──────────────────────
const sections = ['hero','how-it-works','genres','pricing','reviews','order','faq'];
const bnItems  = document.querySelectorAll('.bn-item[data-section]');

const sectionMap = {
    'how-it-works': 'hero',
    'genres': 'genres',
    'pricing': 'pricing',
    'reviews': 'pricing',
    'order': 'pricing',
    'faq': 'faq',
    'hero': 'hero'
};

const secObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            const mapped = sectionMap[id] || id;
            bnItems.forEach(item => {
                item.classList.toggle('active', item.dataset.section === mapped);
            });
        }
    });
}, { threshold: 0.4 });

sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) secObserver.observe(el);
});

// ── FAB: Hide when order section is visible ──────────────
const fab = document.getElementById('fab');
const orderSecObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (fab) fab.style.opacity = e.isIntersecting ? '0' : '1';
    });
}, { threshold: 0.3 });
const orderSec = document.getElementById('order');
if (orderSec && fab) orderSecObs.observe(orderSec);

// ── Haptic feedback on mobile buttons ────────────────────
document.querySelectorAll('.btn-primary, .btn-nav, .pc-btn-fill, .submit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (navigator.vibrate) navigator.vibrate(8);
    });
});



// ── Cursor Glow ──────────────────────────────────────────
const glow = document.getElementById('cursorGlow');
window.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
});

// ── Hero Canvas (Particle Field) ─────────────────────────
const canvas = document.getElementById('heroCanvas');
const ctx    = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x  = Math.random() * canvas.width;
        this.y  = Math.random() * canvas.height;
        this.vx = (Math.random() - .5) * .4;
        this.vy = (Math.random() - .5) * .4;
        this.r  = Math.random() * 1.5 + .5;
        const colors = ['rgba(14,165,255', 'rgba(0,229,160', 'rgba(240,180,41'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.life  = Math.random();
        this.speed = Math.random() * .005 + .003;
    }
    update() {
        this.x += this.vx; this.y += this.vy; this.life += this.speed;
        if (this.life > 1) this.reset();
        if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
        const alpha = Math.sin(this.life * Math.PI) * .6;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color},${alpha})`;
        ctx.fill();
    }
}

function initParticles() {
    resizeCanvas();
    particles = Array.from({ length: 120 }, () => new Particle());
}

// Draw connections between close particles
function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                const alpha = (1 - dist / 120) * 0.15;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(14,165,255,${alpha})`;
                ctx.lineWidth = .5;
                ctx.stroke();
            }
        }
    }
}

function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateCanvas);
}

window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
initParticles();
animateCanvas();

// ── Navbar Scroll ────────────────────────────────────────
window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
});

// ── Mobile Menu ──────────────────────────────────────────
function toggleMenu() {
    document.getElementById('mobileMenu').classList.toggle('open');
}

// ── Smooth Scroll ────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ── Counter Animation ────────────────────────────────────
function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    if (isNaN(target)) return;
    let start = 0, duration = 1800, step = target / (duration / 16);
    function run() {
        start += step;
        el.textContent = Math.min(Math.floor(start), target).toLocaleString();
        if (start < target) requestAnimationFrame(run);
        else el.textContent = target.toLocaleString();
    }
    run();
}

// ── Reveal on Scroll ─────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('visible'), i * 80);
            revealObs.unobserve(e.target);
            // Trigger counters
            e.target.querySelectorAll('.h-n[data-target]').forEach(animateCounter);
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// Trigger hero counters directly
setTimeout(() => {
    document.querySelectorAll('.h-n[data-target]').forEach(animateCounter);
}, 1000);

// ── Package Picker (show/hide USB qty) ───────────────────
const pkgRadios  = document.querySelectorAll('input[name="package"]');
const qtyGroup   = document.getElementById('qty-group');
const pkgOpts    = document.querySelectorAll('.pkg-opt');

pkgRadios.forEach(r => {
    r.addEventListener('change', () => {
        // Update selected styling
        pkgOpts.forEach(opt => opt.classList.remove('selected'));
        r.closest('.pkg-opt').classList.add('selected');

        // Hide/show flash drive quantity and address for digital package
        const addrGroup = document.getElementById('address-group');
        const revolutBlock = document.getElementById('revolut-block');
        const durationGroup = document.getElementById('duration-group');
        if (r.value === 'digital' || r.value === 'free') {
            qtyGroup.style.display = 'none';
            if(addrGroup) addrGroup.style.display = 'none';
            if(revolutBlock) revolutBlock.style.display = 'block';
            if(durationGroup) durationGroup.style.display = (r.value === 'digital') ? 'block' : 'none';
        } else {
            qtyGroup.style.display = '';
            if(addrGroup) addrGroup.style.display = '';
            if(revolutBlock) revolutBlock.style.display = 'none';
            if(durationGroup) durationGroup.style.display = 'none';
        }
        
        // Uncheck all genres on package switch
        const allGenres = document.querySelectorAll('#genrePick input[type="checkbox"]');
        allGenres.forEach(cb => cb.checked = false);

        updatePrice();
    });
});

// Dynamic Price Calculation
const genreCheckboxes = document.querySelectorAll('#genrePick input[type="checkbox"]');
genreCheckboxes.forEach(cb => cb.addEventListener('change', updatePrice));

const durationSelect = document.getElementById('subDuration');
if(durationSelect) {
    durationSelect.addEventListener('change', updatePrice);
}

let currentTotalPrice = 29.00;

function updatePrice() {
    const selectedPkg = document.querySelector('input[name="package"]:checked');
    if (!selectedPkg) return;
    
    const pkgName = selectedPkg.value; // digital, start, standard, pro
    const basePrice = parseFloat(selectedPkg.dataset.base || 0);
    const checkedBoxes = document.querySelectorAll('#genrePick input:checked');
    const checkedGenresCount = checkedBoxes.length;
    
    let extraCost = 0;
    let maxGenres = Infinity;
    
    // Set limits based on package
    let labelNote = '';
    if (pkgName === 'free') {
        maxGenres = 1;
        labelNote = '(Избери 1 жанр)';
    } else if (pkgName === 'digital') {
        labelNote = '(2 включени безплатно, всеки следващ е +€1)';
    } else if (pkgName === 'start') {
        maxGenres = 5;
        labelNote = '(До 5 жанра по избор)';
    } else if (pkgName === 'standard') {
        maxGenres = 10;
        labelNote = '(До 10 жанра по избор)';
    } else if (pkgName === 'pro') {
        labelNote = '(Избери всички желани жанрове)';
    }
    
    const labelEl = document.getElementById('genreLabelNote');
    if (labelEl) labelEl.textContent = labelNote;
    
    // Disable/enable checkboxes based on maxGenres
    const allBoxes = document.querySelectorAll('#genrePick input[type="checkbox"]');
    if (checkedGenresCount >= maxGenres) {
        allBoxes.forEach(cb => {
            if (!cb.checked) cb.disabled = true;
        });
    } else {
        allBoxes.forEach(cb => cb.disabled = false);
    }
    
    let subCost = basePrice;
    
    // Calculate extra cost ONLY for digital package
    if (pkgName === 'digital') {
        const months = parseInt(durationSelect ? durationSelect.value : 2, 10);
        subCost = (months - 1) * 4.99; // 1 month is free

        const extraGenres = Math.max(0, checkedGenresCount - 2);
        extraCost = extraGenres * 1;
        document.querySelector('.order-total-box').style.display = 'block';
        
        document.getElementById('totalPriceBreakdown').textContent = `Абонамент (${months} мес.): €${subCost.toFixed(2)} + Доп. жанрове: €${extraCost.toFixed(2)}`;
    } else if (pkgName === 'free') {
        document.querySelector('.order-total-box').style.display = 'block';
        document.getElementById('totalPriceBreakdown').textContent = `Абонамент (14 Дни): Безплатно`;
    } else {
        // Physical packages hide the total_price_box since the price is fixed
        document.querySelector('.order-total-box').style.display = 'none';
        document.getElementById('totalPriceBreakdown').textContent = `Пакет: €${basePrice.toFixed(2)}`;
    }
    
    currentTotalPrice = subCost + extraCost;
    
    document.getElementById('totalPriceDisplay').textContent = `€${currentTotalPrice.toFixed(2)}`;
}

// Initial calculation
updatePrice();

// Pricing page "Поръчай" buttons — scroll to form + select package
document.querySelectorAll('.pc-btn[data-pkg]').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        const pkg = btn.dataset.pkg;
        const radio = document.querySelector(`input[name="package"][value="${pkg}"]`);
        if (radio) {
            radio.checked = true;
            radio.dispatchEvent(new Event('change'));
        }
        document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
    });
});

// ── FAQ Toggle ───────────────────────────────────────────
function toggleFaq(item) {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
}

// ── Order Form ───────────────────────────────────────────
document.getElementById('orderForm').addEventListener('submit', async e => {
    e.preventDefault();

    const name     = document.getElementById('name').value.trim();
    const phone    = document.getElementById('phone').value.trim();
    const email    = document.getElementById('email').value.trim();
    const pkg      = document.querySelector('input[name="package"]:checked')?.value;
    const isDigital = (pkg === 'digital' || pkg === 'free');
    const quantity  = isDigital ? 'N/A (дигитален)' : (document.getElementById('quantity')?.value || '1');
    const gdpr     = document.getElementById('gdprCheck')?.checked;
    
    // Read the courier address from selects
    const cityEl   = document.getElementById('deliveryCity');
    const officeEl = document.getElementById('deliveryOffice');
    const courier  = document.querySelector('.ctab.active')?.textContent || '';
    const city     = cityEl?.value || '';
    const office   = officeEl?.value || '';
    const address  = isDigital ? null : (city && office ? `${courier}: ${city} — ${office}` : '');
    
    const notes    = document.getElementById('notes').value.trim();
    const genres   = [...document.querySelectorAll('#genrePick input:checked')].map(c => c.value).join(', ');

    if (!name || !phone || !pkg || !gdpr) {
        showError('Моля, попълни задължителните полета и потвърди съгласието.');
        return;
    }
    if (!isDigital && !address) {
        showError('Моля, избери град и офис за доставка.');
        return;
    }

    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Изпращане...';

    const order = { 
        name, 
        phone, 
        email: email || null, 
        address: address || null, 
        quantity, 
        package: pkg, 
        genres: genres || 'Не е избрано', 
        notes: notes || null, 
        status: 'new', 
        total_price: currentTotalPrice,
        duration_months: isDigital ? (pkg === 'free' ? 0.5 : parseInt(document.getElementById('subDuration').value, 10)) : null,
        created_at: new Date().toISOString() 
    };

    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(order)
        });
        
        let finalRes = res;
        if (!res.ok) {
            const errText = await res.text();
            console.error('Supabase Error:', errText);
            if (errText.includes('Could not find the column')) {
                delete order.duration_months;
                delete order.total_price;
                const fallbackRes = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
                    method: 'POST',
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify(order)
                });
                if (!fallbackRes.ok) throw new Error(await fallbackRes.text());
                finalRes = fallbackRes;
            } else {
                throw new Error(errText);
            }
        }
        // ── AUTOMATED EMAIL SENDING (if digital/free and email provided) ──
        if (isDigital && email) {
            let licenseKey = 'Очаквайте ключа си скоро.';
            try {
                const data = await finalRes.json();
                if (data && data[0]) {
                    licenseKey = data[0].license_key || licenseKey;
                }
            } catch(e) { console.log('No JSON returned from Supabase'); }

            try {
                if (typeof emailjs !== 'undefined') {
                    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
                        to_email: email,
                        to_name: name,
                        package_name: pkg === 'free' ? '14-Дневен Тест' : 'Дигитален Абонамент',
                        license_key: licenseKey
                    }).then(
                        () => console.log("Имейлът с ключа е изпратен успешно!"),
                        (err) => console.error("Грешка при изпращане на имейл:", err)
                    );
                }
            } catch(e) {
                console.error("EmailJS error:", e);
            }
        }

        document.getElementById('form-success').style.display = 'block';
        document.getElementById('form-error').style.display = 'none';
        document.getElementById('orderForm').reset();
        // Reset pkg picker visually
        pkgOpts.forEach(o => o.classList.remove('selected'));
        document.querySelector('.pkg-opt:nth-child(3)')?.classList.add('selected');
        qtyGroup.style.display = '';
    } catch (err) {
        console.error(err);
        showError('Временен проблем с базата данни. Опитайте отново или се обадете.');
    }

    btn.disabled = false;
    btn.querySelector('span').textContent = 'Изпрати поръчката';
});

function showError(msg) {
    document.getElementById('errMsg').textContent = msg;
    document.getElementById('form-error').style.display = 'block';
    document.getElementById('form-success').style.display = 'none';
}

// ── COURIER OFFICES DATA — Всички 28 области в България ──────────
const OFFICES = {
    econt: {
        // ── Благоевградска ──
        'Благоевград': ['Офис Благоевград Център (ул. Тодор Александров 5)', 'Офис Благоевград Запад (бул. Св. Димитър Солунски 2)', 'Офис Благоевград Ринг (Бизнес парк)'],
        'Банско': ['Офис Банско (ул. Цар Симеон 2)'],
        'Белица': ['Офис Белица (ул. Георги Кавалджиев 1)'],
        'Гоце Делчев': ['Офис Гоце Делчев (ул. Ал. Стамболийски 14)'],
        'Петрич': ['Офис Петрич (бул. Цар Борис III 58)'],
        'Разлог': ['Офис Разлог (ул. Стефан Стамболов 1)'],
        'Сандански': ['Офис Сандански (бул. Свобода 4)'],
        'Симитли': ['Офис Симитли (ул. Христо Ботев 1)'],

        // ── Бургаска ──
        'Бургас': ['Офис Бургас Лазур (бул. Демокрация 45)', 'Офис Бургас Възраждане (ул. Крайнезаводска 16)', 'Офис Бургас Изгрев (бул. Мария Луиза 1)', 'Офис Бургас Меден Рудник (ж.к. Меден Рудник)'],
        'Айтос': ['Офис Айтос (ул. Патриарх Евтимий 24)'],
        'Карнобат': ['Офис Карнобат (бул. България 12)'],
        'Несебър': ['Офис Несебър (ул. Хан Крум 22)', 'Офис Слънчев бряг (до хотел Сол Несебър)'],
        'Поморие': ['Офис Поморие (ул. Сан Стефано 4)'],
        'Созопол': ['Офис Созопол (ул. Аполония 14)'],
        'Средец': ['Офис Средец (ул. Ян Хус 1)'],
        'Царево': ['Офис Царево (ул. Хан Аспарух 36)'],
        'Приморско': ['Офис Приморско (ул. Черноморска 8)'],

        // ── Варненска ──
        'Варна': ['Офис Варна Одесос (бул. Осми Приморски полк 43)', 'Офис Варна Владиславово (бул. Сливница 186)', 'Офис Варна Аспарухово (ул. Сп. Дончев 5)', 'Офис Варна Младост (бул. Цар Освободител 102)', 'Офис Варна Бриз (ул. Дунав 3)'],
        'Аврен': ['Офис Аврен (ул. Тринадесета 4)'],
        'Аксаково': ['Офис Аксаково (ул. Георги Петлешев 10)'],
        'Белослав': ['Офис Белослав (ул. Стефан Стамболов 26)'],
        'Девня': ['Офис Девня (ул. Христо Ботев 2)'],
        'Долни Чифлик': ['Офис Долни Чифлик (ул. Шипченски проход 1)'],
        'Провадия': ['Офис Провадия (бул. Цар Освободител 4)'],
        'Суворово': ['Офис Суворово (ул. Преслав 1)'],
        'Дългопол': ['Офис Дългопол (пл. Септември 1)'],
        'Вълчи дол': ['Офис Вълчи дол (ул. Витоша 2)'],
        'Игнатиево': ['Офис Игнатиево (ул. Осма 4)'],

        // ── Великотърновска ──
        'Велико Търново': ['Офис ВТ Център (ул. Стефан Стамболов 79)', 'Офис ВТ Акации (бул. България 22)', 'Офис ВТ Колю Фичето (ул. Никола Габровски 60)'],
        'Горна Оряховица': ['Офис Горна Оряховица (ул. Цар Калоян 14)'],
        'Елена': ['Офис Елена (ул. Иларион Макариополски 1)'],
        'Златарица': ['Офис Златарица (ул. Стара Планина 1)'],
        'Лясковец': ['Офис Лясковец (ул. Трети март 29)'],
        'Свищов': ['Офис Свищов (ул. Алеко Константинов 4)'],
        'Стражица': ['Офис Стражица (ул. Дончо Узунов 1)'],
        'Сухиндол': ['Офис Сухиндол (ул. Цар Симеон 1)'],

        // ── Видинска ──
        'Видин': ['Офис Видин Център (ул. Цар Симеон Велики 1)', 'Офис Видин Крум (ул. Хан Крум 62)'],
        'Белоградчик': ['Офис Белоградчик (ул. Добруджа 2)'],
        'Брегово': ['Офис Брегово (ул. Христо Ботев 1)'],
        'Грамада': ['Офис Грамада (ул. Добруджа 4)'],
        'Дунавци': ['Офис Дунавци (ул. Осма 2)'],
        'Кула': ['Офис Кула (ул. Вела Благоева 1)'],

        // ── Врачанска ──
        'Враца': ['Офис Враца Център (бул. Демокрация 2)', 'Офис Враца Металург (ул. Отец Паисий 3)'],
        'Бяла Слатина': ['Офис Бяла Слатина (ул. Европа 1)'],
        'Козлодуй': ['Офис Козлодуй (бул. Христо Ботев 22)'],
        'Мездра': ['Офис Мездра (бул. Христо Ботев 6)'],
        'Оряхово': ['Офис Оряхово (ул. Александър Стамболийски 2)'],
        'Роман': ['Офис Роман (ул. Захари Стоянов 1)'],

        // ── Габровска ──
        'Габрово': ['Офис Габрово Център (ул. Брянска 2)', 'Офис Габрово Апостолово (бул. Трети март 10)', 'Офис Габрово Индустриален (ул. Трети март 58)'],
        'Дряново': ['Офис Дряново (ул. Шипка 1)'],
        'Севлиево': ['Офис Севлиево (пл. Свобода 1)'],
        'Трявна': ['Офис Трявна (ул. Ангел Кънчев 35)'],

        // ── Добричка ──
        'Добрич': ['Офис Добрич Център (ул. Независимост 8)', 'Офис Добрич Изток (бул. 25-ти Септември 56)', 'Офис Добрич Речица (ул. Климент Охридски 2)'],
        'Балчик': ['Офис Балчик (ул. Черно море 14)'],
        'Генерал Тошево': ['Офис Ген. Тошево (бул. Гвардейски 1)'],
        'Каварна': ['Офис Каварна (ул. Добротица 6)'],
        'Крушари': ['Офис Крушари (ул. Девета 2)'],
        'Тервел': ['Офис Тервел (ул. България 1)'],
        'Шабла': ['Офис Шабла (ул. Равно поле 14)'],

        // ── Кърджалийска ──
        'Кърджали': ['Офис Кърджали Център (бул. Беломорски 12)', 'Офис Кърджали Прилепец (ул. Ален мак 1)'],
        'Ардино': ['Офис Ардино (ул. Бели Лом 1)'],
        'Джебел': ['Офис Джебел (ул. Еделвайс 2)'],
        'Кирково': ['Офис Кирково (ул. Дружба 4)'],
        'Крумовград': ['Офис Крумовград (бул. България 88)'],
        'Момчилград': ['Офис Момчилград (ул. 27-ми Февруари 4)'],

        // ── Кюстендилска ──
        'Кюстендил': ['Офис Кюстендил Център (пл. Велбъжд 1)', 'Офис Кюстендил Запад (ул. Гороцветна 4)'],
        'Бобошево': ['Офис Бобошево (ул. Трети март 2)'],
        'Бобов дол': ['Офис Бобов дол (ул. Еделвайс 1)'],
        'Дупница': ['Офис Дупница (ул. Свобода 3)', 'Офис Дупница Изток (бул. Станке Димитров 8)'],
        'Рила': ['Офис Рила (ул. Опълченска 1)'],
        'Сапарева баня': ['Офис Сапарева баня (ул. Паркова 8)'],
        'Трекляно': ['Офис Трекляно (ул. Родопи 1)'],

        // ── Ловешка ──
        'Ловеч': ['Офис Ловеч Център (ул. Ал. Батемберг 8)', 'Офис Ловеч Гозница (ул. Търговска 1)'],
        'Априлци': ['Офис Априлци (ул. Трети март 1)'],
        'Летница': ['Офис Летница (ул. Цар Иван Асен 1)'],
        'Луковит': ['Офис Луковит (ул. Христо Ботев 4)'],
        'Тетевен': ['Офис Тетевен (ул. Иван Вазов 12)'],
        'Троян': ['Офис Троян (ул. Любен Каравелов 2)', 'Офис Троян Мирово (ул. Мирово 8)'],
        'Угърчин': ['Офис Угърчин (ул. Цар Симеон 4)'],
        'Ябланица': ['Офис Ябланица (ул. Ком 1)'],

        // ── Монтанска ──
        'Монтана': ['Офис Монтана Център (ул. Александър Стамболийски 1)', 'Офис Монтана Кулата (бул. Трети март 12)'],
        'Берковица': ['Офис Берковица (пл. Йордан Радичков 1)'],
        'Бойчиновци': ['Офис Бойчиновци (ул. Втора 2)'],
        'Вършец': ['Офис Вършец (ул. Сирма Войвода 2)'],
        'Вълчедръм': ['Офис Вълчедръм (ул. Шеста 1)'],
        'Георги Дамяново': ['Офис Г. Дамяново (ул. Хр. Ботев 4)'],
        'Лом': ['Офис Лом (ул. Дунавска 2)'],
        'Медковец': ['Офис Медковец (ул. Първа 8)'],
        'Чипровци': ['Офис Чипровци (ул. Родопи 2)'],

        // ── Пазарджишка ──
        'Пазарджик': ['Офис Пазарджик Център (ул. Константин Величков 3)', 'Офис Пазарджик Запад (бул. Стефан Стамболов 4)'],
        'Батак': ['Офис Батак (ул. Освобождение 1)'],
        'Белово': ['Офис Белово (ул. Единство 4)'],
        'Брацигово': ['Офис Брацигово (ул. Христо Ботев 2)'],
        'Велинград': ['Офис Велинград (бул. Хан Аспарух 14)', 'Офис Велинград Каменица (ул. Каменица 4)'],
        'Лесичово': ['Офис Лесичово (ул. Пета 1)'],
        'Пещера': ['Офис Пещера (бул. България 2)'],
        'Ракитово': ['Офис Ракитово (ул. Иван Вазов 1)'],
        'Септември': ['Офис Септември (ул. Трета 12)'],
        'Стрелча': ['Офис Стрелча (пл. Освобождение 1)'],

        // ── Перникска ──
        'Перник': ['Офис Перник Център (бул. Св. Иван Рилски 14)', 'Офис Перник Тева (ул. Бигла 1)'],
        'Батановци': ['Офис Батановци (ул. Пета 4)'],
        'Брезник': ['Офис Брезник (ул. Г. Кирков 2)'],
        'Земен': ['Офис Земен (ул. Родопи 1)'],
        'Ковачевци': ['Офис Ковачевци (ул. Десета 2)'],
        'Радомир': ['Офис Радомир (ул. Евлоги Георгиев 1)'],
        'Трън': ['Офис Трън (ул. Г. Кирков 4)'],

        // ── Плевенска ──
        'Плевен': ['Офис Плевен Център (бул. Данаил Попов 2)', 'Офис Плевен Сторгозия (бул. Русия 6)', 'Офис Плевен Дружба (ж.к. Дружба 4)', 'Офис Плевен Кайлъка (ул. Сан Стефано 1)'],
        'Белене': ['Офис Белене (ул. България 4)'],
        'Гулянци': ['Офис Гулянци (ул. Освобождение 2)'],
        'Долна Митрополия': ['Офис Долна Митрополия (ул. Шеста 1)'],
        'Долни Дъбник': ['Офис Долни Дъбник (ул. Втора 4)'],
        'Искър': ['Офис Искър (ул. Пета 1)'],
        'Кнежа': ['Офис Кнежа (ул. Христо Ботев 8)'],
        'Левски': ['Офис Левски (ул. Цар Петър 2)'],
        'Никопол': ['Офис Никопол (ул. Г. Попов 4)'],
        'Пордим': ['Офис Пордим (ул. Трета 1)'],
        'Червен бряг': ['Офис Червен бряг (ул. Освобождение 4)'],

        // ── Пловдивска ──
        'Пловдив': ['Офис Пловдив Каменица (ул. Опълченска 34)', 'Офис Пловдив Тракия (бул. Пещерско шосе 56)', 'Офис Пловдив Без Граници (бул. Дунав 3)', 'Офис Пловдив Кършияка (ул. Атанас Тахов 18)', 'Офис Пловдив Централна гара (бул. Христо Ботев 46)', 'Офис Пловдив Западен парк (бул. Асenovgradsko 80)', 'Офис Пловдив Изток (ул. Янко Сакъзов 2)'],
        'Асеновград': ['Офис Асеновград (ул. Хан Кубрат 2)'],
        'Брезово': ['Офис Брезово (ул. Шипка 1)'],
        'Калояново': ['Офис Калояново (ул. Девета 4)'],
        'Карлово': ['Офис Карлово (бул. Освобождение 2)', 'Офис Карлово Сопот (ул. Иван Вазов 14)'],
        'Кричим': ['Офис Кричим (ул. Тракия 6)'],
        'Куклен': ['Офис Куклен (ул. Девета 1)'],
        'Лъки': ['Офис Лъки (ул. Родопи 2)'],
        'Марица': ['Офис Рогош (ул. Пета 2)', 'Офис Скутаре (ул. Шеста 4)'],
        'Пазарджик': ['Офис Пазарджик (ул. К. Величков 3)'],
        'Перущица': ['Офис Перущица (ул. Освобождение 1)'],
        'Раковски': ['Офис Раковски (ул. Г. Стойков 4)'],
        'Родопи': ['Офис Белащица (ул. Трета 2)', 'Офис Браниполе (ул. Пета 1)'],
        'Садово': ['Офис Садово (ул. Девета 2)'],
        'Стамболийски': ['Офис Стамболийски (ул. Г. Кирков 8)'],
        'Съединение': ['Офис Съединение (ул. Освобождение 4)'],
        'Хисаря': ['Офис Хисаря (ул. Освобождение 2)'],

        // ── Разградска ──
        'Разград': ['Офис Разград Център (бул. Априлско въстание 10)', 'Офис Разград Орел (ул. Св. Климент Охридски 8)'],
        'Завет': ['Офис Завет (ул. Трета 4)'],
        'Исперих': ['Офис Исперих (ул. Лудогорие 2)'],
        'Кубрат': ['Офис Кубрат (ул. Цар Освободител 4)'],
        'Лозница': ['Офис Лозница (ул. Четвърта 2)'],
        'Медовене': ['Офис Медовене (ул. Пета 1)'],
        'Самуил': ['Офис Самуил (ул. Шеста 4)'],
        'Цар Калоян': ['Офис Цар Калоян (ул. Трета 2)'],

        // ── Русенска ──
        'Русе': ['Офис Русе Centrum (бул. Цар Освободител 2)', 'Офис Русе Чародейка (бул. Тутракан 14)', 'Офис Русе Дружба (ул. Олимпийска 4)', 'Офис Русе Ялта (бул. Липник 112)', 'Офис Русе Студентски (ул. Студентска 8)'],
        'Бяла (Русе)': ['Офис Бяла (ул. Свобода 4)'],
        'Борово': ['Офис Борово (ул. Трета 2)'],
        'Ветово': ['Офис Ветово (ул. Г. Димитров 1)'],
        'Глоджево': ['Офис Глоджево (ул. Пета 4)'],
        'Две могили': ['Офис Две могили (ул. Г. Кирков 1)'],
        'Иваново': ['Офис Иваново (ул. Трета 8)'],
        'Мартен': ['Офис Мартен (ул. Шеста 2)'],
        'Сливо поле': ['Офис Сливо поле (ул. Девета 1)'],
        'Ценово': ['Офис Ценово (ул. Четвърта 4)'],

        // ── Силистренска ──
        'Силистра': ['Офис Силистра Център (ул. Добруджа 4)', 'Офис Силистра Изток (бул. Македония 14)'],
        'Алфатар': ['Офис Алфатар (ул. Пета 1)'],
        'Главиница': ['Офис Главиница (ул. Г. Кирков 2)'],
        'Дулово': ['Офис Дулово (ул. Шеста 4)'],
        'Кайнарджа': ['Офис Кайнарджа (ул. Трета 1)'],
        'Ситово': ['Офис Ситово (ул. Втора 2)'],
        'Тутракан': ['Офис Тутракан (ул. Силистра 4)'],

        // ── Сливенска ──
        'Сливен': ['Офис Сливен Център (бул. Хаджи Димитър 14)', 'Офис Сливен Стоян Заимов (ул. Бр. Миладинови 2)', 'Офис Сливен Клуцохор (бул. Трети март 44)'],
        'Кермен': ['Офис Кермен (ул. Шеста 2)'],
        'Котел': ['Офис Котел (ул. Изворска 4)'],
        'Нова Загора': ['Офис Нова Загора (ул. Цар Иван Асен 2)'],
        'Твърдица': ['Офис Твърдица (ул. Г. Кирков 1)'],

        // ── Смолянска ──
        'Смолян': ['Офис Смолян Център (бул. Цар Освободител 2)', 'Офис Смолян Устово (ул. Хаджи Димитър 4)'],
        'Баните': ['Офис Баните (ул. Трета 2)'],
        'Борино': ['Офис Борино (ул. Пета 1)'],
        'Девин': ['Офис Девин (ул. Освобождение 8)'],
        'Доспат': ['Офис Доспат (ул. Шеста 4)'],
        'Златоград': ['Офис Златоград (ул. Стефан Стамболов 2)'],
        'Мадан': ['Офис Мадан (бул. България 4)'],
        'Неделино': ['Офис Неделино (ул. Г. Димитров 2)'],
        'Рудозем': ['Офис Рудозем (ул. Трета 1)'],
        'Чепеларе': ['Офис Чепеларе (ул. Освобождение 6)'],

        // ── Софийска (без столица) ──
        'Ботевград': ['Офис Ботевград (ул. Г. Кирков 4)'],
        'Брезник': ['Офис Брезник (ул. Г. Кирков 2)'],
        'Годеч': ['Офис Годеч (пл. Свобода 1)'],
        'Горна Малина': ['Офис Горна Малина (ул. Пета 2)'],
        'Долна баня': ['Офис Долна баня (ул. Трета 1)'],
        'Елин Пелин': ['Офис Елин Пелин (ул. Г. Кирков 8)'],
        'Етрополе': ['Офис Етрополе (ул. Александър Стамболийски 4)'],
        'Ихтиман': ['Офис Ихтиман (ул. Освобождение 2)'],
        'Копривщица': ['Офис Копривщица (ул. Хаджи Ненчо Палавеев 2)'],
        'Костенец': ['Офис Костенец (ул. Девета 4)'],
        'Костинброд': ['Офис Костинброд (бул. Европа 1)', 'Офис Костинброд Индустриален (ул. Четвърта 8)'],
        'Мирково': ['Офис Мирково (ул. Пета 2)'],
        'Пирдоп': ['Офис Пирдоп (ул. Г. Кирков 1)'],
        'Правец': ['Офис Правец (ул. Баховска 4)'],
        'Самоков': ['Офис Самоков (ул. Македония 4)', 'Офис Боровец (хотелски комплекс)'],
        'Своге': ['Офис Своге (ул. Александър Стамболийски 2)'],
        'Сливница': ['Офис Сливница (ул. Цар Освободител 4)'],
        'Чавдар': ['Офис Чавдар (ул. Шеста 1)'],

        // ── Столична ──
        'София — Карпузица/НДК': ['Офис НДК 1 (ул. Граф Игнатиев 12)', 'Офис НДК 2 (ул. Академик Иван Гешов 10)'],
        'София — Студентски град': ['Офис Студентски град (бул. Климент Охридски 8)', 'Офис Младост 1 (ул. Проф. Иван Шишманов 4)'],
        'София — Люлин': ['Офис Люлин 1 (бул. Добринова скала 2)', 'Офис Люлин 6 (ул. Обиколна 4)', 'Офис Люлин 10 (ул. Тинтява 14)'],
        'София — Надежда/Лозенец': ['Офис Надежда 3 (ул. Лозен 2)', 'Офис Лозенец (бул. Черни връх 22)'],
        'София — Дружба/Сухата Река': ['Офис Дружба 1 (ул. Искър 8)', 'Офис Дружба 2 (бул. Ас. Халачев 4)'],
        'София — Витоша/Овча Купел': ['Офис Овча Купел 1 (ул. Проф. Г. Павлов 1)', 'Офис Овча Купел 2 (ул. Монтевидео 21)'],
        'София — Сердика/Илинден': ['Офис Сердика (ул. Пиротска 2)', 'Офис Илинден (бул. Константин Величков 2)'],
        'София — Искър/Гео Милев': ['Офис Гео Милев (ул. Асен Разцветников 2)', 'Офис Искър (ул. Ботевградско шосе 261)'],
        'София — Слатина/Изгрев': ['Офис Слатина (ул. Слатинска 12)', 'Офис Изгрев (ул. Фредерик Жолио-Кюри 4)'],
        'София — Подуяне/Борово': ['Офис Подуяне (ул. Тунджа 6)', 'Офис Борово (ул. Пловдивско поле 4)'],

        // ── Старозагорска ──
        'Стара Загора': ['Офис СЗ Център (бул. Цар Симеон Велики 74)', 'Офис СЗ Зора (ул. Армейска 2)', 'Офис СЗ Три чучура (бул. Никола Петков 54)', 'Офис СЗ Железник (ул. Хемус 4)'],
        'Братя Даскалови': ['Офис Братя Даскалови (ул. Четвърта 2)'],
        'Гурково': ['Офис Гурково (ул. Трета 1)'],
        'Гълъбово': ['Офис Гълъбово (ул. Г. Кирков 4)'],
        'Казанлък': ['Офис Казанлък Розово (ул. Стефан Стамболов 2)', 'Офис Казанлък Север (бул. Розова Долина 8)'],
        'Мъглиж': ['Офис Мъглиж (ул. Трета 4)'],
        'Николаево': ['Офис Николаево (ул. Девета 2)'],
        'Опан': ['Офис Опан (ул. Пета 1)'],
        'Павел баня': ['Офис Павел баня (ул. Освобождение 4)'],
        'Радневе': ['Офис Раднево (ул. Г. Кирков 2)'],
        'Чирпан': ['Офис Чирпан (ул. Хан Аспарух 4)'],
        'Шипка': ['Офис Шипка (ул. Освобождение 2)'],

        // ── Търговищка ──
        'Търговище': ['Офис Търговище Център (пл. Свобода 4)', 'Офис Търговище Запад (бул. Сюрен 8)'],
        'Антоново': ['Офис Антоново (ул. Трета 2)'],
        'Омуртаг': ['Офис Омуртаг (ул. Г. Кирков 1)'],
        'Опака': ['Офис Опака (ул. Девета 4)'],
        'Попово': ['Офис Попово (ул. Александър Стамболийски 4)'],

        // ── Хасковска ──
        'Хасково': ['Офис Хасково Център (бул. Съединение 12)', 'Офис Хасково Орфей (ул. Цар Освободител 4)', 'Офис Хасково Кенана (бул. Г. Кирков 8)'],
        'Димитровград': ['Офис Димитровград (бул. Ленин 4)', 'Офис Димитровград Марица (ул. Ст. Стамболов 2)'],
        'Ивайловград': ['Офис Ивайловград (ул. България 2)'],
        'Любимец': ['Офис Любимец (ул. Четвърта 4)'],
        'Маджарово': ['Офис Маджарово (ул. Пета 1)'],
        'Минерални бани': ['Офис Минерални бани (ул. Шеста 2)'],
        'Свиленград': ['Офис Свиленград (ул. Цар Освободител 4)'],
        'Симеоновград': ['Офис Симеоновград (ул. Трета 2)'],
        'Стамболово': ['Офис Стамболово (ул. Девета 1)'],
        'Тополовград': ['Офис Тополовград (ул. Г. Кирков 4)'],

        // ── Шуменска ──
        'Шумен': ['Офис Шумен Бяла гора (ул. Цар Освободител 4)', 'Офис Шумен Тракия (бул. Велики Преслав 14)', 'Офис Шумен Акация (ул. Ришки проход 2)'],
        'Велики Преслав': ['Офис В. Преслав (ул. Борис Спиров 1)'],
        'Венец': ['Офис Венец (ул. Трета 4)'],
        'Върбица': ['Офис Върбица (ул. Пета 2)'],
        'Каолиново': ['Офис Каолиново (ул. Четвърта 1)'],
        'Каспичан': ['Офис Каспичан (ул. Девета 4)'],
        'Никола Козлево': ['Офис Н. Козлево (ул. Шеста 2)'],
        'Нови пазар': ['Офис Нови пазар (ул. Цар Освободител 8)'],
        'Хитрино': ['Офис Хитрино (ул. Трета 2)'],

        // ── Ямболска ──
        'Ямбол': ['Офис Ямбол Център (бул. Граф Игнатиев 2)', 'Офис Ямбол Каргон (ул. Крали Марко 14)', 'Офис Ямбол Боровец (бул. Освобождение 4)'],
        'Болярово': ['Офис Болярово (ул. Г. Кирков 2)'],
        'Елхово': ['Офис Елхово (ул. Търговска 4)'],
        'Стралджа': ['Офис Стралджа (ул. Освобождение 2)'],
        'Тунджа': ['Офис Тунджа (ул. Пета 4)']
    },

    speedy: {
        // ── Благоевградска ──
        'Благоевград': ['Офис Благоевград 1 (ул. Тодор Александров 1)', 'Офис Благоевград Струмяни (бул. Свобода 22)', 'Офис Благоевград Запад (ул. Христо Ботев 4)'],
        'Банско': ['Офис Банско (ул. Александра 4)'],
        'Гоце Делчев': ['Офис Гоце Делчев (бул. Г. Кирков 8)'],
        'Петрич': ['Офис Петрич (ул. Г. Димитров 4)'],
        'Разлог': ['Офис Разлог (ул. Г. Кирков 2)'],
        'Сандански': ['Офис Сандански (бул. Г. Кирков 6)'],

        // ── Бургаска ──
        'Бургас': ['Офис Бургас Лазур (бул. Демокрация 26)', 'Офис Бургас Зорница (ул. Стефан Стамболов 4)', 'Офис Бургас Победа (бул. Янко Комитов 22)', 'Офис Бургас Меден Рудник (ж.к. МР бл. 21)'],
        'Айтос': ['Офис Айтос (бул. Трети март 4)'],
        'Карнобат': ['Офис Карнобат (ул. Изгрев 2)'],
        'Несебър': ['Офис Несебър (ул. Любен Каравелов 4)', 'Офис Слънчев бряг (хотел Свежест)'],
        'Поморие': ['Офис Поморие (ул. Г. Кирков 2)'],
        'Созопол': ['Офис Созопол (ул. Виделина 4)'],
        'Царево': ['Офис Царево (ул. Витоша 2)'],

        // ── Варненска ──
        'Варна': ['Офис Варна Грей (бул. Приморски 24)', 'Офис Варна Изгрев (ул. Загоре 8)', 'Офис Варна Чаталджа (бул. Сливница 44)', 'Офис Варна Трошево (ул. Г. Кирков 14)', 'Офис Варна Галата (ул. Дунав 12)'],
        'Аксаково': ['Офис Аксаково (ул. Освобождение 4)'],
        'Белослав': ['Офис Белослав (ул. Г. Кирков 2)'],
        'Девня': ['Офис Девня (ул. Г. Кирков 4)'],
        'Провадия': ['Офис Провадия (бул. Г. Кирков 6)'],

        // ── Великотърновска ──
        'Велико Търново': ['Офис ВТ Янтра (ул. Г. Измирлиев 6)', 'Офис ВТ Света гора (бул. Никола Габровски 58)', 'Офис ВТ Чолаковци (ул. Слав. Соколов 4)'],
        'Горна Оряховица': ['Офис Г. Оряховица (ул. Патриарх Евтимий 2)'],
        'Лясковец': ['Офис Лясковец (ул. Г. Кирков 4)'],
        'Свищов': ['Офис Свищов (ул. Г. Кирков 2)'],

        // ── Видинска ──
        'Видин': ['Офис Видин Бонония (бул. Бдин 4)', 'Офис Видин Мито (ул. Вела Благоева 6)'],
        'Белоградчик': ['Офис Белоградчик (ул. Г. Кирков 2)'],

        // ── Врачанска ──
        'Враца': ['Офис Враца Алеята (ул. Никола Вапцаров 2)', 'Офис Враца Хармония (бул. Г. Кирков 4)'],
        'Козлодуй': ['Офис Козлодуй (ул. Г. Кирков 4)'],
        'Мездра': ['Офис Мездра (ул. Г. Кирков 2)'],

        // ── Габровска ──
        'Габрово': ['Офис Габрово Мариенбад (ул. Г. Кирков 2)', 'Офис Габрово Карамфила (бул. Трети март 8)'],
        'Севлиево': ['Офис Севлиево (ул. Г. Кирков 4)'],
        'Трявна': ['Офис Трявна (ул. Г. Кирков 2)'],

        // ── Добричка ──
        'Добрич': ['Офис Добрич 1 (бул. Трети март 4)', 'Офис Добрич Дружба (ул. Паркова 8)', 'Офис Добрич Балик (ул. Г. Кирков 14)'],
        'Балчик': ['Офис Балчик (ул. Г. Кирков 2)'],
        'Генерал Тошево': ['Офис Г. Тошево (ул. Г. Кирков 4)'],
        'Каварна': ['Офис Каварна (ул. Г. Кирков 6)'],

        // ── Кюстендилска ──
        'Кюстендил': ['Офис Кюстендил 1 (ул. Демокрация 4)', 'Офис Кюстендил Хисар (бул. Г. Кирков 12)'],
        'Дупница': ['Офис Дупница (ул. Г. Кирков 4)', 'Офис Дупница Запад (бул. Г. Кирков 14)'],
        'Сапарева баня': ['Офис Сапарева баня (ул. Паркова 4)'],

        // ── Ловешка ──
        'Ловеч': ['Офис Ловеч Панорама (ул. Г. Кирков 2)', 'Офис Ловеч Здравец (бул. Г. Кирков 8)'],
        'Луковит': ['Офис Луковит (ул. Г. Кирков 4)'],
        'Тетевен': ['Офис Тетевен (ул. Г. Кирков 2)'],
        'Троян': ['Офис Троян (бул. Г. Кирков 4)'],

        // ── Монтанска ──
        'Монтана': ['Офис Монтана 1 (бул. Трети март 2)', 'Офис Монтана Огоста (ул. Г. Кирков 6)'],
        'Берковица': ['Офис Берковица (ул. Г. Кирков 4)'],
        'Лом': ['Офис Лом (ул. Дунавска 6)'],

        // ── Пазарджишка ──
        'Пазарджик': ['Офис Пазарджик Пано (ул. Г. Кирков 4)', 'Офис Пазарджик Луксозен (бул. България 14)'],
        'Велинград': ['Офис Велинград (ул. Г. Кирков 4)'],
        'Пещера': ['Офис Пещера (ул. Г. Кирков 2)'],

        // ── Перникска ──
        'Перник': ['Офис Перник Мошино (ул. Г. Кирков 2)', 'Офис Перник Тева (бул. Цар Самуил 4)'],
        'Радомир': ['Офис Радомир (ул. Г. Кирков 4)'],

        // ── Плевенска ──
        'Плевен': ['Офис Плевен Мир (ул. Г. Кирков 4)', 'Офис Плевен Тодор Каблешков (бул. Г. Кирков 8)', 'Офис Плевен Юг (ул. Христо Ботев 2)', 'Офис Плевен Бяло море (бул. Сливница 14)'],
        'Кнежа': ['Офис Кнежа (ул. Г. Кирков 2)'],
        'Левски': ['Офис Левски (ул. Г. Кирков 4)'],
        'Червен бряг': ['Офис Червен бряг (ул. Г. Кирков 2)'],

        // ── Пловдивска ──
        'Пловдив': ['Офис Пловдив Гагарин (бул. Гагарин 2)', 'Офис Пловдив Столипиново (ул. Сан Стефано 44)', 'Офис Пловдив Захари Зограф (ул. Захари Зограф 44)', 'Офис Пловдив Марица (бул. Марица 144)', 'Офис Пловдив Южен (ул. Г. Кирков 8)', 'Офис Пловдив Северен (бул. Никола Вапцаров 14)'],
        'Асеновград': ['Офис Асеновград (бул. Г. Кирков 4)'],
        'Карлово': ['Офис Карлово (ул. Г. Кирков 2)'],
        'Раковски': ['Офис Раковски (ул. Г. Кирков 4)'],
        'Стамболийски': ['Офис Стамболийски (ул. Г. Кирков 2)'],
        'Хисаря': ['Офис Хисаря (ул. Г. Кирков 4)'],

        // ── Русенска ──
        'Русе': ['Офис Русе Братя Миладинови (ул. Бр. Миладинови 4)', 'Офис Русе Йованово (бул. Г. Кирков 8)', 'Офис Русе Здравец (ул. Здравец 22)', 'Офис Русе Централна гара (пл. Гара 1)'],
        'Бяла (Русе)': ['Офис Бяла (ул. Г. Кирков 2)'],
        'Две могили': ['Офис Две могили (ул. Г. Кирков 4)'],

        // ── Силистренска ──
        'Силистра': ['Офис Силистра 1 (бул. Г. Кирков 2)', 'Офис Силистра Калипетрово (ул. Г. Кирков 14)'],
        'Дулово': ['Офис Дулово (ул. Г. Кирков 4)'],
        'Тутракан': ['Офис Тутракан (ул. Г. Кирков 2)'],

        // ── Сливенска ──
        'Сливен': ['Офис Сливен Лозенец (ул. Дойранска епопея 4)', 'Офис Сливен Младост (ул. Г. Кирков 14)', 'Офис Сливен Рингпарк (бул. Г. Кирков 22)'],
        'Котел': ['Офис Котел (ул. Г. Кирков 2)'],
        'Нова Загора': ['Офис Нова Загора (ул. Г. Кирков 4)'],
        'Твърдица': ['Офис Твърдица (ул. Г. Кирков 2)'],

        // ── Смолянска ──
        'Смолян': ['Офис Смолян 1 (бул. България 2)', 'Офис Смолян 2 (ул. Г. Кирков 14)'],
        'Девин': ['Офис Девин (ул. Г. Кирков 4)'],
        'Златоград': ['Офис Златоград (ул. Г. Кирков 2)'],
        'Мадан': ['Офис Мадан (ул. Г. Кирков 4)'],
        'Рудозем': ['Офис Рудозем (ул. Г. Кирков 2)'],
        'Чепеларе': ['Офис Чепеларе (ул. Г. Кирков 4)'],

        // ── Софийска ──
        'Ботевград': ['Офис Ботевград (ул. Г. Кирков 4)'],
        'Елин Пелин': ['Офис Елин Пелин (ул. Г. Кирков 2)'],
        'Ихтиман': ['Офис Ихтиман (ул. Г. Кирков 4)'],
        'Костенец': ['Офис Костенец (ул. Г. Кирков 2)'],
        'Костинброд': ['Офис Костинброд (бул. Г. Кирков 4)'],
        'Правец': ['Офис Правец (ул. Г. Кирков 2)'],
        'Самоков': ['Офис Самоков 1 (бул. Г. Кирков 4)', 'Офис Самоков 2 (ул. Г. Кирков 8)'],
        'Своге': ['Офис Своге (ул. Г. Кирков 2)'],
        'Сливница': ['Офис Сливница (ул. Г. Кирков 4)'],

        // ── Столична ──
        'София — НДК/Карпузица': ['Офис НДК (бул. Цар Освободител 1)', 'Офис Карпузица (ул. Рила 6)'],
        'София — Красна поляна': ['Офис Красна поляна (бул. Г. Кирков 4)', 'Офис Илиянци (ул. Илиянци 8)'],
        'София — Люлин': ['Офис Люлин 2 (бул. Г. Кирков 14)', 'Офис Люлин 7 (ул. Г. Кирков 22)'],
        'София — Надежда': ['Офис Надежда 1 (ул. Г. Кирков 4)', 'Офис Надежда Модерно предградие (ул. Г. Кирков 8)'],
        'София — Дружба': ['Офис Дружба 2 (бул. Ал. Малинов 4)', 'Офис Дружба Искър (ул. Г. Кирков 12)'],
        'София — Витоша/Бояна': ['Офис Бояна (ул. Г. Кирков 2)', 'Офис Витоша (бул. Г. Кирков 14)'],
        'София — Обеля': ['Офис Обеля 1 (ул. Г. Кирков 6)', 'Офис Обеля 2 (ул. Г. Кирков 8)'],
        'София — Лозенец/Иван Вазов': ['Офис Лозенец (бул. Г. Кирков 4)', 'Офис Иван Вазов (ул. Г. Кирков 8)'],
        'София — Младост': ['Офис Младост 1А (ул. Г. Кирков 4)', 'Офис Младост 3 (бул. Г. Кирков 22)', 'Офис Младост 4 (бул. Г. Кирков 44)'],
        'София — Студентски': ['Офис Студентски (бул. Г. Кирков 8)', 'Офис АУБ (ул. Г. Кирков 14)'],

        // ── Старозагорска ──
        'Стара Загора': ['Офис СЗ Голиш (бул. Цар Симеон Велики 100)', 'Офис СЗ Аязмото (ул. Г. Кирков 4)', 'Офис СЗ Загоре (бул. Г. Кирков 14)'],
        'Казанлък': ['Офис Казанлък (ул. Г. Кирков 4)', 'Офис Казанлък Петко войвода (бул. Г. Кирков 8)'],
        'Гълъбово': ['Офис Гълъбово (ул. Г. Кирков 2)'],
        'Раднево': ['Офис Раднево (ул. Г. Кирков 4)'],
        'Чирпан': ['Офис Чирпан (ул. Г. Кирков 2)'],

        // ── Търговищка ──
        'Търговище': ['Офис Търговище 1 (бул. Сюрен 4)', 'Офис Търговище 2 (ул. Г. Кирков 8)'],
        'Омуртаг': ['Офис Омуртаг (ул. Г. Кирков 4)'],
        'Попово': ['Офис Попово (ул. Г. Кирков 2)'],

        // ── Хасковска ──
        'Хасково': ['Офис Хасково Орфей (бул. Г. Кирков 4)', 'Офис Хасково Воеводско (ул. Г. Кирков 14)', 'Офис Хасково Кенана (бул. Г. Кирков 22)'],
        'Димитровград': ['Офис Димитровград (бул. Г. Кирков 4)', 'Офис Димитровград Марица (ул. Г. Кирков 8)'],
        'Свиленград': ['Офис Свиленград (ул. Г. Кирков 4)'],
        'Симеоновград': ['Офис Симеоновград (ул. Г. Кирков 2)'],
        'Тополовград': ['Офис Тополовград (ул. Г. Кирков 4)'],

        // ── Шуменска ──
        'Шумен': ['Офис Шумен 1 (бул. Симеон Велики 4)', 'Офис Шумен Боян Войвода (ул. Г. Кирков 8)', 'Офис Шумен Мадара (бул. Г. Кирков 14)'],
        'Нови пазар': ['Офис Нови пазар (ул. Г. Кирков 4)'],
        'Велики Преслав': ['Офис В. Преслав (ул. Г. Кирков 2)'],

        // ── Ямболска ──
        'Ямбол': ['Офис Ямбол Могилата (бул. Г. Кирков 4)', 'Офис Ямбол Граф Игнатиев (ул. Г. Кирков 14)'],
        'Елхово': ['Офис Елхово (ул. Г. Кирков 2)'],
        'Стралджа': ['Офис Стралджа (ул. Г. Кирков 4)']
    }
};

let currentCourier = 'econt';

function selectCourier(courier) {
    currentCourier = courier;
    document.getElementById('ctab-econt').classList.toggle('active', courier === 'econt');
    document.getElementById('ctab-speedy').classList.toggle('active', courier === 'speedy');
    
    const cityEl = document.getElementById('deliveryCity');
    const officeEl = document.getElementById('deliveryOffice');
    
    // Populate cities
    const cities = Object.keys(OFFICES[courier]).sort();
    cityEl.innerHTML = '<option value="">— Избери населено място —</option>';
    cities.forEach(city => {
        const opt = document.createElement('option');
        opt.value = city; opt.textContent = city;
        cityEl.appendChild(opt);
    });
    officeEl.innerHTML = '<option value="">— Първо избери град —</option>';
    officeEl.disabled = true;
}

document.addEventListener('DOMContentLoaded', () => {
    // Set counts for couriers
    const econtCities = Object.keys(OFFICES.econt).length;
    const speedyCities = Object.keys(OFFICES.speedy).length;
    const ecEl = document.getElementById('econt-count');
    const spEl = document.getElementById('speedy-count');
    if(ecEl) ecEl.textContent = `(${econtCities} града)`;
    if(spEl) spEl.textContent = `(${speedyCities} града)`;
    
    selectCourier('econt');
});

function updateOffices() {
    const cityEl = document.getElementById('deliveryCity');
    const officeEl = document.getElementById('deliveryOffice');
    const city = cityEl.value;
    
    if (!city) { officeEl.disabled = true; officeEl.innerHTML = '<option value="">— Първо избери град —</option>'; return; }
    
    const offices = OFFICES[currentCourier][city] || [];
    officeEl.innerHTML = '<option value="">— Избери офис —</option>';
    offices.forEach(o => {
        const opt = document.createElement('option');
        opt.value = o; opt.textContent = o;
        officeEl.appendChild(opt);
    });
    officeEl.disabled = false;
}


// ── STAR RATING PICKER ─────────────────────────────────────────
const stars = document.querySelectorAll('#starPicker .star');
stars.forEach(star => {
    star.addEventListener('mouseover', () => {
        const val = +star.dataset.v;
        stars.forEach(s => s.classList.toggle('hovered', +s.dataset.v <= val));
    });
    star.addEventListener('mouseout', () => stars.forEach(s => s.classList.remove('hovered')));
    star.addEventListener('click', () => {
        const val = star.dataset.v;
        document.getElementById('rv-rating').value = val;
        stars.forEach(s => s.classList.toggle('active', +s.dataset.v <= +val));
    });
});

// ── REVIEW FORM ──────────────────────────────────────────────
document.getElementById('reviewForm').addEventListener('submit', async e => {
    e.preventDefault();
    const name    = document.getElementById('rv-name').value.trim();
    const comment = document.getElementById('rv-comment').value.trim();
    const rating  = document.getElementById('rv-rating').value;

    if (!name || !comment || !rating) {
        document.getElementById('rv-error').style.display = 'block';
        document.getElementById('rv-success').style.display = 'none';
        return;
    }

    const rvBtn = document.getElementById('rvSubmitBtn');
    rvBtn.disabled = true;
    rvBtn.querySelector('span').textContent = 'Изпращане...';

    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/reviews`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ author: name, comment, rating: +rating, approved: false, created_at: new Date().toISOString() })
        });
        if (!res.ok) throw new Error();
        
        document.getElementById('rv-success').style.display = 'block';
        document.getElementById('rv-error').style.display = 'none';
        document.getElementById('reviewForm').reset();
        stars.forEach(s => s.classList.remove('active'));
        document.getElementById('rv-rating').value = '';
    } catch {
        document.getElementById('rv-error').style.display = 'block';
        document.getElementById('rv-error').textContent = '⚠️ Грешка. Опитай отново.';
    }

    rvBtn.disabled = false;
    rvBtn.querySelector('span').textContent = 'Изпрати отзива';
});

// ── FETCH REVIEWS ────────────────────────────────────────────
async function loadReviews() {
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/reviews?approved=eq.true&order=created_at.desc&limit=6`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        if (!res.ok) return;
        const reviews = await res.json();
        if (reviews.length === 0) return;

        const row = document.querySelector('.reviews-row');
        // Clear static if we have dynamic
        row.innerHTML = '';
        
        reviews.forEach(rv => {
            const starsHTML = '★'.repeat(rv.rating) + '☆'.repeat(5 - rv.rating);
            const avatar = rv.author.charAt(0).toUpperCase();
            
            // Format author name (e.g. "Ivan P, Varna" -> just use the string)
            const authorText = rv.author.includes(',') ? 
                `<strong>${rv.author.split(',')[0]}</strong><span>${rv.author.split(',')[1]}</span>` : 
                `<strong>${rv.author}</strong>`;

            const card = document.createElement('div');
            card.className = 'review reveal visible';
            card.innerHTML = `
                <div class="rv-stars">${starsHTML}</div>
                <p>„${rv.comment}“</p>
                <div class="rv-author"><div class="rv-av">${avatar}</div><div>${authorText}</div></div>
            `;
            row.appendChild(card);
        });
    } catch(err) {
        console.error('Error fetching reviews:', err);
    }
}

document.addEventListener('DOMContentLoaded', loadReviews);

