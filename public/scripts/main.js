'use strict';

var app = {
    giphyKey: '2WHYoEt65SLe9Jfw6Kpm7VUHbJIQYE9j'
};
//arrays
app.quizOptions = ['country', 'food', 'character', 'beverage'];
app.quizData = [];

app.randomNum = function () {
    return Math.floor(Math.random() * 10);
};

//----------
//API Calls
//----------
app.getGiphy = function (memeKeyword) {
    var xhr = $.get('http://api.giphy.com/v1/gifs/search?q=' + memeKeyword + '&api_key=' + app.giphyKey + '&limit=10');
    xhr.done(function (data) {
        var randomPull = app.randomNum();
        console.log("success got data", data);
        var $giphy = $('.giphy');
        $giphy.empty();
        $giphy.append('\n            <iframe \n                src="' + data.data[randomPull].embed_url + '" \n                frameBorder="0" \n                class="giphy-embed" allowFullScreen>\n            </iframe>\n        ');
    });
};

//FunTranslation public API calls allows for 60 API calls a day with distribution of 5 calls an hour. 
app.getTranslate = function (language, userInput) {
    console.log(language, userInput);
    $.ajax({
        url: 'http://api.funtranslations.com/translate/' + language + '.json',
        method: 'POST',
        dataType: 'json',
        data: {
            text: userInput
        }
    }).then(function (res) {
        console.log(res);
        var $translatedText = $('.translated-text');
        $translatedText.empty();
        $translatedText.removeClass('hide');
        $translatedText.append('\n        <p class="speech-bubble">' + res.contents.translated + '</p>');
        //check to see if this works -------------------------------------------------------------------------------------------
        app.smoothScroll('translated-text');
    });
};

//---------------------
//Quiz functionalities
//---------------------
app.getQuizData = function () {
    app.quizOptions.forEach(function (question) {
        var quizObject = $('input[name=' + question + ']:checked').data();
        app.quizData.push(quizObject);
    });
};

app.addQuizData = function () {
    return app.quizData.reduce(function (acc, curr) {
        for (var key in curr) {
            if (acc[key] === undefined) {
                acc[key] = 0;
            }
            acc[key] += curr[key];
        }
        return acc;
    }, {});
};

app.determineWinningLanguage = function (sumQuizData) {
    return Object.keys(sumQuizData).reduce(function (curr, acc) {
        return sumQuizData[curr] > sumQuizData[acc] ? curr : acc;
    });
};

app.displayResults = function (language) {
    var resultTitle = $('.result-title');
    var resultsDiv = $('.results');
    resultTitle.empty();
    resultsDiv.empty();
    if (language === 'shakespeare') {
        resultTitle.append('<h1>Speaketh as if \'t be true thou wast Shakespeare!</h1>');
        resultsDiv.append('\n            <h2>Shakespeare Translator <i class="fas fa-arrow-down animated bounce infinite"></i></h2>\n            <form>\n                <textarea class="translator" cols=\'20\' rows=\'4\'></textarea>\n                <input type="submit" value="Heareth mine voice">\n            </form>\n            ');
    } else if (language === 'pirate') {
        resultTitle.append('<h1>Ye\'re a pirate at heart! It\'s a pirate\'s life fer ye </h1>');
        resultsDiv.append('\n            <h2>Pirate Translator <i class="fas fa-arrow-down animated bounce infinite"></i></h2>\n            <form>\n                <textarea class="translator" cols=\'20\' rows=\'4\'></textarea>\n                <input type="submit" value="Sin\' me a shanty">\n            </form>\n        ');
    } else {
        resultTitle.append('<h1>Talking too hard for you? - .. -- .     - ---     --. ---     -... .- -.-. -.-     - ---     - .... .     --. --- --- -..     --- .-.. -..     -.. .- -.-- ...     --- .-.     -- --- .-. ... .     -.-. --- -.. .</h1>');
        resultsDiv.append('\n            <h2>Morse Code Translator <i class="fas fa-arrow-down animated bounce infinite"></i></h2>\n            <form>\n                <textarea class="translator" cols=\'20\' rows=\'4\'></textarea>\n                <input type="submit" value="\uFE0F\u26AA \u26AA\uFE0F \u26AA\uFE0F">\n            </form>\n        ');
    }
    //call giphy api
    app.getGiphy(language);
};

app.smoothScroll = function (el) {
    document.querySelector('.' + el).scrollIntoView({
        behavior: 'smooth'
    });
};

app.translatorOnSubmit = function () {
    console.log('translator language on submit:');
    $('.results').on('submit', $('.translator'), function (e) {
        e.preventDefault();
        var userInput = $('.translator').val();
        //console.log(userInput);
        app.getTranslate(app.userAccentResult, userInput);
        window.scrollTo(0, document.body.scrollHeight);
    });
};

app.quizOnSubmit = function () {
    $('.quiz').on('submit', function (e) {
        e.preventDefault();
        //reset quiz data
        app.quizData = [];
        //get user input
        app.getQuizData();
        //add up quiz data
        var sumQuizData = app.addQuizData();
        console.log(sumQuizData);
        //determine which language wins
        var winningLanguage = app.determineWinningLanguage(sumQuizData);
        app.userAccentResult = winningLanguage;
        console.log(winningLanguage);
        app.displayResults(winningLanguage);
        app.smoothScroll('results');
    });
};
app.setTranslate = function (xPos, yPos, el) {
    el.css('transform', 'translate3d(' + xPos + ', ' + yPos + 'px, 0');
};
app.parallax = function (e) {
    var ca = $('.bubble-ca');
    var no = $('.bubble-no');
    var hi = $('.bubble-hi');
    var ja = $('.bubble-ja');
    var scrollPositionY = window.scrollY;
    app.setTranslate(0, scrollPositionY * 0.3, ca);
    app.setTranslate(0, scrollPositionY * 0.02, no);
    app.setTranslate(0, scrollPositionY * -0.3, hi);
    app.setTranslate(0, scrollPositionY * -0.15, ja);
    requestAnimationFrame(app.parallax);
};

app.init = function () {
    app.parallax();
    app.quizOnSubmit();
    //listen for translation form submit
    app.translatorOnSubmit();
};

//document.ready
$(app.init());