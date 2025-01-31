import React, { useState } from 'react';
import { css } from '@emotion/react';
import Link from 'next/link';
import { billStatusSymbols, billProgressStepLabels, statusColors, partyColors } from '../config/config';
import { billUrl, lawmakerUrl } from '../config/utils';
import { noteStyle, inlineButtonCss } from '../config/styles';

const DEFAULT_DISPLAY_LIMIT = 10;
const DEFAULT_SORT = (a, b) => +a.identifier.substring(3) - +b.identifier.substring(3);

const BillTable = ({ bills, suppressCount, sortFunction = DEFAULT_SORT, displayLimit = DEFAULT_DISPLAY_LIMIT }) => {
  const [isTruncated, setIsTruncated] = useState(true);

  const toggleDisplayLimit = () => {
    setIsTruncated(!isTruncated);
  };

  if (bills.length === 0) {
    return <div css={noteStyle}>None at present</div>;
  }

  const sorted = bills.sort(sortFunction);
  const rendered = isTruncated ? sorted.slice(0, displayLimit) : sorted;
  const rows = rendered.map((bill, i) => {
    const { key, ...rest } = bill;
    return <Bill key={String(i)} {...rest} />;
  });
  const isFadeApplied = isTruncated && (rendered.length < sorted.length);

  return (
    <div>
      <table className={isFadeApplied ? 'table bottomFadeCss' : 'table'}>
        <tbody>{rows}</tbody>
      </table>
      <div css={noteStyle}>
        {!suppressCount && <span>Showing {rendered.length} of {bills.length}</span>}
        {(bills.length > displayLimit) && (
          <span>
            <span>. </span>
            <button css={inlineButtonCss} onClick={toggleDisplayLimit}>
              {isTruncated ? 'See all' : 'See fewer'}
            </button>
          </span>
        )}
      </div>
    </div>
  );
};

const tableRowCss = css`
  border-bottom: 2px solid #fff !important;
  td {
    padding: 0.2em 0.2em 0.5em 0.5em;
  }
`;

const tableBillCell = css`
  color: red;
`;

const statusColCss = css`
  width: 10em;

  @media screen and (max-width: 468px) {
    width: 7em;
  }
`;

const billLabelCss = css`
  font-style: italic;
  color: #666;
`;

const billCss = css`
  display: block;
  font-size: 1.15em;
  font-weight: 600;
  font-style: italic;
  padding: 0.2em 0.2em;
  margin-left: -0.2em;

  :hover {
    background-color: #cebc9f;
    color: #ce5a00 !important;
    text-decoration: none;
  }
`;

const identifierCss = css`
  font-style: normal;
  color: #444;
`;

const billInfoLineCss = css`
  color: #ae9864;
`;

const billLinkCss = css`
  margin-top: 0.3em;
  margin-right: 0.5em;
  display: inline-block;
  color: #ae9864;
  border: 1px solid #ae9864;
  padding: 0.5em 0.5em;

  :hover {
    color: #ce5a00;
    border: 1px solid #ce5a00;
    text-decoration: none;
  }
`;

const progressStepStyle = css`
  margin-bottom: 0.1em;
  font-size: 12px;

  .icon {
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
`;

const pluralStory = val => (val !== 1) ? 'stories' : 'story';

const Bill = ({ title, identifier, chamber, status, explanation, textUrl, fiscalNoteUrl, legalNoteUrl, vetoMemoUrl, amendmentsUrl, numArticles, sponsor, progress }) => {
  const statusColor = statusColors(status.status);
  const stepLabels = billProgressStepLabels(chamber);

  const progression = progress
    .filter(d => ['first committee', 'first chamber', 'second chamber', 'reconciliation', 'governor'].includes(d.step))
    .filter(d => {
      if (d.step !== 'reconciliation') return true;
      return d.status !== 'skipped';
    })
    .map(d => {
      const symbol = billStatusSymbols[d.status];
      return (
        <div key={d.step} css={progressStepStyle}>
          <span className="icon" style={{ color: symbol.color }}>{symbol.icon}</span>
          <span className="label">{stepLabels[d.step]}</span>
        </div>
      );
    });

  return (
    <tr css={tableRowCss} key={identifier}>
      
      <td css={tableBillCell}>
        <Link href={`/bills/${billUrl(identifier)}`} passHref>
          <span css={billCss}>
            <span>📋</span> <span css={identifierCss}>{identifier}:</span> {title}
          </span>
        </Link>
        <div css={billLabelCss}>{explanation}</div>
        <div css={billInfoLineCss}>
          {sponsor && (
            <Link href={`/lawmakers/${lawmakerUrl(sponsor.name)}`} passHref>
              <span css={billLinkCss}>
                {sponsor.name} <span css={css`color: ${partyColors(sponsor.party)}; opacity: 0.8;`}>({sponsor.party})</span>
              </span>
            </Link>
          )}
          {textUrl && <a css={billLinkCss} href={textUrl} target="_blank" rel="noopener noreferrer">📃 Bill text</a>}
          {fiscalNoteUrl && (
            <Link href={fiscalNoteUrl} passHref target="_blank">
              <span css={billLinkCss}>💵 Fiscal note</span>
            </Link>
          )}
          {legalNoteUrl && (
            <Link href={legalNoteUrl} passHref target="_blank">
              <span css={billLinkCss}>🏛 Legal note</span>
            </Link>
          )}
          {amendmentsUrl && <a css={billLinkCss} href={amendmentsUrl} target="_blank" rel="noopener noreferrer">🖍 Proposed amendments</a>}
          {vetoMemoUrl && <a css={billLinkCss} href={vetoMemoUrl} target="_blank" rel="noopener noreferrer">🚫 Veto memo</a>}
          {(numArticles > 0) && (
            <Link href={`/bills/${billUrl(identifier)}`} passHref>
              <span css={billLinkCss}>📰 <strong>{numArticles}</strong> MTFP {pluralStory(numArticles)}</span>
            </Link>
          )}
        </div>
      </td>

      <td css={[statusColCss, css`border-left: 3px solid ${statusColor}`]}>
        <div>{progression}</div>
      </td>
    </tr>
  );
}

export default BillTable;