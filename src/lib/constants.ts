import { StateCode } from "./types";

// Launch date for puzzle ID calculation
export const LAUNCH_DATE = "2026-02-21";

// Max guesses per game
export const MAX_GUESSES = 6;

// Distance thresholds for city finder (in miles)
export const DISTANCE_GREEN = 30;
export const DISTANCE_YELLOW = 150;

// State FIPS codes mapping (for TopoJSON)
export const STATE_FIPS: Record<string, StateCode> = {
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
};

export const STATE_NAMES: Record<StateCode, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", DC: "District of Columbia",
  FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois",
  IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana",
  ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota",
  MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada",
  NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York",
  NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma",
  OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};

// Ancestry list for autocomplete (Mode 1)
export const ANCESTRY_LIST: string[] = [
  "African American", "Albanian", "Alsatian", "American", "Arab", "Armenian",
  "Assyrian", "Australian", "Austrian", "Basque", "Belgian", "Brazilian",
  "British", "Bulgarian", "Cajun", "Canadian", "Cape Verdean", "Carpatho Rusyn",
  "Celtic", "Chinese", "Colombian", "Croatian", "Cuban", "Cypriot", "Czech",
  "Czechoslovakian", "Danish", "Dominican", "Dutch", "Eastern European",
  "Ecuadorian", "Egyptian", "English", "Estonian", "Ethiopian", "European",
  "Filipino", "Finnish", "French", "French Canadian", "German", "German Russian",
  "Greek", "Guatemalan", "Guyanese", "Haitian", "Honduran", "Hungarian",
  "Icelander", "Indian", "Iranian", "Iraqi", "Irish", "Israeli", "Italian",
  "Jamaican", "Japanese", "Korean", "Laotian", "Latvian", "Lebanese",
  "Lithuanian", "Luxemburger", "Macedonian", "Malaysian", "Maltese", "Mexican",
  "Moravian", "Nigerian", "Northern European", "Norwegian", "Pakistani",
  "Panamanian", "Pennsylvanian German", "Peruvian", "Polish", "Portuguese",
  "Puerto Rican", "Romanian", "Russian", "Salvadoran", "Scandinavian",
  "Scotch-Irish", "Scottish", "Serbian", "Slavic", "Slovak", "Slovene",
  "Somali", "South American", "Soviet Union", "Subsaharan African", "Swedish",
  "Swiss", "Syrian", "Taiwanese", "Thai", "Trinidadian and Tobagonian",
  "Turkish", "Ukrainian", "Vietnamese", "Welsh", "West Indian",
  "Western European", "Yugoslavian",
];

// Language list for autocomplete (Mode 1)
export const LANGUAGE_LIST: string[] = [
  "Spanish", "Chinese", "Tagalog", "Vietnamese", "Arabic", "French",
  "Korean", "Russian", "German", "Haitian Creole", "Hindi", "Portuguese",
  "Japanese", "Gujarati", "Telugu", "Bengali", "Tai-Kadai", "Urdu",
  "Punjabi", "Tamil", "Polish", "Nepali", "Persian", "Swahili",
  "Serbo-Croatian", "Armenian", "Hebrew", "Hmong", "Burmese", "Yoruba",
  "Amharic", "Greek", "Somali", "Italian", "Ukrainian", "Navajo",
  "Khmer", "Thai", "Laotian", "Turkish", "Romanian", "Igbo",
  "Malayalam", "Kannada", "Marathi", "Indonesian", "Czech", "Hungarian",
  "Yiddish", "Dutch",
];

// Combined list for autocomplete
export const ALL_GUESSABLE = [...new Set([...ANCESTRY_LIST, ...LANGUAGE_LIST])].sort();

// Similarity groups for "close" (yellow) scoring.
// If a guess and the answer are in the same group, it's a yellow result.
export const SIMILARITY_GROUPS: string[][] = [
  // Germanic peoples
  ["German", "Austrian", "Swiss", "Pennsylvanian German", "German Russian", "Dutch", "Belgian", "Luxemburger", "Alsatian"],
  // Scandinavian peoples
  ["Norwegian", "Swedish", "Danish", "Finnish", "Icelander", "Scandinavian"],
  // British Isles
  ["English", "Scottish", "Welsh", "Scotch-Irish", "British", "Irish", "Celtic"],
  // Western Slavic
  ["Polish", "Czech", "Slovak", "Czechoslovakian", "Moravian", "Slavic"],
  // South Slavic
  ["Serbian", "Croatian", "Slovene", "Macedonian", "Bulgarian", "Yugoslavian"],
  // East Slavic
  ["Russian", "Ukrainian", "Soviet Union", "Carpatho Rusyn"],
  // Baltic
  ["Lithuanian", "Latvian", "Estonian"],
  // Mediterranean
  ["Italian", "Greek", "Maltese", "Cypriot"],
  // Iberian / Lusophone
  ["Portuguese", "Brazilian"],
  // French-speaking
  ["French", "French Canadian", "Cajun"],
  // East Asian
  ["Chinese", "Japanese", "Korean", "Taiwanese"],
  // Southeast Asian
  ["Filipino", "Vietnamese", "Thai", "Laotian", "Malaysian"],
  // South Asian
  ["Indian", "Pakistani"],
  // Middle Eastern / West Asian
  ["Arab", "Lebanese", "Syrian", "Iraqi", "Egyptian", "Iranian", "Israeli", "Turkish", "Armenian", "Assyrian"],
  // Caribbean
  ["Cuban", "Dominican", "Puerto Rican", "Jamaican", "Haitian", "Trinidadian and Tobagonian", "West Indian", "Guyanese", "Cape Verdean"],
  // Central American / Mexican
  ["Mexican", "Guatemalan", "Salvadoran", "Honduran", "Panamanian"],
  // South American
  ["Colombian", "Ecuadorian", "Peruvian", "South American"],
  // African heritage
  ["African American", "Nigerian", "Ethiopian", "Somali", "Subsaharan African"],
  // Broad European umbrella
  ["European", "Eastern European", "Northern European", "Western European"],
  // Hungarian stands alone but near neighbors
  ["Hungarian", "Romanian", "Albanian"],

  // --- Language groups ---
  // Romance languages
  ["Spanish", "French", "Portuguese", "Italian", "Romanian"],
  // Slavic languages
  ["Russian", "Polish", "Ukrainian", "Czech", "Serbo-Croatian"],
  // Germanic languages
  ["German", "Dutch", "Yiddish"],
  // East Asian languages
  ["Chinese", "Japanese", "Korean"],
  // South Asian languages
  ["Hindi", "Gujarati", "Telugu", "Bengali", "Urdu", "Punjabi", "Tamil", "Malayalam", "Kannada", "Marathi", "Nepali"],
  // Southeast Asian languages
  ["Vietnamese", "Tagalog", "Thai", "Laotian", "Khmer", "Burmese", "Indonesian", "Tai-Kadai", "Hmong"],
  // Semitic / NE African languages
  ["Arabic", "Hebrew", "Amharic"],
  // Sub-Saharan African languages
  ["Somali", "Swahili", "Yoruba", "Igbo"],
  // Middle Eastern languages
  ["Arabic", "Persian", "Turkish"],
];

// Major US cities with coordinates (for Mode 2 reference hints)
export const MAJOR_CITIES: { name: string; lat: number; lng: number }[] = [
  { name: "New York", lat: 40.7128, lng: -74.006 },
  { name: "Los Angeles", lat: 34.0522, lng: -118.2437 },
  { name: "Chicago", lat: 41.8781, lng: -87.6298 },
  { name: "Houston", lat: 29.7604, lng: -95.3698 },
  { name: "Phoenix", lat: 33.4484, lng: -112.074 },
  { name: "Philadelphia", lat: 39.9526, lng: -75.1652 },
  { name: "San Antonio", lat: 29.4241, lng: -98.4936 },
  { name: "San Diego", lat: 32.7157, lng: -117.1611 },
  { name: "Dallas", lat: 32.7767, lng: -96.797 },
  { name: "San Jose", lat: 37.3382, lng: -121.8863 },
  { name: "Austin", lat: 30.2672, lng: -97.7431 },
  { name: "Jacksonville", lat: 30.3322, lng: -81.6557 },
  { name: "San Francisco", lat: 37.7749, lng: -122.4194 },
  { name: "Seattle", lat: 47.6062, lng: -122.3321 },
  { name: "Denver", lat: 39.7392, lng: -104.9903 },
  { name: "Nashville", lat: 36.1627, lng: -86.7816 },
  { name: "Atlanta", lat: 33.749, lng: -84.388 },
  { name: "Miami", lat: 25.7617, lng: -80.1918 },
  { name: "Boston", lat: 42.3601, lng: -71.0589 },
  { name: "Minneapolis", lat: 44.9778, lng: -93.265 },
  { name: "Detroit", lat: 42.3314, lng: -83.0458 },
  { name: "Portland", lat: 45.5152, lng: -122.6784 },
  { name: "Las Vegas", lat: 36.1699, lng: -115.1398 },
  { name: "Salt Lake City", lat: 40.7608, lng: -111.891 },
  { name: "Kansas City", lat: 39.0997, lng: -94.5786 },
  { name: "New Orleans", lat: 29.9511, lng: -90.0715 },
];

// US cities for city finder autocomplete (~300 cities)
// Covers all state capitals, major metros, and notable mid-size cities
export const US_CITIES: { name: string; lat: number; lng: number }[] = [
  // Alabama
  { name: "Montgomery, AL", lat: 32.3669, lng: -86.3000 },
  { name: "Birmingham, AL", lat: 33.5207, lng: -86.8025 },
  { name: "Huntsville, AL", lat: 34.7304, lng: -86.5861 },
  { name: "Mobile, AL", lat: 30.6954, lng: -88.0399 },
  { name: "Tuscaloosa, AL", lat: 33.2098, lng: -87.5692 },
  // Alaska
  { name: "Juneau, AK", lat: 58.3005, lng: -134.4197 },
  { name: "Anchorage, AK", lat: 61.2181, lng: -149.9003 },
  { name: "Fairbanks, AK", lat: 64.8378, lng: -147.7164 },
  // Arizona
  { name: "Phoenix, AZ", lat: 33.4484, lng: -112.0740 },
  { name: "Tucson, AZ", lat: 32.2226, lng: -110.9747 },
  { name: "Mesa, AZ", lat: 33.4152, lng: -111.8315 },
  { name: "Scottsdale, AZ", lat: 33.4942, lng: -111.9261 },
  { name: "Tempe, AZ", lat: 33.4255, lng: -111.9400 },
  { name: "Flagstaff, AZ", lat: 35.1983, lng: -111.6513 },
  // Arkansas
  { name: "Little Rock, AR", lat: 34.7465, lng: -92.2896 },
  { name: "Fort Smith, AR", lat: 35.3859, lng: -94.3985 },
  { name: "Fayetteville, AR", lat: 36.0626, lng: -94.1574 },
  // California
  { name: "Sacramento, CA", lat: 38.5816, lng: -121.4944 },
  { name: "Los Angeles, CA", lat: 34.0522, lng: -118.2437 },
  { name: "San Francisco, CA", lat: 37.7749, lng: -122.4194 },
  { name: "San Diego, CA", lat: 32.7157, lng: -117.1611 },
  { name: "San Jose, CA", lat: 37.3382, lng: -121.8863 },
  { name: "Fresno, CA", lat: 36.7378, lng: -119.7871 },
  { name: "Long Beach, CA", lat: 33.7701, lng: -118.1937 },
  { name: "Oakland, CA", lat: 37.8044, lng: -122.2712 },
  { name: "Bakersfield, CA", lat: 35.3733, lng: -119.0187 },
  { name: "Anaheim, CA", lat: 33.8366, lng: -117.9143 },
  { name: "Santa Ana, CA", lat: 33.7455, lng: -117.8677 },
  { name: "Riverside, CA", lat: 33.9533, lng: -117.3962 },
  { name: "Stockton, CA", lat: 37.9577, lng: -121.2908 },
  { name: "Irvine, CA", lat: 33.6846, lng: -117.8265 },
  { name: "Santa Rosa, CA", lat: 38.4405, lng: -122.7141 },
  { name: "Modesto, CA", lat: 37.6391, lng: -120.9969 },
  { name: "San Bernardino, CA", lat: 34.1083, lng: -117.2898 },
  { name: "Santa Barbara, CA", lat: 34.4208, lng: -119.6982 },
  { name: "Palmdale, CA", lat: 34.5794, lng: -118.1165 },
  // Colorado
  { name: "Denver, CO", lat: 39.7392, lng: -104.9903 },
  { name: "Colorado Springs, CO", lat: 38.8339, lng: -104.8214 },
  { name: "Aurora, CO", lat: 39.7294, lng: -104.8319 },
  { name: "Fort Collins, CO", lat: 40.5853, lng: -105.0844 },
  { name: "Boulder, CO", lat: 40.0150, lng: -105.2705 },
  { name: "Pueblo, CO", lat: 38.2545, lng: -104.6091 },
  // Connecticut
  { name: "Hartford, CT", lat: 41.7658, lng: -72.6734 },
  { name: "New Haven, CT", lat: 41.3083, lng: -72.9279 },
  { name: "Bridgeport, CT", lat: 41.1865, lng: -73.1952 },
  { name: "Stamford, CT", lat: 41.0534, lng: -73.5387 },
  // Delaware
  { name: "Dover, DE", lat: 39.1582, lng: -75.5244 },
  { name: "Wilmington, DE", lat: 39.7391, lng: -75.5398 },
  // Florida
  { name: "Tallahassee, FL", lat: 30.4383, lng: -84.2807 },
  { name: "Miami, FL", lat: 25.7617, lng: -80.1918 },
  { name: "Jacksonville, FL", lat: 30.3322, lng: -81.6557 },
  { name: "Tampa, FL", lat: 27.9506, lng: -82.4572 },
  { name: "Orlando, FL", lat: 28.5383, lng: -81.3792 },
  { name: "St. Petersburg, FL", lat: 27.7676, lng: -82.6403 },
  { name: "Fort Lauderdale, FL", lat: 26.1224, lng: -80.1373 },
  { name: "Gainesville, FL", lat: 29.6516, lng: -82.3248 },
  { name: "Pensacola, FL", lat: 30.4213, lng: -87.2169 },
  { name: "Cape Coral, FL", lat: 26.5629, lng: -81.9495 },
  { name: "Sarasota, FL", lat: 27.3364, lng: -82.5307 },
  // Georgia
  { name: "Atlanta, GA", lat: 33.7490, lng: -84.3880 },
  { name: "Savannah, GA", lat: 32.0809, lng: -81.0912 },
  { name: "Augusta, GA", lat: 33.4735, lng: -81.9748 },
  { name: "Columbus, GA", lat: 32.4610, lng: -84.9877 },
  { name: "Macon, GA", lat: 32.8407, lng: -83.6324 },
  // Hawaii
  { name: "Honolulu, HI", lat: 21.3069, lng: -157.8583 },
  { name: "Hilo, HI", lat: 19.7074, lng: -155.0847 },
  // Idaho
  { name: "Boise, ID", lat: 43.6150, lng: -116.2023 },
  { name: "Idaho Falls, ID", lat: 43.4917, lng: -112.0339 },
  { name: "Pocatello, ID", lat: 42.8713, lng: -112.4455 },
  // Illinois
  { name: "Springfield, IL", lat: 39.7817, lng: -89.6501 },
  { name: "Chicago, IL", lat: 41.8781, lng: -87.6298 },
  { name: "Aurora, IL", lat: 41.7606, lng: -88.3201 },
  { name: "Rockford, IL", lat: 42.2711, lng: -89.0940 },
  { name: "Peoria, IL", lat: 40.6936, lng: -89.5890 },
  { name: "Champaign, IL", lat: 40.1164, lng: -88.2434 },
  // Indiana
  { name: "Indianapolis, IN", lat: 39.7684, lng: -86.1581 },
  { name: "Fort Wayne, IN", lat: 41.0793, lng: -85.1394 },
  { name: "Evansville, IN", lat: 37.9716, lng: -87.5711 },
  { name: "South Bend, IN", lat: 41.6764, lng: -86.2520 },
  { name: "Bloomington, IN", lat: 39.1653, lng: -86.5264 },
  // Iowa
  { name: "Des Moines, IA", lat: 41.5868, lng: -93.6250 },
  { name: "Cedar Rapids, IA", lat: 41.9779, lng: -91.6656 },
  { name: "Davenport, IA", lat: 41.5236, lng: -90.5776 },
  { name: "Iowa City, IA", lat: 41.6611, lng: -91.5302 },
  // Kansas
  { name: "Topeka, KS", lat: 39.0473, lng: -95.6752 },
  { name: "Wichita, KS", lat: 37.6872, lng: -97.3301 },
  { name: "Overland Park, KS", lat: 38.9822, lng: -94.6708 },
  { name: "Kansas City, KS", lat: 39.1142, lng: -94.6275 },
  // Kentucky
  { name: "Frankfort, KY", lat: 38.2009, lng: -84.8733 },
  { name: "Louisville, KY", lat: 38.2527, lng: -85.7585 },
  { name: "Lexington, KY", lat: 38.0406, lng: -84.5037 },
  { name: "Bowling Green, KY", lat: 36.9685, lng: -86.4808 },
  // Louisiana
  { name: "Baton Rouge, LA", lat: 30.4515, lng: -91.1871 },
  { name: "New Orleans, LA", lat: 29.9511, lng: -90.0715 },
  { name: "Shreveport, LA", lat: 32.5252, lng: -93.7502 },
  { name: "Lafayette, LA", lat: 30.2241, lng: -92.0198 },
  // Maine
  { name: "Augusta, ME", lat: 44.3106, lng: -69.7795 },
  { name: "Portland, ME", lat: 43.6591, lng: -70.2568 },
  { name: "Bangor, ME", lat: 44.8012, lng: -68.7778 },
  // Maryland
  { name: "Annapolis, MD", lat: 38.9784, lng: -76.4922 },
  { name: "Baltimore, MD", lat: 39.2904, lng: -76.6122 },
  { name: "Frederick, MD", lat: 39.4143, lng: -77.4105 },
  // Massachusetts
  { name: "Boston, MA", lat: 42.3601, lng: -71.0589 },
  { name: "Worcester, MA", lat: 42.2626, lng: -71.8023 },
  { name: "Springfield, MA", lat: 42.1015, lng: -72.5898 },
  { name: "Cambridge, MA", lat: 42.3736, lng: -71.1097 },
  { name: "Lowell, MA", lat: 42.6334, lng: -71.3162 },
  // Michigan
  { name: "Lansing, MI", lat: 42.7325, lng: -84.5555 },
  { name: "Detroit, MI", lat: 42.3314, lng: -83.0458 },
  { name: "Grand Rapids, MI", lat: 42.9634, lng: -85.6681 },
  { name: "Ann Arbor, MI", lat: 42.2808, lng: -83.7430 },
  { name: "Flint, MI", lat: 43.0125, lng: -83.6875 },
  { name: "Kalamazoo, MI", lat: 42.2917, lng: -85.5872 },
  // Minnesota
  { name: "St. Paul, MN", lat: 44.9537, lng: -93.0900 },
  { name: "Minneapolis, MN", lat: 44.9778, lng: -93.2650 },
  { name: "Rochester, MN", lat: 44.0121, lng: -92.4802 },
  { name: "Duluth, MN", lat: 46.7867, lng: -92.1005 },
  // Mississippi
  { name: "Jackson, MS", lat: 32.2988, lng: -90.1848 },
  { name: "Gulfport, MS", lat: 30.3674, lng: -89.0928 },
  { name: "Hattiesburg, MS", lat: 31.3271, lng: -89.2903 },
  // Missouri
  { name: "Jefferson City, MO", lat: 38.5768, lng: -92.1735 },
  { name: "Kansas City, MO", lat: 39.0997, lng: -94.5786 },
  { name: "St. Louis, MO", lat: 38.6270, lng: -90.1994 },
  { name: "Springfield, MO", lat: 37.2090, lng: -93.2923 },
  { name: "Columbia, MO", lat: 38.9517, lng: -92.3341 },
  // Montana
  { name: "Helena, MT", lat: 46.5884, lng: -112.0245 },
  { name: "Billings, MT", lat: 45.7833, lng: -108.5007 },
  { name: "Missoula, MT", lat: 46.8721, lng: -114.0093 },
  { name: "Great Falls, MT", lat: 47.5053, lng: -111.3008 },
  // Nebraska
  { name: "Lincoln, NE", lat: 40.8136, lng: -96.7026 },
  { name: "Omaha, NE", lat: 41.2565, lng: -95.9345 },
  // Nevada
  { name: "Carson City, NV", lat: 39.1638, lng: -119.7674 },
  { name: "Las Vegas, NV", lat: 36.1699, lng: -115.1398 },
  { name: "Reno, NV", lat: 39.5296, lng: -119.8138 },
  { name: "Henderson, NV", lat: 36.0395, lng: -114.9817 },
  // New Hampshire
  { name: "Concord, NH", lat: 43.2081, lng: -71.5376 },
  { name: "Manchester, NH", lat: 42.9956, lng: -71.4548 },
  { name: "Nashua, NH", lat: 42.7654, lng: -71.4676 },
  // New Jersey
  { name: "Trenton, NJ", lat: 40.2171, lng: -74.7429 },
  { name: "Newark, NJ", lat: 40.7357, lng: -74.1724 },
  { name: "Jersey City, NJ", lat: 40.7178, lng: -74.0431 },
  { name: "Atlantic City, NJ", lat: 39.3643, lng: -74.4229 },
  { name: "Paterson, NJ", lat: 40.9168, lng: -74.1718 },
  // New Mexico
  { name: "Santa Fe, NM", lat: 35.6870, lng: -105.9378 },
  { name: "Albuquerque, NM", lat: 35.0844, lng: -106.6504 },
  { name: "Las Cruces, NM", lat: 32.3199, lng: -106.7637 },
  // New York
  { name: "Albany, NY", lat: 42.6526, lng: -73.7562 },
  { name: "New York, NY", lat: 40.7128, lng: -74.0060 },
  { name: "Buffalo, NY", lat: 42.8864, lng: -78.8784 },
  { name: "Rochester, NY", lat: 43.1566, lng: -77.6088 },
  { name: "Syracuse, NY", lat: 43.0481, lng: -76.1474 },
  { name: "Yonkers, NY", lat: 40.9312, lng: -73.8987 },
  // North Carolina
  { name: "Raleigh, NC", lat: 35.7796, lng: -78.6382 },
  { name: "Charlotte, NC", lat: 35.2271, lng: -80.8431 },
  { name: "Durham, NC", lat: 35.9940, lng: -78.8986 },
  { name: "Greensboro, NC", lat: 36.0726, lng: -79.7920 },
  { name: "Winston-Salem, NC", lat: 36.0999, lng: -80.2442 },
  { name: "Asheville, NC", lat: 35.5951, lng: -82.5515 },
  { name: "Wilmington, NC", lat: 34.2257, lng: -77.9447 },
  // North Dakota
  { name: "Bismarck, ND", lat: 46.8083, lng: -100.7837 },
  { name: "Fargo, ND", lat: 46.8772, lng: -96.7898 },
  { name: "Grand Forks, ND", lat: 47.9253, lng: -97.0329 },
  // Ohio
  { name: "Columbus, OH", lat: 39.9612, lng: -82.9988 },
  { name: "Cleveland, OH", lat: 41.4993, lng: -81.6944 },
  { name: "Cincinnati, OH", lat: 39.1031, lng: -84.5120 },
  { name: "Toledo, OH", lat: 41.6528, lng: -83.5379 },
  { name: "Akron, OH", lat: 41.0814, lng: -81.5190 },
  { name: "Dayton, OH", lat: 39.7589, lng: -84.1916 },
  // Oklahoma
  { name: "Oklahoma City, OK", lat: 35.4676, lng: -97.5164 },
  { name: "Tulsa, OK", lat: 36.1540, lng: -95.9928 },
  { name: "Norman, OK", lat: 35.2226, lng: -97.4395 },
  // Oregon
  { name: "Salem, OR", lat: 44.9429, lng: -123.0351 },
  { name: "Portland, OR", lat: 45.5152, lng: -122.6784 },
  { name: "Eugene, OR", lat: 44.0521, lng: -123.0868 },
  { name: "Bend, OR", lat: 44.0582, lng: -121.3153 },
  // Pennsylvania
  { name: "Harrisburg, PA", lat: 40.2732, lng: -76.8867 },
  { name: "Philadelphia, PA", lat: 39.9526, lng: -75.1652 },
  { name: "Pittsburgh, PA", lat: 40.4406, lng: -79.9959 },
  { name: "Allentown, PA", lat: 40.6084, lng: -75.4902 },
  { name: "Erie, PA", lat: 42.1292, lng: -80.0851 },
  { name: "Scranton, PA", lat: 41.4090, lng: -75.6624 },
  // Rhode Island
  { name: "Providence, RI", lat: 41.8240, lng: -71.4128 },
  { name: "Warwick, RI", lat: 41.7001, lng: -71.4162 },
  // South Carolina
  { name: "Columbia, SC", lat: 34.0007, lng: -81.0348 },
  { name: "Charleston, SC", lat: 32.7765, lng: -79.9311 },
  { name: "Greenville, SC", lat: 34.8526, lng: -82.3940 },
  { name: "Myrtle Beach, SC", lat: 33.6891, lng: -78.8867 },
  // South Dakota
  { name: "Pierre, SD", lat: 44.3683, lng: -100.3510 },
  { name: "Sioux Falls, SD", lat: 43.5446, lng: -96.7311 },
  { name: "Rapid City, SD", lat: 44.0805, lng: -103.2310 },
  // Tennessee
  { name: "Nashville, TN", lat: 36.1627, lng: -86.7816 },
  { name: "Memphis, TN", lat: 35.1495, lng: -90.0490 },
  { name: "Knoxville, TN", lat: 35.9606, lng: -83.9207 },
  { name: "Chattanooga, TN", lat: 35.0456, lng: -85.3097 },
  // Texas
  { name: "Austin, TX", lat: 30.2672, lng: -97.7431 },
  { name: "Houston, TX", lat: 29.7604, lng: -95.3698 },
  { name: "Dallas, TX", lat: 32.7767, lng: -96.7970 },
  { name: "San Antonio, TX", lat: 29.4241, lng: -98.4936 },
  { name: "Fort Worth, TX", lat: 32.7555, lng: -97.3308 },
  { name: "El Paso, TX", lat: 31.7619, lng: -106.4850 },
  { name: "Arlington, TX", lat: 32.7357, lng: -97.1081 },
  { name: "Corpus Christi, TX", lat: 27.8006, lng: -97.3964 },
  { name: "Lubbock, TX", lat: 33.5779, lng: -101.8552 },
  { name: "Amarillo, TX", lat: 35.2220, lng: -101.8313 },
  { name: "Laredo, TX", lat: 27.5036, lng: -99.5076 },
  { name: "Brownsville, TX", lat: 25.9017, lng: -97.4975 },
  { name: "McAllen, TX", lat: 26.2034, lng: -98.2300 },
  { name: "Midland, TX", lat: 31.9973, lng: -102.0779 },
  { name: "Plano, TX", lat: 33.0198, lng: -96.6989 },
  // Utah
  { name: "Salt Lake City, UT", lat: 40.7608, lng: -111.8910 },
  { name: "Provo, UT", lat: 40.2338, lng: -111.6585 },
  { name: "Ogden, UT", lat: 41.2230, lng: -111.9738 },
  { name: "St. George, UT", lat: 37.0965, lng: -113.5684 },
  // Vermont
  { name: "Montpelier, VT", lat: 44.2601, lng: -72.5754 },
  { name: "Burlington, VT", lat: 44.4759, lng: -73.2121 },
  // Virginia
  { name: "Richmond, VA", lat: 37.5407, lng: -77.4360 },
  { name: "Virginia Beach, VA", lat: 36.8529, lng: -75.9780 },
  { name: "Norfolk, VA", lat: 36.8508, lng: -76.2859 },
  { name: "Arlington, VA", lat: 38.8799, lng: -77.1068 },
  { name: "Charlottesville, VA", lat: 38.0293, lng: -78.4767 },
  { name: "Roanoke, VA", lat: 37.2710, lng: -79.9414 },
  // Washington
  { name: "Olympia, WA", lat: 47.0379, lng: -122.9007 },
  { name: "Seattle, WA", lat: 47.6062, lng: -122.3321 },
  { name: "Tacoma, WA", lat: 47.2529, lng: -122.4443 },
  { name: "Spokane, WA", lat: 47.6588, lng: -117.4260 },
  { name: "Vancouver, WA", lat: 45.6387, lng: -122.6615 },
  { name: "Bellevue, WA", lat: 47.6101, lng: -122.2015 },
  // West Virginia
  { name: "Charleston, WV", lat: 38.3498, lng: -81.6326 },
  { name: "Huntington, WV", lat: 38.4192, lng: -82.4452 },
  { name: "Morgantown, WV", lat: 39.6295, lng: -79.9559 },
  // Wisconsin
  { name: "Madison, WI", lat: 43.0731, lng: -89.4012 },
  { name: "Milwaukee, WI", lat: 43.0389, lng: -87.9065 },
  { name: "Green Bay, WI", lat: 44.5133, lng: -88.0133 },
  { name: "Eau Claire, WI", lat: 44.8113, lng: -91.4985 },
  // Wyoming
  { name: "Cheyenne, WY", lat: 41.1400, lng: -104.8202 },
  { name: "Casper, WY", lat: 42.8666, lng: -106.3131 },
  { name: "Laramie, WY", lat: 41.3114, lng: -105.5911 },
  // DC
  { name: "Washington, DC", lat: 38.9072, lng: -77.0369 },
  // Additional notable cities
  { name: "Anchorage, AK", lat: 61.2181, lng: -149.9003 },
  { name: "Chandler, AZ", lat: 33.3062, lng: -111.8413 },
  { name: "Gilbert, AZ", lat: 33.3528, lng: -111.7890 },
  { name: "Glendale, AZ", lat: 33.5387, lng: -112.1860 },
  { name: "Oxnard, CA", lat: 34.1975, lng: -119.1771 },
  { name: "Fontana, CA", lat: 34.0922, lng: -117.4350 },
  { name: "Ontario, CA", lat: 34.0633, lng: -117.6509 },
  { name: "Rancho Cucamonga, CA", lat: 34.1064, lng: -117.5931 },
  { name: "Santa Clarita, CA", lat: 34.3917, lng: -118.5426 },
  { name: "Garden Grove, CA", lat: 33.7743, lng: -117.9379 },
  { name: "Oceanside, CA", lat: 33.1959, lng: -117.3795 },
  { name: "Elk Grove, CA", lat: 38.4088, lng: -121.3716 },
  { name: "Corona, CA", lat: 33.8753, lng: -117.5664 },
  { name: "Chula Vista, CA", lat: 32.6401, lng: -117.0842 },
  { name: "Visalia, CA", lat: 36.3302, lng: -119.2921 },
  { name: "Fremont, CA", lat: 37.5485, lng: -121.9886 },
  { name: "Moreno Valley, CA", lat: 33.9425, lng: -117.2297 },
  { name: "Lakewood, CO", lat: 39.7047, lng: -105.0814 },
  { name: "Thornton, CO", lat: 39.8680, lng: -104.9719 },
  { name: "Arvada, CO", lat: 39.8028, lng: -105.0875 },
  { name: "Westminster, CO", lat: 39.8367, lng: -105.0372 },
  { name: "Coral Springs, FL", lat: 26.2712, lng: -80.2706 },
  { name: "Clearwater, FL", lat: 27.9659, lng: -82.8001 },
  { name: "Palm Bay, FL", lat: 28.0345, lng: -80.5887 },
  { name: "Lakeland, FL", lat: 28.0395, lng: -81.9498 },
  { name: "Pompano Beach, FL", lat: 26.2379, lng: -80.1248 },
  { name: "Hollywood, FL", lat: 26.0112, lng: -80.1495 },
  { name: "Port St. Lucie, FL", lat: 27.2730, lng: -80.3582 },
  { name: "Hialeah, FL", lat: 25.8576, lng: -80.2781 },
  { name: "Athens, GA", lat: 33.9519, lng: -83.3576 },
  { name: "Sandy Springs, GA", lat: 33.9304, lng: -84.3733 },
  { name: "Roswell, GA", lat: 34.0232, lng: -84.3616 },
  { name: "Naperville, IL", lat: 41.7508, lng: -88.1535 },
  { name: "Joliet, IL", lat: 41.5250, lng: -88.0817 },
  { name: "Elgin, IL", lat: 42.0354, lng: -88.2826 },
  { name: "Carmel, IN", lat: 39.9784, lng: -86.1180 },
  { name: "Fishers, IN", lat: 39.9568, lng: -86.0133 },
  { name: "Overland Park, KS", lat: 38.9822, lng: -94.6708 },
  { name: "Olathe, KS", lat: 38.8814, lng: -94.8191 },
  { name: "Baton Rouge, LA", lat: 30.4515, lng: -91.1871 },
  { name: "Rockville, MD", lat: 39.0840, lng: -77.1528 },
  { name: "Sterling Heights, MI", lat: 42.5803, lng: -83.0302 },
  { name: "Warren, MI", lat: 42.5145, lng: -83.0147 },
  { name: "Independence, MO", lat: 39.0911, lng: -94.4155 },
  { name: "Lee's Summit, MO", lat: 38.9108, lng: -94.3822 },
  { name: "Elizabeth, NJ", lat: 40.6640, lng: -74.2107 },
  { name: "Henderson, NV", lat: 36.0395, lng: -114.9817 },
  { name: "North Las Vegas, NV", lat: 36.1989, lng: -115.1175 },
  { name: "Cary, NC", lat: 35.7915, lng: -78.7811 },
  { name: "High Point, NC", lat: 35.9557, lng: -80.0053 },
  { name: "Fayetteville, NC", lat: 35.0527, lng: -78.8784 },
  { name: "Frisco, TX", lat: 33.1507, lng: -96.8236 },
  { name: "McKinney, TX", lat: 33.1972, lng: -96.6397 },
  { name: "Irving, TX", lat: 32.8140, lng: -96.9489 },
  { name: "Garland, TX", lat: 32.9126, lng: -96.6389 },
  { name: "Grand Prairie, TX", lat: 32.7460, lng: -96.9978 },
  { name: "Killeen, TX", lat: 31.1171, lng: -97.7278 },
  { name: "Denton, TX", lat: 33.2148, lng: -97.1331 },
  { name: "Round Rock, TX", lat: 30.5083, lng: -97.6789 },
  { name: "Abilene, TX", lat: 32.4487, lng: -99.7331 },
  { name: "Beaumont, TX", lat: 30.0802, lng: -94.1266 },
  { name: "Waco, TX", lat: 31.5493, lng: -97.1467 },
  { name: "Chesapeake, VA", lat: 36.7682, lng: -76.2875 },
  { name: "Hampton, VA", lat: 37.0299, lng: -76.3452 },
  { name: "Newport News, VA", lat: 37.0871, lng: -76.4730 },
  { name: "Alexandria, VA", lat: 38.8048, lng: -77.0469 },
  { name: "Kent, WA", lat: 47.3809, lng: -122.2348 },
  { name: "Renton, WA", lat: 47.4829, lng: -122.2171 },
  { name: "Federal Way, WA", lat: 47.3223, lng: -122.3126 },
  { name: "Everett, WA", lat: 47.9790, lng: -122.2021 },
];

// Derived list of city names for autocomplete filtering
export const US_CITY_NAMES: string[] = US_CITIES.map((c) => c.name);
