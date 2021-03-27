import { Component, OnInit} from '@angular/core';
import * as p5 from 'p5';
@Component({
  selector: 'app-vizualisation',
  templateUrl: './vizualisation.component.html',
  styleUrls: ['./vizualisation.component.css']
})
export class VizualisationComponent implements OnInit {

  VisSettings;
  // @ViewChild('vizu') canvas : ElementRef;
  // vis: any;
  private p5 : p5;

  constructor() {
   }

  ngOnInit(): void {
    this.setup();
    // this.vis = this.canvas.nativeElement.getContext('2d');
  }

  ngOnChanges(changes): void {
    if(changes.VisSettings) {
      console.log(changes.VisSettings);
      this.VisSettings = changes.VisSettings;
    }
  }

  setup() {
    this.p5 = new p5(this.draw);
    // this.vis = this.canvas.nativeElement.getContext('2d');
    this.p5.createCanvas(this.p5.width, this.p5.height).parent("visualization");
    this.p5.colorMode(this.p5.HSB);
}

draw() {
    function calcOffsetFraction() {
        const secondsPerMinute = 60;
        const periodSeconds = secondsPerMinute / this.VisSettings.tempoBpm;
        const secondsSinceStart = this.VisSettings.getTime() - this.VisSettings.startTime;
        const offsetSeconds = secondsSinceStart % periodSeconds;
        return offsetSeconds / periodSeconds;
    }

    const offsetFraction = calcOffsetFraction();

    const margin = 40;
    const radius = this.p5.min(this.p5.width, this.p5.height) / 4;
    const diameter = radius * 2;

    this.p5.background(255);

    function drawLargeCircle() {
        this.p5.strokeWeight(10);
        const greenHue = 120;
        const minimumBrightness = 30;
        this.p5.fill(greenHue, 100, this.p5.map(offsetFraction, 0, 1, 100, minimumBrightness));
        this.p5.ellipse(this.p5.width / 2, this.p5.height / 2, diameter - margin, diameter - margin);
    }

    const visualizations = [
        () => {},
        () => {
            function drawSpoke() {
              this.p5.translate(this.p5.width / 2, this.p5.height / 2);
              this.p5.rotate(this.p5.map(offsetFraction, 0, 1, 0, this.p5.TWO_PI) - this.p5.HALF_PI);
              this.p5.strokeWeight(8);
              this.p5.line(0, 0, radius - margin / 2, 0);
            }

            function drawSmallCircle() {
              this.p5.translate(radius - margin / 2, 0);
              this.p5.strokeWeight(3);
              this.p5.fill(255);
              this.p5.ellipse(0, 0, 30, 30);
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
