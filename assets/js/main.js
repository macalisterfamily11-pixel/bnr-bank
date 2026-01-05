/**
 * FUNCȚIONALITĂȚI GENERALE BNR
 * Module comune pentru întregul sistem
 */

// Manager utilitar
const BNR_Utils = {
    // Formatare dată
    formatDate: function(date, format = 'dd.mm.yyyy') {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        
        switch(format) {
            case 'dd.mm.yyyy':
                return `${day}.${month}.${year}`;
            case 'dd.mm.yyyy HH:mm':
                return `${day}.${month}.${year} ${hours}:${minutes}`;
            case 'yyyy-mm-dd':
                return `${year}-${month}-${day}`;
            case 'full':
                const months = [
                    'ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie',
                    'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'
                ];
                const weekdays = ['duminică', 'luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă'];
                return `${weekdays[d.getDay()]}, ${day} ${months[d.getMonth()]} ${year}`;
            default:
                return `${day}.${month}.${year}`;
        }
    },
    
    // Formatare sumă bani
    formatMoney: function(amount, currency = 'LEI', decimals = 2) {
        return amount.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' ' + currency;
    },
    
    // Generare număr card
    generateCardNumber: function() {
        let number = '';
        for (let i = 0; i < 4; i++) {
            number += Math.floor(1000 + Math.random() * 9000);
            if (i < 3) number += ' ';
        }
        return number;
    },
    
    // Generare CVV
    generateCVV: function() {
        return Math.floor(100 + Math.random() * 900).toString();
    },
    
    // Generare dată expirare
    generateExpiryDate: function() {
        const now = new Date();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const year = (now.getFullYear() + 3).toString().slice(-2);
        return `${month}/${year}`;
    },
    
    // Validare email
    isValidEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // Validare telefon
    isValidPhone: function(phone) {
        const re = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return re.test(phone);
    },
    
    // Formatare telefon
    formatPhone: function(phone) {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 10) {
            return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (cleaned.length === 11) {
            return cleaned.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
        }
        return phone;
    },
    
    // Copiere clipboard
    copyToClipboard: function(text) {
        return navigator.clipboard.writeText(text)
            .then(() => true)
            .catch(() => false);
    },
    
    // Descărcare fișier
    downloadFile: function(content, filename, type = 'text/plain') {
        const blob = new Blob([content], { type: type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },
    
    // Mesaje notificare
    showNotification: function(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `bnr-notification bnr-notification-${type}`;
        
        const icons = {
            success: 'check-circle',
            error: 'times-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        
        notification.innerHTML = `
            <div class="bnr-notification-content">
                <i class="fas fa-${icons[type] || 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="bnr-notification-close">&times;</button>
        `;
        
        // Adaugă stiluri
        const style = document.createElement('style');
        style.textContent = `
            .bnr-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#d4edda' : 
                           type === 'error' ? '#f8d7da' : 
                           type === 'warning' ? '#fff3cd' : '#d1ecf1'};
                color: ${type === 'success' ? '#155724' : 
                        type === 'error' ? '#721c24' : 
                        type === 'warning' ? '#856404' : '#0c5460'};
                border: 1px solid ${type === 'success' ? '#c3e6cb' : 
                                  type === 'error' ? '#f5c6cb' : 
                                  type === 'warning' ? '#ffeaa7' : '#bee5eb'};
                border-radius: 8px;
                padding: 15px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 300px;
                max-width: 400px;
                z-index: 9999;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                animation: notificationSlideIn 0.3s ease;
            }
            
            .bnr-notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
                flex: 1;
            }
            
            .bnr-notification-close {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: inherit;
                opacity: 0.7;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .bnr-notification-close:hover {
                opacity: 1;
            }
            
            @keyframes notificationSlideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes notificationSlideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(notification);
        
        // Închidere la click
        notification.querySelector('.bnr-notification-close').addEventListener('click', () => {
            notification.style.animation = 'notificationSlideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Închidere automată
        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.animation = 'notificationSlideOut 0.3s ease';
                    setTimeout(() => notification.remove(), 300);
                }
            }, duration);
        }
        
        return notification;
    },
    
    // Confirmare acțiune
    showConfirmation: function(message, confirmText = 'Confirmă', cancelText = 'Anulează') {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'bnr-confirmation-modal';
            
            modal.innerHTML = `
                <div class="bnr-confirmation-content">
                    <div class="bnr-confirmation-message">${message}</div>
                    <div class="bnr-confirmation-buttons">
                        <button class="btn btn-secondary" id="bnr-confirm-cancel">${cancelText}</button>
                        <button class="btn btn-danger" id="bnr-confirm-ok">${confirmText}</button>
                    </div>
                </div>
            `;
            
            // Stiluri
            const style = document.createElement('style');
            style.textContent = `
                .bnr-confirmation-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                }
                
                .bnr-confirmation-content {
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    max-width: 400px;
                    width: 90%;
                    text-align: center;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    animation: confirmationFadeIn 0.3s ease;
                }
                
                .bnr-confirmation-message {
                    margin-bottom: 25px;
                    font-size: 16px;
                    line-height: 1.5;
                    color: #333;
                }
                
                .bnr-confirmation-buttons {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                }
                
                @keyframes confirmationFadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `;
            
            document.head.appendChild(style);
            document.body.appendChild(modal);
            
            // Gestionare butoane
            modal.querySelector('#bnr-confirm-cancel').addEventListener('click', () => {
                modal.remove();
                resolve(false);
            });
            
            modal.querySelector('#bnr-confirm-ok').addEventListener('click', () => {
                modal.remove();
                resolve(true);
            });
        });
    },
    
    // Încărcare
    showLoading: function(container, message = 'Se încarcă...') {
        const loading = document.createElement('div');
        loading.className = 'bnr-loading-overlay';
        
        loading.innerHTML = `
            <div class="bnr-loading-spinner">
                <div class="bnr-spinner"></div>
                <p>${message}</p>
            </div>
        `;
        
        // Stiluri
        const style = document.createElement('style');
        style.textContent = `
            .bnr-loading-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            
            .bnr-loading-spinner {
                text-align: center;
            }
            
            .bnr-spinner {
                width: 50px;
                height: 50px;
                border: 5px solid #f3f3f3;
                border-top: 5px solid #003366;
                border-radius: 50%;
                animation: bnr-spin 1s linear infinite;
                margin: 0 auto 15px;
            }
            
            @keyframes bnr-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        
        document.head.appendChild(style);
        container.style.position = 'relative';
        container.appendChild(loading);
        
        return loading;
    },
    
    hideLoading: function(loadingElement) {
        if (loadingElement && loadingElement.parentNode) {
            loadingElement.remove();
        }
    }
};

// Manager date demo (pentru testare)
const BNR_DemoData = {
    // Utilizatori demo
    users: [
        {
            id: 1,
            username: 'client',
            name: 'Ion Popescu',
            email: 'client@bnr.ro',
            phone: '+40 721 123 456',
            bank: 'BNR',
            role: 'client',
            status: 'active',
            createdAt: '2024-01-15',
            lastLogin: new Date().toISOString()
        },
        {
            id: 2,
            username: 'pult',
            name: 'Ana Ionescu',
            email: 'pult@bnr.ro',
            phone: '+40 721 234 567',
            bank: 'BNR',
            role: 'pult',
            status: 'active',
            createdAt: '2024-01-10',
            lastLogin: new Date().toISOString()
        },
        {
            id: 3,
            username: 'admin',
            name: 'Administrator Sistem',
            email: 'admin@bnr.ro',
            phone: '+40 721 345 678',
            bank: 'BNR',
            role: 'admin',
            status: 'active',
            createdAt: '2024-01-01',
            lastLogin: new Date().toISOString()
        },
        {
            id: 4,
            username: 'Lorde_Macalister',
            name: 'Super Administrator',
            email: 'superadmin@bnr.ro',
            phone: '+40 721 456 789',
            bank: 'BNR',
            role: 'superadmin',
            status: 'active',
            createdAt: '2024-01-01',
            lastLogin: new Date().toISOString()
        }
    ],
    
    // Credite demo
    loans: [
        {
            id: 1,
            userId: 1,
            contractNumber: 'CRD-2024-001',
            amount: 50000,
            paid: 15000,
            rate: 8.5,
            term: 24,
            monthlyPayment: 2500,
            startDate: '2023-01-15',
            endDate: '2025-01-15',
            status: 'active'
        },
        {
            id: 2,
            userId: 5,
            contractNumber: 'CRD-2024-002',
            amount: 25000,
            paid: 5000,
            rate: 9.0,
            term: 12,
            monthlyPayment: 2250,
            startDate: '2024-01-10',
            endDate: '2025-01-10',
            status: 'active'
        }
    ],
    
    // Plăți demo
    payments: [
        {
            id: 1,
            loanId: 1,
            userId: 1,
            amount: 2500,
            date: '2024-01-15',
            type: 'monthly',
            status: 'completed',
            executor: 'system'
        },
        {
            id: 2,
            loanId: 1,
            userId: 1,
            amount: 2500,
            date: '2023-12-15',
            type: 'monthly',
            status: 'completed',
            executor: 'system'
        },
        {
            id: 3,
            loanId: 1,
            userId: 1,
            amount: 5000,
            date: '2023-11-15',
            type: 'early',
            status: 'completed',
            executor: 'pult'
        }
    ],
    
    // Specialiști demo
    specialists: [
        {
            id: 1,
            name: 'Maria Popescu',
            position: 'Specialist Senior Credit',
            email: 'maria.popescu@bnr.ro',
            phone: '+40 21 200 00 00',
            mobile: '+40 721 123 456',
            experience: '8 ani',
            schedule: 'Lun-Vin: 9:00 - 18:00',
            assignedUsers: [1, 5]
        }
    ],
    
    // Metode de obținere date
    getUserById: function(id) {
        return this.users.find(user => user.id === id);
    },
    
    getLoanByUserId: function(userId) {
        return this.loans.find(loan => loan.userId === userId);
    },
    
    getPaymentsByLoanId: function(loanId) {
        return this.payments.filter(payment => payment.loanId === loanId);
    },
    
    getSpecialistByUserId: function(userId) {
        const specialist = this.specialists.find(s => 
            s.assignedUsers.includes(userId)
        );
        return specialist || this.specialists[0];
    }
};

// Manager interfață
const BNR_UI = {
    // Inițializare meniu mobil
    initMobileMenu: function() {
        const toggleBtn = document.querySelector('.mobile-menu-toggle');
        const sidebar = document.querySelector('.sidebar-bnr');
        const overlay = document.querySelector('.sidebar-overlay');
        
        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', () => {
                sidebar.classList.toggle('active');
                if (overlay) overlay.classList.toggle('active');
            });
            
            if (overlay) {
                overlay.addEventListener('click', () => {
                    sidebar.classList.remove('active');
                    overlay.classList.remove('active');
                });
            }
        }
    },
    
    // Actualizare indicator activitate
    updateActivityIndicator: function() {
        const indicator = document.querySelector('.activity-indicator');
        if (indicator) {
            const now = new Date();
            const lastActivity = localStorage.getItem('last_activity') || now.toISOString();
            const diff = now - new Date(lastActivity);
            
            if (diff > 300000) { // 5 minute
                indicator.classList.add('inactive');
            } else {
                indicator.classList.remove('inactive');
            }
        }
    },
    
    // Formatare tabel
    initDataTable: function(tableId, options = {}) {
        const table = document.getElementById(tableId);
        if (!table) return;
        
        // Adaugă funcționalitate de sortare
        const headers = table.querySelectorAll('thead th[data-sort]');
        headers.forEach(header => {
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => {
                this.sortTable(table, header.cellIndex);
            });
        });
        
        // Adaugă paginare dacă este necesar
        if (options.pagination) {
            this.addPagination(table, options);
        }
    },
    
    // Sortare tabel
    sortTable: function(table, columnIndex) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const isAsc = table.getAttribute('data-sort-dir') !== 'asc';
        
        rows.sort((a, b) => {
            const aValue = a.cells[columnIndex].textContent.trim();
            const bValue = b.cells[columnIndex].textContent.trim();
            
            // Încearcă conversie numerică
            const aNum = parseFloat(aValue.replace(/[^\d.-]/g, ''));
            const bNum = parseFloat(bValue.replace(/[^\d.-]/g, ''));
            
            if (!isNaN(aNum) && !isNaN(bNum)) {
                return isAsc ? aNum - bNum : bNum - aNum;
            }
            
            // Sortare text
            return isAsc ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        });
        
        // Actualizează tabel
        rows.forEach(row => tbody.appendChild(row));
        table.setAttribute('data-sort-dir', isAsc ? 'asc' : 'desc');
    },
    
    // Adăugare paginare
    addPagination: function(table, options) {
        const rows = table.querySelectorAll('tbody tr');
        const pageSize = options.pageSize || 10;
        const pageCount = Math.ceil(rows.length / pageSize);
        
        if (pageCount <= 1) return;
        
        // Ascunde toate rândurile
        rows.forEach((row, index) => {
            row.style.display = index < pageSize ? '' : 'none';
            row.dataset.pageIndex = Math.floor(index / pageSize);
        });
        
        // Creează paginare
        const pagination = document.createElement('div');
        pagination.className = 'bnr-pagination';
        
        for (let i = 0; i < pageCount; i++) {
            const btn = document.createElement('button');
            btn.className = 'btn btn-sm btn-outline';
            btn.textContent = i + 1;
            btn.dataset.page = i;
            
            if (i === 0) btn.classList.add('active');
            
            btn.addEventListener('click', (e) => {
                const page = parseInt(e.target.dataset.page);
                this.showTablePage(table, page, pageSize);
                
                // Actualizează butoane active
                pagination.querySelectorAll('button').forEach(b => {
                    b.classList.remove('active');
                });
                e.target.classList.add('active');
            });
            
            pagination.appendChild(btn);
        }
        
        table.parentNode.insertBefore(pagination, table.nextSibling);
    },
    
    // Afișare pagină tabel
    showTablePage: function(table, page, pageSize) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const rowPage = parseInt(row.dataset.pageIndex);
            row.style.display = rowPage === page ? '' : 'none';
        });
    },
    
    // Actualizare contor sesiune
    updateSessionTimer: function() {
        const timerElement = document.getElementById('sessionTimer');
        if (!timerElement) return;
        
        const sessionStart = localStorage.getItem('session_start');
        if (!sessionStart) return;
        
        const updateTimer = () => {
            const now = new Date();
            const start = new Date(sessionStart);
            const diff = now - start;
            const minutes = Math.floor(diff / 60000);
            
            timerElement.textContent = `Sesiune: ${minutes} minute`;
            
            // Avertizare la 25 de minute
            if (minutes >= 25 && minutes < 30) {
                timerElement.classList.add('warning');
            }
            
            // Expirare la 30 de minute
            if (minutes >= 30) {
                BNR_Auth.logout();
            }
        };
        
        updateTimer();
        setInterval(updateTimer, 60000); // Actualizează la fiecare minut
    },
    
    // Inițializare tooltips
    initTooltips: function() {
        const elements = document.querySelectorAll('[data-tooltip]');
        elements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'bnr-tooltip';
                tooltip.textContent = e.target.dataset.tooltip;
                document.body.appendChild(tooltip);
                
                const rect = e.target.getBoundingClientRect();
                tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
                tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
                
                e.target._tooltip = tooltip;
            });
            
            element.addEventListener('mouseleave', (e) => {
                if (e.target._tooltip) {
                    e.target._tooltip.remove();
                    delete e.target._tooltip;
                }
            });
        });
    }
};

// Inițializare globală
document.addEventListener('DOMContentLoaded', function() {
    // Inițializare meniu mobil
    BNR_UI.initMobileMenu();
    
    // Actualizare indicator activitate
    BNR_UI.updateActivityIndicator();
    
    // Inițializare tooltips
    BNR_UI.initTooltips();
    
    // Actualizare timer sesiune
    BNR_UI.updateSessionTimer();
    
    // Salvare timp start sesiune
    if (!localStorage.getItem('session_start')) {
        localStorage.setItem('session_start', new Date().toISOString());
    }
    
    // Actualizare activitate la fiecare acțiune
    document.addEventListener('click', () => {
        localStorage.setItem('last_activity', new Date().toISOString());
        BNR_UI.updateActivityIndicator();
    });
    
    // Prevenire copiere parole
    document.querySelectorAll('input[type="password"]').forEach(input => {
        input.addEventListener('copy', (e) => e.preventDefault());
        input.addEventListener('paste', (e) => e.preventDefault());
        input.addEventListener('cut', (e) => e.preventDefault());
    });
});

// Export pentru utilizare globală
window.BNR_Utils = BNR_Utils;
window.BNR_DemoData = BNR_DemoData;
window.BNR_UI = BNR_UI;