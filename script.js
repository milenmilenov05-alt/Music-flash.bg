// ════════════════════════════════════════
// Music Flash — Website JS (v9.0)
// ════════════════════════════════════════

const SUPABASE_URL = 'https://iopwawtryvvisnynxovb.supabase.co';
const SUPABASE_ANON_KEY = ''; // TODO: add anon key

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

        // Hide/show flash drive quantity for digital package
        if (r.value === 'digital') {
            qtyGroup.style.display = 'none';
        } else {
            qtyGroup.style.display = '';
        }
    });
});

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
    const isDigital = pkg === 'digital';
    const quantity  = isDigital ? 'N/A (дигитален)' : (document.getElementById('quantity')?.value || '1');
    const notes    = document.getElementById('notes').value.trim();
    const genres   = [...document.querySelectorAll('#genrePick input:checked')].map(c => c.value).join(', ');

    if (!name || !phone || !pkg) {
        showError('Моля, попълни задължителните полета.');
        return;
    }

    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Изпращане...';

    const order = { name, phone, email: email || null, quantity, package: pkg, genres: genres || 'Не е избрано', notes: notes || null, status: 'new', created_at: new Date().toISOString() };

    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(order)
        });
        if (!res.ok) throw new Error();

        document.getElementById('form-success').style.display = 'block';
        document.getElementById('form-error').style.display = 'none';
        document.getElementById('orderForm').reset();
        // Reset pkg picker visually
        pkgOpts.forEach(o => o.classList.remove('selected'));
        document.querySelector('.pkg-opt:nth-child(3)')?.classList.add('selected');
        qtyGroup.style.display = '';
    } catch {
        showError('Временен проблем. Обади се директно или опитай отново.');
    }

    btn.disabled = false;
    btn.querySelector('span').textContent = 'Изпрати поръчката';
});

function showError(msg) {
    document.getElementById('errMsg').textContent = msg;
    document.getElementById('form-error').style.display = 'block';
    document.getElementById('form-success').style.display = 'none';
}
