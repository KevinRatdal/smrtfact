const alias = {
    template: /*html*/ `
        <div id="Instruction menu" class="container g-2 subwindow">
            <div> 
                <div>
                    <h3>Does <br> <strong> {{claims.oldClaim.claim}} </strong <br> mean the same as <br> <strong> {{claims.newClaim}} </strong> </h3>
                </div>
            </div>
            <div class='d-flex justify-content-evenly mb-3'>
                    <button class="btn btn-outline-info text-dark" v-on:click="foundAlias">Yes</button>
                    <button class="btn btn-outline-info text-dark" v-on:click="notAlias">No</button>
            </div>
        </div >`,
    data() {
        return {
            claims: {
                oldClaim: this.$parent.aliasClaims.oldClaim.body,
                newClaim: this.$parent.aliasClaims.newClaim
            }
        }
    },
    methods: {
        foundAlias: function () {
            self = this;
            chrome.runtime.sendMessage({ instruction: "addAlias", data: self.claims.newClaim })
            //self.$router.push({ path: "loading" })

        },
        notAlias: function () {
            self = this;
            chrome.runtime.sendMessage({ instruction: "forceCheckClaim", data: self.claims.newClaim })
            self.$router.push({ path: "loading" })
        }
    },
}