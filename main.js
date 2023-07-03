const express = require('express');
const Govee = require('node-govee-led');

const app = express()

app.use("/", express.static(`${__dirname}/frontend`));
app.use(express.json())

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

const getB = async (dev) => (await dev.getState()).data.properties[2].brightness;
const sbToPc = (sb) => Math.floor(((sb + 8) / 43) * 100);
const sbpcToSB = (sbpc) => Math.floor(((sbpc*43) / 100) - 8);
const getC = async (dev) => (await dev.getState()).data.properties[3].color;
const getP = async (dev) => (await dev.getState()).data.properties[1].powerState;

async function changeLights(dev, reqDev) {
    await dev.setBrightness(parseInt(reqDev.brightness));
    await dev.setColor(reqDev.color);
}

async function getData() {
    const wb = await getB(wand);
    const sb = await getB(schrank);
    const sbPC = sbToPc(sb);

    const valToHex = (c) => {
        const hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    function rgbToHex(rgb) {
        const {r, g, b} = rgb;
        return "#" + valToHex(r) + valToHex(g) + valToHex(b);
    }

    const wc = rgbToHex(await getC(wand));
    const sc = rgbToHex(await getC(schrank));
    const wp = await getP(wand);
    const sp = await getP(schrank);

    return {
        wand: {
            power: wp,
            brightness: wb,
            color: wc
        },
        schrank: {
            power: sp,
            brightness: sb,
            color: sc
        }
    }
}

(async ()=>{
    app.post("/update-lights", async (req, res) => {

        const reqWand = req.body.wand;
        const reqSchrank = req.body.schrank;

        if (!reqWand || !reqSchrank) {
            return res.json(await getData())
        }
        
        if (reqWand.power === "off") {
            await wand.turnOff();
            return res.json(await getData())
        }
        if (reqSchrank.power === "off") {
            await schrank.turnOff();
            return res.json(await getData())
        }

        await changeLights(wand, reqWand); 
        await changeLights(schrank, reqSchrank);

        setTimeout(async()=>{
            const response = await getData(); 
            return res.json(response);
        },1000)
        
    })
})();

app.listen(3000, () => {
    console.log("running on port 3000")
})
