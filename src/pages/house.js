import React from 'react';
import Link from 'next/link';
import { css } from '@emotion/react';
import ReactMarkdown from 'react-markdown';

import Layout from '../design/Layout';
import Head from 'next/head';
import TruncatedContainer from '../components/TruncatedContainer';
import Roster from '../components/Roster';
import ChamberLeadership from '../components/ChamberLeadership';
import CommitteeSummary from '../components/committee/Summary';
import ContactUs from '../components/ContactUs';
import NewsletterSignup from '../components/NewsletterSignup';

import houseData from '../data/house.json';
import committeesData from '../data/data-nodes/committees.json';
import lawmakers from '../data/data-nodes/lawmakers.json'; // Import your lawmakers data

const committeeItemStyle = css`
  border: 1px solid var(--tan5);
  border-left: 4px solid var(--tan5);
  background: var(--tan1);
  padding: 0.2em;
  margin-bottom: 0.5em;

  h4 {
    padding: 0.2em;
    margin: 0.2em 0;

    a {
      text-transform: uppercase;
    }
  }
`;

const leadership = [
  { role: 'Speaker of the House', name: 'Rep. Matt Regier (R-Kalispell)', key: 'Matt-Regier' },
  { role: 'Majority Leader', name: 'Rep. Sue Vinton (R-Billings)', key: 'Sue-Vinton' },
  { role: 'Minority Leader', name: 'Rep. Kim Abbott (D-Helena)', key: 'Kim-Abbott' },
];

const House = ({ representatives, committees }) => {
  const { text } = houseData;

  return (
    <div>
      <Layout>
        <Head>
          <title>House</title>
          <meta name="description" content="Representatives and committees of the Montana House" />
        </Head>

        <h1>The Montana House</h1>
        <Link href="/house#members">Representatives ({representatives.length})</Link> {' • '}
        <Link href="/house#committees">Committees ({committees.length})</Link>

        <ReactMarkdown>{text}</ReactMarkdown>

        <h3>Leadership</h3>
        <ChamberLeadership leadership={leadership} />

        <h3 id="members">Representatives</h3>
        <TruncatedContainer height={600} closedText="See full roster" openedText="See less">
          <Roster chamberLabel="House" lawmakers={representatives} />
        </TruncatedContainer>

        <NewsletterSignup />

        <h3 id="committees">House Committees</h3>
        {committees.map(committee => (
          <div key={committee.name} css={committeeItemStyle}>
            <h4>
              👥 <Link href={`/committees/${committee.key}/`}>{committee.name}</Link> {' • '}
              {committee.members.length} members
            </h4>
            <CommitteeSummary {...committee} billCount={committee.bills.length} />
          </div>
        ))}

        <ContactUs />
      </Layout>
    </div>
  );
};

export async function getStaticProps() {
  // Filter active house representatives from lawmakers.json
  const representatives = lawmakers.filter(lawmaker => lawmaker.chamber === 'house' && lawmaker.isActive);
  
  // Filter house committees
  const committees = committeesData.filter(committee => committee.chamber === 'house');

  return {
    props: {
      representatives,
      committees,
    },
  };
}

export default House;
