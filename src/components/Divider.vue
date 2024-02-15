<template>
<div class="separator">{{ title }}</div>
</template>
<script>
export default {
    props: {
      title: String
    }
  }
</script>
<style scoped>
 .separator {
  font-size: 14px;
  display: flex;
  align-items: center;
  text-align: center;
  font-family: 'Encode Sans', sans-serif;
}

.separator::before,
.separator::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #c8c8c8;
}

.separator:not(:empty)::before {
  margin-right: .25em;
}

.separator:not(:empty)::after {
  margin-left: .25em;
}
</style>
