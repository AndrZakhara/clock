'use strict';

const ONE_DIVISION_DEGREES = 6
const hourHand = document.querySelector('#hour')
const minuteHand = document.querySelector('#minute')
const secondHand = document.querySelector('#second')

let globalSecondsLapsed;
let clockInterval;
let isPaused = false;

function setClockTimeToCurrent(){
    const today = new Date();
    const timeZone = -today.getTimezoneOffset()/60;
    const timeZoneCheckbox = document.querySelector(`#Utc${timeZone}`);

    timeZoneCheckbox.checked = true;

    globalSecondsLapsed = today.getTime()/1000 + (3600 * timeZone);

    turnOffHandsAnimation()
    moveHands()
    turnOnHandsAnimation()
}

function moveHands(){
    secondHand.style.transform = `rotate(${ONE_DIVISION_DEGREES * globalSecondsLapsed}deg)`;
    minuteHand.style.transform = `rotate(${ONE_DIVISION_DEGREES * Math.floor(globalSecondsLapsed/60)}deg)`;
    hourHand.style.transform = `rotate(${ONE_DIVISION_DEGREES * ((globalSecondsLapsed/3600)*5)}deg)`;

}

function createButtonsForManagingClock() {
    let buttonContainer = document.createElement('div');
    let pauseButton = document.createElement('button');

    buttonContainer.classList.add('button-container');
    pauseButton.classList.add("pause");

    pauseButton.addEventListener('click', (event) => {
        if(isPaused) {
            clockInterval = setInterval(() => {
                globalSecondsLapsed++;
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
    setTimeout(() => {turnOnHandsAnimation()},1)

}

function turnOffHandsAnimation(){
    hourHand.style.transition = 'none'
    minuteHand.style.transition = 'none'
    secondHand.style.transition = 'none'
}

function turnOnHandsAnimation(){
    hourHand.style.transition = 'transform .5s ease-in-out'
    minuteHand.style.transition = 'transform .5s ease-in-out'
    secondHand.style.transition = 'transform .5s ease-in-out'
}

createButtonsForManagingClock();


setClockTimeToCurrent()


clockInterval = setInterval(() => {
    globalSecondsLapsed++;
    moveHands()
}, 1000)

