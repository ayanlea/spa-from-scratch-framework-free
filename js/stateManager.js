/* 
check if localstorage is enabled 
*/
if(window.localStorage == null || window.localStorage == 'undefined'){
    document.getElementById("error-element").style.display = "block"
}
else{
    document.getElementById("error-element").style.display = "none";
}
setTimeout(function(){ 
    /* 
    This error message is displayed only for IE 11 or older versions 
    on Windows 7 or 8 operating system where CORS is not 
    fully supported as compared to other modern browsers.
    */
    if(localStorage.length == 0 || localStorage.length == 0){
        document.getElementById("error-element").style.display = "block"
    }
    else{
        document.getElementById("error-element").style.display = "none";
    }
    console.log(" TIme's up ");
}, 3000);
/* End of check */

var userInfo = localStorage.getItem("userObject"),
    userParsed = JSON.parse(userInfo),
    userCategories = localStorage.getItem("userCategories"),
    parsedUserCategories = JSON.parse(userCategories);

var userCountry = "";
var userLoginStatus = "";

if (parsedUserCategories) {
    userCountry = parsedUserCategories[0].country;
    userLoginStatus = userParsed[0].loginState;
}

// side nav section
var sideNavTemplate = document.getElementById("sidenav_template").innerHTML;
var sideNavDataHTML = "";

// custom side nav section
var customSideNavTemplate = document.getElementById("custom_sidenav_template").innerHTML;
var customSideNavDataHTML = "";

// custom category error and options section
var customErrorOptionsTemplate = document.getElementById("category_error_template").innerHTML;
var customErrorOptionsDataHTML = "";

// variables for articles script section
var articlesTemplate = document.getElementById("articles-list-item").innerHTML;
var articleDataHTML = "";

// variables for sources script section
var sourcesTemplate = document.getElementById("sources-list-item").innerHTML;
var sourcesDataHTML = "";

// variables for source details section
var sourceDetailsTemplate = document.getElementById("source-detail-template").innerHTML;
var sourceDetailsDataHTML = "";

// variables for sources script section
var sourcesByCatTemplate = document.getElementById("sources-by-category-section-template").innerHTML;
var sourcesByCatDataHTML = "";

// variables for news details script section
var articleDetailsTemplate = document.getElementById("news-item-detail").innerHTML;
var articleDetailsDataHTML = "";

// login Nav script section
var loginNavTemplate = document.getElementById("login-nav-section-template").innerHTML;

// logout nav script section
var logoutNavTemplate = document.getElementById("logout-nav-section-template").innerHTML;

var LangVal = "en";
var CountryVal = "us";
function hashNavigation() {
    
        var oldhashString = "";
        var arrayVar = [];
    
        if (!location.hash) {
            //getSourceListState();
            topArticlesState();
        } else {
            oldhashString = location.hash;
            var newhashString = oldhashString.split('/');
    
            for (var i = 0; i < newhashString.length; i++) {
                arrayVar[i] = newhashString[i];
            }
            if (arrayVar.length !== null && arrayVar.length !== undefined) {
                if (arrayVar.length > 3) {
                    getArticleDetailsState(arrayVar[4]);
                } else if (arrayVar.length === 3) {
                    getSourceArticleResultsState(arrayVar[2]);
                } else {
                    switch (arrayVar[1]) {
                        case 'signup':
                            registerState();
                            break;
                        case 'login':
                            loginState();
                            break;
                        case 'about':
                            getStaticContent(arrayVar[1]);
                            break;
                        case 'terms':
                            getStaticContent(arrayVar[1]);
                            break;
                        case 'newsApi':
                            getStaticContent(arrayVar[1]);
                            break;
                        case 'privacy':
                            getStaticContent(arrayVar[1]);
                            break;
                        case 'oops':
                            showHideElements("error-source-list-item");
                            break;
                        default:
                            console.log("getSourceByCategoryState(arrayVar[1]) = " + (arrayVar[1]));
                            getSourceByCategoryState(arrayVar[1]);
                    }
                }
            }
        }
    }
    
    function changeCountry(country_code) {
        switch (country_code) {
            case 'us':
                return "U.S.A.";
            case 'gb':
                return "Great Brittain";
            case 'it':
                return "Italy";
            case 'in':
                return "India";
            case 'au':
                return "Australia";
        }
    }
    
    function getSourceArticleResultsState(dataSourceId) {
        var dataPage = "news-list";
        var url = "https://newsapi.org/v1/articles?source=";
        var sort = "&sortBy=";
        var dataSourceSort = "top";
        var apiKey = "&apiKey=57cb74dc4c994bebb02d616d1cabd514";
        getData(url, dataSourceId, sort, dataSourceSort, apiKey, dataSourceId, dataPage);


        var localData = localStorage.getItem("articleObject");
        var parsedLocalData = JSON.parse(localData);
    
        for (var i in parsedLocalData) {
            if (parsedLocalData[i].source === dataSourceId) {
                articleDataHTML += articlesTemplate.replace(/{{articleAuthor}}/g, parsedLocalData[i].author)
                    .replace(/{{articleSource}}/g, parsedLocalData[i].source)
                    .replace(/{{articleTitle}}/g, parsedLocalData[i].title)
                    .replace(/{{articleDescription}}/g, parsedLocalData[i].description)
                    .replace(/{{articleUrl}}/g, parsedLocalData[i].url)
                    .replace(/{{articleImage}}/g, parsedLocalData[i].urlToImage)
                    .replace(/{{articleSlugTitle}}/g, parsedLocalData[i].slugtitle);
    
                document.getElementById("news-list").innerHTML = articleDataHTML;
            }
        }
        showHideElements("news-list");
    }
    
    function getSourceByCategoryState(category) {
    
        sourcesByCatDataHTML = "";
        sourceDetailsDataHTML = "";
        var parsedLocalData = fullSourceList["sources"];
        for (var i in parsedLocalData) {
            // matches based on source category
            var catCheck = new RegExp(parsedLocalData[i].category);
            if (catCheck.test(category)) {
                sourcesByCatDataHTML += sourcesByCatTemplate.replace(/{{sourceId}}/g, parsedLocalData[i].id)
                    .replace(/{{sourceName}}/g, parsedLocalData[i].name)
                    .replace(/{{sourceDescription}}/g, parsedLocalData[i].description)
                    .replace(/{{sourceUrl}}/g, parsedLocalData[i].url)
                    .replace(/{{sourceCategory}}/g, parsedLocalData[i].category)
                    .replace(/{{sourceSort}}/g, parsedLocalData[i].sortBysAvailable[0]);
    
                removeOldElementsByQuery();
                document.getElementById("news-list").innerHTML = sourcesByCatDataHTML;
                showHideElements("news-list");
            }
            // matches based on source name
            var sourceCheck = new RegExp(parsedLocalData[i].id);
            if (sourceCheck.test(category)) {
                sourceDetailsDataHTML += sourceDetailsTemplate.replace(/{{sourceId}}/g, parsedLocalData[i].id)
                    .replace(/{{sourceName}}/g, parsedLocalData[i].name)
                    .replace(/{{sourceDescription}}/g, parsedLocalData[i].description)
                    .replace(/{{sourceUrl}}/g, parsedLocalData[i].url)
                    .replace(/{{sourceCategory}}/g, parsedLocalData[i].category)
                    .replace(/{{sourceSort}}/g, parsedLocalData[i].sortBysAvailable[0]);
    
                document.getElementById("news-list").innerHTML = sourceDetailsDataHTML;
                showHideElements("news-list");
            }
        }
    }
    
    function getArticleDetailsState(title) {
        var localArticleData = localStorage.getItem("articleObject");
        var parsedArticleData = JSON.parse(localArticleData);
        if (parsedArticleData !== null || parsedArticleData !== 'undefined') {
    
            for (var i in parsedArticleData) {
                if (title === parsedArticleData[i].slugtitle) {
                    articleDetailsDataHTML = "";
                    articleDetailsDataHTML += articleDetailsTemplate.replace(/{{articleDetailsSource}}/g, parsedArticleData[i].source)
                        .replace(/{{articleDetailsAuthor}}/g, parsedArticleData[i].author)
                        .replace(/{{articleDetailsTile}}/g, parsedArticleData[i].title)
                        .replace(/{{articleDetailsDescription}}/g, parsedArticleData[i].description)
                        .replace(/{{articleDetailsUrl}}/g, parsedArticleData[i].url)
                        .replace(/{{articleDetailsUrlToImage}}/g, parsedArticleData[i].urlToImage);
    
                    document.getElementById("news-details").innerHTML = articleDetailsDataHTML;
    
                    showHideElements("news-details");
    
                } else {
                    //console.log("Invalid");
                }
            }
        } else {
    
            var topSources = ["usa-today", "associated-press", "reuters", "the-new-york-times"];
            getJSONnews(url + topSources[i] + sort + apiKey,
                function(err, data) {
                    if (err !== null) {
                        console.log('Something went wrong: ' + err);
                    } else {
                        var apimsg = data.articles;
                        var source = data.source;
                        for (var key in apimsg) {
                            NewsApiByUserModel.setNewsArticle(
                                source,
                                apimsg[key].author,
                                apimsg[key].title,
                                apimsg[key].description,
                                apimsg[key].url,
                                apimsg[key].urlToImage,
                                apimsg[key].publishedAt
                            );
                        }
                    }
                });
            getSourceArticleResultsState(topSources[i]);
        }
    }
    
    function customSideNav() {
    
        var userInfo = localStorage.getItem("userObject");
        var userParsed = JSON.parse(userInfo);
        if (typeof userInfo !== 'undefined' && userInfo !== null && userParsed[0].loginState == true) {
            document.getElementById("custom_side_category_nav").innerHTML = "";
            document.getElementById("userSpecificNewsByCountry").innerHTML = "from " + changeCountry(userCountry);
            for (var i = 0; i < parsedUserCategories[0].categories.length; i++) {
    
                customSideNavDataHTML += customSideNavTemplate.replace(/{{Category}}/g, parsedUserCategories[0].categories[i])
                    .replace(/{{country}}/g, userCountry)
                    .replace(/{{category}}/g, parsedUserCategories[0].categories[i]);
    
                document.getElementById("custom_side_category_nav").innerHTML = customSideNavDataHTML;
    
            }
            document.getElementById("banner").setAttribute("style", "display:none");
        } else {
    
            var availableCats = ["general", "technology", "business", "politics", "entertainment", "sport", "gaming", "music", "science-and-nature"];
    
            for (var i = 0; i < availableCats.length; i++) {
                /* custom user side bar */
                sideNavDataHTML += sideNavTemplate.replace(/{{Category}}/g, availableCats[i])
                    .replace(/{{category}}/g, availableCats[i])
                    .replace(/{{categoryURL}}/g, availableCats[i]);
    
                document.getElementById("side_category_nav").innerHTML = sideNavDataHTML;
            }
            document.getElementById("userSpecificNewsByCountry").innerHTML = "";
            document.getElementById("custom_side_category_nav").innerHTML = "";
        }
    }
    
    function topArticlesState() {
        
        var localData = localStorage.getItem("articleObject");
        var parsedLocalData = JSON.parse(localData);
        var userInfo = localStorage.getItem("userObject");
        var userParsed = JSON.parse(userInfo);
    
        var dataPage = "news-list";
        var topSources = ["usa-today", "associated-press", "reuters", "the-new-york-times"];
    
        var url = "https://newsapi.org/v1/articles?source=";
        var sort = "&sortBy=";
        var dataSourceSort = "top";
        var apiKey = "&apiKey=57cb74dc4c994bebb02d616d1cabd514";
        var countSourcesloggedOut = 0;
        var countSources = 0;
        if (!userCountry) {
            for (var i = 0; i < topSources.length; i++) {
                getData(url, topSources[i], sort, dataSourceSort, apiKey, topSources[i], dataPage);
            }
        } else if (parsedLocalData !== null || parsedLocalData !== 'undefined' && userCountry !== "") {
            for (var key in fullSourceList["sources"]) {
                if (userCountry == fullSourceList["sources"][key].country) {
                    while (countSourcesloggedOut < 3) {
                        var sourceCountryMatched = fullSourceList["sources"][key].id;
                        getData(url, sourceCountryMatched, sort, dataSourceSort, apiKey, sourceCountryMatched, dataPage);
                        countSourcesloggedOut++;
                    }
                }
            }
        }
    }
    
    function getSourceListState() {
        sourcesDataHTML = "";
        for (var key in fullSourceList["sources"]) {
            sourcesDataHTML += sourcesTemplate.replace(/{{sourceId}}/g, fullSourceList["sources"][key].id)
                .replace(/{{sourceName}}/g, fullSourceList["sources"][key].name)
                .replace(/{{sourceDescription}}/g, fullSourceList["sources"][key].description)
                .replace(/{{sourceUrl}}/g, fullSourceList["sources"][key].url)
                .replace(/{{sourceCategory}}/g, fullSourceList["sources"][key].category)
                .replace(/{{sourceSort}}/g, fullSourceList["sources"][key].sortBysAvailable[0]);
    
            document.getElementById("source_list").innerHTML = sourcesDataHTML;
    
        }
        showHideElements("source_list");
    }
    
    function loginState() {
        showHideElements("login-section");
    }
    
    function registerState() {
        showHideElements("register-section");
    }
    
    function getSourceCategoryResults(e) {
        var dataSourceSort = e.getAttribute("data-source-sort");
        var dataPage = e.getAttribute("data-page");
        var dataSourceId = e.getAttribute("data-source-id");
    
        articleBySourceCalls(dataSourceSort, dataPage, dataSourceId);
    }
    
    function articleBySourceCalls(dataSourceSort, dataPage, dataSourceId) {
        var url = "https://newsapi.org/v1/articles?source=";
        var source = dataSourceId;
        var sort = "&sortBy=";
        var apiKey = "&apiKey=57cb74dc4c994bebb02d616d1cabd514";
    
        var localData = localStorage.getItem("articleObject");
        var parsedLocalData = JSON.parse(localData);
        //getData(url, source, sort, dataSourceSort, apiKey, dataSourceId, dataPage);
        if (typeof localData !== 'undefined' && localData !== null) {
            console.log("Local storage is NOT empty AND localData = "+localData+" AND dataSourceId = "+dataSourceId);
            for (var i = 0; i < parsedLocalData.length; i++) {
                articleDataHTML = "";
                if (parsedLocalData[i].source === dataSourceId) {
                    console.log("articleBySourceCalls() dataSourceId = "+dataSourceId);
                    articleDataHTML += articlesTemplate.replace(/{{articleAuthor}}/g, parsedLocalData[i].author)
                        .replace(/{{articleSource}}/g, parsedLocalData[i].source)
                        .replace(/{{articleTitle}}/g, parsedLocalData[i].title)
                        .replace(/{{articleDescription}}/g, parsedLocalData[i].description)
                        .replace(/{{articleUrl}}/g, parsedLocalData[i].url)
                        .replace(/{{articleImage}}/g, parsedLocalData[i].urlToImage)
                        .replace(/{{articleSlugTitle}}/g, parsedLocalData[i].slugtitle);
                    document.getElementById("news-list").innerHTML = articleDataHTML;
                }
            }
            
        } else {
            getData(url, source, sort, dataSourceSort, apiKey, dataSourceId, dataPage);
    
        }
    }
    
    function getCategory(e) {
        setActiveClass();
        removeOldElementsByID("news-list");
        removeOldElementsByID("news-details");
        e.setAttribute("class", "active");
        var dataSidebarName = e.getAttribute("data-sidebar-name");
        var dataPage = e.getAttribute("data-page");
        var localData = localStorage.getItem("sourceObject");
        var parsedLocalData = JSON.parse(localData);
    
        sourcesByCatDataHTML = "";
        for (var i in parsedLocalData) {
            var catCheck = new RegExp(parsedLocalData[i].category);
            if (catCheck.test(dataSidebarName)) {
                sourcesByCatDataHTML += sourcesByCatTemplate.replace(/{{sourceId}}/g, parsedLocalData[i].id)
                    .replace(/{{sourceName}}/g, parsedLocalData[i].name)
                    .replace(/{{sourceDescription}}/g, parsedLocalData[i].description)
                    .replace(/{{sourceUrl}}/g, parsedLocalData[i].url)
                    .replace(/{{sourceCategory}}/g, parsedLocalData[i].category)
                    .replace(/{{sourceSort}}/g, parsedLocalData[i].sortBysAvailable[0]);
    
                removeOldElementsByQuery();
                document.getElementById(dataPage).innerHTML = sourcesByCatDataHTML;
                showHideElements(dataPage);
            } else {
                //console.log("Invalid selection");
            }
        }
    }
    
    function getCustomCategory(e) {
        setActiveClass();
        removeOldElementsByID("news-list");
        removeOldElementsByID("news-details");
        e.setAttribute("class", "active");
        var dataSidebarName = e.getAttribute("data-sidebar-name");
        var dataSidebarCountry = e.getAttribute("data-country");
        var dataPage = e.getAttribute("data-page");
        customErrorOptionsDataHTML = "";
        sourcesByCatDataHTML = "";
        for (var i in fullSourceList["sources"]) {
            var catCheck = new RegExp(fullSourceList["sources"][i].category);
            if (userCountry === dataSidebarCountry && catCheck.test(dataSidebarName) && fullSourceList["sources"][i].country === userCountry) {
                sourcesByCatDataHTML += sourcesByCatTemplate.replace(/{{sourceId}}/g, fullSourceList["sources"][i].id)
                    .replace(/{{sourceName}}/g, fullSourceList["sources"][i].name)
                    .replace(/{{sourceDescription}}/g, fullSourceList["sources"][i].description)
                    .replace(/{{sourceUrl}}/g, fullSourceList["sources"][i].url)
                    .replace(/{{sourceCategory}}/g, fullSourceList["sources"][i].category)
                    .replace(/{{sourceSort}}/g, fullSourceList["sources"][i].sortBysAvailable[0]);
    
                removeOldElementsByQuery();
                document.getElementById(dataPage).innerHTML = sourcesByCatDataHTML;
                showHideElements(dataPage);
            } else if (!catCheck.test(dataSidebarName) && fullSourceList["sources"][i].country === userCountry) {
                history.pushState(null, null, '#/oops');
                document.getElementById("errorWithUserCountry").innerHTML = changeCountry(dataSidebarCountry);
                document.getElementById("customErrorResponse").innerHTML = dataSidebarName;
    
                customErrorOptionsDataHTML += customErrorOptionsTemplate.replace(/{{sourceId}}/g, fullSourceList["sources"][i].id)
                    .replace(/{{sourceName}}/g, fullSourceList["sources"][i].name)
                    .replace(/{{sourceCategory}}/g, fullSourceList["sources"][i].category)
                    .replace(/{{sourceSort}}/g, fullSourceList["sources"][i].sortBysAvailable[0]);
    
                document.getElementById("categoryOptions").innerHTML = customErrorOptionsDataHTML;
    
                showHideElements("error-source-list-item");
            }
        }
    }
    
    function getSourceDetails(e) {
        removeOldElementsByID("news-list");
        removeOldElementsByID("news-details");
    
        var dataPage = e.getAttribute("data-page");
        var dataSourceId = e.getAttribute("data-source-id");
    
        var localData = localStorage.getItem("sourceObject");
        var parsedLocalData = JSON.parse(localData);
    
        sourceDetailsDataHTML = "";
        for (var i in parsedLocalData) {
            var catCheck = new RegExp(parsedLocalData[i].id);
            if (catCheck.test(dataSourceId)) {
                sourceDetailsDataHTML += sourceDetailsTemplate.replace(/{{sourceId}}/g, parsedLocalData[i].id)
                    .replace(/{{sourceName}}/g, parsedLocalData[i].name)
                    .replace(/{{sourceDescription}}/g, parsedLocalData[i].description)
                    .replace(/{{sourceUrl}}/g, parsedLocalData[i].url)
                    .replace(/{{sourceCategory}}/g, parsedLocalData[i].category)
                    .replace(/{{sourceSort}}/g, parsedLocalData[i].sortBysAvailable[0]);
    
                document.getElementById(dataPage).innerHTML = sourceDetailsDataHTML;
                showHideElements(dataPage);
            } else {
                //console.log("Invalid selection");
            }
        }
    }
    
    function setActiveClass() {
        var childs = document.querySelectorAll('a[data-sidebar-name]');
        for (var i = 0; i < childs.length; i++) {
            childs[i].removeAttribute("class");
        }
    }
    
    window.onload = userState;
    
    customSideNav();
    
    function removeOldElementsByID(elemID) {
        articleDataHTML = "";
        var newsList = document.getElementById(elemID);
        while (newsList.firstChild !== null) {
            newsList.removeChild(newsList.firstChild);
        }
    }
    
    function removeOldElementsWithQueryAll(elemID) {
        articleDataHTML = "";
        var x = document.querySelectorAll(elemID);
    
        for (var i = 0; i < x.length; i++) {
            x[i].innerHTML = "";
        }
    }
    
    hashNavigation();
    window.addEventListener("hashchange", hashNavigation);
    
    function removeOldElementsByQuery() {
        var childs = document.querySelectorAll("#source-list-item");
        for (var i = 0; i < childs.length; i++) {
            childs[i].outerHTML = "";
        }
    }
    
    function getArticleDetails(e) {
        removeOldElementsByID("news-list");
        removeOldElementsByID("news-details");
    
        var dataArticleId = e.getAttribute("data-article-id");
        getArticleDetailsState(dataArticleId);
    
    }