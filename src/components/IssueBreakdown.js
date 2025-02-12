import React from 'react'
import Link from 'next/link'
import BillTable from './BillTable'
import { urlize } from '@/config/utils'
import { css } from '@emotion/react'

const keyIssuesStyle = css`
  .topic-title {
    text-transform: uppercase;
    padding-bottom: 0.2em;
    border-bottom: 1px solid var(--gray5);
  }
  .issue-title {
    background-color: var(--tan6);
    padding: 0.5em 0.75em;
    color: white;
  }
  .issue-description {
    font-style: italic;
    line-height: 1.1em;
  }
`


const IssueBreakdown = ({ topics, bills }) => {
  return (
    <div css={keyIssuesStyle}>

      <div className="note">
          Major legislative topics identified by MTFP reporters. Where ambiguous, official bill titles are annotated with plain language summaries.
      </div>
      
      {/* Topic navigation */}
      {topics.map((topic, i) => (
          <span key={topic.topicTitle}>
            {i !== 0 ? ' • ' : ''}
            <Link href={`/#${urlize(topic.topicTitle)}`}>{topic.topicTitle}</Link>
          </span>
      ))}

      {/* Full listing */}
      { topics.map(topic => {
              return (
                <div key={topic.topicTitle} id={urlize(topic.topicTitle)}>
                  <h3 className="topic-title">{topic.topicTitle}</h3>
                  {topic.issues.map((issue, i) => {
                    const issueBills = bills.filter(d => issue.bills.includes(d.identifier))
                    return  <div key={issue.title}>
                      <h4 className="issue-title">Issue: {issue.title}</h4>
                      <div className="issue-description">{issue.description}</div>
                      <BillTable  bills={issueBills} displayLimit={15} suppressCount={true} />
                    </div>
                  })}
                </div>
              )
      })}
      
    </div>
  )
}

export default IssueBreakdown