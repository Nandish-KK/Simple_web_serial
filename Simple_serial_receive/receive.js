document.getElementById('connectButton').addEventListener('click', async () => {
    const statusElement = document.getElementById('status');
    const receivedDataElement = document.getElementById('receivedData');

    try {
        // Request a port and open a connection.
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });

        statusElement.textContent = 'Status: Connected';

        // Set up a reader to read data from the serial device.
        const textDecoder = new TextDecoderStream();
        const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
        const reader = textDecoder.readable.getReader();

        // Read data loop
        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                // Allow the serial port to be closed later.
                reader.releaseLock();
                break;
            }
            // Display received data
            receivedDataElement.value += value;
        }

    } catch (error) {
        statusElement.textContent = 'Status: Error';
        console.error('Error connecting to or reading from the serial device:', error);
        alert(`Error: ${error.message}`);
    }
});

