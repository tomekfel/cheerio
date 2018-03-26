const request = require('request')
const cheerio = require('cheerio')

request('https://www.ddlvalley.me/category/movies/', function(error, response, html) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        var parsedResults = [];
        // $('div.post.br5.cl').each(function(i, element) {
        //     var a = $(this).prev();
        //     var title = a.text();
        //     var link = a.next().children('div.cont.cl > div:nth-child(1) > div > div > a:nth-child(1)');
        //     var imdb = $(link).html();
        //     // Our parsed meta data object
        //     var metadata = {
        //         title: title,
        //         imdb: imdb
        //     };
        //     // Push meta-data into parsedResults array
        //     parsedResults.push(metadata);
        // });

        $('div.cont.cl > div:nth-child(1) > div > div > a:nth-child(1)').each(function(i, element) {
            var a = $(this).attr('href');
            var b = $(this).next().attr('href');
            var link = a.indexOf('imdb.com') < 0 ? b : a;
            var c = $(this).parent().parent().parent().parent();
            var title = c.parent().prev().text();
            var meta = c.prev().children('span.fl').children('span.date').text();

            // Our parsed meta data object
            var metadata = {
                link: link,
                title: title,
                meta: meta
            };
            // Push meta-data into parsedResults array
            parsedResults.push(metadata);
        });

        // Log our finished parse results in the terminal
        console.log(parsedResults);
    }
});

//  #post-464080 > div.cont.cl > div:nth-child(1) > div > div > a:nth-child(1)
//  #post-464080 > div.cont.cl > div:nth-child(1) > div > div > a:nth-child(2)
//  #post-464080 > div.cont.cl > div:nth-child(1) > div > div > a:nth-child(1)
//  #post-464080 > div.cont.cl > div:nth-child(1) > div > div > a:nth-child(2)
//  #post-464080 > div.meta.br5 > span.fl > span.author > a