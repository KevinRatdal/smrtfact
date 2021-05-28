Vue.component( 
    "navbar", {
    template: /*html*/ `
        <div id="header-links" class="container">

                    <ul class="nav nav-tabs nav-fill">
                        <li class="nav-item">
                            <router-link class="nav-link"  to="/tools"><i class="fas fa-tools"></i></router-link>

                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/result"><i class="fas fa-poll"></i></router-link>

                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/history"><i class="fas fa-history"></i></router-link>

                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/settings"><i class="fas fa-cogs"></i></router-link>

                        </li>
                    </ul>

            </div>`,
}
)