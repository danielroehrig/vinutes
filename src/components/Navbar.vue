<template>
    <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <div class="navbar-item">
                <router-link to="/"><img src="img/shutterIcon.png" width="28" height="28"></router-link>
            </div>

            <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <div id="navbarBasicExample" class="navbar-menu">
            <div class="navbar-start">
                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">
                        Ben "Ackbar" Röhrig
                    </a>

                    <div class="navbar-dropdown">
                        <a class="navbar-item">
                            Alex Brunhilde Röhrig
                        </a>
                        <hr class="navbar-divider">
                        <a class="navbar-item">
                            Create new Timeline
                        </a>
                    </div>
                </div>
            </div>

            <div class="navbar-end">
                <div class="navbar-item">
                    <div class="buttons">
                        <a class="button is-primary">
                            <strong>Render</strong>
                        </a>
                        <router-link to="/preferences">
                           <span class="button mdi mdi-24px mdi-cog"></span>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
    export default {
        name: "Navbar"
    }
</script>

<style scoped>

</style>