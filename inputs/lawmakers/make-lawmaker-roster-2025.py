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
from pathlib import Path

# absolute path of the script's directory
script_dir = Path(__file__).resolve().parent

# Helper functions
def read_json(path):
    with open(path, 'r') as f:
        data = json.load(f)
    return data

def write_json(dict_data, path):
    with open(path, 'w') as f:
        json.dump(dict_data, f, indent=4)

# now defined relative to the python script rather than where it is executed
lawmakers_path = script_dir / 'official-roster-2025.csv'
annotations_path = script_dir / 'roster-annotations.csv'
committee_assignments_path = script_dir / 'committee-assignments-2025.csv'
session_history_path = script_dir / 'legislator-session-history.json'
output_path = script_dir / 'legislator-roster-2025.json'

lawmakers = pd.read_csv(lawmakers_path)
annotations = pd.read_csv(annotations_path)
committee_assignments = pd.read_csv(committee_assignments_path)
session_history = read_json(session_history_path)

lawmakers['name'] = lawmakers['First Name'] + ' ' + lawmakers['Last Name']
lawmakers = lawmakers.merge(annotations, left_on='name', right_on='roster_name', how='left')

lawmakers['slug'] = lawmakers['custom_key'].where(
    lawmakers['custom_key'].notnull(),
    lawmakers['First Name'].str.lower() + '-' + lawmakers['Last Name'].str.lower()
)
lawmakers['name'] = lawmakers['custom_name'].where(
    lawmakers['custom_name'].notnull(),
    lawmakers['First Name'] + ' ' + lawmakers['Last Name']
)
lawmakers['first_name'] = lawmakers['First Name']
lawmakers['last_name'] = lawmakers['Last Name']
lawmakers['district'] = lawmakers['District'].str.replace('House District', 'HD').str.replace('Senate District', 'SD')
lawmakers['party'] = lawmakers['Party'].str[:1]
lawmakers['locale'] = lawmakers['custom_locale'].where(
    lawmakers['custom_locale'].notnull(),
    lawmakers['City']
)
lawmakers['phone'] = lawmakers['Telephone'].where(lawmakers['Telephone'].notnull(), '')
lawmakers['address'] = 'TK'
lawmakers['email'] = lawmakers['Email']
lawmakers['image_path'] = 'TK'

lawmakers = lawmakers[['name', 'first_name', 'last_name', 'district', 'party', 'locale', 'phone', 'email']].to_dict(orient='records')

for lawmaker in lawmakers:
    committee_key = (lawmaker['last_name'] + ', ' + lawmaker['first_name'])
    lawmaker_committees = committee_assignments[committee_assignments['lawmaker'] == committee_key]
    
    lawmaker['sessions'] = next(
        filter(lambda l: l['name'] == lawmaker['name'], session_history),
        {'sessions': []}
    )['sessions']
    lawmaker['committees'] = lawmaker_committees[['committee', 'role']].to_dict(orient='records')
    lawmaker['note'] = ''  # Possible TODO depending on how we do annotations
    lawmaker['source'] = None  # May be able to update with link to official roster page
    # Set relative image path
    lawmaker['image_path'] = f"portraits/2025/{lawmaker['first_name'].lower().replace(' ', '-')}-{lawmaker['last_name'].lower().replace(' ', '-')}.jpg"


# Write output
write_json(lawmakers, output_path)

