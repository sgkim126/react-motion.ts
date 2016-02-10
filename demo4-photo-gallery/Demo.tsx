import * as React from 'react';
import {Motion, spring} from 'react-motion';

const springSettings = {stiffness: 170, damping: 26};
const Demo = React.createClass({
  getInitialState() {
    return {
      photos: [[500, 350], [800, 600], [800, 400], [700, 500], [200, 650], [600, 600]],
      currPhoto: 0,
    };
  },

  handleChange({target: {value}}) {
    this.setState({currPhoto: value});
  },

  render() {
    const {photos, currPhoto} = this.state;
    const [currWidth, currHeight] = photos[currPhoto];

    const widths = photos.map(([origW, origH]) => currHeight / origH * origW);

    const leftStartCoords = widths
      .slice(0, currPhoto)
      .reduce((sum: number, width: number) => sum - width, 0);

    let configs: any[] = [];
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
          value={currPhoto}
          onChange={this.handleChange} />
        <div className="demo4">
          <Motion style={{height: spring(currHeight), width: spring(currWidth)}}>
            {(container: any) =>
              <div className="demo4-inner" style={container}>
                {configs.map((style, i) =>
                  <Motion key={i} style={style}>
                    {(style: any) =>
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
  },
});

export default Demo;
