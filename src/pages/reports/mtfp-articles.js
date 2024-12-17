import React from "react";
import Link from 'next/link';
import Layout from '../../components/Layout';
import articles from '../../data/articles.json';
import { dateFormatWithYear, billUrl, lawmakerUrl } from '../../config/utils';

const presentDate = date => date ? dateFormatWithYear(new Date(date)) : null;

const Articles = () => {
    return (
        <div>
            <Layout>
                <h1>MTFP articles about the 2023 Legislature</h1>
                <div>
                    {articles.map(article => {
                        return (
                            <div key={article.title} style={{ borderBottom: '1px solid #666' }}>
                                <h4><a href={article.link}>{article.title}</a></h4>
                                <div className="note">{article.author} • {presentDate(article.date)}</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    <div style={{ flex: '1 0 150px' }}>Lawmakers:
                                        <ul>
                                            {article.lawmakerTags.map(tag => (
                                                <li key={tag}><Link href={`/lawmakers/${lawmakerUrl(tag)}`}>{tag}</Link></li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div style={{ flex: '1 0 150px' }}>Bills:
                                        <ul>
                                            {article.billTags.map(tag => (
                                                <li key={tag}><Link href={`/bills/${billUrl(tag)}`}>{tag}</Link></li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Layout>
        </div>
    );
};

export default Articles;
