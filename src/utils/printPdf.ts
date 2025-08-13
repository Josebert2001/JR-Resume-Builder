export async function printResume(printAreaId = 'resume-print-area') {
  try {
    // Ensure fonts are loaded for accurate print rendering
    if ('fonts' in document && (document as any).fonts?.ready) {
      try {
        await (document as any).fonts.ready;
      } catch {}
    }

    // If a specific print area is provided, ensure it exists
    const area = document.getElementById(printAreaId);
    if (!area) {
      // Fallback to default print
      window.print();
      return;
    }

    // Give the browser a moment to apply print styles
    await new Promise((r) => requestAnimationFrame(() => r(undefined)));

    window.print();
  } catch (e) {
    console.error('Print error', e);
    window.print();
  }
}
