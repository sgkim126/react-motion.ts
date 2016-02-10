import * as React from 'react';
import {Motion, spring} from 'react-motion';

interface DemoStat extends React.Props<any> {
  open?: boolean;
}

const Demo = React.createClass<{}, DemoStat>({
  getInitialState(): DemoStat {
    return {open: false};
  },

  handleMouseDown(): void {
    this.setState({open: !this.state.open});
  },

  handleTouchStart(e: React.TouchEvent): void {
    e.preventDefault();
    this.handleMouseDown();
  },

  render(): JSX.Element {
    return (
      <div>
        <button
          onMouseDown={this.handleMouseDown}
          onTouchStart={this.handleTouchStart}>
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
  },
});

export default Demo;
