<template>
    <div class="column is-full is-flex"
         @mouseleave="enableRemoveIcon = false"
         @mouseover="enableRemoveIcon = true"
    >
        <template v-if="!enableInput">
            <div>
                <input class="is-clickable"
                    v-model="checklist.is_completed"
                    type="checkbox"
                    @click="toggleChecklist(checklist)"
                >
                <label class="checkbox"
                    :class="{ 'checklist-selected' : checklist.is_completed }"
                    @click="setChecklist(checklist)"
                >
                <span class="ml-3">
                    {{ checklist.name }}
                </span>
                </label>
            </div>
        </template>
        <template v-else>
            <div class="columns is-multiline is-gapless">
                <div class="column is-flex is-align-items-center is-align-content-center">
                    <p class="control has-icons-right">
                        <input
                            class="input"
                            placeholder="Add a checklist"
                            autofocus
                            v-model="editChecklist"
                            @keypress.enter="updateChecklist(checklist)"
                        >
                    </p>
                    <div class="mt-2 has-text-right ml-4">
                        <a class="button is-rounded is-bold mr-1 is-small action"
                           @click="enableInput = false; $emit('item-update', false)">
                            <span>
                                {{ i18n('Cancel') }}
                            </span>
                            <span class="icon is-small">
                                <fa icon="ban"/>
                            </span>
                        </a>
                        <a
                           class="button is-rounded is-bold is-success is-small action"
                           @click="updateChecklist(checklist);">
                            <span>
                                {{ i18n('Update') }}
                            </span>
                            <span class="icon is-small">
                                <fa icon="check"/>
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </template>
        <a
            :class="{ 'is-hidden' : !enableRemoveIcon || enableInput == true }"
            class="mx-5"
            @click.prevent="remove(checklist)"
        >
            <span class="icon has-text-grey-light">
                <fa icon="times-circle"/>
            </span>
        </a>
    </div>
</template>

<script>
import {FontAwesomeIcon as Fa} from '@fortawesome/vue-fontawesome';
import {Avatar} from '@enso-ui/users';


export default {
    name: "ChecklistItem",

    inject: [
        'errorHandler', 'http', 'toastr', 'route', 'i18n',
    ],

    components: {Fa, Avatar},

    data: () => ({
        enableInput: false,
        enableRemoveIcon: false,
        editChecklist: null,
    }),

    props: {
        checklist: {
            type: Object,
            required: true,
        },
        task: {
            type: Object,
            required: true,
        },
    },

    emits: [
        'reload-task',
        'item-update',
    ],

    methods: {
        remove(checklist) {
            this.http.delete(this.route('tasks.checklistItems.destroy', checklist.id))
            .then(response => {
                this.$emit('reload-task');
                this.toastr.success(response.data.message);
            }).catch(this.errorHandler);
        },
        toggleChecklist(checklist) {
            this.http.patch(this.route('tasks.checklistItems.update', checklist.id),
                { is_completed: !checklist.is_completed })
            .then(response => {
                this.$emit('reload-task');
                this.toastr.success(response.data.message);
            })
            .catch(this.errorHandler);
        },
        setChecklist(checklist) {
            this.$emit('item-update', false)
            this.editChecklist = checklist.name;
            this.enableInput = true;
        },
        updateChecklist(checklist) {
            this.http.patch(this.route('tasks.checklistItems.update', checklist.id), {
                name: this.editChecklist,
                task_id: this.task.id,
            })
            .then(response => {
                this.$emit('reload-task');
                this.$emit('item-update', true);
                this.toastr.success(response.data.message);
            })
            .catch(this.errorHandler);
            this.enableInput = false;
        },
    },
}
</script>

<style scoped>
.checklist-selected {
    text-decoration: line-through;
}
</style>
