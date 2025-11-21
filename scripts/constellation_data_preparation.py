from bs4 import BeautifulSoup
import requests
from collections import defaultdict
import json
from pathlib import Path
import numpy as np

def get_constellation_abbr_name():  
    aavso_website = requests.get('https://www.aavso.org/constellation-names-and-abbreviations')
    soup = BeautifulSoup(aavso_website.content, 'html.parser')
    rows = soup.select("table tbody tr")

    data = {}

    for tr in rows:
        cols = [td.get_text(strip = True) for td in tr.find_all('td')]

        nominative_name = cols[0]
        genitive_name = cols[1]
        abbr = cols[2]

        data[abbr] = {
            "nominative_name" : nominative_name,
            "genitive_name" : genitive_name,
        }
    
    # Now we go through the iau website and get the description or English name that is like a description
    iau_website = requests.get('https://www.iau.org/Iau/Iau/Science/What-we-do/The-Constellations.aspx')
    soup = BeautifulSoup(iau_website.content, 'html.parser')
    rows = soup.select("table tbody tr")

    for tr in rows:
        cols = [td.get_text(strip = True) for td in tr.find_all('td')]
        english_name = cols[2]
        abbr = cols[1]
        if abbr in data:
            data[abbr].update({"english_name" : english_name})

    return data

def get_visibility (declination):
    if declination > 60:
        return {'hemisphere': 'northern', 'alwaysVisible': ['northern_60'] }
    elif declination > 30:
        return {'hemisphere': 'northern', 'alwaysVisible': [] } 
    elif declination > -30:
        return {'hemisphere': 'both', 'alwaysVisible': [] }
    elif declination > -60:
        return {'hemisphere': 'southern', 'alwaysVisible':[]}
    else:
        return {'hemisphere': 'southern', 'alwaysVisible': ['southern_60'] }
    
def get_circular_mean_ra(ra_values, weights):
    """
        RA from 0-24h, 0-2pi radians
        Convert to unit vectors, find average of angle vectors, 
        Convert back to hours
    """
    # Convert the ra into radians 
    ra_rad = [ra * 2 * np.pi/24 for ra in ra_values ]
    # Get circular statistics
    sin_sum = sum(np.sin(r) * w for r,w in zip(ra_rad, weights))
    cos_sum = sum(np.cos(r) * w for r,w in zip(ra_rad, weights))
    mean_rad = np.arctan2(sin_sum, cos_sum)
    
    mean_ra = (mean_rad * 24 / (2 * np.pi)) % 24
    return mean_ra


def get_stars_centroid(dec_mag_list: {(int, int, int, "")}) -> int:
    """
    Given a set  containing the declination of a constellation 
    find the weighted median. We find the weighted centroid. Higher weights to brighter stars
    Lower apparent mag = brighter. 
    We get a set containing (ra, dec, mag, name) * n number of stars present in a constellation
    Find the weight factor where brighter stars have larger weights (lower apparent mag = brighter) 
    Using the weight find the sum of declination, divide it by number of stars
    The formula that is being used it Brightness ratio = 10 ^ (-mag/2.5)
        This converts the logarithmetic magnitude to linear brightness/ flux for proper weighting
    """
    weight = [10 ** (-star[2] / 2.5) for star in dec_mag_list]
    center_dec = sum(star[1] * w for star, w in zip(dec_mag_list, weight)) / sum(weight)
    
    ra_values = [ra[0] for ra in dec_mag_list]
    center_ra = get_circular_mean_ra(ra_values, weight)
    return center_ra, center_dec

def get_brightest_star(dec_mag_list: {(int, int, "")}):
    """
    Given a set containing tuple(ra, dec, mag, name)
    Go through the list to find the min_value of mag. 
    We are provided the apparent magnitude where lower value is brighter
    We just use a min with lambda function to return the brightest star
    We can switch to a sorting algorithm if we want to return n brightest stars
    """
    brightest_star = sorted(dec_mag_list, key= lambda dec_mag_list: dec_mag_list[2])
    return brightest_star[:2]

def add_metadata_to_constellation(data, constellation_lines):
    """
        The constellation lines dataset has "Abbr": ra, dec, mag, ... etc
        Before we do anything, we need to make tuples of (dec, mag, name) pair for each constellation
        The data is such that we have a bunch of constellations
            Each constellations may have many line segments
                There are segments in line segments
                    There are lines "from" a star and "to" a star
        Firstly, we need to find the centroid/ center dec of a constellation
        After the centroid, we can find the visibility 
        Also we can get like 2 bright stars
    """
    for constellation in constellation_lines:
        stars = set()
        for segments in constellation_lines[constellation]:
            for segment in segments:
                from_ra = segment['from']['ra']
                from_dec = segment['from']['dec']
                from_mag = segment['from']['mag']
                from_name = segment['from']['name']
                
                to_ra = segment['to']['ra']
                to_dec = segment['to']['dec']
                to_mag = segment['to']['mag']
                to_name = segment['to']['name']
                stars.add((from_ra, from_dec, from_mag, from_name))
                stars.add((to_ra, to_dec, to_mag, to_name))
        # Once we have added all stars in the set, we can calculate the weighted centroid
        center_ra, center_dec = get_stars_centroid(stars)
        # With the center_declination of constellation, we can find the constellation's visibility
        constellation_visibility = get_visibility(center_dec)
        brightest_star = [star[3] if star[3] else None for star in get_brightest_star(stars)]

        if constellation in data:
            data[constellation].update({
                "center_ra": center_ra,
                "center_dec" : center_dec,
                "bright_stars": brightest_star
            }
            )
            data[constellation].update(constellation_visibility)
    return data

def open_saved_json(file):
    with open(file, 'r') as fp:
        data = json.load(fp)
    return data

def save_json_to_disk(data, file_path):
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)
    print("Constellation StellaDex data was saved to disk")

if __name__ == "__main__":
    CONSTELLATION_STELLADEX_DATA = './assets/constellation_stelladex_data.json'
    CONSTELLATION_LINES_DATA = './data/constellation_lines_with_mag.json'
    json_file = Path(CONSTELLATION_STELLADEX_DATA)

    if json_file.is_file():
        data = open_saved_json(CONSTELLATION_STELLADEX_DATA)
    else:
        data = get_constellation_abbr_name()
    constellation_lines = open_saved_json(CONSTELLATION_LINES_DATA)
    data = add_metadata_to_constellation(data, constellation_lines)
    save_json_to_disk(data= data, file_path= CONSTELLATION_STELLADEX_DATA)
    
