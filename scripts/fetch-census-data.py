#!/usr/bin/env python3
"""
Fetch real Census ACS data and generate puzzles.json.
Uses the Census Bureau API: https://www.census.gov/data/developers/data-sets/acs-1year.html

Tables used:
- B04006: People Reporting Ancestry (state-level)
- B16001: Language Spoken at Home (state-level)
- DP05 / S0101: Demographic profiles for cities (place-level)

Usage: python3 scripts/fetch-census-data.py
"""

import json
import urllib.request
import sys
import time

YEAR = "2022"
BASE = f"https://api.census.gov/data/{YEAR}/acs/acs5"

# FIPS -> state code mapping
FIPS_TO_STATE = {
    "01": "AL", "02": "AK", "04": "AZ", "05": "AR", "06": "CA",
    "08": "CO", "09": "CT", "10": "DE", "11": "DC", "12": "FL",
    "13": "GA", "15": "HI", "16": "ID", "17": "IL", "18": "IN",
    "19": "IA", "20": "KS", "21": "KY", "22": "LA", "23": "ME",
    "24": "MD", "25": "MA", "26": "MI", "27": "MN", "28": "MS",
    "29": "MO", "30": "MT", "31": "NE", "32": "NV", "33": "NH",
    "34": "NJ", "35": "NM", "36": "NY", "37": "NC", "38": "ND",
    "39": "OH", "40": "OK", "41": "OR", "42": "PA", "44": "RI",
    "45": "SC", "46": "SD", "47": "TN", "48": "TX", "49": "UT",
    "50": "VT", "51": "VA", "53": "WA", "54": "WV", "55": "WI",
    "56": "WY",
}

# Ancestry puzzles: variable code -> (answer name, acceptable, related, hints)
ANCESTRY_PUZZLES = [
    {
        "var": "B04006_042E",  # German
        "answer": "German",
        "acceptable": ["German", "Germans"],
        "related": ["Austrian", "Swiss", "Pennsylvanian German", "German Russian"],
        "hints": [
            "Strongest in the upper Midwest",
            "The most commonly reported ancestry in the US (~45M)",
            "Major immigration wave in the mid-1800s",
            "Top states include Wisconsin and North Dakota",
            "Starts with G"
        ]
    },
    {
        "var": "B04006_049E",  # Irish
        "answer": "Irish",
        "acceptable": ["Irish"],
        "related": ["Scotch-Irish", "Scottish", "British", "English"],
        "hints": [
            "Strongest in the Northeast",
            "About 32 million Americans claim this ancestry",
            "Potato Famine drove massive immigration in the 1840s-50s",
            "Top state: Massachusetts",
            "Starts with I"
        ]
    },
    {
        "var": "B04006_051E",  # Italian
        "answer": "Italian",
        "acceptable": ["Italian", "Italians"],
        "related": ["Sicilian", "Maltese"],
        "hints": [
            "Strongest in the Mid-Atlantic and New England",
            "About 17 million Americans claim this ancestry",
            "Major immigration wave 1880s-1920s through Ellis Island",
            "Top states: Connecticut and Rhode Island",
            "Starts with I"
        ]
    },
    {
        "var": "B04006_036E",  # English
        "answer": "English",
        "acceptable": ["English", "British"],
        "related": ["Welsh", "Scottish", "Scotch-Irish"],
        "hints": [
            "Strongest in Utah and New England",
            "About 24 million Americans claim this ancestry",
            "The earliest European colonial settlers",
            "Top state: Utah",
            "Starts with E"
        ]
    },
    {
        "var": "B04006_059E",  # Norwegian
        "answer": "Norwegian",
        "acceptable": ["Norwegian", "Norwegians"],
        "related": ["Swedish", "Danish", "Scandinavian", "Finnish", "Icelander"],
        "hints": [
            "Concentrated heavily in the northern Great Plains",
            "About 4.5 million Americans claim this ancestry",
            "Immigration peaked in the 1880s, drawn by farmland",
            "Top state: North Dakota",
            "Starts with N"
        ]
    },
    {
        "var": "B04006_061E",  # Polish
        "answer": "Polish",
        "acceptable": ["Polish"],
        "related": ["Czech", "Slovak", "Slavic", "Lithuanian"],
        "hints": [
            "Strongest in the Great Lakes and Northeast",
            "About 9 million Americans claim this ancestry",
            "Major immigration wave 1880s-1920s, many to industrial cities",
            "Top states: Wisconsin and Michigan",
            "Starts with P"
        ]
    },
    {
        "var": "B04006_089E",  # Swedish
        "answer": "Swedish",
        "acceptable": ["Swedish", "Swedes"],
        "related": ["Norwegian", "Danish", "Finnish", "Scandinavian"],
        "hints": [
            "Strongest in the upper Midwest, especially one state",
            "About 4 million Americans claim this ancestry",
            "Major immigration 1850s-1910s, drawn by farmland and industry",
            "Top state: Minnesota",
            "Starts with S"
        ]
    },
    {
        "var": "B04006_067E",  # Scottish
        "answer": "Scottish",
        "acceptable": ["Scottish", "Scots"],
        "related": ["Scotch-Irish", "English", "British", "Irish", "Welsh"],
        "hints": [
            "Spread across Appalachia, the mountain West, and New England",
            "About 5.5 million Americans claim this ancestry",
            "Early settlers in the colonial era, especially in the highlands",
            "Top state: Utah",
            "Starts with S"
        ]
    },
    {
        "var": "B04006_040E",  # French
        "answer": "French",
        "acceptable": ["French"],
        "related": ["French Canadian", "Cajun", "Belgian", "Swiss"],
        "hints": [
            "Two hotspots: New England and a southern state",
            "About 8 million Americans claim this ancestry",
            "Early fur traders and settlers in the Mississippi Valley",
            "Top states: Louisiana and Maine",
            "Starts with F"
        ]
    },
    {
        "var": "B04006_034E",  # Dutch
        "answer": "Dutch",
        "acceptable": ["Dutch"],
        "related": ["Belgian", "German", "Luxemburger"],
        "hints": [
            "Strongest in Michigan and Iowa",
            "About 4 million Americans claim this ancestry",
            "Early settlers in New Amsterdam (now New York) in the 1600s",
            "Top state: Michigan",
            "Starts with D"
        ]
    },
    {
        "var": "B04006_044E",  # Greek
        "answer": "Greek",
        "acceptable": ["Greek", "Greeks"],
        "related": ["Cypriot", "Albanian", "Turkish"],
        "hints": [
            "Concentrated in the Northeast, especially New England",
            "About 1.3 million Americans claim this ancestry",
            "Immigration peaked early 1900s, often to cities",
            "Top state: New Hampshire",
            "Starts with G"
        ]
    },
    {
        "var": "B04006_005E",  # American
        "answer": "American",
        "acceptable": ["American"],
        "related": [],
        "hints": [
            "Strongest in Appalachia and the Upper South",
            "About 20 million people use this as their only ancestry",
            "People who identify with the country itself rather than a foreign origin",
            "Top state: West Virginia",
            "Starts with A"
        ]
    },
    {
        "var": "B04006_064E",  # Russian
        "answer": "Russian",
        "acceptable": ["Russian", "Russians"],
        "related": ["Ukrainian", "Soviet Union", "Carpatho Rusyn"],
        "hints": [
            "Concentrated in the Northeast and Pacific coast",
            "About 3 million Americans claim this ancestry",
            "Immigration waves in late 1800s and after Soviet collapse",
            "Top states: New York and New Jersey",
            "Starts with R"
        ]
    },
    {
        "var": "B04006_046E",  # Hungarian
        "answer": "Hungarian",
        "acceptable": ["Hungarian", "Hungarians"],
        "related": ["Romanian", "Slovak", "Czech"],
        "hints": [
            "Concentrated in the industrial Northeast and Midwest",
            "About 1.4 million Americans claim this ancestry",
            "Immigration peaked in the early 1900s for factory work",
            "Top states: Ohio and New Jersey",
            "Starts with H"
        ]
    },
    {
        "var": "B04006_092E",  # Ukrainian
        "answer": "Ukrainian",
        "acceptable": ["Ukrainian", "Ukrainians"],
        "related": ["Russian", "Polish", "Soviet Union"],
        "hints": [
            "Concentrated in the Northeast, especially Pennsylvania and New York",
            "About 1 million Americans claim this ancestry",
            "Multiple immigration waves, including post-WWII and post-2022",
            "Top states: Pennsylvania and New York",
            "Starts with U"
        ]
    },
]

# Language puzzles: variable code -> (answer name, acceptable, related, hints)
LANGUAGE_PUZZLES = [
    {
        "var": "B16001_003E",  # Spanish
        "answer": "Spanish",
        "acceptable": ["Spanish"],
        "related": ["Portuguese"],
        "hints": [
            "Strongest in the Southwest and Florida",
            "Over 41 million speakers in the US",
            "The most spoken non-English language by far",
            "Top states: Texas and California",
            "Starts with S"
        ]
    },
    {
        "var": "B16001_075E",  # Chinese
        "answer": "Chinese",
        "acceptable": ["Chinese", "Mandarin", "Cantonese"],
        "related": ["Taiwanese", "Korean", "Japanese", "Vietnamese"],
        "hints": [
            "Concentrated on the coasts, especially the West",
            "About 3.5 million speakers in the US",
            "Third most spoken language in the US",
            "Top states: California and New York",
            "Starts with C"
        ]
    },
    {
        "var": "B16001_087E",  # Vietnamese
        "answer": "Vietnamese",
        "acceptable": ["Vietnamese"],
        "related": ["Laotian", "Thai", "Khmer", "Chinese"],
        "hints": [
            "Concentrated in California and Texas",
            "About 1.5 million speakers in the US",
            "Refugee wave after a war ending in 1975",
            "Top state: California",
            "Starts with V"
        ]
    },
    {
        "var": "B16001_099E",  # Tagalog
        "answer": "Tagalog",
        "acceptable": ["Tagalog", "Filipino"],
        "related": ["Indonesian", "Malaysian"],
        "hints": [
            "Concentrated in Hawaii and California",
            "About 1.7 million speakers in the US",
            "Fourth most spoken non-English language",
            "Top states: California and Hawaii",
            "Starts with T"
        ]
    },
    {
        "var": "B16001_081E",  # Korean
        "answer": "Korean",
        "acceptable": ["Korean"],
        "related": ["Japanese", "Chinese"],
        "hints": [
            "Concentrated in California, Hawaii, and the NY/NJ metro",
            "About 1.1 million speakers in the US",
            "Immigration increased after the Korean War (1950-53)",
            "Top state: California",
            "Starts with K"
        ]
    },
    {
        "var": "B16001_105E",  # Arabic
        "answer": "Arabic",
        "acceptable": ["Arabic"],
        "related": ["Persian", "Hebrew", "Turkish", "Urdu"],
        "hints": [
            "One state in the Great Lakes dominates by far",
            "About 1.2 million speakers in the US",
            "Major community centered around Dearborn, Michigan",
            "Top state: Michigan",
            "Starts with A"
        ]
    },
    {
        "var": "B16001_006E",  # French
        "answer": "French",
        "acceptable": ["French"],
        "related": ["Haitian Creole", "Portuguese", "Italian", "Spanish"],
        "hints": [
            "Two distinct hotspots: New England and the Deep South",
            "About 1.2 million speakers in the US (excluding Creole)",
            "Cajun/Acadian heritage in one region, Canadian influence in another",
            "Top state: Louisiana",
            "Starts with F"
        ]
    },
    {
        "var": "B16001_027E",  # Russian
        "answer": "Russian",
        "acceptable": ["Russian"],
        "related": ["Ukrainian", "Polish", "Serbo-Croatian"],
        "hints": [
            "Concentrated in New York/New Jersey metro and Pacific Northwest",
            "About 900,000 speakers in the US",
            "Refugee and immigrant communities from the Soviet era and after",
            "Top state: New York",
            "Starts with R"
        ]
    },
    {
        "var": "B16001_018E",  # German (language)
        "answer": "German",
        "acceptable": ["German"],
        "related": ["Yiddish", "Dutch", "Polish"],
        "hints": [
            "Mirrors the German ancestry belt in the northern Great Plains",
            "About 900,000 speakers in the US",
            "Includes Amish/Mennonite communities, especially in PA",
            "Top state: North Dakota",
            "Starts with G"
        ]
    },
    {
        "var": "B16001_084E",  # Hmong
        "answer": "Hmong",
        "acceptable": ["Hmong"],
        "related": ["Vietnamese", "Laotian", "Thai"],
        "hints": [
            "Concentrated in Minnesota, Wisconsin, and California",
            "About 300,000 speakers in the US",
            "Refugee community from the Secret War in Laos (1960s-70s)",
            "Top state: Minnesota or California",
            "Starts with H"
        ]
    },
]

# City finder puzzles (demographics from DP05 profile)
# We'll hardcode city FIPS and fetch real demographics
CITY_PUZZLES = [
    {
        "answer": "Boise, ID",
        "lat": 43.615, "lng": -116.2023,
        "state_fips": "16", "place_fips": "08830",
        "hints": ["Located in the Mountain West", "State capital", "About 340 miles from Salt Lake City", "Starts with B", "County: Ada County"]
    },
    {
        "answer": "Miami, FL",
        "lat": 25.7617, "lng": -80.1918,
        "state_fips": "12", "place_fips": "45000",
        "hints": ["Located in the Southeast", "Coastal city in a peninsula state", "About 1,280 miles from New York City", "Starts with M", "County: Miami-Dade County"]
    },
    {
        "answer": "Minneapolis, MN",
        "lat": 44.9778, "lng": -93.265,
        "state_fips": "27", "place_fips": "43000",
        "hints": ["Located in the upper Midwest", "Part of a famous 'Twin Cities' metro", "About 405 miles from Chicago", "Starts with M", "County: Hennepin County"]
    },
    {
        "answer": "Portland, OR",
        "lat": 45.5152, "lng": -122.6784,
        "state_fips": "41", "place_fips": "59000",
        "hints": ["Located in the Pacific Northwest", "Known for rainy weather and strong coffee culture", "About 175 miles from Seattle", "Starts with P", "County: Multnomah County"]
    },
    {
        "answer": "Nashville, TN",
        "lat": 36.1627, "lng": -86.7816,
        "state_fips": "47", "place_fips": "52006",
        "hints": ["Located in the upper South", "Famous for a genre of American music", "About 250 miles from Atlanta", "Starts with N", "County: Davidson County"]
    },
    {
        "answer": "Denver, CO",
        "lat": 39.7392, "lng": -104.9903,
        "state_fips": "08", "place_fips": "20000",
        "hints": ["Located in the Mountain West", "Nicknamed 'The Mile High City'", "About 600 miles from Phoenix", "Starts with D", "County: Denver County"]
    },
    {
        "answer": "Honolulu, HI",
        "lat": 21.3069, "lng": -157.8583,
        "state_fips": "15", "place_fips": "17000",
        "hints": ["Not on the US mainland", "State capital on an island", "About 2,400 miles from Los Angeles", "Starts with H", "County: Honolulu County"]
    },
    {
        "answer": "El Paso, TX",
        "lat": 31.7619, "lng": -106.485,
        "state_fips": "48", "place_fips": "24000",
        "hints": ["Located in the far Southwest on an international border", "Sister city to Ciudad Juarez across the Rio Grande", "About 570 miles from Houston", "Starts with E", "County: El Paso County"]
    },
    {
        "answer": "Anchorage, AK",
        "lat": 61.2181, "lng": -149.9003,
        "state_fips": "02", "place_fips": "03000",
        "hints": ["The most northern major city in the US", "Largest city in its state by far", "About 2,450 miles from Seattle", "Starts with A", "Municipality: Anchorage Borough"]
    },
    {
        "answer": "Pittsburgh, PA",
        "lat": 40.4406, "lng": -79.9959,
        "state_fips": "42", "place_fips": "61000",
        "hints": ["Located at the confluence of three rivers", "Former steel capital, now a tech/healthcare hub", "About 300 miles from New York City", "Starts with P", "County: Allegheny County"]
    },
    {
        "answer": "Salt Lake City, UT",
        "lat": 40.7608, "lng": -111.891,
        "state_fips": "49", "place_fips": "67000",
        "hints": ["Located in the Mountain West near a large lake", "Founded by religious pioneers in 1847", "About 520 miles from Denver", "Starts with S", "County: Salt Lake County"]
    },
    {
        "answer": "New Orleans, LA",
        "lat": 29.9511, "lng": -90.0715,
        "state_fips": "22", "place_fips": "55000",
        "hints": ["Located in the Gulf South near the Mississippi River delta", "Famous for jazz, Mardi Gras, and unique cuisine", "About 350 miles from Houston", "Starts with N", "Parish: Orleans Parish"]
    },
    {
        "answer": "Las Vegas, NV",
        "lat": 36.1699, "lng": -115.1398,
        "state_fips": "32", "place_fips": "40000",
        "hints": ["Located in the desert West", "Famous for its entertainment boulevard", "About 270 miles from Los Angeles", "Starts with L", "County: Clark County"]
    },
    {
        "answer": "Columbus, OH",
        "lat": 39.9612, "lng": -82.9988,
        "state_fips": "39", "place_fips": "18000",
        "hints": ["Located in the Midwest", "State capital with a large university", "About 320 miles from Chicago", "Starts with C", "County: Franklin County"]
    },
    {
        "answer": "Detroit, MI",
        "lat": 42.3314, "lng": -83.0458,
        "state_fips": "26", "place_fips": "22000",
        "hints": ["Located in the Great Lakes region", "Historically known as the Motor City", "About 280 miles from Chicago", "Starts with D", "County: Wayne County"]
    },
    {
        "answer": "Charlotte, NC",
        "lat": 35.2271, "lng": -80.8431,
        "state_fips": "37", "place_fips": "12000",
        "hints": ["Located in the Southeast", "Major US banking center", "About 245 miles from Atlanta", "Starts with C", "County: Mecklenburg County"]
    },
    {
        "answer": "Austin, TX",
        "lat": 30.2672, "lng": -97.7431,
        "state_fips": "48", "place_fips": "05000",
        "hints": ["Located in the South Central US", "State capital, known for tech and music", "About 195 miles from Houston", "Starts with A", "County: Travis County"]
    },
    {
        "answer": "San Antonio, TX",
        "lat": 29.4241, "lng": -98.4936,
        "state_fips": "48", "place_fips": "65000",
        "hints": ["Located in the South Central US", "Home to a famous 18th-century mission/fortress", "About 275 miles from Houston", "Starts with S", "County: Bexar County"]
    },
    {
        "answer": "Tucson, AZ",
        "lat": 32.2226, "lng": -110.9747,
        "state_fips": "04", "place_fips": "77000",
        "hints": ["Located in the desert Southwest", "Second-largest city in its state", "About 115 miles from Phoenix", "Starts with T", "County: Pima County"]
    },
    {
        "answer": "Louisville, KY",
        "lat": 38.2527, "lng": -85.7585,
        "state_fips": "21", "place_fips": "48006",
        "hints": ["Located on the Ohio River in the upper South", "Famous for a horse race held first Saturday in May", "About 270 miles from Nashville", "Starts with L", "County: Jefferson County"]
    },
    {
        "answer": "Raleigh, NC",
        "lat": 35.7796, "lng": -78.6382,
        "state_fips": "37", "place_fips": "55000",
        "hints": ["Located in the Southeast's Research Triangle region", "State capital with booming tech sector", "About 150 miles from Charlotte", "Starts with R", "County: Wake County"]
    },
    {
        "answer": "Fresno, CA",
        "lat": 36.7378, "lng": -119.7871,
        "state_fips": "06", "place_fips": "27000",
        "hints": ["Located in the agricultural Central Valley", "Center of a major farming region", "About 190 miles from San Francisco", "Starts with F", "County: Fresno County"]
    },
    {
        "answer": "Omaha, NE",
        "lat": 41.2565, "lng": -95.9345,
        "state_fips": "31", "place_fips": "37000",
        "hints": ["Located in the Great Plains on a major river", "Home to several Fortune 500 companies", "About 460 miles from Denver", "Starts with O", "County: Douglas County"]
    },
    {
        "answer": "Albuquerque, NM",
        "lat": 35.0844, "lng": -106.6504,
        "state_fips": "35", "place_fips": "02000",
        "hints": ["Located in the Southwest along the Rio Grande", "Largest city in a state known for adobe architecture", "About 450 miles from Phoenix", "Starts with A", "County: Bernalillo County"]
    },
    {
        "answer": "Oklahoma City, OK",
        "lat": 35.4676, "lng": -97.5164,
        "state_fips": "40", "place_fips": "55000",
        "hints": ["Located in the Southern Great Plains", "State capital in Tornado Alley", "About 200 miles from Dallas", "Starts with O", "County: Oklahoma County"]
    },
]


def fetch_json(url, retries=3):
    """Fetch JSON from a URL with retry logic."""
    for attempt in range(retries):
        try:
            time.sleep(0.5)  # rate-limit ourselves
            req = urllib.request.Request(url)
            with urllib.request.urlopen(req, timeout=30) as resp:
                return json.loads(resp.read().decode())
        except urllib.error.HTTPError as e:
            if e.code == 503 and attempt < retries - 1:
                wait = 3 * (attempt + 1)
                print(f"  503 error, retrying in {wait}s...", file=sys.stderr)
                time.sleep(wait)
            else:
                raise


def fetch_ancestry_state_data(var_code):
    """Fetch a single ancestry variable for all states, return {state_code: fraction}."""
    url = f"{BASE}?get=NAME,B04006_001E,{var_code}&for=state:*"
    print(f"  Fetching {url}", file=sys.stderr)
    data = fetch_json(url)
    header = data[0]
    total_idx = header.index("B04006_001E")
    var_idx = header.index(var_code)
    fips_idx = header.index("state")

    result = {}
    for row in data[1:]:
        fips = row[fips_idx]
        state = FIPS_TO_STATE.get(fips)
        if not state:
            continue
        total = safe_int(row[total_idx])
        value = safe_int(row[var_idx])
        if total > 0:
            result[state] = round(value / total, 4)
        else:
            result[state] = 0.0
    return result


def fetch_language_state_data(var_code):
    """Fetch a single language variable for all states, return {state_code: fraction}."""
    url = f"{BASE}?get=NAME,B16001_001E,{var_code}&for=state:*"
    print(f"  Fetching {url}", file=sys.stderr)
    data = fetch_json(url)
    header = data[0]
    total_idx = header.index("B16001_001E")
    var_idx = header.index(var_code)
    fips_idx = header.index("state")

    result = {}
    for row in data[1:]:
        fips = row[fips_idx]
        state = FIPS_TO_STATE.get(fips)
        if not state:
            continue
        total = safe_int(row[total_idx])
        value = safe_int(row[var_idx])
        if total > 0:
            result[state] = round(value / total, 4)
        else:
            result[state] = 0.0
    return result


def safe_int(val):
    """Safely convert Census value to int, treating None and -999999999 as 0."""
    if val is None:
        return 0
    try:
        v = int(val)
        return v if v >= 0 else 0  # -999999999 means suppressed
    except (ValueError, TypeError):
        return 0


def safe_float(val):
    """Safely convert Census value to float, treating None and negatives as 0."""
    if val is None:
        return 0.0
    try:
        v = float(val)
        return v if v >= 0 else 0.0
    except (ValueError, TypeError):
        return 0.0


def fetch_city_demographics(state_fips, place_fips):
    """Fetch demographic data for a city using detail B-tables. Returns stats dict."""
    print(f"  Fetching city data for {state_fips}/{place_fips}", file=sys.stderr)

    # Use detail B-tables which have stable variable codes
    # B01003_001E = Total population
    # B03003_003E = Hispanic or Latino
    # B03002_003E = White alone (not Hispanic)
    # B02001_003E = Black or African American alone
    # B02001_005E = Asian alone
    # B02001_004E = American Indian and Alaska Native alone
    # B02001_006E = Native Hawaiian and Other Pacific Islander alone
    # B02001_008E = Two or more races
    # B01002_001E = Median age
    demo_url = (
        f"{BASE}?get=NAME,B01003_001E,B03003_003E,B03002_003E,"
        f"B02001_003E,B02001_005E,B02001_004E,B02001_006E,B02001_008E,"
        f"B01002_001E"
        f"&for=place:{place_fips}&in=state:{state_fips}"
    )

    try:
        data = fetch_json(demo_url)
    except Exception as e:
        print(f"  WARNING: Could not fetch demographics for {state_fips}/{place_fips}: {e}", file=sys.stderr)
        return None

    if len(data) < 2:
        print(f"  WARNING: No data for {state_fips}/{place_fips}", file=sys.stderr)
        return None

    header = data[0]
    row = data[1]

    def get_int(col):
        try:
            return safe_int(row[header.index(col)])
        except (ValueError, IndexError):
            return 0

    total_pop = get_int("B01003_001E")
    if total_pop == 0:
        return None

    hispanic = get_int("B03003_003E")
    white_non_hisp = get_int("B03002_003E")
    black = get_int("B02001_003E")
    asian = get_int("B02001_005E")
    aian = get_int("B02001_004E")   # American Indian
    nhpi = get_int("B02001_006E")   # Native Hawaiian/Pacific Islander

    # Median age (returns a float like "39.3")
    try:
        median_age = safe_float(row[header.index("B01002_001E")])
    except (ValueError, IndexError):
        median_age = 0.0

    # Build ethnicity bars (skip "Two or more" - inflated by Census methodology)
    ethnicities = []
    if hispanic > 0:
        ethnicities.append({"label": "Hispanic", "percent": round(hispanic / total_pop * 100, 1)})
    if white_non_hisp > 0:
        ethnicities.append({"label": "White (non-Hispanic)", "percent": round(white_non_hisp / total_pop * 100, 1)})
    if black > 0:
        ethnicities.append({"label": "Black", "percent": round(black / total_pop * 100, 1)})
    if asian > 0:
        ethnicities.append({"label": "Asian", "percent": round(asian / total_pop * 100, 1)})
    if aian > 0 and round(aian / total_pop * 100, 1) >= 1.0:
        ethnicities.append({"label": "Native American", "percent": round(aian / total_pop * 100, 1)})
    if nhpi > 0 and round(nhpi / total_pop * 100, 1) >= 1.0:
        ethnicities.append({"label": "Native Hawaiian/Pacific Islander", "percent": round(nhpi / total_pop * 100, 1)})

    # Sort by percent descending, take top 4
    ethnicities.sort(key=lambda x: x["percent"], reverse=True)
    ethnicities = ethnicities[:4]

    # Population range (round to nearest 10k)
    lower = (total_pop // 10000) * 10000
    upper = lower + 10000
    pop_range = f"{lower:,} - {upper:,}"

    # Language data using C16001 (collapsed language table, available at place level)
    lang_url = (
        f"{BASE}?get=NAME,C16001_001E,C16001_003E,C16001_006E,C16001_009E,"
        f"C16001_012E,C16001_015E,C16001_018E,C16001_021E,C16001_024E,"
        f"C16001_027E,C16001_030E,C16001_033E"
        f"&for=place:{place_fips}&in=state:{state_fips}"
    )
    languages = []
    try:
        lang_data = fetch_json(lang_url)
        if len(lang_data) >= 2:
            lh = lang_data[0]
            lr = lang_data[1]
            lang_total = safe_int(lr[lh.index("C16001_001E")])
            if lang_total == 0:
                lang_total = total_pop

            lang_map = {
                "C16001_003E": "Spanish",
                "C16001_006E": "French/Haitian/Cajun",
                "C16001_009E": "German/West Germanic",
                "C16001_012E": "Russian/Polish/Slavic",
                "C16001_015E": "Other Indo-European",
                "C16001_018E": "Korean",
                "C16001_021E": "Chinese",
                "C16001_024E": "Vietnamese",
                "C16001_027E": "Tagalog/Filipino",
                "C16001_030E": "Other Asian/Pacific Island",
                "C16001_033E": "Arabic",
            }
            for var, name in lang_map.items():
                try:
                    idx = lh.index(var)
                    val = safe_int(lr[idx])
                    if val > 0:
                        pct = round(val / lang_total * 100, 1)
                        if pct >= 0.5:
                            languages.append({"label": name, "percent": pct})
                except (ValueError, IndexError):
                    pass
            languages.sort(key=lambda x: x["percent"], reverse=True)
            languages = languages[:3]
    except Exception as e:
        print(f"  WARNING: Could not fetch language data for {state_fips}/{place_fips}: {e}", file=sys.stderr)

    return {
        "populationRange": pop_range,
        "populationGrowth": "N/A",
        "topEthnicities": ethnicities,
        "topLanguages": languages if languages else [],
        "medianAge": round(median_age, 1) if median_age > 0 else 35.0
    }


def main():
    puzzles = []
    puzzle_id = 1

    # Alternate: heatmap, city, heatmap, city, ...
    ancestry_idx = 0
    language_idx = 0
    city_idx = 0

    # Fetch all ancestry data first
    print("=== Fetching ancestry data ===", file=sys.stderr)
    for p in ANCESTRY_PUZZLES:
        p["state_data"] = fetch_ancestry_state_data(p["var"])

    print("\n=== Fetching language data ===", file=sys.stderr)
    for p in LANGUAGE_PUZZLES:
        p["state_data"] = fetch_language_state_data(p["var"])

    print("\n=== Fetching city demographics ===", file=sys.stderr)
    for c in CITY_PUZZLES:
        c["stats"] = fetch_city_demographics(c["state_fips"], c["place_fips"])

    # Now interleave: ancestry heatmap, city, language heatmap, city, ...
    print("\n=== Building puzzles ===", file=sys.stderr)
    while ancestry_idx < len(ANCESTRY_PUZZLES) or language_idx < len(LANGUAGE_PUZZLES) or city_idx < len(CITY_PUZZLES):
        # Ancestry heatmap
        if ancestry_idx < len(ANCESTRY_PUZZLES):
            p = ANCESTRY_PUZZLES[ancestry_idx]
            puzzles.append({
                "id": puzzle_id,
                "mode": "heatmap",
                "category": "ancestry",
                "answer": p["answer"],
                "stateData": p["state_data"],
                "acceptableAnswers": p["acceptable"],
                "relatedAnswers": p["related"],
                "hints": p["hints"]
            })
            puzzle_id += 1
            ancestry_idx += 1

        # City finder
        if city_idx < len(CITY_PUZZLES):
            c = CITY_PUZZLES[city_idx]
            if c.get("stats"):
                puzzles.append({
                    "id": puzzle_id,
                    "mode": "cityfinder",
                    "answer": c["answer"],
                    "lat": c["lat"],
                    "lng": c["lng"],
                    "stats": c["stats"],
                    "hints": c["hints"]
                })
                puzzle_id += 1
            city_idx += 1

        # Language heatmap
        if language_idx < len(LANGUAGE_PUZZLES):
            p = LANGUAGE_PUZZLES[language_idx]
            puzzles.append({
                "id": puzzle_id,
                "mode": "heatmap",
                "category": "language",
                "answer": p["answer"],
                "stateData": p["state_data"],
                "acceptableAnswers": p["acceptable"],
                "relatedAnswers": p["related"],
                "hints": p["hints"]
            })
            puzzle_id += 1
            language_idx += 1

        # Another city
        if city_idx < len(CITY_PUZZLES):
            c = CITY_PUZZLES[city_idx]
            if c.get("stats"):
                puzzles.append({
                    "id": puzzle_id,
                    "mode": "cityfinder",
                    "answer": c["answer"],
                    "lat": c["lat"],
                    "lng": c["lng"],
                    "stats": c["stats"],
                    "hints": c["hints"]
                })
                puzzle_id += 1
            city_idx += 1

    # Write output
    output_path = "public/data/puzzles.json"
    with open(output_path, "w") as f:
        json.dump(puzzles, f, indent=2)

    print(f"\nWrote {len(puzzles)} puzzles to {output_path}", file=sys.stderr)
    print(f"  Ancestry heatmaps: {len(ANCESTRY_PUZZLES)}", file=sys.stderr)
    print(f"  Language heatmaps: {len(LANGUAGE_PUZZLES)}", file=sys.stderr)
    valid_cities = sum(1 for c in CITY_PUZZLES if c.get("stats"))
    print(f"  City finders: {valid_cities}", file=sys.stderr)


if __name__ == "__main__":
    main()
