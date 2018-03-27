const request = require('request')
const cheerio = require('cheerio')

request('https://www.ddlvalley.me/category/movies/', function(error, response, html) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        var parsedResults = [];


        $('div.cont.cl > div:nth-child(1) > div > div > a:nth-child(1)').each(function(i, element) {

            let vm = $(this);

            doThis(andThenThis);

            function doThis(callback) {
                console.log('do This');

                var a = vm.attr('href');
                var b = vm.next().attr('href');
                var link = a.indexOf('imdb.com') < 0 ? b : a;
                var c = vm.parent().parent().parent().parent();
                var title = c.parent().prev().text();
                var meta = c.prev().children('span.fl').children('span.date').text();
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
                console.log('and Then This');
                // request to IMDB
                request(metadata.link, function(error, response, html) {
                    if (!error && response.statusCode == 200) {
                        var $ = cheerio.load(html);
                        $('div.ratingValue strong span').each(function(i, element) {
                            rating = $(this).html();
                            metadata.rating = rating;
                        });
                        // Push meta-data into parsedResults array
                        parsedResults.push(metadata);
                        if (parsedResults.length == 10) {
                            console.log(parsedResults);
                        }
                    }
                });
            }
        });

    }
});