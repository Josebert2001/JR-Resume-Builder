export async function printResume(printAreaId = 'resume-print-area') {
  try {
    console.log('Starting print process...');
    
    // Step 1: Ensure fonts are loaded
    if ('fonts' in document && (document as any).fonts?.ready) {
      try {
        await (document as any).fonts.ready;
        console.log('Fonts loaded successfully');
      } catch (fontError) {
        console.warn('Font loading failed:', fontError);
      }
    }

    // Step 2: Find the print area
    const printArea = document.getElementById(printAreaId);
    if (!printArea) {
      console.warn(`Print area ${printAreaId} not found, using default print`);
      window.print();
      return;
    }

    // Step 3: Prepare for printing
    console.log('Print area found, preparing for print...');
    
    // Ensure the print area is visible and properly styled
    printArea.style.display = 'block';
    printArea.style.visibility = 'visible';
    
    // Step 4: Wait for layout to stabilize
    await new Promise(resolve => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(resolve, 300); // Additional delay for complex layouts
        });
      });
    });

    // Step 5: Trigger print
    console.log('Triggering print dialog...');
    window.print();
    
  } catch (error) {
    console.error('Print error:', error);
    
    // Fallback: try basic window.print()
    try {
      window.print();
    } catch (fallbackError) {
      console.error('Fallback print also failed:', fallbackError);
      
      // Show user-friendly error message
      if (typeof window !== 'undefined' && window.alert) {
        alert('Print failed. Please try:\n1. Press Ctrl+P (Cmd+P on Mac)\n2. Use browser menu: File > Print\n3. Try a different browser');
      }
    }
  }
}

// Alternative print method using browser's native print dialog
export function printResumeNative() {
  try {
    // Simple, reliable print method
    window.print();
  } catch (error) {
    console.error('Native print failed:', error);
    alert('Print not available. Please save as PDF instead.');
  }
}

// Print with custom CSS media queries
export async function printResumeWithStyles(printAreaId = 'resume-print-area') {
  try {
    const printArea = document.getElementById(printAreaId);
    if (!printArea) {
      window.print();
      return;
    }

    // Create a temporary style element for print-specific styles
    const printStyles = document.createElement('style');
    printStyles.textContent = `
      @media print {
        body * {
          visibility: hidden !important;
        }
        
        #${printAreaId},
        #${printAreaId} * {
          visibility: visible !important;
        }
        
        #${printAreaId} {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          height: auto !important;
          margin: 0 !important;
          padding: 20px !important;
          background: white !important;
          box-shadow: none !important;
          border: none !important;
          font-size: 12pt !important;
          line-height: 1.4 !important;
        }
        
        @page {
          size: A4;
          margin: 15mm;
        }
      }
    `;
    
    document.head.appendChild(printStyles);
    
    // Wait for styles to apply
    await new Promise(resolve => setTimeout(resolve, 100));
    
    window.print();
    
    // Clean up
    setTimeout(() => {
      document.head.removeChild(printStyles);
    }, 1000);
    
  } catch (error) {
    console.error('Styled print failed:', error);
    window.print();
  }
}