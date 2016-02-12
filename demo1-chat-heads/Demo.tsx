import * as React from 'react';
import {StaggeredMotion, spring, presets} from 'react-motion';
import {Style, PlainStyle} from 'react-motion/Types';
import {range} from 'lodash';

interface State extends PlainStyle {
  x: number;
  y: number;
}

export default class Demo extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {x: 250, y: 300};
  }

  public componentDidMount(): void {
    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
    window.addEventListener('touchmove', this.handleTouchMove.bind(this));
  }

  private handleMouseMove({pageX: x, pageY: y}): void {
    this.setState({x, y});
  }

  private handleTouchMove({touches}): void {
    this.handleMouseMove(touches[0]);
  }

  private getStyles(prevStyles: PlainStyle[]): Style[] {
    // `prevStyles` is the interpolated value of the last tick
    const endValue = prevStyles.map((_, i) => {
      return i === 0
        ? this.state
        : {
        /* tslint:disable:no-string-literal */
            x: spring(prevStyles[i - 1]['x'], presets.gentle),
            y: spring(prevStyles[i - 1]['y'], presets.gentle),
        /* tslint:disable:no-string-literal */
          } as Style;
    });
    return endValue;
  }

  public render(): JSX.Element {
    return (
      <StaggeredMotion
        defaultStyles={range(6).map(() => ({x: 0, y: 0} as PlainStyle))}
        styles={this.getStyles.bind(this)}>
        {(balls: PlainStyle[]) =>
          <div className="demo1">
            {balls.map(({x, y}, i) =>
              <div
                key={i}
                className={`demo1-ball ball-${i}`}
                style={{
                  WebkitTransform: `translate3d(${x - 25}px, ${y - 25}px, 0)`,
                  transform: `translate3d(${x - 25}px, ${y - 25}px, 0)`,
                  zIndex: balls.length - i,
                }} />
            )}
          </div>
        }
      </StaggeredMotion>
    );
  }
}
