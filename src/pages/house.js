import React from 'react';
import { css } from '@emotion/react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

import Layout from '../design/Layout';
import TruncatedContainer from '../components/TruncatedContainer';
import Roster from '../components/Roster';
import ChamberLeadership from '../components/ChamberLeadership';
import CommitteeSummary from '../components/committee/Summary';
import ContactUs from '../components/ContactUs';
import NewsletterSignup from '../components/NewsletterSignup';

import senateData from '../data/house.json';
import committeesData from '../data/committees.json';
import lawmakers from '../data/lawmakers.json'; 

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

// Page Component
const House = ({ representatives, committees }) => {
  const { text, leadership } = senateData

  return (
    <Layout
      relativePath='/house'
      pageTitle={"Montana House | 2025 MTFP Capitol Tracker"}
      pageDescription={"The lawmakers of the 2025 Montana House."}
      socialTitle={"Montana House | 2025 MTFP Capitol Tracker"}
      socialDescription={"The lawmakers of the 2025 Montana House."}
    >
      
      <h1>The Montana House</h1>
      <Link href="/house#members">Representatives ({representatives.length})</Link> • <Link href="/house#committees">Committees ({committees.length})</Link>
      <ReactMarkdown>{text}</ReactMarkdown>

      <h3>Leadership</h3>
      <ChamberLeadership leadership={leadership} />

      <h3 id="members">Membership</h3>
      <TruncatedContainer height={600} closedText="See full roster" openedText="See less" defaultOpen={true}>
        <Roster chamberLabel="House" lawmakers={representatives} />
      </TruncatedContainer>

      <NewsletterSignup />

      <h3 id="committees">House Committees</h3>
      {committees.map((committee) => {
        const { name, key, members } = committee;
        return (
          <div key={name} css={committeeItemStyle}>
            <h4>
              👥 <Link href={`/committees/${key}/`}>{name}</Link> • {members.length} members
            </h4>
            <CommitteeSummary {...committee} billCount={committee.bills.length} />
          </div>
        );
      })}

      <ContactUs />
    </Layout>
  );
};

export default House;

export const getStaticProps = async () => {
    const representatives = lawmakers.filter(lawmaker => lawmaker.chamber === 'house' && lawmaker.isActive);
    
    const committees = committeesData.filter(committee => committee.chamber === 'house');

  return {
    props: {
      representatives,
      committees,
    },
  };
};