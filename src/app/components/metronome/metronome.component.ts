import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MetronomeSound } from 'src/app/classes/metronome-sound';
import { VisSettings } from 'src/app/models/vis-settings';

@Component({
  selector: 'app-metronome',
  templateUrl: './metronome.component.html',
  styleUrls: ['./metronome.component.css']
})
export class MetronomeComponent implements OnInit {

  soundsPath: String = "assets/audio/";
  sounds: string[] = ['High_Woodblock.wav', 'Low_Woodblock.wav', 'High_Bongo.wav',
    'Low_Bongo.wav', 'Drumsticks.wav', 'Claves.wav'];
  visSettings: VisSettings = {
    tempoBpm: 0,
    startTime: 0,
    getTime: undefined,
    visualizationType: 1,
    names: ['Spinning Circle', 'Circle']
  };
  
  metroSound: MetronomeSound;
  soundsList: any[] = [];
  typeSelectList: any[] = [];
  startStopValue: String = 'Start';
  bpm: number = 100;
  metric: number = 4;

  constructor() {
    
  }

  ngOnInit(): void {
    const metroSoundListener = {
      setTempo: (t) => this.visSettings.tempoBpm = t,
      setStartTime: (t) => this.visSettings.startTime = t
    };
    this.metroSound = new MetronomeSound(this.soundsPath, this.sounds, metroSoundListener);

    this.visSettings.getTime = () => this.metroSound.audioContext.currentTime;


    for (const [index, name] of this.sounds.entries()) {
      const fileExtension = /\..*/;
      const optionText = name.replace('_', ' ').replace(fileExtension, '');
      if (index % 2 === 0)
        this.soundsList.push({ option: optionText, index: index });
    }

    this.visSettings.names.map((visTypeName, index) => {
      const sel = index === 0 ? ' selected' : '';
      this.typeSelectList.push({ type: visTypeName, index: index });
    });
  }

  /**
     * Sets the tempo.
     * @param bpm tempo in beats per minute
     */
  setTempo(bpm: number) {
    this.bpm = bpm;
    this.metroSound.setTempo(bpm);
  }

  /**
   * Sets the metronome sound.
   * @param number the one-based sound index
   */
  setSound(number: string) {
    this.metroSound.setSound(parseInt(number, 10) + 1);
  }

  setMetric(metric: string) {
    this.metric = parseInt(metric, 10);
    this.metroSound.setMetric(parseInt(metric, 10));
  }

  setTernaire() {
    this.metroSound.setTernaire();
  }

  /**
   * Sets the visualization type.
   * @param index a 0-based number specifying the visualization to use
   */
  setVisualization(index: string) {
    this.visSettings.visualizationType = parseInt(index) + 1;
  }

  /** Starts the metronome if it is stopped, and vice versa. */
  toggle() {
    this.metroSound.toggle();
    this.startStopValue = this.metroSound.running ? 'Stop' : 'Start';
  }

}
