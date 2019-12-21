<template>
    <modifiable-table :headers="headers" v-model="items"
                      :title="title" :right-align-buttons="rightAlignButtons"
                      item-key="id" :dense="dense" :validation-func="isRowValid">

        <template v-slot:dialogContent="{ selectedItem }">
            <v-form v-if="selectedItem">
                <!-- Probably a good idea to use rules that match your
                     validation-func's logic on a per-field level -->
                <v-text-field label="Name"
                              name="field1"
                              autocomplete="off"
                              :rules="nameFieldRules(selectedItem)"
                              v-model="selectedItem.name"/>
                <v-text-field label="Age"
                              name="field2"
                              autocomplete="off"
                              :rules="ageFieldRules"
                              v-model="selectedItem.age"/>
            </v-form>
        </template>

    </modifiable-table>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import ModifiableTable from '../modifiable-table.vue';
import { ModifiableTableHeader } from '../modifiable-table.vue';
import { Prop } from 'vue-property-decorator';
import { Record } from './app.vue';

/**
 * A component encapsulating a modifiable-table of our data type.
 * This lets us encapsulate the table along with its possibly-lengthy slots,
 * such as the modify-record modal's contents.
 */
@Component({ components: { ModifiableTable } })
export default class RecordTable extends Vue {

    // The data set we want to edit
    @Prop({ required: true })
    value!: Record[];

    @Prop({ required: true })
    title!: string;

    @Prop({ default: false })
    rightAlignButtons!: boolean;

    @Prop({ default: false })
    dense!: boolean;

    headers: ModifiableTableHeader[] = [ { text: 'Name', value: 'name' }, { text: 'Age', value: 'age' } ];

    // Computed variable mimicking our v-model value
    get items(): Record[] {
        return this.value;
    }

    // Computed setter to update our v-model value
    set items(newValue: Record[]) {
        this.$emit('input', newValue);
    }

    nameFieldRules(selectedItem: Record): any[] {
        return [
            (newValue: string): string | boolean => {
                return newValue && newValue.trim().length ? true : 'Name must be provided';
            },
            (newValue: string): string | boolean => {
                const existing: Record[] = this.items.filter((item: Record) => item.name === newValue);
                if (existing.length && existing[0].id !== selectedItem.id) {
                    if (this.items.map((item: Record) => item.name).indexOf(newValue) > -1) {
                        return 'This name is already taken';
                    }
                }
                return true;
            }
        ];
    };

    ageFieldRules: any[] = [
        (newValue: string): string | boolean => {
            return newValue && newValue.toString().trim().length ? true : 'Age must be provided';
        }
    ];

    isRowValid(newRowData: Record): boolean {

        const nameFieldRules: Function[] = this.nameFieldRules(newRowData);
        for (let i : number = 0; i < nameFieldRules.length; i++) {
            if (nameFieldRules[i](newRowData.name) !== true) {
                return false;
            }
        }

        for (let i : number = 0; i < this.ageFieldRules.length; i++) {
            if (this.ageFieldRules[i](newRowData.age) !== true) {
                return false;
            }
        }

        return true;
    }
}
</script>
