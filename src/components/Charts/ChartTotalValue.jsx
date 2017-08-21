import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ChartTotalValue extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['PRIMARY', 'SECONDARY']),
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  };

  static defaultProps = {
    type: 'PRIMARY',
  };

  render() {
    const { label, value, type } = this.props;
    const chartType = type.toLowerCase();
    return (
      <div className={`chart-total-container ${chartType}`}>
        <div className={`icon-${chartType}`} />
        <div className="chart-type-label">
          {label}
        </div>
        <div className="value">
          {value}
        </div>
      </div>
    );
  }
}

export default ChartTotalValue;
