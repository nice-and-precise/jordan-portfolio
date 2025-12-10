import { db, collection, getDocs, query, orderBy, onSnapshot } from "./firebase-config.js";

/**
 * Public Data Fetcher
 * Fetches Outcomes and Projects from Firestore and renders them to the DOM.
 */

// DOM Elements
const outcomesContainer = document.querySelector('.outcomes-grid');
const projectsContainer = document.querySelector('.projects-grid');

/**
 * Render Outcomes
 * @param {Array} outcomes 
 */
function renderOutcomes(outcomes) {
    if (!outcomesContainer) return;
    outcomesContainer.innerHTML = '';

    outcomes.forEach(item => {
        const data = item.data();
        const article = document.createElement('article');

        // Add classes
        article.classList.add('outcome-card');
        if (data.isFeatured) {
            article.classList.add('outcome-card--featured');
        }

        // Build HTML
        // Note: We need to reconstruct the "Sliding Number" HTML structure exactly for the animation to work
        let numberHtml = '';
        const valueStr = data.value.toString();

        for (let i = 0; i < valueStr.length; i++) {
            const digit = valueStr[i];
            numberHtml += `
                <span class="sliding-digit" data-digit="${digit}">
                    <span class="digit-column">
                        <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span>
                    </span>
                </span>
            `;
        }

        article.innerHTML = `
            <div class="outcome-metric">
                <div class="sliding-number" data-value="${data.value}" aria-label="${data.value} ${data.suffix || ''}">
                    ${numberHtml}
                    <span class="sliding-suffix">${data.suffix || ''}</span>
                </div>
            </div>
            <h3 class="outcome-title">${data.title}</h3>
            <p class="outcome-description">${data.description}</p>
        `;

        outcomesContainer.appendChild(article);
    });
}

/**
 * Render Projects
 * @param {Array} projects 
 */
function renderProjects(projects) {
    if (!projectsContainer) return;
    projectsContainer.innerHTML = '';

    projects.forEach(item => {
        const data = item.data();
        const article = document.createElement('article');
        article.classList.add('project-card');

        // Check if it's a GitHub card style or standard
        const isGithub = data.type === 'github';

        if (isGithub) {
            article.classList.add('github-card');
            article.innerHTML = `
                <header class="github-card-header">
                    <svg class="github-card-icon" viewBox="0 0 16 16" aria-hidden="true">
                        <path fill="currentColor" d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"/>
                    </svg>
                    <h3 class="github-card-title">
                        <a href="${data.url}" target="_blank" rel="noopener noreferrer">
                            ${data.repoOwner}/<strong>${data.repoName}</strong>
                        </a>
                    </h3>
                </header>

                <p class="github-card-description">${data.description}</p>

                <footer class="github-card-footer">
                    <span class="github-card-lang">
                        <span class="github-card-lang-dot" style="background-color: ${data.langColor || '#3178c6'};" aria-hidden="true"></span>
                        ${data.language}
                    </span>
                    ${data.stars ? `
                    <span class="github-card-stat">
                        <svg viewBox="0 0 16 16" aria-hidden="true">
                            <path fill="currentColor" d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/>
                        </svg>
                        ${data.stars}
                    </span>` : ''}
                    ${data.forks ? `
                    <span class="github-card-stat">
                        <svg viewBox="0 0 16 16" aria-hidden="true">
                            <path fill="currentColor" d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/>
                        </svg>
                        ${data.forks}
                    </span>` : ''}
                </footer>
            `;
        } else {
            // Standard Image/Text Card
            let tagsHtml = '';
            if (data.tags && Array.isArray(data.tags)) {
                tagsHtml = `<ul class="project-card-tags">${data.tags.map(tag => `<li>${tag}</li>`).join('')}</ul>`;
            }

            article.innerHTML = `
                ${data.imageUrl ? `<img src="${data.imageUrl}" alt="${data.title}" class="project-card-image" style="width:100%; height:200px; object-fit:cover; border-radius: 8px 8px 0 0; margin-bottom: 1rem;">` : ''}
                <div class="${data.imageUrl ? 'project-card-content' : ''}">
                    <h3 class="project-card-title">${data.title}</h3>
                    <p class="project-card-description">${data.description}</p>
                    ${tagsHtml}
                </div>
            `;
        }

        projectsContainer.appendChild(article);
    });
}

/**
 * Initialize
 */
async function init() {
    // Real-time listener for Outcomes
    const outcomesQuery = query(collection(db, "outcomes"), orderBy("order"));
    onSnapshot(outcomesQuery, (snapshot) => {
        renderOutcomes(snapshot.docs);
        // Re-run animations if available globally
        if (window.Portfolio && typeof window.Portfolio.refreshObservers === 'function') {
            window.Portfolio.refreshObservers();
        }
    });

    // Real-time listener for Projects
    const projectsQuery = query(collection(db, "projects"), orderBy("order"));
    onSnapshot(projectsQuery, (snapshot) => {
        renderProjects(snapshot.docs);
        if (window.Portfolio && typeof window.Portfolio.refreshObservers === 'function') {
            window.Portfolio.refreshObservers();
        }
    });
}

// Start
init();
