import React from 'react';

import Boxes from '../Boxes';
import HourBox from './HourBox';

/**
 * Hour Box Container
 * @class
 * @param {Object} props
 */
const HourBoxContainer = props =>
  <Boxes.Container Box={HourBox} className="top-selection-boxes" {...props} />;

export default HourBoxContainer;
