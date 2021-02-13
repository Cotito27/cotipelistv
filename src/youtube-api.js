const { google } = require('googleapis');
async function getYoutubeVideos(search, tokenPage) {
  let error = "";
  let response = await google.youtube('v3').search.list({
    key: process.env.YOUTUBE_TOKEN,
    part: 'snippet',
    maxResults: 1,
    q: search,
    pageToken: tokenPage || '',
    type: 'video',
  }).catch((err) => {
    error = err;
    console.log(err);
  });
  let data;
  if(response) {
    data = response.data;
  }
  if(!data) {
    data = {
      msgError: 'error',
      error
    };
  }
  return data;
}

module.exports = { getYoutubeVideos };