LIVE DEPLOYMENT LINK: <a href="https://leonzh2k.github.io/Visaudio/" target="_blank">https://leonzh2k.github.io/Visaudio/</a>

### Introduction
A prototype originally built for my capstone project for the University Honors Program at UC Davis, which has since grown into a proper full stack application with the ulitmate goal of an audio visualization platform unlike any other on the Internet. Stay tuned...

You can read the paper <a href="https://leonzh2k.github.io/academic_papers/Visaudio_Project_Book.pdf" target="_blank">here</a>

Wireframes <a href="https://www.figma.com/file/Do7grHLNvjXHS0Z8w42YLX/Interactive-Design-Comp-(Copy)?node-id=0%3A1">here</a>

### Guiding Principles
* Ease of use
* User freedom

### Technologies / APIs
* HTML/CSS/JS
* p5.js
* PostgreSQL (node-pg)
* Node.js
* Express.js
* Napster API

### Application Architecture
The frontend is just vanilla HTML/CSS/JS model-view-controller app hosted on Github Pages. The back-end technically consists of 5 servers: 
* S1: Node/Express server written by me, hosted on Cyclic 
    * DB operations / API requests needed by the frontend go here first because I want to keep DB and API keys a secret from the client.
* S2: PostgreSQL database server (queries/schema written by me), hosted on Render
* S3: Napster API server
* S4: Server hosting audio files
    * Origin is different from Napster's API server, so my guess is they're separate servers
* S5: Node CORS proxy server NOT written by me, I just hosted my own instance (<a href="https://github.com/Rob--W/cors-anywhere" target="_blank">source code</a>)
    * I need this because the audio file server doesn't provide necessary headers in the response when I request the audio data (for visualizations), which triggers CORS errors. The proxy makes the request on behalf of my frontend, adds the necessary headers to the response, and sends it back, all good.

In the end several flows can be identified:
* For database interactions: Frontend -> S1 -> S2
* For Napster API interactions: Frontend -> S1 -> S3
* For audio data requests: Frontend -> S5 -> S4
    * I don't need to go through Napster's API in this case because I have the URL of the file at this point (which was obtained through Napster's API at some earlier time)


### Features 
* Create visualizations in the visualization builder
* Browse and experience visualizations from other users in the gallery

### TODO
- General
    - Move to a front-end framework (React, Vue, etc.)
    - Implement user accounts
    - clean up CSS
- Visualization editor
    - polymorphism of shape types to eliminate duplicate code
    - add ability to delete objects
    - proper tutorial/onboarding
- Gallery
    - Saving image preview of the visualizations
