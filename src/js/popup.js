
import WordCloud from 'wordcloud';

chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, (tabs) => {

    const url = tabs[0].url;

    if (url.includes("amazon.") && (url.includes("dp") || url.includes("gp/product"))) {

        document.getElementsByClassName("loader")[0].style.display = "block";

        const id = url.split("/")[3] === "dp" ? url.split("/")[4] : url.split("/")[5];

        fetch('https://hidden-sea-34612.herokuapp.com/reviews/?id=' + id).then((response) => {
            response.json().then((json) => {

                let commentsString = json.map( object => object.comment).join(" ");
                //remove special characters
                commentsString = commentsString.replace(/,/g, "");
                commentsString = commentsString.replace(/\./g, "");
                commentsString = commentsString.replace(/\(/g, "");
                commentsString = commentsString.replace(/\)/g, "");
                commentsString = commentsString.replace(/\’/g, "'");
                //remove break lines
                commentsString = commentsString.replace(/(\r\n|\n|\r)/gm,"").toLowerCase();

                //count occurences
                let counts = commentsString.split(" ").reduce((map, word) => {
                    if(!stopWords.includes(word) && !numbers.includes(word)) {
                        map[word] = (map[word]||0)+1;
                    }
                    return map;
                }, Object.create(null));
                counts = Object.entries(counts).sort((a, b) => b[1] - a[1]);
                WordCloud([
                    document.getElementById('canvas'),
                    document.getElementById('wordCloud'),
                  ], {
                        list: counts, 
                        rotateRatio: 0, 
                        color: () => {
                            return (['#FF9901', '#232f3e', '#48a3c6'])[Math.floor(Math.random() * 3)]
                        },
                        fontFamily: 'Times, serif',
                    });
                document.getElementsByClassName("loader")[0].style.display = "none";
            });
        });
    } else {
        document.getElementById("wordCloud").innerHTML = "The awesome word cloud will be here next time you visit an Amazon product page !";
    }

    const stopWords = ['about', 'after', 'all', 'also', 'am', 'an', 'and', 'another', 'any', 'are', 'as', 'at', 'be',
    'because', 'been', 'before', 'being', 'between', 'both', 'but', 'by', 'came', 'can',
    'come', 'could', 'did', 'do', 'does', 'doesn\'t', 'each', 'for', 'from', 'get', 'got', 'has', 'had',
    'he', 'have', 'her', 'here', 'him', 'himself', 'his', 'how', 'if', 'in', 'into',
    'is', 'it', 'its', "it's", 'like', 'make', 'many', 'me', 'might', 'more', 'most', 'much', 'must',
    'my', 'never', 'now', 'of', "off", 'on', 'only', 'or', 'other', 'our', 'out', 'over',
    'said', 'same', 'see', 'so', 'should', 'since', 'some', 'still', 'such', 'take', 'than',
    'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they', 'this', 'those',
    'through', 'to', 'too', 'under', 'up', 'very', 'was', 'way', 'we', 'well', 'were',
    'what', 'where', 'which', 'while', 'who', 'with', 'would', 'you', 'your', 'a', 'i'];

    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
})