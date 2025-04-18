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

import senateData from '../data/senate.json';
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
const Senate = ({ senators, committees }) => {
  const { text, leadership } = senateData

  return (
    <Layout
      relativePath='/senate'
      pageTitle={"Montana Senate | 2025 MTFP Capitol Tracker"}
      pageDescription={"The lawmakers of the 2025 Montana Senate."}
      socialTitle={"Montana Senate | 2025 MTFP Capitol Tracker"}
      socialDescription={"The lawmakers of the 2025 Montana Senate."}
    >
      
      <h1>The Montana Senate</h1>
      <Link href="/senate#members">Senators ({senators.length})</Link> • <Link href="/senate#committees">Committees ({committees.length})</Link>
      <ReactMarkdown>{text}</ReactMarkdown>

      <h3>Leadership</h3>
      <ChamberLeadership leadership={leadership} />

      <h3 id="members">Membership</h3>
      <TruncatedContainer height={600} closedText="See full roster" openedText="See less" defaultOpen={true}>
        <Roster chamberLabel="Senate" lawmakers={senators} />
      </TruncatedContainer>

      <NewsletterSignup />

      <h3 id="committees">Senate Committees</h3>
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

export default Senate;

export const getStaticProps = async () => {
    const senators = lawmakers.filter(lawmaker => lawmaker.chamber === 'senate' && lawmaker.isActive);
    
    const committees = committeesData.filter(committee => committee.chamber === 'senate');

  return {
    props: {
      senators,
      committees,
    },
  };
};
