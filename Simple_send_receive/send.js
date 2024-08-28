function setupTx() {
    const inputField = document.getElementById('input');

    if (sharedPort) {
        writer = sharedPort.writable.getWriter();

        document.getElementById('send').addEventListener('click', async () => {
            const message = inputField.value.trim();
            if (message) {
                try {
                    await writer.write(new TextEncoder().encode(message + '\n'));
                    console.log('Sent:', message);
                    inputField.value = ''; // Clear the input field after sending
                } catch (error) {
                    console.error('Error sending data:', error);
                }
            }
        });
    }
}
