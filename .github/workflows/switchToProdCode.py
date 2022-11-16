"""
    Simply replaces URLs used in development with
    those used in production. Runs as part of a Github Action
    when a push is made to main branch (the branch the production
    frontend runs on). This way I don't have to
    manually update these everytime I want to push a new change
    to production.
"""
fileContents = ""
with open("./js/appConfig.js", "r+") as file:
    fileContents = file.read()
    # switch dev CORS proxy url to prod proxy url
    fileContents = fileContents.replace("https://cors-anywhere.herokuapp.com", "https://cors-anywhere-lz.onrender.com")
    fileContents = fileContents.replace("http://localhost:8080", "https://frail-capris-ant.cyclic.app")

open("./js/appConfig.js", "w").close()
    
with open("./js/appConfig.js", "w") as file:
    file.write(fileContents)

