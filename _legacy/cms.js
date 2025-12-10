
import {
    auth,
    db,
    storage,
    googleProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut,
    collection,
    query,
    orderBy,
    onSnapshot,
    doc,
    updateDoc,
    addDoc,
    deleteDoc,
    writeBatch,
    ref,
    uploadBytes,
    getDownloadURL
} from "./firebase-config.js";

// DOM Elements
const loginView = document.getElementById('login-view');
const dashboardView = document.getElementById('dashboard-view');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userEmailSpan = document.getElementById('user-email');
const tabOutcomes = document.getElementById('tab-outcomes');
const tabProjects = document.getElementById('tab-projects');
const outcomeList = document.getElementById('outcomes-list');
const projectList = document.getElementById('projects-list');
const addNewBtn = document.getElementById('add-new-btn');

// State
let currentUser = null;
let activeTab = 'outcomes'; // 'outcomes' | 'projects'
let outcomesData = [];
let projectsData = [];

// ==========================================
// Authentication
// ==========================================

// ==========================================
// Config Validation (UX)
// ==========================================
import { app } from "./firebase-config.js";
if (app.options.apiKey === "API_KEY_PLACEHOLDER") {
    const errorBanner = document.createElement('div');
    errorBanner.style.cssText = "background: #ffcccc; color: #cc0000; padding: 10px; text-align: center; font-weight: bold; position: fixed; top: 0; left: 0; right: 0; z-index: 9999;";
    errorBanner.textContent = "Warning: Firebase Config is missing. Please update 'firebase-config.js' with your project details.";
    document.body.prepend(errorBanner);

    // Disable interaction
    loginBtn.disabled = true;
    loginBtn.textContent = "Config Missing";
}

loginBtn.addEventListener('click', async () => {
    try {
        await signInWithPopup(auth, googleProvider);
    } catch (error) {
        alert("Authentication Error: " + error.message + "\n\n(Did you enable Google Auth in Firebase Console?)");
    }
});

logoutBtn.addEventListener('click', () => {
    signOut(auth);
});

onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (user) {
        loginView.style.display = 'none';
        dashboardView.style.display = 'flex';
        userEmailSpan.textContent = user.email;
        initDataListeners();
    } else {
        loginView.style.display = 'flex';
        dashboardView.style.display = 'none';
        // Unsubscribe if needed (simpler to just let page refresh on logout safely)
    }
});

// ==========================================
// Tabs & Navigation
// ==========================================

tabOutcomes.addEventListener('click', () => switchTab('outcomes'));
tabProjects.addEventListener('click', () => switchTab('projects'));

function switchTab(tab) {
    activeTab = tab;
    if (tab === 'outcomes') {
        outcomeList.style.display = 'flex';
        projectList.style.display = 'none';
        // md-tabs handles the visual active state
    } else {
        outcomeList.style.display = 'none';
        projectList.style.display = 'flex';
    }
}

// ==========================================
// Data Fetching & Rendering
// ==========================================

function initDataListeners() {
    // Listen for Outcomes
    const outcomesQuery = query(collection(db, "outcomes"), orderBy("order"));
    onSnapshot(outcomesQuery, (snapshot) => {
        outcomesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderOutcomesList();
    });

    // Listen for Projects
    const projectsQuery = query(collection(db, "projects"), orderBy("order"));
    onSnapshot(projectsQuery, (snapshot) => {
        projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderProjectsList();
    });
}

function renderOutcomesList() {
    outcomeList.innerHTML = '';
    outcomesData.forEach(item => {
        const div = createItemElement(item, 'outcomes');
        outcomeList.appendChild(div);
    });
}

function renderProjectsList() {
    projectList.innerHTML = '';
    projectsData.forEach(item => {
        const div = createItemElement(item, 'projects');
        projectList.appendChild(div);
    });
}

// ==========================================
// Component Creation
// ==========================================

function createItemElement(data, collectionName) {
    const div = document.createElement('div');
    div.classList.add('cms-item');
    div.setAttribute('draggable', 'true');
    div.dataset.id = data.id;

    // Drag Handle
    const dragHandle = document.createElement('span');
    dragHandle.classList.add('material-symbols-outlined', 'drag-handle');
    dragHandle.textContent = 'drag_indicator';
    div.appendChild(dragHandle);

    // Image/Icon (For Projects)
    if (collectionName === 'projects') {
        const img = document.createElement('div');
        img.classList.add('item-image');
        if (data.imageUrl) {
            const imageEl = document.createElement('img');
            imageEl.src = data.imageUrl;
            imageEl.style.width = '100%';
            imageEl.style.height = '100%';
            imageEl.style.objectFit = 'cover';
            img.appendChild(imageEl);
        } else {
            img.style.display = 'flex';
            img.style.alignItems = 'center';
            img.style.justifyContent = 'center';
            img.innerHTML = '<span class="material-symbols-outlined">image</span>';
        }

        // Click to upload
        img.addEventListener('click', () => triggerImageUpload(data.id, collectionName));
        // Drop to upload
        img.addEventListener('dragover', (e) => e.preventDefault());
        img.addEventListener('drop', (e) => handleImageDrop(e, data.id, collectionName));

        div.appendChild(img);
    }

    // Content Fields
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('item-content');

    // Title
    const titleObj = createEditableField(data.title || 'Untitled', 'title', data.id, collectionName, 'h3');
    contentDiv.appendChild(titleObj);

    // Description
    const descObj = createEditableField(data.description || 'No description', 'description', data.id, collectionName, 'p');
    contentDiv.appendChild(descObj);

    // Specific Fields
    if (collectionName === 'outcomes') {
        const valContainer = document.createElement('div');
        valContainer.style.display = 'flex';
        valContainer.style.gap = '8px';

        const valObj = createEditableField(data.value || '0', 'value', data.id, collectionName, 'span', 'Value');
        const suffixObj = createEditableField(data.suffix || '%', 'suffix', data.id, collectionName, 'span', 'Suffix');

        valContainer.appendChild(valObj);
        valContainer.appendChild(suffixObj);
        contentDiv.appendChild(valContainer);
    }

    if (collectionName === 'projects') {
        // Tag list (simplified as comma separated string for now)
        const tagsStr = (data.tags || []).join(', ');
        const tagsObj = createEditableField(tagsStr, 'tags', data.id, collectionName, 'small', 'Tags (comma separated)');
        contentDiv.appendChild(tagsObj);

        // Github Link
        if (data.type === 'github') {
            const urlObj = createEditableField(data.url || '#', 'url', data.id, collectionName, 'small', 'GitHub URL');
            contentDiv.appendChild(urlObj);
        }
    }

    div.appendChild(contentDiv);

    // Delete Button
    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('item-actions');

    const deleteBtn = document.createElement('md-icon-button');
    deleteBtn.innerHTML = '<md-icon>delete</md-icon>';
    deleteBtn.addEventListener('click', () => handleDelete(data.id, collectionName));

    actionsDiv.appendChild(deleteBtn);
    div.appendChild(actionsDiv);

    // Drag Events
    div.addEventListener('dragstart', handleDragStart);
    div.addEventListener('dragend', handleDragEnd);
    div.addEventListener('dragover', handleDragOver);
    div.addEventListener('drop', (e) => handleListDrop(e, collectionName));

    return div;
}

function createEditableField(text, field, docId, collectionName, tag = 'div', placeholder = '') {
    const el = document.createElement(tag);
    el.textContent = text;
    el.contentEditable = true;
    el.classList.add('editable');
    if (placeholder) el.dataset.placeholder = placeholder; // Can use CSS to show

    // Debounce save
    let timeout;
    el.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            let val = el.textContent;

            // Special processing for Arrays/Numbers
            if (field === 'tags') {
                val = val.split(',').map(s => s.trim()).filter(Boolean);
            }
            if (field === 'value') {
                // Keep as string or number depending on need, mostly string for outcomes
            }

            updateDocument(collectionName, docId, { [field]: val });
        }, 1000);
    });

    return el;
}

// ==========================================
// CRUD Operations
// ==========================================

async function updateDocument(collectionName, id, data) {
    try {
        const ref = doc(db, collectionName, id);
        await updateDoc(ref, data);
        console.log('Saved', id);
    } catch (e) {
        console.error("Error updating", e);
    }
}

async function handleDelete(id, collectionName) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
        await deleteDoc(doc(db, collectionName, id));
    } catch (e) {
        console.error(e);
    }
}

addNewBtn.addEventListener('click', async () => {
    const collectionName = activeTab;
    const list = activeTab === 'outcomes' ? outcomesData : projectsData;
    const newOrder = list.length > 0 ? Math.max(...list.map(i => i.order || 0)) + 1 : 0;

    const data = {
        title: 'New Item',
        description: 'Description here',
        order: newOrder,
        createdAt: new Date()
    };

    if (activeTab === 'outcomes') {
        data.value = 0;
        data.suffix = '%';
    } else {
        data.type = 'standard'; // default
        data.tags = ['Tag1'];
    }

    try {
        await addDoc(collection(db, collectionName), data);
    } catch (e) {
        console.error(e);
    }
});

// ==========================================
// Drag and Drop (Reorder)
// ==========================================

let draggedItem = null;

function handleDragStart(e) {
    draggedItem = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    draggedItem = null;

    // Cleanup styles
    document.querySelectorAll('.cms-item').forEach(item => {
        item.classList.remove('drag-over');
    });
}

function handleDragOver(e) {
    e.preventDefault();
    if (this === draggedItem) return;
    // visual feedback could go here
    return false;
}

async function handleListDrop(e, collectionName) {
    e.stopPropagation(); // stop triggering image drop

    if (draggedItem === this) return;

    // We simply swap orders or re-calculate orders based on DOM position
    // But since display is driven by data, we need to calculate *new* order values.

    // Simplest approach for this demo:
    // 1. Get all items in current DOM order (excluding the one initializing the drop if it wasn't the list itself, but here we drop ON an item to swap/insert)
    // Actually, handling drop on the *list container* is easier for sorting.
    // Let's rely on `dragover` finding the closest element.
}

// Re-implementing DnD with a simpler container-based approach
outcomeList.addEventListener('dragover', onContainerDragOver);
projectList.addEventListener('dragover', onContainerDragOver);
outcomeList.addEventListener('drop', (e) => onContainerDrop(e, 'outcomes'));
projectList.addEventListener('drop', (e) => onContainerDrop(e, 'projects'));


function onContainerDragOver(e) {
    e.preventDefault();
    const afterElement = getDragAfterElement(this, e.clientY);
    const draggable = document.querySelector('.dragging');
    if (afterElement == null) {
        this.appendChild(draggable);
    } else {
        this.insertBefore(draggable, afterElement);
    }
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.cms-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

async function onContainerDrop(e, collectionName) {
    e.preventDefault();
    // Now the DOM is ordered correctly. We need to update *all* order fields in DB.
    const container = collectionName === 'outcomes' ? outcomeList : projectList;
    const items = [...container.querySelectorAll('.cms-item')];

    const batch = writeBatch(db);

    items.forEach((item, index) => {
        const id = item.dataset.id;
        const ref = doc(db, collectionName, id);
        batch.update(ref, { order: index });
    });

    await batch.commit();
    console.log('Reordered');
}


// ==========================================
// Image Upload
// ==========================================

function triggerImageUpload(id, collectionName) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) uploadImage(file, id, collectionName);
    };
    input.click();
}

function handleImageDrop(e, id, collectionName) {
    e.preventDefault();
    e.stopPropagation(); // Stop bubbling to list
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        uploadImage(file, id, collectionName);
    }
}

async function uploadImage(file, id, collectionName) {
    const storageRef = ref(storage, `${collectionName}/${id}/${file.name}`);
    try {
        const snap = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snap.ref);

        await updateDocument(collectionName, id, { imageUrl: url });
        console.log('Image uploaded');
    } catch (e) {
        console.error('Upload failed', e);
        alert('Upload failed: ' + e.message);
    }
}
