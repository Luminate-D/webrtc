const EventEmitter = require('./helper/eventemitter');
module.exports = class RTCPeer extends EventEmitter {
    constructor() {
        super();
        this.connection = new RTCPeerConnection();

        this.offer = null;
        this.connection.ontrack = ({ streams }) => {
            streams.forEach(stream => {
                this.emit('stream', stream);
            });
        }
    }

    addStreamTracks(stream) {
        stream.getTracks().forEach(track => this.addTrack(track, stream));
    }

    addTrack(track, stream) {
        this.connection.addTrack(track, stream);
    }

    async createOffer() {
        this.offer = await this.connection.createOffer();
        await this.connection.setLocalDescription({
            type: 'offer',
            sdp: this.offer.sdp
        });

        return this.offer;
    }

    async handleOffer(offer) {
        await this.connection.setRemoteDescription({
            type: 'offer',
            sdp: offer.sdp
        });

        const answer = await this.connection.createAnswer();
        await this.connection.setLocalDescription(
            new RTCSessionDescription({
                type: 'answer',
                sdp: answer.sdp
            })
        );

        return answer;
    }

    async handleAnswer(answer) {
        await connection.setRemoteDescription(
            new RTCSessionDescription({
                type: 'answer',
                sdp: answer.sdp
            })
        );
    }
}