// CYBERPUNK EFFECTS 2.0
document.addEventListener('DOMContentLoaded', function() {
    // Enhanced Button Hover Effects
    const cyberButtons = document.querySelectorAll('.cyber-button');
    
    cyberButtons.forEach(button => {
        // Store original styles for clean reset
        const originalBoxShadow = window.getComputedStyle(button).boxShadow;
        const originalTransform = window.getComputedStyle(button).transform;
        
        // Mouse Enter Effect
        button.addEventListener('mouseenter', () => {
            const color = button.classList.contains('red') ? 
                'var(--neon-pink)' : 
                button.classList.contains('purple') ? 
                'var(--neon-purple)' : 
                'var(--neon-blue)';
            
            button.style.boxShadow = `0 0 20px ${color}`;
            button.style.transform = 'translateY(-2px)';
            button.style.filter = 'brightness(1.2)';
            
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.className = 'cyber-ripple';
            ripple.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
            button.appendChild(ripple);
            
            // Position ripple at mouse position
            const rect = button.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            // Animate ripple
            setTimeout(() => {
                ripple.style.transform = 'scale(3)';
                ripple.style.opacity = '0';
            }, 10);
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Mouse Leave Effect
        button.addEventListener('mouseleave', () => {
            button.style.boxShadow = originalBoxShadow;
            button.style.transform = originalTransform;
            button.style.filter = 'brightness(1)';
        });
        
        // Click Effect
        button.addEventListener('click', () => {
            button.style.transform = 'translateY(1px)';
            setTimeout(() => {
                button.style.transform = originalTransform;
            }, 100);
        });
    });
    
    // Terminal Typewriter Effect
    const terminalInputs = document.querySelectorAll('.terminal-input input[type="text"]');
    terminalInputs.forEach(input => {
        const placeholder = input.getAttribute('placeholder');
        let i = 0;
        
        if (placeholder) {
            input.setAttribute('placeholder', '');
            
            const typeWriter = setInterval(() => {
                if (i < placeholder.length) {
                    input.setAttribute('placeholder', 
                        input.getAttribute('placeholder') + placeholder.charAt(i));
                    i++;
                } else {
                    clearInterval(typeWriter);
                    
                    // Add cursor blink after typing
                    input.setAttribute('placeholder', 
                        input.getAttribute('placeholder') + '▋');
                    
                    setInterval(() => {
                        const current = input.getAttribute('placeholder');
                        input.setAttribute('placeholder', 
                            current.endsWith('▋') ? 
                            current.slice(0, -1) : 
                            current + '▋');
                    }, 500);
                }
            }, 100);
        }
    });
    
    // Scanline Effect for Cards
    const cyberCards = document.querySelectorAll('.cyber-card');
    cyberCards.forEach(card => {
        const scanline = document.createElement('div');
        scanline.className = 'cyber-scanline';
        card.appendChild(scanline);
        
        // Animate scanline
        let pos = -50;
        const animate = () => {
            pos = (pos + 1) % (card.offsetHeight + 100);
            scanline.style.top = `${pos - 50}px`;
            requestAnimationFrame(animate);
        };
        animate();
    });
    
    // Glitch Effect on Hover for Headers
    const neonHeaders = document.querySelectorAll('.neon-text, .neon-blue, .neon-pink');
    neonHeaders.forEach(header => {
        header.addEventListener('mouseenter', () => {
            header.style.textShadow = `
                0 0 10px currentColor,
                0 0 20px currentColor,
                2px 2px 0 #fff,
                -2px -2px 0 #fff
            `;
            
            // Random glitch effect
            if (Math.random() > 0.7) {
                const originalText = header.textContent;
                header.textContent = originalText.split('').map(c => 
                    Math.random() > 0.8 ? String.fromCharCode(33 + Math.floor(Math.random() * 94)) : c
                ).join('');
                
                setTimeout(() => {
                    header.textContent = originalText;
                }, 200);
            }
        });
        
        header.addEventListener('mouseleave', () => {
            const color = window.getComputedStyle(header).color;
            header.style.textShadow = `
                0 0 5px ${color},
                0 0 10px ${color}
            `;
        });
    });
});