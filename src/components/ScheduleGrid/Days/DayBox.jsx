import React from 'react';
import Boxes from '../Boxes';

/**
 * Day Box
 */
export default class DayBox extends Boxes.Single {
  render() {
    const selectedClassName = this.props.isSelected ? 'selected' : '';

    return (
      <div>
        <div
          style={this.size}
          onClick={this.handleClick}
          className={`select-box side-selection-box ${selectedClassName}`} >
          &nbsp;
        </div>
      </div>
    );
  }
}
