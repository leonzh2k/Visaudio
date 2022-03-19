export async function asyncFetchTrackData(API_KEY, queryParameters) {
    const response = await fetch(`https://api.napster.com/v2.2/search?apikey=${API_KEY}&query=${queryParameters}&type=track`);
    const trackData = await response.json();
    return trackData;
}