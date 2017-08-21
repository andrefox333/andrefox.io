import React from 'react';
import PropTypes from 'prop-types';

import BoxContainer from './SelectionBoxContainer';
import Highlight from './Highlight';

/**
 * Schedule Selection Area, the wrapper around all the center boxes
 */
export default class SelectionArea extends React.Component {
  static propTypes = {
    bindElement: PropTypes.func.isRequired,
    scrollPoint: PropTypes.array.isRequired,
    selectionAreaRect: PropTypes.object.isRequired,
    isMouseDown: PropTypes.bool.isRequired,
    startPoint: PropTypes.array.isRequired,
    endPoint: PropTypes.array.isRequired,
    boxStates: PropTypes.arrayOf(PropTypes.bool).isRequired,
    onMouseDown: PropTypes.func.isRequired
  }

  /**
   * Returns css positional properties for the selection highlight
   * @param {Number[]} startPoint
   * @param {Number[]} endPoint
   * @param {Number[]} scrollPoint
   * @param {Rect} parentRect
   */
  static calculateRect(startPoint, endPoint, scrollPoint, parentRect) {
    const X = 0;
    const Y = 1;

    const leftOffset = scrollPoint[X] + parentRect.left;
    const topOffset = scrollPoint[Y] + parentRect.top;

    return {
      left: Math.min(startPoint[X], endPoint[X]) - leftOffset,
      top: Math.min(startPoint[Y], endPoint[Y]) - topOffset,
      width: Math.abs(startPoint[X] - endPoint[X]),
      height: Math.abs(startPoint[Y] - endPoint[Y])
    };
  }

  render() {
    const {
      bindElement,
      scrollPoint,
      selectionAreaRect,
      isMouseDown,
      startPoint,
      endPoint,
      boxStates,
      onMouseDown
    } = this.props;

    const highlightRect = SelectionArea.calculateRect(startPoint, endPoint, scrollPoint, selectionAreaRect);

    return (
      <div className={'selection'} onMouseDown={onMouseDown} ref={bindElement}>
        <BoxContainer boxStates={boxStates} />
        <Highlight isMouseDown={isMouseDown} {...highlightRect} />
      </div>
    );
  }
}
