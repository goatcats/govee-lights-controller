const Govee = require('node-govee-led');

    const schrank = new Govee({
        apiKey: "614f41d4-204d-404c-980a-9ae395653d1a",
        mac: "25:D2:A4:C1:38:70:1A:FB",
        model: "H6144",
    });

    const wand = new Govee({
        apiKey: "614f41d4-204d-404c-980a-9ae395653d1a",
        mac: "D0:E2:C4:39:32:35:30:49",
        model: "H6061",
    });


(async function main() {
    const getWB = async (wand) => (await wand.getState()).data.properties[2].brightness;
    const getSB = async (schrank) => (await schrank.getState()).data.properties[2].brightness;
    const sbToPc = (sb) => Math.floor(((sb + 8) / 43) * 100);
    const sbpcToSB = (sbpc) => Math.floor(((sbpc*43) / 100) - 8);
    
})();

