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
    '(S) Business, Labor, and Economic Affairs': 'Senate Business, Labor and Economic Affairs',
    '(S) Business, Labor and Economic Affairs': 'Senate Business, Labor and Economic Affairs',
    '(S) Taxation': 'Senate Taxation',
    '(S) Energy and Telecommunications': 'Senate Energy, Technology and Federal Relations',
    '(S) Energy, Technology & Federal Relations': 'Senate Energy, Technology and Federal Relations',
    '(S) Energy, Technology and Federal Relations': 'Senate Energy, Technology and Federal Relations',
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
    '(S) Executive Branch Review': 'Senate Executive Branch Review',

    '(H) Joint Appropriations Subcommittee on General Government': 'Joint Appropriations Section A — General Government',
    '(H) Joint Appropriations Subcommittee on Health and Human Services': 'Joint Appropriations Section B — Health and Human Services',
    '(H) Joint Appropriations Subcommittee on Health & Human Services': 'Joint Appropriations Section B — Health and Human Services',
    '(H) Joint Appropriations Subcommittee on Natural Resources and Transportation': 'Joint Appropriations Section C — Natural Resources and Transportation',
    '(H)Joint Approps Subcom on Judicial Branch, Law Enforcement, and Justice': 'Joint Appropriations Section D — Judicial Branch, Law Enforcement, and Justice',
    '(H) Joint Approps Subcom on Judicial Branch, Law Enforcement, and Justice': 'Joint Appropriations Section D — Judicial Branch, Law Enforcement, and Justice',
    '(H) Joint Appropriations Subcommittee on Education': 'Joint Appropriations Section E — Education',
    '(H) Joint Appropriations Subcommittee on Long Range Planning': 'Joint Appropriations Section F — Long-Range Planning',
    '(H) Joint Appropriations Subcommittee on Long-Range Planning': 'Joint Appropriations Section F — Long-Range Planning',
    
    // Add the missing variants with section designations
    'Joint Appropriations Subcommittee on General Government (A)': 'Joint Appropriations Section A — General Government',
    'Joint Appropriations Subcommittee on Health and Human Services (B)': 'Joint Appropriations Section B — Health and Human Services',
    'Joint Appropriations Subcommittee on Natural Resources and Transportation (C)': 'Joint Appropriations Section C — Natural Resources and Transportation',
    'Joint Appropriations Subcommittee on Education (E)': 'Joint Appropriations Section E — Education',
    'Joint Appropriations Subcommittee on Long Range Planning (F)': 'Joint Appropriations Section F — Long-Range Planning',

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

// Committees that may occur in data that we shouldn't use for pages or list on lawmaker pages
export const EXCLUDE_COMMITTEES = [
    
    // Entire chambers
    'Senate Committee of the Whole',
    'House Committee of the Whole',
    
    // Joint committees
    'Joint Education',
    'Joint State Admin',
    'Joint Fish, Wildlife & Parks',
    'Joint Appropriations',
    'Joint Natural Resources',
    
    // One-off 2023 committees
    'Select Committee on Judicial Transparency and Accountability',
    'Joint Select Committee on Redistricting',
]

