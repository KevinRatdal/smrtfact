let selection;
let timer
let currentResponse
let currentSimmilar
let latestBtn
//this runs when a request is sent, whether fakerequest or checkSelection to background and response is retrieved
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.instruction) {
            case "factCheck":
                sendResponse({ results: "Factcheck started" });
                sendrequest(null, null, null)
                break
            case "fakeCheck":
                sendResponse({ results: "Fake factcheck started" })
                sendfakerequest()
                genAnalysis(test)
                detCurrentSite()
                break
            case "factCheckURL":
                sendResponse({ results: "Factcheck started" })
                sendURLRequest(request.data)
                break
            case "factCheckText":
                sendResponse({ results: "Factcheck started" });
                sendRequestFromPopup(request.data)
                break
            default:
                sendResponse({ results: "Invalid/not-implemented message received" })
                console.log("Invalid/not-implemented message received")
                break
        }
    }
);

function sendURLRequest(inputData) {
    if (inputData == "currentPage") {
        inputData = window.location.href
    }
    chrome.runtime.sendMessage({ instruction: "checkURL", data: inputData }, function (response) {
        currentResponse = response.results.body
    });

}
function sendRequestFromPopup(inputData) {
    chrome.runtime.sendMessage({ instruction: "checkClaim", data: inputData }, function (response) {
        currentResponse = response.results.body
    })
}

//sends request to api with information to factcheck
function sendrequest(inputData, pe, btn) {
    let inData;
    let checkingbutton = (!btn) ? null : btn
    if (inputData !== null) {
        inData = altgetTextFromField(pe)
        if (checkingbutton) {
            latestBtn = checkingbutton
            checkingbutton.src = chrome.runtime.getURL("img/loading.gif")
        }
    } else {
        inData = selection
    }
    chrome.runtime.sendMessage({ instruction: "checkClaim", data: inData }, function (response) {
        let res = response.results
        if (checkingbutton) {
            if (res == "Invalid") {
                checkingbutton.src = chrome.runtime.getURL("img/fail.png")
                alert("Input didn't meet our criteria, please try again")
            } else {
                let res = response.results.body.final_prediction
                if (res == 1) {
                    if (response.simmilar) {
                        currentSimmilar = response.simmilar
                        checkingbutton.src = chrome.runtime.getURL("img/sim_pass.png")
                    } else {
                        checkingbutton.src = chrome.runtime.getURL("img/pass.png")
                    }
                } else {
                    if (response.simmilar) {
                        currentSimmilar = response.simmilar
                        checkingbutton.src = chrome.runtime.getURL("img/sim_fail.png")
                    } else {
                        checkingbutton.src = chrome.runtime.getURL("img/fail.png")
                    }
                }
            }
        }
        currentResponse = response.results.body
    });

}

function sendrequestverbose(instr, inputData) {
    let inData;

    if (instr == "basic") {
        instr = "checkClaim"
    }

    if (inputData == null) {
        return false
    } else {
        inData = inputData
    }
    let checkingbutton = (!latestBtn) ? null : latestBtn
    if (checkingbutton) {
        checkingbutton.src = chrome.runtime.getURL("img/loading.gif")
    }




    chrome.runtime.sendMessage({ instruction: instr, data: inData }, function (response) {
        let res = response.results
        if (checkingbutton) {
            if (res == "Invalid") {
                checkingbutton.src = chrome.runtime.getURL("img/fail.png")
                alert("Input didn't meet our criteria, please try again")
            } else {
                let res = response.results.body.final_prediction
                if (res == 1) {
                    if (response.simmilar) {
                        currentSimmilar = response.simmilar
                        checkingbutton.src = chrome.runtime.getURL("img/sim_pass.png")
                    } else {
                        checkingbutton.src = chrome.runtime.getURL("img/pass.png")
                    }
                } else {
                    if (response.simmilar) {
                        currentSimmilar = response.simmilar
                        checkingbutton.src = chrome.runtime.getURL("img/sim_fail.png")
                    } else {
                        checkingbutton.src = chrome.runtime.getURL("img/fail.png")
                    }
                }
            }
        }
        currentResponse = response.results.body
    });

}

function detCurrentSite() {
    url = location.hostname
    url = url.toLowerCase().split(".")
    if (url[0] == "www") {
        url.splice(0, 1)
    }
    url.pop()
    return url.join(".")
}
//extracting user input from text fields (newer version of getTextFromField())
function altgetTextFromField(tb) {
    switch (detCurrentSite()) {
        case "twitter":
            text = tb.querySelectorAll('span[data-text]')
            if (text) {
                return text[0].innerHTML
            }
            return ""
        case "facebook":
            text = tb.querySelectorAll('span[data-text]')
            return text[0].innerHTML
        case "youtube":
            text = tb.querySelectorAll('div#contenteditable-root')
            return text[0].innerHTML
        default:
            return
    }
}
//NB: DONT DELETE (not in use) 
function getTextFromField() {
    switch (detCurrentSite()) {
        case "twitter":
            tb = document.querySelector("div.DraftEditor-editorContainer")
            text = tb.querySelectorAll('span[data-text]')
            return text[0].innerHTML
        case "facebook":
            tb = document.querySelector("div._5rpb")
            text = tb.querySelectorAll('span[data-text]')
            return text[0].innerHTML
        default:
            return
    }
}

function sendfakerequest() {
    chrome.runtime.sendMessage({ instruction: "checkMockClaim", data: null }, function (response) {
        let res = response.results.body.final_prediction
        if (res == 1) {
            checkingbutton.src = chrome.runtime.getURL("img/pass.png")
        } else (
            checkingbutton.src = chrome.runtime.getURL("img/fail.png")
        )
        currentResponse = response.results.body
    });
}

function displayExtWindow() {

    if (currentResponse) {
        if (currentSimmilar) {
            genSimmilarCheck(currentResponse, currentSimmilar)
            currentSimmilar = ""
        } else {
            genAnalysis(currentResponse)
        }
    }
}

function sanitizeText(text) {
    text = text.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "");
    if (text.trim().length < 10) {
        return ""
    } else {
        return text.trim()
    }
}





function detCurrentContainerClass() {
    switch (detCurrentSite()) {
        case "twitter":
            return "DraftEditor-editorContainer"
        case "facebook":
            return "_5rpb"
        case "youtube":
            return "style-scope ytd-commentbox"
        default:
            return null
    }


}

document.addEventListener("focusin", function () {
    attElement = document.activeElement.parentElement
    if (attElement.className === detCurrentContainerClass()) {
        if (!check(attElement)) {
            attElement.appendChild(genButton(detCurrentSite(), attElement))
        }
    }
})




//checking if there already is a button to textfield
function check(ellist) {
    let childrenelements = Array.from(ellist.children)
    for (var index in childrenelements) {
        if (childrenelements[index].id == "factbutton") {
            return true
        }
    }
    return false
}


// Update the currently selected variable to contain the currently selected text
document.onselectionchange = function () {
    selection = getSelectionText()
};


//get highligted text
function getSelectionText() {
    if (window.getSelection) {
        return window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        return document.selection.createRange().text;
    }
}
