import * as React from 'react';
import {Motion, spring} from 'react-motion';
import {Style} from 'react-motion/Types';

const springSettings = {stiffness: 170, damping: 26};

interface State {
  photos?: [number, number][];
  currPhoto: number;
}

export default class Demo extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      photos: [[500, 350], [800, 600], [800, 400], [700, 500], [200, 650], [600, 600]],
      currPhoto: 0,
    };
  }

  private handleChange({target: {value}}): void {
    this.setState({currPhoto: value});
  }

  public render(): JSX.Element {
    const {photos, currPhoto} = this.state;
    const [currWidth, currHeight] = photos[currPhoto];

    const widths = photos.map(([origW, origH]) => currHeight / origH * origW);

    const leftStartCoords = widths
      .slice(0, currPhoto)
      .reduce((sum: number, width: number) => sum - width, 0);

    let configs: Style[] = [];
    photos.reduce((prevLeft: number, orig: [number, number], i: number) => {
      configs.push({
        left: spring(prevLeft, springSettings),
        height: spring(currHeight, springSettings),
        width: spring(widths[i], springSettings),
      });
      return prevLeft + widths[i];
    }, leftStartCoords);

    return (
      <div>
        <div>Scroll Me</div>
        <input
          type="range"
          min={0}
          max={photos.length - 1}
          value={currPhoto.toString()}
          onChange={this.handleChange.bind(this)} />
        <div className="demo4">
          <Motion style={{height: spring(currHeight), width: spring(currWidth)}}>
            {(container: any) =>
              <div className="demo4-inner" style={container}>
                {configs.map((style: Style, i: number) =>
                  <Motion key={i} style={style}>
                    {(style: Style): JSX.Element =>
                      <img className="demo4-photo" src={`./${i}.jpg`} style={style} />
                    }
                  </Motion>
                )}
              </div>
            }
          </Motion>
        </div>
      </div>
    );
  }
}
