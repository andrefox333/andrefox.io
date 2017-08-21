import React from 'react';
import PropTypes from 'prop-types';
import setClassNames from 'classnames';

const Row = ({ children, extraClasses, className, lineBreak }) =>
  <div>
    <div
      className={setClassNames('row', {
        [extraClasses]: extraClasses,
        [className]: className
      })}
    >
      {children}
    </div>
    {lineBreak && <hr />}
  </div>;

Row.propTypes = {
  children: PropTypes.node.isRequired,
  extraClasses: PropTypes.string,
  className: PropTypes.string,
  lineBreak: PropTypes.bool
};

export default Row;
