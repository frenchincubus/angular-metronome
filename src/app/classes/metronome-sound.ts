export class MetronomeSound {

    soundsPath: String;
    listener: any;
    running: boolean;
    tempoBpm: number;
    soundNum: number;
    audioContext: any;
    soundFiles: SoundFiles;
    source: any;
    metric: number = 4;
    ternaire: boolean = false;

    constructor(soundsPath: String, sounds: string[], listener: any) {
        this.soundsPath = soundsPath;
        const dummyListener = { setTempo: (t) => {}, setStartTime: (t) => {} };
        this.listener = listener || dummyListener;
        this.running = false;
        this.tempoBpm = 100;
        this.soundNum = 1;
        this.audioContext = new(window.AudioContext)();
        const urls = sounds.map(name => this.soundsPath.concat('', name));
        this.soundFiles = new SoundFiles(this.audioContext, urls);
    }

    /**
     * Sets the tempo.
     * @param bpm tempo in beats per minute
     */
    setTempo(bpm: number) {
        this.tempoBpm = bpm;
        console.log(this.tempoBpm);
    }

    /**
     * Sets the metronome sound.
     * @param number the one-based sound index
     */
    setSound(number: number) {
        this.soundNum = number;
    }

    setMetric(metric: number) {
        this.metric = metric;
    }

    setTernaire() {
        this.ternaire = !this.ternaire;
        console.log(this.ternaire);
    }

    /** Toggles the running state of the metronome */
    toggle() {
        const ms = this;
        let i = 0;
        function playMetronome() {
            let nextStart = ms.audioContext.currentTime;

            function schedule() {
                if (!ms.running) return;
               
                ms.listener.setStartTime(nextStart);
                ms.listener.setTempo(ms.tempoBpm);

                    const bufIndex = ms.soundNum - 1;
                if (bufIndex >= ms.soundFiles.buffers.length) {
                    alert('Sound files are not yet loaded')
                } else if (ms.tempoBpm) {
                    if(!ms.ternaire)
                        nextStart += 60 / ms.tempoBpm;
                    else nextStart += 60 / (ms.tempoBpm*3);
                    ms.source = ms.audioContext.createBufferSource();
                    if(!ms.ternaire)
                        ms.source.buffer = i%ms.metric == 0 ? ms.soundFiles.buffers[bufIndex] : ms.soundFiles.buffers[bufIndex+1] ;
                    else ms.source.buffer = i%3 == 0 ? ms.soundFiles.buffers[bufIndex] : ms.soundFiles.buffers[bufIndex+1] ;
                        ms.source.connect(ms.audioContext.destination);
                    ms.source.onended = schedule;
                    ms.source.start(nextStart);
                    i++;                   
                }
            }

            schedule();
        }

        if (this.running = !this.running) {
            playMetronome();
        } else {
            this.listener.setTempo(0);
            if (this.source) {
                this.source.disconnect();
                this.source = undefined;
            }
        }
    }
}

class SoundFiles {

    buffers: any[];

    constructor(context: any, urlList: string[]) {
        this.buffers = [];
        const self = this;

        urlList.forEach((url: string, index: number) => {
            const xhr = new XMLHttpRequest();
            xhr.responseType = "arraybuffer";
            xhr.onload = () => context.decodeAudioData(xhr.response,
                (buffer: any) => self.buffers[index] = buffer,
                (error: any) => console.error('decodeAudioData error', error));
            xhr.open("GET", url);
            xhr.send();
        });
    }
}