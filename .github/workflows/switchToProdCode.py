
with open("./js/index.js", "r+") as file:
    fileContents = file.read()
    modifiedFile = fileContents.replace("https://cors-anywhere.herokuapp.com", "https://mighty-stream-75885.herokuapp.com")
    file.seek(0)
    file.write(modifiedFile)


with open("./js/models/vizCreatorModel.js", "r+") as file:
    fileContents = file.read()
    modifiedFile = fileContents.replace("https://cors-anywhere.herokuapp.com", "https://mighty-stream-75885.herokuapp.com")
    file.seek(0)
    file.write(modifiedFile)