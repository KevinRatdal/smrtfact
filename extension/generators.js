let test = {
    "credibility": [
        1,
        0,
        1
    ],
    "claim": "se in illustrative examples in d",
    "search_results": [
        {
            "title": "Illustrative example of how quark-hadron duality might work",
            "link": "https://link.aps.org/doi/10.1103/PhysRevD.57.2691",
            "domain": "link.aps.org",
            "domain_name": "link.aps.org",
            "body": "Illustrative example of how quark-hadron duality might work. B. Blok, M. Shifman, \\nand Da-Xin Zhang. Phys. Rev. D 57, 2691 \\u2013 Published 1",
            "snippet": "Illustrative example of how quark-hadron duality might work. B. Blok, M. Shifman, \\nand Da-Xin Zhang. Phys. Rev. D 57, 2691 \\u2013 Published 1",
            "publish_date": null,
            "keywords": null,
            "authors": [],
            "displayLink": "link.aps.org"
        },
        {
            "title": "Critical review and illustrative examples of office occupant modelling ...",
            "link": "https://journals.sagepub.com/doi/abs/10.1177/0143624419827468",
            "domain": "journals.sagepub.com",
            "domain_name": "journals.sagepub.com",
            "body": "Illustrative examples were provided from two independent datasets to \\ndemonstrate the strengths Haldi, F, Robinson, D. The impact of occupants' \\nbehaviour on building energy demand. Yang, J, Santamouris, M, Lee, SE.",
            "snippet": "Illustrative examples were provided from two independent datasets to \\ndemonstrate the strengths Haldi, F, Robinson, D. The impact of occupants' \\nbehaviour on building energy demand. Yang, J, Santamouris, M, Lee, SE.",
            "publish_date": null,
            "keywords": null,
            "authors": [],
            "displayLink": "journals.sagepub.com"
        },
        {
            "title": "Arithmetic Sequence: Definition and Basic Examples - ChiliMath",
            "link": "https://www.chilimath.com/lessons/intermediate-algebra/arithmetic-sequence-definition-and-basic-examples/",
            "domain": "chilimath.com",
            "domain_name": "chilimath.com",
            "body": "Definition and Basic Examples of Arithmetic Sequence Illustrative Examples of \\nIncreasing and Decreasing Arithmetic Sequences 5th term is 3 with d=-7",
            "snippet": "Definition and Basic Examples of Arithmetic Sequence Illustrative Examples of \\nIncreasing and Decreasing Arithmetic Sequences 5th term is 3 with d=-7",
            "publish_date": null,
            "keywords": null,
            "authors": [],
            "displayLink": "chilimath.com"
        }
    ],
    "softmax_score": [
        [
            -0.4225765,
            0.5691273
        ],
        [
            0.41008493,
            -0.13407695
        ],
        [
            0.1286615,
            0.14670216
        ]
    ],
    "cosine_score": [
        0.9,
        0.9,
        0.9
    ],
    "normalized_scores": [
        0.7294243,
        0.36721995,
        0.50451005
    ],
    "final_score": "0.5337181068949607",
    "final_prediction": 1
}


//handling truthfullness of articles
function genAnalysisResult(data) {
    let articleDiv = document.createElement("div");
    articleDiv.setAttribute("class", "header")
    articleDiv.setAttribute("data-toggle", "dropdown")
    let statement = data.claim
    let result = data.final_prediction
    if (result === 1) {
        let result = document.createElement("p");
        result.innerHTML = "The following statement: " + statement + " - is true";
        let thumbsUp = document.createElement("img");
        thumbsUp.src = chrome.runtime.getURL("img/thumbs-up.png");
        thumbsUp.setAttribute("class", "result")
        articleDiv.appendChild(thumbsUp);
        articleDiv.appendChild(result);
    } else {
        let result = document.createElement("p");
        result.innerHTML = "The following statement: " + statement + " - is false";
        let thumbsDown = document.createElement("img");
        thumbsDown.src = chrome.runtime.getURL("img/thumbs-down.png");
        thumbsDown.setAttribute("class", "result")
        articleDiv.appendChild(thumbsDown);
        articleDiv.appendChild(result);
    }
    let referral = document.createElement("p")
    referral.innerHTML = "Click the Smart Fact icon in the extension bar to see more information."
    articleDiv.appendChild(referral);
    let imgReferral = document.createElement("img")
    imgReferral.src = chrome.runtime.getURL("img/extension.png")
    imgReferral.setAttribute("class", "direction")
    articleDiv.appendChild(imgReferral)
    return articleDiv
}


//combining all information, displaying and functionality
function genAnalysis(data) {
    mainDiv = document.createElement("fact-analysis");
    mainDiv.setAttribute("id", "testing")

    let style = document.createElement("style");

    let shadowRoot = mainDiv.attachShadow({ mode: "open" });

    let container = document.createElement("div");
    container.setAttribute("class", "container");
    container.appendChild(genAnalysisResult(data));

    style.textContent = `
    :host {
       
        visibility: visible;
        position: absolute;
        
    }`+ `

    .container {
        margin: auto;
        
        padding: 0px; 
        box-shadow: 5px 5px 5px rgba(50, 50, 50, 0.75);
        background-color: #ffffff;
        
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border: 1px solid black;
        width: 40%;
        font-size: 16px;
        height: 25%;
        overflow: visible;
    }`+ `
    p button {
        background:none;
        border:none;
        
    }

    .header {
        font-size: 1,5rem;
        margin: auto;
        width: 60%;
        
        padding: 10px;
        
    }`+ `
    #open {
        position:absolute;
        top:0;
        right:0;
    } `+ `
    .result{
        position: relative;
        left: 120px;
        width: 50px;
    } `+ `
    .direction {
        position: relative;
        right: -100%;
        top: -5em;
        width: 10em;
    }
    `;


    let btn = document.createElement("button");
    btn.setAttribute("id", "open")
    btn.innerHTML = "X"
    btn.onclick = (function () {
        let styling = shadowRoot.host;
        if (styling.style.visibility === 'hidden') {
            styling.style.visibility = 'visible';
        } else {
            styling.style.visibility = 'hidden';
        }


    });
    container.appendChild(style);
    container.appendChild(btn);
    shadowRoot.appendChild(container);
    document.body.appendChild(mainDiv);

    //for moving overlay
    dragElement(container);
    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (elmnt.childNodes[0]) {
            /* if present, the header is where you move the DIV from:*/
            elmnt.childNodes[0].onmousedown = dragMouseDown;
        } else {
            /* otherwise, move the DIV from anywhere inside the DIV:*/
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

}


//popup for checking similarity
function genSimmilarCheck(data, sim) {
    mainDiv = document.createElement("fact-analysis");
    mainDiv.setAttribute("id", "testing")

    let style = document.createElement("style");
    style.textContent = `
    :host {
       
        visibility: visible;
        position: absolute;
        
    }`+ `

    .container {
        margin: auto;
        
        padding: 1em; 
        box-shadow: 5px 5px 5px rgba(50, 50, 50, 0.75);
        background-color: #ffffff;
        
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border: 1px solid black;
        radius: 5px;
        
        
    }`+ `
    #more { 
        display: none;
    }
    .button {
        background-color: #008CBA; /* Green */
        border: none;
        color: white;
        padding: 15px 32px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 0.1em
    }
    p {
        font-size: 16px;
    }
    .header {
        font-size: 2rem;
        margin: auto;
        width: 60%;
        
        padding: 10px;
        
    }`+ `
    .article-info {
        font-size: 1,5rem;
        margin: auto;
        width: 60%;
        border: 3px solid black;
        padding: 10px;
    }`+ `
    #open {
        position:absolute;
        top:0.1em;
        right:0.1em;
        width: 1.5em;
        height: 1.5em;
        padding: 2px 2px;
        font-size: 20px;
        background-color: #f44336;
    } `+ `
    img{
        position: relative;
        left: 200px;
        width: 100px;
    }`+ `
    time {
        font-size: 1,5rem;
    }
    `;



    let shadowRoot = mainDiv.attachShadow({ mode: "open" });



    let container = document.createElement("div");
    container.setAttribute("class", "container");

    container.appendChild(style);

    let btn = document.createElement("button");
    btn.setAttribute("id", "open")
    btn.setAttribute("class", "button")
    btn.innerHTML = "X"
    btn.onclick = function () {
        let panel = shadowRoot.host;
        if (panel.style.visibility === 'hidden') {
            panel.style.visibility = 'visible';
        } else {
            panel.style.visibility = 'hidden';
        }
    }

    let text = document.createElement("p")

    text.innerHTML = "Does the statement:<br><i>" + sim + "</i><br>mean the same as <br><i>" + data.claim + "</i>?"
    let yButton = document.createElement("button");
    yButton.setAttribute("id", "yes")
    yButton.setAttribute("class", "button")
    yButton.innerHTML = "Yes"
    yButton.onclick = function () {
        let panel = shadowRoot.host;
        if (panel.style.visibility === 'hidden') {
            panel.style.visibility = 'visible';
        } else {
            panel.style.visibility = 'hidden';
        }
        //chrome.runtime.sendMessage({ instruction: "addAlias", data: sim })
        sendrequestverbose("addAlias", sim)
    }
    let nButton = document.createElement("button");
    nButton.setAttribute("id", "no")
    nButton.setAttribute("class", "button")
    nButton.innerHTML = "No"
    nButton.onclick = function () {
        let panel = shadowRoot.host;
        if (panel.style.visibility === 'hidden') {
            panel.style.visibility = 'visible';
        } else {
            panel.style.visibility = 'hidden';
        }
        //chrome.runtime.sendMessage({ instruction: "forceCheckClaim", data: sim })
        sendrequestverbose("forceCheckClaim", sim )
    }

    container.appendChild(btn);
    container.appendChild(text);
    container.appendChild(yButton);
    container.appendChild(nButton);
    shadowRoot.appendChild(container);
    document.body.appendChild(mainDiv);


}


function genButton(profile, parentelement) {
    if (profile == "check") {
        return document.createElement("fact-analysis-button");
    }
    else if (profile == "twitter" || "facebook" || "youtube") {
        buttonDiv = document.createElement("fact-analysis-button");
        buttonDiv.id = "factbutton"
        let style = document.createElement("style");
        style.textContent = `
    :host {
        overflow: visible
    }
    
    #container {
        position: absolute;
        right: 0px;
        top: 0px;
        overflow: visible;
        margin: 0px;
        padding: 0px;
        width: 30px;
        height: 20px;
        border-radius: 10px;
        background-color: lightgrey;
    }
    
    #baba {
        background-color: grey;
        border-radius: inherit;
        border: none;
        padding: 0px;
        height: 18px;
        width: 18px;
        display: inline-block;
        margin-left: 1px;
        position: relative;
        bottom: 1px;
        margin-top: 1px;
    }

    #showResultButton {
        background-color: #2ec2c9;
        color: black;
        border-radius: inherit;
        border: none;
        padding: 0px;
        width: 29px;
        height: 18px;
        position: absolute;
        text-align: center;
        text-decoration: none;
        display: none;
        font-size: 6px;
        margin-top: 1px;
        margin-left: 1px;
        
    }

    #container:hover {
        width: 50px;
    }
    `
        let shadowRoot = buttonDiv.attachShadow({ mode: "open" });

        let container = document.createElement("div");
        container.id = "container"
        container.appendChild(style)

        buttontn = document.createElement("img")
        buttontn.src = chrome.runtime.getURL("img/default.png")
        buttontn.id = "baba"
        buttontn.onclick = function () { sendrequest("basic", parentelement, this); return false }

        buttonex = document.createElement("button")
        buttonex.innerHTML = "Expand"
        buttonex.id = "showResultButton"
        buttonex.onclick = function () { displayExtWindow(); return false }
        //buttonex.onclick = function() {genAnalysis(test)};
        container.appendChild(buttontn)
        container.appendChild(buttonex)
        container.onmouseover = function () {
            container.childNodes[2].style.display = "inline-block"
        }
        container.onmouseout = function () {
            container.childNodes[2].style.display = "none"
        }

        shadowRoot.appendChild(container);
        //pluginRoot[parentelement] = shadowRoot
        document.addEventListener("keyup", event => {
            active = (document.activeElement.parentElement.className == detCurrentContainerClass())

            if (active) {
                clearTimeout(timer)
                timer = setTimeout(factcheeck, 3000)
            }

        })

        function factcheeck() {
            rawtext = altgetTextFromField(document.activeElement.parentElement)
            sanitized = sanitizeText(rawtext)
            sendrequest(detCurrentSite(), document.activeElement.parentElement, buttontn)
        }
    }
    return buttonDiv

}

