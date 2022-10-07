let scenes = {
    loading: true,
    tutorial1: false,
    tutorial2: false,
    ready: false,
    game: false,
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

    timerStarted = false;
    timeUp = false;
    readyScenePlayed = false;

    scenes.game = false;
    scenes.loading = true;
    animationToggle = true;
    animationLoop = window.requestAnimationFrame(mainLoop);
}


// main code loop
let timerStarted = false;
let timeUp = false;
let readyScenePlayed = false;
const fps = 10;

function mainLoop(t) {

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

            // start audio
            if (sfx.loading.music.paused || !sfx.loading.music.currentTime) {
                sfx.loading.music.loop = true;
                sfx.loading.music.volume = 0.3;
                sfx.loading.music.play();
            }

            // if (gyro.p1.t && !gyro.p1.tPrev) {
            //     if (sfx.button.player1.paused || !sfx.button.player1.currentTime) {
            //         sfx.button.player1.play();
            //     }
            // }

            // if (gyro.p2.t && !gyro.p2.tPrev) {
            //     if (sfx.button.player2.paused || !sfx.button.player2.currentTime) {
            //         sfx.button.player2.play();
            //     }
            // }



            let p1TextLoading = curSceneDOM.querySelector('#loading_player1');
            let p1TextLoading2 = curSceneDOM.querySelector('#loading_player12');
            let p2TextLoading = curSceneDOM.querySelector('#loading_player2');
            let p2TextLoading2 = curSceneDOM.querySelector('#loading_player22');

            gyro.p1.t ? p1TextLoading.textContent = 'PLAYER 1 READY' : p1TextLoading.textContent = 'PLAYER 1 WAITING...';
            gyro.p1.t ? p1TextLoading2.textContent = 'PLAYER 1 READY' : p1TextLoading2.textContent = 'PLAYER 1 WAITING...';
            gyro.p2.t ? p2TextLoading.textContent = 'PLAYER 2 READY' : p2TextLoading.textContent = 'PLAYER 2 WAITING...';
            gyro.p2.t ? p2TextLoading2.textContent = 'PLAYER 2 READY' : p2TextLoading2.textContent = 'PLAYER 2 WAITING...';

            // completely insane line:
            // if either is true:
            // p1 is starting to press (now is true, prev is false) and p2 is already pressing
            // p2 is starting to press (now is true, prev is false) and p1 is already pressing
            if ((gyro.p1.t && !gyro.p1.tPrev && gyro.p2.t) || (gyro.p2.t && !gyro.p2.tPrev && gyro.p1.t)) {
                scenes.loading = false;
                scenes.tutorial1 = true;
            }

            break;







            ///////////////////////////////////////////////////////////////////////////////////////////////////
            ////                                      TUTORIAL SCENES                                      ////
            ///////////////////////////////////////////////////////////////////////////////////////////////////
        case 'tutorial1':
            console.log('turorial1 scene');

            let p1TextTurorial1 = curSceneDOM.querySelector('#tutorial1_player1');
            let p1TextTurorial12 = curSceneDOM.querySelector('#tutorial1_player12');
            let p2TextTurorial1 = curSceneDOM.querySelector('#tutorial1_player2');
            let p2TextTurorial12 = curSceneDOM.querySelector('#tutorial1_player22');

            gyro.p1.t ? p1TextTurorial1.textContent = 'PLAYER 1 READY' : p1TextTurorial1.textContent = 'PLAYER 1 WAITING...';
            gyro.p1.t ? p1TextTurorial12.textContent = 'PLAYER 1 READY' : p1TextTurorial12.textContent = 'PLAYER 1 WAITING...';
            gyro.p2.t ? p2TextTurorial1.textContent = 'PLAYER 2 READY' : p2TextTurorial1.textContent = 'PLAYER 2 WAITING...';
            gyro.p2.t ? p2TextTurorial12.textContent = 'PLAYER 2 READY' : p2TextTurorial12.textContent = 'PLAYER 2 WAITING...';

            if (gyro.p1.t && !gyro.p1.tPrev && gyro.p2.t || gyro.p2.t && !gyro.p2.tPrev && gyro.p1.t) {
                scenes.tutorial1 = false;
                scenes.tutorial2 = true;
            }

            break;

        case 'tutorial2':
            console.log('turorial2 scene');

            let p1TextTurorial2 = curSceneDOM.querySelector('#tutorial2_player1');
            let p1TextTurorial22 = curSceneDOM.querySelector('#tutorial2_player12');
            let p2TextTurorial2 = curSceneDOM.querySelector('#tutorial2_player2');
            let p2TextTurorial22 = curSceneDOM.querySelector('#tutorial2_player22');

            gyro.p1.t ? p1TextTurorial2.textContent = 'PLAYER 1 READY' : p1TextTurorial2.textContent = 'PLAYER 1 WAITING...';
            gyro.p1.t ? p1TextTurorial22.textContent = 'PLAYER 1 READY' : p1TextTurorial22.textContent = 'PLAYER 1 WAITING...';
            gyro.p2.t ? p2TextTurorial2.textContent = 'PLAYER 2 READY' : p2TextTurorial2.textContent = 'PLAYER 2 WAITING...';
            gyro.p2.t ? p2TextTurorial22.textContent = 'PLAYER 2 READY' : p2TextTurorial22.textContent = 'PLAYER 2 WAITING...';

            if (gyro.p1.t && !gyro.p1.tPrev && gyro.p2.t || gyro.p2.t && !gyro.p2.tPrev && gyro.p1.t) {
                scenes.tutorial2 = false;
                scenes.ready = true;
            }

            break;








            ///////////////////////////////////////////////////////////////////////////////////////////////////
            ////                                        READY SCENE                                        ////
            ///////////////////////////////////////////////////////////////////////////////////////////////////
        case 'ready':
            console.log('ready scene');

            // start audio, pause previous one
            if (sfx.game.music.paused || !sfx.game.music.currentTime) {
                sfx.loading.music.pause();
                sfx.game.music.volume = 0.3;
                sfx.game.music.play();
            }

            ani.player1.tick(t);
            ani.vsSign.tick(t);
            ani.player2.tick(t);
            ani.sign3.tick(t);
            ani.sign2.tick(t);
            ani.sign1.tick(t);

            setTimeout(() => {
                scenes.ready = false;
                scenes.game = true;
            }, 7000); // set back to 7000

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
                animationToggle = false;

                // check who won
                let winPlayer = document.querySelector('#game_win_player');
                if (gyro.p1.score > gyro.p2.score) {
                    winPlayer.textContent = 'player 1';
                }
                if (gyro.p2.score > gyro.p1.score) {
                    winPlayer.textContent = 'player 2';
                }
                if (gyro.p2.score == gyro.p1.score) {
                    winPlayer.textContent = 'nobody';
                }

                // animate win container
                anime({
                    targets: '#game_win_container',
                    opacity: 1,
                    scale: [
                        { value: 1.5, duration: 0 },
                        { value: 1, duration: 1000, delay: 0 },
                    ],
                    easing: 'steps(12)',
                    duration: 1000,
                });

                // play sound
                sfx.game.win.play();

                // reset game
                // setTimeout(() => {
                //     resetGame();
                // }, 10000);

                break;
            }



            //////////////////////////////////////// CONTROL WEAPONS ////////////////////////////////////////

            // control the rotation of weapons
            let rive = curSceneDOM.querySelector('#game_rive_container');
            let greb = curSceneDOM.querySelector('#game_greb_container');
            let rotP1 = gyro.p1.y;
            let rotP2 = gyro.p2.y;
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
    }


    gyro.p1.tPrev = gyro.p1.t;
    gyro.p2.tPrev = gyro.p2.t;

    // loop da loop
    if (animationToggle) {
        setTimeout(() => {
            animationLoop = window.requestAnimationFrame(mainLoop);
        }, 1000 / fps);
    } else {
        window.cancelAnimationFrame(animationLoop)
    }
}
let animationToggle = false;
let animationLoop;

const checkForHit = (pNum) => {
    let strikeMargin = 1;
    let strikeP1 = 43;
    let strikeP2 = -19.8;
    let forDur = 150;
    let backDur = 300;
    forEase = 'steps(2)';
    backEase = 'steps(3)';
    switch (pNum) {
        case 1:
            // if you strike within a certain angle, you hit
            if (gyro.p1.y < strikeP1 + strikeMargin && gyro.p1.y > strikeP1 - strikeMargin) {

                // score +1
                gyro.p1.score += 1;
                console.log('p1 hits! score: ' + gyro.p1.score);

                // update score in ui
                let points = document.querySelector("#game_ui_player1_score");
                let pointsStr = ' points';
                points.textContent = gyro.p1.score + pointsStr;

                // play sound
                sfx.game.player2.ugh.play();

                // play animation
                anime({
                    targets: '#game_player2_head',
                    rotate: [
                        { value: 30, duration: forDur, easing: forEase },
                        { value: 0, duration: backDur, easing: backEase },
                    ],
                });
            }
            break;

        case 2:
            // if you strike within a certain angle, you hit
            if (gyro.p2.y < strikeP2 + strikeMargin && gyro.p2.y > strikeP2 - strikeMargin) {

                // score +1
                gyro.p2.score += 1;
                console.log('p2 hits! score: ' + gyro.p2.score);

                // update score in ui
                let points = document.querySelector("#game_ui_player2_score");
                let pointsStr = ' points';
                points.textContent = gyro.p2.score + pointsStr;

                // play sound
                sfx.game.player1.ugh.play();

                // play animation
                anime({
                    targets: '#game_player1_head',
                    rotate: [
                        { value: -30, duration: forDur, easing: forEase },
                        { value: 0, duration: backDur, easing: backEase },
                    ],
                });
            }
            break;
    }
}

const strikeAnimation = (pNum) => {
    let forDur = 150;
    let backDur = 300;
    let forEase = 'cubicBezier(.7,-0.3,.8,1)';
    let backEase = 'cubicBezier(.2,0,.7,1)';
    forEase = 'steps(2)';
    backEase = 'steps(3)';
    switch (pNum) {
        case 1:

            // play sound
            sfx.game.player1.eject.play();

            // animate weapon
            anime({
                targets: '#game_rive',
                translateY: [
                    { value: '-5.2vh', duration: forDur, easing: forEase },
                    { value: 0, duration: backDur, easing: backEase },
                ],
            });

            break;

        case 2:

            // play sound
            sfx.game.player2.eject.volume = 0.5;
            sfx.game.player2.eject.play();

            // animate weapon
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
    var sec = 29; // set back to 29
    var timer = setInterval(() => {
        var timerDOM = document.querySelector('#game_ui_timer')

        timerDOM.textContent = '00:' + sec;

        if (sec < 10) timerDOM.textContent = '00:0' + sec;
        if (sec < 11) {
            timerDOM.classList.add('timer_low');
        } else {
            timerDOM.classList.remove('timer_low');
        }

        sec--;

        if (sec < 0) {
            timeUp = true;
            clearInterval(timer)
        };
    }, 1000);
}



let fade = 'cubicBezier(.2,.6,.2,.7)';
const ani = {
    player1: anime({
        targets: '#ready_player1_container',
        opacity: [
            { value: 0, duration: 0, easing: 'linear' },
            { value: 1, duration: 1500, easing: fade },
        ],
        translateX: [
            { value: '-15vh', duration: 0, easing: 'linear' },
            { value: 0, duration: 7000, easing: fade },
        ],
        autoplay: false,
    }),
    vsSign: anime({
        targets: '#ready_vs',
        opacity: [
            { value: 0, duration: 0, easing: 'linear' },
            { value: 1, duration: 1500, easing: fade, delay: 1000 },
            { value: 0, duration: 100, easing: fade, delay: 1500 },
        ],
        translateY: [
            { value: '-7vh', duration: 0, easing: 'linear' },
            { value: '1vh', duration: 6000, easing: fade, delay: 750 },
        ],
        autoplay: false,
    }),
    player2: anime({
        targets: '#ready_player2_container',
        opacity: [
            { value: 0, duration: 0, easing: 'linear' },
            { value: 1, duration: 1500, easing: fade, delay: 2000 },
        ],
        translateX: [
            { value: '15vh', duration: 0, easing: 'linear' },
            { value: 0, duration: 6000, easing: fade, delay: 2000 },
        ],
        autoplay: false,
    }),
    sign3: anime({
        targets: '#ready_3',
        opacity: [
            { value: 0, duration: 0, easing: 'linear' },
            { value: 1, duration: 200, easing: fade, delay: 4000 },
            { value: 0, duration: 200, easing: fade, delay: 800 },
        ],
        scale: [
            { value: 1.5, duration: 0, easing: 'linear' },
            { value: 1, duration: 1000, easing: fade, delay: 4000 },
        ],
        autoplay: false,
    }),
    sign2: anime({
        targets: '#ready_2',
        opacity: [
            { value: 0, duration: 0, easing: 'linear' },
            { value: 1, duration: 200, easing: fade, delay: 5000 },
            { value: 0, duration: 200, easing: fade, delay: 800 },
        ],
        scale: [
            { value: 1.5, duration: 0, easing: 'linear' },
            { value: 1, duration: 1000, easing: fade, delay: 5000 },
        ],
        autoplay: false,
    }),
    sign1: anime({
        targets: '#ready_1',
        opacity: [
            { value: 0, duration: 0, easing: 'linear' },
            { value: 1, duration: 200, easing: fade, delay: 6000 },
            { value: 0, duration: 200, easing: fade, delay: 800 },
        ],
        scale: [
            { value: 1.5, duration: 0, easing: 'linear' },
            { value: 1, duration: 1000, easing: fade, delay: 6000 },
        ],
        autoplay: false,
    }),
}
const sfx = {
    loading: {
        music: document.querySelector('#sfx_loading_music'),
    },
    game: {
        music: document.querySelector('#sfx_game_music'),
        win: document.querySelector('#sfx_game_win'),
        player1: {
            eject: document.querySelector('#sfx_game_player1_eject'),
            ugh: document.querySelector('#sfx_game_player1_ugh'),
        },
        player2: {
            eject: document.querySelector('#sfx_game_player2_eject'),
            ugh: document.querySelector('#sfx_game_player2_ugh'),
        },
    },
    button: {
        player1: document.querySelector('#sfx_button_player1'),
        player2: document.querySelector('#sfx_button_player2'),
    },
}