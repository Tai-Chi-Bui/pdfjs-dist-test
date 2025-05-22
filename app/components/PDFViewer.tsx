// components/PDFViewer.tsx
'use client';
import { useEffect } from 'react';

interface PDFViewerProps {
  pdfUrl: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl }) => {
  // Use the locally hosted PDF.js viewer
  const viewerUrl = `/pdfjs/web/viewer.html?file=${encodeURIComponent(pdfUrl)}&attachments=true`;

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Make sure the message is from PDF.js viewer
      if (event.data.type === 'pdfjs-custom-back-button-clicked') {
        // Call custom back function
        handleBackButtonClick();
      }
    };

    // Add event listener
    window.addEventListener('message', handleMessage);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []); // Empty dependency array since we don't have any dependencies

  const handleBackButtonClick = () => {
    console.log('Back button clicked');
    // Navigate back in parent app
    // window.history.back();
  };

  return (
    <div style={{ width: '100%', height: '100vh', background: '#f5f5f5' }}>
      <iframe
        src={viewerUrl}
        width="100%"
        height="100%"
        style={{ border: 'none', minHeight: '100vh', background: '#f5f5f5' }}
        title="PDF Viewer"
        allowFullScreen
      />
    </div>
  );
};

export default PDFViewer;