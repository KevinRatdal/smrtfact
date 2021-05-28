let testResponsebody = {
    "credibility": [
        1,
        0,
        1
    ],
    "claim": "se in illustrative examples in d",
    "claimtype": "text",
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

var startTime, endTime;

function start() {
    startTime = performance.now();
};

function end() {
    endTime = performance.now();
    var timeDiff = endTime - startTime; //in ms 
    // strip the ms 
    console.log("Time status:");
    console.log(timeDiff + " miliseconds");
    timeDiff /= 1000;

    // get seconds 
    var seconds = Math.round(timeDiff);
    console.log(seconds + " seconds");
    console.log(" ");
}

//sends result from async funtion to contentscript
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.instruction) {
            case "checkClaim":
                request.data = sanitizeClaim(request.data)
                chrome.storage.local.get("claims", function (result) {
                    cosineClaimCheck(result, request, sendResponse)
                })
                break

            case "forceCheckClaim":
                request.data = sanitizeClaim(request.data)
                storeClaim(request, sendResponse)
                break
            case "addAlias":
                chrome.storage.local.get("claims", function (result) {
                    addAliasToClaim(result, request, sendResponse)
                })
                break
            case "checkMockClaim":
                chrome.storage.local.get(["claims"], function (result) {
                    checkMockClaim(result)
                });
                break
            case "checkURL":
                chrome.storage.local.get("claims", function (result) {
                    urlCheck(result, request, sendResponse)
                })
                break
        }
        return true;
    });



function cosineClaimCheck(result, request, sendResponse) {
    let allData = result.claims
    let exists = false
    for (let i in allData) {
        let similarity = cosineSimiliarityToText(request.data, allData[i].body.claim)
        if (similarity >= 0.99) {
            exists = true
            sendResponse({ results: allData[i] })
            handleDuplicates(i)
            return true
        }
        else if (similarity > 0.5 && similarity < 1) {
            if (allData[i].body.similar) {
                for (let y in allData[i].body.similar) {
                    if (allData[i].body.similar[y] == request.data) {
                        sendResponse({ results: allData[i] }) // if alias exists
                        handleDuplicates(i)
                        return true
                    }
                }
            }
            sendResponse({ results: allData[i], simmilar: request.data })
            handleAlias(allData[i], request.data)
            return true
        }
    }
    storeClaim(request, sendResponse)
}




function storeClaim(request, sendResponse) {
    if (!request.data) {
        sendResponse({ results: "Invalid" })
        return true
    } else {
        sendApirequest(request.data).then((response) => {
            if (!response) return
            chrome.storage.local.get(["claims"], function (result) {
                temp_array = result.claims
                if (result.claims == undefined) {
                    response.id = 0
                } else {
                    response.id = result.claims.length
                }
                response.body.claimtype = "text"
                temp_array.push(response)
                chrome.storage.local.set({ "claims": temp_array, "errorMessage": response.status }, function () {
                });
            });
            sendResponse({ results: response })
            sendToPopup()
            return true
        })
    }
}


function addAliasToClaim(result, request, sendResponse) {
    let allData = result.claims
    for (var i in allData) {
        let aliasExist = false;
        let similarity = cosineSimiliarityToText(request.data, allData[i].body.claim)
        if (similarity < 1 && similarity > 0.5)
            if (allData[i].body.similar == undefined) {
                allData[i].body.similar = []
                allData[i].body.similar.push(request.data)
                aliasExist = true;
                break
            } else {

                for (let y in allData[i].body.similar) {
                    if (allData[i].body.similar[y] == request.data) {
                        aliasExist = true;
                        break
                    }
                }

                if (aliasExist) {
                    break
                }
                else {
                    allData[i].body.similar.push(request.data)
                    break
                }
            }
    }
    chrome.storage.local.set({ "claims": allData, "errorMessage": "OK" }, function () {
    });
    sendResponse({ results: allData[i] })
    return true
}

function urlCheck(result, request, sendResponse) {
    let allData = result.claims
    let exists = false;
    for (let i in allData) {
        if (allData[i].body.claimtype == "url") {
            if (allData[i].body.metadata.url === request.data.toString()) {  //checking if claim has already been made
                exists = true
                sendResponse({ results: allData[i] })
                handleDuplicates(i)
                return true
            }
        }
    }
    sendApiURLRequest(request.data).then((f) => {
        if (!f) return
        chrome.storage.local.get(["claims"], function (result) {
            temp_array = result.claims
            if (temp_array === undefined) {
                temp_array = []
            }
            if (result.claims == undefined) {
                f.id = 0
            } else {
                f.id = result.claims.length
            }
            f.body.claimtype = "url"
            temp_array.push(f)
            chrome.storage.local.set({ "claims": temp_array, "errorMessage": f.status }, function () {
            });
        });
        sendResponse({ results: f })
        sendToPopup()
    })
}

function checkMockClaim(result) {
    temp_array = result.claims
    if (temp_array === undefined) {
        temp_array = []
    }

    temp_array.push({ status: "OK", body: testResponsebody })
    chrome.storage.local.set({ "claims": temp_array, "errorMessage": "OK" }, function () {
    });
}

//sending and retrieving information from text mining
async function sendApirequest(text) {
    const Url = "{API_URL_OMITTED}/text-mining/?user_claim="
    let data = encodeURIComponent(text)
    let output;

    let resp = await fetch(Url + data, {
        method: "GET",
    })
        .then(fetchErrorHandling)
        .then(function (res) {
            return res.json()
        })
        .then(data => ({ status: "OK", body: JSON.parse(data) }))
        .catch(function (error) {
            console.warn("something went wrong", error)
        })
    if (!resp) {
        return false
    }
    return await resp
}


function sanitizeClaim(claim) {
    claim = claim.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "");
    if (claim.trim().length < 10) {
        return ""
    } else {
        return claim.trim()
    }
}

function sendToPopup() {
    chrome.runtime.sendMessage({
        msg: "completed",
        data: {
            subject: "claim",
            content: "claim has been processed"
        }
    });
}
function handleDuplicates(i) {
    chrome.runtime.sendMessage({
        msg: "duplicate",
        id: i
    })
}

function handleAlias(oldClaim, newClaim) {
    chrome.runtime.sendMessage({
        msg: "handleAlias",
        existing: oldClaim,
        nonExistent: newClaim
    })
}

let fetchErrorHandling = async function (response) {
    if (!response.ok) {
        chrome.storage.local.set({ errorMessage: response.statusText }, function () { })
        throw Error(response.statusText + " - " + response.url);
    }
    return response;
}



async function sendApiURLRequest(text) {
    const Url = "{API_URL_OMITTED}/article-mining/?article_url="
    let data = encodeURIComponent(text)
    let output;

    let resp = await fetch(Url + data, {
        method: "GET",
    })
        .then(fetchErrorHandling)
        .then(function (res) {
            return res.json()
        })
        .then(data => ({ status: "OK", body: JSON.parse(data) }))
        .catch(function (error) {
            console.warn("something went wrong", error)
        })
    if (!resp) {
        return false
    }
    return await resp
}


function mappingWordCount(str) {
    let words = str.split(' ');
    let wordCount = {};
    words.forEach((w) => {
        wordCount[w] = (wordCount[w] || 0) + 1;

    });
    return wordCount;
}

function addingWordsToDictionary(mappingWordCount, dict) {
    for (let key in mappingWordCount) {
        dict[key] = true;
    }
}

function mapToVector(map, dict) {
    let wordCountVector = [];
    for (let term in dict) {
        wordCountVector.push(map[term] || 0);
    }
    return wordCountVector;
}
function dotProduct(vecA, vecB) {
    let product = 0;
    for (let i = 0; i < vecA.length; i++) {
        product += vecA[i] * vecB[i];
    }
    return product;
}

function magnitude(vec) {
    let sum = 0;
    for (let i = 0; i < vec.length; i++) {
        sum += vec[i] * vec[i];
    }
    return Math.sqrt(sum);
}

function cosineSimilarity(vecA, vecB) {
    return dotProduct(vecA, vecB) / (magnitude(vecA) * magnitude(vecB));
}
function cosineSimiliarityToText(claimA, claimB) {
    const wordCountA = mappingWordCount(claimA);
    const wordCountB = mappingWordCount(claimB);
    let dict = {};
    addingWordsToDictionary(wordCountA, dict);
    addingWordsToDictionary(wordCountB, dict);
    const vectorA = mapToVector(wordCountA, dict);
    const vectorB = mapToVector(wordCountB, dict);
    return cosineSimilarity(vectorA, vectorB);
}


chrome.runtime.onInstalled.addListener(function (details) {
    let defaultValue = [];
    let defaultSettings = {
        filter: "default",
        false_boundry: 0.4,
        truth_boundry: 0.6,
        hist_sort: "newest",
        hist_filter: "all",
        hist_limit: 5,
    }
    chrome.storage.local.get({ claims: defaultValue }, function (data) {
        chrome.storage.local.set({ claims: data.claims, errorMessage: "OK" }, function () {
        });
    });
    chrome.storage.local.get({ settings: defaultSettings }, function (data) {
        chrome.storage.local.set({ settings: data.settings }, function () {
        });
    });
    if (details.reason == "install") {
        console.log("This is a first install")
    } else if (details.reason == "update") {
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
})


