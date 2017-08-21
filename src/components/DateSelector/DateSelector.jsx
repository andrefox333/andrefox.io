import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import { SingleDatePicker } from 'react-dates';
import cx from 'classnames';

import Row from '../Row';
import Column from '../Column';

/* Sub-Components Strictly for this Component */
import DropdownSelections from './DropdownSelections';
import ActionButtons from './ActionButtons';

import styles from './date-selector.css';
import 'react-dates/lib/css/_datepicker.css';

export const TODAY = 'TODAY';
export const YESTERDAY = 'YESTERDAY';
export const CUSTOM_DATE = 'CUSTOM_DATE';
export const COMPARE_DATES = 'COMPARE_DATES';
export const DEFAULT_TZ = 'America/Los_Angeles';

const TODAY_IN_MOMENT = moment().tz(DEFAULT_TZ);
const YESTERDAY_IN_MOMENT = TODAY_IN_MOMENT.clone().subtract(1, 'days');
const MOMENT_CALENDAR_CONFIG = {
  lastWeek: 'dddd, MMM DD, YYYY',
  sameElse: 'dddd, MMM DD, YYYY',
  nextWeek: 'dddd, MMM DD, YYYY',
  nextDay: 'dddd, MMM DD, YYYY',
  lastDay: 'dddd, MMM DD, YYYY',
  sameDay: '[Today], MMM DD, YYYY'
};

export default class DateSelector extends Component {
  static propTypes = {
    startOfPickDate: PropTypes.number,
    startOfCompareDate: PropTypes.number,
    applyDateChange: PropTypes.func.isRequired,
    dateSelectorType: PropTypes.string,
    className: PropTypes.string,
    userTimezone: PropTypes.string
  };

  static defaultProps = {
    dateSelectorType: TODAY,
    userTimezone: 'America/Los_Angeles'
  };

  /**
   * Checks the day that is coming from the date picker and will disable the selection if it is a future date.
   * @param {Moment} day
   * @return {Boolean}
   */
  static blockFutureDates(day) {
    /* Don't block today's block */
    if (day.isSame(TODAY_IN_MOMENT, 'day')) return false;
    return day.isAfter(TODAY_IN_MOMENT);
  }

  constructor(props) {
    super(props);
    const startOfPickDate = props.startOfPickDate
      ? moment(props.startOfPickDate)
      : TODAY_IN_MOMENT.clone();
    const startOfCompareDate = props.startOfCompareDate
      ? moment(props.startOfCompareDate)
      : TODAY_IN_MOMENT.clone().subtract(1, 'days');

    /**
     * We'll need to offset to the userTimezone (which is basically browser timezone) to show the proper date format value.
     * This is specially important for Server Side Rendering and how it is UTC there.
     */
    const initialButtonTitle = () => {
      switch (props.dateSelectorType) {
        case CUSTOM_DATE:
          return startOfPickDate
            .clone()
            .utcOffset(props.userTimezone)
            .calendar(null, MOMENT_CALENDAR_CONFIG);

        case YESTERDAY:
          return YESTERDAY_IN_MOMENT.clone()
            .utcOffset(props.userTimezone)
            .calendar(null, MOMENT_CALENDAR_CONFIG);

        case COMPARE_DATES: {
          const firstDate = startOfPickDate
            .clone()
            .utcOffset(props.userTimezone)
            .format('MMM DD, YYYY');

          const secondDate = startOfCompareDate
            .clone()
            .utcOffset(props.userTimezone)
            .format('MMM DD, YYYY');

          return `${firstDate} vs ${secondDate}`;
        }

        case TODAY:
        default:
          return TODAY_IN_MOMENT.clone()
            .utcOffset(props.userTimezone)
            .calendar(null, MOMENT_CALENDAR_CONFIG);
      }
    };

    this.state = {
      activePickDate: startOfPickDate,
      activeCompareDate: startOfCompareDate,
      buttonTitle: initialButtonTitle(),
      compareDate: startOfCompareDate.clone().utcOffset(props.userTimezone),
      compareDateFocus: false,
      dateSelectorType: props.dateSelectorType,
      dropdown: true,
      pickDate: startOfPickDate.clone().utcOffset(props.userTimezone),
      pickDateFocus: true,
      previousDateSelectorType: TODAY,
      today: TODAY_IN_MOMENT.clone().utcOffset(props.userTimezone),
      yesterday: YESTERDAY_IN_MOMENT.clone().utcOffset(props.userTimezone)
    };
  }

  /**
   * Handles the today selection from the selector.
   * Closes the dropdown immediately and calls applyDateChange with today's date.
   */
  onToday = () => {
    const { today } = this.state;
    const { applyDateChange } = this.props;
    this.setState({
      activePickDate: today,
      buttonTitle: this.renderButtonTitle(TODAY),
      dateSelectorType: TODAY,
      dropdown: false,
      previousDateSelectorType: TODAY
    });

    applyDateChange({
      dateSelectorType: TODAY,
      startOfPickDate: today.clone().startOf('day').valueOf(),
      endOfPickDate: today.clone().endOf('day').valueOf() + 1
    });
  };

  /**
   * Handles the yesterday selection from the selector.
   * Closes the dropdown immediately and calls applyDateChange with yesterday's date.
   */
  onYesterday = () => {
    const { yesterday } = this.state;
    const { applyDateChange } = this.props;
    this.setState({
      activePickDate: yesterday,
      buttonTitle: this.renderButtonTitle(YESTERDAY),
      dateSelectorType: YESTERDAY,
      dropdown: false,
      previousDateSelectorType: YESTERDAY
    });

    applyDateChange({
      dateSelectorType: YESTERDAY,
      startOfPickDate: yesterday.clone().startOf('day').valueOf(),
      endOfPickDate: yesterday.clone().endOf('day').valueOf() + 1
    });
  };

  /**
   * Handles the custom date selection from the selector
   * Keeps the dropdown open for UX behavior and it's datepicker
   */
  onCustomDate = () => {
    this.setState({
      dateSelectorType: CUSTOM_DATE,
      dropdown: true,
      pickDateFocus: true,
      compareDateFocus: false
    });
  };

  /**
   * Handles the compare date selection from the selector
   * Keeps the dropdown open for UX behavior and it's datepicker
   */
  onCompareDates = () => {
    this.setState({
      dateSelectorType: COMPARE_DATES,
      dropdown: true,
      pickDateFocus: false,
      compareDateFocus: true
    });
  };

  /**
   * Handles the visibility of the date selector popup.
   * Has logic to hide the popup when clicking outside the component.
   * @param {Boolean} isOpen
   * @param {Object} event
   * @param {Object} {source}
   */
  onToggle = event => {
    // this.setState({ dropdown: !this.state.dropdown });
  };

  /**
   * Toggles the dateSelectorType. It calls the proper function according to the passed dateSelectorType
   * @param {String} dateSelectorType
   */
  onSelect = dateSelectorType => {
    const dateTypeMap = {
      TODAY: this.onToday,
      YESTERDAY: this.onYesterday,
      CUSTOM_DATE: this.onCustomDate,
      COMPARE_DATES: this.onCompareDates
    };
    dateTypeMap[dateSelectorType]();
  };

  onClick = type => {
    const { dropdown } = this.state;

    /* Checking the dateSelectorType ensures that the proper date picker is visible when the dropdown is open */
    this.setState({
      // dropdown: !dropdown,
      pickDateFocus: type === CUSTOM_DATE,
      compareDateFocus: type === COMPARE_DATES,
      dateSelectorType: type
    });
  };

  /**
   * Sets the pickDate's visible month to a before month as the first month and selected month as the second month.
   */
  setPickDateVisibleMonth = () => {
    const { pickDate } = this.state;
    return pickDate.clone().subtract(1, 'month');
  };

  /**
   * Sets the compareDate's visible month to a before month as the first month and selected month as the second month.
   */
  setCompareDateVisibleMonth = () => {
    const { compareDate } = this.state;
    return compareDate.clone().subtract(1, 'month');
  };

  /* Sets the proper to display the pick date picker */
  pickDateFocusChange = () => {
    this.setState({
      pickDateFocus: true,
      compareDateFocus: false
    });
  };

  /* Sets the proper states to display the compare date picker*/
  compareDateFocusChange = () => {
    this.setState({
      pickDateFocus: false,
      compareDateFocus: true
    });
  };

  /**
   * Returns an input label if the date is Today or Yesterday.
   * Otherwise return a input label in the format of MM/DD/YYYY
   * @param {String} dateType - Could be pickDate or compareDate
   * @return {String} Today|Yesterday|MM/DD/YYYY
   */
  inputDisplayFormat = (dateType = 'pickDate') => {
    const { today } = this.state;
    const startOfToday = today.clone().startOf('day');
    const startOfSelectedDay = this.state[dateType].clone().startOf('day');

    if (startOfSelectedDay.isSame(startOfToday, 'day')) return '[Today]';
    if (startOfSelectedDay.diff(startOfToday, 'days') === -1)
      return '[Yesterday]';

    return 'MM/DD/YYYY';
  };

  /**
   * Enables the react-date component to render the selected pickDate on the same component as the compare date.
   */
  showPickDate = day => {
    const { pickDate } = this.state;
    return pickDate.isSame(day, 'day');
  };

  /**
   * Gives the react-date component the ability to render the compare date on the same component as the pick date
   * @param {Moment} day
   */
  showCompareDate = day => {
    const { compareDate, dateSelectorType } = this.state;
    /* Only show the compare date in the date picker when the user is on COMPARE_DATES */
    if (dateSelectorType === COMPARE_DATES)
      return compareDate.isSame(day, 'day');
    return false;
  };

  /**
   * Handles the Apply action button. Sets the activePickDate and hides the dropdown.
   * Also renders the appropriate button title.
   */
  handleApplyDate = () => {
    const { compareDate, pickDate, dateSelectorType } = this.state;
    const { applyDateChange } = this.props;

    this.setState({
      previousDateSelectorType: dateSelectorType,
      activePickDate: pickDate,
      dropdown: false,
      buttonTitle: this.renderButtonTitle()
    });

    const dates = {
      dateSelectorType,
      startOfPickDate: pickDate.clone().startOf('day').valueOf(),
      endOfPickDate: pickDate.clone().endOf('day').valueOf() + 1
    };

    if (dateSelectorType === COMPARE_DATES) {
      dates.startOfCompareDate = compareDate.clone().startOf('day').valueOf();
      dates.endOfCompareDate = compareDate.clone().endOf('day').valueOf() + 1;
      this.setState({ activeCompareDate: compareDate });
    }

    applyDateChange(dates);
  };

  /**
   * Resets the date selector view back to the previous selections, even the dates.
   */
  handleCancel = () => {
    const {
      activePickDate,
      activeCompareDate,
      previousDateSelectorType
    } = this.state;

    this.setState({
      dateSelectorType: previousDateSelectorType,
      dropdown: false,
      pickDate: activePickDate,
      compareDate: activeCompareDate
    });
  };

  /**
   * Renders the title/label for the button
   * @param {String} dayType
   */
  renderButtonTitle = dayType => {
    const {
      today,
      yesterday,
      dateSelectorType,
      pickDate,
      compareDate
    } = this.state;

    /* Use dayType instead of a callback or timeout so state is set before calling this function */
    if (dayType === TODAY) return today.calendar(null, MOMENT_CALENDAR_CONFIG);
    if (dayType === YESTERDAY)
      return yesterday.calendar(null, MOMENT_CALENDAR_CONFIG);

    /* If COMPARE_DATES, the format of the title is 'Feb 21, 2017 vs Feb 22, 2017' */
    if (dateSelectorType === COMPARE_DATES) {
      const firstDate = pickDate.format('MMM DD, YYYY');
      const secondDate = compareDate.format('MMM DD, YYYY');
      return `${firstDate} vs ${secondDate}`;
    }

    return pickDate.calendar(null, MOMENT_CALENDAR_CONFIG);
  };

  render() {
    const {
      pickDate,
      compareDate,
      dropdown,
      pickDateFocus,
      compareDateFocus,
      dateSelectorType
    } = this.state;

    const { className } = this.props;

    const containerClassName = cx('date-selector-container', {
      [className]: className,
      'custom-date': dateSelectorType === CUSTOM_DATE,
      'compare-dates': dateSelectorType === COMPARE_DATES
    });

    const showDatePicker =
      dropdown &&
      (dateSelectorType === CUSTOM_DATE || dateSelectorType === COMPARE_DATES);

    return (
      <div className={containerClassName}>
        <DropdownSelections
          {...this.state}
          toggle={this.onToggle}
          onSelect={this.onSelect}
          onClick={this.onClick}
        />

        {showDatePicker &&
          <Row extraClasses="date-picker-container">
            <Column colSize={4} offset="left">
              <div className="date-picker-input-group">
                {/* Container for the pick date input and it's date picker component */}
                <div className="pick-date-container">
                  <label htmlFor="pick-date-picker">Pick Date</label>
                  <SingleDatePicker
                    initialVisibleMonth={this.setPickDateVisibleMonth}
                    id="pick-date-picker"
                    date={pickDate}
                    displayFormat={this.inputDisplayFormat('pickDate')}
                    onDateChange={date => this.setState({ pickDate: date })}
                    focused={pickDateFocus}
                    isOutsideRange={DateSelector.blockFutureDates}
                    isDayHighlighted={this.showCompareDate}
                    onFocusChange={this.pickDateFocusChange}
                  />
                </div>
                {/* Container for the compare date input and it's date picker component */
                dateSelectorType === COMPARE_DATES &&
                  <div className="compare-date-container">
                    <label htmlFor="compare-date-picker">Compare Date</label>
                    <SingleDatePicker
                      initialVisibleMonth={this.setCompareDateVisibleMonth}
                      id="compare-date-picker"
                      date={compareDate}
                      displayFormat={this.inputDisplayFormat('compareDate')}
                      onDateChange={date =>
                        this.setState({ compareDate: date })}
                      focused={compareDateFocus}
                      isOutsideRange={DateSelector.blockFutureDates}
                      isDayHighlighted={this.showPickDate}
                      onFocusChange={this.compareDateFocusChange}
                    />
                  </div>}
              </div>

              <ActionButtons
                handleApplyDate={this.handleApplyDate}
                handleCancel={this.handleCancel}
              />
            </Column>
          </Row>}
      </div>
    );
  }
}
