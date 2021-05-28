const routes = [
    { path: '/', redirect: '/tools' },
    { path: '/tools', component: Tools },
    { path: '/settings', component: Settings },
    { path: '/result/:claim_id', component: Result, props: true },
    { path: '/result', component: Result, props: true },
    { path: '/history', component: Historyt },
    { path: '/loading', component: loadingPage },
    { path: '/loading/:error_id', component: loadingPage, props: true, name: 'loading' },
    { path: '/alias', component: alias }
]

const router = new VueRouter({
    routes
})

const app = new Vue({

    el: '#app',
    router,
    data: {
        status: "Working",
        allData: [],
        errorData: [],
        settings: {},
        aliasClaims: {
            oldClaim: {},
            newClaim: {}
        }
    },
    methods: {
        getSettings: function () {
            return this.settings
        },
        setSettings: function (s) {
            this.settings = s
        },
        setallData: function (s) {
            this.allData = s
        },

        setData: function () {
            var self = this;
            chrome.storage.local.get("claims", function (result) {
                self.allData = result.claims
            });

            chrome.storage.onChanged.addListener(function () {
                chrome.storage.local.get("settings", function (result) {
                    self.setSettings(result.settings)
                });
            })
            chrome.storage.onChanged.addListener(function () {
                chrome.storage.local.get(["claims", "errorMessage"], function (result) {
                    if (result.errorMessage == "OK") {
                        self.setallData(result.claims)
                        if (self.$router.history.current.path === "/loading") {
                            self.$router.push({ path: 'result' })

                        }

                        else if (self.$router.history.current.path === "/alias") {
                            self.$router.push({ path: `/result/${self.aliasClaims.oldClaim.id}` })

                        }
                    } else {
                        self.errorData = result.errorMessage
                    }
                });
            })

            //check to see if new claim has been created
            chrome.runtime.onMessage.addListener(
                function (request, sender, response) {
                    if (request.msg === "completed") {

                    } else if (request.msg == "duplicate") {
                        if (self.$router.history.current.path === "/loading") {
                            self.$router.push({ path: `/result/${request.id}` })
                        } else {
                            self.$router.push({ path: self.$router.history.current.path })
                        }
                    }
                    else if (request.msg == "handleAlias") {
                        self.aliasClaims.oldClaim = request.existing
                        self.aliasClaims.newClaim = request.nonExistent
                        self.$router.push({ path: 'alias' })
                    }
                }
            )

        },
        setError: function () {
            var self = this;
            chrome.storage.local.get("errorMessage", function (result) {
                self.errorData = result.errorMessage
            });
            chrome.runtime.onMessage.addListener(
                function (request, sender, response) {
                    if (request.msg === "error") {
                        chrome.storage.onChanged.addListener(function () {
                            chrome.storage.local.get("errorMessage", function (result) {
                                self.errorData = result.errorMessage
                                let idx = self.errorData.length - 1
                                if (self.$router.history.current.path === "/loading") {
                                    self.$router.push({ path: `/loading/${idx}` })
                                }
                            });
                        })
                    }
                }
            )
        },
        //to differentiate between claims
        setId: function () {
            for (let i in this.allData) {
                this.allData[i].id = i
            }
        },
    },
    mounted() {
        self = this
        chrome.storage.local.get("settings", function (result) {
            self.settings = result.settings
        });
    },
    created: function () { this.setData(); }
})
Vue.use(VueRouter)
