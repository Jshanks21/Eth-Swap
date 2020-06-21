import React, { Component } from 'react';
import Identicon from 'identicon.js';

class Navbar extends Component { 

  render() {
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="http://luisegea.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          EthSwap
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            { this.props.account
              ? <img
                  className="ml-2"
                  height="30"
                  width="30"
                  src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
                  alt=""
                />
              : <span></span>
            }
            <span className="text-secondary ml-2">
              <span id="account">{this.props.account}</span>
            </span>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
