import React from 'react';
import PropTypes from 'prop-types';

import _fill from 'lodash/fp/fill';
import _throttle from 'lodash/fp/throttle';

import Row from '../Row';
import Column from '../Column';
import Hours from './Hours';
import Days from './Days';
import Legend from './Legend';
import SelectionArea from './SelectionArea/SelectionArea';

import Boxes from './Boxes';

import styles from './schedule-grid.css';

/**
 * Box dimensions expressed as the top-left origin
 * @typedef {Object} Rect
 * @property {number} top - origin y coordinate
 * @property {number} left - origin x coordinate
 * @property {number} width - box width
 * @property {number} height - box height
 */

/**
 * Box dimensions expressed as outer most coordinate
 * @typedef {Object} RLTB
 * @property {number} right - box's right x coordinate
 * @property {number} left - box's left x coordinate
 * @property {number} top - box's top y coordinate
 * @property {number} bottom - box's bottom y coordinate
 */

/**
 * Main Selection Data Structure
 * @typedef {boolean[]} BoxArray
 */

/**
 * Coordinate value as [x, y]
 * @typedef {number[]} Point
 */

const DAYS_IN_WEEK = 7;
const HOURS_IN_DAY = 24;
const HOURS_IN_WEEK = 168;

/** @type {BoxArray} */
const DAY_BOX_STATES = _fill(0, DAYS_IN_WEEK, false, Array(DAYS_IN_WEEK));
/** @type {BoxArray} */
const HOUR_BOX_STATES = _fill(0, HOURS_IN_DAY, false, Array(HOURS_IN_DAY));
/** @type {BoxArray} */
const SELECTION_BOX_STATES = _fill(
  0,
  HOURS_IN_WEEK,
  false,
  Array(HOURS_IN_WEEK)
);

/**
 * Schedule Component
 */
class Schedule extends React.Component {
  static propTypes = {
    /** @type {function} onChange - fired when selection data changes */
    onChange: PropTypes.func,

    /** @type {BoxArray} data - schedule data */
    data: PropTypes.arrayOf(PropTypes.bool)
  };

  static defaultProps = {
    /** @type {function} onChange - fired when selection data changes */
    onChange: d => console.log('onchange', d[0]),

    /** @type {BoxArray} data - schedule data */
    data: []
  };

  /**
   * Returns a mappable function that can be applied to selection box states
   * @param {BoxArray} existingBoxStates - old box states
   * @return {append~mappable} - the returned function
   */
  static append(existingBoxStates) {
    /**
     * Mappable function for appending selection box states to old box states
     * @param {boolean} selected - is box selected
     * @param {number} i - box index
     */
    const mappable = (selected, i) => selected || existingBoxStates[i];
    return mappable;
  }

  /**
   * Returns a mappable function that can be applied to selection box states
   * @param {BoxArray} existingBoxStates - old box states
   * @return {remove~mappable} - the returned function
   */
  static remove(existingBoxStates) {
    /**
     * Mappable function for appending selection box states to old box states
     * @param {boolean} selected - is box selected
     * @param {number} i - box index
     */
    const mappable = (selected, i) => (selected ? false : existingBoxStates[i]);
    return mappable;
  }

  /**
   * Merges to SelectionBoxStates by either combining or excluding BoxStates
   * @param {boolean} append - determines whether to combine or exclude
   * @param {BoxArray} selectionBoxStates
   * @param {BoxArray} existingBoxStates
   * @return {BoxArray}
   */
  static merge(append, selectionBoxStates, existingBoxStates) {
    const merge = append
      ? Schedule.append(existingBoxStates)
      : Schedule.remove(existingBoxStates);

    return selectionBoxStates.map(merge);
  }

  /**
   * Creates RLTB object from a Rect
   * @param {Rect} rectangle
   * @returns {RLTB}
   */
  static getRLTB({ left, top, width, height }) {
    return {
      left,
      top,
      right: left + width,
      bottom: top + height
    };
  }

  /**
   * Returns true if a selection RLTB overlaps a boxRLTB
   * @property {RLTB} selection - highlight RLTB
   * @property {RLTB} box - box RLTB
   * @return {boolean}
   */
  static checkOverlap(selection, box) {
    return (
      selection.left <= box.right &&
      selection.right >= box.left &&
      selection.top <= box.bottom &&
      selection.bottom >= box.top
    );
  }

  /**
   * Returns BoxArray of boxes set to true where the selection overlaps existing boxes
   * @param {Rect} selectionRect
   * @param {BoxArray} boxStates
   * @return {BoxArray}
   */
  static getCollidingBoxes(selectionRect, boxStates) {
    const selectionRLTB = Schedule.getRLTB(selectionRect);

    return boxStates.map((box, i) => {
      const row = Math.floor(i / HOURS_IN_DAY);
      const column = Math.floor(i - row * HOURS_IN_DAY);

      // instead of getting these positions from the DOM we can calculate them
      // by using the known width and height
      const boxRect = {
        left: Boxes.PADDING_LEFT + column * Boxes.FULL_WIDTH,
        top: Boxes.PADDING_TOP + row * Boxes.FULL_HEIGHT,
        width: Boxes.WIDTH,
        height: Boxes.HEIGHT
      };

      return Schedule.checkOverlap(selectionRLTB, Schedule.getRLTB(boxRect));
    });
  }

  /**
   * Returns information of the first box where an overlap happened
   * @param {Rect} selectionRect
   * @param {BoxArray} boxStates
   * @return {{ selected: boolean, index: number }}
   */
  static getCollidingBox(selectionRect, boxStates) {
    const selectionRLTB = Schedule.getRLTB(selectionRect);

    return boxStates.reduce((match, box, i) => {
      if (match) return match;

      const row = Math.floor(i / HOURS_IN_DAY);
      const column = Math.floor(i - row * HOURS_IN_DAY);
      const boxRect = {
        left: Boxes.PADDING_LEFT + column * Boxes.FULL_WIDTH,
        top: Boxes.PADDING_TOP + row * Boxes.FULL_HEIGHT,
        width: Boxes.WIDTH,
        height: Boxes.HEIGHT
      };

      const selectionContainsBox = Schedule.checkOverlap(
        selectionRLTB,
        Schedule.getRLTB(boxRect)
      );

      return selectionContainsBox ? { selected: box, index: i } : null;
    }, null);
  }

  /**
   * Returns the current scroll position as a point
   * @returns {Point}
   */
  static getScrollPoint() {
    return [window.scrollX, window.scrollY];
  }

  constructor(props) {
    super(props);

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);

    this.handleModifierKey = this.handleModifierKey.bind(this);

    this.handleDayBoxClick = this.handleDayBoxClick.bind(this);
    this.handleHourBoxClick = this.handleHourBoxClick.bind(this);

    let selectionBoxStates = SELECTION_BOX_STATES.slice();

    // if props.data is passed, merge that array with a clean BoxArray
    if (props.data && props.data.length === HOURS_IN_WEEK) {
      selectionBoxStates = Schedule.merge(true, props.data, selectionBoxStates);
    }

    this.state = {
      selectionBoxStates,
      lastDataPushed: [],
      dayBoxStates: DAY_BOX_STATES.slice(),
      hourBoxStates: HOUR_BOX_STATES.slice(),
      tempSelectionBoxStates: SELECTION_BOX_STATES.slice(),
      mouseDown: false,
      mouseMoved: false,
      append: true,
      startPoint: [0, 0],
      endPoint: [0, 0],
      scrollPoint: [0, 0],
      selectionAreaRect: {
        top: 0,
        left: 0,
        width: 0,
        height: 0
      }
    };
  }

  /**
   * Attaches global event listeners
   */
  componentWillMount() {
    window.document.addEventListener('keydown', this.handleModifierKey);
    window.document.addEventListener('keyup', this.handleModifierKey);
  }

  /**
   * Updates internal state if a new props.data is passed in
   * @param {Object} nextProps
   */
  componentWillReceiveProps(nextProps) {
    if (!Boxes.Container.compareBoxStates(this.props.data, nextProps.data)) {
      this.setState((state, props) => {
        const nextDataIsValid =
          props.data && props.data.length === HOURS_IN_WEEK;
        return {
          selectionBoxStates: nextDataIsValid
            ? Schedule.merge(true, nextProps.data, SELECTION_BOX_STATES.slice())
            : state.selectionBoxStates
        };
      });
    }
  }

  /**
   * Detaches global + selectionArea handlers, even during a selection
   */
  componentWillUnmount() {
    this.detachEventHandlers();
    window.document.removeEventListener('keydown', this.handleModifierKey);
    window.document.removeEventListener('keyup', this.handleModifierKey);
  }

  /**
   * Retrieves the BoundingClientRect from the selectionArea DOM node
   * @returns {Rect}
   */
  getSelectionAreaRect() {
    const {
      top,
      left,
      width,
      height
    } = this.selectionArea.getBoundingClientRect();
    return { top, left, width, height };
  }

  /**
   * Attaches throttled mouse-based event listeners
   */
  attachEventHandlers() {
    // assuming 60 fps, 1sec / 60f = 16ms
    const frameDuration = 16;
    this.detachEventHandlers();

    this.throttledMove = _throttle(frameDuration, this.handleMouseMove);
    this.throttledScroll = _throttle(frameDuration, this.handleScroll);

    window.document.addEventListener('scroll', this.throttledScroll);
    window.document.addEventListener('mousemove', this.throttledMove);
    window.document.addEventListener('mouseup', this.handleMouseUp);
  }

  /**
   * Detaches mouse-based event listeners
   */
  detachEventHandlers() {
    window.document.removeEventListener('scroll', this.throttledScroll);
    window.document.removeEventListener('mousemove', this.throttledMove);
    window.document.removeEventListener('mouseup', this.handleMouseUp);
  }

  /**
   * Callback used for onKeyDown AND onKeyUp
   * @param {Event} event
   */
  handleModifierKey(event) {
    this.setState(() => ({
      append: !event.shiftKey
    }));
  }

  /**
   * Callback used for mouseDown events within the selectionArea
   * Sets up state for a new selection
   * @param {Event} event
   */
  handleMouseDown(event) {
    const RIGHT_CLICK = 2;
    const { button, pageX, pageY, nativeEvent } = event;

    if (button === RIGHT_CLICK || nativeEvent.which === RIGHT_CLICK) return;

    event.preventDefault();
    event.stopPropagation();

    this.setState(() => ({
      mouseDown: true,
      startPoint: [pageX, pageY],
      endPoint: [pageX, pageY],
      scrollPoint: Schedule.getScrollPoint(),
      selectionAreaRect: this.getSelectionAreaRect()
    }));

    this.attachEventHandlers();
  }

  /**
   * Callback used for scroll events
   * Sets state for a continuing selection
   * @param {Event} event
   */
  handleScroll(event) {
    const scrollPoint = Schedule.getScrollPoint();
    const selectionAreaRect = this.getSelectionAreaRect();

    event.preventDefault();
    event.stopPropagation();

    this.setState(state => {
      // Calculate and store the new dimensions of new selection
      const selectionRect = SelectionArea.calculateRect(
        state.startPoint,
        state.endPoint,
        scrollPoint,
        selectionAreaRect
      );

      // Calculate a new BoxArray based on the new SelectionRect and the existing SelectionBoxArray
      const tempSelectionBoxStates = Schedule.getCollidingBoxes(
        selectionRect,
        state.tempSelectionBoxStates
      );

      return {
        scrollPoint,
        selectionAreaRect,
        selectionRect,
        tempSelectionBoxStates
      };
    });
  }

  /**
   * Callback used for mouseMove events
   * Sets state for a continuing selection
   * @param {Event} event
   */
  handleMouseMove(event) {
    const { pageX, pageY } = event;
    const endPoint = [pageX, pageY];

    event.preventDefault();
    event.stopPropagation();

    this.setState(state => {
      // Calculate and store the new dimensions of new selection
      const selectionRect = SelectionArea.calculateRect(
        state.startPoint,
        endPoint,
        state.scrollPoint,
        state.selectionAreaRect
      );

      // Calculate a new BoxArray based on the new SelectionRect and the existing SelectionBoxArray
      const tempSelectionBoxStates = Schedule.getCollidingBoxes(
        selectionRect,
        state.tempSelectionBoxStates
      );

      return {
        endPoint,
        selectionRect,
        tempSelectionBoxStates,
        mouseMoved: true
      };
    });
  }

  /**
   * Callback used for mouseUp events
   * Calculates the final box selection
   * Updates and resets the state accordingly
   */
  handleMouseUp() {
    this.setState(state => {
      // get a copy of the existing states
      let selectionBoxStates = state.selectionBoxStates.slice();

      // if the mouse hasn't moved
      if (!state.mouseMoved) {
        // treat this selection as a click and flip the state of the box that was clicked
        const selectionRect = SelectionArea.calculateRect(
          state.startPoint,
          state.endPoint,
          state.scrollPoint,
          state.selectionAreaRect
        );
        const clickedBox = Schedule.getCollidingBox(
          selectionRect,
          state.selectionBoxStates
        );

        // if a box was clicked on, update the specific state at that box's index
        if (clickedBox)
          selectionBoxStates[clickedBox.index] = !clickedBox.selected;

        // if the mouse has moved
      } else {
        // update the overlapped area according to the current append state
        selectionBoxStates = Schedule.merge(
          state.append,
          state.tempSelectionBoxStates,
          state.selectionBoxStates
        );
      }

      return {
        selectionBoxStates,
        tempSelectionBoxStates: SELECTION_BOX_STATES.slice(),
        mouseDown: false,
        mouseMoved: false,
        startPoint: [0, 0],
        endPoint: [0, 0]
      };
    }, this.updateBorderBoxes);

    this.detachEventHandlers();
  }

  /**
   * Callback used to handle clicks of the edge day boxes
   * Sets the selectionBoxStates and triggers a re-calculation for all edge boxes
   * @param {number} dayBoxIndex - index of row
   */
  handleDayBoxClick(dayBoxIndex) {
    this.setState(state => {
      const { dayBoxStates, selectionBoxStates } = state;

      const newSelectionState = !dayBoxStates[dayBoxIndex];
      const newSelectionBoxState = selectionBoxStates.slice();

      // for as many hours there are in the day
      for (let hourIndex = 0; hourIndex < HOURS_IN_DAY; hourIndex += 1) {
        // apply the newSelectionState to all hours in that day
        newSelectionBoxState[
          dayBoxIndex * HOURS_IN_DAY + hourIndex
        ] = newSelectionState;
      }

      return { selectionBoxStates: newSelectionBoxState };
    }, this.updateBorderBoxes);
  }

  /**
   * Callback used to handle clicks of the edge hour boxes
   * Sets the selectionBoxStates and triggers a re-calculation for all edge boxes
   * @param {number} hourBoxIndex - index of column
   */
  handleHourBoxClick(hourBoxIndex) {
    this.setState(state => {
      const { hourBoxStates, selectionBoxStates } = state;

      const newSelectionState = !hourBoxStates[hourBoxIndex];
      const newSelectionBoxStates = selectionBoxStates.slice();

      // for as many days there are in a week
      for (let dayIndex = 0; dayIndex < DAYS_IN_WEEK; dayIndex += 1) {
        // apply the newSelectionState to all hours in that day
        newSelectionBoxStates[
          dayIndex * HOURS_IN_DAY + hourBoxIndex
        ] = newSelectionState;
      }

      return { selectionBoxStates: newSelectionBoxStates };
    }, this.updateBorderBoxes);
  }

  /**
   * Calculates and updates the edge boxes (hour, day) based on the current state of the selectionBoxStates
   * Triggers notification to the parent
   */
  updateBorderBoxes() {
    this.setState(state => {
      const { selectionBoxStates } = state;

      /**
       * Mappable function for checking that all days for a given hour's column are true
       * @param {boolean} selected - is box selected
       * @param {number} hourIndex - box index (column)
       */
      function areAllDaysChecked(selected, hourIndex) {
        let filled = true;
        for (let dayIndex = 0; dayIndex < DAYS_IN_WEEK; dayIndex += 1) {
          filled =
            filled && selectionBoxStates[dayIndex * HOURS_IN_DAY + hourIndex];
        }
        return filled;
      }

      /**
       * Mappable function for checking that all hours for a given day's row are true
       * @param {boolean} selected - is box selected
       * @param {number} dayIndex - box index (row)
       */
      function areAllHoursChecked(selected, dayIndex) {
        let filled = true;
        for (let hourIndex = 0; hourIndex < HOURS_IN_DAY; hourIndex += 1) {
          filled =
            filled && selectionBoxStates[dayIndex * HOURS_IN_DAY + hourIndex];
        }
        return filled;
      }

      // for all hours in a day, are all the days in that hour column checked
      const hourBoxStates = HOUR_BOX_STATES.map(areAllDaysChecked);

      // for all days in a week, are all the hours in that day row checked
      const dayBoxStates = DAY_BOX_STATES.map(areAllHoursChecked);

      return {
        hourBoxStates,
        dayBoxStates
      };
    }, this.fireChange);
  }

  /**
   * Fires the onChange callback passed in as a prop,
   * but first check to see if data has changed
   */
  fireChange() {
    const { onChange } = this.props;
    const { selectionBoxStates, lastDataPushed } = this.state;

    // compare the previous state emitted
    const match = Boxes.Container.compareBoxStates(
      selectionBoxStates,
      lastDataPushed
    );

    // if there has been a change
    if (!match) {
      this.setState(
        () => ({ lastDataPushed: selectionBoxStates }), // update the internal state
        onChange(selectionBoxStates) // then call the external function
      );
    }
  }

  /**
   * Render the main Schedule component
   */
  render() {
    const {
      dayBoxStates,
      hourBoxStates,
      tempSelectionBoxStates,
      selectionBoxStates,
      mouseDown,
      append,
      startPoint,
      endPoint,
      scrollPoint,
      selectionAreaRect
    } = this.state;

    let combinedStates = selectionBoxStates;

    // if the mouse is down
    if (mouseDown) {
      // create a new view of the data with the existing selection and the new temp selection
      combinedStates = Schedule.merge(
        append,
        tempSelectionBoxStates,
        selectionBoxStates
      );
    }

    return (
      <div className="container">
        <Row>
          <Column colSize={10} offset="left">
            <Hours.Labels />
            <Hours.Boxes
              boxStates={hourBoxStates}
              onBoxClick={this.handleHourBoxClick}
            />
          </Column>
        </Row>
        <Row>
          <Column colSize={2}>
            <Days.Labels />
          </Column>
          <Column colSize={10}>
            <Days.Boxes
              boxStates={dayBoxStates}
              onBoxClick={this.handleDayBoxClick}
            />
            <SelectionArea
              bindElement={selectionArea => {
                this.selectionArea = selectionArea;
              }}
              scrollPoint={scrollPoint}
              selectionAreaRect={selectionAreaRect}
              isMouseDown={mouseDown}
              startPoint={startPoint}
              endPoint={endPoint}
              boxStates={combinedStates}
              onMouseDown={this.handleMouseDown}
            />
          </Column>
        </Row>
        <Row>
          <Column colSize={10} offset="left">
            <Legend />
          </Column>
        </Row>
      </div>
    );
  }
}

export default Schedule;
