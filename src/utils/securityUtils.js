/**
 * Security Utilities for Admin Authentication
 * Implements client-side security measures (defense in depth)
 */

const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;
const ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes

class SecurityManager {
  constructor() {
    this.storageKey = 'admin_login_attempts';
  }

  /**
   * Get login attempt data from storage
   */
  getAttempts() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : { count: 0, timestamps: [], lockedUntil: null };
    } catch {
      return { count: 0, timestamps: [], lockedUntil: null };
    }
  }

  /**
   * Check if account is currently locked
   */
  isLocked() {
    const attempts = this.getAttempts();
    
    if (attempts.lockedUntil) {
      const now = Date.now();
      if (now < attempts.lockedUntil) {
        const remainingMinutes = Math.ceil((attempts.lockedUntil - now) / 60000);
        return {
          locked: true,
          remainingMinutes,
          message: `Account locked. Try again in ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}.`
        };
      } else {
        // Lock expired, reset
        this.resetAttempts();
        return { locked: false };
      }
    }
    
    return { locked: false };
  }

  /**
   * Record a failed login attempt
   */
  recordFailedAttempt() {
    const attempts = this.getAttempts();
    const now = Date.now();
    
    // Remove attempts older than the window
    const recentTimestamps = attempts.timestamps.filter(
      timestamp => now - timestamp < ATTEMPT_WINDOW
    );
    
    recentTimestamps.push(now);
    
    const newCount = recentTimestamps.length;
    
    // Check if we should lock the account
    if (newCount >= MAX_ATTEMPTS) {
      const lockUntil = now + LOCKOUT_DURATION;
      localStorage.setItem(this.storageKey, JSON.stringify({
        count: newCount,
        timestamps: recentTimestamps,
        lockedUntil: lockUntil
      }));
      
      return {
        shouldLock: true,
        attemptsRemaining: 0,
        message: `Too many failed attempts. Account locked for ${LOCKOUT_DURATION / 60000} minutes.`
      };
    }
    
    // Update attempts
    localStorage.setItem(this.storageKey, JSON.stringify({
      count: newCount,
      timestamps: recentTimestamps,
      lockedUntil: null
    }));
    
    const remaining = MAX_ATTEMPTS - newCount;
    return {
      shouldLock: false,
      attemptsRemaining: remaining,
      message: remaining === 1 
        ? 'Warning: 1 attempt remaining before lockout.'
        : `${remaining} attempts remaining.`
    };
  }

  /**
   * Reset attempts after successful login
   */
  resetAttempts() {
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Get remaining attempts
   */
  getRemainingAttempts() {
    const lockStatus = this.isLocked();
    if (lockStatus.locked) {
      return 0;
    }
    
    const attempts = this.getAttempts();
    const now = Date.now();
    const recentAttempts = attempts.timestamps.filter(
      timestamp => now - timestamp < ATTEMPT_WINDOW
    ).length;
    
    return Math.max(0, MAX_ATTEMPTS - recentAttempts);
  }

  /**
   * Add delay to prevent rapid-fire requests (client-side rate limiting)
   */
  async enforceDelay() {
    const lastAttemptKey = 'last_login_attempt';
    const lastAttempt = localStorage.getItem(lastAttemptKey);
    const minDelay = 2000; // 2 seconds between attempts
    
    if (lastAttempt) {
      const timeSince = Date.now() - parseInt(lastAttempt);
      if (timeSince < minDelay) {
        await new Promise(resolve => setTimeout(resolve, minDelay - timeSince));
      }
    }
    
    localStorage.setItem(lastAttemptKey, Date.now().toString());
  }

  /**
   * Log security event (for monitoring)
   */
  logSecurityEvent(event, details = {}) {
    const securityLog = {
      timestamp: new Date().toISOString(),
      event,
      userAgent: navigator.userAgent,
      ...details
    };
    
    // In production, send this to your backend logging service
    console.warn('🔒 Security Event:', securityLog);
    
    // Store locally for audit (optional)
    try {
      const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
      logs.push(securityLog);
      // Keep only last 50 logs
      if (logs.length > 50) logs.shift();
      localStorage.setItem('security_logs', JSON.stringify(logs));
    } catch (e) {
      // Storage full or unavailable
    }
  }
}

export const securityManager = new SecurityManager();

/**
 * Sanitize input to prevent XSS
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim();
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check password strength
 */
export const checkPasswordStrength = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const strength = {
    length: password.length >= minLength,
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChar,
    isStrong: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers
  };
  
  return strength;
};
