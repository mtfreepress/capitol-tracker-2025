import React from "react";
import ReactMarkdown from 'react-markdown';

import Layout from '../../design/Layout';
import SEO from "../Seo";
import ContactUs from '../ContactUs';
import LinksList from '../LinksList';
import NewsletterSignup from '../NewsletterSignup';

import BillStatus from '../bill/Status';
import BillInfo from '../bill/Info';
import BillActions from '../bill/Actions';

const BillPage = ({ bill }) => {
  const {
    key, identifier, title, status, progress, chamber,
    lawsUrl, vetoMemoUrl, articles, actions,
    explanation, type,
    billPageText
  } = bill;

  return (
    <div>
      <Layout
        relativePath={`/${key}`}
        pageTitle={`${identifier}: ${title} | 2025 MTFP Capitol Tracker`}
        pageDescription={"Bill text, details and status."}
        socialTitle={`${identifier} | 2025 MTFP Capitol Tracker`}
        socialDescription={`${title}`}
      >
        <h1>{identifier}: {title}</h1>
        <div>{explanation}</div>

        <BillStatus
          identifier={identifier}
          chamber={chamber}
          type={type}
          status={status}
          progress={progress}
        />

        <hr />

        <BillInfo bill={bill} />

        <ReactMarkdown>{billPageText}</ReactMarkdown>

        {articles.length > 0 && (
          <div>
            <h3 id="mtfp-articles">Montana Free Press coverage</h3>
            <div>MTFP stories involving the bill</div>
            <LinksList articles={articles} />
          </div>
        )}

        <NewsletterSignup />

        <BillActions actions={actions} lawsUrl={lawsUrl} vetoMemoUrl={vetoMemoUrl} />

        <ContactUs />
      </Layout>
    </div>
  );
};

export const Head = ({ bill }) => {
  const { key, identifier, title } = bill;
  return (
    <SEO
      title={`${identifier}: ${title}`}
      description={`Bill details, sponsor, text, procedural status and more for ${identifier}: ${title}.`}
      pageRelativeUrl={`bills/${key}/`}
    />
  );
};

export default BillPage;