'use strict';

const ONE_DIVISION_DEGREES = 6
const hourHand = document.querySelector('#hour')
const minuteHand = document.querySelector('#minute')
const secondHand = document.querySelector('#second')

let globalSecondsLapsed = 3589;

function setClockTimeToCurrent(){
    const today = new Date();
    const timeZone = -today.getTimezoneOffset()/60;

    globalSecondsLapsed = today.getTime()/1000 + (3600 * timeZone);
}

function moveHands(){
    secondHand.style.transform = `rotate(${ONE_DIVISION_DEGREES * globalSecondsLapsed}deg)`;
    minuteHand.style.transform = `rotate(${ONE_DIVISION_DEGREES * globalSecondsLapsed/60}deg)`;
    hourHand.style.transform = `rotate(${ONE_DIVISION_DEGREES * ((globalSecondsLapsed/3600)*5)}deg)`;

}

setClockTimeToCurrent()
setInterval(() => {
    globalSecondsLapsed++;
    moveHands()
}, 1000)

