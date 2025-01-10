import React from 'react';
import { css } from '@emotion/react';
import ReactMarkdown from 'react-markdown';

import { text } from '../data/contact.json'

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
    console.log(text)
    return (
        <div css={containerCss}>
            <ReactMarkdown>{text}</ReactMarkdown>
        </div>
    );
};

export default ContactUs;
