<template>
  <div v-html="alipay"/>
</template>

<script>
export default {
  name: 'alipay',

  data() {
    return {
      alipay: '',
    }
  },

  /** @see https://blog.csdn.net/hangzhou728/article/details/107606235 */
  mounted() {
    this.alipay = this.$route.query.html
    this.$nextTick(() => {
      document.forms[1].submit()
    })
  },
}
</script>
