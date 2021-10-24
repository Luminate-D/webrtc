(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.WebRTC = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = class EventEmitter {
    constructor() {
        this.callbacks = {};
    }

    on(event, cb) {
        if(!this.callbacks[event]) this.callbacks[event] = [];
        this.callbacks[event].push(cb);
    }

    emit(event, data) {
        let cbs = this.callbacks[event];
        if(cbs) cbs.forEach(cb => cb(data));
    }
}
},{}],2:[function(require,module,exports){
module.exports = {
    RTCPeer: require('./peer')
}
},{"./peer":3}],3:[function(require,module,exports){
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
},{"./helper/eventemitter":1}]},{},[2])(2)
});
