document.addEventListener('DOMContentLoaded', () => {
    // Initialize with Home Section
    showSection('home');
    
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navbarDefault = document.getElementById('navbar-default');
    
    if(menuToggle && navbarDefault) {
        menuToggle.addEventListener('click', () => {
            navbarDefault.classList.toggle('hidden');
        });
    }

    // Setup Copy Buttons
    setupCopyButtons();

    // Setup Search
    setupSearch();
});

// --- Navigation Logic ---
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('main > section');
    sections.forEach(section => {
        section.classList.add('hidden');
    });

    // Show target section
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.remove('hidden');
        window.scrollTo(0,0);
    } else {
        console.error(`Section ${sectionId} not found`);
    }

    // Close mobile menu if open
    const navbarDefault = document.getElementById('navbar-default');
    if (navbarDefault && !navbarDefault.classList.contains('hidden')) {
        navbarDefault.classList.add('hidden');
    }
}

// --- Copy Logic ---
function setupCopyButtons() {
    const buttons = document.querySelectorAll('.copy-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            try {
                // Find the <pre><code> element relative to the button
                const container = btn.parentElement;
                const codeElement = container.querySelector('code') || container.querySelector('pre');
                
                if (codeElement) {
                    const textToCopy = codeElement.innerText;
                    
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        showToast('تم النسخ بنجاح!');
                    }).catch(err => {
                        console.error('Failed to copy: ', err);
                        // Fallback
                        fallbackCopy(textToCopy);
                    });
                }
            } catch (err) {
                console.error('Error in copy button: ', err);
                showToast('حدث خطأ أثناء النسخ', true);
            }
        });
    });
}

function fallbackCopy(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        showToast('تم النسخ بنجاح!');
    } catch (err) {
        console.error('Fallback copy failed', err);
        showToast('لم نتمكن من النسخ', true);
    }
    document.body.removeChild(textArea);
}

function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.querySelector('span').innerText = message;
    if (isError) {
        toast.classList.remove('bg-cyan-600');
        toast.classList.add('bg-red-600');
    } else {
        toast.classList.remove('bg-red-600');
        toast.classList.add('bg-cyan-600');
    }

    toast.classList.remove('translate-y-20', 'opacity-0');
    
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

// --- Search Logic ---
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        
        // If we are not on a content page that supports search, maybe switch to 'termux' or keep global?
        // Strategy: Filter .searchable-item in all active sections. 
        // If query is present, we might want to ensure a section is visible, but complex.
        // Simplified: Filter items within the CURRENTLY VISIBLE section.
        
        const activeSection = document.querySelector('main > section:not(.hidden)');
        if (!activeSection) return;

        const items = activeSection.querySelectorAll('.searchable-item');
        
        if (items.length === 0 && query.length > 0) {
           // If current section has no searchable items, user might be looking for something elsewhere.
           // Advanced: Search all sections and unhide the one with matches?
           // Let's stick to current section filtering to avoid chaos, or searching all if user hits enter.
           // For 'Live' search, let's just highlight in current section.
           return;
        }

        items.forEach(item => {
            const text = item.innerText.toLowerCase();
            if (text.includes(query)) {
                item.style.display = 'block';
                // Optional: Highlight logic could go here but requires HTML manipulation which can break listeners.
            } else {
                item.style.display = 'none';
            }
        });

        // Restore all if query is empty
        if (query === '') {
            items.forEach(item => item.style.display = 'block');
        }
    });
}
