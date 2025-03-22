// Store content items
let contentItems = [];

// Get DOM elements
const calendarDays = document.getElementById('calendar-days');
const currentMonth = document.getElementById('currentMonth');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const addContentBtn = document.getElementById('addContentBtn');
const contentModal = document.getElementById('contentModal');
const contentForm = document.getElementById('contentForm');
const cancelBtn = document.getElementById('cancelBtn');

// Current date
let currentDate = new Date();

// Initialize calendar
function initCalendar() {
    updateCalendarHeader();
    renderCalendar();
    loadContentItems();
}

// Update calendar header
function updateCalendarHeader() {
    const options = { month: 'long', year: 'numeric' };
    currentMonth.textContent = currentDate.toLocaleDateString('en-US', options);
}

// Render calendar days
function renderCalendar() {
    calendarDays.innerHTML = '';
    
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startingDay = firstDay.getDay();
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
        calendarDays.appendChild(createDayElement(''));
    }
    
    // Add days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dayElement = createDayElement(day, date);
        calendarDays.appendChild(dayElement);
    }
}

// Create day element
function createDayElement(day, date) {
    const div = document.createElement('div');
    div.className = 'calendar-day';
    
    if (day) {
        div.textContent = day;
        
        // Check if it's today
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
            div.classList.add('today');
        }
        
        // Check if it has content
        const hasContent = contentItems.some(item => {
            const itemDate = new Date(item.date);
            return itemDate.toDateString() === date.toDateString();
        });
        
        if (hasContent) {
            div.classList.add('has-content');
            const content = contentItems.find(item => {
                const itemDate = new Date(item.date);
                return itemDate.toDateString() === date.toDateString();
            });
            const preview = document.createElement('div');
            preview.className = 'content-preview';
            preview.textContent = content.title;
            div.appendChild(preview);
        }
        
        // Add click event
        div.addEventListener('click', () => {
            if (date) {
                showAddContentModal(date);
            }
        });
    }
    
    return div;
}

// Show add content modal
function showAddContentModal(date) {
    contentModal.style.display = 'block';
    contentForm.dataset.date = date.toISOString();
}

// Hide add content modal
function hideAddContentModal() {
    contentModal.style.display = 'none';
    contentForm.reset();
}

// Handle form submission
contentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const date = new Date(contentForm.dataset.date);
    const title = document.getElementById('contentTitle').value;
    const type = document.getElementById('contentType').value;
    const status = document.getElementById('contentStatus').value;
    
    const contentItem = {
        id: Date.now(),
        date: date.toISOString(),
        title,
        type,
        status
    };
    
    contentItems.push(contentItem);
    saveContentItems();
    hideAddContentModal();
    renderCalendar();
});

// Save content items to localStorage
function saveContentItems() {
    localStorage.setItem('contentItems', JSON.stringify(contentItems));
}

// Load content items from localStorage
function loadContentItems() {
    const savedItems = localStorage.getItem('contentItems');
    if (savedItems) {
        contentItems = JSON.parse(savedItems);
    }
}

// Event listeners
prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    initCalendar();
});

nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    initCalendar();
});

addContentBtn.addEventListener('click', () => {
    showAddContentModal(new Date());
});

cancelBtn.addEventListener('click', hideAddContentModal);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === contentModal) {
        hideAddContentModal();
    }
});

// Initialize the calendar
initCalendar(); 
