const Settings = {
    template: /*html*/ `
        <div id="Instruction menu" class="container g-2 subwindow">
            <div class='text-center'> 
                <div>
                    <h3 class='mt-2 font-weight-bold'>Settings</h3>
                </div>
                <div class="">
                    <div class="form-group p-2">
                        <label for="get_tr"> Truth boundary:&nbsp; <span class="text-muted">(Current: {{this.$parent.settings.truth_boundry}})</span> </label>
                        <div class="input-group">
                            <input type="number" id="gen_tr" step="0.01" min="0.0" max="1" v-model="truth" class="form-control" aria-label="Number input with button" @change="setNumOption($event, 'truth_boundry')">
                        </div>
                        <br>
                        <label for="get_tr"> False boundary:&nbsp; <span class="text-muted">(Current: {{this.$parent.settings.false_boundry}})</span> </label>
                        <div class="input-group">
                            <input type="number" id="gen_tr" step="0.01" min="0.0" max="1" v-model="falsy" class="form-control" aria-label="Number input with button" @change="setNumOption($event, 'false_boundry')">
                        </div>
                    </div>
                </div>
            
                <h3 class="mt-2 font-weight-normal">History</h3>
                <div class="form-group">
                    <label for="hist_s"> Sort order:&nbsp; <span class="text-muted">(Current: {{this.$parent.settings.hist_sort}})</span> </label>
                    <select id="hist_s" class="form-control" @change="setOption($event, 'hist_sort')">
                        <option :value="this.$parent.settings.hist_sort" selected >Choose order:</option>
                        <option v-for="sort in loc_settings.hist.hist_sort" :value="sort">{{ sort}} first</option>
                    </select>
                    <br>
                    <label for="hist_f"> History filter:&nbsp; <span class="text-muted">(Current: {{this.$parent.settings.hist_filter}})</span> </label>
                    <select id="hist_f" class="form-control" @change="setOption($event, 'hist_filter')">
                        <option :value="this.$parent.settings.hist_filter" selected >Choose Filter:</option>
                        <option v-for="filter in loc_settings.hist.hist_filter" :value="filter">{{ filter}}</option>
                    </select>
                    <br>
                    <label for="hist_l"> History length:&nbsp; <span class="text-muted">(Current: {{this.$parent.settings.hist_limit}})</span> </label>
                        <div class="input-group">
                            <input type="number" id="hist_l" step="1" min="0" v-model="lim" class="form-control" aria-label="Number input with button" @change="setNumOption($event, 'hist_limit')">
                        </div>
                </div>
                
                <h3 class="mt-2 font-weight-normal">Data</h3>
                <div class='pt-3'>
                    <button class="btn btn-sm btn-outline-info text-dark" v-if="!cleared" v-on:click="clearHistory">Clear History</button>
                    <p v-else>History cleared</p>
                </div>
                <div class='pt-3 mb-3'>
                    <button class="btn btn-sm btn-outline-info text-dark" v-if="!defaultSettings" v-on:click="resetSettings">Reset settings</button>
                    <p v-else>Settings reset to default</p>
                </div>
            </div>
        </div >`,
    data() {
        return {
            new_score: null,
            cleared: false,
            defaultSettings: false,
            truth: this.$parent.settings.truth_boundry,
            falsy: this.$parent.settings.false_boundry,
            lim: this.$parent.settings.hist_limit,
            loc_settings: {
                "general": {
                    "false_boundry": 0.4,
                    "truth_boundry": 0.6,
                },
                "hist": {
                    "hist_sort": ["newest", "oldest", "highest", "lowest"],
                    "hist_filter": ["all", "url", "text"],
                    "hist_limit": 5
                },
            }
        }
    },
    methods: {
        setNumOption: function (event, type) {
            val = event.target.value
            chrome.storage.local.get(["settings"], function (result) {
                if (type == "hist_limit") {
                    val = parseInt(val)
                } else {
                    val = parseFloat(val)
                }
                result.settings[type] = val
                chrome.storage.local.set({ "settings": result.settings }, function () {
                });
            })

        },
        setOption: function (event, type) {
            let opt = event.target.options[event.target.options.selectedIndex].value
            chrome.storage.local.get(['settings'], function (result) {
                result.settings[type] = opt
                chrome.storage.local.set({ "settings": result.settings }, function () {
                });
            });
        }
        ,
        setFilter: function (f_type) {
            chrome.storage.local.get(['settings'], function (result) {
                result.settings.filter = f_type
                chrome.storage.local.set({ "settings": result.settings }, function () {

                });
            });
        },
        clearHistory: function () {
            self = this

            chrome.storage.local.set({ "claims": [], "errorMessage": "OK" }, function () {
                self.cleared = true
            });

        },
        resetSettings: function () {
            self = this

            chrome.storage.local.set({
                "settings": {
                    "false_boundry": 0.4,
                    "filter": "default",
                    "truth_boundry": 0.6,
                    "hist_sort": "newest",
                    "hist_filter": "all",
                    "hist_limit": 5,
                }
            }, function () {

                self.defaultSettings = true
            });
        },
        setLowerBoundary: function (e) {
            chrome.storage.local.get(["settings"], function (result) {
                e = parseFloat(e)
                result.settings.false_boundry = e
                chrome.storage.local.set({ "settings": result.settings }, function () {
                });
            })
        },
        setUpperBoundary: function (e) {
            chrome.storage.local.get(["settings"], function (result) {
                e = parseFloat(e)
                result.settings.truth_boundry = e
                chrome.storage.local.set({ "settings": result.settings }, function () {
                });
            })
        }
    },
}