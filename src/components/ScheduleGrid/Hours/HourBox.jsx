import React from 'react';
import Boxes from '../Boxes';

/**
 * Hour Box
 */
export default class HourBox extends Boxes.Single {
  render() {
    const selectedClassName = this.props.isSelected ? 'selected' : '';

    return (
      <div
        style={this.size}
        onClick={this.handleClick}
        className={`select-box top-selection-box ${selectedClassName}`}>
        &nbsp;
      </div>
    );
  }
}
