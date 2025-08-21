import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import { PdfDocument } from '../types';

interface PdfViewerProps {
  url: string;
}

interface PdfViewerRef {
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (pageNumber: number) => void;
}

const PdfContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
`;

const PdfToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ToolbarButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin: 0 5px;
  transition: background-color 0.2s;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #666;
`;

const PageInput = styled.input`
  width: 60px;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
`;

const PdfCanvas = styled.div`
  flex: 1;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  background: #e0e0e0;
`;

const Canvas = styled.canvas`
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  background: white;
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  font-size: 18px;
  color: #666;
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  font-size: 18px;
  color: #dc3545;
  text-align: center;
  padding: 20px;
`;

const PdfViewer = forwardRef<PdfViewerRef, PdfViewerProps>(({ url }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = useState<PdfDocument | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.5);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfInstance, setPdfInstance] = useState<any>(null);
  const [currentRenderTask, setCurrentRenderTask] = useState<any>(null);
  const [isRendering, setIsRendering] = useState<boolean>(false);

  useEffect(() => {
    loadPdf();
  }, [url]);

  useEffect(() => {
    if (pdfDoc && currentPage && pdfInstance && !isRendering) {
      renderPage(currentPage);
    }
  }, [pdfDoc, currentPage, scale, pdfInstance]);

  const loadPdf = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cancel any existing render task
      if (currentRenderTask) {
        currentRenderTask.cancel();
        setCurrentRenderTask(null);
      }

      // Dynamically import pdf.js
      const pdfjsLib = await import('pdfjs-dist');
      
      // Set worker path
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      console.log('📄 Loading PDF from:', url);

      // Load the PDF document
      const loadingTask = pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;

      console.log('✅ PDF loaded successfully');

      setPdfInstance(pdf);
      setPdfDoc({
        url,
        title: 'PDF Document',
        pageCount: pdf.numPages,
        currentPage: 1
      });

      setLoading(false);
    } catch (err: any) {
      console.error('❌ Error loading PDF:', err);
      
      let errorMessage = 'Failed to load PDF document';
      
      if (err?.name === 'UnknownErrorException' || err?.message?.includes('Failed to fetch')) {
        errorMessage = 'CORS Error: PDF server does not allow access from this domain. Try using a different PDF URL.';
      } else if (err?.name === 'InvalidPDFException') {
        errorMessage = 'Invalid PDF file or corrupted PDF document.';
      } else if (err?.name === 'MissingPDFException') {
        errorMessage = 'PDF file not found. Please check the URL.';
      } else if (err?.name === 'UnexpectedResponseException') {
        errorMessage = 'Server error: Unexpected response from PDF server.';
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  const renderPage = async (pageNum: number) => {
    if (!pdfInstance || !canvasRef.current || isRendering) return;

    try {
      setIsRendering(true);
      
      // Cancel any existing render task
      if (currentRenderTask) {
        currentRenderTask.cancel();
        setCurrentRenderTask(null);
      }

      console.log('🎨 Rendering page', pageNum);

      const page = await pdfInstance.getPage(pageNum);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Could not get canvas context');
      }

      const viewport = page.getViewport({ scale });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };

      const renderTask = page.render(renderContext);
      setCurrentRenderTask(renderTask);
      
      await renderTask.promise;
      
      console.log('✅ Page rendered successfully');
      setCurrentRenderTask(null);
      setIsRendering(false);
    } catch (err: any) {
      if (err?.name === 'RenderingCancelledException') {
        console.log('🔄 Rendering was cancelled - this is normal when changing pages');
        setIsRendering(false);
        return;
      }
      console.error('❌ Error rendering page:', err);
      setError('Failed to render page');
      setIsRendering(false);
    }
  };

  const goToPage = (pageNum: number) => {
    if (pdfDoc && pageNum >= 1 && pageNum <= pdfDoc.pageCount) {
      setCurrentPage(pageNum);
      setPdfDoc(prev => prev ? { ...prev, currentPage: pageNum } : null);
    }
  };

  const nextPage = () => {
    if (pdfDoc && currentPage < pdfDoc.pageCount) {
      goToPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (pdfDoc && currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      goToPage(value);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentRenderTask) {
        currentRenderTask.cancel();
      }
    };
  }, [currentRenderTask]);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    nextPage,
    prevPage,
    goToPage
  }));

  if (loading) {
    return (
      <PdfContainer>
        <LoadingSpinner>Loading PDF...</LoadingSpinner>
      </PdfContainer>
    );
  }

  if (error) {
    return (
      <PdfContainer>
        <ErrorMessage>
          <div>
            <h3>Error Loading PDF</h3>
            <p>{error}</p>
            <ToolbarButton onClick={loadPdf}>Retry</ToolbarButton>
          </div>
        </ErrorMessage>
      </PdfContainer>
    );
  }

  return (
    <PdfContainer>
      <PdfToolbar>
        <div>
          <ToolbarButton onClick={prevPage} disabled={!pdfDoc || currentPage <= 1 || isRendering}>
            Previous
          </ToolbarButton>
          <ToolbarButton onClick={nextPage} disabled={!pdfDoc || currentPage >= pdfDoc.pageCount || isRendering}>
            Next
          </ToolbarButton>
        </div>

        <PageInfo>
          <span>Page</span>
          <PageInput
            type="number"
            value={currentPage}
            onChange={handlePageInputChange}
            min={1}
            max={pdfDoc?.pageCount || 1}
            disabled={isRendering}
          />
          <span>of {pdfDoc?.pageCount || 0}</span>
          {isRendering && <span style={{ color: '#007bff' }}>Rendering...</span>}
        </PageInfo>

        <div>
          <ToolbarButton onClick={zoomOut} disabled={scale <= 0.5 || isRendering}>
            Zoom Out
          </ToolbarButton>
          <span style={{ margin: '0 10px', fontSize: '14px' }}>
            {Math.round(scale * 100)}%
          </span>
          <ToolbarButton onClick={zoomIn} disabled={scale >= 3 || isRendering}>
            Zoom In
          </ToolbarButton>
        </div>
      </PdfToolbar>

      <PdfCanvas>
        <Canvas ref={canvasRef} />
      </PdfCanvas>
    </PdfContainer>
  );
});

export default PdfViewer;
