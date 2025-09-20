// Civic Issues Admin Dashboard JavaScript
const API_BASE_URL = 'https://civic-reports-api-production.up.railway.app/api';
// Application data
const appData = {
  "issues": [
    {
      "id": "CIV001",
      "title": "Broken streetlight on Main Street",
      "category": "Street Lighting",
      "location": "Main Street & 5th Avenue",
      "coordinates": {"lat": 40.7589, "lng": -73.9851},
      "priority": "High",
      "status": "Pending",
      "dateReported": "2025-09-18",
      "description": "The streetlight has been broken for 3 days, causing safety concerns for pedestrians",
      "department": "Public Works",
      "reportedBy": "John Smith",
      "photo": "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop"
    },
    {
      "id": "CIV002", 
      "title": "Pothole on Oak Road",
      "category": "Roads & Transport",
      "location": "Oak Road near Park Avenue",
      "coordinates": {"lat": 40.7614, "lng": -73.9776},
      "priority": "Medium",
      "status": "In Progress", 
      "dateReported": "2025-09-17",
      "description": "Large pothole causing damage to vehicles",
      "department": "Transportation",
      "reportedBy": "Sarah Johnson",
      "photo": "https://images.unsplash.com/photo-1582274528667-1d6c1b5ccfc1?w=300&h=200&fit=crop"
    },
    {
      "id": "CIV003",
      "title": "Water leak in residential area", 
      "category": "Water & Sanitation",
      "location": "Elm Street Residential Complex",
      "coordinates": {"lat": 40.7505, "lng": -73.9934},
      "priority": "Critical",
      "status": "Resolved",
      "dateReported": "2025-09-15",
      "description": "Major water leak affecting multiple households",
      "department": "Water Department",
      "reportedBy": "Mike Davis",
      "photo": "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&h=200&fit=crop"
    },
    {
      "id": "CIV004",
      "title": "Overflowing garbage bins",
      "category": "Waste Management", 
      "location": "Central Park Entrance",
      "coordinates": {"lat": 40.7712, "lng": -73.9648},
      "priority": "Medium",
      "status": "Pending",
      "dateReported": "2025-09-19",
      "description": "Multiple garbage bins are overflowing, attracting pests",
      "department": "Sanitation",
      "reportedBy": "Lisa Chen",
      "photo": "https://images.unsplash.com/photo-1582408921715-18e7806365c1?w=300&h=200&fit=crop"
    },
    {
      "id": "CIV005",
      "title": "Damaged playground equipment",
      "category": "Parks & Recreation",
      "location": "Riverside Park",
      "coordinates": {"lat": 40.7829, "lng": -73.9654},
      "priority": "High",
      "status": "In Progress",
      "dateReported": "2025-09-16", 
      "description": "Swing set has broken chains, posing safety risk to children",
      "department": "Parks Department",
      "reportedBy": "David Wilson",
      "photo": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop"
    }
  ],
  "categories": [
    {"name": "Roads & Transport", "color": "#FF6B6B", "icon": "🚗", "count": 12},
    {"name": "Water & Sanitation", "color": "#4ECDC4", "icon": "💧", "count": 8},
    {"name": "Street Lighting", "color": "#FFE66D", "icon": "💡", "count": 15},
    {"name": "Waste Management", "color": "#95E1D3", "icon": "🗑️", "count": 6},
    {"name": "Parks & Recreation", "color": "#A8E6CF", "icon": "🌳", "count": 4},
    {"name": "Public Safety", "color": "#FF8B94", "icon": "🚨", "count": 7},
    {"name": "Electricity", "color": "#B4A7D6", "icon": "⚡", "count": 9},
    {"name": "Building & Construction", "color": "#D4A574", "icon": "🏗️", "count": 3}
  ],
  "statistics": {
    "totalReports": 64,
    "pending": 23,
    "inProgress": 31,
    "resolved": 10,
    "averageResolutionTime": "5.2 days"
  },
  "departments": [
    {"name": "Public Works", "activeIssues": 18, "avgResolutionTime": "4.5 days"},
    {"name": "Transportation", "activeIssues": 12, "avgResolutionTime": "6.2 days"},
    {"name": "Water Department", "activeIssues": 8, "avgResolutionTime": "3.8 days"},
    {"name": "Sanitation", "activeIssues": 6, "avgResolutionTime": "2.1 days"},
    {"name": "Parks Department", "activeIssues": 4, "avgResolutionTime": "7.3 days"}
  ]
};

// Global state
let currentIssue = null;
let filteredIssues = [...appData.issues];
let charts = {};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log('Initializing app...');
    
    // Initialize all components
    setupNavigation();
    setupMobileToggle();
    setupSearch();
    setupFilters();
    setupModal();
    
    // Render all sections
    renderDashboard();
    renderIssues();
    renderAnalytics();
    renderSettings();
    
    // Show dashboard by default
    showSection('dashboard');
    
    console.log('App initialized successfully');
}

// Navigation Setup - Fixed
function setupNavigation() {
    console.log('Setting up navigation...');
    
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    
    navLinks.forEach(link => {
        const section = link.getAttribute('data-section');
        console.log('Setting up nav link for section:', section);
        
        // Remove any existing event listeners
        link.replaceWith(link.cloneNode(true));
    });
    
    // Re-query after cloning to get fresh elements
    const freshNavLinks = document.querySelectorAll('.nav-link[data-section]');
    
    freshNavLinks.forEach(link => {
        const section = link.getAttribute('data-section');
        
        link.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            console.log('Navigation clicked for section:', section);
            
            // Update active state
            freshNavLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Navigate to section
            showSection(section);
            updatePageTitle(section);
            
            return false;
        });
    });
    
    console.log('Navigation setup complete with', freshNavLinks.length, 'links');
}

function showSection(sectionName) {
    console.log('Showing section:', sectionName);
    
    // Hide all content sections
    const allSections = document.querySelectorAll('.content-section');
    allSections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.style.display = 'block';
        console.log('Successfully showed section:', sectionName);
        
        // Section-specific initialization
        if (sectionName === 'analytics') {
            setTimeout(() => renderAnalytics(), 150);
        } else if (sectionName === 'issues') {
            setTimeout(() => renderIssues(), 50);
        }
    } else {
        console.error('Section not found:', sectionName + '-section');
    }
}

function updatePageTitle(section) {
    const pageTitle = document.getElementById('page-title');
    const titles = {
        'dashboard': 'Dashboard',
        'issues': 'Issue Management',
        'analytics': 'Analytics',
        'settings': 'Settings'
    };
    
    if (pageTitle) {
        pageTitle.textContent = titles[section] || 'Dashboard';
    }
}

// Mobile Toggle Setup
function setupMobileToggle() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            sidebar.classList.toggle('open');
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                    sidebar.classList.remove('open');
                }
            }
        });
    }
}

// Search Setup
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (!searchInput || !searchBtn) return;
    
    function performSearch(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        const query = searchInput.value.toLowerCase().trim();
        
        if (query === '') {
            filteredIssues = [...appData.issues];
        } else {
            filteredIssues = appData.issues.filter(issue => 
                issue.title.toLowerCase().includes(query) ||
                issue.category.toLowerCase().includes(query) ||
                issue.location.toLowerCase().includes(query) ||
                issue.description.toLowerCase().includes(query)
            );
        }
        
        renderIssuesTable();
        return false;
    }
    
    searchInput.addEventListener('input', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(e);
        }
    });
    searchBtn.addEventListener('click', performSearch);
}

// Filters Setup
function setupFilters() {
    const statusFilter = document.getElementById('status-filter');
    const categoryFilter = document.getElementById('category-filter');
    const priorityFilter = document.getElementById('priority-filter');
    const clearFiltersBtn = document.getElementById('clear-filters');
    
    if (!statusFilter || !categoryFilter || !priorityFilter || !clearFiltersBtn) {
        return;
    }
    
    // Clear existing options
    categoryFilter.innerHTML = '<option value="">All Categories</option>';
    
    // Populate category filter
    appData.categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = category.name;
        categoryFilter.appendChild(option);
    });
    
    function applyFilters(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        let filtered = [...appData.issues];
        
        const statusValue = statusFilter.value;
        const categoryValue = categoryFilter.value;
        const priorityValue = priorityFilter.value;
        const searchValue = document.getElementById('search-input')?.value?.toLowerCase()?.trim() || '';
        
        if (statusValue) {
            filtered = filtered.filter(issue => issue.status === statusValue);
        }
        
        if (categoryValue) {
            filtered = filtered.filter(issue => issue.category === categoryValue);
        }
        
        if (priorityValue) {
            filtered = filtered.filter(issue => issue.priority === priorityValue);
        }
        
        if (searchValue) {
            filtered = filtered.filter(issue => 
                issue.title.toLowerCase().includes(searchValue) ||
                issue.category.toLowerCase().includes(searchValue) ||
                issue.location.toLowerCase().includes(searchValue) ||
                issue.description.toLowerCase().includes(searchValue)
            );
        }
        
        filteredIssues = filtered;
        renderIssuesTable();
        
        console.log('Filters applied, showing', filteredIssues.length, 'of', appData.issues.length, 'issues');
    }
    
    statusFilter.addEventListener('change', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    priorityFilter.addEventListener('change', applyFilters);
    
    clearFiltersBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        statusFilter.value = '';
        categoryFilter.value = '';
        priorityFilter.value = '';
        
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = '';
        }
        
        filteredIssues = [...appData.issues];
        renderIssuesTable();
        
        return false;
    });
}

// Modal Setup
function setupModal() {
    const modal = document.getElementById('issue-modal');
    const closeBtn = document.getElementById('close-modal');
    const updateBtn = document.getElementById('update-issue');
    
    if (!modal || !closeBtn || !updateBtn) return;
    
    closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        modal.classList.add('hidden');
        return false;
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
    
    updateBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (currentIssue) {
            const statusUpdate = document.getElementById('status-update');
            const priorityUpdate = document.getElementById('priority-update');
            
            if (statusUpdate && priorityUpdate) {
                const newStatus = statusUpdate.value;
                const newPriority = priorityUpdate.value;
                
                // Update the issue in data
                const issueIndex = appData.issues.findIndex(issue => issue.id === currentIssue.id);
                if (issueIndex !== -1) {
                    appData.issues[issueIndex].status = newStatus;
                    appData.issues[issueIndex].priority = newPriority;
                    
                    // Update filtered issues if the current issue is in the filtered set
                    const filteredIndex = filteredIssues.findIndex(issue => issue.id === currentIssue.id);
                    if (filteredIndex !== -1) {
                        filteredIssues[filteredIndex].status = newStatus;
                        filteredIssues[filteredIndex].priority = newPriority;
                    }
                    
                    // Refresh displays
                    renderIssuesTable();
                    renderDashboard();
                    
                    // Show success message
                    showNotification('Issue updated successfully!', 'success');
                    
                    // Close modal
                    modal.classList.add('hidden');
                }
            }
        }
        
        return false;
    });
}

// Dashboard Rendering
function renderDashboard() {
    console.log('Rendering dashboard...');
    
    // Use the statistics from appData
    const stats = appData.statistics;
    
    // Update statistics cards
    const elements = [
        ['total-reports', stats.totalReports],
        ['pending-count', stats.pending],
        ['in-progress-count', stats.inProgress],
        ['resolved-count', stats.resolved]
    ];
    
    elements.forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
    
    // Render charts with delay
    setTimeout(() => {
        renderCategoryChart();
        renderPriorityChart();
        renderRecentActivity();
    }, 100);
}

function renderCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;
    
    try {
        if (charts.categoryChart) {
            charts.categoryChart.destroy();
        }
        
        const categoryData = appData.categories.map(category => category.count);
        const categoryLabels = appData.categories.map(category => category.name);
        const categoryColors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325'];
        
        charts.categoryChart = new Chart(ctx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: categoryLabels,
                datasets: [{
                    data: categoryData,
                    backgroundColor: categoryColors,
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error rendering category chart:', error);
    }
}

function renderPriorityChart() {
    const ctx = document.getElementById('priorityChart');
    if (!ctx) return;
    
    try {
        if (charts.priorityChart) {
            charts.priorityChart.destroy();
        }
        
        const priorityCount = {
            'Critical': appData.issues.filter(issue => issue.priority === 'Critical').length,
            'High': appData.issues.filter(issue => issue.priority === 'High').length,
            'Medium': appData.issues.filter(issue => issue.priority === 'Medium').length,
            'Low': appData.issues.filter(issue => issue.priority === 'Low').length
        };
        
        charts.priorityChart = new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: Object.keys(priorityCount),
                datasets: [{
                    label: 'Number of Issues',
                    data: Object.values(priorityCount),
                    backgroundColor: ['#B4413C', '#FFC185', '#1FB8CD', '#5D878F'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error rendering priority chart:', error);
    }
}

function renderRecentActivity() {
    const activityList = document.getElementById('activity-list');
    if (!activityList) return;
    
    const recentIssues = appData.issues
        .sort((a, b) => new Date(b.dateReported) - new Date(a.dateReported))
        .slice(0, 5);
    
    activityList.innerHTML = '';
    
    recentIssues.forEach(issue => {
        const activityItem = document.createElement('div');
        activityItem.className = `activity-item ${issue.priority.toLowerCase()}-priority`;
        
        const date = new Date(issue.dateReported).toLocaleDateString();
        activityItem.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 4px;">${issue.title}</div>
            <div style="font-size: 12px; color: var(--color-text-secondary);">
                ${issue.category} • ${issue.location} • ${date}
            </div>
        `;
        
        activityList.appendChild(activityItem);
    });
}

// Issues Rendering
function renderIssues() {
    console.log('Rendering issues section...');
    renderIssuesTable();
}

function renderIssuesTable() {
    const tableBody = document.getElementById('issues-table-body');
    if (!tableBody) {
        console.error('Issues table body not found');
        return;
    }
    
    console.log('Rendering issues table with', filteredIssues.length, 'issues');
    
    tableBody.innerHTML = '';
    
    filteredIssues.forEach(issue => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${issue.id}</td>
            <td>${issue.title}</td>
            <td>${issue.category}</td>
            <td>${issue.location}</td>
            <td><span class="priority-badge ${issue.priority.toLowerCase()}">${issue.priority}</span></td>
            <td><span class="status-badge ${issue.status.toLowerCase().replace(' ', '-')}">${issue.status}</span></td>
            <td>${new Date(issue.dateReported).toLocaleDateString()}</td>
            <td><button class="action-btn" onclick="window.showIssueModal('${issue.id}'); return false;">View Details</button></td>
        `;
        
        tableBody.appendChild(row);
    });
    
    console.log('Issues table rendered successfully');
}

function showIssueModal(issueId) {
    console.log('Showing modal for issue:', issueId);
    
    const issue = appData.issues.find(issue => issue.id === issueId);
    if (!issue) {
        console.error('Issue not found:', issueId);
        return;
    }
    
    currentIssue = issue;
    
    // Populate modal with issue data
    const elements = {
        'modal-title': issue.title,
        'issue-id': issue.id,
        'issue-category': issue.category,
        'issue-location': issue.location,
        'issue-reporter': issue.reportedBy,
        'issue-date': new Date(issue.dateReported).toLocaleDateString(),
        'issue-department': issue.department,
        'issue-description': issue.description
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
    
    const photoElement = document.getElementById('issue-photo');
    if (photoElement && issue.photo) {
        photoElement.src = issue.photo;
        photoElement.alt = issue.title;
    }
    
    // Set current values in update selects
    const statusUpdate = document.getElementById('status-update');
    const priorityUpdate = document.getElementById('priority-update');
    
    if (statusUpdate) statusUpdate.value = issue.status;
    if (priorityUpdate) priorityUpdate.value = issue.priority;
    
    // Show modal
    const modal = document.getElementById('issue-modal');
    if (modal) {
        modal.classList.remove('hidden');
        console.log('Modal shown successfully');
    }
}

// Analytics Rendering
function renderAnalytics() {
    console.log('Rendering analytics...');
    setTimeout(() => {
        renderTrendsChart();
        renderDepartmentPerformance();
    }, 100);
}

function renderTrendsChart() {
    const ctx = document.getElementById('trendsChart');
    if (!ctx) return;
    
    try {
        if (charts.trendsChart) {
            charts.trendsChart.destroy();
        }
        
        // Generate mock monthly data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
        const reportedData = [45, 52, 48, 61, 55, 67, 59, 62, 64];
        const resolvedData = [42, 48, 45, 58, 52, 63, 56, 58, 60];
        
        charts.trendsChart = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Issues Reported',
                        data: reportedData,
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Issues Resolved',
                        data: resolvedData,
                        borderColor: '#5D878F',
                        backgroundColor: 'rgba(93, 135, 143, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error rendering trends chart:', error);
    }
}

function renderDepartmentPerformance() {
    const departmentList = document.getElementById('department-list');
    if (!departmentList) return;
    
    departmentList.innerHTML = '';
    
    appData.departments.forEach(dept => {
        const deptCard = document.createElement('div');
        deptCard.className = 'department-card';
        deptCard.innerHTML = `
            <h4>${dept.name}</h4>
            <div class="department-stats">
                <span>Active: ${dept.activeIssues}</span>
                <span>Avg: ${dept.avgResolutionTime}</span>
            </div>
        `;
        
        departmentList.appendChild(deptCard);
    });
}

// Settings Rendering
function renderSettings() {
    console.log('Rendering settings...');
    renderCategoriesGrid();
}

function renderCategoriesGrid() {
    const categoriesGrid = document.getElementById('categories-grid');
    if (!categoriesGrid) return;
    
    categoriesGrid.innerHTML = '';
    
    appData.categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.style.backgroundColor = category.color + '20';
        categoryCard.style.borderColor = category.color;
        
        categoryCard.innerHTML = `
            <div class="category-icon">${category.icon}</div>
            <h4 class="category-name">${category.name}</h4>
            <p class="category-count">${category.count} issues</p>
        `;
        
        categoriesGrid.appendChild(categoryCard);
    });
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-${type === 'success' ? 'success' : 'primary'});
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 3000;
        font-weight: 500;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    // Add animation keyframes if not already added
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Make functions globally available
window.showIssueModal = showIssueModal;
