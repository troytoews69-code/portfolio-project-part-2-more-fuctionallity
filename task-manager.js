// ==============================================
// THIS IS THE TASK MANAGER APPLICATION
// ==============================================

class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentFilter = 'all';
        this.currentSort = 'date';
        this.editingTaskId = null;
        this.init();
    }

    init() {
        this.cacheDOMElements();
        this.attachEventListeners();
        this.renderTasks();
        this.updateStats();
    }

    cacheDOMElements() {
        // This is the input elements area
        this.taskInput = document.getElementById('taskInput');
        this.taskPriority = document.getElementById('taskPriority');
        this.addTaskBtn = document.getElementById('addTaskBtn');

        // This is the filter elements area
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.sortBy = document.getElementById('sortBy');
        this.clearCompleted = document.getElementById('clearCompleted');

        // This is the display elements area
        this.tasksList = document.getElementById('tasksList');
        this.emptyState = document.getElementById('emptyState');

        // This is the stats elements area
        this.totalTasks = document.getElementById('totalTasks');
        this.completedTasks = document.getElementById('completedTasks');
        this.pendingTasks = document.getElementById('pendingTasks');

        // This is the modal elements area
        this.modal = document.getElementById('editModal');
        this.editTaskInput = document.getElementById('editTaskInput');
        this.editTaskPriority = document.getElementById('editTaskPriority');
        this.closeModal = document.getElementById('closeModal');
        this.cancelEdit = document.getElementById('cancelEdit');
        this.saveEdit = document.getElementById('saveEdit');
    }

    attachEventListeners() {
        // This is the add task area    
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // This is the filter tasks area
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.renderTasks();
            });
        });

        // This is the sort tasks area
        this.sortBy.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.renderTasks();
        });

        // This is the clear completed area
        this.clearCompleted.addEventListener('click', () => this.clearCompletedTasks());

        // This is the modal events
        this.closeModal.addEventListener('click', () => this.closeEditModal());
        this.cancelEdit.addEventListener('click', () => this.closeEditModal());
        this.saveEdit.addEventListener('click', () => this.saveTaskEdit());

        //  This is the close modal on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeEditModal();
        });
    }

    addTask() {
        const text = this.taskInput.value.trim();
        if (!text) {
            this.showNotification('Please enter a task', 'error');
            return;
        }

        const task = {
            id: Date.now(),
            text: text,
            priority: this.taskPriority.value,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();

        // This is the clear input area
        this.taskInput.value = '';
        this.taskPriority.value = 'medium';

        this.showNotification('Task added successfully!', 'success');
    }

    deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(task => task.id !== id);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.showNotification('Task deleted', 'success');
        }
    }

    toggleTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
        }
    }

    openEditModal(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            this.editingTaskId = id;
            this.editTaskInput.value = task.text;
            this.editTaskPriority.value = task.priority;
            this.modal.classList.add('show');
        }
    }

    closeEditModal() {
        this.modal.classList.remove('show');
        this.editingTaskId = null;
        this.editTaskInput.value = '';
    }

    saveTaskEdit() {
        const text = this.editTaskInput.value.trim();
        if (!text) {
            this.showNotification('Task cannot be empty', 'error');
            return;
        }

        const task = this.tasks.find(task => task.id === this.editingTaskId);
        if (task) {
            task.text = text;
            task.priority = this.editTaskPriority.value;
            this.saveTasks();
            this.renderTasks();
            this.closeEditModal();
            this.showNotification('Task updated!', 'success');
        }
    }

    clearCompletedTasks() {
        const completedCount = this.tasks.filter(task => task.completed).length;
        if (completedCount === 0) {
            this.showNotification('No completed tasks to clear', 'info');
            return;
        }

        if (confirm(`Delete ${completedCount} completed task(s)?`)) {
            this.tasks = this.tasks.filter(task => !task.completed);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.showNotification('Completed tasks cleared', 'success');
        }
    }

    filterTasks() {
        let filtered = [...this.tasks];

        // This is the apply filter area
        switch (this.currentFilter) {
            case 'pending':
                filtered = filtered.filter(task => !task.completed);
                break;
            case 'completed':
                filtered = filtered.filter(task => task.completed);
                break;
        }

        return filtered;
    }

    sortTasks(tasks) {
        const sorted = [...tasks];

        switch (this.currentSort) {
            case 'priority':
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
                break;
            case 'name':
                sorted.sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()));
                break;
            case 'date':
            default:
                sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        return sorted;
    }

    renderTasks() {
        const filteredTasks = this.filterTasks();
        const sortedTasks = this.sortTasks(filteredTasks);

        if (sortedTasks.length === 0) {
            this.tasksList.innerHTML = '';
            this.emptyState.classList.add('show');
            return;
        }

        this.emptyState.classList.remove('show');
        this.tasksList.innerHTML = sortedTasks.map(task => this.createTaskHTML(task)).join('');

        // Attach event listeners to task items
        sortedTasks.forEach(task => {
            const taskElement = document.querySelector(`[data-task-id="${task.id}"]`);
            if (taskElement) {
                const checkbox = taskElement.querySelector('.task-checkbox');
                const editBtn = taskElement.querySelector('.edit-btn');
                const deleteBtn = taskElement.querySelector('.delete-btn');

                checkbox.addEventListener('change', () => this.toggleTask(task.id));
                editBtn.addEventListener('click', () => this.openEditModal(task.id));
                deleteBtn.addEventListener('click', () => this.deleteTask(task.id));
            }
        });
    }

    createTaskHTML(task) {
        const date = new Date(task.createdAt);
        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="priority-badge ${task.priority}">${task.priority}</span>
                <div class="task-content">
                    <div class="task-text">${this.escapeHtml(task.text)}</div>
                    <div class="task-date">
                        <i class="fas fa-clock"></i> ${formattedDate}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="action-btn edit-btn">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const pending = total - completed;

        this.totalTasks.textContent = total;
        this.completedTasks.textContent = completed;
        this.pendingTasks.textContent = pending;
    }

    showNotification(message, type = 'info') {
        // This is the create notification element area
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // This is the add styles area
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
            color: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            zIndex: '9999',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'slideInRight 0.3s ease',
            fontSize: '0.95rem',
            fontWeight: '500'
        });

        document.body.appendChild(notification);

        // This is the remove after 3 seconds area
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    loadTasks() {
        try {
            const tasks = localStorage.getItem('tasks');
            return tasks ? JSON.parse(tasks) : [];
        } catch (error) {
            console.error('Error loading tasks:', error);
            return [];
        }
    }

    saveTasks() {
        try {
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
        } catch (error) {
            console.error('Error saving tasks:', error);
            this.showNotification('Error saving tasks', 'error');
        }
    }
}

// This is the add notification animations area
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// This is the initialize app when DOM is ready area
document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
    console.log('✅ Task Manager initialized');
});
