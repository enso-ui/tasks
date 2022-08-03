<template>
    <div class="checklists-wrapper">
        <div class="is-multiline mt-3">
            <div class="mt-2" 
                v-for="checklist in filteredChecklists" 
                :key="checklist.id">
                <checklist-item 
                    :id="id"
                    @change-status="createForm = false" :checklist="checklist"
                    :create-form="createForm" 
                    ref="checklist"/>
            </div>
        </div>
        <div v-show="createForm" class="mt-3">
            <input 
                class="textarea" 
                v-model="checklist.name" 
                rows="2" 
                placeholder="Add new to-do">
            <div class="mt-3">
                <button
                    class="button is-rounded
                    is-small is-bold mr-1 action" 
                    @click="createForm = false">
                    <span>
                        {{ i18n('Cancel') }}
                    </span>
                    <span class="icon is-small">
                        <fa icon="ban"/>
                    </span>
                </button>
                <button 
                    class="button is-rounded
                    is-small is-bold is-success action" 
                    @click="create">
                    <span>
                        {{ i18n('Save') }}
                    </span>
                    <span class="icon">
                        <fa icon="check"/>
                    </span>
                </button>
            </div>
        </div>
        <div id="add-item" 
            class="mt-5 is-size-6 is-align-items-center
            is-clickable" 
            @click="createForm = true;">
            <span class="icon is-small">
                <fa icon="plus"/>
            </span>
            Add an Item
        </div>
    </div>
</template>

<script>
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faSync, faCheck } from '@fortawesome/free-solid-svg-icons';
import ChecklistItem from './ChecklistItem.vue';

library.add(faPlus, faSync, faCheck);

export default {
    name: 'Checklists Items',
    components: {
        Fa, ChecklistItem
    },
    inject: [
        'canAccess', 'errorHandler', 'i18n', 'http', 'route',
        'routerErrorHandler', 'toastr',
    ],

    props: {
        id: {
            type: Number,
            required: true,
        },
        taskChecklistItems: {
            type: Array,
            required: true,
        },
    },

    emits: ['update'],

    data: () => ({
        loading: false,
        path: null,
        createForm: false,
        checklist: {
            name: '',
            is_completed: false
        },
        checklistsValues: [],
    }),

    computed: {
        filteredChecklists() {
            return this.checklistsValues;
        },
        count() {
            return this.checklistsValues.length;
        },
    },

    watch: {
        taskChecklistItems() {
            this.checklistsValues = this.taskChecklistItems;
        },
    },

    created() {
        this.fetch()
    },

    methods: {
        fetch() {
            this.checklistsValues = this.taskChecklistItems
            this.$emit('update');
        },
        create() {
            this.http.post(this.route('tasks.checklistItems.store'),
                { task_id: this.id, ...this.checklist })
                .then(({ data: { message } }) => {
                    this.fetch()
                    this.checklist.name = ''
                    this.createForm = false
                    this.toastr.success(message)
                })
                .catch(this.errorHandler);
        }
    },
};
</script>
<style>
#add-item {
    color: #d8d8d8;
}

#add-item:hover {
    color: black;
}
</style>
