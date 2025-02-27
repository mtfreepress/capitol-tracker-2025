import React from 'react';
import { css } from "@emotion/react";

export const Notification = ({ message, onClose }) => (
  <div css={css`
    background: var(--gray2);
    color: black;
    padding: 0.75em 1.5em;
    margin-bottom: 1em;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `}>
    <span>{message}</span>
    <button
      onClick={onClose}
      css={css`
        background: none;
        border: none;
        font-size: 1.2em;
        cursor: pointer;
        padding: 0 0.5em;
      `}
    >
      ×
    </button>
  </div>
);

export default Notification;