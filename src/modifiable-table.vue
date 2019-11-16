<template>
    <div>

        <v-data-table
                :dense="dense"
                :headers="headers"
                :items="allItems"
                :item-key="itemKey"
                :items-per-page="5"
                :single-select="true"
                show-select
                v-model="selectedItems"
                @input="onSelectedItemsChanged"
                class="elevation-1"
        >

            <template v-slot:top>

                <v-toolbar flat color="white">

                    <span class="title">{{title}}</span>

                    <v-spacer v-if="title || rightAlignButtons"/>

                    <v-btn color="primary" text icon @click="selectedItems = []; dialog = true">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                    <v-btn color="primary" text icon @click="dialog = true" :disabled="selectedItems.length === 0">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn color="primary" text icon @click="deleteDialog = true" :disabled="selectedItems.length === 0">
                        <v-icon>mdi-trash-can</v-icon>
                    </v-btn>
                </v-toolbar>
            </template>

        </v-data-table>

        <v-dialog v-model="dialog" max-width="500px" @click:outside="refreshSelectedItemsCopy"
                  @keydown.esc="refreshSelectedItemsCopy">

            <v-card>
                <v-card-title>
                    <span class="headline">{{dialogTitle}}</span>
                </v-card-title>

                <v-card-text>
                    <v-container>
                        <slot name="dialogContent" :selected-items="selectedItemsCopy">
                            Selected item: {{selectedItemsCopy}}
                        </slot>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text :disabled="isSaveButtonDisabled()" @click="onSave">Save</v-btn>
                    <v-btn color="blue darken-1" text @click="onCancel">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="deleteDialog" max-width="500px">

            <v-card>
                <v-card-title>
                    <span class="headline">{{deleteDialogTitle}}</span>
                </v-card-title>

                <v-card-text>
                    <v-container>
                        <v-row>
                            <slot name="deleteDialogContent" :selected-items="selectedItemsCopy">
                                <div v-if="selectedItemsCopy.length > 0">
                                    Are you sure you want to delete the selected {{itemName}}?
                                </div>
                                <div v-else>
                                    Nothing is selected to delete.
                                </div>
                            </slot>
                        </v-row>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="onDeleteItem">Yes</v-btn>
                    <v-btn color="blue darken-1" text @click="onCancelDelete">No</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import Vue from 'vue';
import { Prop, Watch } from 'vue-property-decorator';

@Component
export default class ModifiableTable<T> extends Vue {

    @Prop({ required: true })
    value!: T[]; // Named "value" for v-model support

    @Prop({ required: true })
    headers!: any[];

    @Prop({ default: 'id' })
    itemKey!: string;

    @Prop({ default: 'Item' })
    itemName!: string;

    @Prop({ required: false })
    title!: string;

    @Prop({ default: false })
    rightAlignButtons!: boolean;

    @Prop({ default: false })
    dense!: boolean;

    allItems: T[] = [];

    selectedItems: T[] = [];
    selectedItemsCopy: T[] = [];

    dialog: boolean = false;
    deleteDialog: boolean = false;

    get deleteDialogTitle(): string {
        return `Delete ${this.itemName}`;
    }

    get dialogTitle(): string {
        return (this.selectedItems.length ? 'Edit ' : 'New ') + this.itemName;
    }

    isSaveButtonDisabled(): boolean {

        // Dialog isn't visible - be safe and we're disabled
        if (this.selectedItemsCopy.length === 0) {
            return true;
        }

        // If they haven't populated the item key field yet, we're disabled
        const editedItem: T = this.selectedItemsCopy[0];
        const editedItemKey: any = (editedItem as any)[this.itemKey];
        if (!editedItemKey) {
            return true;
        }

        // If they're editing a value but haven't changed the key, we must be in a good state
        const isEdit: boolean = this.selectedItems.length > 0;
        if (isEdit && editedItemKey === (this.selectedItems[0] as any)[this.itemKey]) {
            return false;
        }

        // Otherwise, this is a new record or they've changed the key.
        // In this case, if it matches some other existing value, we're disabled.
        return this.value.map((v: T) => (v as any)[this.itemKey])
            .indexOf(editedItemKey) > -1;
    }

    mounted() {
        // Need a gentle nudge the first time through
        this.onValueChanged(this.value);
        this.refreshSelectedItemsCopy();
    }

    onCancel() {
        this.dialog = false;
        this.refreshSelectedItemsCopy();
    }

    onCancelDelete() {
        this.deleteDialog = false;
    }

    onDeleteItem() {

        const selectedKey: any = (this.selectedItemsCopy[0] as any)[this.itemKey];

        const newDataList: T[] = this.value.filter((v: T) => {
            return (v as any)[this.itemKey] !== selectedKey;
        });

        this.$emit('input', newDataList);

        this.deleteDialog = false;
    }

    onSave() {

        const isEdit: boolean = this.selectedItems.length > 0;
        const editedItem: T = this.selectedItemsCopy[0];
        const origItem: T = isEdit ? this.selectedItems[0] : {} as T;

        const newDataList: T[] = this.value.slice();
        if (isEdit) {
            const index: number = newDataList.indexOf(origItem);
            newDataList[index] = editedItem;
        }
        else {
            newDataList.push(this.selectedItemsCopy[0]);
        }

        this.$emit('input', newDataList);

        this.dialog = false;
        this.selectedItems.length = 0;
        this.refreshSelectedItemsCopy();
    }

    onSelectedItemsChanged() {
        this.refreshSelectedItemsCopy();
    }

    @Watch('value')
    onValueChanged(newItems: T[]) {
        this.allItems = newItems.slice();
    }

    private refreshSelectedItemsCopy() {
        if (this.selectedItems.length > 0) {
            this.selectedItemsCopy = JSON.parse(JSON.stringify(this.selectedItems));
        }
        else {
            this.selectedItemsCopy = [ {} as T ];
        }
    }
}
</script>

<style scoped>
.modifiable-table {

}
</style>
