// Common JavaScript for Sunkar Finance
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading animation to buttons
    document.querySelectorAll('.btn-gold, .btn-blue').forEach(button => {
        button.addEventListener('click', function(e) {
            // Add temporary loading effect
            const originalText = this.innerHTML;
            this.innerHTML = '<span>Загрузка...</span>';
            
            setTimeout(() => {
                this.innerHTML = originalText;
            }, 1500);
        });
    });
    
    // Header background on scroll
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(10, 27, 45, 0.98)';
                header.style.backdropFilter = 'blur(20px)';
            } else {
                header.style.background = 'rgba(10, 27, 45, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            }
        });
    }
    
    // Animation on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.card, .advantage, .service-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = "1";
                element.style.transform = "translateY(0)";
            }
        });
    };
    
    // Set initial state for animated elements
    document.querySelectorAll('.card, .advantage, .service-card').forEach(element => {
        element.style.opacity = "0";
        element.style.transform = "translateY(20px)";
        element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    });
    
    // Run on load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    
    // Phone number formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.startsWith('7')) {
                value = value.substring(1);
            }
            if (value.length > 0) {
                value = '+7 ' + value;
            }
            if (value.length > 4) {
                value = value.substring(0, 4) + ' ' + value.substring(4);
            }
            if (value.length > 8) {
                value = value.substring(0, 8) + ' ' + value.substring(8);
            }
            if (value.length > 12) {
                value = value.substring(0, 12) + ' ' + value.substring(12);
            }
            if (value.length > 15) {
                value = value.substring(0, 15);
            }
            e.target.value = value;
        });
    });
});
