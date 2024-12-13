import React from 'react';
import { css } from '@emotion/react';

import {
    billProgressStepLabels,
    billStatusSymbols,
    statusColors,
} from '../../config/config';

import {
    // capitalize,
    dateFormat,
} from '../../config/utils';

const statusCss = css`
    font-weight: bold;
    text-transform: uppercase;
    color: var(--tan6);
    margin-bottom: 0.5em;
    border-bottom: 2px solid var(--tan6);
    padding: 0.5em 0;
`;

const progressionBinsStyle = css`
    display: flex;
    flex-wrap: wrap;

    .step {
        flex: 0 1 12%;
        /* min-width: 100px; */
        min-height: 50px;
        padding: 0.5em 1em;
        border-top: 2px solid var(--gray2);
        margin-bottom: 0.5em;
        margin-right: 0;
        clip-path: polygon(
            0 0%,
            93% 0,
            100% 50%,
            93% 100%,
            0% 100%,
            7% 50%
        );
    }
    .step:first-of-type {
        clip-path: polygon(
            0 0%,
            93% 0,
            100% 50%,
            93% 100%
            0% 100%
        );
    }
    .step:last-of-type {
        clip-path: polygon(
            0 0%,
            100% 0,
            100% 100%,
            0% 100%,
            7% 50%
        );
    }
    .step-title {
        text-transform: uppercase;
        margin-bottom: 0.3em;
        color: var(--tan6);
        font-size: 0.7em;
    }
    .step-label {
        color: var(--tan5);
    }
    .step-date {
        font-size: 0.8em;
        color: var(--tan5);
        font-style: italic;
    }
`;

const BillStatus = (props) => {
    const {
        // identifier, type, 
        chamber, status, progress
    } = props;

    const stepLabels = billProgressStepLabels(chamber);

    const color = statusColors(status.status);

    const iconCss = css`
        background-color: ${color};
        display: inline-block;
        position: relative;
        top: 1px;
        width: 0.8em;
        height: 0.8em;
        margin-right: 0.2em;
    `;
    
    return (
        <div>
            <div css={statusCss}>
                <span css={iconCss}></span>{status.key.replace('--', ' — ')}
            </div>
            {/* <div>PROGRESS</div> */}
            <div css={progressionBinsStyle}>
                {progress
                    .filter(d => d.status !== 'skipped')
                    .map(d => (
                        <ProgressStep key={d.step} {...d} stepLabels={stepLabels} />
                    ))}
            </div>
        </div>
    );
};

const ProgressStep = ({ step, status, statusLabel, statusDate, stepLabels }) => {
    const icon = billStatusSymbols[status].icon;
    const color = billStatusSymbols[status].color;
    const bgcolor = billStatusSymbols[status].bgcolor;
    
    return (
        <div className="step" style={{ backgroundColor: bgcolor, borderTop: `3px solid ${color}` }}>
            <div className="step-title">{icon} {stepLabels[step]}</div>
            <div><span className="step-label">{statusLabel}</span></div>
            <div><span className="step-date">{statusDate && dateFormat(new Date(statusDate))}</span></div>
        </div>
    );
};

export default BillStatus;
