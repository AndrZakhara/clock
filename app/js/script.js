'use strict';

const ONE_DIVISION_DEGREES = 6
const hourHand = document.querySelector('#hour')
const minuteHand = document.querySelector('#minute')
const secondHand = document.querySelector('#second')

let clockHands = []
clockHands.push(secondHand)
clockHands.push(minuteHand)
clockHands.push(hourHand)

let globalSecondsLapsed;
let clockInterval;
let isPaused = false;

function moveHands() {
    secondHand.style.transform = `rotate(${ONE_DIVISION_DEGREES * globalSecondsLapsed}deg)`;
    minuteHand.style.transform = `rotate(${ONE_DIVISION_DEGREES * Math.floor(globalSecondsLapsed / 60)}deg)`;
    hourHand.style.transform = `rotate(${ONE_DIVISION_DEGREES * (Math.floor(globalSecondsLapsed / 3600) * 5)}deg)`;
}

function turnOffHandsAnimation(){
    for(let i = 0; i < clockHands.length; i++){
        clockHands[i].style.transition = 'none';
    }
}

function turnOnHandsAnimation(){
    for(let i = 0; i < clockHands.length; i++){
        clockHands[i].style.transition = 'transform .5s ease-in-out';
    }
}

function setClockTimeToCurrent(){
    const today = new Date();
    const timeZone = -today.getTimezoneOffset()/60;
    const timeZoneCheckbox = document.querySelector(`#Utc${timeZone}`);

    timeZoneCheckbox.checked = true;

    globalSecondsLapsed = today.getTime()/1000 + (3600 * timeZone);

    turnOffHandsAnimation()
    moveHands()
    setTimeout(turnOnHandsAnimation, 1)
}

function createButtonsForManagingClock() {
    let buttonContainer = document.createElement('div');
    let pauseButton = document.createElement('button');

    buttonContainer.classList.add('button-container');
    pauseButton.classList.add("pause");

    pauseButton.addEventListener('click', (event) => {

        if(isPaused) {
            clockInterval = setInterval(() => {
                globalSecondsLapsed++
                moveHands()
            }, 1000)
            event.target.textContent = "Pause"
            isPaused = false;
        }
        else{
            clearInterval(clockInterval)
            event.target.textContent = "Start"
            isPaused = true;
        }

    })

    pauseButton.textContent = "Pause"

    document.querySelector(".main").append(buttonContainer);
    buttonContainer.append(pauseButton);
    buttonContainer.append(createForm());
}

function createForm(){
    let timeZonesChoiceForm = document.createElement('form');
    let formContainer = document.createElement('div');

    formContainer.classList.add('form-container');
    formContainer.append(timeZonesChoiceForm);

    for(let i = -3; i < 4; i++){
        let choiceContainer = document.createElement('div');
        let timeZoneChoice = document.createElement('input');
        let timeZoneChoiceLabel = document.createElement('label');

        timeZoneChoiceLabel.for = i
        timeZoneChoiceLabel.textContent = `Utc ${i}`;

        timeZoneChoice.type = "checkbox";
        timeZoneChoice.classList.add('time-zone');
        timeZoneChoice.value = String(i);
        timeZoneChoice.id = `Utc${i}`

        choiceContainer.append(timeZoneChoice);
        choiceContainer.append(timeZoneChoiceLabel);
        timeZonesChoiceForm.append(choiceContainer);
    }

    timeZonesChoiceForm.addEventListener('change', (event) => {
        let checkBoxes = timeZonesChoiceForm.querySelectorAll('.time-zone');
        if(event.target.checked) {
            checkBoxes.forEach(checkBox => {
                if (checkBox !== event.target) {
                    checkBox.checked = false
                }
            });
            changeTimeZone(+event.target.value)
        }
        else
            event.target.checked = true
    })

    return formContainer;
}

function changeTimeZone(timeZone){
    const today = new Date();

    globalSecondsLapsed = today.getTime()/1000 + (3600 * timeZone);

    turnOffHandsAnimation()
    moveHands()
    setTimeout(turnOnHandsAnimation,1)
}

function calculateAngle(x,y){
    const svg = document.querySelector('svg');
    const centerX = svg.getBoundingClientRect().left + svg.clientWidth/2;
    const centerY = svg.getBoundingClientRect().top + svg.clientHeight/2;
    let angle = 90 + Math.atan2(y-centerY, x - centerX) * 180/Math.PI;

    if(angle < 0)
        angle = 270 + (90 + angle);

    return  angle
}

function getHandTimeOnClock(hand){
    let handSin = parseFloat(getComputedStyle(hand).transform.slice(7))
    let handCos = parseFloat(getComputedStyle(hand).transform.split(",")[1])
    let handAngle = 90 - (Math.atan2(handSin, handCos) * 180/Math.PI) + 0.1

    if (handAngle < 0)
        handAngle = 270 + (90 + handAngle)

    if(hand.id === "hour"){
        return Math.floor(handAngle * 120/3600) * 3600
    } else if(hand.id === "minute"){
        return Math.floor((handAngle * 10)/60) * 60
    } else{
        return Math.floor(handAngle/6)
    }

}

function dropTheHand(){
    document.onmousemove = null
    document.onmouseup = null
    globalSecondsLapsed = getHandTimeOnClock(secondHand)
        + getHandTimeOnClock(minuteHand) + getHandTimeOnClock(hourHand)
    moveHands()
    setTimeout(turnOnHandsAnimation,1)
}

function grabTheHand(hand, event){
    if(!isPaused) return

    turnOffHandsAnimation()
    hand.style.transform = `rotate(${calculateAngle(event.clientX, event.clientY)}deg)`;

    document.onmousemove = function(event)  {
        hand.style.transform = `rotate(${calculateAngle(event.clientX, event.clientY)}deg)`;
    }

    document.onmouseup = () => {
        dropTheHand()
    }
}

document.addEventListener('mousedown', (event) => {
    if(clockHands.includes(event.target.parentNode))
        grabTheHand(event.target.parentNode, event);
});

createButtonsForManagingClock();

setClockTimeToCurrent()

clockInterval = setInterval(() => {
    globalSecondsLapsed++
    moveHands()
}, 1000)

