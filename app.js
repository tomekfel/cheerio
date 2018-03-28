const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')
var path = "C:\\Users\\acer\\Websites\\Scraping\\cheeriojs\\Test.csv";

//initial clearing the file
fs.writeFile(path, 'Title,Rating,Filename' + '\n', function(error) {
    if (error) {
        console.error("write error:  " + error.message);
    } else {
        console.log("Successful Write to " + path);
    }
});

//main loop through ddlvalley pages
for (let i = 1; i < 4; i++) {
    console.log('Checking page ' + i);

    request('https://www.ddlvalley.me/category/movies/page/' + i + '/', function(error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            var parsedResults = [];

            let count = $('div.cont.cl > div:nth-child(1) > div > div > a:nth-child(1)').length;

            $('div.cont.cl > div:nth-child(1) > div > div > a:nth-child(1)').each(function(i, element) {

                let vm = $(this);

                doThis(andThenThis);

                function doThis(callback) {
                    var a = vm.attr('href');
                    var b = vm.next().attr('href');
                    var link = a.indexOf('imdb.com') < 0 ? b : a;
                    var c = vm.parent().parent().parent().parent();
                    var title = c.parent().prev().text();
                    var meta = c.prev().children('span.fl').children('span.date').text();
                    meta = meta.substr(0, meta.indexOf(',') - 2) + meta.substr(meta.indexOf(',') + 1);
                    meta = new Date(meta);
                    var rating = 0;

                    // Our parsed meta data object
                    var metadata = {
                        link: link,
                        title: title,
                        meta: meta
                    };

                    //console.log(metadata);

                    callback(metadata);
                }

                function andThenThis(metadata) {
                    // date check
                    let someday = new Date();
                    someday.setDate(someday.getDate() - 7)

                    if (metadata.meta > someday) {
                        // request to IMDB
                        //console.log(' imdb request');
                        request(metadata.link, function(error, response, html) {
                            if (!error && response.statusCode == 200) {
                                var $ = cheerio.load(html);
                                $('div.ratingValue strong span').each(function(i, element) {
                                    rating = $(this).html();
                                    metadata.rating = rating;
                                });

                                $('div.title_wrapper h1').each(function(i, element) {
                                    imdbtitle = $(this).contents().filter(function() {
                                        return this.nodeType == 3;
                                    })[0].nodeValue
                                    imdbtitle = imdbtitle.trim();
                                    metadata.imdbtitle = imdbtitle;
                                });

                                fs.appendFile(path, '"' + metadata.imdbtitle + '",' + metadata.rating + ',"' + metadata.title + '"\n', function(error) {
                                    if (error) {
                                        console.error("write error:  " + error.message);
                                    }
                                });

                                // Push meta-data into parsedResults array
                                parsedResults.push(metadata);
                                if (parsedResults.length == count) {
                                    console.log(parsedResults);
                                }
                            } else {
                                console.log(error);
                            }
                        });
                    } else {
                        count -= 1;
                    }
                }
            });
        }
    });
}

// #title-overview-widget > div.vital > div.title_block > div > div.ratings_wrapper > div.imdbRating > div.ratingValue > strong > span
//  #title-overview-widget > div.vital > div.title_block > div > div.titleBar > div.title_wrapper > h1