<template>
  <div>
    <div v-if="store.state.gedo.curr_gedo.subsanado &&
      store.state.user.userData['username'] !=
      store.state.gedo.curr_gedo.usuarioSubsanador
      " class="customMessage p-d-flex">
      <i class="pi pi-info-circle p-mr-1 p-as-center"></i>
      <div class="p-as-center">
        <div class="p-col">
          Este documento fue subsanado y no puede ser visualizado.
        </div>
      </div>
    </div>
    <div v-else-if="store.state.gedo.detalle.esReservado &&
      !store.state.gedo.detalle.puedeVerDocumento
      " class="customMessage p-d-flex">
      <i class="pi pi-info-circle p-mr-1 p-as-center"></i>
      <div class="p-as-center">
        <div class="p-col">
          Este documento es reservado y no puede ser visualizado.
        </div>
      </div>
    </div>
    <div v-else-if="store.state.gedo.detalle != undefined && store.state.gedo.detalle.error" class="customMessage p-d-flex">
      <i class="pi pi-info-circle p-mr-1 p-as-center"></i>
      <div class="p-as-center">
        <div class="p-col" style="font-size: medium;">
          No se pudo obtener el documento.
        </div>
      </div>
    </div>
    <div class="pdfHeight">
      <div class="fixCover"></div>
      <div class="fix">
      </div>
      <pdfvue class="pdfv" :url="pdfPath" style="height:100%">
      </pdfvue>
    </div>
  </div>
</template>

<script setup>
import pdfvue from '../components/VuePDFViewer.vue'
import { ref, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";

let chrome = ref(false)

var isChromium = window.chrome;
var winNav = window.navigator;
var vendorName = winNav.vendor;
var isOpera = typeof window.opr !== "undefined";
var isIEedge = winNav.userAgent.indexOf("Edg") > -1;
var isIOSChrome = winNav.userAgent.match("CriOS");

if (isIOSChrome) {
  chrome.value = true
} else if (
  isChromium !== null &&
  typeof isChromium !== "undefined" &&
  vendorName === "Google Inc." &&
  isIEedge === false
) {
  chrome.value = true
}

let pdfPath = ref('')

const store = useStore();

let pdfElement;
let fixElement;
let fixElementCover
onMounted(async () => {
  pdfElement = document.querySelector('.pdfHeight')
  fixElement = document.querySelector('.fix')
  fixElementCover = document.querySelector('.fixCover')
  window.addEventListener('resize', setPdfHeight);
  setPdfHeight()
  if (!chrome.value) {
    fixElement.style.setProperty('visibility', 'hidden')
    fixElementCover.style.setProperty('visibility', 'hidden')
  }
  pdfPath.value = open_pdf(store.state.gedo.pdf);
  setTimeout(() => {
    fixElementCover.style.setProperty('visibility', 'hidden')
  }, 500)

});
onUnmounted(async () => {
  window.removeEventListener('resize', setPdfHeight);
})

// Cargar PDF
const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

function open_pdf(b64Data) {
  let fileURL = window.URL.createObjectURL(
    b64toBlob(b64Data, "application/pdf"),
    { oneTimeOnly: true }
  );
  return fileURL;
}

function getOffset(el) {
  var _x = 0;
  var _y = 0;
  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    _x += el.offsetLeft - el.scrollLeft;
    _y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  return { top: _y, left: _x };
}

function setPdfHeight() {
  var pdfOffsetTop = getOffset(pdfElement).top;
  let reduccion = pdfOffsetTop + 20
  let pdfHeight = 'calc(100vh - ' + reduccion + 'px)'
  pdfElement.style.setProperty("height", pdfHeight);
}
</script>

<style lang="scss" scoped>
.fix,
.pdfv,
.fixCover {
  grid-column: 1;
  grid-row: 1;
}

.fixCover {
  height: 60px;
  width: 100%;
  background-color: #323639;
  z-index: 100;
}

.fix {
  height: 50px;
  width: calc(50% - 215px);
  margin-top: 1px;
  margin-left: 63px;
  opacity: 50%;
  background-color: red;
  opacity: 99.99%;
  background-color: #323639;
}

.pdfv {
  margin-top: 0rem;
}

.pdfHeight {
  display: grid;
  background-color: #323639;
}

.customMessage {
  padding: 0.5rem;
  font-size: 10pt;
  font-family: "Encode Sans", sans-serif;
  color: #6d5100;
  background-color: #ffecb3;
}
</style>