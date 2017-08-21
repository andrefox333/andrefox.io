import React, { Component } from 'react';
import { IntlProvider } from 'react-intl';
import moment from 'moment';

import logo from './logo.svg';
import './App.css';
import ScheduleGrid from './components/ScheduleGrid/Schedule';
import DateSelector from './components/DateSelector/DateSelector';
import TimeSeriesChart from './components/Charts/TimeSeriesChart';
import series1Json from './components/Charts/mockData/series1.json';
import series2Json from './components/Charts/mockData/series2.json';

class App extends Component {
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
      <div className="app">
        <div className="header">
          <h2>Andre Fox</h2>
          <h4>Developer by Day, Wizard at Night</h4>
        </div>
        <div className="component-examples">
          <div className="component-container">
            <h3>Schedule Grid</h3>
            <p>A schedule grid used to toggle days and time.</p>
            <ScheduleGrid />
          </div>
          <hr />
          <div className="component-container">
            <h3>Highcharts Wrapper</h3>
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
            <h3>Custom Date Selector</h3>
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

export default App;
