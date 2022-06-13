<template>
  <div v-html="alipay"/>
</template>

<script>
export default {
  name: 'Alipay',

  data() {
    return {
      alipay: '',
    }
  },

  /** @see https://blog.csdn.net/hangzhou728/article/details/107606235 */
  mounted() {
    this.alipay= this.$route.query.html
    console.log('Alipay页面------------')
    console.log(this.alipay)
    this.$nextTick(() => {
      document.forms[1].submit()
    })
  },
}
</script>

<style scoped>

</style>
