type Nullable<T> = T | null;

export class RTCPeer {
    public offer: Nullable<RTCSessionDescriptionInit>;
    public connection: RTCPeerConnection;

    public addStreamTracks(stream: MediaStream): void;
    public addTrack(track: MediaStreamTrack, stream: MediaStream): void;

    public async createOffer(): RTCSessionDescriptionInit;
    public async handleOffer(offer: RTCSessionDescriptionInit): RTCSessionDescriptionInit;
    public async handleAnswer(answer: RTCSessionDescriptionInit): void;

    public on(event: 'stream', callback: (stream: MediaStream) => void): void;
}