import React from "react";
import Link from "next/link";
import { css } from "@emotion/react";
import Layout from '../design/Layout';
import BillTable from "../components/BillTable";
import ContactUs from "../components/ContactUs";
import NewsletterSignup from "../components/NewsletterSignup";
import { capitalize, numberFormat } from "../config/utils";
import billsJson from "../data/bills.json";
import TruncatedContainer from "../components/TruncatedContainer";
const types = [
  "budget bill",
  "house bill",
  "senate bill",
  "constitutional amendment",
  "revenue resolution",
  "study resolution",
  "house resolution",
  "senate resolution",
  "joint resolution",
];

const allBillsPageStyle = css`
  h2 .top-link {
    font-size: 0.7em;
    font-weight: normal;
    font-style: italic;
  }
`;

const AllBills = () => {
  const allBills = billsJson;

  const byType = types.map(type => ({
    type,
    bills: allBills.filter(d => d.type === type),
  }));

  return (
    <div css={allBillsPageStyle}>
      <Layout
        relativePath='/all-bills'
        pageTitle={"All Introduced Bills | 2025 MTFP Capitol Tracker"}
        pageDescription={"The lawmakers, bills and votes making Montana's laws at the 2025 Legislature."}
        socialTitle={"All Introduced Bills | 2025 MTFP Capitol Tracker"}
        socialDescription={"The lawmakers, bills and votes making Montana's laws at the 2025 Legislature."}
      >
        <h1>All 2025 bills</h1>
        <div className="note">
          <strong>{numberFormat(allBills.length)}</strong> total bills, resolutions, and other measures introduced
        </div>
        <div>
          {types.map((type, i) => (
            <span key={type}>
              {i !== 0 ? " • " : ""}
              <Link href={`/all-bills#${type.replace(" ", "-")}`}>
                {capitalize(type)}s ({byType.find((d) => d.type === type).bills.length})
              </Link>
            </span>
          ))}
        </div>

        {byType.map((group, i) => (
          <div id={group.type.replace(" ", "-")} key={group.type}>
            <h2>
              {capitalize(group.type)}s ({group.bills.length}){" "}
              {i !== 0 && <Link className="top-link" href="/all-bills">&raquo; top of page</Link>}
            </h2>
            <BillTable bills={group.bills} displayLimit={1200} />
            {i === 0 && <NewsletterSignup />}
          </div>
        ))}

        <ContactUs />
      </Layout>
    </div>
  );
};

// head component for SEO
import Head from "next/head";

export const SeoHead = () => (
  <Head>
    <title>All 2025 bills</title>
    <meta name="description" content="Page for all 2025 bills" />
  </Head>
);

export default AllBills;
