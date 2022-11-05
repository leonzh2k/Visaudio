LIVE DEPLOYMENT LINK: <a href="https://leonzh2k.github.io/Visaudio/" target="_blank">https://leonzh2k.github.io/Visaudio/</a>

### Introduction
Audio visualizer originally built as my capstone project for the University Honors Program at UC Davis. However, I intend to continue my work and make this prototype into a audio visualization platform unlike any other on the Internet. Stay tuned...

You can read the paper <a href="https://leonzh2k.github.io/academic_papers/Visaudio_Project_Book.pdf" target="_blank">here</a>

Wireframes <a href="https://www.figma.com/file/Do7grHLNvjXHS0Z8w42YLX/Interactive-Design-Comp-(Copy)?node-id=0%3A1">here</a>

### Guiding Principles
* Ease of use
* User freedom

### Application Architecture
App is structured as model-view-controller. Front-end of the app is hosted on Github Pages. The back-end is a MongoDB database hosted by Back4App and the front-end interacts with the database through their API.

### Technologies / APIs
* HTML
* CSS
* Vanilla Javascript
* p5.js
* Napster API
* Back4App backend service

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
