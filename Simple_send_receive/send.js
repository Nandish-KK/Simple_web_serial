function setupTx() {
    const inputField = document.getElementById('input');
    const sendButton = document.getElementById('send');
    const sentOutput = document.getElementById('sentOutput');
    const endlineSelect = document.getElementById('endlineType');

    if (sharedPort) {
        writer = sharedPort.writable.getWriter();

        function getEndlineValue(type) {
            switch (type) {
                case 'lf': return '\n';
                case 'cr': return '\r';
                case 'crlf': return '\r\n';
                default: return '';
            }
        }

        async function sendMessage() {
            const message = inputField.value;
            const endlineType = endlineSelect.value;
            const endline = getEndlineValue(endlineType);

            if (message.trim() !== '') {
                try {
                    await writer.write(new TextEncoder().encode(message + endline));
                    let shownEndline = '';
                    if (endlineType === 'lf') shownEndline = '\\n';
                    else if (endlineType === 'cr') shownEndline = '\\r';
                    else if (endlineType === 'crlf') shownEndline = '\\r\\n';
                    sentOutput.textContent = `sent "${message}${shownEndline}"`;
                    inputField.value = '';
                } catch (error) {
                    console.error('Error sending data:', error);
                }
            }
        }

        sendButton.addEventListener('click', sendMessage);

        inputField.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                sendMessage();
            }
        });
    }
}