import * as React from 'react';
import {TransitionMotion, spring, presets} from 'react-motion';
import {TransitionStyle, Style} from 'react-motion/Types';

interface Data {
  key: string;
  data: {
    text: string;
    isDone: boolean;
  };
}
interface State {
  todos?: Data[];
  value?: string;
  selected?: string;
}

export default class Demo extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      todos: [
        // key is creation date
        {key: 't1', data: {text: 'Board the plane', isDone: false}},
        {key: 't2', data: {text: 'Sleep', isDone: false}},
        {key: 't3', data: {text: 'Try to finish conference slides', isDone: false}},
        {key: 't4', data: {text: 'Eat cheese and drink wine', isDone: false}},
        {key: 't5', data: {text: 'Go around in Uber', isDone: false}},
        {key: 't6', data: {text: 'Talk with conf attendees', isDone: false}},
        {key: 't7', data: {text: 'Show Demo 1', isDone: false}},
        {key: 't8', data: {text: 'Show Demo 2', isDone: false}},
        {key: 't9', data: {text: 'Lament about the state of animation', isDone: false}},
        {key: 't10', data: {text: 'Show Secret Demo', isDone: false}},
        {key: 't11', data: {text: 'Go home', isDone: false}},
      ],
      value: '',
      selected: 'all',
    };
  }

  // logic from todo, unrelated to animation
  private handleChange({target: {value}}): void {
    this.setState({value} as State);
  }

  private handleSubmit(e: React.FormEvent): void {
    e.preventDefault();
    const newItem = {
      key: 't' + Date.now(),
      data: {text: this.state.value, isDone: false},
    };
    // append at head
    this.setState({todos: [newItem].concat(this.state.todos)});
  }

  private handleDone(doneKey: React.FormEvent): void {
    this.setState({
      todos: this.state.todos.map((todo: any) => {
        const {key, data: {text, isDone}} = todo;
        return key === doneKey
          ? {key: key, data: {text: text, isDone: !isDone}}
          : todo;
      }),
    });
  }

  private handleToggleAll() {
    const allNotDone = this.state.todos.every(({data}) => data.isDone);
    this.setState({
      todos: this.state.todos.map(({key, data: {text}}) => (
        {key: key, data: {text: text, isDone: !allNotDone}}
      )),
    });
  }

  private handleSelect(selected: string) {
    this.setState({selected});
  }

  private handleClearCompleted() {
    this.setState({todos: this.state.todos.filter(({data}) => !data.isDone)});
  }

  private handleDestroy(date: number) {
    this.setState({todos: this.state.todos.filter(({key}) => key !== date.toString())});
  }

  // actual animation-related logic
  private getDefaultStyles(): any[] {
    return this.state.todos.map((todo: any) => {
      // ({...todo, style: {height: 0, opacity: 1}}) typescript doesn't support spread operator for object
      return Object.assign({}, todo, { style: {height: 0, opacity: 1} });
    });
  }

  private getStyles(): TransitionStyle[] {
    const {todos, value, selected} = this.state;
    return todos.filter(({data: {isDone, text}}) => {
      return text.toUpperCase().indexOf(value.toUpperCase()) >= 0 &&
        (selected === 'completed' && isDone ||
        selected === 'active' && !isDone ||
        selected === 'all');
    })
    .map((todo: any, i: number) => {
      return Object.assign({}, todo, { style: {
        height: spring(60, presets.gentle),
        opacity: spring(1, presets.gentle),
      }, });
      // typescript doesn't support spread operator for object
      // return {
      //   ...todo,
      //   style: {
      //     height: spring(60, presets.gentle),
      //     opacity: spring(1, presets.gentle),
      //   }
      // };
    });
  }

  private willEnter(): Style {
    return {
      height: 0,
      opacity: 1,
    };
  }

  private willLeave(): Style {
    return {
      height: spring(0),
      opacity: spring(0),
    };
  }

  public render(): JSX.Element {
    const {todos, value, selected} = this.state;
    const itemsLeft = todos.filter(({data: {isDone}}) => !isDone).length;
    return (
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <form onSubmit={this.handleSubmit.bind(this)}>
            <input
              autoFocus={true}
              className="new-todo"
              placeholder="What needs to be done?"
              value={value}
              onChange={this.handleChange.bind(this)}
            />
          </form>
        </header>
        <section className="main">
          <input
            className="toggle-all"
            type="checkbox"
            checked={itemsLeft === 0} style={{display: todos.length === 0 ? 'none' : 'inline'}}
            onChange={this.handleToggleAll.bind(this)} />
          <TransitionMotion
            defaultStyles={this.getDefaultStyles()}
            styles={this.getStyles()}
            willLeave={this.willLeave.bind(this)}
            willEnter={this.willEnter.bind(this)}>
            {(styles: any[]) =>
              <ul className="todo-list">
                {styles.map(({key, style, data: {isDone, text}}) =>
                  <li key={key} style={style} className={isDone ? 'completed' : ''}>
                    <div className="view">
                      <input
                        className="toggle"
                        type="checkbox"
                        onChange={this.handleDone.bind(this, key)}
                        checked={isDone}
                      />
                      <label>{text}</label>
                      <button
                        className="destroy"
                        onClick={this.handleDestroy.bind(this, key)}
                      />
                    </div>
                  </li>
                )}
              </ul>
            }
          </TransitionMotion>
        </section>
        <footer className="footer">
          <span className="todo-count">
            <strong>
              {itemsLeft}
            </strong> {itemsLeft === 1 ? 'item' : 'items'} left
          </span>
          <ul className="filters">
            <li>
              <a
                className={selected === 'all' ? 'selected' : ''}
                onClick={this.handleSelect.bind(this, 'all')}>
                All
              </a>
            </li>
            <li>
              <a
                className={selected === 'active' ? 'selected' : ''}
                onClick={this.handleSelect.bind(this, 'active')}>
                Active
              </a>
            </li>
            <li>
              <a
                className={selected === 'completed' ? 'selected' : ''}
                onClick={this.handleSelect.bind(this, 'completed')}>
                Completed
              </a>
            </li>
          </ul>
          <button className="clear-completed" onClick={this.handleClearCompleted.bind(this)}>
            Clear completed
          </button>
        </footer>
      </section>
    );
  }
}
