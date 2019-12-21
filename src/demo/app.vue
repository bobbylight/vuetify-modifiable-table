<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Modifiable Table Demo</span>
      </v-toolbar-title>
    </v-app-bar>

    <v-content>

      <v-container>

        <v-row>

          <v-col xs3>
            <v-text-field v-model="tableTitle" label="Title"/>
          </v-col>

          <v-col xs3>
            <v-checkbox v-model="rightAlignButtons" :disabled="tableTitle.length > 0" label="Right-align buttons"/>
          </v-col>

          <v-col xs3>
            <v-checkbox v-model="dense" label="Dense"/>
          </v-col>
        </v-row>

        <v-row>
          <v-col xs12>

            <record-table v-model="items"
                :title="tableTitle" :right-align-buttons="rightAlignButtons"
                :dense="dense"/>
          </v-col>
        </v-row>
      </v-container>

      <v-container>

        <v-row>
          Record count: {{items.length}}, names: {{items.map(item => item.name).join(', ')}}
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import RecordTable from './record-table.vue';

/**
 * The type of data we're displaying in the table.  This can be anything
 * but needs a string column that's a unique identifier.
 */
export interface Record {
  id: string;
  name: string;
  age:  number;
}

/**
 * A demo class showing usage of the component.
 */
@Component({ components: { RecordTable } })
export default class App extends Vue {

  // The data set we'll be mutating
  items: Record[] = [
    { id: '1', name: 'Bob', age: 34 },
    { id: '2', name: 'Angela', age: 17 }
  ];

  // Fields just to show how modifiable-table can be configured
  tableTitle: string = '';
  rightAlignButtons: boolean = true;
  dense: boolean = false;
}
</script>
