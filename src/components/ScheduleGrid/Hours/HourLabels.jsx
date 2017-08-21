import React from 'react';

/**
 * Static Hour Label
 */
export default class HourLabels extends React.PureComponent {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div className="hour-labels">
        <span className="twelve-am">12am</span>
        <span className="three-am">3am</span>
        <span className="six-am">6am</span>
        <span className="nine-am">9am</span>
        <span className="twelve-pm">12pm</span>
        <span className="three-pm">3pm</span>
        <span className="six-pm">6pm</span>
        <span className="nine-pm">9pm</span>
      </div>
    );
  }
}
