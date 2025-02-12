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
import IssueBreakdown from '../components/IssueBreakdown';


import processAnnotations from '../data/process-annotations.json';
import keyTopics from '../data/key-topics.json'
import bills from '../data/bills.json'
import lawmakers from '../data/lawmakers.json'

const Index = ({ keyBills, billIndex, lawmakerIndex }) => {
  const howBillsMoveObj = processAnnotations.find(item => item.key === "howBillsMove");
  const howBillsMove = howBillsMoveObj ? howBillsMoveObj.content : null;

  console.log(keyTopics)

  return (
    <div>
      <Layout home
          relativePath='/'
          pageTitle={"2025 Montana Capitol Tracker | Montana Free Press"}
          pageDescription={"The lawmakers, bills and votes making Montana's laws at the 2025 Legislature."}
          socialTitle={"2025 Montana Free Press Capitol Tracker"}
          socialDescription={"The lawmakers, bills and votes making Montana's laws at the 2025 Legislature."}
        >

        <InfoPopup label="How bills move through the Legislature" content={howBillsMove} />

        <h2 id="key-issues">Key 2025 issues</h2>
        <IssueBreakdown topics={keyTopics} bills={bills}/>
        
        <hr />

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
  const lawmakerIndex = lawmakers.filter(lawmaker => lawmaker.isActive);

  return {
    props: {
      keyBills,
      billIndex,
      lawmakerIndex,
    },
  };
}

export default Index;
