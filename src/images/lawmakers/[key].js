import React from 'react';
import { css } from '@emotion/react';
import LawmakerPortrait from '../../components/lawmaker/Portrait';
import { pluralize, ordinalize, listToText, cleanPhoneString } from '../../config/utils'; 
import { partyColors } from '../../config/config'
import { getLawmakerData, getAllLawmakerKeys, fetchPortraitImage } from '../../lib/lawmaker'; 

// Define styles
const topperBar = css`
  display: flex;
  flex-wrap: wrap;
  border: 1px solid #806F47;
  background-color: #eae3da;
  padding: 0.5em;
`;

const portraitColCss = css`
  margin-right: 1em;
`;

const infoCol = css`
  flex: 1 0 100px;
  h1 {
    font-size: 1.5em;
    margin-top: 0;
    margin-bottom: 0.1em;
  }
`;

const localeLineCss = css`
  font-size: 0.9em;
  font-style: italic;
  color: #444;
`;

const contactLineCss = css`
  font-size: 0.9em;
  margin-top: 0.4em;
`;

const leadershipLineCss = css`
  font-weight: bold;
  font-size: 1.1em;
`;

const anchorLinksBoxStyle = css`
  color: var(--tan4);
  padding: 0.5em 0;
`;

const LawmakerPage = ({ lawmaker, portrait }) => {
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
    phone,
    email,
  } = lawmaker;

  const color = partyColors(party);
  const mainCommittee = committees[0];
  const otherCommittees = committees.slice(1);

  return (
    <div id="embed">
      <div css={topperBar}>
        <div css={portraitColCss} style={{ borderTop: `6px solid ${color}` }}>
          <LawmakerPortrait image={portrait} alt={`${title} ${name}, ${district}`} />
        </div>
        <div css={infoCol}>
          <h1>{`${title} ${name}`}</h1>
          <div>
            {ordinalize(legislativeHistory.length)}-session {getPartyLabel(party)} from {locale}
          </div>
          <hr />
          {leadershipTitle && (
            <>
              <div css={leadershipLineCss}>{leadershipTitle}</div>
              <hr />
            </>
          )}
          <div>
            Representing <strong>{district.replace('SD', 'Senate District').replace('HD', 'House District')}</strong>
          </div>
          <div css={localeLineCss}>{districtLocale}</div>
          <div css={contactLineCss}>
            {phone && <a href={`tel:${cleanPhoneString(phone)}`}>{phone}</a>}
            {(phone && email) && <span> • </span>}
            {email && <a href={`mailto:${email}`}>{email}</a>}
          </div>
        </div>
      </div>

      <div css={anchorLinksBoxStyle}>
        <a href="#committees">Committees</a> •
        <a href="#bills-sponsored">Bills</a> •
        <a href="#key-votes">Key votes</a> •
        <a href="#floor-statistics">Voting stats</a> •
        <a href="#election-history">2022 election margin</a> •
        {articles.length > 0 && <a href="#mtfp-coverage">MTFP Coverage</a>}
      </div>

      <div className="bottom-section">
        <div className="session">
          2023 Legislature – {ordinalize(legislativeHistory.length)} session
        </div>
        <div className="item">
          {committees.length > 0 ? (
            <>
              👥 {mainCommittee.role} {mainCommittee.committee} and{' '}
              <strong>{otherCommittees.length}</strong>{' '}
              <a href={`/lawmakers/${key}#committees`} target="_blank" rel="noopener noreferrer">
                other committee assignment{pluralize(otherCommittees.length)}
              </a>
            </>
          ) : (
            <>👥 <strong>0</strong> committee assignments</>
          )}
        </div>
        <div className="item">
          📋 <strong>{sponsoredBills.length}</strong>{' '}
          <a href={`/lawmakers/${key}#bills-sponsored`} target="_blank" rel="noopener noreferrer">
            bill{pluralize(sponsoredBills.length)} introduced
          </a>
        </div>
      </div>
    </div>
  );
};

// Static paths: define all lawmakers to generate at build time
export async function getStaticPaths() {
  const keys = getAllLawmakerKeys();
  const paths = keys.map((key) => ({ params: { key } }));

  return {
    paths,
    fallback: false,
  };
}

// Static props: fetch data for each lawmaker
export async function getStaticProps({ params }) {
  const lawmaker = getLawmakerData(params.key);
  const portrait = await fetchPortraitImage(lawmaker.imageSlug);
  
  return {
    props: {
      lawmaker,
      portrait,
    },
  };
}

export default LawmakerPage;
