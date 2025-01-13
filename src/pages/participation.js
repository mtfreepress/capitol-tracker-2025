import React from "react"
import ReactMarkdown from 'react-markdown'
import Layout from '../design/Layout'
import NewsletterSignup from "../components/NewsletterSignup"
import ContactUs from "../components/ContactUs"
import participationData from '../data/participation.json'

const Participate = ({ text }) => {
    return (
        <div>
            <Layout
                 relativePath='/participation'
                 pageTitle={"Participate | 2025 MTFP Capitol Tracker"}
                 pageDescription={"How to participate in the 2025 Montana Legislature."}
                 socialTitle={"Participate | 2025 MTFP Capitol Tracker"}
                 socialDescription={"How to participate in the 2025 Montana Legislature."}
            >
                <h1 id="participation">Participating in the 2021 Legislature</h1>
                <div className="note">Compiled by Amanda Eggert</div>
                <ReactMarkdown>{text}</ReactMarkdown>
                <NewsletterSignup />
                <ContactUs />
            </Layout>
        </div>
    )
}

export async function getStaticProps() {
    const { text } = participationData;

    return {
        props: {
            text,
        },
    };
}

export default Participate;
