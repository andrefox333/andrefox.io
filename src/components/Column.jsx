import React from 'react';
import PropTypes from 'prop-types';
import setClassNames from 'classnames';

const Column = ({ children, colSize, hasOffSet, lineBreak, offset }) =>
  <div
    className={setClassNames(
      `col-xs-${colSize}`,
      `col-sm-${colSize}`,
      `col-md-${colSize}`,
      `col-lg-${colSize}`,
      {
        'ml-auto': offset === 'left',
        'mr-auto': offset === 'right'
      }
    )}
  >
    {children}
    {lineBreak && <hr />}
  </div>;

Column.propTypes = {
  children: PropTypes.node,
  colSize: PropTypes.number.isRequired,
  lineBreak: PropTypes.bool,
  offset: PropTypes.oneOf(['left', 'right'])
};

export default Column;
