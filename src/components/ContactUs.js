import React from 'react';
import { css } from '@emotion/react';
import ReactMarkdown from 'react-markdown';

import contactData from '../data/contact.json';
const { text } = contactData;

const containerCss = css`
    margin-top: 3em;
    border: 1px solid var(--gray4);
    background: var(--gray1);
    padding: 1em;

    h3 {
        margin-top: 0;
    }
    p {
        font-family: futura-pt, Arial, Helvetica, sans-serif;
        line-height: 1.2em;
    }
`;

const ContactUs = () => {
    return (
        <div css={containerCss}>
            <ReactMarkdown>{text}</ReactMarkdown>
        </div>
    );
};

export default ContactUs;
