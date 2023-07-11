import ColaGenerator from "./class/colaGenerator.js";
import VendingMachineEvents from "./class/vendingMachineEvents.js";

const colaGenerator = new ColaGenerator();
const vendingMachineEvents = new VendingMachineEvents();

(async function () {
    await colaGenerator.setup();
    vendingMachineEvents.bindEvent();
})()