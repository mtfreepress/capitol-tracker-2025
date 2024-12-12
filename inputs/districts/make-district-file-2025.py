
# Script for budling geographic and political data on Montana Legislative districts
# Hoping to set this up in a way that's easy to adapt heading into 2027

import math
import json
import pandas as pd

def write_json(dict, path):
    with open(path, 'w') as f:
        json.dump(dict, f, indent=4)

districts = pd.read_csv('./inputs/districts/2024-to-2033-district-geographies.csv').to_dict(orient='records')

# Election history data
# Need multiple years here because half the Senate is elected to four-year terms

statewide_general_2024 = pd.read_csv('./inputs/districts/election-results/2024-general-statewide-vote-counts.csv')
# lege_primary_2024 = 
# lege_general_2024 = 
# lege_primary_2022 =
# lege_general_2022 =

def pase_statewide_votes (df, race):
    return # TK
    
def parse_legislative_votes(df, district):
    return # TK

last_primary_elex_results = {}
last_general_elex_results = {}

'''
# Aiming for this election result form
# will need to do some logic to determine which year's primary and general elex
# to pull from for senate districts based on whether they were in cycle in 2022
        "pri_elex": {
            "leg": [
                {
                    "name": "STEVE GUNDERSON",
                    "party": "R",
                    "votes": 2121
                },
                {
                    "name": "MARVIN C SATHER",
                    "party": "D",
                    "votes": 880
                }
            ]
        },
        "gen_elex": {
            "gov": [
                {
                    "name": "Gianforte",
                    "party": "R",
                    "votes": 3568
                },
                {
                    "name": "Cooney",
                    "party": "D",
                    "votes": 1499
                },
                {
                    "name": "Bishop",
                    "party": "L",
                    "votes": 210
                }
            ],
            "leg": [
                {
                    "name": "STEVE GUNDERSON",
                    "party": "R",
                    "votes": 3721
                },
                {
                    "name": "MARVIN C SATHER",
                    "party": "D",
                    "votes": 1518
                }
            ]
        },
'''

output = []
for d in districts:

    number = int(d['district'].replace('HD ','').replace('SD ',''))
    type = d['district'][:2].lower() # "hd" or "sd"
    
    # ID overlapping districts
    if (type == 'hd'):
        related_districts = [f'SD {math.floor((number+1) / 2)}']
    elif (type == 'sd'):
        related_districts = [
            f'HD {number * 2 - 1}',
            f'HD {number * 2}'
        ]

    output.append({
        "key": "HD 1",
        "topology": {
            "type": type,
            "related": related_districts,
        },

        # "locale": "Libby", # e.g for "R-Libby" in lawmaker titles.
            #  Removing from this file because this is better conceptualzied as being attached to lawmakers than to the district
        "locale_description": d['locale'], # Brief but multi-word description of district scope
        "region": d['region'], # Broad part of the state
        "counties": d['counties'], # Counties covered by the district 

        # Do we really need these?
        "area": None,
        "pop_2010": None,
        "ai_pop_2010": None,

        "last_election": '2024' if (d['in_cycle_2024_election'] == 'yes') else '2022',
        "pri_elex": last_primary_elex_results,
        "gen_elex": last_general_elex_results,
        
        
    },)

write_json(output, './inputs/districts/districts-2025.json')