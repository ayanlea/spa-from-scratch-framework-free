function userState(){
    console.log("userState() was called")
    var userInfo = localStorage.getItem("userObject");
    var userParsed = JSON.parse(userInfo);
    if (typeof userInfo !== 'undefined' && userInfo !== null && userParsed[0].loginState === true){
        document.getElementById("registerHref").innerHTML = '';
        document.getElementById("loginNav").innerHTML = logoutNavTemplate;
        console.log("userState => userInfo[0].loginState ="+userParsed[0].loginState);
    }
    else {
        document.getElementById("registerHref").innerHTML = 'Sign Up';
        document.getElementById("loginNav").innerHTML = loginNavTemplate;
    }
}
function login(e) {
    console.log("login() was called")
    var dataPage = e.getAttribute("data-page");
    showHideElements(dataPage);
    var userInfo = localStorage.getItem("userObject");
    var userParsed = JSON.parse(userInfo);
    if(userParsed !== null){
        userParsed[0].loginState = true;
    }
}
function logout(e) {
    console.log("logout() was called")
    var userInfo = localStorage.getItem("userObject");
    var userParsed = JSON.parse(userInfo);
        userParsed[0].loginState = false;
        
    localStorage.setItem('userObject',JSON.stringify(userParsed));
    var dataPage = e.getAttribute("data-page");
    document.getElementById("registerHref").innerHTML = 'Sign Up';
    document.getElementById("loginNav").innerHTML = loginNavTemplate;
    
    var t = 0;
    do{
        document.getElementById("banner").removeAttribute("style"); 
        t++;
    }
    while (t < 3);
    customSideNav();
    topArticlesState();  
   }
function getRegister(e) {
    console.log("getRegister() was called")
    var dataPage = e.getAttribute("data-page");
    showHideElements(dataPage);
}


function loginForm() {
    console.log("loginForm() was called")
    var firstname = document.forms["loginform"]["firstnameLogin"].value;
    var lastname = document.forms["loginform"]["lastnameLogin"].value;
    var email = document.forms["loginform"]["emailLogin"].value;
    var password = document.forms["loginform"]["passwordLogin"].value;

    var userInfo = localStorage.getItem("userObject");
    var userParsed = JSON.parse(userInfo);
    
    if (userParsed == null || userParsed == 'undefined'){ 
        document.getElementById("firstnameError").innerHTML = '<br/>Create New Account Please <a href="#/signup" id="registerHref" data-page="register-section" onclick="getRegister(this)">Sign Up</a>';
        document.forms["loginform"]["firstnameLogin"].addEventListener('focus', function() {
        document.getElementById("firstnameError").innerHTML = "";
        });
        return false;
    }

    if (userParsed[0].firstname !== firstname){ 
        document.getElementById("firstnameError").innerHTML = "<br/>firstname incorrect";
        document.forms["loginform"]["firstnameLogin"].addEventListener('focus', function() {
        document.getElementById("firstnameError").innerHTML = "";
        });
        return false;
    }
    if (userParsed[0].lastname !== lastname){ 
        document.getElementById("lastnameError").innerHTML = "<br/>lastname incorrect";
        document.forms["loginform"]["lastnameLogin"].addEventListener('focus', function() {
        document.getElementById("lastnameError").innerHTML = "";
        });
        return false;
    }
    if (userParsed[0].email !== email){ 
        document.getElementById("emailError").innerHTML = "<br/>email incorrect";
        document.forms["loginform"]["emailLogin"].addEventListener('focus', function() {
        document.getElementById("emailError").innerHTML = "";
        });
        return false;
    }  
    if (userParsed[0].password !== password){ 
        document.getElementById("passwordError").innerHTML = "<br/>password incorrect";
        document.forms["loginform"]["passwordLogin"].addEventListener('focus', function() {
        document.getElementById("passwordError").innerHTML = "";
        });
        return false;
    }
    
    userParsed[0].loginState = true;
        
    localStorage.setItem('userObject',JSON.stringify(userParsed));
    userState();
    topArticlesState();
    history.pushState(null, null, '#/');
}

function registrationForm() {
    console.log("registrationForm() was called")
    document.getElementById("register-section").style.display = "none";
    var categories = [];
    var firstname = document.forms["registerform"]["firstnameRegister"].value;
    var lastname = document.forms["registerform"]["lastnameRegister"].value;
    var email = document.forms["registerform"]["emailRegister"].value;
    var password = document.forms["registerform"]["passwordRegister"].value;
    var terms = document.forms["registerform"]["termsRegister"].value;
    var country = document.forms["registerform"]["country"].value;
    var list = document.getElementsByName('category');
    for(var i=0;i<list.length;i++){
       if(list[i].type=='checkbox' && list[i].checked){
        categories.push(list[i].value);
       }
    }
    var loginState = true;

    NewsApiByUserModel.setUser(firstname, lastname, password, email, terms, loginState,country,categories);
    userState();
    history.pushState(null, null, '#');
    
} 