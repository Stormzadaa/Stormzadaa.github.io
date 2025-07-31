// Smart Header Behavior - Hide on scroll down, show on scroll up or top hover
document.addEventListener('DOMContentLoaded', function() {
    let lastScrollTop = 0;
    let isHeaderVisible = true;
    let scrollThreshold = 100; // Minimum scroll distance before hiding header
    let hoverZoneHeight = 80; // Height of hover zone at top of page
    let scrollTimer = null;
    let isInitialized = false;
    
    const header = document.querySelector('.header');
    if (!header) return;

    // Check if mobile (768px or less)
    function isMobile() {
        return window.innerWidth <= 768;
    }

    // Initialize header behavior for desktop
    function initializeHeaderBehavior() {
        if (isInitialized || isMobile()) return;
        
        // Add CSS transition for smooth header animation
        header.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        header.style.position = 'fixed';
        header.style.top = '0';
        header.style.left = '0';
        header.style.right = '0';
        header.style.zIndex = '1000';
        
        // Remove any existing body padding
        document.body.style.paddingTop = '0';
        
        // Add event listeners
        window.addEventListener('scroll', throttledScroll, { passive: true });
        document.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
        header.addEventListener('mouseenter', showHeader);
        
        // Initialize header state based on current scroll position
        const initialScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (initialScrollTop > scrollThreshold) {
            hideHeader();
        }
        
        isInitialized = true;
    }
    
    // Cleanup header behavior for mobile
    function cleanupHeaderBehavior() {
        if (!isInitialized) return;
        
        // Remove event listeners
        window.removeEventListener('scroll', throttledScroll);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
        header.removeEventListener('mouseenter', showHeader);
        
        // Reset header styles
        header.style.transform = 'translateY(0)';
        header.style.position = '';
        header.style.top = '';
        header.style.left = '';
        header.style.right = '';
        header.style.zIndex = '';
        header.style.transition = '';
        
        document.body.style.paddingTop = '';
        isHeaderVisible = true;
        isInitialized = false;
    }

    
    // Handle window resize - switch between mobile and desktop behavior
    window.addEventListener('resize', function() {
        if (isMobile()) {
            cleanupHeaderBehavior();
        } else {
            initializeHeaderBehavior();
        }
    });

    function hideHeader() {
        if (isMobile()) return; // Never hide on mobile
        if (isHeaderVisible) {
            header.style.transform = 'translateY(-100%)';
            isHeaderVisible = false;
        }
    }
    
    function showHeader() {
        if (!isHeaderVisible) {
            header.style.transform = 'translateY(0)';
            isHeaderVisible = true;
        }
    }
    
    // Handle scroll behavior
    function handleScroll() {
        if (isMobile()) return; // Skip on mobile
        
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Don't hide header if we're near the top of the page
        if (currentScrollTop < scrollThreshold) {
            showHeader();
            lastScrollTop = currentScrollTop;
            return;
        }
        
        // Determine scroll direction
        const scrollingDown = currentScrollTop > lastScrollTop;
        const scrollingUp = currentScrollTop < lastScrollTop;
        
        // Only act if there's significant scroll movement (prevents jitter)
        const scrollDifference = Math.abs(currentScrollTop - lastScrollTop);
        if (scrollDifference < 5) return;
        
        if (scrollingDown && isHeaderVisible) {
            hideHeader();
        } else if (scrollingUp && !isHeaderVisible) {
            showHeader();
        }
        
        lastScrollTop = currentScrollTop;
    }
    
    // Handle mouse movement near top of page
    function handleMouseMove(e) {
        if (isMobile()) return; // Skip on mobile
        
        const mouseY = e.clientY;
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Show header if mouse is in the hover zone at top of viewport
        if (mouseY <= hoverZoneHeight && currentScrollTop > scrollThreshold) {
            showHeader();
        }
    }
    
    // Handle mouse leave from top area
    function handleMouseLeave(e) {
        if (isMobile()) return; // Skip on mobile
        
        const mouseY = e.clientY;
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Hide header if mouse leaves top area and we're scrolled down
        if (mouseY > hoverZoneHeight && currentScrollTop > scrollThreshold) {
            // Add a small delay to prevent flickering
            setTimeout(() => {
                const newScrollTop = window.pageYOffset || document.documentElement.scrollTop;
                if (newScrollTop > scrollThreshold && !isMouseInTopZone()) {
                    hideHeader();
                }
            }, 500);
        }
    }
    
    // Check if mouse is currently in top zone
    function isMouseInTopZone() {
        return document.querySelector(':hover') === document.documentElement ||
               document.elementFromPoint(window.innerWidth/2, hoverZoneHeight/2) !== null;
    }
    
    // Throttle scroll events for better performance
    function throttledScroll() {
        if (isMobile()) return; // Skip on mobile
        if (scrollTimer) return;
        
        scrollTimer = setTimeout(() => {
            handleScroll();
            scrollTimer = null;
        }, 16); // ~60fps
    }

    // Initialize behavior based on current screen size
    if (!isMobile()) {
        initializeHeaderBehavior();
    }
    
    // Special handling for Tarkov page if it exists
    if (document.body.classList.contains('tarkov-page')) {
        // Ensure header transitions work with Tarkov theme
        header.addEventListener('transitionend', function(e) {
            if (e.propertyName === 'transform' && !isHeaderVisible) {
                // Header is now hidden, you can add additional logic here if needed
            }
        });
    }
    
    // Handle page visibility change (only on desktop)
    document.addEventListener('visibilitychange', function() {
        if (!isMobile() && document.visibilityState === 'visible') {
            // Recalculate header state when page becomes visible
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (currentScrollTop <= scrollThreshold) {
                showHeader();
            }
        }
    });
    
});
