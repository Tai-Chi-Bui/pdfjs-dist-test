// pages/index.tsx
'use client'
import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('./PDFViewer'), {
  ssr: false,
});

export default function PDFComponent() {
  // Example PDF URL (replace with your PDF file path or URL)
  const pdfUrl = '/pdf/example.pdf'; // Place your PDF in the public folder or use an external URL

  return (
    <div>
      <h1>PDF Viewer</h1>
      <PDFViewer pdfUrl={pdfUrl} />
    </div>
  );
}