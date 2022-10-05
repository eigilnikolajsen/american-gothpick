let scenes = {
    loading: true,
    tutorial: false,
    ready: false,
    game: false,
    finished: false,
}

const resetGame = () => {
    console.log('reset game');

    gyro = {
        p1: {
            y: 0,
            p: 0,
            r: 0,
            t: false,
            tPrev: false,
            strike: true,
            score: 0,
        },
        p2: {
            y: 0,
            p: 0,
            r: 0,
            t: false,
            tPrev: false,
            strike: true,
            score: 0,
        },
    }
}


// main code loop
let timerStarted = false;
let timeUp = false;
const mainLoop = () => {

    // hide vs show parents of the scenes in the DOM
    let curScene;
    let curSceneDOM;
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

        ///////////////////////////////////////////////////////////////////////////////////////////////////
        ////                                       LOADING SCENE                                       ////
        ///////////////////////////////////////////////////////////////////////////////////////////////////
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







            ///////////////////////////////////////////////////////////////////////////////////////////////////
            ////                                      TUTORIAL SCENE                                       ////
            ///////////////////////////////////////////////////////////////////////////////////////////////////
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








            ///////////////////////////////////////////////////////////////////////////////////////////////////
            ////                                        READY SCENE                                        ////
            ///////////////////////////////////////////////////////////////////////////////////////////////////
        case 'ready':
            console.log('ready scene');

            let p1TextReady = curSceneDOM.querySelector('#ready_text1_player1');
            let p2TextReady = curSceneDOM.querySelector('#ready_text2_player2');

            gyro.p1.t ? p1TextReady.textContent = 'READY!' : p1TextReady.textContent = 'WAITING...';
            gyro.p2.t ? p2TextReady.textContent = 'READY!' : p2TextReady.textContent = 'WAITING...';

            if (gyro.p1.t && !gyro.p1.tPrev && gyro.p2.t || gyro.p2.t && !gyro.p2.tPrev && gyro.p1.t) {
                scenes.ready = false;
                scenes.game = true;
            }

            break;








            ///////////////////////////////////////////////////////////////////////////////////////////////////
            ////                                        GAME SCENE                                         ////
            ///////////////////////////////////////////////////////////////////////////////////////////////////
        case 'game':
            console.log('game scene');




            //////////////////////////////////////// CONTROL TIME ////////////////////////////////////////

            // start timer
            if (!timerStarted) {
                timerStarted = true;
                timerFunction();
            };

            // if time runs out
            if (timeUp) {
                console.log('game finished');
                console.log(`player 1 score: ${gyro.p1.score}`);
                console.log(`player 2 score: ${gyro.p2.score}`);
                break;
            }



            //////////////////////////////////////// CONTROL WEAPONS ////////////////////////////////////////

            // control the rotation of weapons
            let rive = curSceneDOM.querySelector('#game_rive_container');
            let greb = curSceneDOM.querySelector('#game_greb_container');
            let rotP1 = gyro.p1.r;
            let rotP2 = gyro.p2.r;
            // if (gyro.z > 0) rot = 180 - gyro.y;
            rive.style.transform = `rotate(${rotP1}deg)`;
            greb.style.transform = `rotate(${rotP2}deg)`;




            //////////////////////////////////////// CONTROL STRIKES ////////////////////////////////////////

            // don't allow players to strike unless 'cooldown'
            // has passed since last strike
            let cooldown = 500;
            let forDur = 150;

            // player 1 stikes
            if (gyro.p1.t && !gyro.p1.tPrev && gyro.p1.strike) {
                gyro.p1.strike = false;

                // console log the strike
                console.log('p1 strikes. rotP1: ' + rotP1);

                // P1 strike animation
                strikeAnimation(1);

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
                strikeAnimation(2);

                // check for a hit
                setTimeout(checkForHit, forDur, 2);

                // cooldown
                setTimeout(() => gyro.p2.strike = true, cooldown);
            }

            break;






            ///////////////////////////////////////////////////////////////////////////////////////////////////
            ////                                      FINISHED SCENE                                       ////
            ///////////////////////////////////////////////////////////////////////////////////////////////////
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

const strikeAnimation = (pNum) => {
    let forDur = 150;
    let backDur = 300;
    let forEase = 'cubicBezier(.7,-0.3,.8,1)';
    let backEase = 'cubicBezier(.2,0,.7,1)';
    switch (pNum) {
        case 1:
            anime({
                targets: '#game_rive',
                translateY: [
                    { value: '-14vh', duration: forDur, easing: forEase },
                    { value: 0, duration: backDur, easing: backEase },
                ],
            });
            break;

        case 2:
            anime({
                targets: '#game_greb',
                translateY: [
                    { value: '-4.6vh', duration: forDur, delay: 0, easing: forEase },
                    { value: 0, duration: backDur, delay: 0, easing: backEase },
                ],
            });
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