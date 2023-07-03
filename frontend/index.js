async function main() {

    function getVals() {
        return {
            wand: {
                power: document.querySelector("#power").value,
                brightness: document.querySelector("#brightness").value == 0
                ? 1: document.querySelector("#brightness").value,
                color: document.querySelector("#color").value,
            },
            schrank: {
                power: document.querySelector("#power2").value,
                brightness: document.querySelector("#brightness2").value,
                color: document.querySelector("#color2").value,
            }
        }
    }
    
    function setVals(data) {
        document.querySelector("#power").value = data.wand.power;
        document.querySelector("#brightness").value = data.wand.brightness;
        document.querySelector("#color").value = data.wand.color;
        document.querySelector("#power2").value = data.schrank.power;
        document.querySelector("#brightness2").value = data.schrank.brightness;
        document.querySelector("#color2").value = data.schrank.color;
    }

    const startupData = await fetch("/update-lights", {
        method: "POST",
        body: JSON.stringify( {} ),
        headers: {"Content-Type":"application/json"}
    })
    setVals(await startupData.json());

    const sliderW = document.querySelector("#brightness");
    const sliderS = document.querySelector("#brightness2");
    const sliderWval = document.querySelector("#valB")
    const sliderSval = document.querySelector("#valB2")
    sliderW.addEventListener("input", ()=>{
        sliderWval.innerHTML = sliderW.value
    })
    sliderS.addEventListener("input", ()=>{
        sliderSval.innerHTML = sliderS.value
    })

    const powerBtn = document.querySelector("#power");
    powerBtn.addEventListener("click", () => {
        if (powerBtn.value === "on") {
            powerBtn.value = "off"
        } else {
            powerBtn.value = "on";
        }
    })
    const powerBtn2 = document.querySelector("#power2");
    powerBtn2.addEventListener("click", () => {
        if (powerBtn2.value === "on") {
            powerBtn2.value = "off"
        } else {
            powerBtn2.value = "on";
        }
    })

    document.querySelector("#submit").addEventListener("click", async () => {
        const response = await fetch("/update-lights", {
            method: "POST",
            body: JSON.stringify( getVals() ),
            headers: {"Content-Type":"application/json"}
        }) 
        const data = await response.json();
        console.log(data);
        setVals(data);
    })

}

document.addEventListener("DOMContentLoaded", async () => {
    await main();
})
