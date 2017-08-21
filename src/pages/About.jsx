import React, { Component } from 'react';
import styles from './about.css';

class About extends Component {
  render() {
    return (
      <div className="about">
        <div className="title">
          <h1>A Full Stack JavaScript Engineer</h1>
          <h2>Front-End Focus & With Design Awareness</h2>
        </div>
        <p>
          I am super passionate about JavaScript and making the web a more
          beautiful and elegant place. I love building enterprise level web
          applications (SPA) with the latest JavaScript technologies such as
          Node.js, React, and Redux.
        </p>

        <p>
          I write complete tests with Mocha, Chai, and Karma. I am also quite
          experienced in Bootstrap, LESS & SASS, and Lodash. I also spent some
          time with Angular, Backbone.js, jQuery, Underscore.js, and
          Handlebars.js, Gulp, and Grunt.
        </p>

        <p>
          Outside of programming, I love creating art through photography,
          pencil drawings, sketching, hand-rendered typography, illustrations,
          markers, and with digital tools such as Photoshop, Illustrator, and
          Wacom tablets.
        </p>

        <p>
          I truly believe in balancing the Left and Right Brain to becoming a
          Whole Brain Human Being.
        </p>
        <hr />
        <h3>Engineering Skill Summary</h3>
        <h5>JavaScript Frameworks</h5>
        <p>
          Modern JavaScript (ES6 and beyond), Node, React, Redux, Express,
          Highcharts.js, Web Sockets (Socket.io), MEAN, MERN, Angular, Mongo DB,
          Backbone.js, and Lodash.
        </p>
        <h5>Testing Frameworks</h5>
        <p>Karma, Jasmine, Mocha, and Chai.</p>

        <h5>UI Frameworks</h5>
        <p>Bootstrap V3/V4, and Ionic Framework.</p>

        <h5>Tooling</h5>
        <p>Prettier, ESLint, Git, Webpack, Babel, and Gulp.</p>

        <h3>Design</h3>
        <p>
          I can get down with some design stuff such as Typography, Hand
          Lettering, Branding, Logos, Grid Designs, Color Theory, Multimedia
          Design, Digital Art, Illustrations, Photoshop, Responsive Design, and
          Mobile Web Design.
        </p>

        <h3>Writing</h3>
        <i>Remnants (but still very handy) from my pre-programming days.</i>
        <p>Technical Writing, Creative Writing, Editing, and Proofing.</p>

        <h3>Photography</h3>
        <p>
          Studio and Flash photography, Image Post-processing, Image
          Manipulation and Optimization.
        </p>
      </div>
    );
  }
}

export default About;
