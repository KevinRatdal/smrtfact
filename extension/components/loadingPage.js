const loadingPage = {
    template: /*html*/ `<div id="Instruction menu" class="container g-2 subwindow">
            <div class='d-flex justify-content-center mt-3'>
                <div>
                    <h3>Loading</h3>
                </div>
            </div>
            <div class='d-flex justify-content-evenly mb-3'> 
                <div>
                    <h3> {{loading}} </h3>
                    <h3 v-if="message"> {{message}} </h3>
                    <div class="col text-center"><object data="img/Ellipsis.svg" type="image/svg+xml"></object></div>
                </div>
            </div>
        </div >`,

    props: ["error_id"],
    watch: {
        $route(to, from) {
            this.ifError();
        }
    },
    data: function () {
        return {
            loading: "Your claim is being processed, this will only take a moment.",
            message: "",
            err: false,
        }
    },
    methods: {
        ifError: function () {
            if (this.err == false) {
            this.loading = "Opps looks like we stumbled upon a problem, please try again later"
            this.message = "error code: " + this.$parent.errorData
            var self = this;
            setTimeout(function () {
                self.$router.push({ path: '/tools' })
            }, 10000)
            this.err = true}
        },
    },
    created: function () {
        self = this
        chrome.storage.onChanged.addListener(function () {
            chrome.storage.local.get(["errorMessage"], function (result) {
                if (result.errorMessage != "OK" && self.$router.history.current.path === "/loading") {
                    self.ifError()
                }

            });
        })
    }
}