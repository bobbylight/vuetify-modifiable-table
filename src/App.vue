<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Modifiable Table Test</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        text
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Latest Release</span>
      </v-btn>
    </v-app-bar>

    <v-content>

      <v-container>

        <v-row>

          <v-flex xs3>
            <v-text-field v-model="tableTitle" label="Title"/>
          </v-flex>

          <v-flex xs3>
            <v-checkbox v-model="rightAlignButtons" :disabled="tableTitle.length > 0" label="Right-align buttons"/>
          </v-flex>

          <v-flex xs3>
            <v-checkbox v-model="dense" label="Dense"/>
          </v-flex>
        </v-row>

        <v-row>
          <v-flex xs12>

            <modifiable-table :headers="headers" v-model="items" item-key="name"
                :title="tableTitle" :right-align-buttons="rightAlignButtons"
                :dense="dense">

              <template v-slot:dialogContent="{ selectedItems }">
                <div>Passed-in content, selected items: {{selectedItems}}</div>
                <div v-if="selectedItems.length > 0">
                  <v-text-field label="Name" v-model="selectedItems[0].name"></v-text-field>
                  <v-text-field label="Age" v-model="selectedItems[0].age"></v-text-field>
                </div>
              </template>
            </modifiable-table>
          </v-flex>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import ModifiableTable from './modifiable-table.vue';

@Component({ components: { ModifiableTable } })
export default class App extends Vue {

    headers: any[] = [ { text: 'Name', value: 'name' }, { text: 'Age', value: 'age' } ];

    items: any[] = [ { name: 'Bob', age: 34 }, { name: 'Angela', age: 17 } ];

    tableTitle: string = '';

    rightAlignButtons: boolean = true;

    dense: boolean = false;
}
</script>
