/* ==========================================================================
   Nedus Trading - Interactive Logic (JavaScript)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* --- Scroll Header Navigation --- */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Dynamic Active Navigation Link based on scroll position
        spyNavigation();
    });

    function spyNavigation() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        let currentSection = 'home';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    /* --- Mobile Menu Toggle --- */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        const icon = mobileToggle.querySelector('i');
        if (navMenu.classList.contains('open')) {
            icon.setAttribute('data-lucide', 'x');
        } else {
            icon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons();
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            const icon = mobileToggle.querySelector('i');
            icon.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        });
    });


    /* --- Services Tab Switching --- */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active classes
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });


    /* --- Sourcing & Cargo Calculator --- */
    const calculateBtn = document.getElementById('calculate-btn');
    const sendToFormBtn = document.getElementById('send-to-form-btn');
    
    const weightInput = document.getElementById('cargo-weight');
    const volumeInput = document.getElementById('cargo-volume');
    const lengthInput = document.getElementById('dim-length');
    const widthInput = document.getElementById('dim-width');
    const heightInput = document.getElementById('dim-height');
    const shipModeSelect = document.getElementById('ship-mode');
    const categorySelect = document.getElementById('prod-cat');

    const resWeight = document.getElementById('res-weight');
    const resVolume = document.getElementById('res-volume');
    const resVolumetric = document.getElementById('res-volumetric');
    const resBillable = document.getElementById('res-billable');
    const resTransit = document.getElementById('res-transit');

    // Auto-calculate CBM volume when package dimensions change
    function updateVolumeFromDimensions() {
        const l = parseFloat(lengthInput.value) || 0;
        const w = parseFloat(widthInput.value) || 0;
        const h = parseFloat(heightInput.value) || 0;
        
        if (l > 0 && w > 0 && h > 0) {
            // Formula: Length(m) * Width(m) * Height(m)
            const cbm = (l * w * h) / 1000000;
            volumeInput.value = cbm.toFixed(3);
        }
    }

    [lengthInput, widthInput, heightInput].forEach(input => {
        input.addEventListener('input', updateVolumeFromDimensions);
    });

    function performCalculation() {
        const weight = parseFloat(weightInput.value) || 0;
        const volume = parseFloat(volumeInput.value) || 0;
        const l = parseFloat(lengthInput.value) || 0;
        const w = parseFloat(widthInput.value) || 0;
        const h = parseFloat(heightInput.value) || 0;
        const mode = shipModeSelect.value;

        // Volumetric weight: (L * W * H) / 5000
        const volumetricWeight = (l * w * h) / 5000;
        const billableWeight = Math.max(weight, volumetricWeight);

        // Display results
        resWeight.textContent = `${weight.toFixed(1)} kg`;
        resVolume.textContent = `${volume.toFixed(3)} CBM`;
        resVolumetric.textContent = `${volumetricWeight.toFixed(1)} kg`;
        resBillable.textContent = `${billableWeight.toFixed(1)} kg`;

        // Update transit time based on mode
        let transitTime = '';
        switch(mode) {
            case 'express':
                transitTime = '5 - 8 Days (Fast Air)';
                break;
            case 'air-cargo':
                transitTime = '10 - 15 Days (Economy Air)';
                break;
            case 'sea-lcl':
                transitTime = '30 - 45 Days (Sea LCL)';
                break;
            case 'sea-fcl':
                transitTime = '25 - 40 Days (Sea FCL Container)';
                break;
            default:
                transitTime = 'Calculated on request';
        }
        resTransit.textContent = transitTime;
    }

    calculateBtn.addEventListener('click', performCalculation);
    // Perform initial calculations
    performCalculation();


    /* --- Send Calculator Data to Contact Form --- */
    sendToFormBtn.addEventListener('click', () => {
        performCalculation(); // make sure data is fresh
        
        const catText = categorySelect.options[categorySelect.selectedIndex].text;
        const modeText = shipModeSelect.options[shipModeSelect.selectedIndex].text;
        const weight = parseFloat(weightInput.value) || 0;
        const volume = parseFloat(volumeInput.value) || 0;
        const billable = resBillable.textContent;
        const transit = resTransit.textContent;

        const messageText = `Sourcing Inquiry Details (Calculated):
----------------------------------
Product Category: ${catText}
Actual Weight: ${weight} kg
Cargo Volume: ${volume} CBM
Preferred Shipping Mode: ${modeText}
Calculated Billable Weight: ${billable}
Estimated Transit: ${transit}

Hi Nedus team, I'd like to get a door-to-door sourcing and shipping quotation for this shipment. Please contact me with the details.`;

        // Fill contact message
        const contactMessage = document.getElementById('c-message');
        contactMessage.value = messageText;

        // Auto-select corresponding contact service drop-down
        const contactService = document.getElementById('c-service');
        if (modeText.toLowerCase().includes('fba') || catText.toLowerCase().includes('electronics')) {
            contactService.value = 'amazon';
        } else {
            contactService.value = 'sourcing';
        }

        // Smooth scroll to contact
        const contactSection = document.getElementById('contact');
        contactSection.scrollIntoView({ behavior: 'smooth' });

        // Focus form inputs
        document.getElementById('c-name').focus();
    });


    /* --- 3D Business Card Flip --- */
    const businessCard = document.getElementById('business-card');
    businessCard.addEventListener('click', () => {
        businessCard.classList.toggle('flipped');
    });


    /* --- Stat Counter Animation --- */
    const statsNumbers = document.querySelectorAll('.mini-num');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const countUp = (element) => {
        const target = parseInt(element.getAttribute('data-target'), 10);
        const duration = 1500; // 1.5 seconds animation
        const stepTime = Math.abs(Math.floor(duration / target));
        let current = 0;
        
        const timer = setInterval(() => {
            current += Math.ceil(target / 40); // increment step size
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = current;
            }
        }, 30);
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                observer.unobserve(entry.target); // stop observing once animated
            }
        });
    }, observerOptions);

    statsNumbers.forEach(num => {
        statsObserver.observe(num);
    });


    /* --- Contact Form Submission Handler --- */
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-form-btn');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('c-name').value;
        const email = document.getElementById('c-email').value;
        const phone = document.getElementById('c-phone').value;

        if (!name || !email || !phone) {
            formStatus.className = 'form-status error';
            formStatus.textContent = 'Please fill out all required fields.';
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting Request...';
        formStatus.className = 'form-status';
        formStatus.style.color = '#cbd5e1';
        formStatus.textContent = 'Transmitting sourcing query to Guangzhou office...';

        // Simulate API call
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Sourcing Request';
            
            formStatus.className = 'form-status success';
            formStatus.textContent = `Success! Thank you, ${name}. Your sourcing query has been transmitted. Manager Ali Raza and our Guangzhou team will contact you via email (${email}) or WhatsApp/Phone (${phone}) within 24 hours.`;
            
            // Clear form
            contactForm.reset();
        }, 2000);
    });
});
