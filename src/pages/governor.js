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

const Governor = ({ billsTransmittedToGovernor, passedBothChambersNotSent }) => {
  const { text, articles } = governorData;
  const allGovernorBills = [...billsTransmittedToGovernor, ...passedBothChambersNotSent];

  // Awaiting action only from transmitted bills
  const awaitingActionBills = billsTransmittedToGovernor.filter(b => {
    const governorProgress = b.progress.find(d => d.step === 'governor');
    return governorProgress && governorProgress.statusLabel === 'Pending';
  });

  // Special lists from allGovernorBills
  const vetoedBills = allGovernorBills.filter(b => {
    const governorProgress = b.progress.find(d => d.step === 'governor');
    return governorProgress && governorProgress.statusLabel === 'Vetoed';
  });

  const signedBills = allGovernorBills.filter(b => {
    const governorProgress = b.progress.find(d => d.step === 'governor');
    return governorProgress && governorProgress.statusLabel === 'Signed';
  });

  const amendmentSuggestedBills = allGovernorBills.filter(b => {
    const governorProgress = b.progress.find(d => d.step === 'governor');
    return governorProgress && governorProgress.statusLabel === 'Amendment suggested';
  });

  const vetoOverrideAttempts = allGovernorBills.filter(b => {
    const governorProgress = b.progress.find(d => d.step === 'governor');
    return governorProgress && governorProgress.statusLabel === 'Veto Override Pending';
  });

  const successfulVetoOverrides = allGovernorBills.filter(b => {
    const governorProgress = b.progress.find(d => d.step === 'governor');
    return governorProgress && governorProgress.statusLabel === 'Veto Overridden';
  });

  const letBecomeLawBills = allGovernorBills.filter(b => {
    const governorProgress = b.progress.find(d => d.step === 'governor');
    return governorProgress && governorProgress.statusLabel === 'Became law unsigned';
  });

  const becameLawWithLineItemVetoBills = allGovernorBills.filter(b => {
    const governorProgress = b.progress.find(d => d.step === 'governor');
    return governorProgress && governorProgress.statusLabel === 'Became law with line-item vetoes';
  });

  // list of bills that are vetoed or signed from the passedBothChambersNotSent list to remove
  const excludeIds = new Set([
    ...vetoedBills.map(b => b.identifier),
    ...signedBills.map(b => b.identifier),

    // just in case™ we have this issue with other action types in the future
    // ...amendmentSuggestedBills.map(b => b.identifier),
    // ...vetoOverrideAttempts.map(b => b.identifier),
    // ...successfulVetoOverrides.map(b => b.identifier),
    // ...letBecomeLawBills.map(b => b.identifier),
    // ...becameLawWithLineItemVetoBills.map(b => b.identifier),
  ]);

  // Filter out bills that have been vetoed or signed from the passedBothChambersNotSent list
  const cleanPassedBothChambersNotSent = passedBothChambersNotSent.filter(
    b => !excludeIds.has(b.identifier)
  );

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

        <div>
          Another <strong style={{ fontSize: '1.8em' }}>{numberFormat(cleanPassedBothChambersNotSent.length)}</strong> bills have been passed by both chambers of the Legislature but haven{"\u0027"}t yet been transmitted to the governor.
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

        {becameLawWithLineItemVetoBills.length > 0 && (
          <>
            <h4>Became law with line-item vetoes ({numberFormat(becameLawWithLineItemVetoBills.length)})</h4>
            <div className="note">
              These bills became law after the session ended, with the Governor&#39;s line-item vetoes taking effect automatically.
            </div>
            <BillTable bills={becameLawWithLineItemVetoBills} displayLimit={5} />
          </>
        )}

        <h4>Signed into law ({numberFormat(signedBills.length)})</h4>
        <BillTable bills={signedBills} displayLimit={5} />

        {cleanPassedBothChambersNotSent.length > 0 && (
          <>
            <h4>Passed the Legislature but not yet sent to governor ({numberFormat(cleanPassedBothChambersNotSent.length)})</h4>
            <BillTable bills={cleanPassedBothChambersNotSent} displayLimit={5} />
          </>
        )}

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
  const bills = await import('../data/bills.json');

  // Filter to include only House Bills and Senate Bills — No resolutions
  const regularBills = bills.default.filter(bill => {
    return bill.type === 'house bill' || bill.type === 'senate bill' || bill.type === 'budget bill';
  });

  // Apply the transmitted to governor filter to only HB and SB bills
  const billsTransmittedToGovernor = regularBills.filter(bill => bill.hasBeenSentToGovernor);

  // Filter bills that passed both chambers but not yet sent to governor
  // Also only include HB and SB bills (not resolutions)
  const passedBothChambersNotSent = regularBills.filter(bill => {
    // Check if the bill passed first chamber
    const firstChamberProgress = bill.progress.find(d => d.step === 'first chamber');
    const passedFirstChamber = firstChamberProgress && firstChamberProgress.status === 'passed';

    // Check if the bill passed second chamber
    const secondChamberProgress = bill.progress.find(d => d.step === 'second chamber');
    const passedSecondChamber = secondChamberProgress && secondChamberProgress.status === 'passed';

    // Check if reconciliation was needed and completed (if applicable)
    const reconciliationProgress = bill.progress.find(d => d.step === 'reconciliation');
    const reconciliationComplete = !reconciliationProgress ||
      reconciliationProgress.status === 'passed' ||
      reconciliationProgress.status === 'skipped';

    // Not yet sent to governor
    const notSentToGovernor = !bill.hasBeenSentToGovernor;

    return passedFirstChamber && passedSecondChamber && reconciliationComplete && notSentToGovernor;
  });

  return {
    props: {
      billsTransmittedToGovernor,
      passedBothChambersNotSent,
    },
  };
}

export default Governor;



// Pre-07-21-2025 version of the page just in case™ there is an issue with the new version
/*
New version handles cases where bill is missing the "Transmitted to Governor" step from state data 
ends up signed or vetoed. Which happened on a few bills in the 2025 session.
*/


// import React from 'react';
// import ReactMarkdown from 'react-markdown';
// import Head from 'next/head'; // For SEO
// import Layout from '../design/Layout';
// import LinksList from '../components/LinksList';
// import ContactUs from '../components/ContactUs';
// import BillTable from '../components/BillTable';
// import NewsletterSignup from '../components/NewsletterSignup';

// import governorData from '../data/governor.json';
// import { numberFormat, dateFormat } from '../config/utils';

// const plural = (value) => (value !== 1 ? 's' : '');

// const Governor = ({ billsTransmittedToGovernor, passedBothChambersNotSent }) => {
//   const { text, articles } = governorData;

//   // filter functions
//   // const toGovernor = d => d.data.progress.toGovernor
//   // const awaitingGovernorAction = d => d.progress.governorStatus === 'pending'
//   // const signedByGovernor = d => d.progress.governorStatus === 'signed'
//   // const vetoedByGovernor = d => d.progress.governorStatus === 'vetoed'
//   // const enactedWithNoGovernorSignature = d => d.progress.governorStatus === 'became law unsigned'


//   // Filter bills based on status v2
//   const awaitingActionBills = billsTransmittedToGovernor.filter(b => {
//     const governorProgress = b.progress.find(d => d.step === 'governor');
//     return governorProgress && governorProgress.statusLabel === 'Pending';
//   });

//   const vetoedBills = billsTransmittedToGovernor.filter(b => {
//     const governorProgress = b.progress.find(d => d.step === 'governor');
//     return governorProgress && governorProgress.statusLabel === 'Vetoed';
//   });

//   const amendmentSuggestedBills = billsTransmittedToGovernor.filter(b => {
//     const governorProgress = b.progress.find(d => d.step === 'governor');
//     return governorProgress && governorProgress.statusLabel === 'Amendment suggested';
//   });

//   const vetoOverrideAttempts = billsTransmittedToGovernor.filter(b => {
//     const governorProgress = b.progress.find(d => d.step === 'governor');
//     return governorProgress && governorProgress.statusLabel === 'Veto Override Pending';
//   });

//   const successfulVetoOverrides = billsTransmittedToGovernor.filter(b => {
//     const governorProgress = b.progress.find(d => d.step === 'governor');
//     return governorProgress && governorProgress.statusLabel === 'Veto Overridden';
//   });

//   const signedBills = billsTransmittedToGovernor.filter(b => {
//     const governorProgress = b.progress.find(d => d.step === 'governor');
//     return governorProgress && governorProgress.statusLabel === 'Signed';
//   });

//   const letBecomeLawBills = billsTransmittedToGovernor.filter(b => {
//     const governorProgress = b.progress.find(d => d.step === 'governor');
//     return governorProgress && governorProgress.statusLabel === 'Became law unsigned';
//   });

//   const becameLawWithLineItemVetoBills = billsTransmittedToGovernor.filter(b => {
//     const governorProgress = b.progress.find(d => d.step === 'governor');
//     return governorProgress && governorProgress.statusLabel === 'Became law with line-item vetoes';
//   });

//   return (
//     <div>
//       <Layout
//         relativePath='/governor'
//         pageTitle={"Gov. Greg Gianforte | 2025 MTFP Capitol Tracker"}
//         pageDescription={"Montana Gov. Greg Gianforte's 2025 bill signatures and vetoes."}
//         socialTitle={"Gov. Greg Gianforte | 2025 MTFP Capitol Tracker"}
//         socialDescription={"Montana Gov. Greg Gianforte's 2025 bill signatures and vetoes.."}
//       >

//         <h1>Gov. Greg Gianforte</h1>
//         <ReactMarkdown>{text}</ReactMarkdown>

//         <div>
//           <strong style={{ fontSize: '1.8em' }}>{numberFormat(billsTransmittedToGovernor.length)}</strong> 2025 bill{plural(billsTransmittedToGovernor.length)} have been transmitted to Gov. Gianforte for his signature.
//         </div>

//         <div>
//           Another <strong style={{ fontSize: '1.8em' }}>{numberFormat(passedBothChambersNotSent.length)}</strong> bills have been passed by both chambers of the Legislature but haven{"\u0027"}t yet been transmitted to the governor.
//         </div>

//         <h4>Awaiting action ({numberFormat(awaitingActionBills.length)})</h4>
//         <BillTable bills={awaitingActionBills} displayLimit={5} />

//         <h4>Vetoed ({numberFormat(vetoedBills.length)})</h4>
//         <div className="note">
//           Vetos can be overridden by two-thirds majorities in the House and Senate.
//         </div>
//         <BillTable bills={vetoedBills} displayLimit={5} />

//         {vetoOverrideAttempts.length > 0 && (
//           <>
//             <h4>Pending veto override efforts ({numberFormat(vetoOverrideAttempts.length)})</h4>
//             <BillTable bills={vetoOverrideAttempts} displayLimit={5} />
//           </>
//         )}

//         {amendmentSuggestedBills.length > 0 && (
//           <>
//             <h4>Returned with suggested amendment ({numberFormat(amendmentSuggestedBills.length)})</h4>
//             <BillTable bills={amendmentSuggestedBills} displayLimit={5} />
//           </>
//         )}

//         {successfulVetoOverrides.length > 0 && (
//           <>
//             <h4>Vetoes overridden by Legislature ({numberFormat(successfulVetoOverrides.length)})</h4>
//             <BillTable bills={successfulVetoOverrides} displayLimit={5} />
//           </>
//         )}

//         {becameLawWithLineItemVetoBills.length > 0 && (
//           <>
//             <h4>Became law with line-item vetoes ({numberFormat(becameLawWithLineItemVetoBills.length)})</h4>
//             <div className="note">
//               These bills became law after the session ended, with the Governor&#39;s line-item vetoes taking effect automatically.
//             </div>
//             <BillTable bills={becameLawWithLineItemVetoBills} displayLimit={5} />
//           </>
//         )}

//         <h4>Signed into law ({numberFormat(signedBills.length)})</h4>
//         <BillTable bills={signedBills} displayLimit={5} />

//         {passedBothChambersNotSent.length > 0 && (
//           <>
//             <h4>Passed the Legislature but not yet sent to governor ({numberFormat(passedBothChambersNotSent.length)})</h4>
//             <BillTable bills={passedBothChambersNotSent} displayLimit={5} />
//           </>
//         )}

//         <h4>Became law without signature</h4>
//         <div className="note">
//           Bills that have become law without the governor&#39;s signature after the governor chooses not to issue a signature or a veto by the 10-day deadline specified in the Montana Constitution.
//         </div>
//         <BillTable bills={letBecomeLawBills} displayLimit={5} />

//         <NewsletterSignup />

//         <h3>Montana Free Press coverage</h3>
//         <div>2025 legislative stories involving the Governor&#39;s Office.</div>
//         <LinksList articles={articles} />

//         <ContactUs />
//       </Layout>
//     </div>
//   );
// };

// // Fetch data at build time
// export async function getStaticProps() {
//   const bills = await import('../data/bills.json');
  
//   // Filter to include only House Bills and Senate Bills — No resolutions
//   const regularBills = bills.default.filter(bill => {
//     return bill.type === 'house bill' || bill.type === 'senate bill' || bill.type === 'budget bill';
//   });
  
//   // Apply the transmitted to governor filter to only HB and SB bills
//   const billsTransmittedToGovernor = regularBills.filter(bill => bill.hasBeenSentToGovernor);

//   // Filter bills that passed both chambers but not yet sent to governor
//   // Also only include HB and SB bills (not resolutions)
//   const passedBothChambersNotSent = regularBills.filter(bill => {
//     // Check if the bill passed first chamber
//     const firstChamberProgress = bill.progress.find(d => d.step === 'first chamber');
//     const passedFirstChamber = firstChamberProgress && firstChamberProgress.status === 'passed';

//     // Check if the bill passed second chamber
//     const secondChamberProgress = bill.progress.find(d => d.step === 'second chamber');
//     const passedSecondChamber = secondChamberProgress && secondChamberProgress.status === 'passed';

//     // Check if reconciliation was needed and completed (if applicable)
//     const reconciliationProgress = bill.progress.find(d => d.step === 'reconciliation');
//     const reconciliationComplete = !reconciliationProgress ||
//       reconciliationProgress.status === 'passed' ||
//       reconciliationProgress.status === 'skipped';

//     // Not yet sent to governor
//     const notSentToGovernor = !bill.hasBeenSentToGovernor;

//     return passedFirstChamber && passedSecondChamber && reconciliationComplete && notSentToGovernor;
//   });

//   return {
//     props: {
//       billsTransmittedToGovernor,
//       passedBothChambersNotSent,
//     },
//   };
// }

// export default Governor;