import React from "react";
import Layout from '../../components/Layout';
import BillTable from '../../components/BillTable';
import ContactUs from '../../components/ContactUs';
import bills from '../../data-nodes/bills.json'

const LegalNoteBills = ({ billsWithLegalNotes }) => {
  return (
    <div>
      <Layout>
        <h1>2023 bills with legal notes</h1>
        <BillTable bills={billsWithLegalNotes} displayLimit={1200} />
        <ContactUs />
      </Layout>
    </div>
  );
};

// Function to fetch bills with legal notes
export const getStaticProps = async () => {
  // Filter bills to include only those with legal notes
  const billsWithLegalNotes = bills.filter(bill => bill.legalNoteUrl !== null);

  return {
    props: {
      billsWithLegalNotes,
    },
  };
};

export default LegalNoteBills;
