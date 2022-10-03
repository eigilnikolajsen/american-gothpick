if ("serial" in navigator) {
    console.log('serial exists')
}

let gyro = {
    x: 0,
    y: 0,
    z: 0,
    p1: false,
    p2: false,
}

const getGyroVariables = (val) => {
    let valSplit = val.split(' ');
    if (valSplit.length != 8) return;
    console.log(valSplit)
    gyro.x = valSplit[1];
    gyro.y = valSplit[3];
    gyro.z = valSplit[5];
    valSplit[6].includes('1T') ? gyro.p1 = true : gyro.p1 = false;
    valSplit[7].includes('2T') ? gyro.p2 = true : gyro.p2 = false;
}

document.querySelector('#serial_check').addEventListener('click', async() => {

    // Filter on devices with the Arduino Uno USB Vendor/Product IDs.
    const filters = [
        { usbVendorId: 0x2341, usbProductId: 0x0043 },
        { usbVendorId: 0x2341, usbProductId: 0x0001 }
    ];

    // Prompt user to select an Arduino Uno device.
    const port = await navigator.serial.requestPort({ filters });

    // Wait for the serial port to open.
    await port.open({ baudRate: 115200 });

    // Decode the stream
    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable.getReader();

    // Start the main animation loop
    animationToggle = true;
    animationLoop = window.requestAnimationFrame(mainLoop);

    // Listen to data coming from the serial device.
    let valuePrint = '';
    while (true) {
        const { value, done } = await reader.read();
        if (done) {
            // Allow the serial port to be closed later.
            reader.releaseLock();
            break;
        }
        // Value is a string.
        // Fill valuePrint with value
        valuePrint += value;

        // Check if value contains a linebreak
        // If it does not; continue
        // If it does; set valuePrint equal to everything before the linebreak
        let lb = '\r\n'
        if (!valuePrint.includes(lb)) continue;
        valuePrint = valuePrint.split(lb)[0];
        getGyroVariables(valuePrint);

        // Reset valuePrint before next loop
        valuePrint = '';
    }
});


const mainLoop = () => {
    console.log('loopers')
    let greb = document.querySelector('#game_img_greb');
    greb.style.transform = `rotate(${gyro.y}deg)`;

    if (animationToggle) {
        window.requestAnimationFrame(mainLoop)
    } else {
        window.cancelAnimationFrame(animationLoop)
    }
}
let animationToggle = false;
let animationLoop;