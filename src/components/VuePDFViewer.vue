<template>
    <div v-bind:style="styleObject"></div>
</template>
  
<script>
import PDFObject from 'pdfobject'
export default {
    props: ['height', 'url'],
    data: function () {
        var vm = this
        var h = '400px'
        if (!vm.height) {
            console.warn('Please specify viewer height, e.g. height="500px"')
        } else {
            h = vm.height
        }
        return {
            styleObject: {
                height: h,
            },
        }
    },
    watch: {
        url: function (val) {
            if (val.length > 0) {
                var vm = this
                PDFObject.embed(val, vm.$el)
            }
        },
    },
}
</script>
  
<style>
.pdfobject-container {
    width: 100%;
    margin: 1em 0;
}

.pdfobject {
    border: 1px solid #666;
}
</style>
  