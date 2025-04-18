import React from "react";
import { css } from '@emotion/react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

import Layout from '../../design/Layout';
import ContactUs from '../../components/ContactUs';
import NewsletterSignup from '../../components/NewsletterSignup';
import LinksList from '../../components/LinksList';
import BillTable from '../../components/BillTable';

import LawmakerPortrait from '../../components/lawmaker/Portrait';
import LawmakerElectionHistory from '../../components/lawmaker/ElectionHistory';
import LawmakerCommittees from '../../components/lawmaker/Committees';
import LawmakerVotingSummary from '../../components/lawmaker/VotingSummary';
import LawmakerKeyVotes from '../../components/lawmaker/KeyVotes';
import { fetchLawmakerPaths, fetchLawmakerData, fetchPortraitImage } from "../../lib/lawmaker";

import { listToText, cleanPhoneString, ordinalize } from '../../config/utils';
import { partyColors } from '../../config/config';

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

const contactLineCss = css`
  font-size: 0.9em;
  margin-top: 0.4em;
`;

const anchorLinksBoxStyle = css`
  color: var(--tan4);
  padding: 0.5em 0;
`;

const getPartyLabel = (key) => {
  return {
    'R': 'Republican',
    'D': 'Democrat',
  }[key];
};

const LawmakerPage = ({ lawmaker }) => {
  const {
    key,
    title,
    name,
    lastName,
    party,
    chamber,
    district,
    locale,
    districtLocale,
    committees,
    legislativeHistory,
    keyBillVotes,
    leadershipTitle,
    votingSummary,
    articles,
    sponsoredBills,
    phone,
    email,
    lawmakerPageText,
    portrait,
  } = lawmaker;

  return (
    <Layout
      relativePath={`/${key}`}
      // pageFeatureImage={`/images/portraits/2025/${key}.jpg`} // TODO when we have time to troubleshoot
      // pageFeatureImageWidth // optional?
      // pageFeatureImageHeight // optional?
      pageTitle={`${title} ${name}, ${party}-${locale} | 2025 MTFP Capitol Tracker`}
      pageDescription={`Election history, sponsored bills, committee assignments and more for ${title} ${name}, ${party}-${locale}.`}
      socialTitle={`${title} ${name}, ${party}-${locale} | 2025 MTFP Capitol Tracker`}
      socialDescription={`Election history, sponsored bills, committee assignments and more for ${title} ${name}, ${party}-${locale}.`}
    >

      <div css={topperBar}>
        <div css={portraitColCss} style={{ borderTop: `6px solid ${partyColors(party)}` }}>
          <LawmakerPortrait image={portrait} alt={`${title} ${name}, ${district}`} />
        </div>
        <div css={infoCol}>
          <h1>{`${title} ${name}`}</h1>
          <div>{`${ordinalize(legislativeHistory.length)}-session ${getPartyLabel(party)} from ${locale}`}</div>
          {leadershipTitle && <div>{leadershipTitle}</div>}
          <div>{`Representing ${district.replace('SD', 'Senate District').replace('HD', 'House District')}`}</div>
          <div>{districtLocale}</div>
          <div css={contactLineCss}>
            {phone && <a href={`tel:${cleanPhoneString(phone)}`}>{phone}</a>}
            {phone && email && <span> • </span>}
            {email && <a href={`mailto:${email}`}>{email}</a>}
          </div>
        </div>
      </div>

      <div css={anchorLinksBoxStyle}>
        <a href="#committees">Committees</a> •
        <a href="#bills-sponsored">Bills</a> •
        <a href="#key-votes">Key votes</a> •
        <a href="#floor-statistics">Voting stats</a> •
        <a href="#election-history">2024 election margin</a> •
        {articles.length > 0 && <a href="#mtfp-coverage">MTFP Coverage</a>}
      </div>

      {/* Display both the custom text and the history component when lawmakerPageText exists */}
      {lawmakerPageText ? (
        <>
          <ReactMarkdown>{lawmakerPageText}</ReactMarkdown>
          <History name={lastName} history={legislativeHistory} />
        </>
      ) : (
        <History name={lastName} history={legislativeHistory} />
      )}

      <h3 id="mtfp-coverage">Montana Free Press coverage</h3>
      {articles.length > 0 ? <LinksList articles={articles} /> : <div>Nothing currently tagged in our archive.</div>}

      <h3 id="committees">Committee assignments</h3>

      <LawmakerCommittees committees={committees} />

      <h3 id="bills-sponsored">Bills sponsored</h3>
      <BillTable bills={sponsoredBills} />

      <NewsletterSignup />

      {/* <h3 id="key-votes">Key bill votes</h3>
      <LawmakerKeyVotes lastName={name} party={party} keyBillVotes={keyBillVotes} /> */}

      <h3 id="floor-statistics">Floor vote statistics</h3>
      <LawmakerVotingSummary lawmaker={lawmaker} votingSummary={votingSummary} />

      <h3 id="election-history">{`${district} election results`}</h3>
      <LawmakerElectionHistory lawmaker={lawmaker} />


      <ContactUs />
    </Layout>
  );
};

export default LawmakerPage;

const History = ({ name, history }) => {
  const pastSessions = history.filter((d) => d.year !== '2025');
  const pastHouseSessions = pastSessions.filter((d) => d.chamber === 'house');
  const pastSenateSessions = pastSessions.filter((d) => d.chamber === 'senate');

  if (!pastSessions.length) {
    return <p>{`2025 is the first session ${name} has served in the Legislature.`}</p>;
  } else if (!pastSenateSessions.length) {
    return <p>{`${name} previously served in the Montana House in ${listToText(pastHouseSessions.map((d) => d.year))}.`}</p>;
  } else if (!pastHouseSessions.length) {
    return <p>{`${name} previously served in the Montana Senate in ${listToText(pastSenateSessions.map((d) => d.year))}.`}</p>;
  } else {
    return (
      <p>
        {`${name} previously served in the Montana Senate in ${listToText(pastSenateSessions.map((d) => d.year))}, as well as the House in ${listToText(
          pastHouseSessions.map((d) => d.year)
        )}.`}
      </p>
    );
  }
};

// Fetch Data for Static Generation
export async function getStaticProps({ params }) {
  const lawmaker = await fetchLawmakerData(params.key);
  const portrait = await fetchPortraitImage(lawmaker.portrait);
  // console.log('Fetched portrait:', portrait); // Debug log
  return {
    props: {
      lawmaker: {
        ...lawmaker,
        portrait,
      },
    },
  };
}


export async function getStaticPaths() {
  const paths = await fetchLawmakerPaths();
  return { paths, fallback: false };
}
