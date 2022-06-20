
with open("./js/index.js", "w+") as file:
    fileContents = file.read()
    modifiedFile = fileContents.replace("https://cors-anywhere.herokuapp.com", "https://mighty-stream-75885.herokuapp.com")
    file.seek(0)
    file.write(modifiedFile)


with open("./js/models/vizCreatorModel.js", "w+") as file:
    fileContents = file.read()
    modifiedFile = fileContents.replace("https://cors-anywhere.herokuapp.com", "https://mighty-stream-75885.herokuapp.com")
    file.seek(0)
    file.write(modifiedFile)