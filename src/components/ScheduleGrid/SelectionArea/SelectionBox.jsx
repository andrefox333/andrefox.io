import React from 'react';
import Boxes from '../Boxes';

/**
 * Schedule Selection Box
 */
export default class SelectionBox extends Boxes.Single {
  render() {
    const selectedClassName = this.props.isSelected ? 'selected' : '';

    return (
      <div
        style={this.size}
        onClick={this.handleClick}
        className={`select-box ${selectedClassName}`}>
        <div className={`item noselect ${selectedClassName}`}>
          &nbsp;
        </div>
      </div>
    );
  }
}
