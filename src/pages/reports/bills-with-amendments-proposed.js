import React from 'react';
import Layout from '../../components/Layout';
import BillTable from '../../components/BillTable';
import ContactUs from '../../components/ContactUs';
import bills from '../../data-nodes/bills.json';

const BillsWithAmendments = ({ bills }) => {
  return (
    <div>
      <Layout>
        <h1>2023 bills with proposed amendments</h1>
        <BillTable bills={bills} displayLimit={1200} />
        <ContactUs />
      </Layout>
    </div>
  );
};

export const getStaticProps = async () => {
  // Filter bills with proposed amendments
  const billsWithAmendments = bills.filter(bill => bill.amendmentsUrl !== null);

  return {
    props: {
      bills: billsWithAmendments,
    },
  };
};

export default BillsWithAmendments;
