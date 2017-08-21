import React from 'react';
import PropTypes from 'prop-types';

import { WIDTH, HEIGHT } from './constants';

/**
 * Box
 * render() method must be implemented when extending
 */
class BoxSingle extends React.PureComponent {
  static propTypes = {
    index: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired
  }

  static defaultProps = {
    className: ''
  }

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

    this.size = {
      width: `${WIDTH}px`,
      height: `${HEIGHT}px`
    };
  }

  handleClick(event) {
    event.preventDefault();
    event.stopPropagation();
    return this.props.onClick(this.props.index);
  }
}

export default BoxSingle;
