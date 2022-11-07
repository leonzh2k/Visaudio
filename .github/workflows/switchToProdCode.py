"""
    Simply replaces API keys and URLs used in development with
    those used in production. Runs as part of a Github Action
    when a push is made to main branch (the branch the live site
    and thus the production runs on). This way I don't have to
    manually update these everytime I want to push a new change
    to production.

    Automates the process nicely, but exposes API keys. Will find
    a more secure way later.
"""
fileContents = ""
with open("./js/appConfig.js", "r+") as file:
    fileContents = file.read()
    # switch Dev DB to Prod DB
    # this is the application id
    fileContents = fileContents.replace("oa4Y3OIsjK2iHCWY8iirFCK1tdt8QflVtyVJNzZ5", "01t8qb2FLCXC70NIrlplthJEfFpLVhvx6RCK2S2Z")
    # this is the javascript key
    fileContents = fileContents.replace("ROb615yRAwDTRdIn1vLgpmSYn4o8NBibJUgGShTn", "MfK5pEk5haJ95TcyTeIkYQdodIQJ2sk1Pn3jZCXX")
    # switch dev CORS proxy url to prod proxy url
    fileContents = fileContents.replace("https://cors-anywhere.herokuapp.com", "https://cors-anywhere-rzaw.onrender.com")
    fileContents = fileContents.replace("http://localhost:8080", "https://visaudio.onrender.com")

open("./js/appConfig.js", "w").close()
    
with open("./js/appConfig.js", "w") as file:
    file.write(fileContents)

