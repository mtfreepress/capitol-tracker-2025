import React, { useState, useEffect } from 'react';
import { css } from '@emotion/react';

const modalOverlayCss = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const modalContentCss = css`
  background-color: white;
  padding: 1.5rem;
  border-radius: 4px;
  max-width: 90%;
  max-height: 90%;
  width: 600px;
  overflow-y: auto;
  position: relative;
`;

const modalHeaderCss = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 0.5rem;
`;

const closeButtonCss = css`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  color: #777;
  outline: none;
  
  &:hover {
    color: #ce5a00;
    background: transparent;
    border: none;
    box-shadow: none;
  }
  
  &:focus {
    outline: none;
  }
`;

const documentListCss = css`
  list-style-type: none;
  padding: 0;
  margin: 0;
  
  li {
    margin-bottom: 0.75rem;
    padding: 0.5rem;
    border: 1px solid #eaeaea;
    border-radius: 4px;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: #f9f9f9;
    }
    
    a {
      display: flex;
      align-items: center;
      text-decoration: bold;
      font-size: .95rem;
      font-family: futura-pt, Arial, Helvetica, sans-serif;
      
      svg, .icon {
        margin-right: 0.5rem;
        color: #AE9864;
      }
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const paginationCss = css`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  gap: 0.5rem;
  align-items: center;
  
  .page-info {
    margin: 0 1rem;
    color: #666;
    font-size: 0.9rem;
  }
  
  button {
    padding: 0.25rem 0.75rem;
    border: 1px solid var(--gray2);
    background-color: var(--gray2);
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    user-select: none;
    
    &:hover:not(:disabled) {
      background-color: var(--tan2);
      border-color: #ccc;
      color: black;
    }
    
    &:focus {
      background-color: var(--gray2);
      outline: none;
    }
    
    &:active {
      background-color: var(--tan2);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

const loadingCss = css`
  text-align: center;
  color: #777;
  padding: 2rem 0;
`;

const noDocumentsCss = css`
  text-align: center;
  color: #777;
  padding: 2rem 0;
`;

const DocumentModal = ({ isOpen, onClose, documents, title = "Documents", isLoading = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(40);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [documents, isOpen]);
  
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setItemsPerPage(mobile ? 20 : 40);
    };
    
    checkScreenSize();
    
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  if (!isOpen) return null;
  
  const totalPages = Math.ceil(documents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, documents.length);
  const currentDocuments = documents.slice(startIndex, endIndex);
  
  // page controls
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const renderPagination = () => {
    // don't show pagination if we don't need it
    if (documents.length <= itemsPerPage) return null;
    
    return (
      <div css={paginationCss}>
        {/* <button 
          onClick={() => goToPage(1)} 
          disabled={currentPage === 1}
        >
          First
        </button> */}
        <button 
          onClick={() => goToPage(currentPage - 1)} 
          disabled={currentPage === 1}
        >
          Previous
        </button>
        
        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>
        
        <button 
          onClick={() => goToPage(currentPage + 1)} 
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        {/* <button 
          onClick={() => goToPage(totalPages)} 
          disabled={currentPage === totalPages}
        >
          Last
        </button> */}
      </div>
    );
  };

  return (
    <div css={modalOverlayCss} onClick={onClose}>
      <div css={modalContentCss} onClick={(e) => e.stopPropagation()}>
        <div css={modalHeaderCss}>
          <h3>{title}</h3>
          <button css={closeButtonCss} onClick={onClose}>×</button>
        </div>

        {isLoading ? (
          <div css={loadingCss}>
            Loading documents...
          </div>
        ) : documents.length === 0 ? (
          <div css={noDocumentsCss}>
            No documents available
          </div>
        ) : (
          <>
            <ul css={documentListCss}>
              {currentDocuments.map((doc, index) => (
                <li key={index}>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                    <span className="icon">📄</span>
                    {doc.name}
                  </a>
                </li>
              ))}
            </ul>
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentModal;