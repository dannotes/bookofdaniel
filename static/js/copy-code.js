// Add copy buttons to code blocks
document.addEventListener('DOMContentLoaded', function() {
    console.log('Copy code script loaded');
    
    // Add copy buttons to all pre blocks (both highlight and regular)
    const preBlocks = document.querySelectorAll('pre');
    console.log('Found pre blocks:', preBlocks.length);
    
    preBlocks.forEach((pre, index) => {
        // Skip if button already exists
        if (pre.querySelector('.copy-button')) {
            return;
        }
        
        console.log('Adding copy button to pre block', index);
        
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = 'Copy';
        copyButton.setAttribute('data-code-index', index);
        
        // Ensure parent container has relative positioning
        const parent = pre.parentElement;
        if (parent.classList.contains('highlight')) {
            parent.style.position = 'relative';
            parent.appendChild(copyButton);
        } else {
            pre.style.position = 'relative';
            pre.appendChild(copyButton);
        }
        
        // Add click handler
        copyButton.addEventListener('click', function() {
            const code = pre.querySelector('code') || pre;
            const textToCopy = code.textContent || code.innerText;
            
            // Use modern clipboard API
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(textToCopy).then(function() {
                    showCopySuccess(copyButton);
                }).catch(function() {
                    fallbackCopyTextToClipboard(textToCopy, copyButton);
                });
            } else {
                // Fallback for older browsers or non-HTTPS
                fallbackCopyTextToClipboard(textToCopy, copyButton);
            }
        });
    });
    
    function fallbackCopyTextToClipboard(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showCopySuccess(button);
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
            button.textContent = 'Failed';
            setTimeout(() => {
                button.textContent = 'Copy';
                button.classList.remove('copied');
            }, 2000);
        }
        
        document.body.removeChild(textArea);
    }
    
    function showCopySuccess(button) {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    }
});