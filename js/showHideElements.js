function showHideElements(targetElement) {
    console.log("showHideElements() was called")
    var childs = document.getElementById("mainContainer").children;
    for (var i =0; i < childs.length; i++){
        childs[i].setAttribute("style","display:none");
    }
    document.getElementById(targetElement).removeAttribute("style");
}