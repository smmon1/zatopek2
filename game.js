// Constants
const STORAGE_KEY = 'global_click_count';
const MILESTONES = [10, 100, 1000, 10000, 100000, 1000000];

// DOM Elements
const counterBtn = document.getElementById('btn-counter');
const counterValueEl = document.getElementById('counter-value');
const toastEl = document.getElementById('toast');
const toastCountEl = document.getElementById('toast-count');
const roadmapEl = document.getElementById('roadmap');

/**
 * Get current count from localStorage
 */
function getCount() {
    const count = localStorage.getItem(STORAGE_KEY);
    return count ? parseInt(count, 10) : 0;
}

/**
 * Save count to localStorage and update UI
 */
function updateCount(newCount) {
    localStorage.setItem(STORAGE_KEY, newCount);
    renderUI(newCount);
    checkMilestone(newCount);
}

/**
 * Render all UI elements
 */
function renderUI(count) {
    counterValueEl.textContent = count;
    renderRoadmap(count);
}

/**
 * Render the roadmap nodes
 */
function renderRoadmap(currentCount) {
    roadmapEl.innerHTML = '';

    MILESTONES.forEach(goal => {
        const isReached = currentCount >= goal;

        const node = document.createElement('div');
        node.className = `milestone-node ${isReached ? 'reached' : ''}`;

        // Format large numbers (1000 -> 1k)
        const displayGoal = goal >= 1000 ? (goal / 1000) + 'k' : goal;
        const displayFull = goal.toLocaleString();

        node.innerHTML = `
            <div class="node-circle">${displayGoal}</div>
            <div class="node-info">
                <div class="node-title">${displayFull}</div>
                <div class="node-status">${isReached ? 'Completed!' : 'Locked'}</div>
            </div>
        `;

        roadmapEl.appendChild(node);
    });
}

/**
 * Check if the new count is a power of 10 (10, 100, 1000...)
 */
function checkMilestone(count) {
    if (count <= 0) return;
    const logVal = Math.log10(count);
    const isPowerOf10 = Math.abs(logVal - Math.round(logVal)) < 1e-10;

    if (isPowerOf10 && count >= 10) {
        triggerMilestoneEffect(count);
    }
}

/**
 * Trigger visual effects for reaching a goal
 */
function triggerMilestoneEffect(count) {
    counterBtn.classList.remove('milestone-burst');
    void counterBtn.offsetWidth; // Trigger reflow
    counterBtn.classList.add('milestone-burst');

    toastCountEl.textContent = count.toLocaleString();
    toastEl.classList.add('show');

    setTimeout(() => {
        toastEl.classList.remove('show');
    }, 3000);
}

/**
 * Initialize the counter
 */
function init() {
    const initialCount = getCount();
    renderUI(initialCount);

    counterBtn.addEventListener('click', () => {
        const currentCount = getCount();
        updateCount(currentCount + 1);
    });

    window.addEventListener('storage', (event) => {
        if (event.key === STORAGE_KEY) {
            const newCount = event.newValue ? parseInt(event.newValue, 10) : 0;
            renderUI(newCount);
        }
    });
}

init();
