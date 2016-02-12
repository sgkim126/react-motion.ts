import * as React from 'react';
import {Motion, spring} from 'react-motion';
import {range} from 'lodash';
import {Style} from 'react-motion/Types';

function reinsert<T>(arr: T[], from: number , to: number): T[] {
  const _arr = arr.slice(0);
  const val = _arr[from];
  _arr.splice(from, 1);
  _arr.splice(to, 0, val);
  return _arr;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(Math.min(n, max), min);
}

const springConfig = {stiffness: 300, damping: 50};
const itemsCount = 4;

interface Props {
}
interface State {
  delta?: number;
  mouse?: number;
  isPressed?: boolean;
  lastPressed?: number;
  order?: number[];
}

export default class Demo extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      delta: 0,
      mouse: 0,
      isPressed: false,
      lastPressed: 0,
      order: range(itemsCount),
    };
  }

  public componentDidMount(): void {
    window.addEventListener('touchmove', this.handleTouchMove.bind(this));
    window.addEventListener('touchend', this.handleMouseUp.bind(this));
    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
    window.addEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  private handleTouchStart(key: number, pressLocation: number, e: React.TouchEvent): void {
    this.handleMouseDown(key, pressLocation, e.touches[0]);
  }

  private handleTouchMove(e: React.TouchEvent): void {
    e.preventDefault();
    this.handleMouseMove(e.touches[0]);
  }

  private handleMouseDown(pos: number, pressY: number, {pageY}: {pageY: number}): void {
    this.setState({
      delta: pageY - pressY,
      mouse: pressY,
      isPressed: true,
      lastPressed: pos,
    });
  }

  private handleMouseMove({pageY}): void {
    const {isPressed, delta, order, lastPressed} = this.state;
    if (isPressed) {
      const mouse = pageY - delta;
      const row = clamp(Math.round(mouse / 100), 0, itemsCount - 1);
      const newOrder = reinsert(order, order.indexOf(lastPressed), row);
      this.setState({mouse: mouse, order: newOrder});
    }
  }

  private handleMouseUp(): void {
    this.setState({isPressed: false, delta: 0});
  }

  public render(): JSX.Element {
    const {mouse, isPressed, lastPressed, order} = this.state;

    return (
      <div className="demo8">
        {range(itemsCount).map(i => {
          const style: Style = lastPressed === i && isPressed
            ? {
                scale: spring(1.1, springConfig),
                shadow: spring(16, springConfig),
                y: mouse,
              }
            : {
                scale: spring(1, springConfig),
                shadow: spring(1, springConfig),
                y: spring(order.indexOf(i) * 100, springConfig),
              };
          return (
            <Motion style={style} key={i}>
              {({scale, shadow, y}) =>
                <div
                  onMouseDown={this.handleMouseDown.bind(this, i, y)}
                  onTouchStart={this.handleTouchStart.bind(this, i, y)}
                  className="demo8-item"
                  style={{
                    boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px 0px`,
                    transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                    WebkitTransform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                    zIndex: i === lastPressed ? 99 : i,
                  }}>
                  {order.indexOf(i) + 1}
                </div>
              }
            </Motion>
          );
        })}
      </div>
    );
  }
}
