<template>
    <div class="main">
        <img src="../../assets/logo.png" />
        <p>Hello from second</p>
        <button @click="changepage">Aller sur Home</button>
    </div>
</template>

<script>
export default {
    name: "Homepage",
    methods: {
        changepage () {
            this.$controller.changePage(this.appName, "home")
        }
    }
}
</script>
