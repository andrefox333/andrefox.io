import React from 'react';
import PropTypes from 'prop-types';

/**
 * Box Container
 * Wraps boxes with a simple div and optimizes shouldComponentUpdate
 * by comparing the old state with the incoming state
 */
export default class BoxContainer extends React.Component {
  static propTypes = {
    Box: PropTypes.func,
    className: PropTypes.string,
    boxStates: PropTypes.array.isRequired,
    onBoxClick: PropTypes.func.isRequired
  }

  /**
   * Returns true if both BoxArrays are equal
   * @param {BoxArray} boxStatesA
   * @param {BoxArray} boxStatesB
   */
  static compareBoxStates(boxStatesA, boxStatesB) {
    if (boxStatesA.length !== boxStatesB.length) return false;

    for (let i = 0; i <= boxStatesB.length - 1; i += 1) {
      if (boxStatesA[i] !== boxStatesB[i]) return false;
    }

    return true;
  }

  shouldComponentUpdate(nextProps) {
    return !BoxContainer.compareBoxStates(this.props.boxStates, nextProps.boxStates);
  }

  render() {
    const { Box, className, boxStates, onBoxClick } = this.props;

    return (
      <div className={className}>
        {
          boxStates.map((isSelected, index) =>
            <Box
              key={index}
              index={index}
              isSelected={isSelected}
              onClick={onBoxClick} />
          )
        }
      </div>
    );
  }
}
