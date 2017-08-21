import React from 'react';
import PropTypes from 'prop-types';

/**
 * Selection Highlight
 *
 * width and height transformations are done using CSS transforms
 * instead of DOM attributes (width, hight) to enable the use of GPU rendering
 *
 * opacity is used to hide the div instead of display:none to prevent the node
 * from being removed and added to the DOM
 */
export default class Highlight extends React.PureComponent {
  static propTypes = {
    isMouseDown: PropTypes.bool.isRequired,
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }

  render() {
    const {
      isMouseDown,
      left,
      top,
      width,
      height
    } = this.props;

    const calculatedStyle = {
      left,
      top,
      width: 1,
      height: 1,
      transformOrigin: 'top right',
      transform: `scale(${-width}, ${height})`,
      opacity: isMouseDown ? 1 : 0
    };

    return (
      <div className="selection-border" style={calculatedStyle}>
        &nbsp;
      </div>
    );
  }
}
