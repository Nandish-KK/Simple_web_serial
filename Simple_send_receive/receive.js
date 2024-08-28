function setupRx() {
    const receivedDataElement = document.getElementById('receivedData');

    if (sharedPort) {
        const textDecoder = new TextDecoderStream();
        reader = textDecoder.readable.getReader();
        sharedPort.readable.pipeTo(textDecoder.writable);

        reader.read().then(function process({ value, done }) {
            if (done) return;

            if (value) {
                receivedDataElement.value += value;
            }

            // Continue reading
            reader.read().then(process);
        }).catch(error => {
            console.error('Error reading data:', error);
        });
    }
}
