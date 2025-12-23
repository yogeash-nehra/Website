// ===================================
// WG Holdings - Utility Functions
// ===================================

// ===================================
// Form Validation
// ===================================

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    // New Zealand phone number format
    const re = /^(\+64|0)[2-9]\d{7,9}$/;
    return re.test(phone.replace(/\s/g, ''));
}

function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        // Remove previous error messages
        const existingError = input.parentElement.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Validate based on input type
        if (!input.value.trim()) {
            showInputError(input, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && !validateEmail(input.value)) {
            showInputError(input, 'Please enter a valid email address');
            isValid = false;
        } else if (input.type === 'tel' && !validatePhone(input.value)) {
            showInputError(input, 'Please enter a valid phone number');
            isValid = false;
        }
    });
    
    return isValid;
}

function showInputError(input, message) {
    input.style.borderColor = '#dc2626';
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    input.parentElement.appendChild(errorDiv);
}

function clearInputError(input) {
    input.style.borderColor = '';
    const errorDiv = input.parentElement.querySelector('.form-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// ===================================
// Local Storage Helper
// ===================================

const storage = {
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            return false;
        }
    },
    
    get: function(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return null;
        }
    },
    
    remove: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Error removing from localStorage:', e);
            return false;
        }
    },
    
    clear: function() {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Error clearing localStorage:', e);
            return false;
        }
    }
};

// ===================================
// Date & Time Utilities
// ===================================

function formatDate(date, format = 'DD/MM/YYYY') {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    const formats = {
        'DD/MM/YYYY': `${day}/${month}/${year}`,
        'MM/DD/YYYY': `${month}/${day}/${year}`,
        'YYYY-MM-DD': `${year}-${month}-${day}`,
        'DD MMM YYYY': `${day} ${getMonthName(d.getMonth())} ${year}`
    };
    
    return formats[format] || formats['DD/MM/YYYY'];
}

function getMonthName(monthIndex) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthIndex];
}

// ===================================
// URL & Query String Utilities
// ===================================

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function getAllQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};
    for (const [key, value] of urlParams) {
        params[key] = value;
    }
    return params;
}

function updateQueryParam(param, value) {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.pushState({}, '', url);
}

// ===================================
// String Utilities
// ===================================

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}

function truncate(str, length = 100, ending = '...') {
    if (str.length > length) {
        return str.substring(0, length - ending.length) + ending;
    }
    return str;
}

// ===================================
// Number & Currency Utilities
// ===================================

function formatCurrency(amount, currency = 'NZD') {
    return new Intl.NumberFormat('en-NZ', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

function formatNumber(number) {
    return new Intl.NumberFormat('en-NZ').format(number);
}

// ===================================
// Array Utilities
// ===================================

function chunk(array, size) {
    const chunked = [];
    for (let i = 0; i < array.length; i += size) {
        chunked.push(array.slice(i, i + size));
    }
    return chunked;
}

function shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function unique(array) {
    return [...new Set(array)];
}

// ===================================
// DOM Utilities
// ===================================

function createElement(tag, className = '', content = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.textContent = content;
    return element;
}

function removeElement(element) {
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
}

function hasClass(element, className) {
    return element.classList.contains(className);
}

// ===================================
// Cookie Utilities
// ===================================

const cookies = {
    set: function(name, value, days = 7) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/`;
    },
    
    get: function(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    
    delete: function(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
    }
};

// ===================================
// Performance Utilities
// ===================================

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===================================
// Async Utilities
// ===================================

async function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// ===================================
// Accessibility Utilities
// ===================================

function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
}

// ===================================
// Export utilities (if using modules)
// ===================================

// Uncomment if using ES6 modules
/*
export {
    validateEmail,
    validatePhone,
    validateForm,
    storage,
    formatDate,
    getQueryParam,
    formatCurrency,
    cookies,
    throttle,
    debounce,
    fetchData
};
*/

