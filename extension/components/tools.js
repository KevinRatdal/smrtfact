const Tools =  {
    template: /* html */
        `<div id="Instruction menu" class="container  subwindow">
            <div class='d-flex justify-content-center mt-2'>
                <div>
                    <h5> Factcheck </h5>
                </div>
            </div>
            <div class='d-flex justify-content-evenly mb-3'> 
                <div>
                    <button class="btn btn-outline-info text-dark" v-on:click="sendM('factCheck')">Check selection</button>
            
                    <button class="btn btn-outline-info text-dark" v-on:click="getUrlOfCurrentPage()">Check active page</button>
                </div>
            </div>
            <div class="input-group px-2">
                <input type="text" v-model="claim" class="form-control" aria-label="Text input with segmented dropdown button" :state="nameState" v-on:keyup.13="checkClaimType()">
                <button type="button" class="btn btn-outline-info text-dark" v-on:click="checkClaimType()">{{this.buttonType}}</button>
            </div>
            <br>
            <div class="m-2">
                <h5 class="mb-c1"> Stats </h5>
                <span> Total number of claims: <strong>{{this.$parent.allData.length}}</strong> </span>
                <br>
                <span :state="numberOfTruths"> Number of claims proven: <strong> {{this.numTrue}} </strong> </span>
                <br>
                <span :state="numberOfTruths"> Number of claims disproven: <strong>{{this.numFalse}} </strong></span>
            </div>
            <br>
            <div v-if="latestClaim" >
                <h5 class="mx-2"> Recent claims: </h5>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item" v-bind:class="assignColor(claim)" v-for="(claim, index) in latestClaim" :key="claim.id">
                        <router-link v-bind:to="'/result/'+claim.id" style="text-decoration: none; color: black;">{{claim.body.claim.substring(0,34)}}<span v-if="claim.body.claim.length > 33">...</span>
                        <i v-if="claim.body.claimtype == 'text'" class="fas fa-align-left position-absolute top-50 end-5 translate-middle-y"></i>
                        <i v-else class="fas fa-desktop position-absolute top-50 end-5 translate-middle-y"></i>
                        </router-link>
                    </li>
                </ul> 
            </div>
        </div >`,
    
        computed: {
            nameState() {
                if (this.claim) {
                    if (this.validateURL(this.claim)) {
                        this.buttonType = "Send Url"
                    }else {
                        this.buttonType = "Send Claim"
                    }
                } 
            },
            numberOfTruths() {
                let tempTrue = 0
                let tempFalse = 0
                for (index in this.$parent.allData) {
                    if (this.$parent.allData[index].body.final_prediction == 1) {
                        tempTrue++
                    }else {
                        tempFalse++
                    }
                }
                this.numTrue = tempTrue
                this.numFalse = tempFalse
            },
            latestClaimOLD() {
                let tempArray = this.$parent.allData
                if (tempArray.length == 1) {
                    return this.latestClaims = tempArray
                }else if(tempArray.length == 2) {
                    return this.latestClaims = tempArray
                }else {
                    this.latestClaims = tempArray.slice(0).slice(-3)
                    return this.latestClaims
                }
            },
            latestClaim() {
                
                let tempArray = [...this.$parent.allData]
                if (tempArray.length == 0) { return false }
                return tempArray.reverse().slice(0, 3)
                
            },
          },
    data: function() {
        return {
            status: "Working",
            claim: "",
            buttonType: "Send Claim",
            numTrue: 0,
            numFalse: 0,
            pattern: new RegExp("^(https?):\/\/[^s$.?#].[^\s]*", 'i')
        }
    },
    methods: {
        sendM: function (e) {
            let self = this;
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { instruction: e, data: self.claim }, function (response) {
                    self.$router.push({ path: 'loading' });
                });
            });
        },
        getUrlOfCurrentPage: function () {
            this.claim =  "currentPage";
            let e = "factCheckURL"
            this.sendM(e)
        },
        validateURL: function(str) {
            res = !!this.pattern.test(str)
            return res
        },
        checkClaimType: function() {
            if (this.validateURL(this.claim)) {
                let temp = this.claim.split('.')
                if(temp[0] != "https://www") {
                    this.claim = "https://www." + this.claim }
                let e = "factCheckURL"
                this.sendM(e)
            }else {
                this.claim = this.claim.replace(/[^a-z0-9 \.,_-]/gim,"");
                if(this.claim.trim().length < 10) {
                    return alert("Could not compute this claim, please check if its correct")
                }else {
                    this.claim = this.claim.trim()
                    let e = "factCheckText"
                    this.sendM(e)
                }
            }   
        },
        assignColor: function (element) {
            let lowerBoundry = 0.4
            let upperBoundry = 0.6
            let color
            let val = element.body.final_score
            if (val < lowerBoundry) {
                color = "list-group-item-danger"
            } else if (val < upperBoundry) {
                color = "list-group-item-warning"
            } else {
                color = "list-group-item-success"
            }
            return "list-group-item " + color
        }
    },
    
}

