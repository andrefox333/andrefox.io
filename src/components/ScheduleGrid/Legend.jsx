import React from 'react';

/**
 * Static Schedule Legend
 */
export default class Legend extends React.PureComponent {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div className="legend">
        <div className="legend-active">&nbsp;
          <div className="box">&nbsp;</div>
          <span>Active</span>
        </div>
        <div className="legend-pause">&nbsp;
          <div className="box">&nbsp;</div>
          <span>Pause</span>
        </div>
      </div>
    );
  }
}
