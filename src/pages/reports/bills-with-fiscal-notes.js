import React from 'react';
import Layout from '../../components/Layout';
import BillTable from '../../components/BillTable';
import ContactUs from '../../components/ContactUs';
import bills from '../../data-nodes/bills.json';

const FiscalNoteBills = ({ bills }) => {
  return (
    <div>
      <Layout>
        <h1>2023 bills with fiscal notes</h1>
        <BillTable bills={bills} displayLimit={1200} />
        <ContactUs />
      </Layout>
    </div>
  );
};

export const getStaticProps = async () => {
  // Filter bills with fiscal notes
  const billsWithFiscalNotes = bills.filter(bill => bill.fiscalNoteUrl !== null);

  return {
    props: {
      bills: billsWithFiscalNotes,
    },
  };
};

export default FiscalNoteBills;