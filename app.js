
    

var cb = new Codebird;
cb.setConsumerKey('cVUh1DRv4uteZOPHYobdL97z6','pjf4cDzfOT5EOvrRp4UbMPsKYK9UxgVsXuyogxHV2UJB88zibt');
cb.setToken('137125862-8sdqJPhuBpNtmguunEvl8MyrKgzzmhKlwXa93JC0','5zllwZloBarcsnclVLI7GzLIVWqIfxYKPvKOpmzNPknjQ');
cb.setBearerToken("AAAAAAAAAAAAAAAAAAAAALpp5QAAAAAA%2BlwVTLlQ0aNC1W7N%2FXwXEWWezqs%3DzroV1W5KOFeGqLHHOxDjdZafl0uKV4iwrlI2lNqPoGbE3kml8p");

var slideIndex = 0;
showSlides();

function showSlides() {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("dot");
    for (i = 0; i < slides.length; i++) {
       slides[i].style.display = "none";  
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}    
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";  
   
    setTimeout(showSlides, 2000); // Change image every 2 seconds
}

function nextImage(element)
{
    var img = document.getElementById(element);

    for(var i = 0; i < imgArray.length;i++)
    {
        if(imgArray[i].src == img.src) // << check this
        {
            if(i === imgArray.length){
                document.getElementById(element).src = imgArray[0].src;
                break;
            }
            document.getElementById(element).src = imgArray[i+1].src;
            break;
        }
    }
}

// set up handlebars template
var tweetsTemplate   = $("#tweets-template").html();
var compiledTweetTemplate = Handlebars.compile(tweetsTemplate);

// set up obj SEARCH TWEETS
var content = {
    tweets : [] //arr to fill w/ tweets
}
    
const $button = $('#buttn');
const $searchInput = $('#input');

$button.on('click', function(event) {
    event.preventDefault();
    let val = $searchInput.val();
    if (val === '') {
        alert('You must type in a value!');
 } else {
    $('.term').html("Now searching for '"+ $searchInput.val()+ "'...");
    $('#img').show(); //<----here
  //  $(window).on("load", function(){
    //     $('#img').hide();  //<--- hide again
      //  })
    
    getTweets();
    $searchInput.val('');  
    }
});

 function getTweets() {
    let query = $searchInput.val();
    console.log(query);
    cb.__call(
        "search_tweets",
        {"q": "#"+ query,
         "lang": "en"  },
        null, // no callback needed, we have the promise
        true // app-only auth
    
    ).then(function (data) {
        //var result = JSON.stringify(data);
        add(data);
    },
    
    function (err) {
        alert("error: ");
     });
 };   

function add(data){
    console.log(data);
    const tweetArr = data.reply.statuses;
    //console.log(tweetArr);
    var self = this;
    tweetArr.forEach(function(value){
        self.content.tweets.push({
                screenName: value.user.screen_name,
                profileImage: value.user.profile_image_url,
                name: value.user.name,
                time: value.created_at,
                text: value.text,   
        })  
    });
    console.log(content.tweets);
        $('#img').hide();  //<--- hide again
    $(".tweets-list-container").html(compiledTweetTemplate(content));
}

Handlebars.registerHelper('formatDate', function(date) {
    return date.substr(0, 19);
});

Handlebars.registerHelper("button", function (text) {
    var button = $('<button></button>').text(text).attr('onclick', 'button_clickEvent()');
    return $('<div></div>').append(button).html();
});

Handlebars.registerHelper("link", function (object) {
    var url = Handlebars.escapeExpression(object.url),
    text = Handlebars.escapeExpression(object.text);
    return new Handlebars.SafeString
    ("<a href='" + url + ">" + text + "</a>");
  });

var button_clickEvent = function () {
    alert("Button " + $(this).text() + "clicked.");
};









// TRENDS set up handlebars template
var trendsTemplate   = $("#trends-template").html();
var compiledTweetTemplate2 = Handlebars.compile(trendsTemplate);

var content2 = {
        tweets : [] 
}
        
const $button2 = $('#button2');
$button2.on('click', function(event) {
    event.preventDefault();
    $('#img').show();
    getTrends();
});

//search tweets based on WOEID id
function getTrends() {
cb.__call(
    "trends_place",
    {"id": "23424977"}
).then(function (data) {
    var result = JSON.stringify(data);
    displayTrends(result);

},
function (err) {
    alert("error: ");
 });
};

function displayTrends(result){
    var trendsObj = JSON.parse(result);
       console.log(trendsObj);
        const trendsArr = trendsObj.reply[0].trends;
        var self = this;
        trendsArr.forEach(function(value){
            self.content2.tweets.push({
                    topic: value.name,
                    popularity: value.tweet_volume,
                    site: value.url
            })
           
        });
        console.log(content2.tweets);
        $('#img').hide();
        $(".trends-list-container").html(compiledTweetTemplate2(content2));
    };









// GET NEWS PAGE
var newsTemplate   = $("#news-template").html();
var compiledTweetTemplate3 = Handlebars.compile(newsTemplate);

// set up obj SEARCH TWEETS
var content3 = {
    news : [] //arr to fill w/ tweets
}
   
const $searchInput2 = $('#searchNews');      
const $button3 = $('#button3');
$button3.on('click', function(event) {
        event.preventDefault();
        let val = $searchInput2.val();
        if (val === '') {
            alert('You must type in a value!');
     } else {
        $('.newSearch').html("Now searching for '"+ $searchInput2.val()+ "'...");
        $('#img').show();
        getData();
        $searchInput2.val('');  
        }
    });
        
//Get NEWS API
const newsApiKey = "8a3205dcc78a48ce8626c9ef1c8b7e74";
function getData() {
    let query = $searchInput2.val();
    fetch("https://newsapi.org/v2/everything?q="+query+ "&apiKey=" + newsApiKey).then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        alert("error");
      }
    }).then(function(data) {
      return sortNews(data);
    });
  }


  function sortNews(data){
      console.log(data);
      const newsArr = data.articles;
      var self = this;
      newsArr.forEach(function(value){
          self.content3.news.push({
                  author: value.author,
                  description: value.description,
                  datePublished: value.publishedAt,
                  source: value.source.name,
                  title: value.title,
                  url: value.url,
                  img: value.urlToImage
          })
         
      });
      console.log(content3.news);
      $('#img').hide();
      $(".news-list-container").html(compiledTweetTemplate3(content3));
  };




$(window).load(function() {
    // Animate loader off screen
    $(".se-pre-con").fadeOut("slow");
});

function openPage(pageName,elmnt,color) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }
    document.getElementById(pageName).style.display = "block";
    elmnt.style.backgroundColor = color;

}
// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();