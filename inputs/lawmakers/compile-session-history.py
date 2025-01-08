# Messy utility script for updating legislator service histories
# These used to be available on the old legislative website but aren't currently on the new one
# So we need to roll our own

import json
import pandas as pd

def read_json(path):
    with open(path, 'r') as f:
        data = json.load(f)
    return data

def write_json(dict, path):
    with open(path, 'w') as f:
        json.dump(dict, f, indent=4)

past = read_json('./inputs/lawmakers/legislator-roster-2023.json')
session_2025 = read_json('./inputs/lawmakers/legislator-roster-2025.json')

NAME_CHANGES = {
    'Julie Darling': 'Julie Dooling',
    'Bruce "Butch" Gillespie': 'Bruce Gillespie',
    'Christopher Pope': 'Chris Pope',
    'Ken Walsh': 'Kenneth Walsh',
}
MANUAL_MATCHES = {
    # For returning lawmakers who weren't in the prior sesson
    'Wylie Galt': [
        {"year": "2013", "chamber": "house" },
        {"year": "2017", "chamber": "house" },
        {"year": "2019", "chamber": "house" },
        {"year": "2021", "chamber": "house" },
    ],
    'Sara Novak': [
        {"year": "2021", "chamber": "house" },
    ],
    'Debo Powers': [
        {"year": "2019", "chamber": "house" },
    ],
    'Vince Ricci': [
        {"year": "2015", "chamber": "house" },
        {"year": "2017", "chamber": "house" },
        {"year": "2019", "chamber": "house" },
        {"year": "2021", "chamber": "house" },
    ],
}

def clean_name (raw):
    if raw in NAME_CHANGES.keys():
        return NAME_CHANGES[raw]
    return raw



output = []
for lawmaker in session_2025:
    name = clean_name(lawmaker['name'])
    past_match = next(filter(lambda l: l['name'] == name, past), None)
    
    if not past_match and name in MANUAL_MATCHES.keys():
        past_match = {'sessions': MANUAL_MATCHES[name]}
    
    if not past_match:
        print(lawmaker['name'])

    sessions = []
    if past_match:
        for s in past_match['sessions']:
            sessions.append({
                'year': s['year'],
                'chamber': s['chamber']
            })
    # everyone here is part of 2025
    sessions.append({
        'year': '2025',
        'chamber': 'house' if (lawmaker['district'][:2] == 'HD') else 'senate'
    })
    
    output.append({
        'name': lawmaker['name'],
        'sessions': sessions,
    })

write_json(output, './inputs/lawmakers/legislator-session-history.json')