// components/PDFViewer.tsx
'use client'
import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source (client-side only)
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

interface PDFViewerProps {
  pdfUrl: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const renderPage = async (pdf: any, pageNumber: number) => {
    try {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1.0 });

      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }

      const renderContext = {
        canvasContext: context,
        viewport,
      };

      renderTaskRef.current = page.render(renderContext);
      await renderTaskRef.current.promise;
    } catch (error) {
      if (error instanceof Error && error.name === 'RenderingCancelledException') {
        return;
      }
      console.error('Error rendering PDF:', error);
    }
  };

  useEffect(() => {
    // Ensure this runs only in the browser
    if (typeof window === 'undefined') return;

    const loadPDF = async () => {
      try {
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        setTotalPages(pdf.numPages);
        await renderPage(pdf, pageNum);
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    loadPDF();

    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pdfUrl, pageNum]);

  const handlePrevPage = () => {
    setPageNum((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPageNum((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div>
      <canvas ref={canvasRef} style={{ maxWidth: '100%' }} />
      <div style={{ marginTop: '10px' }}>
        <button onClick={handlePrevPage} disabled={pageNum <= 1}>
          Previous
        </button>
        <span>
          Page {pageNum} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={pageNum >= totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default PDFViewer;