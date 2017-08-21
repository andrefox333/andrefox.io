import React from 'react';
import Boxes from '../Boxes';
import DayBox from './DayBox';

/**
 * Selection Box Container
 * @class
 * @param {Object} props
 */
const DayBoxContainer = props =>
  <Boxes.Container Box={DayBox} className="side-selection-boxes" {...props} />;

export default DayBoxContainer;
