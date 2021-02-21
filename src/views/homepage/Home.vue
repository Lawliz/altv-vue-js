<template>
    <div class="main">
        <img src="../../assets/logo.png" />
        <p>Welcome to your Vue application</p>
        <button @click="changepage">Aller sur Second</button>
    </div>
</template>

<script>
export default {
    name: "Homepage",
    methods: {
        changepage () {
            this.$controller.changePage(this.appName, "second")
        }
    }
}
</script>

<style lang="scss">
.main {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 2em;
    font-family: Georgia, 'Times New Roman', Times, serif;
}
</style>
