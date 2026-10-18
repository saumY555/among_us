/**
 * Among Us: Emergency Meeting Night
 * Main Application Logic (Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  // --------------------------------------------------------------------------
  // 2. LIVE COUNTDOWN TIMER
  // Target: Saturday, 17th October 2026 at 5:00 PM (17:00:00)
  // --------------------------------------------------------------------------
  // Month is 0-indexed in JavaScript Date constructor (9 = October)
  const EVENT_DATE = new Date(2026, 9, 17, 17, 0, 0).getTime();

  const daysEl = document.getElementById('daysCount');
  const hoursEl = document.getElementById('hoursCount');
  const minsEl = document.getElementById('minsCount');
  const secsEl = document.getElementById('secsCount');
  const countdownGrid = document.getElementById('countdownGrid');
  const countdownStarted = document.getElementById('countdownStarted');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = EVENT_DATE - now;

    if (distance <= 0) {
      // Event has commenced
      if (countdownGrid && countdownStarted) {
        countdownGrid.classList.add('hidden');
        countdownStarted.classList.remove('hidden');
        countdownStarted.textContent = '🚨 The meeting has started! 🚨';
      }
      return;
    }

    // Time calculations
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Format with leading zeros
    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
  }

  // Initial call and run every second
  updateCountdown();
  const countdownInterval = setInterval(updateCountdown, 1000);

  // --------------------------------------------------------------------------
  // 3. MOBILE NAVIGATION TOGGLE (HAMBURGER MENU)
  // --------------------------------------------------------------------------
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
      hamburgerBtn.setAttribute('aria-expanded', String(!isExpanded));
      hamburgerBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking on any navigation link
    const navLinks = navMenu.querySelectorAll('.nav-link, .btn-nav-cta');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. CREWMATE COLOR PICKER & SUIT VISUALIZER
  // --------------------------------------------------------------------------
  const colorDots = document.querySelectorAll('.color-dot');
  const selectedColorNameEl = document.getElementById('selectedColorName');
  let currentSuitColor = '#F45858';
  let currentSuitName = 'Red';

  colorDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      // Update radio state
      colorDots.forEach((d) => {
        d.classList.remove('active');
        d.setAttribute('aria-checked', 'false');
      });

      dot.classList.add('active');
      dot.setAttribute('aria-checked', 'true');

      // Update active color token
      const colorHex = dot.getAttribute('data-color');
      const colorName = dot.getAttribute('data-color-name');
      currentSuitColor = colorHex;
      currentSuitName = colorName;

      // Update CSS variable on document for reactive live preview
      document.documentElement.style.setProperty('--crewmate-active-color', colorHex);
      if (selectedColorNameEl) {
        selectedColorNameEl.textContent = `${colorName} (${colorHex})`;
      }
    });
  });

  // --------------------------------------------------------------------------
  // 5. REGISTRATION FORM VALIDATION & FRIENDLY MESSAGING
  // --------------------------------------------------------------------------
  const regForm = document.getElementById('registrationForm');
  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const phoneError = document.getElementById('phoneError');

  // Modal elements
  const emergencyModal = document.getElementById('emergencyModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const ackModalBtn = document.getElementById('ackModalBtn');
  const modalRegisteredName = document.getElementById('modalRegisteredName');
  const modalRegisteredColor = document.getElementById('modalRegisteredColor');
  const modalCrewmateDisplay = document.getElementById('modalCrewmateDisplay');

  function validateEmail(email) {
    // Standard RFC-compliant email regular expression
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function validatePhone(phone) {
    if (!phone || phone.trim() === '') return true; // Phone is optional
    // Allow digits, spaces, hyphens, plus sign, min 7 chars
    const re = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;
    return re.test(phone.trim());
  }

  // Clear errors on field input
  if (fullNameInput) {
    fullNameInput.addEventListener('input', () => {
      fullNameInput.classList.remove('input-error');
      if (nameError) nameError.textContent = '';
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      emailInput.classList.remove('input-error');
      if (emailError) emailError.textContent = '';
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      phoneInput.classList.remove('input-error');
      if (phoneError) phoneError.textContent = '';
    });
  }

  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const nameVal = fullNameInput.value.trim();
      const emailVal = emailInput.value.trim();
      const phoneVal = phoneInput.value.trim();

      // Validate Name
      if (!nameVal || nameVal.length < 2) {
        isValid = false;
        fullNameInput.classList.add('input-error');
        if (nameError) nameError.textContent = 'Please enter your crewmate name / callsign (min 2 characters).';
      }

      // Validate Email
      if (!emailVal || !validateEmail(emailVal)) {
        isValid = false;
        emailInput.classList.add('input-error');
        if (emailError) emailError.textContent = 'Please provide a valid student comms email address.';
      }

      // Validate Phone (optional)
      if (phoneVal && !validatePhone(phoneVal)) {
        isValid = false;
        phoneInput.classList.add('input-error');
        if (phoneError) phoneError.textContent = 'Please enter a valid comms frequency / phone number.';
      }

      if (!isValid) return;

      // SUCCESS: No data sent externally. Show EMERGENCY MEETING modal!
      if (modalRegisteredName) modalRegisteredName.textContent = nameVal;
      if (modalRegisteredColor) modalRegisteredColor.textContent = `${currentSuitName} (${currentSuitColor})`;

      // Update modal crewmate illustration color
      if (modalCrewmateDisplay) {
        modalCrewmateDisplay.style.color = currentSuitColor;
        const shapes = modalCrewmateDisplay.querySelectorAll('.crewmate-body-shape');
        shapes.forEach((s) => (s.style.fill = currentSuitColor));
      }

      // Open modal
      openEmergencyModal();

      // Reset form fields
      regForm.reset();
      // Keep selected color indicator
      document.documentElement.style.setProperty('--crewmate-active-color', currentSuitColor);
    });
  }

  // --------------------------------------------------------------------------
  // 6. EMERGENCY MEETING POPUP MODAL HANDLERS
  // --------------------------------------------------------------------------
  function openEmergencyModal() {
    if (!emergencyModal) return;
    emergencyModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    if (ackModalBtn) ackModalBtn.focus();
    // Re-trigger lucide icons inside modal if needed
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  function closeEmergencyModal() {
    if (!emergencyModal) return;
    emergencyModal.classList.add('hidden');
    document.body.style.overflow = ''; // Restore background scrolling
    if (fullNameInput) fullNameInput.focus();
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeEmergencyModal);
  if (ackModalBtn) ackModalBtn.addEventListener('click', closeEmergencyModal);

  // Close modal when clicking backdrop outside card
  if (emergencyModal) {
    emergencyModal.addEventListener('click', (e) => {
      if (e.target === emergencyModal) {
        closeEmergencyModal();
      }
    });
  }

  // Close modal on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && emergencyModal && !emergencyModal.classList.contains('hidden')) {
      closeEmergencyModal();
    }
  });

  // --------------------------------------------------------------------------
  // 7. SECTIONS FADE-IN ON SCROLL (INTERSECTION OBSERVER)
  // --------------------------------------------------------------------------
  const animatedElements = document.querySelectorAll(
    '.panel-card, .tasks-panel, .section-header, .hud-chip, .countdown-panel'
  );

  animatedElements.forEach((el) => {
    el.classList.add('fade-in-on-scroll');
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    animatedElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver is not available
    animatedElements.forEach((el) => el.classList.add('is-visible'));
  }
});
