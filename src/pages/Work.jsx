import React, { Component } from 'react';
import { IntlProvider } from 'react-intl';
import moment from 'moment';

import './work.css';
import ScheduleGrid from '../components/ScheduleGrid/Schedule';
import DateSelector from '../components/DateSelector/DateSelector';
import TimeSeriesChart from '../components/Charts/TimeSeriesChart';
import series1Json from '../components/Charts/mockData/series1.json';
import series2Json from '../components/Charts/mockData/series2.json';

export default class Work extends Component {
  render() {
    const secondaryData = series1Json.map(series => {
      return {
        name: moment(series.startTimestampMillis).format('hh:mm A'),
        x: series.startTimestampMillis,
        y: series.cost
      };
    });

    const primaryData = series2Json.map(series => {
      return {
        name: moment(series.startTimestampMillis).format('hh:mm A'),
        x: series.startTimestampMillis,
        y: series.cost
      };
    });
    return (
      <div className="work">
        <div className="component-examples">
          <h3>Some Examples of React Components</h3>
          <div className="component-container">
            <h4>Schedule Grid</h4>
            <a href="https://github.com/andrefox333/andrefox.io/blob/master/src/components/ScheduleGrid/Schedule.jsx">
              View in Github
            </a>
            <p>A schedule grid used to toggle days and time.</p>
            <ScheduleGrid />
          </div>
          <hr />
          <div className="component-container">
            <h4>Highcharts Wrapper</h4>
            <a href="https://github.com/andrefox333/andrefox.io/blob/master/src/components/Charts/TimeSeriesChart.jsx">
              View in Github
            </a>
            <p>
              Custom wrapper for Highcharts. In this example, we are showing two
              different days and their value throughout the day.
            </p>
            <IntlProvider locale="en">
              <TimeSeriesChart
                containerId="reports-chart"
                title="Revenue"
                subtitle="Total revenue roll up for a publisher"
                primaryData={primaryData}
                primaryLabel="Today"
                secondaryData={secondaryData}
                secondaryLabel="Yesterday"
                type="CURRENCY"
              />
            </IntlProvider>
          </div>
          <hr />
          <div className="component-container">
            <h4>Custom Date Selector</h4>
            <a href="https://github.com/andrefox333/andrefox.io/blob/master/src/components/DateSelector/DateSelector.jsx">
              View in Github
            </a>
            <p>
              A custom date selector based off AirBnb's react-date
              SingleDatePicker component.
            </p>
            <DateSelector dateSelectorType="TODAY" applyDateChange={() => {}} />
          </div>
        </div>
      </div>
    );
  }
}
