import React from 'react';
import { css } from '@emotion/react';

const containerCss = css`
    margin-top: 3em;
    border: 1px solid var(--gray4);
    background: var(--gray1);
    padding: 1em;

    h3 {
        margin-top: 0;
    }
    p {
        font-family: futura-pt, Arial, Helvetica, sans-serif;
        line-height: 1.2em;
    }
`;

const ContactUs = () => {
    return (
        <div css={containerCss}>
            <h3>About the 2023 Montana Free Press Capitol Tracker</h3>
            <p>
                This guide is an effort to make the quantifiable aspects of the Montana Legislature more accessible to the public by compiling information about lawmakers, proposed bills and the legislative process. This is a project of <a href="http://montanafreepress.org/">Montana Free Press</a>, a 501(c)(3) nonprofit newsroom that aims to provide Montanans with in-depth, nonpartisan news coverage.
            </p>

            <p>
                The information presented here is collected from a variety of sources including the Montana Legislature&#39;s <a href="https://leg.mt.gov/legislator-information/">public roster</a> and its official bill-tracking system, the <a href="http://laws.leg.mt.gov/legprd/law0203w$.startup?P_SESS=20211">Legislative Automated Workflow System</a>, or LAWS. Reporting and web design was done primarily by MTFP Deputy Editor Eric Dietrich. Please contact him at <a href="mailto:edietrich@montanafreepress.org">edietrich@montanafreepress.org</a> with bug reports, questions or suggestions.
            </p>

            <p>
                Think there&#39;s a potential news story to be done about a bill or lawmaker you see here? Tell us at <a href="mailto:tips@montanafreepress.org">tips@montanafreepress.org</a>.
            </p>
        </div>
    );
};

export default ContactUs;
