from collections import defaultdict
import json

def parse_constellation_lines(dat_file_path):
    """
    Go through the provided dat file,
    read each line and store that as a segment of constellation
    """
    constellations = defaultdict(list)

    with open(dat_file_path, "r") as file:
        for line in file:
            line = line.strip()
            if not line or line.startswith("#"):
                continue

            parts = line.split()
            constellation_abbr = parts[0]
            number_of_star = parts[1]

            stars_bsc = [int(num) for num in parts[2:]]
            if int(number_of_star) != len(stars_bsc):
                print(
                    f"Number not matched: {constellation_abbr}, {number_of_star}, {len(stars_bsc)}"
                )

            constellations[constellation_abbr].append(stars_bsc)
    return constellations

def load_hyg_data(hyg_file_path):
    with open(hyg_file_path, 'r') as file:
        hyg_data = json.load(file)
    return hyg_data

def create_bsc_lookup(hyg_data):
    """
        Create a bsc lookup to look at the BSC number quickly
    """
    bsc_lookup = {}
    for star in hyg_data:
        if star.get("hr"):
            bsc_lookup[int(star['hr'])] = {
                'ra': star['ra'],
                'dec': star['dec'],
                'name': star.get('proper', 'unknown'),
                'con': star.get('con', 'unknown'),
                'mag': star.get('mag')
                
                # Can add more details here if needed and reconstruct the data
            }
    return bsc_lookup

def process_constellation_lines(constellation_data, bsc_lookup):
    """
     Convert the bsc sequences present in the constellation data to actual star coordinates
    """
    processed_constellations = {}

    for const_abbr, bsc_sequences in constellation_data.items():
        constellation_lines = []

        for bsc_sequence in bsc_sequences:
            segment_lines = []

            for i in range(len(bsc_sequence) - 1):
                star_from = bsc_lookup.get(bsc_sequence[i])
                star_to = bsc_lookup.get(bsc_sequence[i+1])

                if star_from and star_to:
                    segment_lines.append({
                        'from': {
                            'ra': star_from['ra'], 
                            'dec': star_from['dec'], 
                            # Add more if needed for testing
                            'name': star_from.get('name', 'unknown'),
                            'con': star_from['con'],
                            'mag': star_from['mag'],
                            },
                        'to': {
                            'ra': star_to['ra'], 
                            'dec': star_to['dec'], 
                            # Add more if needed for testing
                            'name': star_to.get('name', 'unknown'),
                            'con': star_to['con'],
                            'mag': star_to['mag'],
                            
                            },
                    })
            if segment_lines:
                constellation_lines.append(segment_lines)
        if constellation_lines:
            processed_constellations[const_abbr] = constellation_lines
    return processed_constellations


if __name__ == "__main__":
    CONSTELLATION_DAT_PATH = "./data/ConstellationLines.dat"
    HYG_DATA_PATH = './assets/hyg_visible.json'
    CONSTELLATION_LINES_SAVE_PATH = './data/constellation_lines_with_mag.json'

    constellation_lines = parse_constellation_lines(CONSTELLATION_DAT_PATH)
    hyg_data = load_hyg_data(HYG_DATA_PATH)
    bsc_lookup_table = create_bsc_lookup(hyg_data)

    final_constellations = process_constellation_lines(constellation_data= constellation_lines, bsc_lookup=bsc_lookup_table)
    print(final_constellations.get('Ori'))
    with open(CONSTELLATION_LINES_SAVE_PATH, 'w') as file:
        json.dump(final_constellations, file, indent = 4)
    print("Saved constellation file to disk! :)")
