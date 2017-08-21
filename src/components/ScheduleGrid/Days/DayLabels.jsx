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
      <div className="side-selection-text">
        <div><span>Monday</span></div>
        <div><span>Tuesday</span></div>
        <div><span>Wednesday</span></div>
        <div><span>Thursday</span></div>
        <div><span>Friday</span></div>
        <div><span>Saturday</span></div>
        <div><span>Sunday</span></div>
      </div>
    );
  }
}
