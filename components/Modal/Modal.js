import React, { Component, PropTypes } from 'react';
import cx from 'classnames';

const styles = require('./Modal.scss');

export class Modal extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
      PropTypes.string
    ]),
    className: PropTypes.string,
    showModalState: PropTypes.bool,
  }

  render() {
    const {showModalState, className} = this.props;
    return (
      <div>
        {
          showModalState ?
            <div className={cx(styles.modal, className)}>
              <p className="shade"></p>
              <section>{this.props.children}</section>
            </div>
          : ''
        }
      </div>
    );
  }
}

/**
  * modal header
  */
export class ModalHeader extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
      PropTypes.string
    ]),
    onHide: PropTypes.func,
    showCloseBtn: PropTypes.bool
  }

  clickHide() {
    this.props.onHide();
  }

  render() {
    const {showCloseBtn} = this.props;
    return (
      <header>
        {this.props.children}
        {
          showCloseBtn ?
            <button onClick={this.clickHide.bind(this)}>*</button>
          : ''
        }
      </header>
    );
  }
}

/**
  * modal footer
  */
export class ModalFooter extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
      PropTypes.string
    ]),
  }
  render() {
    return (
      <footer className="flex">{this.props.children}</footer>
    );
  }
}
