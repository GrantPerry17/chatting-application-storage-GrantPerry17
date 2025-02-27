// References to HTML elements
const nameInput = document.getElementById("my-name-input");
const myMessage = document.getElementById("my-message");
const sendButton = document.getElementById("send-button");
const chatBox = document.getElementById("chat");

// Server URL
const serverURL = `https://it3049c-chat.fly.dev/messages`;

// Function to fetch messages from the server
function fetchMessages() {
    return fetch(serverURL)
        .then(response => response.json());
}

// Formatter function to format messages
function formatMessage(message, myNameInput) {
    const time = new Date(message.timestamp);
    const formattedTime = `${time.getHours()}:${time.getMinutes()}`;

    if (myNameInput === message.sender) {
        return `
            <div class="mine messages">
                <div class="message">
                    ${message.text}
                </div>
                <div class="sender-info">
                    ${formattedTime}
                </div>
            </div>
        `;
    } else {
        return `
            <div class="yours messages">
                <div class="message">
                    ${message.text}
                </div>
                <div class="sender-info">
                    ${message.sender} ${formattedTime}
                </div>
            </div>
        `;
    }
}

// Function to update the messages in the chatbox
async function updateMessages() {
    // Fetch Messages
    const messages = await fetchMessages();

    // Loop over the messages and format them
    let formattedMessages = "";
    messages.forEach(message => {
        formattedMessages += formatMessage(message, nameInput.value);
    });

    // Update the chatbox with the new formatted messages
    chatBox.innerHTML = formattedMessages;
}

// Call the updateMessages function immediately to load the messages
updateMessages();

// Refresh the messages every 10 seconds
const MILLISECONDS_IN_TEN_SECONDS = 10000;
setInterval(updateMessages, MILLISECONDS_IN_TEN_SECONDS);

// Function to send a message to the server
function sendMessages(username, text) {
    const newMessage = {
        sender: username,
        text: text,
        timestamp: new Date()
    };

    fetch(serverURL, {
        method: `POST`,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMessage)
    });
}

// Event Listener for the send button click
sendButton.addEventListener("click", function(sendButtonClickEvent) {
    sendButtonClickEvent.preventDefault();

    const sender = nameInput.value;
    const message = myMessage.value;

    // Send the message to the server
    sendMessages(sender, message);

    // Clear the message input field after sending
    myMessage.value = "";
});
