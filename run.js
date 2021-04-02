language = "armenian"
lesson = 1
exercise = 1
questiontype = ""
keyboardNum = 1
function preformat(la, le){
    language = la
    lesson = le
    exercise = 1
    menu.style.display = "none"
    root.style.display = "block"
    format(languageData[language].plan[lesson-1][exercise-1])
}
function unformat(){
    root.style.display = "none"
    menu.style.display = "block"
}
function presentation(letterino){
    if(letterino == "և") return "և"
    else if(letterino == "σ") return "Σσς"
    else if(language == "hebrew" || language == "yiddish"){
        finalkey = {
            "פ": "ף",
            "צ": "ץ",
            "מ": "ם",
            "נ": "ן",
            "כ": "ך",
        }
        return Object.keys(finalkey).includes(letterino) ? letterino + finalkey[letterino] : letterino
    }
    else if(languageData[language].cameral) return (letterino.toUpperCase() + letterino)
    else return letterino
}
function pronunciationhandler(){} //
function format(data){
    questiontypes = {
        "i": ["sentence", "words", "continuebutton"], //info
        "l": ["sentence", "letter", "letterinfo", "continuebutton"], //letter
        "d": ["sentence", "letter", "input", "keyboard", "enterbutton"], //definition
        "t": ["sentence", "letter", "input", "keyboard", "enterbutton"], //translit
        "c": ["sentence", "letter", "multiplechoice"], //capital
    }
    questiontype = data.split(":")[0]
    otherdata = data.split(":")[1]
    typelist = ["sentence", "letter", "letterinfo", "multiplechoice", "enterbutton", "continuebutton", "input", "keyboard", "words"]
    for(var t of typelist) document.getElementById(t).style.display = questiontypes[questiontype].includes(t) ? "" : "none"
    switch(questiontype){
        case "c":
            target = otherdata.split(">")[0]
            answers = otherdata.split(">")[1].split("")
            sentence.textContent = `Find the ${target.toUpperCase() != target ? "uppercase" : "lowercase"} version of this letter:`
            letter.textContent = target
            for(g of [0,1,2]) document.getElementById("b" + (g+1)).textContent = answers[g]
            break
        case "i":
            buttonmoral("Interesting! ;)")
            sentence.textContent = "Some helpful information ;)"
            words.textContent = otherdata
            break
        case "l":
            buttonmoral("Interesting! ;)")
            sentence.textContent = "New letter"
            letter.innerHTML = `${presentation(otherdata)}<span style='color: #D3AF86'> (${languageData[language].alphabet[otherdata]})</span>`
            pronunciation.innerHTML = ipa[soundify(otherdata)].replace(/\[/g, "<span>").replace(/\]/g, "</span>")
            //pronunciationhandler()
            break
        case "t":
            input.value = ""
            sentence.textContent = `Transliterate this ${otherdata.length > 1 ? "word": "letter"} to Latin`
            letter.textContent = otherdata
            for(b of document.getElementsByClassName("key")) b.textContent = ""
            if(otherdata.charCodeAt(0) > 1000){
                for(ltr of "QWERTYUIOPASDFGHJKLZXCVBNM".split("")) document.getElementById("Key" + ltr).textContent = ltr.toLowerCase()
                if(languageData[language].quote) Quote.textContent = "'"
                for(letr in languageData[language].latinKeyboard) document.getElementById("Digit" + (+letr + 1)).textContent = languageData[language].latinKeyboard[letr]
            }
            else for(letr of Object.entries(languageData[language].nativeKeyboard)) document.getElementById(letr[0]).textContent = letr[1]
            for(b of document.getElementsByClassName("key")) b.style.backgroundColor = b.textContent == "" ? "#6c71c4" : "#D3AF86"
            break
        case "d":
            input.value = ""
            sentence.textContent = `What is the English translation of this word?`
            for(b of document.getElementsByClassName("key")) b.textContent = ""
            for(ltr of "QWERTYUIOPASDFGHJKLZXCVBNM".split("")) document.getElementById("Key" + ltr).textContent = ltr.toLowerCase()
            letter.textContent = otherdata.split(">")[0]
            for(b of document.getElementsByClassName("key")) b.style.backgroundColor = b.textContent == "" ? "#6c71c4" : "#D3AF86"
            break
    }
}
function multchoice(answer){
    buttonmoral(answer.toUpperCase() == letter.textContent.toUpperCase() ? "Correct! :)" : "Incorrect! :(")
    multiplechoice.style.display = "none"
}
function next(){
    ++exercise > languageData[language].plan[lesson-1].length ? unformat() : format(languageData[language].plan[lesson-1][exercise-1])
}
function buttonmoral(p,q){
    continuebutton.style.display = ""
    continuebutton.textContent = p + " Continue..."
    continuebutton.className = "widebutton " + p.toLowerCase().split("!")[0]
}
function enter(){
    enterbutton.style.display = "none"
    ans = input.value
    if(questiontype == "t"){
        lett = letter.textContent
        if(lett.charCodeAt(0) > 1000) buttonmoral(tlit(lett) == ans ? "Correct! :)" : "Incorrect! :(")
        else buttonmoral(tlit(ans) == lett ?  "Correct! :)" : "Incorrect! :(")
    }
    else if(questiontype == "d") buttonmoral(ans.toLowerCase() == languageData[language].plan[lesson-1][exercise-1].split(">")[1].toLowerCase() ? "Correct! :)" : "Incorrect! :(")
}
function tlit(word){
    word = word.toLowerCase()
    if(languageData[language].alphabet[word.charAt(0)].includes(",")) word = languageData[language].alphabet[word.charAt(0)].split(",")[0] + word.slice(1)
    for(f of Object.entries(languageData[language].alphabet)){
        if(f[1].includes(",")) f[1] = f[1].split(",")[1]
        regex = new RegExp(f[0].replace("X", ""), "g")
        word = word.replace(regex, f[1])
    }
    return word
}
function soundify(d){
    d = languageData[language].alphabet[d]
    return languageData[language].toIPA[d] != undefined ? languageData[language].toIPA[d] : d
}
function sound(){
    new Audio("sounds/" + soundify(letter.textContent.charAt(0).toLowerCase()) + ".ogg").play()
}
document.addEventListener('keydown', (e) => {
    if(input == document.activeElement) event.preventDefault()
    if(document.getElementById(e.code)){
        entertext(e.code)
        document.getElementById(e.code).style.backgroundColor = "#DC3958"
    }
})
document.addEventListener('keyup', (e) => {
    if(document.getElementById(e.code).className.includes("blue")) document.getElementById(e.code).style.backgroundColor = "#268bd2"
    else if(document.getElementById(e.code).className.includes("orange")) document.getElementById(e.code).style.backgroundColor = "#F06431"
    else if(document.getElementById(e.code).textContent == "") document.getElementById(e.code).style.backgroundColor = "#6c71c4"
    else document.getElementById(e.code).style.backgroundColor = "#D3AF86"
})
document.addEventListener('mousedown', (e) => {
    if(e.srcElement.className == "key" && e.srcElement.textContent != "") e.srcElement.style.backgroundColor = "#DC3958" 
})
document.addEventListener('mouseup', (e) => {
    if(e.srcElement.className == "key" && e.srcElement.textContent != "") e.srcElement.style.backgroundColor = "#D3AF86" 
})
function entertext(code){
    switch(code){
        case "Backspace":
            input.value = input.value.slice(0, input.value.length - 1)
            break
        case "Enter":
            if(continuebutton.style.display != "none") next()
            else if(enterbutton.style.display != "none") enter()
            break
        case "ShiftLeft":
        case "ShiftRight":
            if(languageData[language].keyboardDimensions > 1 && keyboard.style.display != "none" && letter.textContent.charCodeAt(0) < 1000) for(letr of Object.entries(languageData[language][keyboard.textContent.includes(Object.values(languageData[language].secondaryKeyboard)[0]) ? "nativeKeyboard": "secondaryKeyboard"])) document.getElementById(letr[0]).textContent = letr[1]
            break
        default:
            input.value += document.getElementById(code).textContent
    }
}
window.addEventListener("load", function(){
    for(r in languageData) for(t in languageData[r].plan) document.getElementById(r + "-levels").innerHTML += `<div onclick="preformat('${r}', ${+t+1})">Level<br />${+t+1}</div>`
})