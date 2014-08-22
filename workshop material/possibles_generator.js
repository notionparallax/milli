function httpGet(theUrl)
{
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
for (i=0; i<4;i++){
  console.log(httpGet('http://itsthisforthat.com/api.php?text'));
}