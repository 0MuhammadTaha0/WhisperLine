var socket = io();
let contacts
const chatInputForm = document.querySelector('.chat-input')

function clickableContacts() {
    //Making contacts clickable and updating chat header
    const contact = document.querySelectorAll('.contact')

    for (let i = 0; i < contact.length; i++) {
        contact[i].addEventListener('click', function() {
            const chatHeader = document.querySelector('.profile-name')
            const activeContact = document.querySelector('.activeContact')
            if (activeContact) {
                activeContact.classList.remove('activeContact')
            }
            contact[i].classList.add('activeContact');
            let contactName = contact[i].innerHTML;
            chatHeader.innerHTML = contactName;
        
            const chatMessagesContainer = document.querySelector('.chat-messages');
            chatMessagesContainer.innerHTML = '';

            // Load messages
            for (let i = 0; i < contacts.length; i++) {
                if (contacts[i]["username"] === contactName) {
                    if ('messages' in contacts[i]) {
                        const messages = contacts[i]["messages"];

                        // Append the messages
                        messages.forEach(function(message) {
                            const messageDiv = document.createElement('div');
                            messageDiv.classList.add('message');
                            messageDiv.textContent = message["message"];
                            chatMessagesContainer.appendChild(messageDiv);
                        });

                        // Scroll to the bottom of the chat
                        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
                    }
                }
            }
        });
    }
}

function appendMessage(message) {
    for (let i = 0; i < contacts.length; i++) {
        if (contacts[i]["username"] === message["to"]) {
            if ('messages' in contacts[i]) {
                contacts[i]["messages"].push(message)
            }
            else {
                contacts[i].push({
                    key:   "messages",
                    value: [message]
                });
            }
        }
    }
}

// A little help from chat gpt handling event
const sendMessage = (e) => {
    e.preventDefault()
    // Checking if a contact is selected
    const activeContact = document.querySelector('.activeContact')
    if (!activeContact) {
        return            
    }

    const input = document.querySelector('.chat-input input');
    let message = {
        message: input.value.trim(),
        to: activeContact.innerHTML,
        timestamp: new Date().toISOString().replace("T"," ").substring(0, 19)
    }
    if (message['message']) {
        const chatMessages = document.querySelector('.chat-messages');
        const newMessage = document.createElement('div');
        newMessage.classList.add('message');
        newMessage.textContent = message['message'];
        chatMessages.appendChild(newMessage);
        input.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
        appendMessage(message);
    }
}




chatInputForm.addEventListener('submit', sendMessage)

//Implementing icons
const icons = document.querySelectorAll('.icon')

icons[2].onclick = function(){
location.href='/friends/add';
};

icons[3].onclick = function(){
location.href='/settings';
};

icons[4].onclick = function(){
location.href='/logout';
};

async function fetchContacts() {
    const contactSectionContainer = document.querySelector('.contacts-section');
    let response = await fetch('/fetchContacts');
    if (response.status == 204) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('contact');
        messageDiv.innerHTML = `<a href="/friends/add">Click</a> to add friends!`;
        contactSectionContainer.appendChild(messageDiv);
    } else {
        let data = await response.json();
        data.forEach(element => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('contact');
        messageDiv.textContent = element["username"];
        contactSectionContainer.appendChild(messageDiv);
        });
        contacts = data;
        clickableContacts();
    }
}

fetchContacts();