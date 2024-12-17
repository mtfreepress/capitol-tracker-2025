import lawmakersData from '../data/data-nodes/lawmakers.json';
import getConfig from 'next/config';


export const getAllLawmakerKeys = () => {
    return lawmakersData.map(lawmaker => lawmaker.key);
};

export const fetchLawmakerData = (key) => {
    const lawmaker = lawmakersData.find(lawmaker => lawmaker.key === key);

    // If no lawmaker found, return null or handle error
    if (!lawmaker) {
        throw new Error(`Lawmaker with key ${key} not found`);
    }

    return {
        key: lawmaker.key,
        title: lawmaker.title,
        name: lawmaker.name,
        party: lawmaker.party,
        chamber: lawmaker.chamber,
        district: lawmaker.district,
        districtElexHistory: lawmaker.districtElexHistory,
        locale: lawmaker.locale,
        committees: lawmaker.committees,
        legislativeHistory: lawmaker.legislativeHistory,
        keyBillVotes: lawmaker.keyBillVotes || [],
        leadershipTitle: lawmaker.leadershipTitle || null,
        votingSummary: lawmaker.votingSummary,
        sponsoredBills: lawmaker.sponsoredBills || [],
        phone: lawmaker.phone || null,
        email: lawmaker.email || null,
        articles: lawmaker.articles || [],
        districtLocale: lawmaker.districtLocale || '', // not sure if this is used
        portrait: lawmaker.imageSlug,
    };
};



export const fetchPortraitImage = (imageSlug) => {
    const basePath = process.env.BASE_PATH || '';
    const imagePath = `${basePath}/images/portraits/${imageSlug}`;
    return imagePath;
  };


export const fetchLawmakerPaths = () => {
    return lawmakersData.map((lawmaker) => ({
        params: { key: lawmaker.key },
    }));
};
