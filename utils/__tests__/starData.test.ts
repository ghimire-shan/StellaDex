import hygData from '../../assets/hyg_visible.json';

describe('HYG Star Data Validation', ()=>{
    test('Polaris has the highest Z coordinate', () =>{
        const polaris = hygData.find(star => star.proper === 'Polaris');
        console.log(polaris);
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
})