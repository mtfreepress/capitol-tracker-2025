import React from "react";
import Link from 'next/link';
import Layout from '../components/Layout';
import BillTable from '../components/BillTable';
import InfoPopup from '../components/InfoPopup';
import NewsletterSignup from '../components/NewsletterSignup';
import ContactUs from '../components/ContactUs';
import BillLookup from '../components/input/BillLookup';
import LawmakerLookup from '../components/input/LawmakerLookup';
import DistrictLookup from '../components/input/DistrictLookup';
import { urlize } from '../config/utils';
import processAnnotations from '../data/process-annotations.json';
import keyBillCategories from '../data/bill-categories.json';
import bills from '../data/data-nodes/bills.json'
import lawmakers from '../data/data-nodes/lawmakers.json'

const Index = ({ keyBills, billIndex, lawmakerIndex }) => {
  const { howBillsMove } = processAnnotations;

  return (
    <div>
      <Layout>
        <h2 id="key-bill-status">Key bill progress</h2>
        <div>
          {keyBillCategories.sort((a, b) => a.order - b.order).map((c, i) => (
            <span key={c.category}>
              {i !== 0 ? ' • ' : ''}
              <Link href={`/#${urlize(c.category)}`}>{c.category}</Link>
            </span>
          ))}
        </div>
        <div className="note">
          Major legislation identified by MTFP reporters. Where ambiguous, official bill titles are annotated with plain language summaries.
        </div>
        <InfoPopup label="How bills move through the Legislature" content={howBillsMove} />
        {
          keyBillCategories
            .filter(d => d.show)
            .sort((a, b) => a.order - b.order)
            .map(c => {
              const billsInCat = keyBills.filter(d => d.majorBillCategory === c.category);
              return (
                <div key={c.category} id={urlize(c.category)}>
                  <h4>{c.category}</h4>
                  <div className="note">{c.description}</div>
                  <BillTable bills={billsInCat} displayLimit={15} suppressCount={true} />
                </div>
              );
            })
        }
        <NewsletterSignup />
        <h2 id="find-bill">Find a bill</h2>
        <BillLookup bills={billIndex} />
        <h2 id="find-lawmaker">Find a lawmaker</h2>
        <LawmakerLookup lawmakers={lawmakerIndex} />
        <h2 id="find-district">Find your district</h2>
        <DistrictLookup lawmakers={lawmakerIndex} />
        <ContactUs />
      </Layout>
    </div>
  );
};

export async function getStaticProps() {
  const keyBills = bills.filter(bill => bill.isMajorBill);
  const billIndex = bills;
  const lawmakerIndex = lawmakers.filter(lawmaker => lawmaker.isActive);

  return {
    props: {
      keyBills,
      billIndex,
      lawmakerIndex,
    },
  };
}

// TODO - Ask Eric if we need to have this or not
// SEO - Isn't being used in gatsby so we prob don't need this. 
// export function Head() {
//   return (
//     <Seo title="Your Page Title" pageRelativeUrl="" />
//   );
// }

export default Index;
