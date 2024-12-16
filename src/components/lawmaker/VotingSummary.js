import React from 'react';
import { css } from '@emotion/react'

import {
  numberFormat,
  floatFormat,
  percentFormat,
  capitalize
} from '../../config/utils'

const partyLabel = key => ({
  'R': 'Republicans',
  'D': 'Democrats'
}[key])

const votingSummaryStyle = css`
  .text {
    padding: 0;
    font-size: 1em;
    margin-bottom: 0.2em;
  }
  .pull-stat-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;

    border: 1px solid var(--tan4);
    background-color: var(--tan1);
    padding: 0.5em;
    margin-bottom: 0.5em;

    text-align: center;
  }
  .pull-stat-item {
    flex: 1 1 50px;
    max-width: 150px;
    margin: 0.5em;
  }
  .stat {
    font-size: 2.5em;
    font-weight: bold;
    display: block;
    

    @media screen and (max-width: 400px) {
      font-size: 1.5em;
    }

  }
  .stat-label {
    font-size: 1em;
    display: block;
    text-align: center;

    @media screen and (max-width: 400px) {
      font-size: 0.8em;
    }
  }
  .stat-context {
    margin-top: 0.2em;
    font-size: 0.9em;
    display: block;
    text-align: center;
    color: var(--gray4);
    font-style: italic;

    @media screen and (max-width: 400px) {
      font-size: 0.7em;
    }
  }
`

const LawmakerVotingSummary = ({ lawmaker, votingSummary }) => {
  const partyLabeled = partyLabel(lawmaker.party)
  let winningSideComparison, gopVoteComparison, demVoteComparison
  if (lawmaker.party === 'R') {
    winningSideComparison = votingSummary.averageVotesOnWinningSideGop
    gopVoteComparison = votingSummary.averageVotesWithGopCaucusGop
    demVoteComparison = votingSummary.averageVotesWithDemCaucusGop
  } else if (lawmaker.party === 'D') {
    winningSideComparison = votingSummary.averageVotesOnWinningSideDem
    gopVoteComparison = votingSummary.averageVotesWithGopCaucusDem
    demVoteComparison = votingSummary.averageVotesWithDemCaucusDem
  }
  return <div css={votingSummaryStyle}>
    <div className="text">Calculations based on {numberFormat(votingSummary.numVotesCast || 0)} {capitalize(lawmaker.chamber)} floor votes in 2023 involving bills.</div>
    <div className="pull-stat-container">
      <div className="pull-stat-item">
        <div className="stat">🥇 {percentFormat(votingSummary.fractionVotesOnWinningSide || 0)}</div>
        <div className="stat-label">of votes cast on winning side</div>
        <div className="stat-context">Average for {capitalize(lawmaker.chamber)} {partyLabeled} is {percentFormat(winningSideComparison)}.</div>
      </div>
      <div className="pull-stat-item">
        <div className="stat">🔴 {percentFormat(votingSummary.fractionVotesWithGopCaucus || 0)}</div>
        <div className="stat-label">of votes cast on side taken by most Republicans</div>
        <div className="stat-context">Average for {capitalize(lawmaker.chamber)} {partyLabeled} is {percentFormat(gopVoteComparison)}.</div>
      </div>
      <div className="pull-stat-item">
        <div className="stat">🔵 {percentFormat(votingSummary.fractionVotesWithDemCaucus || 0)}</div>
        <div className="stat-label">of votes cast on side taken by most Democrats</div>
        <div className="stat-context">Average for {capitalize(lawmaker.chamber)} {partyLabeled} is {percentFormat(demVoteComparison)}.</div>
      </div>
    </div>
    <div className="text">{lawmaker.lastName} has been marked absent or excused for <strong>{numberFormat(votingSummary.numVotesNotPresent || 0)}</strong> votes. Average for {capitalize(lawmaker.chamber)} lawmakers is {floatFormat(votingSummary.averageAbsences)}.</div>
  </div>
};

export default LawmakerVotingSummary