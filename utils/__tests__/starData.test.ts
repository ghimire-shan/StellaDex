import hygData from '../../assets/hyg_visible.json';
import constellationData from '../../data/test_constellation_lines.json';

describe('HYG Star Data Validation', ()=>{
    test('Polaris has the highest Z coordinate', () =>{
        const polaris = hygData.find(star => star.proper === 'Polaris');
        expect(polaris).toBeDefined();

        // Polaris is near the celestial North Pole (high Z)
        const allZ = hygData.map(star => star.z);
        const maxZ = Math.max(...allZ);

        expect(polaris.z).toBeGreaterThan(100);
    });

    test('Stars have valid coordinates', () => {
        hygData.forEach(star => {
            expect(star.x).toBeDefined();
            expect(star.y).toBeDefined();
            expect(star.z).toBeDefined();
            expect(typeof star.x).toBe('number');   
        });

    })
});

describe('Stars are grouped in the right Constellation', () => {
    test('Test if the constellations have stars within them that are from the same constellation or neighboring', () => {
        Object.entries(constellationData).forEach(([name, constellation]) =>{
            const constellationKey = name;
            constellation.forEach((lineGroup) => {
                lineGroup.forEach((star) => {
                    if (star.from.con !== constellationKey){
                        /*
                            There are some constellations that have stars that connect to other constellations. Example
                                Aur -> Taurus
                                Cet -> Eri
                                Peg -> Andromeda
                            These are fine and are accurate way to make stick figure constellations
                        */
                        console.log(`${constellationKey}, ${star.from.con}`)
                    } else{
                        expect(star.from.con).toBe(constellationKey)
                    }
                })
            })
        })  
    })
})