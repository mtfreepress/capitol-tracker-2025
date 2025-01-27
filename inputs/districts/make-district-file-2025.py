
# Script for budling geographic and political data on Montana Legislative districts
# Hoping to set this up in a way that's easy to adapt heading into 2027




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

import math
import json
import pandas as pd

def write_json(dict, path):
    with open(path, 'w') as f:
        json.dump(dict, f, indent=4)

def hd_to_sd(key):
    # Each SD is two HD
    hd_number = int(key[3:])
    sd_number = math.ceil(hd_number / 2)
    return f'SD {sd_number}'

districts = pd.read_csv('./inputs/districts/2024-to-2033-district-geographies.csv').to_dict(orient='records')

# Election history data
# Need multiple years here because half the Senate is elected to four-year terms

statewide_general_by_precinct_2024 = pd.read_csv('./inputs/districts/election-results/2024-general-statewide-precinct-vote-counts.csv')
lege_primary_2024 = pd.read_csv('./inputs/districts/election-results/2024-primary-legislative-vote-counts.csv')
lege_general_2024 = pd.read_csv('./inputs/districts/election-results/2024-general-legislative-vote-counts.csv')
lege_primary_2022 = pd.read_csv('./inputs/districts/election-results/2022-primary-legislative-vote-counts.csv')
lege_general_2022 = pd.read_csv('./inputs/districts/election-results/2022-general-legislative-vote-counts.csv')

def apportion_precinct_results_to_legislative_districts(precinct_results):
    # Create data tables that map specific precincts to their corresponding legislative districts
    # vote_fraction field accomodates the handful of rural precincts that don't align neatly with legislative districts
    # We assume votes in statewide races are allocated there proportionaly to state house races
    # vote_fraction is 1.0 for the vast majority of precints, which map to a single district

    lege_votes_by_precinct = precinct_results[precinct_results['race'].str[:2] == 'HD'].copy()
    lege_votes_by_precinct['hd'] = lege_votes_by_precinct['race']
    lege_votes_by_precinct['sd'] = lege_votes_by_precinct['race'].apply(hd_to_sd) 

    precinct_total_votes = lege_votes_by_precinct.groupby('key').agg({'votes': 'sum'}).to_dict()['votes']

    hd_precinct_key = lege_votes_by_precinct.groupby([
        'key','county','precinct','hd'
    ]).agg({'votes': 'sum'}).reset_index()
    hd_precinct_key['vote_fraction'] = hd_precinct_key.apply(lambda row: row['votes'] / (precinct_total_votes[row['key']] or 1), axis=1)

    sd_precinct_key = lege_votes_by_precinct.groupby([
        'key','county','precinct','sd'
    ]).agg({'votes': 'sum'}).reset_index()
    sd_precinct_key['vote_fraction'] = sd_precinct_key.apply(lambda row: row['votes'] / (precinct_total_votes[row['key']] or 1), axis=1)

    # # Precincts where the vote fraction matters
    # print(hd_precinct_key[hd_precinct_key['vote_fraction'] != 1])
    # print(sd_precinct_key[sd_precinct_key['vote_fraction'] != 1])

    precinct_results_by_hd = precinct_results.merge(hd_precinct_key[['key','hd','vote_fraction']], on='key', how='left')
    precinct_results_by_sd = precinct_results.merge(sd_precinct_key[['key','sd','vote_fraction']], on='key', how='left')

    return precinct_results_by_hd, precinct_results_by_sd

precinct_results_by_hd, precinct_results_by_sd = apportion_precinct_results_to_legislative_districts(statewide_general_by_precinct_2024)

def parse_statewide_votes (precinctResults, district, raceLabel):
    #Filter precinct-level results to just results for a given legislative district
    # raceLabel is either 'president' or 'governor'
    districtType = district[:2].lower()
    raceResultsByPrecinct = precinctResults[
        (precinctResults['race'] == raceLabel)
        & (precinctResults[districtType] == district)
    ].copy()
    raceResultsByPrecinct['votes_in_district'] = raceResultsByPrecinct['votes'] * raceResultsByPrecinct['vote_fraction']
    race_votes = raceResultsByPrecinct.groupby(['party', 'candidate']).agg({'votes_in_district': 'sum'}).reset_index()
    race_votes.rename({'votes_in_district': 'votes'}, axis=1, inplace=True)
    # race_votes['race'] = district
    race_votes['party'] = race_votes['party'].str[:1]
    race_votes['votes'] =  race_votes['votes'].round().astype(int)
    total_votes = race_votes['votes'].sum()
    race_votes['percent'] = race_votes['votes'] / total_votes
    race_votes.rename(columns={'candidate': 'name'}, inplace=True)
    race_votes.sort_values('votes', ascending=False, inplace=True)
    return race_votes.to_dict(orient='records')
    
def parse_legislative_votes(results, district):
    districtKey = district.replace(' ','-')
    race_votes = results[results['district'] == districtKey][['party','candidate','votes']]
    race_votes.rename(columns={'candidate': 'name'}, inplace=True)
    race_votes['party'] = race_votes['party'].str[:1]
    total_votes = race_votes['votes'].sum()
    race_votes['percent'] = race_votes['votes'] / total_votes
    race_votes.sort_values('votes', ascending=False, inplace=True)
    return race_votes.to_dict(orient='records')



output = []
for d in districts:

    districtKey = d['district']
    
    

    number = int(districtKey.replace('HD ','').replace('SD ',''))
    type = districtKey[:2].lower() # "hd" or "sd"
    in_cycle_2024 = (d['in_cycle_2024_election'] == 'yes')

    apportioned_precinct_results = precinct_results_by_hd if (type == 'hd') else precinct_results_by_sd
    
    # ID overlapping districts
    if (type == 'hd'):
        related_districts = [f'SD {math.floor((number+1) / 2)}']
    elif (type == 'sd'):
        related_districts = [
            f'HD {number * 2 - 1}',
            f'HD {number * 2}'
        ]

    last_primary_elex_results = {
        'leg': parse_legislative_votes(lege_primary_2024, districtKey) if in_cycle_2024 \
            else  parse_legislative_votes(lege_primary_2022, districtKey)
    }
    last_general_elex_results = {
        'pres': parse_statewide_votes(apportioned_precinct_results, districtKey, 'president'),
        'gov': parse_statewide_votes(apportioned_precinct_results, districtKey, 'governor'),
        'leg': parse_legislative_votes(lege_general_2024, districtKey) if in_cycle_2024 \
            else  parse_legislative_votes(lege_general_2022, districtKey),
    }

    if (districtKey == 'SD 4'): print(parse_legislative_votes(lege_general_2022, districtKey))

    output.append({
        "key": districtKey,
        "topology": {
            "type": type,
            "related": related_districts,
        },

        # "locale": "Libby", # e.g for "R-Libby" in lawmaker titles.
        # Removing from this file because this is better conceptualzied as being attached to lawmakers than to the district
        # Suggested replacement logic: Pull from legislator-roster-YYYY, "custom_locale" field if present, "City" field if not
        # The city field is the right way to locate most lawmakers, but some have strong preferences for
        # labels that don't match their roster addressses that we've honored in the past
        # For example, Barry Usher should be R-Laurel, but puts his Billings motorcycle dealership address
        # on the legislative roster
        "locale_description": d['locale'], # Brief but multi-word description of district scope
        "region": d['region'], # Broad part of the state
        "counties": d['counties'], # Counties covered by the district 

        # Do we really need these?
        "area": None,
        "pop_2010": None,
        "ai_pop_2010": None,

        "last_election": '2024' if (in_cycle_2024 == 'yes') else '2022',
        "pri_elex": last_primary_elex_results,
        "gen_elex": last_general_elex_results,
        
        
    },)

write_json(output, './inputs/districts/districts-2025.json')