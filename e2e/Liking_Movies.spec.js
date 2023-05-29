const assert = require('assert');

Feature('Liking Movies');

Before(({ I }) => {
    I.amOnPage('/#/like');
  });

Scenario('showing empty liked movies',  async ({ I }) => {
    I.see('Tidak ada film untuk ditampilkan', '.movie-item__not__found');
 
    I.amOnPage('/');
    
    I.waitForElement('.movie__title a', 30);
    I.seeElement('.movie__title a');
   
    const titles = [];
   
    for (let i = 1; i <= 3; i++) {
      I.click(locate('.movie__title a').at(i));
      I.waitForElement('#likeButton', 30);
      I.seeElement('#likeButton');
      I.click('#likeButton');
      titles.push(await I.grabTextFrom('.movie__title'));
      I.amOnPage('/');
    }
   
    I.amOnPage('/#/like');
    I.seeElement('#query');

    const searchQuery = titles[1].substring(1, 3);
    const matchingMovies = titles.filter((title) => title.indexOf(searchQuery) !== -1);

    I.fillField('#query', searchQuery);
    I.pressKey('Enter');

    const visibleLikedMovies = await I.grabNumberOfVisibleElements('.movie-item');
    assert.strictEqual(matchingMovies.length, visibleLikedMovies);

    matchingMovies.forEach(async (title, index) => {
        const visibleTitle = await I.grabTextFrom(locate('.movie__title').at(index + 1));
        assert.strictEqual(title, visibleTitle);
    });

});
