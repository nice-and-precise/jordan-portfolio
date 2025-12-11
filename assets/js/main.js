import { portfolioItems } from './data.js';
import { blogPosts } from './blog-data.js';

// DOM Elements
const bentoContainer = document.getElementById('bento-container');

// Render Portfolio
const renderPortfolio = () => {
    try {
        if (!bentoContainer) return;

        // 1. Portfolio Items
        const portfolioHtml = portfolioItems.map((item, index) => `
            <a href="${item.url}" class="bento-card ${item.size} reveal-on-scroll" style="transition-delay: ${index * 50}ms" target="_blank" rel="noopener noreferrer">
                ${item.image ? `<div class="card-bg" style="background-image: url('${item.image}')"></div>` : ''}
                <div class="card-overlay"></div>
                <div class="bento-tag">${item.role}</div>
                <div class="card-content">
                    <div style="display:flex; justify-content:space-between; align-items: flex-end;">
                        <h3>${item.title}</h3>
                        <span style="font-size: 1.5rem;" class="arrow-icon">↗</span>
                    </div>
                    <p>${item.desc}</p>
                </div>
            </a>
        `).join('');

        // 2. Blog Tile
        const blogHtml = `
            <div class="bento-card span-2 reveal-on-scroll" style="transition-delay: 400ms; cursor: default;">
                <div class="bento-tag">Engineering Log</div>
                <div class="card-content" style="height: 100%; display: flex; flex-direction: column; gap: 1rem;">
                    <h3 style="margin-bottom: 0;">Recent Writing</h3>
                    <div class="blog-list">
                        ${blogPosts.map(post => `
                            <div class="blog-item" onclick="openBlog('${post.id}')">
                                <span class="text-muted" style="font-size: 0.8rem;">${post.date}</span>
                                <div style="font-weight: 600; cursor: pointer; transition: color 0.2s;" class="blog-title">${post.title}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        bentoContainer.innerHTML = portfolioHtml + blogHtml;
    } catch (e) {
        console.error("Critical Render Error:", e);
        if (bentoContainer) bentoContainer.innerHTML = `<div style="padding:2rem; color:red;">System Malfunction. Check Console.</div>`;
    }
};

// Blog Modal Logic
window.openBlog = (id) => {
    const post = blogPosts.find(p => p.id === id);
    if (!post) return;

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-btn" onclick="this.closest('.modal-backdrop').remove()">×</button>
            <div class="modal-header">
                <span class="uppercase">${post.date} // ${post.readTime}</span>
                <h2>${post.title}</h2>
            </div>
            <div class="modal-body">
                ${post.content}
            </div>
        </div>
    `;

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });

    document.body.appendChild(modal);

    // Animate in
    requestAnimationFrame(() => modal.classList.add('active'));
};


// Intersection Observer
const infoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
});

const initObservers = () => {
    const hiddenElements = document.querySelectorAll('.reveal, .reveal-on-scroll');
    hiddenElements.forEach(el => infoObserver.observe(el));
};

// Magnetic Button Effect
const initMagneticButtons = () => {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.1)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0) scale(1)';
        });
    });
};

// Toast System
const showToast = (message) => {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    const container = document.getElementById('toast-container') || createToastContainer();
    container.appendChild(toast);

    // Animate In
    requestAnimationFrame(() => toast.classList.add('active'));

    // Remove after 3s
    setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

const createToastContainer = () => {
    const container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
    return container;
};

// Clipboard Logic
window.copyEmail = async () => {
    const email = "contact@jordandamhof.com";
    try {
        await navigator.clipboard.writeText(email);
        showToast("Email Copied to Clipboard");
    } catch (err) {
        console.error('Failed to copy mode', err);
        // Fallback
        window.location.href = `mailto:${email}`;
    }
};

const initDynamicYear = () => {
    const yearSpan = document.querySelector('.copyright-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
};

// Easter Egg
const initKonami = () => {
    const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let index = 0;
    document.addEventListener('keydown', (e) => {
        if (e.key === code[index]) {
            index++;
            if (index === code.length) {
                document.body.classList.toggle('debug-mode');
                showToast("GOD MODE: " + (document.body.classList.contains('debug-mode') ? "ON" : "OFF"));
                index = 0;
            }
        } else {
            index = 0;
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {
    renderPortfolio();
    setTimeout(initObservers, 50);
    initMagneticButtons();
    initDynamicYear();
    initKonami();
});
