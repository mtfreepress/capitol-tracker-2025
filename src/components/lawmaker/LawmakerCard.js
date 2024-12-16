import React from 'react';
import { css } from '@emotion/react';
import Link from 'next/link';
import LawmakerPortrait from './Portrait';
import { pluralize, ordinalize } from '../../config/utils';
import { partyColors } from '../../config/config';

const lawmakerCardCss = css`
  width: 300px;
  height: 450px;
  background: var(--tan1);
  position: relative;
  font-size: 15px;

  .name {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5em;
    text-align: center;
    background: var(--gray6);
    color: white;
    padding: 0.2em;
    height: 40px;
  }

  .top-section {
    display: flex;
    height: 200px;
    background: var(--gray5);
    color: white;

    .left {
      width: 106px;
    }

    .right {
      width: 194px;
    }
  }

  .locale {
    height: 40px;
    padding: 0.2em;
    display: flex;
    justify-content: center;
    align-items: center;
    font-style: italic;
  }

  .district {
    font-size: 1.2em;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
  }

  .party {
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    color: white;
    height: 30px;
  }

  .leadership-role {
    height: 60px;
    padding: 0.5em;
    display: flex;
    justify-content: center;
    align-items: center;
    font-style: italic;
    text-align: center;
  }

  .session {
    text-transform: uppercase;
    font-size: 0.9em;
    padding: 0.5em;
    font-style: italic;
    color: var(--gray4);
  }

  .item {
    padding: 0.5em;
    margin: 0.2em 0.5em;
    border: 1px solid var(--tan4);
  }

  .promo {
    font-style: italic;
    position: absolute;
    bottom: 5px;
    padding: 0.5em;
  }
`;

const BASE_URL = 'https://apps.montanafreepress.org/capitol-tracker-2023';

const LawmakerCard = ({ lawmaker, portrait }) => {
  const {
    key,
    title,
    name,
    party,
    district,
    locale,
    committees,
    legislativeHistory,
    leadershipTitle,
    sponsoredBills,
  } = lawmaker;

  const color = partyColors(party);
  const mainCommittee = committees[0];
  const otherCommittees = committees.slice(1);

  return (
    <div css={lawmakerCardCss}>
      <div>
        <Link href={`${BASE_URL}/lawmakers/${key}`} passHref>
          <div className="name">{title} {name}</div>
        </Link>
      </div>
      <div className="top-section" style={{ borderBottom: `3px solid ${color}` }}>
        <div className="left">
          <div className="party" style={{ background: color }}>
            {{ 'R': 'Republican', 'D': 'Democrat' }[party]}
          </div>
          <div className="locale">{locale}</div>
          <div className="district">{district}</div>
          <div className="leadership-role">{leadershipTitle}</div>
        </div>
        <div className="right" style={{ borderTop: `6px solid ${color}` }}>
          <LawmakerPortrait image={portrait} alt={`${title} ${name}, ${district}`} />
        </div>
      </div>
      <div className="bottom-section">
        <div className="session">2023 Legislature – {ordinalize(legislativeHistory.length)} session</div>
        <div className="item">
          {committees.length > 0 ? (
            <>👥 {mainCommittee.role} {mainCommittee.committee} and <strong>{otherCommittees.length}</strong> <Link href={`${BASE_URL}/lawmakers/${key}#committees`} passHref>other committee assignments</Link></>
          ) : (
            <>👥 <strong>0</strong> committee assignments</>
          )}
        </div>
        <div className="item"><Link href={`${BASE_URL}/lawmakers/${key}#bills-sponsored`} passHref>📋 <strong>{sponsoredBills.length}</strong> bill(s) introduced</Link></div>
        <div className="promo"><Link href={`${BASE_URL}/`} passHref>See more</Link> on MTFP&#39;s 2023 Capitol Tracker.</div>
      </div>
    </div>
  );
};

export default LawmakerCard;
