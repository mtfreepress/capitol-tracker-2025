import React from 'react';
import { css } from '@emotion/react';
import Link from 'next/link';

import "../../styles/base.css";
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
            background-color:
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

`
// TODO: Change this to projects.montanafreepress.org
const BASE_URL = 'https://projects.montanafreepress.org/capitol-tracker-2025';

const LawmakerCard = ({ lawmaker, portrait, hideEmbed = false }) => {
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
      height="450px"
      scrolling="no"
      title="Lawmaker embed ${name}"
      style="margin: 0 auto; border: 1px solid #666; box-shadow: 1px 1px 2px #444;"
      src="${BASE_URL}/lawmaker-cards/${key}?embed=true"></iframe>
  </div>`;

  return (
    <div>
      <div id="embed" css={lawmakerCardCss}>
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
        <div className="right" style={{ borderTop: `6px solid ${color}`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <LawmakerPortrait
            image={portrait}
            alt={`${title} ${name}, ${district}`}
            width={194}
          />
        </div>
      </div>
      <div className="bottom-section">
        <div className="session">2025 Legislature – {ordinalize(legislativeHistory.length)} session</div>
        <div className="item"><Link href={`${BASE_URL}/lawmakers/${key}#bills-sponsored`} passHref>📋 <strong>{sponsoredBills.length}</strong> bill(s) introduced</Link></div>
        <div className="promo"><Link href={`${BASE_URL}/`} passHref>See more</Link> on MTFP&#39;s 2025 Capitol Tracker.</div>
      </div>
    </div>
      
      {
    !hideEmbed && (
      <div>
        <div>Embed code (Copy into HTML block in MTFP CMS)</div>
        <textarea rows="12" cols="80" value={embedCode} readOnly></textarea>
      </div>
    )
  }
    </div >
  );
};

export default LawmakerCard;