'use strict';
const URL = "https://www.googleapis.com/youtube/v3/search";
let globalUserInput = '';
let keyToAddNext = '';
let keyToAddBack = '';

const handleBtnClick = () => {

  $('#btn').on('click', event => {
    $('#next').show();
    //get users input text they want to search
    const userSearch = $("#search").val();

    globalUserInput = userSearch;

    //reset the search the field
    $("#search").val('');

    //place text inside the p element to verify the user's search
    $('#verify').text(`You searched for: ${userSearch}`);

    $('#insert').empty('div');
    parseJsonResponse(fetchAPI(userSearch));
  })

  getNextPage();
  goBackPage();
}

const fetchAPI = (userInput) => {
  //test for $.getJSON()

  const query = {
    q: userInput,
    part: 'snippet',
    maxResults: '10',
    type: 'video',
    key: 'AIzaSyC_wivm5OTafQ7p8U_zil_-b_pKjnlvYHE'
  }
  return query;
}

const parseJsonResponse = (queryPassed) => {
  $.getJSON(URL, queryPassed, response => {
    console.log(response);

    keyToAddNext = response.nextPageToken;

    if (response.prevPageToken !== null) {
      keyToAddBack = response.prevPageToken;
    }

    const itemsArray = response.items;

    for (let el in itemsArray) {
      const obj = itemsArray[el];
      const id = obj.id.videoId;
      const title = obj.snippet.title;
      const thumbnail = obj.snippet.thumbnails.high.url;
      console.log({id, title, thumbnail});

      $('#insert').append(
      `<div class='holder'>
        <h2>${title}</h2>
        <a href='https://youtu.be/${id}' target='_blank'>
          <img alt='Image for ${title}' class="thumbnail" src=${thumbnail} id=${id} />
      </div>`);
    }

  })
}


const goBackPage = () => {
  $('#back').on('click', event => {
    //

    let query = fetchAPI(globalUserInput)
    if (query.pageToken === null) {
      query['pageToken'] = keyToAddBack;
    } else {
      query.pageToken = keyToAddBack;
    }


    $('#insert').empty();
    parseJsonResponse(query);

  })
}


const getNextPage = () => {
  $('#next').on('click', event => {
    //
    $('#back').show();
    let query = fetchAPI(globalUserInput)
    if (query.pageToken === null) {
      query['pageToken'] = keyToAddNext;
    } else {
      query.pageToken = keyToAddNext;
    }

    $('#insert').empty();
    parseJsonResponse(query);

  })

}

const startApp = () => {
  //add fuunctions in here for jQuery to start the app
  $('#back').hide();
  $('#next').hide();
  handleBtnClick();

}

$(startApp);
