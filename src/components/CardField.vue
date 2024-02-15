<template>
  <div class='cardField' v-if='value != null'>
    <div class="valor">{{this.value}}</div>
    <div class="titulo">{{this.title}}</div>
  </div>
</template>

<script>
    export default {
        props: {
          title: String,
          value: String
        }
      }

</script>
<style>
  .cardField {
    position: relative;
  }

  .titulo {
    font-size: 12px;
    top: 20px;
    font-weight: bold;
  }

  .valor {
    font-size: 14px;
  }

</style>