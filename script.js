import vizMapping from "./modules/vizMapping.js";
import {asyncFetchTrackData} from "./modules/apiCalls.js";
// import squaresExperimental from "./viz/squaresExperimental.js";
(() => {

    Parse.initialize("01t8qb2FLCXC70NIrlplthJEfFpLVhvx6RCK2S2Z", "MfK5pEk5haJ95TcyTeIkYQdodIQJ2sk1Pn3jZCXX"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
    Parse.serverURL = "https://parseapi.back4app.com/";
    
    let main = document.querySelector('main');
    let gallery = document.querySelector('#gallery');

    let viewGallery = document.querySelector("header nav li:first-child");
    let createViz = document.querySelector("header nav li:last-child");

    let currentViz;


    let state = "gallery";
    // switch to gallery if not already in gallery
    viewGallery.addEventListener("click", () => {
        if (state !== "gallery") {
            console.log("switching to gallery viz")
            fetchAndDisplayVizInGallery();
			state = "gallery";
        }
    });

    // switch to create viz if not already in create viz
    createViz.addEventListener("click", () => {
        console.log(state);
        if (state !== "create") {
            console.log("switching to edit viz")
            removeViz();
            emptyElement([main]);
            let createSection = document.createElement("section");
            createSection.id = "create-viz";
            createSection.style.fontSize = "20px";
            // createSection.textContent = "viz graphic";
            main.appendChild(createSection);
            createSection.innerHTML = `
                <h3>Search for a song</h3>
                <div id="currentsong">Currently selected song: none</div>
                <input type=text id="searchsong">
                    
                </input>
                <button id="search">search</button>
                <div>Click on a song to select it for the viz and then submit when you're ready. The viz will show up on the gallery.</div>
                <div id="searchresults"><div></div></div>
                
                <h3>Viz Type</h3>
                <label for="boxes">Boxes</label>
                <input type="radio" name="viztype" id="boxes" value="Boxes">
                <label for="squares">Squares</label>
                <input type="radio" name="viztype" id="squares" value="Squares">
                <br>
                <br>
                <button id="submit">Submit</button>
            `


            let vizParams = {
                "bassColor": "#646ffc",
                "trebleColor": "#fc41a5",
                "songUrl": null,
                "artist": null,
                "songTitle": null
            }
            document.querySelector("#submit").addEventListener("click", () => {
                const vizMetadata = Parse.Object.extend("vizMetadata");
                const VizMetadata = new vizMetadata();
                let vizType;
                if (document.querySelector("#boxes").checked) {
                    vizType = "Boxes";
                } else {
                    vizType = "Squares";
                }
                VizMetadata.save({
                    vizType: vizType,
                    vizParams: vizParams
                }).then((VizMetadata) => {
                    alert("viz submitted, view in gallery");
                    console.log("succes");
                }, (error) => {
                    console.log(error);
                });
            })

            document.querySelector("#searchsong").addEventListener("keydown", async (e) => {
                console.log(e.key)
                    if (e.key == "Enter") {
                        const songToSearch = document.querySelector("#searchsong").value;
                        if (songToSearch !== "") {
                            asyncFetchTrackData("ZDIxMDM1NTEtYjk3OS00YTI1LWIyYjItYjBjOWVmMWYyN2I3", songToSearch).then(searchResults => {
                                emptyElement([document.querySelector("#searchresults")]);
                                console.log(searchResults);
                                searchResults.search.data.tracks.forEach(track => {
                                    let div = document.createElement("div");
                                    div.textContent = `${track.artistName} - ${track.name}`;
                                    document.querySelector("#searchresults").appendChild(div);

                                    div.style.cursor = "pointer";
                                    div.addEventListener("mouseover", () => {
                                        console.log("yeah")
                                        div.style.backgroundColor = "blue";
                                    })
                                    div.addEventListener("mouseout", () => {
                                        div.style.backgroundColor = null;
                                    })
                                    div.addEventListener("click", () => {
                                        vizParams.songUrl = track.previewURL;
                                        vizParams.artist = track.artistName;
                                        vizParams.songTitle = track.name;
                                        document.querySelector("#currentsong").textContent = `Currently selected song: ${vizParams.artist} - ${vizParams.songTitle}`
                                        // console.log(trackURL);
                                    })
                                   
                                    // div.addEventListener("mouseout", () => {
                                    //     div.style.backgroundColor = null;
                                    // })
                                    // finalTrackData.push({
                                    //   trackImageSrc: "https://api.napster.com/imageserver/v2/albums/" + track.albumId + "/images/500x500.jpg",
                                    //   trackID: track.id,
                                    //   trackShortcut: track.shortcut,
                                    //   trackName: track.name,
                                    //   trackArtist: track.artistName,
                                    //   trackOrder: trackOrder
                                    // })
                                    // trackOrder++;
                                })
                            })
                    }
                }
            })
            
            document.querySelector("#search").addEventListener("click", async () => {
                const songToSearch = document.querySelector("#searchsong").value;
                if (songToSearch !== "") {
                    asyncFetchTrackData("ZDIxMDM1NTEtYjk3OS00YTI1LWIyYjItYjBjOWVmMWYyN2I3", songToSearch).then(searchResults => {
                        emptyElement([document.querySelector("#searchresults")]);
                        console.log(searchResults);
                        searchResults.search.data.tracks.forEach(track => {
                            let div = document.createElement("div");
                            div.textContent = `${track.artistName} - ${track.name}`;
                            document.querySelector("#searchresults").appendChild(div);

                            div.style.cursor = "pointer";
                            div.addEventListener("mouseover", () => {
                                div.style.backgroundColor = "blue";
                            })
                            div.addEventListener("mouseout", () => {
                                div.style.backgroundColor = null;
                            })
                            div.addEventListener("click", () => {
                                vizParams.songUrl = track.previewURL;
                                vizParams.artist = track.artistName;
                                vizParams.songTitle = track.name;
                                document.querySelector("#currentsong").textContent = `CURRENTLY SELECTED SONG: ${vizParams.artist} - ${vizParams.songTitle}`
                                // console.log(trackURL);
                            })
                            // finalTrackData.push({
                            //   trackImageSrc: "https://api.napster.com/imageserver/v2/albums/" + track.albumId + "/images/500x500.jpg",
                            //   trackID: track.id,
                            //   trackShortcut: track.shortcut,
                            //   trackName: track.name,
                            //   trackArtist: track.artistName,
                            //   trackOrder: trackOrder
                            // })
                            // trackOrder++;
                          })
                    })
                }
            
            })
        
            // let defaultVizData = {

            // }
            // currentViz = new p5(squares(vizMetadata),"create-viz");
            state = "create";
        }
    });

    async function fetchAndDisplayVizInGallery() {
        // clear everything before doing anything else
        removeViz();
        emptyElement([main, gallery]);  
        let results = await fetchVizData();
        showVizInGallery(results);
    }

    async function fetchVizData() {
        console.log("fetch data")
        const vizMetadata = Parse.Object.extend('vizMetadata');
        const query = new Parse.Query(vizMetadata);
        // results shown by most recent order
        const results = await query.descending('createdAt').find();
        
        console.log(results);
        return results;
    }
    
    function showVizInGallery(vizMetadata) {
        for (let i = 0; i < vizMetadata.length; i++) {
            let vizThumbnail = document.createElement("div");
            vizThumbnail.addEventListener("click", () => {
                console.log("switching to view viz")
        
                displayVizInViewViz(vizMetadata[i]);
                // console.log(vizMetadata[i].get("vizParams"));
                state = "view";
            });
            let thumbnail = document.createElement("img");
            // console.log(vizMetadata[i].attributes.vizThumbnail);
            // error checking if thumbnail doesn't exist?
            if (!vizMetadata[i].attributes.vizThumbnail) {
                console.log("thumbnail no exist");
            } else {
                thumbnail.src = vizMetadata[i].get("vizThumbnail").url();
            }
            vizThumbnail.appendChild(thumbnail);
            gallery.appendChild(vizThumbnail);
        }

        main.append(gallery);
    }

    function removeViz() {
        if (currentViz) {
            console.log("removing sketch");
            currentViz.stopAudio();
            currentViz.remove();
        }
    }

    // clears all child elements of each element in ele array
    // also cleans up any p5 sketch on the screen
    function emptyElement(elements) {
        for (let i = 0; i < elements.length; i++) {
            let child = elements[i].firstElementChild;
            while (child) {
                elements[i].removeChild(child);
                child = elements[i].firstElementChild;
            }
        }
    }

    function displayVizInViewViz(vizMetadata) {
        // console.log(vizMetadata);
        console.log("viz data: ", vizMetadata);
        emptyElement([main, gallery]);

        let section = document.createElement("section");
        section.id = "view-viz";
        
        // assume data has no errors for now (viz always shows), 
        // perform proper error checking later
        main.appendChild(section);
        // for local dev, use the demo server, for production, use my own server
        // https://mighty-stream-75885.herokuapp.com
        // https://cors-anywhere.herokuapp.com
        currentViz = new p5(vizMapping[vizMetadata.get("vizType")](vizMetadata, "https://cors-anywhere.herokuapp.com"), "view-viz");
    }

    

    fetchAndDisplayVizInGallery();
    
})();