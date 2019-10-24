/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
* Copyright 2019 Adobe
* All Rights Reserved.
*
* NOTICE: All information contained herein is, and remains
* the property of Adobe and its suppliers, if any. The intellectual
* and technical concepts contained herein are proprietary to Adobe
* and its suppliers and are protected by all applicable intellectual
* property laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe.
**************************************************************************/

import classNames from 'classnames';
import {cloneIcon} from '../../utils/icon';
import convertUnsafeMethod from '../../utils/convertUnsafeMethod';
import createId from '../../utils/createId';
import filterDOMProps from '../../utils/filterDOMProps';
import focusRing from '../../utils/focusRing';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

/**
 * An individual tab in a TabList or TabView
 */
@convertUnsafeMethod
@focusRing
export default class Tab extends Component {
  static displayName = 'Tab';

  static propTypes = {
    /** Class to add to tab */
    className: PropTypes.string,

    /** Whether the tab should be disabled or not */
    disabled: PropTypes.bool,

    /** Icon to add to tab */
    icon: PropTypes.object,

    /** Whether to disable the invalid icon on the tab */
    invalid: PropTypes.bool,

    /** Tab label */
    label: PropTypes.string,

    /** Whether to render children in the tab */
    renderChildren: PropTypes.bool,

    /** Whether the tab is selected */
    selected: PropTypes.bool,

    /** Index of the tab in the grouping */
    tabIndex: PropTypes.number
  };

  static defaultProps = {
    disabled: false,
    invalid: false,
    selected: false,
    tabIndex: 0,
    renderChildren: true
  };

  constructor(props) {
    super(props);
    this.tabId = createId();
  }

  handleClick = e => {
    if (!this.props.disabled && this.props.onClick) {
      this.props.onClick(e);
    }
  }

  handleKeyPress = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.handleClick(e);
    }
  }

  render() {
    const {
      id = this.tabId,
      label,
      children,
      className,
      selected,
      disabled,
      invalid,
      icon,
      renderChildren, // v3 Temporary, will be removed in next major version bump
      tabIndex = 0,
      ...otherProps
    } = this.props;

    let iconSize = label || (renderChildren && children) ? 'XS' : 'S';

    return (
      <div
        {...filterDOMProps(otherProps)}
        className={
          classNames(
            'spectrum-Tabs-item',
            {
              'is-selected': selected,
              'is-disabled': disabled,
              'is-invalid': invalid
            },
            className
          )
        }
        id={id}
        role="tab"
        aria-selected={selected}
        aria-invalid={invalid || null}
        aria-disabled={disabled || null}
        tabIndex={!disabled ? tabIndex : null}
        onClick={!disabled ? this.handleClick : null}
        onKeyPress={!disabled ? this.handleKeyPress : null}>
        {cloneIcon(icon, {size: iconSize, className: 'spectrum-Tabs-item-icon'})}
        {(label || (renderChildren && children)) && <span className="spectrum-Tabs-itemLabel">{label || (renderChildren && children)}</span>}
      </div>
    );
  }
}