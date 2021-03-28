import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import * as p5 from 'p5';
import { VisSettings } from 'src/app/models/vis-settings';
@Component({
  selector: 'app-vizualisation',
  templateUrl: './vizualisation.component.html',
  styleUrls: ['./vizualisation.component.css']
})
export class VizualisationComponent implements OnInit {

  // @Input() obsVisSettings: Observable<VisSettings>;
  // @ViewChild('vizu') canvas : ElementRef;
  // vis: any;
  private visSetting: VisSettings;
  @Input() set VisSettings(value: VisSettings) {
    this.visSetting = value;
  }

  get VisSettings() {
    return this.visSetting;
  }
  p5: p5;

  constructor() {
  }

  ngOnInit(): void {
    console.log(this.VisSettings);
    // this.setup();
    this.p5 = new p5(this.sketch);

  }

  // ngOnChanges(changes: SimpleChanges): void {
    
  //     console.log(changes.VisSettings);
  //     this.VisSettings = changes.VisSettings.currentValue;
    
  // }

  sketch(p5) {
    p5.setup = () => {

      // this.vis = this.canvas.nativeElement.getContext('2d');
      p5.createCanvas(p5.width, p5.height).parent("visualization");
      p5.colorMode(p5.HSB);
    }

    p5.draw = () => {
      const visu = this;
      const calcOffsetFraction = (visu) => {
        const secondsPerMinute = 60;
        const periodSeconds = secondsPerMinute / this.VisSettings.tempoBpm;
        const secondsSinceStart = this.VisSettings.getTime() - this.VisSettings.startTime;
        const offsetSeconds = secondsSinceStart % periodSeconds;
        return offsetSeconds / periodSeconds;
      }

      const offsetFraction = calcOffsetFraction(visu);

      const margin = 40;
      const radius = p5.min(p5.width, p5.height) / 4;
      const diameter = radius * 2;

      p5.background(255);

      function drawLargeCircle() {
        p5.strokeWeight(10);
        const greenHue = 120;
        const minimumBrightness = 30;
        p5.fill(greenHue, 100, p5.map(offsetFraction, 0, 1, 100, minimumBrightness));
        p5.ellipse(p5.width / 2, p5.height / 2, diameter - margin, diameter - margin);
      }

      const visualizations = [
        () => { },
        () => {
          function drawSpoke() {
            p5.translate(p5.width / 2, p5.height / 2);
            p5.rotate(p5.map(offsetFraction, 0, 1, 0, p5.TWO_PI) - p5.HALF_PI);
            p5.strokeWeight(8);
            p5.line(0, 0, radius - margin / 2, 0);
          }

          function drawSmallCircle() {
            p5.translate(radius - margin / 2, 0);
            p5.strokeWeight(3);
            p5.fill(255);
            p5.ellipse(0, 0, 30, 30);
          }

          drawLargeCircle();
          drawSpoke();
          drawSmallCircle();
        },
        () => drawLargeCircle()
      ];

      visualizations[(this.VisSettings.visualizationType)]();
    }
  }


}
