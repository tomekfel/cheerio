const request = require('request')
const cheerio = require('cheerio')

request('https://www.ddlvalley.me/category/movies/', function(error, response, html) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        var parsedResults = [];

        $('div.cont.cl > div:nth-child(1) > div > div > a:nth-child(1)').each(function(i, element) {
            var a = $(this).attr('href');
            var b = $(this).next().attr('href');
            var link = a.indexOf('imdb.com') < 0 ? b : a;
            var c = $(this).parent().parent().parent().parent();
            var title = c.parent().prev().text();
            var meta = c.prev().children('span.fl').children('span.date').text();
            var rating = 0;

            // Our parsed meta data object
            var metadata = {
                link: link,
                title: title,
                meta: meta
            };

            // request to IMDB
            request(link, function(error, response, html) {
                if (!error && response.statusCode == 200) {
                    var $ = cheerio.load(html);
                    $('div.ratingValue strong span').each(function(i, element) {
                        rating = $(this).html();
                        metadata.rating = rating;
                    });
                    // Push meta-data into parsedResults array
                    parsedResults.push(metadata);
                    // Log our finished parse results in the terminal
                    console.log(parsedResults);
                }
            });
        });
    }
});