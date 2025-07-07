import React, { useState } from 'react';
import { css } from '@emotion/react';
import { statusColors } from '../../config/config';
import Link from 'next/link';
import Layout from '../../design/Layout';

import InfoPopup from '../InfoPopup';

import processAnnotations from '../../data/process-annotations.json';

import {
  dateFormat,
  committeeUrl,
} from '../../config/utils';

import {
  partyColors,
  positionColors
} from '../../config/config';

const descriptionCss = css`
  margin: 0.1em 0;
`;

const recordingLineCss = css`
  border: 1px solid var(--tan5);
  background-color: var(--tan2);
  padding: 0.5em 0.5em;
  margin: 0.3em 0;
`;

const defaultState = {
  showMinorActions: false,
  showVotes: true,
};

const dateCss = css`
  color: #806f47;
  vertical-align: top;
`;
const dateColWidth = css`
  width: 5em;
  @media screen and (max-width: 468px) {
    width: 4em;
  }
`;
const actionCss = css`
  vertical-align: top;
`;
const actionWidth = css`
  width: 45em;
  @media screen and (max-width: 760px) {
    width: 35em;
  }
  @media screen and (max-width: 600px) {
    width: 30em;
  }
  @media screen and (max-width: 468px) {
    width: 21em;
  }
`;

// const committeeCss = css`
//   font-style: italic;
//   vertical-align: top;
// `
// const committeeColWidth = css`
//   width: 10em;
//   @media screen and (max-width: 468px) {
//     width: 5em;
//   }
// `
const highlightRow = css`
  background-color: #cebc9f;
`;

const BillActions = ({ actions, lawsUrl, vetoMemoUrl }) => {
  const [showMinorActions, setShowMinorActions] = useState(false);
  const [showVotes, setShowVotes] = useState(true);

  const toggleShowMinorActions = () => setShowMinorActions(!showMinorActions);

  const howBillsMoveObj = processAnnotations.find(item => item.key === "howBillsMove");
  const howBillsMove = howBillsMoveObj ? howBillsMoveObj.content : null;
  const actionFilter = showMinorActions ? (d) => true : (d) => d.isMajor;
  const annotations = [
    {
      key: 'vetoMemo',
      descriptionFilter: (action) =>
        ['Vetoed by Governor', "Returned with Governor's Line-item Veto"].includes(action.description),
      label: (action) => 'Veto memo',
      url: (action) => vetoMemoUrl,
    },
  ];

  // Sort actions by committeeHearingTime if it exists, otherwise by date
  const sortedActions = actions.sort((a, b) => {
    const dateA = a.committeeHearingTime ? new Date(a.committeeHearingTime) : new Date(a.date);
    const dateB = b.committeeHearingTime ? new Date(b.committeeHearingTime) : new Date(b.date);
    return dateA - dateB;
  });

  const rows = sortedActions.filter(actionFilter).map((d, i) => Action(d, showVotes, annotations));

  return (
    <div>
      <h3>Legislative actions</h3>
      <InfoPopup label="How bills move through the Legislature" content={howBillsMove} />
      <div className="note">
        {showMinorActions ? 'Showing all recorded bill actions. ' : 'Showing major bill actions only. '}
        <button className='inline-button' onClick={toggleShowMinorActions}>
          {showMinorActions ? 'See fewer' : 'See all.'}
        </button>
      </div>
      <table className='table'>
        <thead className="tableHeader">
          <tr>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
      <div className="note">
        {showMinorActions ? 'Showing all recorded bill actions. ' : 'Showing major bill actions only. '}
        <button className='inline-button' onClick={toggleShowMinorActions}>
          {showMinorActions ? 'See fewer' : 'See all.'}
        </button>
      </div>
      <div className="note">
        This table may omit bill actions recorded since this guide&#39;s last update. See the{' '}
        <a href={lawsUrl}>bill page at legmt.gov</a> for an official reference.
      </div>
    </div>
  );
};

const Action = (action, showVotes, annotations) => {
  const { id, committee, description, vote, date, recordings, isHighlight, transcriptUrl, committeeHearingTime } = action;
  const { thresholdRequired } = vote || {};

  const displayDate = committeeHearingTime ? committeeHearingTime : date;

  // format committee name for display
  let committeeDisplay = null;
  if (committee && (description === "Hearing" || description.startsWith("Committee Executive Action"))) {
    // extract the chamber and clean up the committee name
    const chamberPrefix = committee.includes("(H)") ? "House" : committee.includes("(S)") ? "Senate" : "";
    // remove the parenthetical prefix from the committee name
    const cleanCommitteeName = committee.replace(/\([HS]\)\s*/, "").trim();
    committeeDisplay = `${chamberPrefix} ${cleanCommitteeName}`;
  }

  return (
    <tr key={id} css={isHighlight ? highlightRow : null}>
      <td css={dateCss}>
        <div css={dateColWidth}>{dateFormat(new Date(displayDate))}</div>
      </td>

      <td css={actionCss}>
        <div css={actionWidth}>
          <div css={descriptionCss}>
            <div>{description}</div>
            {committeeDisplay && (
              <div>
                👥 <em>{committeeDisplay}</em>
              </div>
            )}
          </div>

          {vote && thresholdRequired !== 'simple' ? (
            <div className="note">Supermajority required - {thresholdRequired}</div>
          ) : null}

          {showVotes && vote ? <VoteBlock description={description} vote={vote} /> : null}

          {recordings.length > 0 && (
            <div css={recordingLineCss}>
              📺🎙{' '}
              {recordings.map((url, i) => (
                <span key={String(i)}>
                  <a href={url}>Official recording {i + 1}</a>.{' '}
                </span>
              ))}
            </div>
          )}

          {transcriptUrl && (
            <div css={recordingLineCss}>
              <div>
                🤖📝 <a href={transcriptUrl}>Video and searchable computer-generated transcript</a>
              </div>
              <span className="note">
                via <a href="https://www.openmontana.org/">Open Montana</a> and{' '}
                <a href="https://councildataproject.org/">Council Data Project</a>
              </span>
            </div>
          )}

          {annotations
            .filter((a) => a.descriptionFilter(action))
            .map((annot, index) => {
              if (annot.url(action)) {
                return <Link key={index} href={annot.url(action)}>{annot.label(action)}</Link>;
              } else {
                return <span key={index}>{annot.label(action)}</span>;
              }
            })}
        </div>
      </td>
    </tr>
  );
};

export default BillActions;

const voteSummariesCss = css`
  margin: 0.2em 0;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
`
const rowCss = css`
  margin-right: 0.7em;
  margin-bottom: 0.3em;
`
const totalVoteCss = (color) => css`
  display: inline-block;
  border: 1px solid #473d29;
  /* border-left: 3px solid  #473d29; */
  background-color: ${color};
  padding: 0.5em 0.8em;
  font-weight: bold;
`
const partyVoteCss = (color, secondary) => css`
  display: inline-block;
  border: 1px solid #806f47;
  background-color: ${secondary};

  width: 3em;
  padding: 0.5em 0.8em;
`
const partyIconCss = (color) => css`
  display: inline-block;
  border: 1px solid #806f47;
  border-right: none;
  background-color: #e0d4b8;
  color: ${color};
  width: 1em;
  padding: 0.5em 0.2em;
  padding-left: 0.5em;
  font-style: normal;
  font-weight: bold;
`

const VoteBlock = ({ vote, description }) => {
  const {
    count,
    motionPassed,
    gopCount,
    gopSupported,
    demCount,
    demSupported,
    votes,
    voteUrl,
    thresholdRequired
  } = (vote || {})
  const rColor = partyColors('R')
  const dColor = partyColors('D')

  const billAdvanced = (description === 'Tabled in Committee') ? !motionPassed : motionPassed
  let icon = ''
  let passageColor = 'var(--gray2)'
  let gopSupportColor = 'var(--gray2)'
  let demSupportColor = 'var(--gray2)'
  if ((thresholdRequired !== '2/3 entire legislature') || (!['2nd Reading Passed', '3rd Reading Passed'].includes(description))) {
    icon = billAdvanced ? '✅' : '❌'
    // Use the "stalled" color for "Tabled in Committee" votes that pass 
    passageColor = (description === 'Tabled in Committee' && !billAdvanced)
      ? statusColors('stalled') // to ensure the bill advanced background is orange when tabled motion passes
      : (billAdvanced ? positionColors('Y') : positionColors('N'));

    // Update GOP and Democrat support colors for "Tabled in Committee"
    gopSupportColor = (description === 'Tabled in Committee')
      ? statusColors('stalled') // if pass, use stalled color 
      : (gopSupported ? positionColors('Y') : positionColors('N'));

    demSupportColor = (description === 'Tabled in Committee')
      ? statusColors('stalled') // if pass use stalled color
      : (demSupported ? positionColors('Y') : positionColors('N'));
  }
  return <div>
    <div css={voteSummariesCss}>
      {
        (count.Y + count.N > 0) && <div css={[rowCss]}>
          <span css={[totalVoteCss(passageColor)]}><span>{icon} </span>{count && count.Y}-{count && count.N}</span>
        </div>
      }
      {
        (gopCount.Y + gopCount.N > 0) && <div css={[rowCss]}>
          <span css={partyIconCss(rColor)}>R</span>
          <span css={partyVoteCss(rColor, gopSupportColor)}>{gopCount && gopCount.Y}-{gopCount && gopCount.N}</span>
        </div>
      }
      {
        (demCount.Y + demCount.N > 0) && <div css={rowCss}>
          <span css={partyIconCss(dColor)}>D</span>
          <span css={partyVoteCss(dColor, demSupportColor)}>{demCount && demCount.Y}-{demCount && demCount.N}</span>
        </div>
      }
    </div>
    {(votes.length > 1) && <VoteListing votes={votes} voteUrl={voteUrl} description={description} />}

  </div>
}

const voteListing = css`
  display: flex;
  flex-wrap: wrap;
  border: 1px solid var(--tan5);
  padding: 0.5em;
  background-color: var(--tan2);
  margin-bottom: 1em;
  margin-top: 0.5em;

  .note {
    width: 100%;
  }
`
const col = css`
  flex: 0 0 50%;
`
const partyLabel = css`
  font-weight: bold;
  text-transform: uppercase;
  color: var(--gray6);
  margin-bottom: 0.3em;
  margin-top: 0.2em;
`
const partyVotes = css`
  margin-bottom: 1em;
`

const VoteListing = ({ votes, voteUrl, description, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const gopVotes = votes.filter(d => d.party === 'R').sort((a, b) => a.lastName.localeCompare(b.lastName));
  const demVotes = votes.filter(d => d.party === 'D').sort((a, b) => a.lastName.localeCompare(b.lastName));

  return (
    <div>
      <button className="inline-button" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <span>&#x25BE; Hide full vote breakdown</span> : <span>&#x25B8; Show full vote breakdown</span>}
      </button>
      {isOpen ? (
        <div css={voteListing}>
          <div css={col}>
            <div css={partyLabel}>Republicans</div>
            <div css={partyVotes}>
              {gopVotes.map(vote => (
                <VoteItem key={vote.name} vote={vote} description={description} />
              ))}
            </div>
          </div>
          <div css={col}>
            <div css={partyLabel}>Democrats</div>
            <div css={partyVotes}>
              {demVotes.map(vote => (
                <VoteItem key={vote.name} vote={vote} description={description} />
              ))}
            </div>
          </div>
          {voteUrl && (
            <div className="note">
              <a href={voteUrl} target="_blank" rel="noopener noreferrer">
                Official vote page
              </a>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

const voteItemCss = css`
  display: flex;

  :nth-of-type(5n) {
    margin-bottom: 0.5em;
  }
`
const voteIndicator = css`
  width: 2em;
  margin-right: 0.5em;
  text-align: center;
  padding: 0.1em;
  border-top: 1px solid var(--tan6);
  text-transform: capitalize;
`
const nameLine = css`
  width: 18em;
  padding: 0.1em;
`

const VoteItem = ({ vote, description }) => {
  const { option, name, locale, party } = vote;
  const choice = option.replace('absent', 'abs').replace('excused', 'exc');
  const localeRender = locale.replace(' ', '\u00a0'); // prevents line break on space

  // determine the vote color
  const voteColor = css`
    background-color: ${
      description === 'Tabled in Committee'
        ? // flip positionColors for "Tabled in Committee"
          choice.toUpperCase() === 'Y'
          ? positionColors('N') // Yes -> No color (green for "live")
          : choice.toUpperCase() === 'N'
          ? positionColors('Y') // No -> Yes color (orange for "stalled")
          : '#bbb' // Abstain -> Grey
        : // normal behavior for other actions
          positionColors(choice.toUpperCase()[0])
    };
  `;

  const nameColor = css`
    color: ${partyColors(party, 'darker')};
  `;

  return (
    <div key={name} css={voteItemCss}>
      <div css={[voteIndicator, voteColor]}>{choice}</div>
      <div css={nameLine}>
        <strong css={nameColor}>{name}</strong> (<em>{localeRender}</em>)
      </div>
    </div>
  );
};