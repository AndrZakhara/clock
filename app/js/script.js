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

    globalSecondsLapsed = today.getTime()/1000 + (3600 * timeZone);
}

function moveHands(){
    secondHand.style.transform = `rotate(${ONE_DIVISION_DEGREES * globalSecondsLapsed}deg)`;
    minuteHand.style.transform = `rotate(${ONE_DIVISION_DEGREES * globalSecondsLapsed/60}deg)`;
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
        timeZoneChoice.value = i;
        timeZoneChoice.id = i

        choiceContainer.append(timeZoneChoice);
        choiceContainer.append(timeZoneChoiceLabel);
        timeZonesChoiceForm.append(choiceContainer);
    }

    return formContainer;
}





createButtonsForManagingClock();

setClockTimeToCurrent()
clockInterval = setInterval(() => {
    globalSecondsLapsed++;
    moveHands()
}, 1000)

