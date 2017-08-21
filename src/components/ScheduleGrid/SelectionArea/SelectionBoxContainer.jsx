import React from 'react';

import Boxes from '../Boxes';
import SelectionBox from './SelectionBox';

const noop = () => {};

/**
 * Selection Box Container
 * @class
 * @param {Object} props
 */
const SelectionBoxContainer = props =>
  <Boxes.Container Box={SelectionBox} onBoxClick={noop} {...props} />;

export default SelectionBoxContainer;
