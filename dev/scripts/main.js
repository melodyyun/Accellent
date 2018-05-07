
const app = {
    giphyKey: '2WHYoEt65SLe9Jfw6Kpm7VUHbJIQYE9j'
};
//arrays
app.quizOptions =['country', 'food', 'character', 'beverage'];
app.quizData=[];

app.randomNum = () => Math.floor(Math.random()*10);

//----------
//API Calls
//----------
app.getGiphy = (memeKeyword) => {
    const xhr = $.get(`http://api.giphy.com/v1/gifs/search?q=${memeKeyword}&api_key=${app.giphyKey}&limit=10`);
    xhr.done(function (data) { 
        let randomPull = app.randomNum();
        console.log("success got data", data); 
        const $giphy = $('.giphy');
        $giphy.empty();
        $giphy.append(`
            <iframe 
                src="${data.data[randomPull].embed_url}" 
                frameBorder="0" 
                class="giphy-embed" allowFullScreen>
            </iframe>
        `);
    });
} ;

//FunTranslation public API calls allows for 60 API calls a day with distribution of 5 calls an hour. 
app.getTranslate = (language, userInput) => {
    console.log(language, userInput);
    $.ajax({
        url: `http://api.funtranslations.com/translate/${language}.json`,
        method: 'POST',
        dataType: 'json',
        data: {
            text: userInput,
        }
    }).then(function(res){
        console.log(res);
        const $translatedText = $('.translated-text');
        $translatedText.empty();
        $translatedText.removeClass('hide');
        $translatedText.append(`
        <p class="speech-bubble">${res.contents.translated}</p>`);
        //check to see if this works -------------------------------------------------------------------------------------------
        app.smoothScroll('translated-text');
    });
};

//---------------------
//Quiz functionalities
//---------------------
app.getQuizData = () => {
    app.quizOptions.forEach(question => {
        const quizObject = $(`input[name=${question}]:checked`).data();
        app.quizData.push(quizObject);
    });
}

app.addQuizData = () => {
    return app.quizData.reduce((acc, curr) => {
        for (let key in curr) {
            if (acc[key] === undefined) {
                acc[key] = 0;
            }
            acc[key] += curr[key];
        }
        return acc;
    }, {});
}

app.determineWinningLanguage = (sumQuizData) => {
    return Object.keys(sumQuizData).reduce((curr, acc) => {
        return sumQuizData[curr] > sumQuizData[acc] ? curr : acc;
    });
}

app.displayResults = (language) => {
    const resultTitle = $('.result-title');
    const resultsDiv = $('.results');
    resultTitle.empty();
    resultsDiv.empty();
    if(language==='shakespeare'){
        resultTitle.append(`<h1>Speaketh as if 't be true thou wast Shakespeare!</h1>`);
        resultsDiv.append(`
            <h2>Shakespeare Translator <i class="fas fa-arrow-down animated bounce infinite"></i></h2>
            <form>
                <textarea class="translator" cols='20' rows='4'></textarea>
                <input type="submit" value="Heareth mine voice">
            </form>
            `);
    }else if (language==='pirate'){
        resultTitle.append(`<h1>Ye're a pirate at heart! It's a pirate's life fer ye </h1>`);
        resultsDiv.append(`
            <h2>Pirate Translator <i class="fas fa-arrow-down animated bounce infinite"></i></h2>
            <form>
                <textarea class="translator" cols='20' rows='4'></textarea>
                <input type="submit" value="Sin' me a shanty">
            </form>
        `);
    }else{
        resultTitle.append(`<h1>Talking too hard for you? - .. -- .     - ---     --. ---     -... .- -.-. -.-     - ---     - .... .     --. --- --- -..     --- .-.. -..     -.. .- -.-- ...     --- .-.     -- --- .-. ... .     -.-. --- -.. .</h1>`);
        resultsDiv.append(`
            <h2>Morse Code Translator <i class="fas fa-arrow-down animated bounce infinite"></i></h2>
            <form>
                <textarea class="translator" cols='20' rows='4'></textarea>
                <input type="submit" value="️⚪ ⚪️ ⚪️">
            </form>
        `);
    }
    //call giphy api
    app.getGiphy(language);
};

app.smoothScroll = (el) => {
    document.querySelector(`.${el}`).scrollIntoView({
        behavior: 'smooth'
    });
}

app.translatorOnSubmit = () => {
    console.log('translator language on submit:',);
    $('.results').on('submit', $('.translator'), function(e){
        e.preventDefault();
        const userInput = $('.translator').val();
        //console.log(userInput);
        app.getTranslate(app.userAccentResult, userInput);
        window.scrollTo(0, document.body.scrollHeight);
    });
}

app.quizOnSubmit = () => {
    $('.quiz').on('submit', function(e){
        e.preventDefault();
        //reset quiz data
        app.quizData = [];
        //get user input
        app.getQuizData();
        //add up quiz data
        const sumQuizData = app.addQuizData();
        console.log(sumQuizData);
        //determine which language wins
        const winningLanguage = app.determineWinningLanguage(sumQuizData);
        app.userAccentResult = winningLanguage;
        console.log(winningLanguage);
        app.displayResults(winningLanguage);
        app.smoothScroll('results');
    });
}
app.setTranslate = (xPos, yPos, el) => {
    el.css('transform', `translate3d(${xPos}, ${yPos}px, 0`)
}
app.parallax = (e) => {
    const ca = $('.bubble-ca');
    const no = $('.bubble-no');
    const hi = $('.bubble-hi');
    const ja = $('.bubble-ja');
    let scrollPositionY = window.scrollY;
    app.setTranslate(0, scrollPositionY * 0.3, ca);
    app.setTranslate(0, scrollPositionY * 0.02, no);
    app.setTranslate(0, scrollPositionY * -0.3, hi);
    app.setTranslate(0, scrollPositionY * -0.15, ja);
    requestAnimationFrame(app.parallax)
};

app.init = () => {
    app.parallax();
    app.quizOnSubmit();
    //listen for translation form submit
    app.translatorOnSubmit();
};

//document.ready
$(app.init());


