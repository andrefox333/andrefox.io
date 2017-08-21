import React, { Component } from 'react';
import { IntlProvider } from 'react-intl';
import moment from 'moment';

import './App.css';
import Work from './pages/Work';
import About from './pages/About';

export default class App extends Component {
  render() {
    return (
      <div className="app">
        <div className="hero">
          <div className="hero-content">
            <h1>Hi, I'm Andre Fox.</h1>
            <h2>I build awesome things for the Internet.</h2>
            <a
              href="mailto:helloandrefox@gmail.com?subject=From the Web"
              className="btn btn-outline-warning"
            >
              Yes, I am available for hire
            </a>
          </div>
        </div>
        <div className="content-body">
          <About />
          <Work />
        </div>
      </div>
    );
  }
}
