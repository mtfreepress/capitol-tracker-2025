import React from 'react';
import ReactMarkdown from 'react-markdown';
import Head from 'next/head'; // For SEO
import Layout from '../design/Layout';
import LinksList from '../components/LinksList';
import ContactUs from '../components/ContactUs';
import BillTable from '../components/BillTable';
import NewsletterSignup from '../components/NewsletterSignup';

import governorData from '../data/governor.json';
import { numberFormat, dateFormat } from '../config/utils';

const plural = (value) => (value !== 1 ? 's' : '');

const Governor = ({ billsTransmittedToGovernor }) => {
  const { text, articles } = governorData;

  // filter functions
  // const toGovernor = d => d.data.progress.toGovernor
  // const awaitingGovernorAction = d => d.progress.governorStatus === 'pending'
  // const signedByGovernor = d => d.progress.governorStatus === 'signed'
  // const vetoedByGovernor = d => d.progress.governorStatus === 'vetoed'
  // const enactedWithNoGovernorSignature = d => d.progress.governorStatus === 'became law unsigned'


  // Filter bills based on status v2
  const awaitingActionBills = billsTransmittedToGovernor.filter(b => {
    const governorProgress = b.progress.find(d => d.step === 'governor');
    return governorProgress && governorProgress.statusLabel === 'Pending';
  });

  const vetoedBills = billsTransmittedToGovernor.filter(b => {
    const governorProgress = b.progress.find(d => d.step === 'governor');
    return governorProgress && governorProgress.statusLabel === 'Vetoed';
  });

  const amendmentSuggestedBills = billsTransmittedToGovernor.filter(b => {
    const governorProgress = b.progress.find(d => d.step === 'governor');
    return governorProgress && governorProgress.statusLabel === 'Amendment suggested';
  });

  const vetoOverrideAttempts = billsTransmittedToGovernor.filter(b => {
    const governorProgress = b.progress.find(d => d.step === 'governor');
    return governorProgress && governorProgress.statusLabel === 'Veto Override Pending';
  });

  const successfulVetoOverrides = billsTransmittedToGovernor.filter(b => {
    const governorProgress = b.progress.find(d => d.step === 'governor');
    return governorProgress && governorProgress.statusLabel === 'Veto Overridden';
  });

  const signedBills = billsTransmittedToGovernor.filter(b => {
    const governorProgress = b.progress.find(d => d.step === 'governor');
    return governorProgress && governorProgress.statusLabel === 'Signed';
  });

  const letBecomeLawBills = billsTransmittedToGovernor.filter(b => {
    const governorProgress = b.progress.find(d => d.step === 'governor');
    return governorProgress && governorProgress.statusLabel === 'Became law unsigned';
  });

  return (
    <div>
      <Layout
        relativePath='/governor'
        pageTitle={"Gov. Greg Gianforte | 2025 MTFP Capitol Tracker"}
        pageDescription={"Montana Gov. Greg Gianforte's 2025 bill signatures and vetoes."}
        socialTitle={"Gov. Greg Gianforte | 2025 MTFP Capitol Tracker"}
        socialDescription={"Montana Gov. Greg Gianforte's 2025 bill signatures and vetoes.."}
      >

        <h1>Gov. Greg Gianforte</h1>
        <ReactMarkdown>{text}</ReactMarkdown>

        <div>
          <strong style={{ fontSize: '1.8em' }}>{numberFormat(billsTransmittedToGovernor.length)}</strong> 2025 bill{plural(billsTransmittedToGovernor.length)} have been transmitted to Gov. Gianforte for his signature.
        </div>

        <h4>Awaiting action ({numberFormat(awaitingActionBills.length)})</h4>
        <BillTable bills={awaitingActionBills} displayLimit={5} />

        <h4>Vetoed ({numberFormat(vetoedBills.length)})</h4>
        <div className="note">
          Vetos can be overridden by two-thirds majorities in the House and Senate.
        </div>
        <BillTable bills={vetoedBills} displayLimit={5} />

        {vetoOverrideAttempts.length > 0 && (
          <>
            <h4>Pending veto override efforts ({numberFormat(vetoOverrideAttempts.length)})</h4>
            <BillTable bills={vetoOverrideAttempts} displayLimit={5} />
          </>
        )}

        {amendmentSuggestedBills.length > 0 && (
          <>
            <h4>Returned with suggested amendment ({numberFormat(amendmentSuggestedBills.length)})</h4>
            <BillTable bills={amendmentSuggestedBills} displayLimit={5} />
          </>
        )}

        {successfulVetoOverrides.length > 0 && (
          <>
            <h4>Vetoes overridden by Legislature ({numberFormat(successfulVetoOverrides.length)})</h4>
            <BillTable bills={successfulVetoOverrides} displayLimit={5} />
          </>
        )}

        <h4>Signed into law ({numberFormat(signedBills.length)})</h4>
        <BillTable bills={signedBills} displayLimit={5} />

        <h4>Became law without signature</h4>
        <div className="note">
          Bills that have become law without the governor&#39;s signature after the governor chooses not to issue a signature or a veto by the 10-day deadline specified in the Montana Constitution.
        </div>
        <BillTable bills={letBecomeLawBills} displayLimit={5} />

        <NewsletterSignup />

        <h3>Montana Free Press coverage</h3>
        <div>2025 legislative stories involving the Governor&#39;s Office.</div>
        <LinksList articles={articles} />

        <ContactUs />
      </Layout>
    </div>
  );
};

// Fetch data at build time
export async function getStaticProps() {
  const bills = await import('../data/bills.json')
  const billsTransmittedToGovernor = bills.default.filter(bill => bill.hasBeenSentToGovernor)

  return {
    props: {
      billsTransmittedToGovernor,
    },
  };
}

export default Governor;
