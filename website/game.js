let scenes = {
    loading: false,
    ready: false,
    game: true,
    finished: false,
}

const resetGame = () => {
    console.log('reset game');
}

const mainLoop = () => {

    let curSceneDOM;

    // run
    for (const scene in scenes) {

        if (!scenes[scene]) {
            document.querySelector(`#${scene}_container`).style.visibility = 'hidden';
            continue;
        }

        curSceneDOM = document.querySelector(`#${scene}_container`);
        curSceneDOM.style.visibility = 'visible';

        switch (scene) {

            // If we're on the loading screen
            case 'loading':

                let p1Text = curSceneDOM.querySelector('#game_loading_player1');
                let p2Text = curSceneDOM.querySelector('#game_loading_player2');

                gyro.p1.t ? p1Text.textContent = 'PLAYER 1 READY' : p1Text.textContent = 'PLAYER 1 WAITING...';
                gyro.p2.t ? p2Text.textContent = 'PLAYER 2 READY' : p2Text.textContent = 'PLAYER 2 WAITING...';

                break;

                // If we're on the ready screen
            case 'ready':

                // give some animation classes

                break;

                // If we're on the game screen
            case 'game':

                // console.log('loopers')
                let rive = curSceneDOM.querySelector('#game_rive_container');
                let greb = curSceneDOM.querySelector('#game_greb_container');
                let rotRive = gyro.p1.r;
                let rotGreb = gyro.p2.r;
                // if (gyro.z > 0) rot = 180 - gyro.y;
                rive.style.transform = `rotate(${rotRive}deg)`;
                greb.style.transform = `rotate(${rotGreb}deg)`;

                let cooldown = 400;
                if (gyro.p1.t && gyro.p1.s) {
                    gyro.p1.s = false;

                    // P1 strike animation
                    anime({
                        targets: '#game_rive',
                        translateY: [
                            { value: '-10vh', duration: 150, delay: 0, easing: 'cubicBezier(.7,-0.3,.8,1)' },
                            { value: 0, duration: 300, delay: 0, easing: 'cubicBezier(.2,0,.7,1)' },
                        ],
                    });

                    setTimeout(() => gyro.p1.s = true, cooldown);
                }
                if (gyro.p2.t && gyro.p2.s) {
                    gyro.p2.s = false;

                    // P2 strike animation
                    anime({
                        targets: '#game_greb',
                        translateY: [
                            { value: '-10vh', duration: 150, delay: 0, easing: 'cubicBezier(.7,-0.3,.8,1)' },
                            { value: 0, duration: 300, delay: 0, easing: 'cubicBezier(.2,0,.7,1)' },
                        ],
                    });

                    setTimeout(() => gyro.p2.s = true, cooldown);
                }

                break;

                // If we're on the finished screen
            case 'finished':

                break;
        }
    }






    // loop da loop
    if (animationToggle) {
        window.requestAnimationFrame(mainLoop)
    } else {
        window.cancelAnimationFrame(animationLoop)
    }
}
let animationToggle = false;
let animationLoop;