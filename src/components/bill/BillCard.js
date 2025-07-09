import React from "react";
import { css } from '@emotion/react';
import Link from "next/link";

import "../../styles/base.css";
import { embedInputContainerStyle } from '../../config/styles';
import { lawmakerUrl } from '../../config/utils'
import { billStatusSymbols, billProgressStepLabels } from '../../config/config';

const billCardCss = css`
    width: 300px;
    height: 300px;
    background: var(--tan1);
    position: relative;
    font-size: 15px;

    .info {
        

        font-size: 1.1em;
        text-align: center;
        background: var(--gray6);
        
        color: white;
        padding: 0.5em;
        /* height: 40px; */
        .title {
            color: white;
        }
        .explanation {
            font-style: italic;
            font-size: 0.9rem;
        }
    }
    .sponsor {
        padding: 0.5em;
    }
    .status {
        padding: 0.5em;
    }

    .row {
        display: flex;
        flex-wrap: wrap;
        /* padding: 0.5em; */

    }
    .info-boxes {
        flex: 0 0 45%;
    }
    .info-text,
    .info-fiscal,
    .info-legal {
        border: 1px solid var(--tan4);
        padding: 0.25em;
        margin: 0 0.5em;
        margin-bottom: 5px;
        height: 30px;
        display: flex;
        align-items: center;
    }
    .info-absent {
        opacity: 0.5;
        font-style: italic;
    }
    .progression {
        flex: 0 0 45%;
        height: 111px;
        border: 1px solid var(--tan4);
        padding: 0.5em;

        .progress-title {
            margin-bottom: 0.3em;
            color: var(--tan5);
        }
    }

    
    .promo {
        font-style: italic;
        position: absolute;
        bottom: 5px;
        padding: 0.5em;
    }
`

const progressStepStyle = css`
  margin-bottom: 0.1em;
  font-size: 12px;
  
  .icon {
    /* background-color: var(--gray1); */
    display: inline-block;
    width: 1.2em;
    height: 1.2em;
    text-align: center;
    margin: 0.1em;
    margin-right: 0.5em;
  }
  .label {
    color: var(--gray4);
    display: inline-block;
    text-transform: uppercase;
    @media (max-width: 400px) {
      font-size: 12px;
    }
  }
`

const BASE_URL = 'https://projects.montanafreepress.org/capitol-tracker-2025';

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
                        <div className="info-text">
                        {textUrl ? (
                            <Link href={textUrl} target="_blank" rel="noopener noreferrer">
                            <span>📃 Bill text</span>
                            </Link>
                        ) : (
                            <span className="info-absent">📃 No bill text</span>
                        )}
                        </div>
                        <div className="info-fiscal">
                            {fiscalNoteUrl ? (
                                // <Link href={fiscalNoteUrl}  target="_blank">
                                <Link href={fiscalNoteUrl} target="_blank" rel="noopener noreferrer">
                                    <span>💵 Fiscal note</span>
                                </Link>
                            ) : (
                                <span className="info-absent">💵 No fiscal note</span>
                            )}
                        </div>
                        <div className="info-legal">
                            {legalNoteUrl ? (
                                <Link href={legalNoteUrl} target="_blank" rel="noopener noreferrer">
                                    <span>🏛 Legal note</span>
                                </Link>
                            ) : (
                                <span className="info-absent">🏛 No legal note</span>
                            )}
                        </div>
                    </div>
                    <div className="progression">
                        <div className="progress-title">PROGRESS</div>
                        {progression}
                    </div>
                </div>
                <div className="promo">
                    <a href={`${BASE_URL}/bills/${key}`} target="_blank" rel="noopener noreferrer">See more</a> on MTFP&#39;s 2025 Capitol Tracker.
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