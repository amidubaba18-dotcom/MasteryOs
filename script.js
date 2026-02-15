// ===========================================
// LEARNING JOURNEY TRACKER - JAVASCRIPT
// ===========================================

let topics = [];
let currentFilter = 'all';
let editingTopicId = null;

// DOM ELEMENT REFERENCES
const modal = document.getElementById('topic-modal');
const modalTitle = document.getElementById('modal-title');
const topicForm = document.getElementById('topic-form');
const submitBtnText = document.getElementById('submit-btn-text');
const addBtn = document.getElementById('add-btn');
const closeModalBtn = document.getElementById('close-modal');
const cancelBtn = document.getElementById('cancel-btn');
const topicNameInput = document.getElementById('topic-name');
const categoryInput = document.getElementById('category');
const statusInput = document.getElementById('status');
const startDateInput = document.getElementById('start-date');
const targetDateInput = document.getElementById('target-date');
const progressInput = document.getElementById('progress');
const progressValueSpan = document.getElementById('progress-value');
const resourcesInput = document.getElementById('resources');
const notesInput = document.getElementById('notes');
const journeyList = document.getElementById('journey-list');
const emptyState = document.getElementById('empty-state');
const statNotStarted = document.getElementById('stat-not-started');
const statInProgress = document.getElementById('stat-in-progress');
const statCompleted = document.getElementById('stat-completed');
const statTotal = document.getElementById('stat-total');
const filterButtons = document.querySelectorAll('.filter-btn');

// LOCALSTORAGE FUNCTIONS
function loadTopics() {
    try {
        const stored = localStorage.getItem('learningTopics');
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error loading topics:', error);
        return [];
    }
}

function saveTopics(topicsToSave) {
    try {
        localStorage.setItem('learningTopics', JSON.stringify(topicsToSave));
    } catch (error) {
        console.error('Error saving topics:', error);
        alert('Error saving data. Storage might be full.');
    }
}

// CRUD OPERATIONS
function createTopic(topicData) {
    const newTopic = {
        id: Date.now(),
        ...topicData,
        createdAt: new Date().toISOString()
    };
    topics.unshift(newTopic);
    saveTopics(topics);
    return newTopic;
}

function getTopicById(id) {
    return topics.find(topic => topic.id === id);
}

function updateTopic(id, updatedData) {
    const index = topics.findIndex(topic => topic.id === id);
    if (index !== -1) {
        topics[index] = { ...topics[index], ...updatedData };
        saveTopics(topics);
        return topics[index];
    }
    return null;
}

function deleteTopic(id) {
    const initialLength = topics.length;
    topics = topics.filter(topic => topic.id !== id);
    if (topics.length < initialLength) {
        saveTopics(topics);
        return true;
    }
    return false;
}

// UI RENDERING
function renderTopics() {
    let filteredTopics = topics;
    if (currentFilter !== 'all') {
        filteredTopics = topics.filter(topic => topic.status === currentFilter);
    }
    
    if (filteredTopics.length === 0) {
        journeyList.innerHTML = '';
        emptyState.classList.add('visible');
        return;
    }
    
    emptyState.classList.remove('visible');
    const topicsHTML = filteredTopics.map(topic => createTopicCard(topic)).join('');
    journeyList.innerHTML = topicsHTML;
    attachTopicEventListeners();
}

function createTopicCard(topic) {
    const startDate = topic.startDate ? formatDate(topic.startDate) : 'Not set';
    const targetDate = topic.targetDate ? formatDate(topic.targetDate) : 'Not set';
    const statusDisplay = topic.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    const resourcesList = topic.resources
        .split(',')
        .map(url => url.trim())
        .filter(url => url)
        .map(url => `
            <li><a href="${url}" target="_blank" rel="noopener noreferrer">🔗 ${truncateUrl(url)}</a></li>
        `)
        .join('');
    
    return `
        <div class="journey-card" data-id="${topic.id}" data-status="${topic.status}">
            <div class="journey-card-header">
                <div>
                    <h3 class="journey-card-title">${escapeHtml(topic.name)}</h3>
                    <p class="journey-card-category">${escapeHtml(topic.category)}</p>
                </div>
                <span class="status-badge ${topic.status}">${statusDisplay}</span>
            </div>
            <div class="journey-card-body">
                <div class="journey-info">
                    <div class="journey-info-item">
                        <span class="info-icon">📅</span>
                        <span>Start: ${startDate}</span>
                    </div>
                    <div class="journey-info-item">
                        <span class="info-icon">🎯</span>
                        <span>Target: ${targetDate}</span>
                    </div>
                </div>
                <div class="progress-container">
                    <div class="progress-label">
                        <span>Progress</span>
                        <span>${topic.progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${topic.progress}%"></div>
                    </div>
                </div>
                ${topic.notes ? `
                    <div class="journey-notes">
                        <strong>Notes:</strong><br>${escapeHtml(topic.notes)}
                    </div>
                ` : ''}
                ${resourcesList ? `
                    <div class="journey-resources">
                        <p class="resources-title">📚 Learning Resources:</p>
                        <ul class="resources-list">${resourcesList}</ul>
                    </div>
                ` : ''}
            </div>
            <div class="journey-card-actions">
                <button class="action-btn edit-btn" data-id="${topic.id}">✏️ Edit</button>
                <button class="action-btn delete-btn" data-id="${topic.id}">🗑️ Delete</button>
            </div>
        </div>
    `;
}

function attachTopicEventListeners() {
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const topicId = parseInt(this.getAttribute('data-id'));
            handleEditTopic(topicId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const topicId = parseInt(this.getAttribute('data-id'));
            handleDeleteTopic(topicId);
        });
    });
}

// MODAL MANAGEMENT
function openModal(mode = 'add', topicData = null) {
    if (mode === 'edit') {
        modalTitle.textContent = 'Edit Learning Topic';
        submitBtnText.textContent = 'Update Topic';
        editingTopicId = topicData.id;
        populateForm(topicData);
    } else {
        modalTitle.textContent = 'Add Learning Topic';
        submitBtnText.textContent = 'Add Topic';
        editingTopicId = null;
        topicForm.reset();
        progressValueSpan.textContent = '0';
    }
    modal.classList.add('active');
    topicNameInput.focus();
}

function closeModal() {
    modal.classList.remove('active');
    topicForm.reset();
    editingTopicId = null;
    progressValueSpan.textContent = '0';
}

function populateForm(topic) {
    topicNameInput.value = topic.name;
    categoryInput.value = topic.category;
    statusInput.value = topic.status;
    startDateInput.value = topic.startDate;
    targetDateInput.value = topic.targetDate;
    progressInput.value = topic.progress;
    progressValueSpan.textContent = topic.progress;
    resourcesInput.value = topic.resources;
    notesInput.value = topic.notes;
}

// FORM HANDLING
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: topicNameInput.value.trim(),
        category: categoryInput.value,
        status: statusInput.value,
        startDate: startDateInput.value,
        targetDate: targetDateInput.value,
        progress: parseInt(progressInput.value),
        resources: resourcesInput.value.trim(),
        notes: notesInput.value.trim()
    };
    
    if (!formData.name || !formData.category) {
        alert('Please fill in all required fields');
        return;
    }
    
    if (editingTopicId) {
        updateTopic(editingTopicId, formData);
    } else {
        createTopic(formData);
    }
    
    renderTopics();
    updateStatistics();
    closeModal();
}

function handleEditTopic(topicId) {
    const topic = getTopicById(topicId);
    if (topic) {
        openModal('edit', topic);
    }
}

function handleDeleteTopic(topicId) {
    const confirmed = confirm('Are you sure you want to delete this topic?');
    if (confirmed) {
        deleteTopic(topicId);
        renderTopics();
        updateStatistics();
    }
}

// FILTER SYSTEM
function setFilter(filter) {
    currentFilter = filter;
    filterButtons.forEach(btn => {
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    renderTopics();
}

// STATISTICS
function updateStatistics() {
    const notStartedCount = topics.filter(t => t.status === 'not-started').length;
    const inProgressCount = topics.filter(t => t.status === 'in-progress').length;
    const completedCount = topics.filter(t => t.status === 'completed').length;
    const totalCount = topics.length;
    
    statNotStarted.textContent = notStartedCount;
    statInProgress.textContent = inProgressCount;
    statCompleted.textContent = completedCount;
    statTotal.textContent = totalCount;
}

// EVENT LISTENERS
function initializeEventListeners() {
    addBtn.addEventListener('click', () => openModal('add'));
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    topicForm.addEventListener('submit', handleFormSubmit);
    
    progressInput.addEventListener('input', (e) => {
        progressValueSpan.textContent = e.target.value;
    });
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            setFilter(filter);
        });
    });
}

// UTILITY FUNCTIONS
function formatDate(dateString) {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function truncateUrl(url) {
    const maxLength = 50;
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// INITIALIZATION
function init() {
    topics = loadTopics();
    renderTopics();
    updateStatistics();
    initializeEventListeners();
    console.log('Learning Journey Tracker initialized');
    console.log(`Loaded ${topics.length} topics from localStorage`);
}

document.addEventListener('DOMContentLoaded', init);
