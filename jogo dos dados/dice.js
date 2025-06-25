// Gerar n aleatório de 1 a 6
function  playGame()
{
    var randomNumberOne=Math.floor(Math.random()*6)+1;
    var randomImageOnePath="dados/"+randomNumberOne+".png";

    var randomNumberTwo=Math.floor(Math.random()*6)+1;
    var randomImageTwoPath="dados/"+randomNumberTwo+".png";

    var image1=document.querySelectorAll("img")[0];
    image1.setAttribute("src", randomImageOnePath);

    var image2=document.querySelectorAll("img")[1];
    image2.setAttribute("src", randomImageTwoPath);

    if (randomNumberOne>randomNumberTwo)
    {
        document.querySelector("h1").innerHTML = "Ganha o jogador 1!"
    }
    else    if (randomNumberTwo>randomNumberOne)
    {
        document.querySelector("h1").innerHTML = "Ganha o jogador 2!"
}
else{ 
    document.querySelector("h1").innerHTML = "Empate!"
}
}
document.querySelector("button").addEventListener("click", playGame);
