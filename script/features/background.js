/**
 * @param {number} hours
 * @description sets background by hours
 */
export function setBackgroundFrom(hours) {
    const dayQuarter = Math.floor(hours / 6) + 1;
    // document.body.style.backgroundImage = `url(https://github.com/digitalSector47/traineeship-test-task/images/0${dayQuarter}.jpg)`;
    document.body.style.backgroundImage = `url(https://raw.githubusercontent.com/digitalSector47/traineeship-test-task/refs/heads/main/images/0${dayQuarter}.jpg)`;
}