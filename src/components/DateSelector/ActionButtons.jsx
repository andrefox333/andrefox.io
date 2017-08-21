import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';

export default class ActionButtons extends PureComponent {
  static propTypes = {
    handleCancel: PropTypes.func.isRequired,
    handleApplyDate: PropTypes.func.isRequired
  };

  render() {
    const { handleCancel, handleApplyDate } = this.props;

    return (
      <div className="action-btn-container">
        <Button label="Apply" type="primary" onClick={handleApplyDate} />
        <Button label="Cancel" type="secondary" onClick={handleCancel} />
      </div>
    );
  }
}
