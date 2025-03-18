import React from 'react';
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
  
  &:hover {
    color: #333;
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
      text-decoration: none;
      color: #444;
      font-size: 0.9rem;
      
      svg, .icon {
        margin-right: 0.5rem;
        color: #AE9864;
      }
      
      &:hover {
        color: #AE9864;
      }
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
    if (!isOpen) return null;

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
                    <ul css={documentListCss}>
                        {documents.map((doc, index) => (
                            <li key={index}>
                                <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                    <span className="icon">📄</span>
                                    {doc.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default DocumentModal;