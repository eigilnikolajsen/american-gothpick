let scenes = {
    loading: true,
    tutorial: false,
    ready: false,
    game: false,
    finished: false,
}

const resetGame = () => {
    console.log('reset game');
}

let timerStarted = false;
let timeUp = false;

const mainLoop = () => {
    //console.log('main loop')

    let curScene;
    let curSceneDOM;

    // run
    for (const scene in scenes) {

        if (!scenes[scene]) {
            document.querySelector(`#${scene}_container`).style.visibility = 'hidden';
            continue;
        }

        curScene = scene;
        curSceneDOM = document.querySelector(`#${curScene}_container`);
        curSceneDOM.style.visibility = 'visible';

    }

    switch (curScene) {

        // If we're on the loading screen
        case 'loading':
            console.log('loading scene');

            let p1TextLoading = curSceneDOM.querySelector('#loading_player1');
            let p2TextLoading = curSceneDOM.querySelector('#loading_player2');

            gyro.p1.t ? p1TextLoading.textContent = 'PLAYER 1 READY' : p1TextLoading.textContent = 'PLAYER 1 WAITING...';
            gyro.p2.t ? p2TextLoading.textContent = 'PLAYER 2 READY' : p2TextLoading.textContent = 'PLAYER 2 WAITING...';

            // completely insane line:
            // if either is true:
            // p1 is starting to press (now is true, prev is false) and p2 is already pressing
            // p2 is starting to press (now is true, prev is false) and p1 is already pressing
            if ((gyro.p1.t && !gyro.p1.tPrev && gyro.p2.t) || (gyro.p2.t && !gyro.p2.tPrev && gyro.p1.t)) {
                scenes.loading = false;
                scenes.tutorial = true;
            }

            break;

            // If we're on the ready screen
        case 'tutorial':
            console.log('turorial scene');

            let p1TextTurorial = curSceneDOM.querySelector('#tutorial_player1');
            let p2TextTurorial = curSceneDOM.querySelector('#tutorial_player2');

            gyro.p1.t ? p1TextTurorial.textContent = 'PLAYER 1 READY' : p1TextTurorial.textContent = 'PLAYER 1 WAITING...';
            gyro.p2.t ? p2TextTurorial.textContent = 'PLAYER 2 READY' : p2TextTurorial.textContent = 'PLAYER 2 WAITING...';

            if (gyro.p1.t && !gyro.p1.tPrev && gyro.p2.t || gyro.p2.t && !gyro.p2.tPrev && gyro.p1.t) {
                scenes.tutorial = false;
                scenes.ready = true;
            }

            break;

            // If we're on the ready screen
        case 'ready':
            console.log('ready scene');

            let p1TextReady = curSceneDOM.querySelector('#ready_player1');
            let p2TextReady = curSceneDOM.querySelector('#ready_player2');

            gyro.p1.t ? p1TextReady.textContent = 'PLAYER 1 READY' : p1TextReady.textContent = 'PLAYER 1 WAITING...';
            gyro.p2.t ? p2TextReady.textContent = 'PLAYER 2 READY' : p2TextReady.textContent = 'PLAYER 2 WAITING...';

            if (gyro.p1.t && !gyro.p1.tPrev && gyro.p2.t || gyro.p2.t && !gyro.p2.tPrev && gyro.p1.t) {
                scenes.ready = false;
                scenes.game = true;
            }

            break;

            // If we're on the game screen
        case 'game':
            console.log('game scene');

            if (!timerStarted) {
                timerStarted = true;
                timerFunction();
            };

            if (timeUp) {
                console.log('game finished');
                console.log(`player 1 score: ${gyro.p1.score}`);
                console.log(`player 2 score: ${gyro.p2.score}`);
                break;
            }

            // console.log('loopers')
            let rive = curSceneDOM.querySelector('#game_rive_container');
            let greb = curSceneDOM.querySelector('#game_greb_container');
            let rotP1 = gyro.p1.r;
            let rotP2 = gyro.p2.r;
            // if (gyro.z > 0) rot = 180 - gyro.y;
            rive.style.transform = `rotate(${rotP1}deg)`;
            greb.style.transform = `rotate(${rotP2}deg)`;

            let cooldown = 500;
            let forDur = 150;
            let backDur = 300;
            let forEase = 'cubicBezier(.7,-0.3,.8,1)';
            let backEase = 'cubicBezier(.2,0,.7,1)';

            // player 1 stikes
            if (gyro.p1.t && !gyro.p1.tPrev && gyro.p1.strike) {
                gyro.p1.strike = false;

                // console log the strike
                console.log('p1 strikes. rotP1: ' + rotP1);

                // P1 strike animation
                anime({
                    targets: '#game_rive',
                    translateY: [
                        { value: '-14vh', duration: forDur, easing: forEase },
                        { value: 0, duration: backDur, easing: backEase },
                    ],
                });

                // check for a hit
                setTimeout(checkForHit, forDur, 1);

                // cooldown
                setTimeout(() => gyro.p1.strike = true, cooldown);

            }

            // player 2 stikes
            if (gyro.p2.t && !gyro.p2.tPrev && gyro.p2.strike) {
                gyro.p2.strike = false;

                // console log the strike
                console.log('p2 strikes. rotP2: ' + rotP2);

                // P2 strike animation
                anime({
                    targets: '#game_greb',
                    translateY: [
                        { value: '-4.6vh', duration: forDur, delay: 0, easing: forEase },
                        { value: 0, duration: backDur, delay: 0, easing: backEase },
                    ],
                });

                // check for a hit
                setTimeout(checkForHit, forDur, 2);

                // cooldown
                setTimeout(() => gyro.p2.strike = true, cooldown);
            }

            break;

            // If we're on the finished screen
        case 'finished':
            console.log('finished scene');

            break;
    }


    gyro.p1.tPrev = gyro.p1.t;
    gyro.p2.tPrev = gyro.p2.t;






    // loop da loop
    if (animationToggle) {
        window.requestAnimationFrame(mainLoop)
    } else {
        window.cancelAnimationFrame(animationLoop)
    }
}
let animationToggle = false;
let animationLoop;

const checkForHit = (pNum) => {
    let strikeMargin = 0.2;
    let strikeP1 = 20;
    let strikeP2 = -19.8;
    switch (pNum) {
        case 1:
            if (gyro.p1.r < strikeP1 + strikeMargin && gyro.p1.r > strikeP1 - strikeMargin) {
                gyro.p1.score += 1;
                console.log('p1 hits! score: ' + gyro.p1.score);
            }
            break;

        case 2:
            if (gyro.p2.r < strikeP2 + strikeMargin && gyro.p2.r > strikeP2 - strikeMargin) {
                gyro.p2.score += 1;
                console.log('p2 hits! score: ' + gyro.p2.score);
            }
            break;
    }

}

const timerFunction = () => {
    var sec = 59;
    var timer = setInterval(() => {
        var timerDOM = document.querySelector('#game_timer')
        timerDOM.textContent = '00:' + sec;
        sec--;
        sec < 11 ? timerDOM.classList.add('timer_low') : timerDOM.classList.remove('timer_low');
        if (sec < 0) {
            timeUp = true;
            clearInterval(timer)
        };
    }, 1000);
}