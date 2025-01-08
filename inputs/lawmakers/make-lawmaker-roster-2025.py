'''
Compiles official legislative roster (with a couple annotation columns)
into format expected by process step

{
        "name": "Kim Abbott",
        "district": "HD 83",
        "party": "D",
        "address": "523 E 6TH AVE HELENA, MT 59601-4369",
        "locale": "Helena",
        "phone": "(406) 439-8721",
        "email": "Kim.Abbott@legmt.gov",
        "sessions": [
            {
                "year": "2017",
                "url": "https://leg.mt.gov//legislator-information/roster/individual/4825",
                "chamber": "house"
            },
            {
                "year": "2019",
                "url": "https://leg.mt.gov//legislator-information/roster/individual/5142",
                "chamber": "house"
            },
            {
                "year": "2021",
                "url": "https://leg.mt.gov//legislator-information/roster/individual/6872",
                "chamber": "house"
            },
            {
                "year": "2023",
                "url": "https://leg.mt.gov//legislator-information/roster/individual/7467",
                "chamber": "house"
            }
        ],
        "committees": [
            {
                "committee": "(H) (H) Rules",
                "role": "Member"
            },
            {
                "committee": "(H) (H) Taxation",
                "role": "Member"
            },
            {
                "committee": "(H) (H) Joint Rules Committee",
                "role": "Member"
            },
            {
                "committee": "(H) (H) Human Services",
                "role": "Member"
            },
            {
                "committee": "(S) (S) Select Committee on Judicial Transparency and Accountability",
                "role": "Member"
            }
        ],
        "note": "",
        "image_path": "portraits/2023/Kim-Abbott.png",
        "source": "https://leg.mt.gov/legislator-information/roster/individual/7467"
    },
'''


import json
import pandas as pd

def read_json(path):
    with open(path, 'r') as f:
        data = json.load(f)
    return data

def write_json(dict, path):
    with open(path, 'w') as f:
        json.dump(dict, f, indent=4)

lawmakers = pd.read_csv('./inputs/lawmakers/official-roster-2025.csv')
annotations = pd.read_csv('./inputs/lawmakers/roster-annotations.csv')
committee_assignments = pd.read_csv('./inputs/lawmakers/committee-assignments-2025.csv')
session_history = read_json('./inputs/lawmakers/legislator-session-history.json')

lawmakers['name'] = lawmakers['First Name'] + ' ' + lawmakers['Last Name']
lawmakers = lawmakers.merge(annotations, left_on='name', right_on='roster_name', how='left')

lawmakers['name'] = lawmakers['custom_name'].where(lawmakers['custom_name'].notnull(), lawmakers['First Name'] + ' ' + lawmakers['Last Name']) 
lawmakers['first_name'] = lawmakers['First Name']
lawmakers['last_name'] = lawmakers['Last Name']
lawmakers['district'] = lawmakers['District'].str.replace('House District','HD').str.replace('Senate District','SD')
lawmakers['party'] = lawmakers['Party'].str[:1]
# lawmakers[''] = lawmakers.apply(lambda row: row['custom_locale'] if row['custom_locale'] else row['city'], axis=1)
lawmakers['locale'] = lawmakers['custom_locale'].where(lawmakers['custom_locale'].notnull(), lawmakers['City'])
lawmakers['phone'] = lawmakers['Telephone'].where(lawmakers['Telephone'].notnull(), '')
lawmakers['address'] = 'TK'
lawmakers['email'] = lawmakers['Email']
lawmakers['image_path'] = 'TK' # May not be necessary depending on how we implement portraits




lawmakers = lawmakers[['name','first_name', 'last_name','district','party','locale','phone','email']].to_dict(orient='records')

for lawmaker in lawmakers:
    committee_key = (lawmaker['last_name'] + ', ' + lawmaker['first_name'])
    lawmaker_committees = committee_assignments[committee_assignments['lawmaker'] == committee_key]
    
    lawmaker['sessions'] = next(filter(lambda l: l['name'] == lawmaker['name'], session_history), [])
    lawmaker['committees'] = lawmaker_committees[['committee','role']].to_dict(orient='records')
    lawmaker['note'] = '' # Possible TODO depending on how we do annotations
    lawmaker['source'] = None # May be able to update with link to official roster page

write_json(lawmakers, './inputs/lawmakers/legislator-roster-2025.json')