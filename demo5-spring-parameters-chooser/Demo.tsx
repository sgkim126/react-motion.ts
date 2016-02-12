import * as React from 'react';
import {Motion, spring} from 'react-motion';
import {Style} from 'react-motion/Types';
import { range } from 'lodash';

const gridWidth = 150;
const gridHeight = 150;
const grid = range(4).map(() => range(6));

interface State {
  delta?: [number, number];
  mouse?: [number, number];
  isPressed?: boolean;
  firstConfig?: [number, number];
  slider?: { dragged?: string, num: number };
  lastPressed?: [number, number];
}

export default class Demo extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      delta: [0, 0],
      mouse: [0, 0],
      isPressed: false,
      firstConfig: [60, 5],
      slider: {dragged: null, num: 0},
      lastPressed: [0, 0],
    };
  }

  public componentDidMount(): void {
    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
    window.addEventListener('touchmove', this.handleTouchMove.bind(this));
    window.addEventListener('mouseup', this.handleMouseUp.bind(this));
    window.addEventListener('touchend', this.handleMouseUp.bind(this));
  }

  private handleTouchStart(pos: [number, number], press: [number, number], e: React.TouchEvent): void {
    this.handleMouseDown(pos, press, e.touches[0]);
  }

  private handleMouseDown(
    pos: [number, number],
    [pressX, pressY]: [number, number],
    {pageX, pageY}: { pageX: number, pageY: number }): void {
    this.setState({
      delta: [pageX - pressX, pageY - pressY],
      mouse: [pressX, pressY],
      isPressed: true,
      lastPressed: pos,
    });
  }

  private handleTouchMove(e: React.TouchEvent) {
    if (this.state.isPressed) {
      e.preventDefault();
    }
    this.handleMouseMove(e.touches[0]);
  }

  private handleMouseMove({pageX, pageY}) {
    const {isPressed, delta: [dx, dy]} = this.state;
    if (isPressed) {
      this.setState({mouse: [pageX - dx, pageY - dy]});
    }
  }

  private handleMouseUp(): void {
    this.setState({
      isPressed: false,
      delta: [0, 0],
      slider: {dragged: null, num: 0},
    });
  }

  private handleChange(constant: string, num: number, {target}: {target: any}) {
    const {firstConfig: [s, d]} = this.state;
    if (constant === 'stiffness') {
      this.setState({
        firstConfig: [target.value - num * 30, d]
      });
    } else {
      this.setState({
        firstConfig: [s, target.value - num * 2]
      });
    }
  }

  private handleMouseDownInput(constant: string, num: number): void {
    this.setState({
      slider: {dragged: constant, num: num}
    });
  }

  public render(): JSX.Element {
    const {
      mouse, isPressed, lastPressed, firstConfig: [s0, d0], slider: {dragged, num}
    } = this.state;
    return (
      <div className="demo5">
        {grid.map((row, i) => {
          return row.map((cell, j) => {
            const cellStyle = {
              top: gridHeight * i,
              left: gridWidth * j,
              width: gridWidth,
              height: gridHeight,
            };
            const stiffness = s0 + i * 30;
            const damping = d0 + j * 2;
            const motionStyle: Style = isPressed
              ? {x: mouse[0], y: mouse[1]}
              : {
                  x: spring(gridWidth / 2 - 25, {stiffness, damping}),
                  y: spring(gridHeight / 2 - 25, {stiffness, damping}),
                };

            return (
              <div style={cellStyle} className="demo5-cell">
                <input
                  type="range"
                  min={0}
                  max={300}
                  value={stiffness.toString()}
                  onMouseDown={this.handleMouseDownInput.bind(this, 'stiffness', i)}
                  onChange={this.handleChange.bind(this, 'stiffness', i)} />
                <input
                  type="range"
                  min={0}
                  max={40}
                  value={damping.toString()}
                  onMouseDown={this.handleMouseDownInput.bind(this, 'damping', j)}
                  onChange={this.handleChange.bind(this, 'damping', j)} />
                <Motion style={motionStyle}>
                  {({x, y}) => {
                    let thing: JSX.Element;
                    if (dragged === 'stiffness') {
                      thing = i < num ? <div className="demo5-minus">-{(num - i) * 30}</div>
                        : i > num ? <div className="demo5-plus">+{(i - num) * 30}</div>
                        : <div className="demo5-plus">0</div>;
                    } else {
                      thing = j < num ? <div className="demo5-minus">-{(num - j) * 2}</div>
                        : j > num ? <div className="demo5-plus">+{(j - num) * 2}</div>
                        : <div className="demo5-plus">0</div>;
                    }
                    const active = lastPressed[0] === i && lastPressed[1] === j
                      ? 'demo5-ball-active'
                      : '';
                    return (
                      <div
                        style={{
                          transform: `translate3d(${x}px, ${y}px, 0)`,
                          WebkitTransform: `translate3d(${x}px, ${y}px, 0)`,
                        }}
                        className={'demo5-ball ' + active}
                        onMouseDown={this.handleMouseDown.bind(this, [i, j], [x, y])}
                        onTouchStart={this.handleTouchStart.bind(this, [i, j], [x, y])}>
                        <div className="demo5-preset">
                          {stiffness}{dragged === 'stiffness' && thing}
                        </div>
                        <div className="demo5-preset">
                          {damping}{dragged === 'damping' && thing}
                        </div>
                      </div>
                    );
                  }}
                </Motion>
              </div>
            );
          });
        })}
      </div>
    );
  }
}
