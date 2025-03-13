import React from "react";
import Link from 'next/link';
import Layout from '../design/Layout';
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
import bills from '../data/bills.json'
import lawmakers from '../data/lawmakers.json'

const Index = ({ keyBills, billIndex, lawmakerIndex }) => {
  const howBillsMoveObj = processAnnotations.find(item => item.key === "howBillsMove");
  const howBillsMove = howBillsMoveObj ? howBillsMoveObj.content : null;

  return (
    <div>
      <Layout home
          relativePath='/'
          pageTitle={"2025 Montana Capitol Tracker | Montana Free Press"}
          pageDescription={"The lawmakers, bills and votes making Montana's laws at the 2025 Legislature."}
          socialTitle={"2025 Montana Free Press Capitol Tracker"}
          socialDescription={"The lawmakers, bills and votes making Montana's laws at the 2025 Legislature."}
        >
        {/* TODO: Rework "Key Bills" */}
        {/* <h2 id="key-bill-status">Key bill progress</h2>
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
        </div> */}
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
        <h2 id="find-bill">Find a bill</h2>
        <BillLookup bills={billIndex} />
        <h2 id="find-lawmaker">Find a lawmaker</h2>
        <LawmakerLookup lawmakers={lawmakerIndex} />
        <NewsletterSignup />
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
  const lawmakerIndex = lawmakers;

  return {
    props: {
      keyBills,
      billIndex,
      lawmakerIndex,
    },
  };
}

export default Index;
