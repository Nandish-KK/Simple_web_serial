let sharedPort = null;
let reader = null;
let writer = null;
let readableStreamClosed = null;
let writableStreamClosed = null;

async function connectToPort() {
    const statusElement = document.getElementById('status');
    const baudRate = document.getElementById('baudRate').value;

    try {
        // Close any existing connection
        await closeConnection();

        // Request and open the serial port
        sharedPort = await navigator.serial.requestPort();
        await sharedPort.open({ baudRate: parseInt(baudRate) });

        // Set up the reader and writer for communication
        setupTx();
        setupRx();

        statusElement.textContent = `Status: Connected at ${baudRate} baud`;
        statusElement.style.color = '#16a085'; // green
    } catch (error) {
        statusElement.textContent = 'Status: Failed to connect';
        console.error('Error connecting to serial device:', error);
    }
}

async function closeConnection() {
    const statusElement = document.getElementById('status');

    try {
        if (reader) {
            await reader.cancel();
            if (readableStreamClosed) {
                await readableStreamClosed.catch(() => { /* Ignore the error */ });
            }
            reader.releaseLock();
            reader = null;
        }

        if (writer) {
            await writer.close();
            if (writableStreamClosed) {
                await writableStreamClosed;
            }
            writer.releaseLock();
            writer = null;
        }

        if (sharedPort) {
            await sharedPort.close();
            sharedPort = null;
            console.log('Port closed');
        }

        statusElement.textContent = 'Status: Disconnected';
    } catch (error) {
        console.error('Error closing the port:', error);
        statusElement.textContent = 'Status: Error closing the port';
    }
}


// Event listener for the Connect button
document.getElementById('connect').addEventListener('click', connectToPort);

// Event listener for the Stop button
document.getElementById('stop').addEventListener('click', closeConnection);

// Event listener for the Baud Rate dropdown
document.getElementById('baudRate').addEventListener('change', async () => {
    await closeConnection();
    await connectToPort();
});

navigator.serial.addEventListener('disconnect', (event) => {
    const statusElement = document.getElementById('status');
    statusElement.textContent = 'Status: Device disconnected';
    statusElement.style.color = '#e74c3c'; // red
    closeConnection();
});

