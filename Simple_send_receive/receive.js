let rxBuffer = '';

function appendData(data) {
    const textarea = document.getElementById("receivedData");
    textarea.value += data;
    setTimeout(() => {
        textarea.scrollTop = textarea.scrollHeight;
    }, 10);
}

function setupRx() {
    if (sharedPort) {
        const textDecoder = new TextDecoderStream();
        reader = textDecoder.readable.getReader();
        sharedPort.readable.pipeTo(textDecoder.writable);

        reader.read().then(function process({ value, done }) {
            if (done) return;

            if (value) {
                console.log('Received:', value); // Add this line
                appendData(value);
            }

            // Continue reading
            reader.read().then(process);
        }).catch(error => {
            console.error('Error reading data:', error);
        });
    }
}
