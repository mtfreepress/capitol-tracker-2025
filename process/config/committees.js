
// export const COMMITTEE_NAME_CLEANING = {
// TODO - switch over to model analogous to lawmakers to capture variation in committe names from different places in LAWS
// }

export const COMMITEE_NAME_CLEANING = {
    // standardizeCommiteeNames in functions.js accounts for '(H) (H)' and '(S) (S)' quirk
    '(H) Appropriations': 'House Appropriations',
    '(H) Judiciary': 'House Judiciary',
    '(H) Business and Labor': 'House Business and Labor',
    '(H) Taxation': 'House Taxation',
    '(H) State Administration': 'House State Administration',
    '(H) Human Services': 'House Human Services',
    '(H) Natural Resources': 'House Natural Resources',
    '(H) Transportation': 'House Transportation',
    '(H) Education': 'House Education',
    '(H) Energy, Technology and Federal Relations': 'House Energy, Technology and Federal Relations',
    '(H) Agriculture': 'House Agriculture',
    '(H) Fish, Wildlife and Parks': 'House Fish, Wildlife and Parks',
    '(H) Local Government': 'House Local Government',
    '(H) Rules': 'House Rules',
    '(H) Ethics': 'House Ethics',
    '(H) Legislative Administration': 'House Legislative Administration',

    '(S) Finance and Claims': 'Senate Finance and Claims',
    '(S) Judiciary': 'Senate Judiciary',
    '(S) Business, Labor, and Economic Affairs': 'Senate Business, Labor, and Economic Affairs',
    '(S) Taxation': 'Senate Taxation',
    '(S) Energy and Telecommunications': 'Senate Energy and Telecommunications',
    '(S) Local Government': 'Senate Local Government',
    '(S) Natural Resources': 'Senate Natural Resources',
    '(S) Public Health, Welfare and Safety': 'Senate Public Health, Welfare and Safety',
    '(S) State Administration': 'Senate State Administration',
    '(S) Agriculture, Livestock and Irrigation': 'Senate Agriculture, Livestock and Irrigation',
    '(S) Education and Cultural Resources': 'Senate Education and Cultural Resources',
    '(S) Fish and Game': 'Senate Fish and Game',
    '(S) Highways and Transportation': 'Senate Highways and Transportation',
    '(S) Committee on Committees': 'Senate Committee on Committees',
    '(S) Ethics': 'Senate Ethics',
    '(S) Rules': 'Senate Rules',
    '(S) Legislative Administration': 'Senate Legislative Administration',

    '(H) Joint Appropriations Subcommittee on General Government': 'Joint Appropriations Section A — General Government',
    '(H) Joint Appropriations Subcommittee on Health and Human Services': 'Joint Appropriations Section B — Health and Human Services',
    '(H) Joint Appropriations Subcommittee on Health & Human Services': 'Joint Appropriations Section B — Health and Human Services',
    '(H) Joint Appropriations Subcommittee on Natural Resources and Transportation': 'Joint Appropriations Section C — Natural Resources and Transportation',
    '(H)Joint Approps Subcom on Judicial Branch, Law Enforcement, and Justice': 'Joint Appropriations Section D — Judicial Branch, Law Enforcement, and Justice',
    '(H) Joint Approps Subcom on Judicial Branch, Law Enforcement, and Justice': 'Joint Appropriations Section D — Judicial Branch, Law Enforcement, and Justice',
    '(H) Joint Appropriations Subcommittee on Education': 'Joint Appropriations Section E — Education',
    '(H) Joint Appropriations Subcommittee on Long Range Planning': 'Joint Appropriations Section F — Long-Range Planning',
    '(H) Joint Appropriations Subcommittee on Long-Range Planning': 'Joint Appropriations Section F — Long-Range Planning',

    '(H) Joint Rules Committee': 'Joint Rules',
    '(S) Joint Select Committee on Redistricting': 'Joint Select Committee on Redistricting',

    '(S) Select Committee on Judicial Transparency and Accountability': 'Select Committee on Judicial Transparency and Accountability',

    "(J) (S) Committee of Whole": 'Senate Committee of the Whole',
    "(J) (H) Committee of the Whole": 'House Committee of the Whole',
    "(J) (H) Joint Education": 'Joint Education',
    "(J) (S) Joint State Admin": 'Joint State Admin',
    "(J) (H) Joint Fish, Wildlife & Parks and Senate Fish & Game": 'Joint Fish, Wildlife & Parks',
    "(J) (H) Joint Appropriations and Finance & Claims": 'Joint Appropriations',
    "(J) (H) Joint Natural Resources": 'Joint Natural Resources',
}

export const COMMITTEES = [
    // HOUSE
    { name: 'House Appropriations', daysOfWeek: 'daily', time: 'varies', type: 'fiscal', },

    { name: 'House Judiciary', daysOfWeek: 'daily', time: 'morning', type: 'policy', },
    { name: 'House Business and Labor', daysOfWeek: 'daily', time: 'morning', type: 'policy', },
    { name: 'House Taxation', daysOfWeek: 'daily', time: 'morning', type: 'policy', },
    { name: 'House State Administration', daysOfWeek: 'daily', time: 'morning', type: 'policy', },
    { name: 'House Human Services', daysOfWeek: 'daily', time: 'afternoon', type: 'policy', },

    { name: 'House Natural Resources', daysOfWeek: 'M/W/F', time: 'afternoon', type: 'policy', },
    { name: 'House Transportation', daysOfWeek: 'M/W/F', time: 'afternoon', type: 'policy', },
    { name: 'House Education', daysOfWeek: 'M/W/F', time: 'afternoon', type: 'policy', },
    { name: 'House Energy, Technology and Federal Relations', daysOfWeek: 'M/W/F', time: 'afternoon', type: 'policy', },

    { name: 'House Agriculture', daysOfWeek: 'T/Th', time: 'afternoon', type: 'policy', },
    { name: 'House Fish, Wildlife and Parks', daysOfWeek: 'T/Th', time: 'afternoon', type: 'policy', },
    { name: 'House Local Government', daysOfWeek: 'T/Th', time: 'afternoon', type: 'policy', },

    { name: 'House Legislative Administration', daysOfWeek: 'on call', time: 'on call', type: 'policy', },

    { name: 'House Rules', daysOfWeek: 'on call', time: 'on call', type: 'policy', },
    { name: 'House Ethics', daysOfWeek: 'on call', time: 'on call', type: 'procedural' },


    // SENATE
    { name: 'Senate Finance and Claims', daysOfWeek: 'daily', time: 'varies', type: 'fiscal', },

    { name: 'Senate Judiciary', daysOfWeek: 'daily', time: 'morning', type: 'policy', },
    { name: 'Senate Business, Labor, and Economic Affairs', daysOfWeek: 'daily', time: 'morning', type: 'policy', },
    { name: 'Senate Taxation', daysOfWeek: 'daily', time: 'morning', type: 'policy', },

    { name: 'Senate Education and Cultural Resources', daysOfWeek: 'M/W/F', time: 'afternoon', type: 'policy', },
    { name: 'Senate Local Government', daysOfWeek: 'M/W/F', time: 'afternoon', type: 'policy', },
    { name: 'Senate Natural Resources', daysOfWeek: 'M/W/F', time: 'afternoon', type: 'policy', },
    { name: 'Senate Public Health, Welfare and Safety', daysOfWeek: 'M/W/F', time: 'afternoon', type: 'policy', },
    { name: 'Senate State Administration', daysOfWeek: 'M/W/F', time: 'afternoon', type: 'policy', },

    { name: 'Senate Agriculture, Livestock and Irrigation', daysOfWeek: 'T/Th', time: 'afternoon', type: 'policy', },
    { name: 'Senate Energy and Telecommunications', daysOfWeek: 'T/Th', time: 'afternoon', type: 'policy', },
    { name: 'Senate Fish and Game', daysOfWeek: 'T/Th', time: 'afternoon', type: 'policy', },
    { name: 'Senate Highways and Transportation', daysOfWeek: 'T/Th', time: 'afternoon', type: 'policy', },

    { name: 'Senate Committee on Committees', daysOfWeek: 'on call', time: 'on call', type: 'procedural', },
    { name: 'Senate Ethics', daysOfWeek: 'on call', time: 'on call', type: 'procedural', },
    { name: 'Senate Rules', daysOfWeek: 'on call', time: 'on call', type: 'special', },
    { name: 'Senate Legislative Administration', daysOfWeek: 'on call', time: '', type: 'special', },

    // Joint
    { name: 'Joint Rules', daysOfWeek: 'on call', time: 'on call', type: 'special', },
    { name: 'Joint Select Committee on Redistricting', daysOfWeek: 'on call', time: 'on call', type: 'select', },

    // joint approps
    { name: 'Joint Appropriations Section A — General Government', daysOfWeek: 'daily', time: 'morning', type: 'fiscal-sub', },
    { name: 'Joint Appropriations Section B — Health and Human Services', daysOfWeek: 'daily', time: 'morning', type: 'fiscal-sub', },
    { name: 'Joint Appropriations Section C — Natural Resources and Transportation', daysOfWeek: 'daily', time: 'morning', type: 'fiscal-sub', },
    { name: 'Joint Appropriations Section D — Judicial Branch, Law Enforcement, and Justice', daysOfWeek: 'daily', time: 'morning', type: 'fiscal-sub', },
    { name: 'Joint Appropriations Section E — Education', daysOfWeek: 'daily', time: 'morning', type: 'fiscal-sub', },
    { name: 'Joint Appropriations Section F — Long-Range Planning', daysOfWeek: 'daily', time: 'morning', type: 'fiscal-sub', },


    // conference committees
    { name: 'Senate Conference', daysOfWeek: 'on call', time: 'on call', type: 'conference', },
    { name: 'Senate Free Conference', daysOfWeek: 'on call', time: 'on call', type: 'conference', },
    { name: 'House Conference', daysOfWeek: 'on call', time: 'on call', type: 'conference', },
    { name: 'House Free Conference', daysOfWeek: 'on call', time: 'on call', type: 'conference', },

]

export const EXCLUDE_COMMITTEES = [
    'Senate Committee of the Whole',
    'House Committee of the Whole',
    'Joint Education',
    'Joint State Admin',
    'Joint Fish, Wildlife & Parks',
    'Joint Appropriations',
    'Joint Natural Resources',
    'Select Committee on Judicial Transparency and Accountability',
    'Joint Select Committee on Redistricting',
]

