import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { TODAY, YESTERDAY, COMPARE_DATES, CUSTOM_DATE } from './DateSelector';

export default class DropdownSelections extends PureComponent {
  static propTypes = {
    buttonTitle: PropTypes.string.isRequired,
    dropdown: PropTypes.bool.isRequired,
    dateSelectorType: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    toggle: PropTypes.func
  };

  render() {
    const {
      buttonTitle,
      dropdown,
      dateSelectorType,
      onSelect,
      onClick,
      toggle
    } = this.props;
    return (
      <Dropdown isOpen={dropdown} toggle={toggle} id="date-range-component">
        <DropdownToggle color="primary" caret>
          {buttonTitle}
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem
            onClick={() => onClick('TODAY')}
            active={dateSelectorType === TODAY}
          >
            Today
          </DropdownItem>

          <DropdownItem
            onClick={() => onClick('YESTERDAY')}
            active={dateSelectorType === YESTERDAY}
          >
            Yesterday
          </DropdownItem>

          <DropdownItem
            onClick={() => onClick('CUSTOM_DATE')}
            active={dateSelectorType === CUSTOM_DATE}
          >
            CustomDate
          </DropdownItem>

          <DropdownItem
            onClick={() => onClick('COMPARE_DATES')}
            active={dateSelectorType === COMPARE_DATES}
          >
            Compare Dates
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }
}
