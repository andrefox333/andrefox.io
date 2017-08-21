import React from 'react';
import PropTypes from 'prop-types';
import setClassnames from 'classnames';

/**
 * Renders a styled button to the page.
 * */
const Button = ({
  className,
  extraClasses,
  isDisabled,
  fullWidth,
  onClick,
  size,
  type,
  label,
  id
}) =>
  <button
    id={id}
    type="button"
    className={setClassnames('btn', {
      [`btn-${type}`]: true,
      [`${extraClasses}`]: !!extraClasses,
      [`${className}`]: !!className,
      [`${size}-size`]: true,
      'disabled-button': isDisabled,
      'full-width': fullWidth
    })}
    onClick={onClick}
    disabled={isDisabled}
  >
    {label}
  </button>;

Button.propTypes = {
  className: PropTypes.string,
  extraClasses: PropTypes.string,
  fullWidth: PropTypes.bool,
  id: PropTypes.string,
  isDisabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'responsive']),
  type: PropTypes.oneOf([
    'primary',
    'action',
    'utility',
    'control',
    'disabled',
    'default',
    'delete',
    'secondary'
  ])
};

Button.defaultProps = {
  label: 'Button Default',
  size: 'md',
  type: 'primary'
};

export default Button;
