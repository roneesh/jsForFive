var React = require('react')
var ReactDOM = require('react-dom')

var Heading = React.createClass({
  render: function(){
    var status = 'ENABLED'
        message = 'Surf cautiously!'
    return (
      <div>
        <h1>Your JavaScript is {status}</h1>
        <p> {message}</p>
      </div>
    )
  }
});

var DisableOption = React.createClass({
  render: function() {
    return (
      <div>
        <input type="checkbox" id="disable-option"/>
        <label htmlFor="disable-option">
          Auto-Disable JavaScript after 5 minutes
        </label>
      </div>
    )
  }
});

var Switch = React.createClass({
  render: function() {
    return (
      <div>
        <label htmlFor="checkbox" className="toggle-switch">
          <input id="checkbox" type="checkbox" />
          <div className="dot"></div>
        </label>
        <p id="count-down"></p>
      </div>
    )
  }
})

var Links = React.createClass({
  render: function() {
    return (
      <div className="links">
        <a className="link" href="http://www.github.com/ronesh/jsForFive/faq.md">FAQ</a>
        <a className="link" href="http://www.github.com/roneesh/jsForFive">Source Code</a> 
        <a className="link" href="chrome://extensions">Uninstall</a>
      </div>
    )
  }
})

var JSForFive = React.createClass({
  render: function(){
    return (
      <div>
        <Heading />
        <Switch />
        <DisableOption />
        <Links />
      </div>
    )
  }
});

ReactDOM.render(<JSForFive />, document.getElementById('extension'));