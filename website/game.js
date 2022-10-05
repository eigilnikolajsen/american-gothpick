const mainLoop = () => {
    // console.log('loopers')
    let rive = document.querySelector('#game_img_rive');
    let greb = document.querySelector('#game_img_greb');
    let rotRive = gyro.p1.r;
    let rotGreb = gyro.p2.r;
    // if (gyro.z > 0) rot = 180 - gyro.y;
    rive.style.transform = `rotate(${rotRive}deg)`;
    greb.style.transform = `rotate(${rotGreb}deg)`;

    if (animationToggle) {
        window.requestAnimationFrame(mainLoop)
    } else {
        window.cancelAnimationFrame(animationLoop)
    }
}
let animationToggle = false;
let animationLoop;