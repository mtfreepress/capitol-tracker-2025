import lawmakersData from '../data/data-nodes/lawmakers.json';

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
    };
};

export const fetchPortraitImage = (imageSlug) => {
    const imagePath = `/images/${imageSlug}.jpg`;
    return fetch(imagePath)
        .then((response) => (response.ok ? imagePath : '/images/default-portrait.jpg'))
        .catch(() => '/images/default-portrait.jpg');
};

export const fetchLawmakerPaths = () => {
    return lawmakersData.map((lawmaker) => ({
        params: { key: lawmaker.key },
    }));
};
