import * as React from 'react';
import {Motion, spring} from 'react-motion';

interface DemoStat extends React.Props<any> {
  open?: boolean;
}

export default class Demo extends React.Component<{}, DemoStat> {
  constructor(props: {}) {
    super(props);

    this.state = {open: false};
  }

  private handleMouseDown(): void {
    this.setState({open: !this.state.open});
  }

  private handleTouchStart(e: React.TouchEvent): void {
    e.preventDefault();
    this.handleMouseDown();
  }

  public render(): JSX.Element {
    return (
      <div>
        <button
          onMouseDown={this.handleMouseDown.bind(this)}
          onTouchStart={this.handleTouchStart.bind(this)}>
          Toggle
        </button>

        <Motion style={{x: spring(this.state.open ? 400 : 0)}}>
          {({x}) =>
            // children is a callback which should accept the current value of
            // `style`
            <div className="demo0">
              <div className="demo0-block" style={{
                WebkitTransform: `translate3d(${x}px, 0, 0)`,
                transform: `translate3d(${x}px, 0, 0)`,
              }} />
            </div>
          }
        </Motion>
      </div>
    );
  }
}
