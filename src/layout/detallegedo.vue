<template>
  <TabView
    aria-label="Detalles del documento"
    class="customtab"
    :class='{"collapsed" : store.state.app.detalleGedo_isCollapsed}'
    v-model:activeIndex="panelSelected"
    v-if="gedo_props"
    @click="store.dispatch('app/setDetalleGedo_isCollapsed_not')"
  >
    <TabPanel>
      <template #header>
        <i role="button" aria-label="Información" class="pi pi-info-circle p-mr-1" style="font-size:20px" v-tooltip.left="{ value: 'Información', disabled: !store.state.app.detalleGedo_isCollapsed }"></i>
      </template>
      <div class='p-col-fixed' v-if='!store.state.app.detalleGedo_isCollapsed'>
        <div class='p-col p-p-0'>
          <h6 style="margin-top:0.5rem">Información</h6>
          <ScrollPanel class="custombar">
            <CardField class="infoCardfield" title='Número de Comunicación' :value="notas[0].numeroSadeDocumento"></CardField>
          <CardField class="infoCardfield" title='Enviada por' :value="notas[0].usuarioEmisor"></CardField>
          <CardField class="infoCardfield" title='Destinatarios digitalComunicaciones Asociadas' :value="notas[0].destinatariosDigitales ? formatArray(notas[0].destinatariosDigitales) : '' "></CardField>
          <CardField class="infoCardfield" title='Con copia a' :value="notas[0].copia ? formatArray(notas[0].copia) : ''"></CardField>
          <CardField class="infoCardfield" title='Con copia oculta a' :value="notas[0].copiaOculta ? formatArray(notas[0].copiaOculta) : ''"></CardField>
          <CardField class="infoCardfield" title='Destinatarios papel' :value="notas[0].destinatariosPapel ? formatArray(notas[0].destinatariosPapel) : ''"></CardField>
          <CardField class="infoCardfield" title='Fecha' :value="format(new Date(notas[0].fecha),'dd/MM/yy HH:mm:ss')"></CardField>
          <CardField class="infoCardfield" title='Referencia' :value="notas[0].referencia"></CardField>
          <CardField class="infoCardfield" title='Respuesta a' :value="notas[0].respuesta"></CardField>
        </ScrollPanel>
      </div>
      </div>
    </TabPanel>
    <TabPanel v-if='firmantes.length && (!curr_gedo.subsanado || (curr_gedo.subsanado && store.state.user.userData["username"] == store.state.gedo.curr_gedo.usuarioSubsanador))'>
      <template #header>
        <i role="button" aria-label="Firmantes" class="pi pi-user-edit p-mr-1" style="font-size:20px" v-tooltip.left="{ value: 'Firmantes', disabled: !store.state.app.detalleGedo_isCollapsed }"></i>
      </template>
      <div class="p-col-fixed" v-if="!store.state.app.detalleGedo_isCollapsed">
        <h6 style="margin-top: 0.5rem">Firmantes</h6>
        <CardField
          v-for="firmante in firmantes"
          v-bind:key="firmante"
          :title="firmante.titulo"
          :value="firmante.nombre"
        ></CardField>
      </div>
    </TabPanel>
    <TabPanel>
      <template #header>
        <i role="button" aria-label="Comunicaciones Asociadas" class="pi pi-check-square p-mr-1" style="font-size:20px" v-tooltip.left="{ value: 'Comunicaciones Asociadas', disabled: !store.state.app.detalleGedo_isCollapsed }"></i>
      </template>
      <div class='p-col-fixed' v-if='!store.state.app.detalleGedo_isCollapsed'>
        <div class='p-col p-p-0'>
          <h6 style="margin-top:0.5rem">Comunicaciones Asociadas</h6>
          <ScrollPanel class="custombar">
          <CardField v-for="comunicacion in comunicaciones" class="comunicacionAsociada" :title="comunicacion.numero" :value="comunicacionInfo(comunicacion)"></Cardfield>
        </ScrollPanel>
      </div>
      </div>
    </TabPanel>
    <TabPanel v-if='gedo_props.listaHistorial && gedo_props.listaHistorial.length && (!curr_gedo.subsanado || (curr_gedo.subsanado && store.state.user.userData["username"] == store.state.gedo.curr_gedo.usuarioSubsanador))' >
      <template #header>
        <i role="button" aria-label="Historial de Confección" class="pi pi-clock p-mr-1" style="font-size:20px" v-tooltip.left="{ value: 'Historial', disabled: !store.state.app.detalleGedo_isCollapsed }"></i>
      </template>
      <div class="p-col-fixed" id="scrollHistorial" v-if="!store.state.app.detalleGedo_isCollapsed">
        <h6 style="margin-top: 0.5rem">Historial de Confección</h6>
        <ScrollPanel class="custombar">
        <Timeline :value="gedo_props.listaHistorial" style="margin-top: 1rem">
          <template #marker="slotProps">
            <span
              class="custom-marker p-shadow-2"
              :style="{
                backgroundColor: calcularTimelineIconColor(
                  slotProps.item.actividad
                ),
              }"
            >
              <i
                :class="'pi ' + calcularTimelineIcon(slotProps.item.actividad)"
              ></i>
            </span>
          </template>
          <template #content="slotProps">
            <div class="p-col p-p-0">
              <div class="p-text-bold" style="font-size: 14px">
                {{
                  format(new Date(slotProps.item.fechaFin), 'HH:mm:ss dd/MM/yy')
                }}
              </div>
              <div style="font-size: 14px">{{ slotProps.item.actividad }}</div>
              <div class="subtitle">
                {{ slotProps.item.userName }} ({{ slotProps.item.usuario }})
              </div>
              <div
                class="mensaje"
                style="margin-top: 0.25rem; margin-bottom: 1rem"
              >
                {{ slotProps.item.mensaje }}
              </div>
            </div>
          </template>
        </Timeline>
        </ScrollPanel>
      </div>
    </TabPanel>
    <TabPanel v-if='archivosAdjuntos.length && (!curr_gedo.subsanado || (curr_gedo.subsanado && store.state.user.userData["username"] == store.state.gedo.curr_gedo.usuarioSubsanador))' >
      <template #header>
        <i role="button" aria-label="Archivos Embebidos" class="pi pi-paperclip p-mr-1" style="font-size:20px" v-tooltip.left="{ value: 'Archivos Embebidos', disabled: !store.state.app.detalleGedo_isCollapsed }"></i>
      </template>
      <div class="p-col-fixed" v-if="!store.state.app.detalleGedo_isCollapsed" id="scrollAdjuntos">
        <h6 style="margin-top: 0.5rem">Archivos Embebidos</h6>
        <div class="p-grid" style="margin-top: 1rem; margin-left:0rem;margin-right:0rem;">
              <ScrollPanel class="custombar">
                <div class="archivo" v-for="(archivo, index) in adjuntos" :key="index">
                <Divider v-if='index > 0'/>
                <div style="margin-left:0rem;">
                  <div class="p-d-flex p-jc-between" style="margin-left:0rem;">
                    <div class="p-d-inline-flex" style="margin-left:0rem;">
                      <div class="p-as-center" style="margin-left:0rem;">
                        <div class='nombreArchivo' style="margin-left:0rem;">{{ archivo.filename }}</div>
                          </div>
                        </div>
                        <div class="p-d-flex p-as-center">
                          <div class="p-as-center p-mr-2">
                            <Button
                              type="button"
                              icon="pi pi-download"
                              class="p-button-lg p-button-text"
                              style="p-p-4"
                              @click="download(archivo.content,archivo.filename)"
                              :aria-label="'Descargar archivo ' + archivo.filename"
                            />
                          </div> 
                        </div>
                        </div>       
                      </div>
                    </div>
              </ScrollPanel>
            </div>
      </div>
    </TabPanel>
    <TabPanel v-if='gedo_props.listaArchivosDeTrabajo && gedo_props.listaArchivosDeTrabajo.length && (!curr_gedo.subsanado || (curr_gedo.subsanado && store.state.user.userData["username"] == store.state.gedo.curr_gedo.usuarioSubsanador))' >
      <template #header>
        <i role="button" aria-label="Archivos de trabajo" class="pi pi-folder-open p-mr-1" style="font-size:20px" v-tooltip.left="{ value: 'Archivos De Trabajo', disabled: !store.state.app.detalleGedo_isCollapsed }"></i>
      </template>
          <div class="p-col-fixed" v-if="!store.state.app.detalleGedo_isCollapsed" id="scrollArchivos">
            <h6 style="margin-top: 0.5rem">Archivos de Trabajo</h6>
            <div class="p-grid" style="margin-top: 1rem; margin-left:0rem;margin-right:0rem;">
              <ScrollPanel class="custombar">
                <div class="archivo" v-for="(archivo, index) in gedo_props.listaArchivosDeTrabajo" :key="index">
                <Divider v-if='index > 0'/>
                <div style="margin-left:0rem;">
                  <div class="p-d-flex p-jc-between" style="margin-left:0rem;">
                    <div class="p-d-inline-flex" style="margin-left:0rem;">
                      <div class="p-as-center" style="margin-left:0rem;">
                        <div class='nombreArchivo' style="margin-left:0rem;">{{ archivo.nombreArchivo }}</div>
                          </div>
                        </div>
                        <div class="p-d-flex p-as-center">
                          <div class="p-as-center p-mr-2">
                            <Button
                              type="button"
                              icon="pi pi-download"
                              class="p-button-lg p-button-text"
                              style="p-p-4"
                              @click="descargaArchivoTrabajo(archivo)"
                              :aria-label="'Descargar archivo ' + archivo.nombreArchivo"
                            />
                          </div> 
                        </div>
                        </div>       
                      </div>
                    </div>
              </ScrollPanel>
            </div>
          </div>
    </TabPanel>
    <TabPanel v-if='gedo_props.esReservado && gedo_props.puedeVerDocumento && gedo_props.listaUsuariosReservados.length && (!curr_gedo.subsanado || (curr_gedo.subsanado && store.state.user.userData["username"] == store.state.gedo.curr_gedo.usuarioSubsanador))'>
      <template #header>
        <i role="button" aria-label="Personas Reservadas" class="pi pi-unlock p-mr-1" style="font-size:20px" v-tooltip.left="{ value: 'Personas Reservadas', disabled: !store.state.app.detalleGedo_isCollapsed }"></i>
      </template>
      <div class="p-col-fixed" v-if="!store.state.app.detalleGedo_isCollapsed" id="scrollReservados">
        <h6 style="margin-top: 0.5rem">Personas Reservadas</h6>
        <ScrollPanel class="custombar scroll">
          <CardField
                  v-for="usuarioReservado in gedo_props.listaUsuariosReservados"
                  v-bind:key="usuarioReservado"
                  :title="usuarioReservado.codigoEcosistema"
                  :value="usuarioReservado.userName"
            ></CardField>
        </ScrollPanel>
      </div>
    </TabPanel>
  </TabView>
  <div class="p-text-left btn_error" v-if="store.state.gedo.detalle != undefined && store.state.gedo.detalle.error">
    <Button
      @click="reportarIncidencia"
      type="button"
      icon="pi pi-download"
      class="p-button-raised"
      v-tooltip.left="{ value: 'Reportar incidencia a mesa de ayuda', disabled: !store.state.app.detalleGedo_isCollapsed, class: 'tooltipDetalle' }"
      aria-label="Descargar documento"
    />
    <label class='etiqueta derecha' v-if="!store.state.app.detalleGedo_isCollapsed">Ir a Centro de Soporte</label>
  </div>
  <div
    class="p-text-left btn_descarga_zip"
  >
    <Button
      @click="descargarDocumento"
      type="button"
      icon="pi pi-download"
      class="p-button-raised"
      :disabled="!gedo_props.puedeVerDocumento || (store.state.gedo.detalle != undefined && store.state.gedo.detalle.error) || (store.state.gedo.curr_gedo.subsanado && store.state.user.userData['username'] != store.state.gedo.curr_gedo.usuarioSubsanador)"
      v-tooltip.left="{ value: 'Descargar documento', disabled: !store.state.app.detalleGedo_isCollapsed, class: 'tooltipDetalle' }"
      aria-label="Descargar documento"
    />
    <label class='etiqueta derecha'>Descargar documento</label>
  </div>
  <div
    class="p-text-left collapsableButton"
    @click="store.dispatch('app/toggleDetalleGedo_isCollapsed')"
  >
    <Button
      class="p-button-outlined p-button-secondary"
      v-tooltip.left="{ value: 'Expandir', disabled: !store.state.app.detalleGedo_isCollapsed, class: 'tooltipDetalle' }"
      :icon="
        'pi ' +
        (store.state.app.detalleGedo_isCollapsed
          ? 'pi-angle-double-left'
          : 'pi-angle-double-right')
      "
      :aria-label="store.state.app.detalleGedo_isCollapsed ? 'Expandir panel de detalles' : 'Contraer panel de detalles'"
    />
    <label class='etiqueta derecha'>Contraer</label>
  </div>
  <div v-if="false">
    <Fieldset legend="Gedo" :toggleable="true" :collapsed="true">
      <pre>{{ curr_gedo }}</pre>
    </Fieldset>
    <Fieldset legend="Detalle" :toggleable="true" :collapsed="true">
      <pre>{{ gedo_props }}</pre>
    </Fieldset>
  </div>
</template>

<script setup>
  import Button from 'primevue/button'

  import Fieldset from 'primevue/fieldset'
  import TabPanel from 'primevue/tabpanel'
  import TabView from 'primevue/tabview'
  import ScrollPanel from 'primevue/scrollpanel'
  import Divider from '../components/Divider.vue'
  import Timeline from 'primevue/timeline'
  import CardField from '../components/CardField.vue'

  import { download_base64 } from '../helpers/utils'
  import { archivoTrabajo } from '../api/gedo'

  import format from 'date-fns/format'
  import { computed, ref,onMounted } from 'vue'
  import { useStore } from 'vuex'

  import * as pdfjsLib from "pdfjs-dist";

  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "/lib/pdf.worker.js";

    let notas = [
    {
      numeroSadeDocumento: "NO-2024-07685231-APN-TESTSADE",
      tipodeDocumento: "NO",
      usuarioEmisor: "Uriel Rotenberg (URONTENBERG)",
      destinatariosDigitales: ["Nicolas Concetti (NCONCETTI)", "Sebastian Vidal (SVIDAL)"],
      destinatariosPapel: [],
      copia: ["Nicolas Concetti (NCONCETTI)","Nicolas Biondi (NBIONDI)"],
      copiaOculta: [], 
      fecha: 1622649395488, 
      orden: 2, 
      referencia: "Test Funcional", 
      respuesta: "ME-2023-07687765-APN-TESTSADE",
      recibida: true,
      enviada: false,
      searchable: "29NO-2024-07685231-APN-TESTSADEPVPASE2021-06-02 12:56:35" 
    },
    {
      numeroSadeDocumento: "ME-2024-07685310-APN-TESTSADE",
      tipodeDocumento: "ME",
      usuarioEmisor: "Uriel Rotenberg (URONTENBERG)",
      destinatariosDigitales: ["Nicolas Concetti (NCONCETTI)", "Sebastian Vidal (SVIDAL)"],
      destinatariosPapel: [],
      copia: ["Nicolas Concetti (NCONCETTI)","Nicolas Biondi (NBIONDI)"],
      copiaOculta: [], 
      fecha: 1622649395488, 
      orden: 1, 
      referencia: "Reporte Ejecutivo", 
      respuesta: "ME-2023-07687765-APN-TESTSADE",
      recibida: true,
      enviada: false,
      searchable: "29NO-2024-07685231-APN-TESTSADEPVPASE2021-06-02 12:56:35" 
    },
    {
      numeroSadeDocumento: "NO-2024-07681319-APN-TESTSADE",
      tipodeDocumento: "NO",
      usuarioEmisor: "Uriel Rotenberg (URONTENBERG)",
      destinatariosDigitales: ["Nicolas Concetti (NCONCETTI)", "Sebastian Vidal (SVIDAL)"],
      destinatariosPapel: [],
      copia: ["Nicolas Concetti (NCONCETTI)","Nicolas Biondi (NBIONDI)"],
      copiaOculta: [], 
      fecha: 1622649395488, 
      orden: 0, 
      referencia: "Pase", 
      respuesta: "ME-2023-07687765-APN-TESTSADE",
      recibida: true,
      enviada: false,
      searchable: "29NO-2024-07685231-APN-TESTSADEPVPASE2021-06-02 12:56:35" 
    },
  ]

  let comunicaciones = [
    {
      numero: 'NO-2022-000326651-APN-DNGDE#JGM',
      tipo: 'NO',
      respuesta: 'IF-2022-00032321-APN-DNGDE#JGM',
      nombre: 'Nicolas Concetti (NCONCETTI)',
      fecha: 1622649395488,
      referencia: 'Prueba CO'
    },
    {
      numero: 'NO-2021-000324461-APN-DNGDE#JGM',
      tipo: 'NO',
      respuesta: 'IF-2022-00032321-APN-DNGDE#JGM',
      nombre: 'Nicolas Concetti (NCONCETTI)',
      fecha: 1622649395488,
      referencia: 'Prueba CO'
    }
  ]

  function comunicacionInfo(com){
    return `-Tipo CO: ${com.tipo} \n -Respuesta a: ${com.respuesta} \n -Nombre: ${com.nombre} \n -Fecha: ${com.fecha} \n -Referencia: ${com.referencia} \n `
  }
  

  function formatArray(ar){
    let ret = ''
    for(let i = 0; i<ar.length;i++){
      ret = ret + ' \n ' + ar[i]
    }
    return ret
  }

  const store = useStore()

  const url_report_error = import.meta.env.VITE_APP_REPORT_ERROR_URL

  const firmantes = computed(() => {
    if (store.state.gedo.detalle.listaFirmantes)
      return store.state.gedo.detalle.listaFirmantes.map(function (x) {
        return {
          titulo: x.substring(x.indexOf(' (')),
          nombre: x.substring(0, x.indexOf(' (')),
        }
      })
    return {}
  })

  let adjuntos = ref({})

  onMounted(async () => {
    await getAttachments()
  })
  
  const archivosAdjuntos = computed(() => {
    if (adjuntos.value)
      return Object.keys(adjuntos.value)
    else 
     return []
  })

  var BASE64_MARKER = ";base64,";
  function convertDataURIToBinary(dataURI) {
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (var i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

  async function getAttachments(){
    let base64 = "data:application/pdf;base64," + store.state.gedo.pdf
    var loadingTask =  await pdfjsLib.getDocument(convertDataURIToBinary(base64));
    loadingTask.promise.then(
      async function (pdf) {
        let att = await pdf.getAttachments()
        adjuntos.value = att
      }
    );
  }

  function download(data, filename) {
    const blobUrl = URL.createObjectURL(
      new Blob([data], { type: 'application/octet-stream' })
    );
    const a = document.createElement("a");
    if (!a.click) {
      throw new Error('DownloadManager: "a.click()" is not supported.');
    }
    a.href = blobUrl;
    a.target = "_parent";
    if ("download" in a) {
      a.download = filename;
    }
    (document.body || document.documentElement).append(a);
    a.click();
    a.remove();
  }

  function reportarIncidencia(){
    window.open(url_report_error, "_blank");
  }

  let panelSelected = ref(0)
  const gedo_props = computed(() => {
    panelSelected.value = 0
    return store.state.gedo.detalle
  })

  async function descargaArchivoTrabajo(archivo) {
    let parms = {
      nombreArchivo: archivo.nombreArchivo,
      pathRelativo: archivo.pathRelativo,
      documentoId: store.state.gedo.curr_gedo.numeroSadeDocumento,
    }
    //console.log(parms)
    try {
      let api_res = await archivoTrabajo(parms)
      if (api_res.error == false)
        download_base64(api_res.archivoTrabajoBase64, archivo.nombreArchivo)
    }
    catch(error) {
      store.dispatch("app/set_error_handler", {header: 'LA DESCARGA NO SE ENCUENTRA DISPONIBLE', message:'Se ha producido una interrupción inesperada en el servicio. Por favor, vuelva a intentarlo más tarde.', boton: 'aceptar'})
    }
  }

  const curr_gedo = computed(() => store.state.gedo.curr_gedo)

  const timeLineValues = {
    'Iniciar Documento': {
      icon: 'pi-circle-off',
      color: '#607d8b',
    },
    'Confeccionar Documento': {
      icon: 'pi-pencil',
      color: '#5f92ccf3',
    },
    'Revisar Documento': {
      icon: 'pi-eye',
      color: '#ffa301',
    },
    'Revisar Documento con Firma Conjunta': {
      icon: 'pi-eye',
      color: '#ffa301',
    },
    'Firmar Documento': {
      icon: 'pi-check',
      color: '#34a835',
    },
    'Firmar Documento (Portafirma)': {
      icon: 'pi-check',
      color: '#34a835',
    },
    Rechazado: {
      icon: 'pi-times-circle',
      color: '#e93544',
    },
    default: {
      icon: 'pi-circle-off',
      color: '#5f92ccf3',
    },
  }

  function calcularTimelineIcon(actividad) {
    return timeLineValues[actividad]
      ? timeLineValues[actividad].icon
      : timeLineValues.default.icon
  }

  function calcularTimelineIconColor(actividad) {
    return timeLineValues[actividad]
      ? timeLineValues[actividad].color
      : timeLineValues.default.color
  }

  function descargarDocumento() {
    download_base64(store.state.gedo.pdf, store.state.gedo.curr_gedo.numeroSadeDocumento + '.pdf')
  }
</script>

<style lang="scss" scoped>

.infoCardfield{
  white-space:pre-line;
}

  .detalle-gedo {
    :not(&.collapsed) #scrollArchivos {
      width: 350px;
      transition-duration: 0.3s;
      transition-timing-function: ease-in;
      opacity: 1;
    }

    &.collapsed #scrollArchivos {
      transition-duration: 0s;
      opacity: 0;
      pointer-events: none;
    }

    :not(&.collapsed) #scrollAdjuntos {
      width: 350px;
      transition-duration: 0.3s;
      transition-timing-function: ease-in;
      opacity: 1;
    }

    &.collapsed #scrollAdjuntos {
      transition-duration: 0s;
      opacity: 0;
      pointer-events: none;
    }

    :not(&.collapsed) #scrollReservados {
      width: 350px;
      transition-duration: 0.3s;
      transition-timing-function: ease-in;
      opacity: 1;
    }

    &.collapsed #scrollReservados {
      transition-duration: 0s;
      opacity: 0;
      pointer-events: none;
    }

    :not(&.collapsed) #scrollHistorial {
      width: 350px;
      transition-duration: 0.3s;
      transition-timing-function: ease-in;
      opacity: 1;
    }

    &.collapsed #scrollHistorial {
      transition-duration: 0s;
      opacity: 0;
      pointer-events: none;
    }

  }

  .cardField {
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
    font-family: 'Encode Sans', Helvetica, Arial, sans-serif;
  }
  .archivo {
    .separator {
      width: 303px;
      padding-top: 15px;
      padding-bottom: 15px;
    }
    .nombreArchivo {
      font-size: 14px;
      margin: 0rem;
      font-family: 'Encode Sans', Helvetica, Arial, sans-serif;
      margin-left: 2%;
      width: 240px;
      word-break: break-word;
    }
    button {
      margin-left: 2%;
      margin-top: 5px;
      margin-bottom: 5px;
      width: 96%;
    }
  }

  .custom-marker {
    display: flex;
    width: 2rem;
    height: 2rem;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    border-radius: 50%;
    z-index: 1;
  }

  .collapsableButton, .btn_descarga_zip,.btn_error {
    padding-left: 23px;
  }

  .btn_error { 
    .p-button {
      background: #ff4848;
      border-color: #BB0A0A;
      rotate: -90deg;
    }
    

    .p-button:hover {
      background: #F01C1C;
      border-color: #BB0A0A;
    }
  }

  .btn_descarga_zip {
    .p-button {
      background: #fc9569;
      border-color: #fc9569;
    }

    .p-button:hover {
      background: #df7142;
      border-color: #df7142;
    }
  }

  ::v-deep(.p-scrollpanel) {
    &.custombar {
      height: calc(91.8vh - 365.6px);
      .p-scrollpanel-bar {
        visibility: hidden;
        background-color: rgba(95, 146, 204, 0.4);
        opacity: 1;
        transition: background-color 0.2s;
        &:hover {
          background-color: rgba(95, 146, 204, 0.952);
        }
      } 
      &.custombar:hover .p-scrollpanel-bar-y{
          visibility: visible;
      }
    }
  }

</style>
<style lang='scss'>

.tooltipDetalle.p-tooltip{
  z-index: 1000;
}

  .p-tabview.collapsed ul {
    display: block;
    padding-left: 10px;

    li.p-highlight .p-tabview-nav-link {
      background-color: transparent;
      color: #333333;
      &:hover {
        background-color: #DBDBDB;
      }
    }
  }
  .comunicacionAsociada{
  white-space:pre-line;
  .valor{
    color: gray ;
    font-size: 13px ;
  }
}
</style>