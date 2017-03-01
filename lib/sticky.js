'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Sticky = function (_React$Component) {
  (0, _inherits3['default'])(Sticky, _React$Component);

  function Sticky(props) {
    (0, _classCallCheck3['default'])(this, Sticky);

    var _this = (0, _possibleConstructorReturn3['default'])(this, _React$Component.call(this, props));

    _this.updateContext = function (_ref) {
      var inherited = _ref.inherited,
          node = _ref.node;

      _this.containerNode = node;
      _this.setState({
        containerOffset: inherited,
        distanceFromBottom: _this.getDistanceFromBottom()
      });
    };

    _this.recomputeState = function () {
      var isSticky = _this.isSticky();
      var height = _this.getHeight();
      var width = _this.getWidth();
      var xOffset = _this.getXOffset();
      var distanceFromBottom = _this.getDistanceFromBottom();
      var hasChanged = _this.state.isSticky !== isSticky;

      _this.setState({ isSticky: isSticky, height: height, width: width, xOffset: xOffset, distanceFromBottom: distanceFromBottom });

      if (hasChanged) {
        if (_this.channel) {
          _this.channel.update(function (data) {
            data.offset = isSticky ? _this.state.height : 0;
          });
        }

        _this.props.onStickyStateChange(isSticky);
      }
    };

    _this.scrollContainer = window;
    _this.state = {};
    return _this;
  }

  Sticky.prototype.componentWillMount = function componentWillMount() {
    this.channel = this.context['sticky-channel'];
    this.channel.subscribe(this.updateContext);
  };

  Sticky.prototype.componentDidMount = function componentDidMount() {
    var scrollContainerId = this.props.scrollContainerId;

    var windowEvents = ['resize', 'pageshow', 'load'];
    var scrollContainerEvents = ['scroll', 'touchstart', 'touchmove', 'touchend'];

    if (scrollContainerId) {
      this.scrollContainer = document.getElementById(scrollContainerId);
    }

    this.on(window, windowEvents, this.recomputeState);
    this.on(this.scrollContainer, scrollContainerEvents, this.recomputeState);
    this.recomputeState();
  };

  Sticky.prototype.componentWillReceiveProps = function componentWillReceiveProps() {
    this.recomputeState();
  };

  Sticky.prototype.componentWillUnmount = function componentWillUnmount() {
    var windowEvents = ['resize', 'pageshow', 'load'];
    var scrollContainerEvents = ['scroll', 'touchstart', 'touchmove', 'touchend'];

    this.off(window, windowEvents, this.recomputeState);
    this.off(this.scrollContainer, scrollContainerEvents, this.recomputeState);
    this.channel.unsubscribe(this.updateContext);
  };

  Sticky.prototype.getXOffset = function getXOffset() {
    return this.refs.placeholder.getBoundingClientRect().left;
  };

  Sticky.prototype.getWidth = function getWidth() {
    var bounds = this.refs.placeholder.getBoundingClientRect();
    return bounds.width || bounds.right - bounds.left;
  };

  Sticky.prototype.getHeight = function getHeight() {
    var bounds = _reactDom2['default'].findDOMNode(this.refs.children).getBoundingClientRect();
    return bounds.height || bounds.bottom - bounds.top;
  };

  Sticky.prototype.getDistanceFromTop = function getDistanceFromTop() {
    return this.refs.placeholder.getBoundingClientRect().top;
  };

  Sticky.prototype.getDistanceFromBottom = function getDistanceFromBottom() {
    if (!this.containerNode) return 0;
    return this.containerNode.getBoundingClientRect().bottom;
  };

  Sticky.prototype.isSticky = function isSticky() {
    if (!this.props.isActive) return false;

    var fromTop = this.getDistanceFromTop();
    var fromBottom = this.getDistanceFromBottom();

    var topBreakpoint = this.state.containerOffset - this.props.topOffset;
    var bottomBreakpoint = this.state.containerOffset + this.props.bottomOffset;

    return fromTop <= topBreakpoint && fromBottom >= bottomBreakpoint;
  };

  Sticky.prototype.on = function on(target, events, callback) {
    events.forEach(function (evt) {
      if (!target.addEventListener && target.attachEvent) {
        target.attachEvent('on' + evt, callback);
      } else {
        target.addEventListener(evt, callback);
      }
    });
  };

  Sticky.prototype.off = function off(target, events, callback) {
    events.forEach(function (evt) {
      if (!target.removeEventListener && target.detachEvent) {
        target.detachEvent('on' + evt, callback);
      } else {
        target.removeEventListener(evt, callback);
      }
    });
  };

  Sticky.prototype.shouldComponentUpdate = function shouldComponentUpdate(newProps, newState) {
    var _this2 = this;

    // Have we changed the number of props?
    var propNames = (0, _keys2['default'])(this.props);
    if ((0, _keys2['default'])(newProps).length != propNames.length) return true;

    // Have we changed any prop values?
    var valuesMatch = propNames.every(function (key) {
      return newProps.hasOwnProperty(key) && newProps[key] === _this2.props[key];
    });
    if (!valuesMatch) return true;

    // Have we changed any state that will always impact rendering?
    var state = this.state;
    if (newState.isSticky !== state.isSticky) return true;

    // If we are sticky, have we changed any state that will impact rendering?
    if (state.isSticky) {
      if (newState.height !== state.height) return true;
      if (newState.width !== state.width) return true;
      if (newState.xOffset !== state.xOffset) return true;
      if (newState.containerOffset !== state.containerOffset) return true;
      if (newState.distanceFromBottom !== state.distanceFromBottom) return true;
    }

    return false;
  };

  /*
   * The special sauce.
   */


  Sticky.prototype.render = function render() {
    var placeholderStyle = { paddingBottom: 0 };
    var className = this.props.className;

    // To ensure that this component becomes sticky immediately on mobile devices instead
    // of disappearing until the scroll event completes, we add `transform: translateZ(0)`
    // to 'kick' rendering of this element to the GPU
    // @see http://stackoverflow.com/questions/32875046
    var style = (0, _assign2['default'])({}, { transform: 'translateZ(0)' }, this.props.style);

    if (this.state.isSticky) {
      var _stickyStyle = {
        position: 'fixed',
        top: this.state.containerOffset,
        left: this.state.xOffset,
        width: this.state.width
      };

      var bottomLimit = this.state.distanceFromBottom - this.state.height - this.props.bottomOffset;
      if (this.state.containerOffset > bottomLimit) {
        _stickyStyle.top = bottomLimit;
      }

      placeholderStyle.paddingBottom = this.state.height;

      className += ' ' + this.props.stickyClassName;
      style = (0, _assign2['default'])({}, style, _stickyStyle, this.props.stickyStyle);
    }

    var _props = this.props,
        topOffset = _props.topOffset,
        isActive = _props.isActive,
        stickyClassName = _props.stickyClassName,
        stickyStyle = _props.stickyStyle,
        scrollContainerId = _props.scrollContainerId,
        bottomOffset = _props.bottomOffset,
        onStickyStateChange = _props.onStickyStateChange,
        props = (0, _objectWithoutProperties3['default'])(_props, ['topOffset', 'isActive', 'stickyClassName', 'stickyStyle', 'scrollContainerId', 'bottomOffset', 'onStickyStateChange']);


    return _react2['default'].createElement(
      'div',
      null,
      _react2['default'].createElement('div', { ref: 'placeholder', style: placeholderStyle }),
      _react2['default'].createElement(
        'div',
        (0, _extends3['default'])({}, props, { ref: 'children', className: className, style: style }),
        this.props.children
      )
    );
  };

  return Sticky;
}(_react2['default'].Component);

Sticky.propTypes = {
  isActive: _react2['default'].PropTypes.bool,
  className: _react2['default'].PropTypes.string,
  style: _react2['default'].PropTypes.object,
  stickyClassName: _react2['default'].PropTypes.string,
  stickyStyle: _react2['default'].PropTypes.object,
  scrollContainerId: _react2['default'].PropTypes.string,
  topOffset: _react2['default'].PropTypes.number,
  bottomOffset: _react2['default'].PropTypes.number,
  onStickyStateChange: _react2['default'].PropTypes.func
};
Sticky.defaultProps = {
  isActive: true,
  className: '',
  style: {},
  stickyClassName: 'sticky',
  stickyStyle: {},
  scrollContainerId: '',
  topOffset: 0,
  bottomOffset: 0,
  onStickyStateChange: function onStickyStateChange() {}
};
Sticky.contextTypes = {
  'sticky-channel': _react2['default'].PropTypes.any
};
exports['default'] = Sticky;