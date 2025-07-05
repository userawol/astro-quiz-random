window.onload = initQuiz;

let i = 0;
let correctAns = 0;
const numPerQ = 5;
let correctAnswers = []; // pre-generated random answers

function initQuiz() {
    const ul = document.getElementsByTagName('ul')[0];
    const li = ul.getElementsByTagName('li');

    // precompute random correct answer for each question
    for (let j = 0; j < li.length; j++) {
        const btn = li[j].getElementsByTagName('button');
        const randomIndex = Math.floor(Math.random() * btn.length);
        correctAnswers.push(randomIndex);
    }

    showQ();
}

function showQ() {
    const ul = document.getElementsByTagName('ul')[0];
    const li = ul.getElementsByTagName('li');

    for (let j = 0; j < li.length; j++) {
        const currentLi = li[j];
        if (i === j) {
            currentLi.style.display = 'block';
            const btn = currentLi.getElementsByTagName('button');

            for (let k = 0; k < btn.length; k++) {
                if (k === correctAnswers[i]) {
                    btn[k].setAttribute('answer', true);
                } else {
                    btn[k].setAttribute('answer', false);
                }

                btn[k].disabled = false;
                btn[k].className = '';
                btn[k].setAttribute('onClick', "clickAns(" + i + ", this)");
            }

        } else {
            currentLi.style.display = 'none';
        }
    }

    document.getElementsByClassName('total-q')[0].innerHTML = (i + 1) + "/" + li.length;
    document.getElementsByClassName('progress-bar')[0].style.width = ((i) / li.length) * 100 + '%';

    if (i === li.length - 1) {
        i = 0;
        document.getElementById("showQ").style.display = 'none';
        document.getElementById("result").style.display = 'block';
        document.getElementsByClassName('timeout')[0].setAttribute('show-result', 'true');
    } else {
        i++;
    }

    document.getElementById("showQ").disabled = true;
    document.getElementsByClassName('timeout')[0].setAttribute('data-remain', 20);
}

// Timer
setInterval(function () {
    const dataContainer = document.getElementsByClassName('timeout')[0];
    let getData = dataContainer.getAttribute('data-remain');
    const showResult = dataContainer.getAttribute('show-result');

    if (getData >= 0) {
        try {
            document.querySelector('.timeout span').innerHTML = getData;
        } catch { }
        getData--;
        dataContainer.setAttribute('data-remain', getData);
    } else {
        if (showResult === 'true') {
            document.getElementById('result').click();
        } else {
            showQ();
        }
    }
}, 1000);

function clickAns(i, e) {
    const ul = document.getElementsByTagName('ul')[0];
    const li = ul.getElementsByTagName('li');
    const btn = li[i].getElementsByTagName('button');

    const v = e.getAttribute('answer');

    for (let j = 0; j < btn.length; j++) {
        btn[j].disabled = true;

        if (btn[j] === e) {
            if (v === 'true') {
                e.className = 'correct';
                result(false); // increment correct
            } else {
                e.className = 'wrong';

                // show correct one
                for (let k = 0; k < btn.length; k++) {
                    if (btn[k].getAttribute('answer') === 'true') {
                        btn[k].className = 'correct';
                    }
                }
            }
        }
    }

    document.getElementById("showQ").disabled = false;
}

// Final result
function result(showAns) {
    const ul = document.getElementsByTagName('ul')[0];
    const li = ul.getElementsByTagName('li');

    if (!showAns) {
        // Increment correct count when answering
        correctAns++;
    } else {
        const totalQuestions = li.length;
        const totalPoints = totalQuestions * numPerQ;
        const achievedPoints = correctAns * numPerQ;

        const percentage = Math.round((achievedPoints / totalPoints) * 100);

        let feedback = '';

        if (percentage === 100) {
            feedback = 'Business start kr bhai tu💀';
        } else if (percentage >= 70) {
            feedback = 'myyyy the Stars are aligned!';
        } else if (percentage >= 40) {
            feedback = 'Mercury retrograde? Could be better.';
        } else {
            feedback = 'you are in your shani era🫡';
        }

        document.getElementsByClassName('timeout')[0].innerHTML =
            `Result: <b>${achievedPoints}/${totalPoints}</b> (${percentage}%) <br>${feedback}`;

        document.getElementsByClassName('progress-bar')[0].style.width = 'calc(100% - 3px)';
    }
}
