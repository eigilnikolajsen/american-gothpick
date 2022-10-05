if ("serial" in navigator) {
    console.log('serial exists')
}

let gyro = {
    p1: {
        y: 0,
        p: 0,
        r: 0,
        t: false,
        s: true,
    },
    p2: {
        y: 0,
        p: 0,
        r: 0,
        t: false,
        s: true,
    },
}

const getGyroVariables = (val) => {
    let valSplit = val.split('%');
    if (valSplit.length != 8) return;

    // player 1 (p1)
    gyro.p1.p = valSplit[0];
    gyro.p1.r = valSplit[1];
    gyro.p1.y = valSplit[2];
    valSplit[3].includes('1T') ? gyro.p1.t = true : gyro.p1.t = false;

    // player 2 (p2)
    gyro.p2.p = valSplit[4];
    gyro.p2.r = valSplit[5];
    gyro.p2.y = valSplit[6];
    valSplit[7].includes('2T') ? gyro.p2.t = true : gyro.p2.t = false;

    let gyroOutput = `player 1: yaw: ${gyro.p1.y}, pitch: ${gyro.p1.p}, roll: ${gyro.p1.r}, button: ${gyro.p1.t}. player 2: yaw: ${gyro.p2.y}, pitch: ${gyro.p2.p}, roll: ${gyro.p2.r}, button: ${gyro.p2.t}.`;
    //console.log(gyroOutput);
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

        // print out values to the console
        console.log(valuePrint.split('%'));

        // Reset valuePrint before next loop
        valuePrint = '';
    }
});