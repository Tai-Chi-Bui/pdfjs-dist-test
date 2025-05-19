// components/PDFViewer.tsx
'use client';

interface PDFViewerProps {
  pdfUrl: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl }) => {
  // Use the locally hosted PDF.js viewer
  const viewerUrl = `/pdfjs/web/viewer.html?file=${encodeURIComponent(pdfUrl)}`;

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