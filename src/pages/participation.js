import React from "react"
import ReactMarkdown from 'react-markdown'
import Layout from '../design/Layout'
import NewsletterSignup from "../components/NewsletterSignup"
import ContactUs from "../components/ContactUs"
import participationData from '../data/participation.json'

const Participate = ({ text }) => {
    return (
        <div>
            <Layout>
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

import Head from 'next/head'

export const MetaHead = () => (
    <Head>
        <title>Participate</title>
        <meta
            name="description"
            content="How to participate in Montana's 2023 Legislature"
        />
        <meta property="og:url" content="participation/" />
    </Head>
)

export default Participate;
