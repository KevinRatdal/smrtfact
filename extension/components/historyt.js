const Historyt = {
    template:   /*html*/ `
                <div id="history" class="container subwindow"> 
                    <div id="header">
                        <h3 class='text-center m-2'><b>History</b></h3>
                    </div>
                    <div class="dropdown text-center pb-2">
                        <button class="btn btn-outline-info text-dark btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Show</button>
                            <ul class="dropdown-menu">
                                <li><button class="dropdown-item" type="button" v-on:click="setfilter('all')">Show all</button></li>
                                <li><button class="dropdown-item" type="button" v-on:click="setfilter('url')">Show website</button></li>
                                <li><button class="dropdown-item" type="button" v-on:click="setfilter('text')">Show text</button></li>
                            </ul>
                        <button class="btn btn-outline-info text-dark btn-sm dropdown-toggle" type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false">
                            Sort
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
                            <li><button class="dropdown-item" type="button" v-on:click="lowestScore">Lowest Score</button></li>
                            <li><button class="dropdown-item" type="button" v-on:click="highestScore">Highest score</button></li>
                            <li><button class="dropdown-item" type="button" v-on:click="newestClaim">Newest</button></li>
                            <li><button class="dropdown-item" type="button" v-on:click="oldestClaim">Oldest</button></li>
                        </ul>

                    </div>
                    <div v-if="viewMore">
                        <ul class="list-group list-group-flush">
                        <li class="list-group-item" v-bind:class="assignColor(claim)" v-for="(claim, index) in viewMore" :key="claim.id">
                                 <router-link v-bind:to="'/result/'+claim.id" style="text-decoration: none; color: black;">{{claim.body.claim}}
                                 <i v-if="claim.body.claimtype == 'text'" class="fas fa-align-left position-absolute top-50 end-5 translate-middle-y"></i>
                                 <i v-else class="fas fa-desktop position-absolute top-50 end-5 translate-middle-y"></i>
                                 </router-link>
                            </li>
                        </ul>
                        
                        <div class='text-center'>
                            <button class="btn btn-sm text-dark" @click="setlim()">{{viewButton()}}</button>
                        </div>
                    </div>
                </div>`,
    data: function () {
        return {
            limit: 5,
            desiredDisplay: [],
            reversed: false,
            filter: "all",
            options: {}
        }
    },
    computed: {
        viewMore() {
            var temp = [...this.desiredDisplay]
            return this.limit ? temp.slice(0, this.limit) : this.desiredDisplay
        },

    },
    methods: {
        setlim: function () {
            this.limit != null ? this.limit = null : this.limit = this.options.hist_limit
        },

        loadSettings: function () {
            this.options = this.$parent.getSettings()
            this.reload()
        },
        reload: function () {
            this.limit = this.options.hist_limit
            this.setfilter(this.options.hist_filter)
            switch (this.options.hist_sort) {
                case "newest":
                    this.newestClaim()
                    break
                case "oldest":
                    this.oldestClaim()
                    break
                case "highest":
                    this.highestScore()
                    break
                case "lowest":
                    this.lowestScore()
                    break
            }
        },
        setfilter: function (b) {
            this.filter = b
            this.loadHistory()
        },
        loadHistory: function () {
            this.desiredDisplay = this.show() // clone pointing to a new memory space

        },
        assignColor: function (element) {
            let lowerBoundry = this.options.false_boundry
            let upperBoundry = this.options.truth_boundry
            let color
            let val = element.body.final_score
            if (val <= lowerBoundry) {
                color = "list-group-item-danger"
            } else if (val < upperBoundry) {
                color = "list-group-item-warning"
            } else {
                color = "list-group-item-success"
            }
            return "list-group-item " + color
        },
        show: function () {
            let temp = []
            if (this.filter === "all") {
                return [...this.$parent.allData]
            }
            for (var i = 0; i < this.$parent.allData.length; i++) {
                if (this.$parent.allData[i].body.claimtype === this.filter) {
                    temp.push(this.$parent.allData[i])
                }
            }
            return temp
        },
        lowestScore: function () {
            this.loadHistory()
            var temp = [...this.desiredDisplay]
            let sortByScore = temp.sort(function (p1, p2) {
                return p1.body.final_score - p2.body.final_score;
            });
            this.desiredDisplay = sortByScore;
        },
        highestScore: function () {
            this.lowestScore()
            this.desiredDisplay = this.desiredDisplay.reverse();
        },
        newestClaim: function () {
            this.loadHistory()
            this.desiredDisplay = this.desiredDisplay.reverse();
        },
        oldestClaim: function () {
            this.loadHistory()

        },
        viewButton: function () {
            if (this.limit === null) {
                return "View less"
            } else {
                return "View more"
            }
        }

    },
    mounted: function () { this.loadSettings(); },
}