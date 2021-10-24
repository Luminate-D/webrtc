### WebRTC Peer
Made for P2P connection through websocket

# Installation for Web
Include script by this path:
```html
<script src="node_modules/@luminate_d/webrtc/build/browser.js"></script>
```

All exports will store in global variable `WebRTC`

# Usage
```js
// Create peer instance
const peer = new WebRTC.RTCPeer();

// Once we receive stream from another peer, handle it
peer.on('stream', (stream) => {
    // for example, creating new video object with another peer video
    const video = document.createElement('video');
    video.srcObject = stream;
    
    document.body.append(video);
    video.play();
});

// Get user webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        // assuming that "video" is some HTMLVideoElement
        video.srcObject = stream;
        video.play();

        // adding media stream to peer
        peer.addStreamTracks(stream);

        // calling init after media loaded
        init();
    }).catch(err => {
        console.log('Failed to get user media');
    });

function init() {
    // connecting to the server
    // server will broadcast our message to another peer
    const socket = new WebSocket('ws://localhost:2020/');

    // Handling messages from our server
    socket.onmessage = async (message) => {
        const data = JSON.parse(message.data);

        switch(data.type) {
            // if someone calls us with its offer (see callPeer function)
            case 'call': {
                // creating answer and sending it back to server
                const answer = await peer.handleOffer(data.offer);
                socket.send(JSON.stringify({
                    type: 'answer',
                    answer: answer
                }));

                break;
            }

            // if someone answers us, handling answer and calling peer again
            case 'answer': {
                await peer.handleAnswer(data.answer);
                callPeer(socket);
            }
        }
    };
}

// function to call peer
async function callPeer(socket) {
    socket.send({
        type: 'call',
        // creating our offer and sending to server
        offer: await peer.createOffer()
    });
}
```