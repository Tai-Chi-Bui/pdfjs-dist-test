// components/PDFViewer.tsx
'use client';
import { useEffect, useRef } from 'react';

interface PDFViewerProps {
  pdfUrl: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // Use the locally hosted PDF.js viewer
  const viewerUrl = `/pdfjs/web/viewer.html?file=${encodeURIComponent(pdfUrl)}&attachments=true`;

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify the origin (adjust this based on your deployment URL)
      const trustedOrigin = window.location.origin;
      if (event.origin !== trustedOrigin) {
        console.warn('Received message from untrusted origin:', event.origin);
        return;
      }

      // Verify the source is your PDF viewer iframe
      if (!iframeRef.current || event.source !== iframeRef.current.contentWindow) {
        console.warn('Received message from untrusted source');
        return;
      }

      // Validate message structure
      if (!event.data || typeof event.data.type !== 'string') {
        console.warn('Invalid message structure');
        return;
      }

      // Handle the validated messages
      if (event.data.type === 'pdfjs-custom-back-button-clicked') {
        console.log('Back button clicked');
      }

      if (event.data.type === 'pdfjs-custom-show-document-list-button-clicked') {
        console.log('Show document list clicked');
      }
    };

    // Add event listener
    window.addEventListener('message', handleMessage);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []); // Empty dependency array since we don't have any dependencies

  return (
    <div style={{ width: '100%', height: '100vh', background: '#f5f5f5' }}>
      <iframe
        ref={iframeRef}
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