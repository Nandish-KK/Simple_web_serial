document.getElementById('connect').addEventListener('click', async () => {
    try {
        // Request a port and open it with a specified baud rate
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });  // Ensure baud rate matches your device
        
        console.log('Connected to serial device');
        document.getElementById('status').textContent = "Connected to serial device.";
        
        // Set up the writer for sending data
        const writer = port.writable.getWriter();
        
        // Event listener for the send button
        document.getElementById('send').addEventListener('click', async () => {
            const inputField = document.getElementById('input');
            const message = inputField.value;

            if (message) {
                try {
                    // Send the message
                    await writer.write(new TextEncoder().encode(message + '\n'));
                    console.log('Sent:', message);
                } catch (error) {
                    console.error('Error sending to serial port:', error);
                }
                
                inputField.value = ''; // Clear the input field after sending
            } else {
                console.log('No message to send');
            }
        });

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('status').textContent = "Failed to connect to serial device.";
    }
});

