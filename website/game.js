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

            timerFunction();

            // console.log('loopers')
            let rive = curSceneDOM.querySelector('#game_rive_container');
            let greb = curSceneDOM.querySelector('#game_greb_container');
            let rotRive = gyro.p1.r;
            let rotGreb = gyro.p2.r;
            // if (gyro.z > 0) rot = 180 - gyro.y;
            rive.style.transform = `rotate(${rotRive}deg)`;
            greb.style.transform = `rotate(${rotGreb}deg)`;

            let cooldown = 500;
            if (gyro.p1.t && !gyro.p1.tPrev && gyro.p1.strike) {
                gyro.p1.strike = false;

                // P1 strike animation
                anime({
                    targets: '#game_rive',
                    translateY: [
                        { value: '-14vh', duration: 150, delay: 0, easing: 'cubicBezier(.7,-0.3,.8,1)' },
                        { value: 0, duration: 300, delay: 0, easing: 'cubicBezier(.2,0,.7,1)' },
                    ],
                });

                setTimeout(() => gyro.p1.strike = true, cooldown);
            }
            if (gyro.p2.t && !gyro.p2.tPrev && gyro.p2.strike) {
                gyro.p2.strike = false;

                // P2 strike animation
                anime({
                    targets: '#game_greb',
                    translateY: [
                        { value: '-4.6vh', duration: 150, delay: 0, easing: 'cubicBezier(.7,-0.3,.8,1)' },
                        { value: 0, duration: 300, delay: 0, easing: 'cubicBezier(.2,0,.7,1)' },
                    ],
                });

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


const timerFunction = () => {
    var sec = 30;
    var timer = setInterval(() => {
        var timerDOM = document.querySelector('#game_timer')
        timerDOM.textContent = '00:' + sec;
        sec--;
        sec < 11 ? timerDOM.classList.add('timer_low') : timerDOM.classList.remove('timer_low');
        if (sec < 0) clearInterval(timer);
    }, 1000);
}