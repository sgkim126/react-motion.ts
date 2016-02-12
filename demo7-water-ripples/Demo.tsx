import * as React from 'react';
import {TransitionMotion, spring} from 'react-motion';
import {Style, TransitionStyle} from 'react-motion/Types';

const leavingSpringConfig = {stiffness: 60, damping: 15};

interface Props {
}

interface State {
  mouse: number[];
  now: string;
}

export default class Demo extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {mouse: [], now: 't' + 0};
  }

  private handleMouseMove({pageX, pageY}): void {
    // Make sure the state is queued and not batched.
    this.setState(() => {
      return {
        mouse: [pageX - 25, pageY - 25],
        now: 't' + Date.now(),
      };
    });
  }

  private handleTouchMove(e: React.TouchEvent): void {
    e.preventDefault();
    this.handleMouseMove(e.touches[0]);
  }

  private willLeave(styleCell: TransitionStyle): Style {
    return Object.assign({}, styleCell.style, {
      opacity: spring(0, leavingSpringConfig),
      scale: spring(2, leavingSpringConfig),
    });
  }

  public render(): JSX.Element {
    const {mouse: [mouseX, mouseY], now} = this.state;
    const styles: TransitionStyle[] = mouseX == null ? [] : [{
      key: now,
      style: {
        opacity: spring(1),
        scale: spring(0),
        x: spring(mouseX),
        y: spring(mouseY),
      },
    }, ];
    return (
      <TransitionMotion willLeave={this.willLeave.bind(this)} styles={styles}>
        {(circles: any[]) =>
          <div
            onMouseMove={this.handleMouseMove.bind(this)}
            onTouchMove={this.handleTouchMove.bind(this)}
            className="demo7">
            {circles.map(({key, style: {opacity, scale, x, y}}) =>
              <div
                key={key}
                className="demo7-ball"
                style={{
                  opacity: opacity,
                  scale: scale,
                  transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                  WebkitTransform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                }} />
            )}
          </div>
        }
      </TransitionMotion>
    );
  }
}
