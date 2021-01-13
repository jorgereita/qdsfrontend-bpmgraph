<template>
  <v-container>
    <h2>
      <v-icon aria-hidden='false'> mdi-subtitles</v-icon>
      Diagrama de proceso:
      {{ blocks[0] ? (blocks[0].proc__des ? blocks[0].proc__des : '') : '' }}
    </h2>
    <v-icon aria-hidden='false'> mdi-account-circle</v-icon>
    {{ blocks[0] ? (blocks[0].user__name ? blocks[0].user__name : '') : '' }}
    <div v-for='item in json2draw' :key='item' class='container-diagram'>
      <br />
      <Diagram
        :width='800'
        :height='300'
        :fluid='false'
        scale='1'
        background='#fafafa'
        :nodes='item.nodes'
        :links='item.links'
        :editable='editable'
        @editNode='editNode'
        @editLink='editLink'
        @nodeChanged='nodeChanged'
        @linkChanged='linkChanged'
      ></Diagram>
    </div>
    <v-dialog v-model='dialog' max-width='290'>
      <v-card>
        <v-card-title class='headline'>Error</v-card-title>

        <v-card-text>
          {{ errormsm }}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color='green darken-1' flat='flat' @click='dialog = false'>
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
    <style type='text/css'>
.wrapper {
  min-height: 100vh;
  border: 1px solid black;
  background-color: #ccc;
  padding: 10px;
  height: 100vh;
}
.container-diagram {
  border: 1px solid gray;
}
</style>
<script>
import axios from 'axios';
import Diagram from 'diagram-vue';
import data from '../data.json';

export default {
  name: 'graph',
  components: {
    Diagram,
  },
  data() {
    return {
      blocks: [],
      dialog: false,
      editable: false,
      nodes: [],
      links: [],
      test: [1, 2],
      json2draw: [],
      errormsm: '',
    };
  },
  computed: {},
  mounted() {
    this.nodes = data.nodes;
    this.links = data.links;
    const vue = this;
    // const jsonparam = JSON.parse(this.$route.params.jsonparams.replaceAll('%2f', '/'));
    const dts = {
      dsSIRbpm_proc_grf: {
        eeDatos: [
          {
            picusrcod: 'jyajure_800001541',
            picfiid:
              'ADAADAAAAAIACwCgAAIAAAASanlhanVyZV84MDAwMDE1NDEAAKAAAQAAAAtkZXNhcnJvbGxvAACgAA8AAAAXcFQ4SzVnbXh4SjUzRk04VEdEVU90QQAAkAAQAAAACAAAAABf5XGUANAAGwAAAAj////////+1ACgAAYAAAAOKioqKioqKioqKioqKioAoAAOAAAADV9vZXVzZXJ0YWJsZQAAoAAfAAAAEXNpYyB0Y29tZXJjaWFsADgAAJAACwAAAAgAAAAAX+NmZQDQABcAAAAI/////////tQAwAAUAAAAAADQABwAAAAIAAAAABADQM8AwAAWAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAACgAB8AAAARcmVwIHRjb21lcmNpYWwAOAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAoAAfAAAAEmNvbnQgdGNvbWVyY2lhbAA4AAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAACgAB8AAAARbm9tIHRjb21lcmNpYWwANwAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAoAAfAAAAEWludiB0Y29tZXJjaWFsADgAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAKAAHwAAABFhY3QgdGNvbWVyY2lhbAA4AAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAACgAB8AAAARYnBtIHRjb21lcmNpYWwAOAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAoAAfAAAAEXBjbyB0Y29tZXJjaWFsADMAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAKAAHwAAABFoZXIgdGNvbWVyY2lhbAAzAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAACgAB8AAAARcHJvIHRjb21lcmNpYWwAMwAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAoAAfAAAAEXNzdCB0Y29tZXJjaWFsADMAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAKAAHwAAABlzb3BvcnRlcXBhciB0Y29tZXJjaWFsADgAALAAFQAAABAd211wmheFf1OyhMkRjBuh',
          },
        ],
        eeSIRbpm_proc: [{ picproc__name: 'IP_MF_800001541_10202' }],
      },
    };
    axios
      .post(
        'https://backend.desarrollo.portalintegrity.cloud/web/Procesos/SIRbpm_proc_grf',
        dts,
      )
      .then((response) => {
        if (response.data.dsSIRbpm_proc_grf.eeEstados[0].Estado === 'OK') {
          vue.blocks = response.data.dsSIRbpm_proc_grf.eebpm_proc;
          let conterid = 0;
          Object.entries(vue.blocks[0].eebpm_lego).forEach((e) => {
            let nodes2fill = [];
            let position = 0;
            Object.entries(e[1].eebpm_own_task).forEach((x) => {
              position += 1;
              conterid += 1;
              nodes2fill.push({
                id: conterid,
                content: {
                  text: x[1].task__name,
                  color: 'white',
                },
                width: 150,
                stroke: 'red',
                height: 60,
                shape: 'rectangle',
                point: {
                  x: 50 + position * 200,
                  y: 100,
                },
              });
            });
            const link = [];
            for (let i = 0; i < nodes2fill.length; i += 1) {
              if (nodes2fill[i + 1]) {
                link.push({
                  id: `${nodes2fill[i].id}${i}`,
                  source: nodes2fill[i].id,
                  destination: nodes2fill[i + 1].id,
                  point: {
                    x: nodes2fill[i + 1].point.x,
                    y: nodes2fill[i].point.y + 10,
                  },
                  x2: nodes2fill[i + 1].point.x + 150,
                  color: '#dd3838',
                  arrow: 'dest',
                });
              }
            }
            if (e[1].pos__lego !== 1) {
              vue.json2draw.push({
                nodes: nodes2fill,
                width: 200,
                links: link,
                tooltip: 'hola mundo',
              });
            }

            nodes2fill = [];
            position = 0;
          });
        } else {
          vue.dialog = true;
          vue.errormsm = response.data.dsSIRbpm_proc_grf.eeEstados[0].Estado;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    editNode: () => {},
    editLink: () => {},
    nodeChanged: (obj) => {
      this.nodes = obj.nodes;
    },
    linkChanged: (obj) => {
      this.links = obj.links;
    },
    getBloques: () => {},
  },
};
</script>
