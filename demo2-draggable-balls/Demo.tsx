import * as React from 'react';
import {Motion, spring} from 'react-motion';
import {Style} from 'react-motion/Types';
import {range} from 'lodash';

const springSetting1 = {stiffness: 180, damping: 10};
const springSetting2 = {stiffness: 120, damping: 17};
function reinsert<A>(arr: A[], from: number, to: number): A[] {
  const _arr = arr.slice(0);
  const val = _arr[from];
  _arr.splice(from, 1);
  _arr.splice(to, 0, val);
  return _arr;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(Math.min(n, max), min);
}

const allColors = [
  '#EF767A', '#456990', '#49BEAA', '#49DCB1', '#EEB868', '#EF767A', '#456990',
  '#49BEAA', '#49DCB1', '#EEB868', '#EF767A',
];
const [count, width, height] = [11, 70, 90];
// indexed by visual position
const layout = range(count).map(n => {
  const row = Math.floor(n / 3);
  const col = n % 3;
  return [width * col, height * row];
});

interface State {
  mouse?: [number, number];
  delta?: [number, number];
  lastPress?: number;
  isPressed?: boolean;
  order?: number[];
}

interface Props {
  style?: Style;
}

export default class Demo extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      mouse: [0, 0],
      delta: [0, 0], // difference between mouse and circle pos, for dragging
      lastPress: null, // key of the last pressed component
      isPressed: false,
      order: range(count), // index: visual position. value: component key/id
    };
  }

  public componentDidMount(): void {
    window.addEventListener('touchmove', this.handleTouchMove.bind(this));
    window.addEventListener('touchend', this.handleMouseUp.bind(this));
    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
    window.addEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  private handleTouchStart(key: number, pressLocation: [number, number], e: React.TouchEvent): void {
    this.handleMouseDown(key, pressLocation, e.touches[0]);
  }

  private handleTouchMove(e: React.TouchEvent): void {
    e.preventDefault();
    this.handleMouseMove(e.touches[0]);
  }

  private handleMouseMove({pageX, pageY}): void {
    const {order, lastPress, isPressed, delta: [dx, dy]} = this.state;
    if (isPressed) {
      const mouse: [number, number] = [pageX - dx, pageY - dy];
      const col = clamp(Math.floor(mouse[0] / width), 0, 2);
      const row = clamp(Math.floor(mouse[1] / height), 0, Math.floor(count / 3));
      const index = row * 3 + col;
      const newOrder = reinsert(order, order.indexOf(lastPress), index);
      this.setState({mouse: mouse, order: newOrder});
    }
  }

  private handleMouseDown(key: number, [pressX, pressY]: [number, number], {pageX, pageY}): void {
    this.setState({
      lastPress: key,
      isPressed: true,
      delta: [pageX - pressX, pageY - pressY],
      mouse: [pressX, pressY],
    });
  }

  private handleMouseUp(): void {
    this.setState({isPressed: false, delta: [0, 0]});
  }

  public render(): JSX.Element {
    const {order, lastPress, isPressed, mouse} = this.state;
    return (
      <div className="demo2">
        {order.map((_: React.ReactNode, key: number) => {
          let style: Style;
          let x: number;
          let y: number;
          const visualPosition = order.indexOf(key);
          if (key === lastPress && isPressed) {
            [x, y] = mouse;
            style = {
              translateX: x,
              translateY: y,
              scale: spring(1.2, springSetting1),
              boxShadow: spring((x - (3 * width - 50) / 2) / 15, springSetting1),
            };
          } else {
            [x, y] = layout[visualPosition];
            style = {
              translateX: spring(x, springSetting2),
              translateY: spring(y, springSetting2),
              scale: spring(1, springSetting1),
              boxShadow: spring((x - (3 * width - 50) / 2) / 15, springSetting1),
            };
          }
          return (
            <Motion key={key} style={style}>
              {({translateX, translateY, scale, boxShadow}) =>
                <div
                  onMouseDown={this.handleMouseDown.bind(this, key, [x, y])}
                  onTouchStart={this.handleTouchStart.bind(this, key, [x, y])}
                  className="demo2-ball"
                  style={{
                    backgroundColor: allColors[key],
                    WebkitTransform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                    transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                    zIndex: key === lastPress ? 99 : visualPosition,
                    boxShadow: `${boxShadow}px 5px 5px rgba(0,0,0,0.5)`,
                  }}
                />
              }
            </Motion>
          );
        })}
      </div>
    );
  }
}
