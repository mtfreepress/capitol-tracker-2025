import React from "react";
import { css } from '@emotion/react';

import "../config/base.css";
import { embedInputContainerStyle } from '../config/styles';
import { lawmakerUrl } from '../config/utils';
import { billStatusSymbols, billProgressStepLabels } from '../config/config';

const billCardCss = css`
    // ... existing styles ...
`;

const progressStepStyle = css`
    // ... existing styles ...
`;

const BASE_URL = 'https://apps.montanafreepress.org/capitol-tracker-2023';

const BillCard = ({ bill }) => {
    const {
        key, identifier, title, status, progress, chamber,
        textUrl, fiscalNoteUrl, legalNoteUrl,
        explanation, sponsor,
    } = bill;

    const embedCode = `<div class="tracker-sidebar alignleft">
<style>
    @media (max-width: 680px) {
        .tracker-sidebar.alignleft {
            max-width: 100% !important;  
            width: 100%;
        }
    }
</style>
<iframe
    width="300px"
    height="300px"
    scrolling="no"
    title="Card embed ${identifier}: ${title}"
    style="margin: 0 auto; border: 1px solid #666; box-shadow: 1px 1px 2px #444;"
    src=${BASE_URL}/bill-cards/${key}/#embed></iframe>
</div>`;

    const stepLabels = billProgressStepLabels(chamber);
    const progression = progress
        .filter(d => ['first committee', 'first chamber', 'second chamber', 'governor'].includes(d.step))
        .map(d => {
            const symbol = billStatusSymbols[d.status];
            return <div key={d.step} css={progressStepStyle}>
                <span className="icon" style={{ color: symbol.color }}>{symbol.icon}</span>
                <span className="label">{stepLabels[d.step]}</span>
            </div>;
        });

    return (
        <div>
            <div id="embed" css={billCardCss}>
                <div className="info">
                    <a href={`${BASE_URL}/bills/${key}`} target="_blank" rel="noopener noreferrer">
                        <div className="title">{identifier}: {title}</div>
                    </a>
                    <div className="explanation">{explanation}</div>
                </div>

                <div className="sponsor">
                    Sponsor: <a href={`${BASE_URL}/lawmakers/${lawmakerUrl(sponsor.name)}`} target="_blank" rel="noopener noreferrer">
                        <strong>{sponsor.name}</strong>
                    </a> ({sponsor.party}-{sponsor.locale})
                </div>

                <div className="row">
                    <div className="info-boxes">
                        <div className="info-text">{textUrl ?
                            <a href={textUrl} target="_blank" rel="noopener noreferrer">📃 Bill text</a> :
                            <span className="info-absent">📃 No bill text</span>}
                        </div>
                        <div className="info-fiscal">{fiscalNoteUrl ?
                            <a href={fiscalNoteUrl} target="_blank" rel="noopener noreferrer">💵 Fiscal note</a> :
                            <span className="info-absent">💵 No fiscal note</span>}
                        </div>
                        <div className="info-legal">{legalNoteUrl ?
                            <a href={legalNoteUrl} target="_blank" rel="noopener noreferrer">🏛 Legal note</a> :
                            <span className="info-absent">🏛 No legal note</span>}
                        </div>
                    </div>
                    <div className="progression">
                        <div className="progress-title">PROGRESS</div>
                        {progression}
                    </div>
                </div>
                <div className="promo">
                    <a href={`${BASE_URL}/bills/${key}`} target="_blank" rel="noopener noreferrer">See more</a> on MTFP&#39;s 2023 Capitol Tracker.
                </div>
            </div>

            <div css={embedInputContainerStyle}>
                <div>Embed code (Copy into HTML block in MTFP CMS)</div>
                <textarea rows="20" cols="80" value={embedCode} readOnly></textarea>
            </div>
        </div>
    );
};

export default BillCard;