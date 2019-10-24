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

import assert from 'assert';
import ModalTrigger from '../../src/ModalTrigger';
import {mount} from 'enzyme';
import PropTypes from 'prop-types';
import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';


describe('ModalTrigger', () => {
  it('calls chained onClick methods for ModalTrigger and trigger child', () => {
    let onClickSpy = sinon.spy();
    let onButtonClickSpy = sinon.spy();
    let wrapper = shallow(<ModalTrigger onClick={onClickSpy}><button onClick={onButtonClickSpy} /><div modalContent>text</div></ModalTrigger>);

    let component = wrapper.instance();
    sinon.stub(component, 'show').callsFake(sinon.spy());
    component.forceUpdate();

    wrapper.find('button').at(0).simulate('click');
    assert(onClickSpy.called);
    assert(onButtonClickSpy.called);
    assert(component.show.calledOnce);
  });

  it('adds a wrapping div only when multiple children are supplied as content', () => {
    let wrapper = shallow(<ModalTrigger>
      <button />
      <button />
      <div modalContent>text</div>
    </ModalTrigger>);

    assert.equal(wrapper.find('button').length, 2);
    let hasContainer = !!(wrapper.find('Fragment').length || wrapper.find('div').length);
    assert.equal(hasContainer, true);
  });

  describe('mounted', () => {
    let tree;
    afterEach(() => {
      if (tree && tree.exists()) {
        tree.unmount();
        tree = null;
      }
      document.body.style.overflow = '';
    });
    it('can pass advanced context to the child of mounted component', () => {
      const RootComponent = () => <ChildComponent />;

      RootComponent.contextTypes = {
        name: PropTypes.string,
        country: PropTypes.string,
        color: PropTypes.string
      };

      const DivComponent = (props, context) => (
        <div>{context.name} is from {context.country}</div>
      );

      DivComponent.contextTypes = {
        name: PropTypes.string,
        country: PropTypes.string
      };

      const ChildComponent = () => <ModalTrigger><DivComponent /></ModalTrigger>;


      const context = {name: 'Julia', country: 'Mexico'};
      tree = mount(<RootComponent />, {context});

      assert.equal(tree.text(), 'Julia is from Mexico');
    });

    it('should pass context', () => {
      function SimpleComponent(props, context) {
        return <div id="modal-test">{context.name}</div>;
      }

      SimpleComponent.contextTypes = {
        name: PropTypes.string
      };

      const context = {
        name: 'a context has no name'
      };

      ModalTrigger.contextTypes = {
        name: PropTypes.string
      };
      tree = mount(
        <ModalTrigger>
          <SimpleComponent />
        </ModalTrigger>,
        {context});

      assert.equal(tree.text(), 'a context has no name');
    });

    it('does not add a wrapping div for only one child for content', () => {
      tree = mount(<ModalTrigger>
        <button />
        <div modalContent>text</div>
      </ModalTrigger>);
      assert.equal(tree.find('button').length, 1);
      let hasContainer = !!(tree.find('Fragment').length || tree.find('div').length);
      assert.equal(hasContainer, false);
    });
  });
});