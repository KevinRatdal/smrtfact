const Result = {
    template: /*html*/ `
                <div class="container subwindow" v-if="noclaims"> 
                    <div class='row border-bottom' v-bind:class='findAverage()'>
                        <div class="accordion accordion-flush" id="accordionFlushExample">

                            <div class="accordion-item" v-if="current_claim.similar">
                                <h2 class="accordion-header" id="flush-headingOne">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                                            <h3 class='text-center'><i>{{current_claim.claim}}</i></h3>
                                    </button>
                                </h2>
                                <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample" >
                                    <ul class="accordion-body">Related claims
                                        <li v-for="alias in current_claim.similar">{{alias}} </li>
                                    </ul>
                                </div>
                            </div>
                            <div v-else class="m-2 min-vh-60 text-center align-items-center d-flex justify-content-center">
                                <h3 class="fst-italic d-inline-block ">{{current_claim.claim}}</h3>
                            </div>
                        </div>
                    </div>
                    <div class='row border-bottom'>
                        <div class='text-center'>
                            <span>Score: <b v-bind:class='this.displaySetting[1]'>{{findAverage()}}</b>
                            
                            </span>
                        </div>
                        <div class='text-center'>
                            <span>{{this.displaySetting[0]}}
                            <a tabindex="0" class="btn btn-sm" role="button" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="bottom" title="Scoring" data-bs-content="Based on an average of the articles' scores. Take it with a grain of salt"><i class='fas fa-info-circle'></i></a>
                            </span>
                        </div>
                    </div>
                    <!-- <div class='row border-bottom border-3 border-info'>
                        <span class=''>
                            <button class="btn btn-sm text-dark border fixed-left" v-on:click='' type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="fas fa-grip-lines"></i>
                            </button>
                            <button class="btn btn-sm text-dark border fixed-left" v-on:click='' type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="fas fa-grip-vertical"></i>
                            </button>
                        </div>
                        <div class='col'>
                            <span class='align-middle'><b>Showing results for: </b></span>
                        </div>
                    </div>
                    <div class='row' v-bind:class='findAverage()'>
                        <span class='text-center border-bottom border-3 border-info'><i>{{current_claim.claim}}</i></span>
                    </div>
                        </span>
                    </div> -->

                    <div class="accordion mb-0 accordion-flush" id="claimaccordion">
                        <div class="accordion-item" v-for="(article, index) in current_claim.search_results" track-by="$index">
                            <h2 v-bind:class="'accordion-header ' + getShade(index)" v-bind:id="'heading' + index">
                                <button v-bind:class="getShade(index)+ ' accordion-button collapsed'" type="button" data-bs-toggle="collapse" v-bind:data-bs-target="'#collapse' + index" aria-expanded="true" v-bind:aria-controls="'collapse' + index">
                                {{article.displayLink}} - {{Math.round(current_claim.normalized_scores[index]*100)/100}}
                                </button>
                            </h2>
                            <div v-bind:id="'collapse' + index" class="accordion-collapse collapse" v-bind:aria-labelledby="'heading' + index" data-bs-parent="#claimaccordion">
                                <div class="accordion-body">
                                    <p>{{article.body}}</p>
                                    <a v-bind:href="article.link" target="_blank">Go to article</a>
                                    <p>{{parseDate(article.publish_date)}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="container subwindow" v-else>
                    <h3 class="m-3">No claims made, make a claim and then come back here</h3>
                    <a style="visibility:hidden" tabindex="0" class="btn btn-sm" role="button" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="bottom" title="Scoring" data-bs-content="Based on an average of the articles' scores. Take it with a grain of salt"><i class='fas fa-info-circle'></i></a>

                </div>
                `,
    props: ["claim_id"],

    data: function () {
        return {
            current_claim: {},
            displaySetting: ["not", "defined"],
            noclaims: false
        }
    },
    methods: {
        displayRelated: function () {
            if (this.current_claim.similar.length > 0 && this.current_claim.similar.length != undefined) {
                return true
            } else {
                return false
            }
        },
        parseDate: function (raw) {
            let p
            if (!raw) {
                p = raw
            } else {
                p = raw.substr(0, 10)
            }
            return p
        },

        loadResult: function () {
            var self = this;
            if (self.$parent.allData.length > 0) {
                var idx = self.$parent.allData.length - 1;
                if (self.claim_id === undefined) {
                    self.current_claim = self.$parent.allData[idx].body
                } else {
                    self.current_claim = self.$parent.allData[self.claim_id].body
                }
                this.trueMessage()

            }
        },
        getShade: function (index) {
            self = this;
            let settings = this.$parent.settings
            let s = self.current_claim.normalized_scores[index]
            if (s <= settings.false_boundry) {
                return "list-group-item-danger"
            } else if (s > settings.false_boundry && s <= settings.truth_boundry) {
                return "list-group-item-warning"
            } else {
                return "list-group-item-success"
            }

        },
        findAverage: function () {

            final_score = this.current_claim.final_score
            return parseFloat(final_score).toFixed(2)

        },
        trueMessage: function () {
            self = this;
            let settings = this.$parent.settings
            final_score = this.current_claim.final_score
            let dispSetting
            if (final_score >= settings.truth_boundry) {
                dispSetting = ['This claim should be true', 'text-success']
            } else if (final_score <= settings.false_boundry) {
                dispSetting = ['This claim should be false', 'text-danger']
            } else if (final_score >= settings.false_boundry && final_score <= settings.truth_boundry) {
                dispSetting = ['This claim could be true, or false', 'text-warning']
            } else {
                dispSetting = ['No claims made', 'text-warning']
            }
            this.displaySetting = dispSetting
        },
    },

    mounted: function () {
        if (this.$parent.allData.length > 0) {
            this.noclaims = true
        }
        this.loadResult();
        var popovere = new bootstrap.Popover(document.querySelectorAll('[data-bs-toggle="popover"]')[0])
    }



}

