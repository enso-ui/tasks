<template>
    <div 
        @mouseover="display = true" 
        @mouseleave="display = false">
        <label class="checkbox" v-show="!editForm">
            <input class="form-check-input mr-1" 
                @change="updateStatus($event)" 
                :checked="checklist.isCompleted"
                type="checkbox" 
                :value="isCompleted">
        </label>
        <span 
            v-show="!editForm" 
            class="checklistName" 
            @click="edit(checklist);
            editForm = true" 
            :style="{ textDecoration: checklist.isCompleted ? 'line-through' : '' }">
            {{ checklist.name }}
        </span>
        <div v-show="editForm" class="mt-3">
            <input 
                class="textarea" 
                v-model="updateChecklist.name" 
                rows="2" 
                placeholder="Add new to-do">
            <div class="mt-3">
                <button class="button is-rounded 
                    is-small is-bold mr-1 action" 
                    @click="editForm = false">
                    <span>
                        {{ i18n('Cancel') }}
                    </span>
                    <span class="icon is-small">
                        <fa icon="ban" />
                    </span>
                </button>
                <button 
                    class="button is-rounded is-bold 
                    is-small is-success action" 
                    @click="update">
                    <span>
                        {{ i18n('Update') }}
                    </span>
                    <span class="icon">
                        <fa icon="check" />
                    </span>
                </button>
            </div>
        </div>
        <span>
            <button 
                @click="empty(checklist)" 
                class="ml-2 mt-1 delete is-small" 
                v-show="display && !editForm"></button>
        </span>
    </div>

</template>

<script>
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faPencilAlt, faTimes, faGripLines } 
    from '@fortawesome/free-solid-svg-icons';
import { mapState } from "vuex";

library.add([
    faCheck, faTimes, faPencilAlt, faGripLines
]);

export default {
    name: 'Checklist Item',

    components: { Fa },

    inject: ['canAccess', 'http', 'i18n', 'route', 'toastr', 'errorHandler'],

    emits: ['change-status'],

    props: {
        checklist: {
            type: Object,
            required: true,
        },
        createForm: {
            type: Boolean,
        },
    },

    watch: {
        createForm() {
            if (this.editForm) {
                this.editForm = !this.createForm
            }
        },
    },

    data: () => ({
        controls: false,
        display: false,
        editForm: false,
        isCompleted: false,
        updateChecklist: {
            name: '',
            task_id: '',
            is_completed: false
        },
    }),
    computed: {
        ...mapState(['meta']),
        collapsed() {
            return !!this.checklist.isCompleted;
        }
    },
    methods: {
        updateStatus(e) {
            const payload = {
                name: this.checklist.name,
                task_id: this.checklist.taskId,
                order_index: this.checklist.orderIndex,
                is_completed: e.target.checked
            };

            this.http.patch(this.route('tasks.checklistItems.update',
                { 'checklistItem': this.checklist }), payload)
                .then(({ data: { message } }) => {
                    this.toastr.success(message);
                    this.$parent.fetch()
                }).catch(error => {
                    if (error.response && error.response.status === 422) {
                        this.toastr.warning(this.i18n(error.response.data.message));
                    } else {
                        this.errorHandler(error);
                    }
                });
        },
        empty(checklist) {
            this.http.delete(this.route('tasks.checklistItems.destroy',
                { 'checklistItem': checklist })).then(({ data }) => {
                    this.toastr.success(data.message);
                    this.$parent.fetch()
                }).catch(this.errorHandler)
        },
        edit(checklist) {
            this.$emit('change-status');
            this.updateChecklist.name = checklist.name
            this.updateChecklist.task_id = checklist.taskId
            this.updateChecklist.is_completed = checklist.isCompleted
        },
        update() {
            this.http.patch(this.route('tasks.checklistItems.update',
                { 'checklistItem': this.checklist }),
                this.updateChecklist)
                .then(({ data: { message } }) => {
                    this.editForm = false
                    this.toastr.success(message);
                    this.$parent.fetch()
                }).catch(error => {
                    if (error.response && error.response.status === 422) {
                        this.toastr.warning(this.i18n(error.response.data.message));
                    } else {
                        this.errorHandler(error);
                    }
                });
        },
    }
};
</script>
<style lang="scss">
.delete:hover {
    background: #cd4400;
}
</style>
