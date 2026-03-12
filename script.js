/* ═══════════════════════════════════════
   CANVAS BACKGROUND — Animated circuit nodes
═══════════════════════════════════════ */
(function () {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, nodes = [], connections = [];

    function resize() {
        W = canvas.width = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
        build();
    }

    function build() {
        nodes = [];
        connections = [];
        const spacing = 78;
        const cols = Math.ceil(W / spacing) + 2;
        const rows = Math.ceil(H / spacing) + 2;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (Math.random() < 0.28) {
                    nodes.push({
                        x: c * spacing + (Math.random() - 0.5) * 18,
                        y: r * spacing + (Math.random() - 0.5) * 18,
                        phase: Math.random() * Math.PI * 2,
                        speed: 0.008 + Math.random() * 0.018,
                        r: 1.4 + Math.random() * 1.8
                    });
                }
            }
        }

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[j].x - nodes[i].x;
                const dy = nodes[j].y - nodes[i].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 110) connections.push({ i, j, dist });
            }
        }
    }

    function isLight() {
        return document.body.classList.contains('light');
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        const rgb = isLight() ? '0,120,95' : '0,222,180';

        for (const c of connections) {
            const a = (1 - c.dist / 110) * (isLight() ? 0.07 : 0.11);
            ctx.beginPath();
            ctx.moveTo(nodes[c.i].x, nodes[c.i].y);
            ctx.lineTo(nodes[c.j].x, nodes[c.j].y);
            ctx.strokeStyle = `rgba(${rgb},${a})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
        }

        for (const n of nodes) {
            n.phase += n.speed;
            const glow = 0.25 + 0.75 * Math.abs(Math.sin(n.phase));
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb},${glow * (isLight() ? 0.3 : 0.55)})`;
            ctx.fill();
        }

        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(draw);
})();


/* ═══════════════════════════════════════
   THEME TOGGLE
═══════════════════════════════════════ */
document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('light');
});


/* ═══════════════════════════════════════
   SCROLL REVEAL — IntersectionObserver
═══════════════════════════════════════ */
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal, .reveal-right').forEach(el => revealObs.observe(el));


/* ═══════════════════════════════════════
   SKILL BAR ANIMATION
═══════════════════════════════════════ */
const barObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('.bar-fill').forEach(bar => {
                bar.style.width = bar.dataset.w + '%';
            });
            barObs.unobserve(e.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-card').forEach(el => barObs.observe(el));


/* ═══════════════════════════════════════
   PROJECT DETAIL TOGGLE
═══════════════════════════════════════ */
document.querySelectorAll('.proj-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        const detail = document.getElementById(btn.dataset.target);
        const isOpen = detail.classList.contains('open');

        // Close all open panels first
        document.querySelectorAll('.proj-detail.open').forEach(d => d.classList.remove('open'));
        document.querySelectorAll('.proj-toggle').forEach(b => b.textContent = 'View Details ↓');

        // Open the clicked one if it was closed
        if (!isOpen) {
            detail.classList.add('open');
            btn.textContent = 'Hide Details ↑';
        }
    });
});


/* ═══════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════ */
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const success = document.getElementById('formSuccess');
    success.style.display = 'block';
    e.target.reset();
    setTimeout(() => { success.style.display = 'none'; }, 5000);
});


/* ═══════════════════════════════════════
   DYNAMIC YEAR
═══════════════════════════════════════ */
document.getElementById('year').textContent = new Date().getFullYear();


/* ═══════════════════════════════════════
   SMOOTH SCROLL — nav links
═══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});