<template>
    <div class="p-4">Signing you in...</div>
</template>
<script>
export default{
    async mounted(){
        try{
            await this.$auth.fetchUser()
            this.$router.replace('/')
        } catch(error){
            console.error('Login failed:', error),
            this.$router.replace('/auth/login')
        }
    }
}
</script>