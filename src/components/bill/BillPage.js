import React from "react";
import ReactMarkdown from 'react-markdown';

import Layout from '../../design/Layout';
import ContactUs from '../ContactUs';
import LinksList from '../LinksList';
import NewsletterSignup from '../NewsletterSignup';

import BillStatus from '../bill/Status';
import BillInfo from '../bill/Info';
import BillActions from '../bill/Actions';

const BillPage = ({ bill }) => {
  const {
    key, identifier, identifierLong, title, status, progress, chamber,
    lawsUrl, vetoMemoUrl, articles, actions,
    explanation, type,
    billPageText
  } = bill;

  return (
    <div>
      <Layout
        relativePath={`/${key}`}
        pageTitle={`${identifierLong}: ${title} | 2025 MTFP Capitol Tracker`}
        pageDescription={"Bill text, sponsor, details and status."}
        socialTitle={`${identifierLong} | 2025 MTFP Capitol Tracker`}
        socialDescription={`Official short title: ${title}.`}
      >
        <h1>{identifierLong}: {title}</h1>
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

export default BillPage;