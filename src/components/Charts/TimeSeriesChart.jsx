import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Highcharts from 'highcharts';
import { FormattedNumber } from 'react-intl';

import { setChartOptions } from './chartUtils';
import ChartTotalValue from './ChartTotalValue';
import styles from './charts.css';

class TimeSeriesChart extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['CURRENCY', 'DECIMAL', 'PERCENT']),
    containerId: PropTypes.string,
    primaryData: PropTypes.array.isRequired,
    primaryLabel: PropTypes.string.isRequired,
    secondaryData: PropTypes.array.isRequired,
    secondaryLabel: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired
  };

  static defaultProps = {
    primaryData: [],
    secondaryData: []
  };

  /**
   * @param {Array} data
   * @param {String} type
   * @returns {FormattedNumber}
   */
  static renderValue = (data, type) => {
    const values = data.map(value => value.y);
    let renderedValue;
    switch (type) {
      case 'DECIMAL':
      case 'CURRENCY':
        renderedValue = _.sum(values);
        break;
      case 'PERCENT':
        renderedValue = _.mean(values) / 1e6;
        break;
      default:
        return this.value;
    }

    const numberType = _.includes(['DECIMAL', 'CURRENCY', 'PERCENT'], type)
      ? type.toLowerCase()
      : 'currency';

    const fractionDigits = numberType === 'decimal' ? 0 : 2;

    return (
      <FormattedNumber
        value={renderedValue}
        style={numberType}
        maximumFractionDigits={fractionDigits}
        minimumFractionDigits={fractionDigits}
        currency="USD"
      />
    );
  };

  componentDidMount() {
    const { containerId } = this.props;
    const options = _.cloneDeep(setChartOptions(this.props));
    Highcharts.setOptions({
      global: {
        timezoneOffset: 7 * 60
        // timezone: 'America/Los_Angeles',
      }
    });
    this.chart = new Highcharts.Chart(containerId, options);
  }

  componentWillReceiveProps({ primaryData, secondaryData }) {
    if (secondaryData !== this.props.secondaryData) {
      this.chart.series[0].setData(secondaryData);
    }
    if (primaryData !== this.props.primaryData) {
      this.chart.series[1].setData(primaryData);
    }
  }

  componentWillUnmount() {
    if (this.chart !== undefined) {
      this.chart.destroy();
    }
  }

  render() {
    const {
      containerId,
      primaryLabel,
      secondaryLabel,
      primaryData,
      secondaryData,
      type
    } = this.props;
    return (
      <div className="time-series-chart-container">
        <div id={containerId} />
        <ChartTotalValue
          type="PRIMARY"
          label={primaryLabel}
          value={TimeSeriesChart.renderValue(primaryData, type)}
        />
        <ChartTotalValue
          type="SECONDARY"
          label={secondaryLabel}
          value={TimeSeriesChart.renderValue(secondaryData, type)}
        />
      </div>
    );
  }
}

export default TimeSeriesChart;
