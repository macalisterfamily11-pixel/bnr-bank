/**
 * SISTEM DE AUTENTIFICARE BNR
 * Gestiune utilizatori, roluri și securitate
 */

const BNR_Auth = {
    // Configurație sistem
    config: {
        sessionTimeout: 30 * 60 * 1000, // 30 minute
        maxLoginAttempts: 5,
        captchaRequired: true
    },
    
    // Utilizatori demo (în producție - înlocuit cu backend)
    users: {
        'client': {
            password: 'Client123!',
            role: 'client',
            name: 'Ion Popescu',
            email: 'client@bnr.ro',
            phone: '+40 721 123 456',
            bank: 'BNR',
            credit: {
                total: 50000,
                paid: 15000,
                rate: 8.5,
                term: 24,
                monthly: 2500
            },
            card: {
                number: '4893 4756 9012 3456',
                expiry: '08/27',
                cvv: '123'
            },
            specialist: 'Maria Popescu'
        },
        'pult': {
            password: 'PultOperator123!',
            role: 'pult',
            name: 'Ana Ionescu',
            email: 'pult@bnr.ro',
            phone: '+40 721 234 567',
            bank: 'BNR',
            permissions: ['view_users', 'edit_loans', 'view_payments']
        },
        'admin': {
            password: 'AdminSecure123!',
            role: 'admin',
            name: 'Administrator Sistem',
            email: 'admin@bnr.ro',
            phone: '+40 721 345 678',
            bank: 'BNR',
            permissions: ['all']
        },
        'Lorde_Macalister': {
            password: 'Shunia03SMacalister',
            role: 'superadmin',
            name: 'Super Administrator',
            email: 'superadmin@bnr.ro',
            phone: '+40 721 456 789',
            bank: 'BNR',
            permissions: ['all']
        }
    },
    
    // Stare curentă
    state: {
        currentUser: null,
        loginAttempts: 0,
        lastActivity: null
    },
    
    // Initializare
    init: function() {
        this.restoreSession();
        this.startActivityMonitor();
    },
    
    // Autentificare utilizator
    login: function(username, password, bank) {
        // Verificare captcha (dacă este activată)
        if (this.config.captchaRequired) {
            const captchaAnswer = sessionStorage.getItem('captchaCorect');
            const userAnswer = sessionStorage.getItem('userCaptchaAnswer');
            
            if (!captchaAnswer || !userAnswer || captchaAnswer !== userAnswer) {
                throw new Error('Captcha invalidă sau expirată');
            }
        }
        
        // Verificare blocare cont
        if (this.state.loginAttempts >= this.config.maxLoginAttempts) {
            throw new Error('Cont blocat temporar. Încercați mai târziu.');
        }
        
        // Verificare credențiale
        const user = this.users[username];
        
        if (!user || user.password !== password) {
            this.state.loginAttempts++;
            throw new Error('Nume utilizator sau parolă incorectă');
        }
        
        // Resetare încercări
        this.state.loginAttempts = 0;
        
        // Creare sesiune
        this.state.currentUser = {
            username: username,
            name: user.name,
            role: user.role,
            bank: bank,
            data: user,
            loginTime: new Date().toISOString(),
            sessionId: this.generateSessionId()
        };
        
        // Salvare sesiune
        this.saveSession();
        
        // Logare activitate
        this.logActivity('login', 'Autentificare reușită');
        
        return this.state.currentUser;
    },
    
    // Deconectare
    logout: function() {
        if (this.state.currentUser) {
            this.logActivity('logout', 'Deconectare utilizator');
        }
        
        this.state.currentUser = null;
        localStorage.removeItem('bnr_session');
        sessionStorage.clear();
        
        window.location.href = 'index.html';
    },
    
    // Verificare autentificare
    isAuthenticated: function() {
        return this.state.currentUser !== null;
    },
    
    // Verificare rol
    hasRole: function(role) {
        if (!this.isAuthenticated()) return false;
        
        // Super-admin are toate rolurile
        if (this.state.currentUser.role === 'superadmin') return true;
        
        return this.state.currentUser.role === role;
    },
    
    // Verificare permisiune
    hasPermission: function(permission) {
        if (!this.isAuthenticated()) return false;
        
        const user = this.users[this.state.currentUser.username];
        
        // Super-admin are toate permisiunile
        if (this.state.currentUser.role === 'superadmin') return true;
        
        // Verificare permisiuni specifice
        if (user.permissions) {
            return user.permissions.includes('all') || user.permissions.includes(permission);
        }
        
        return false;
    },
    
    // Obținere utilizator curent
    getCurrentUser: function() {
        return this.state.currentUser;
    },
    
    // Schimbare parolă
    changePassword: function(oldPassword, newPassword) {
        if (!this.isAuthenticated()) {
            throw new Error('Utilizator neautentificat');
        }
        
        const username = this.state.currentUser.username;
        const user = this.users[username];
        
        // Verificare parolă veche
        if (user.password !== oldPassword) {
            throw new Error('Parola veche incorectă');
        }
        
        // Validare parolă nouă
        if (!this.validatePassword(newPassword)) {
            throw new Error('Parola nouă nu respectă cerințele de securitate');
        }
        
        // Actualizare parolă (în demo, în producție - backend)
        user.password = newPassword;
        
        // Logare activitate
        this.logActivity('password_change', 'Parolă schimbată');
        
        return true;
    },
    
    // Validare parolă
    validatePassword: function(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return password.length >= minLength && 
               hasUpperCase && 
               hasLowerCase && 
               hasNumbers && 
               hasSpecial;
    },
    
    // Generare sesiune ID
    generateSessionId: function() {
        return 'BNR_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },
    
    // Salvare sesiune
    saveSession: function() {
        if (this.state.currentUser) {
            const sessionData = {
                user: this.state.currentUser,
                timestamp: Date.now()
            };
            
            localStorage.setItem('bnr_session', JSON.stringify(sessionData));
        }
    },
    
    // Restaurare sesiune
    restoreSession: function() {
        try {
            const sessionData = JSON.parse(localStorage.getItem('bnr_session'));
            
            if (sessionData) {
                const now = Date.now();
                const sessionAge = now - sessionData.timestamp;
                
                // Verificare expirare sesiune
                if (sessionAge < this.config.sessionTimeout) {
                    this.state.currentUser = sessionData.user;
                    this.state.lastActivity = now;
                } else {
                    localStorage.removeItem('bnr_session');
                }
            }
        } catch (error) {
            console.error('Eroare restaurare sesiune:', error);
            localStorage.removeItem('bnr_session');
        }
    },
    
    // Monitorizare activitate
    startActivityMonitor: function() {
        document.addEventListener('mousemove', () => this.updateActivity());
        document.addEventListener('keypress', () => this.updateActivity());
        document.addEventListener('click', () => this.updateActivity());
        
        // Verificare periodică expirare
        setInterval(() => this.checkSessionTimeout(), 60000); // La fiecare minut
    },
    
    // Actualizare activitate
    updateActivity: function() {
        this.state.lastActivity = Date.now();
    },
    
    // Verificare expirare sesiune
    checkSessionTimeout: function() {
        if (this.state.lastActivity && this.isAuthenticated()) {
            const now = Date.now();
            const idleTime = now - this.state.lastActivity;
            
            if (idleTime > this.config.sessionTimeout) {
                alert('Sesiune expirată din cauza inactivității. Vă rugăm să vă autentificați din nou.');
                this.logout();
            }
        }
    },
    
    // Logare activitate
    logActivity: function(action, details) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            user: this.state.currentUser?.username || 'system',
            action: action,
            details: details,
            ip: '127.0.0.1' // În producție - obținut din backend
        };
        
        // În demo - salvare în localStorage
        const logs = JSON.parse(localStorage.getItem('bnr_activity_logs') || '[]');
        logs.unshift(logEntry);
        
        // Păstrare doar ultimele 1000 log-uri
        if (logs.length > 1000) {
            logs.pop();
        }
        
        localStorage.setItem('bnr_activity_logs', JSON.stringify(logs));
        
        console.log('LOG:', logEntry);
    },
    
    // Obținere log-uri activitate
    getActivityLogs: function(limit = 50) {
        const logs = JSON.parse(localStorage.getItem('bnr_activity_logs') || '[]');
        return logs.slice(0, limit);
    },
    
    // Generare captcha
    generateCaptcha: function() {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const answer = num1 + num2;
        
        return {
            question: `${num1} + ${num2} = ?`,
            answer: answer.toString()
        };
    },
    
    // Verificare captcha
    verifyCaptcha: function(userAnswer) {
        const correctAnswer = sessionStorage.getItem('captchaCorect');
        return userAnswer === correctAnswer;
    },
    
    // Generare parolă temporară
    generateTempPassword: function(length = 12) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';
        
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return password;
    },
    
    // Resetare parolă utilizator
    resetUserPassword: function(username) {
        if (!this.hasPermission('reset_passwords')) {
            throw new Error('Permisiune insuficientă');
        }
        
        const user = this.users[username];
        if (!user) {
            throw new Error('Utilizator negăsit');
        }
        
        const tempPassword = this.generateTempPassword();
        user.password = tempPassword;
        
        // Logare activitate
        this.logActivity('password_reset', `Parola resetată pentru ${username}`);
        
        return tempPassword;
    }
};

// Initializare automată
document.addEventListener('DOMContentLoaded', function() {
    BNR_Auth.init();
});

// Export pentru utilizare globală
window.BNR_Auth = BNR_Auth;