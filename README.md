LIVE DEPLOYMENT LINK: <a href="https://leonzh2k.github.io/Visaudio/" target="_blank">https://leonzh2k.github.io/Visaudio/</a>

### Introduction
Audio visualizer originally built as my capstone project for the University Honors Program at UC Davis. However, I intend to continue my work and make this prototype into a audio visualization platform unlike any other on the Internet. Stay tuned...

You can read the paper <a href="https://leonzh2k.github.io/academic_papers/Visaudio_Project_Book.pdf" target="_blank">here</a>

Wireframes <a href="https://www.figma.com/file/Do7grHLNvjXHS0Z8w42YLX/Interactive-Design-Comp-(Copy)?node-id=0%3A1">here</a>

### Guiding Principles
* Ease of use
* User freedom

### Application Architecture
The frontend is just vanilla HTML/CSS/JS model-view-controller app hosted on Github Pages. The back-end technically consists of 3 servers: 
* S1: Node/Express server written by me, hosted on Render 
* S2: Node CORS proxy server NOT written by me, I just hosted my own instance (<a href="https://github.com/Rob--W/cors-anywhere" target="_blank">source code</a>)
    * I need this because Napster's server doesn't provide necessary headers in the response when I request the audio data for visualizations triggering CORS errors. The proxy makes the request on behalf of my frontend, adds the necessary headers to the response, and sends it back, all good.
* S3: MongoDB database hosted on Back4App


### Technologies / APIs
* HTML/CSS
* Vanilla Javascript
* p5.js
* Napster API
* Node.js
* Express.js
* Back4App database solution

### Features 
* Create visualizations in the visualization builder
* Browse and experience visualizations from other users in the gallery

### TODO
- General
    - Move to a front-end framework (React, Vue, etc.)
    - Move to proper back-end hosted somewhere (Node, Express, SQL/NoSQL)
    - Implement user accounts
    - clean up CSS
- Visualization editor
    - polymorphism of shape types to eliminate duplicate code
    - add ability to delete objects
    - proper tutorial/onboarding
- Gallery
    - Saving image preview of the visualizations
