<template>
    <div class="mt-6">
        <h4 class="is-uppercase title is-6">
            {{ i18n('Checklist') }}
            <a class="has-background-white has-text-grey-dark">
                <span class="tag is-dark counter">
                    {{ task.completedChecklist.percentageString }}
                </span>
            </a>
        </h4>

        <div class="columns is-multiline is-mobile is-gaples">
            <ChecklistItem
                v-for="(checklist, index) in task.checklist"
                :key="checklist.id"
                :checklist="checklist"
                :task="task"
                v-bind="$attrs"
                @itemUpdate="changeInputState($event)"
            />
            <div class="column is-full is-clickable	has-text-grey-lighter"
                 @click="openInput"
                 v-if="addAction">
                <span class="icon is-justify-content-flex-start">
                    <fa icon="plus"/>
                </span>
                {{ i18n('Add to-do') }}
            </div>
        </div>

        <div v-if="enableInput" class="columns is-multiline">
            <div class="column is-flex is-align-items-center is-align-content-center">
                <p class="control has-icons-right">
                    <input
                        v-model="checklist"
                        class="input"
                        ref="input"
                        autofocus
                        placeholder="Add a to-do"
                        @keypress.enter="add"
                    >
                </p>
                <div class="mt-2 has-text-right ml-4">
                    <a class="button is-rounded is-bold mr-1 is-small action"
                       @click="enableInput = false; addAction = true">
                        <span>
                            {{ i18n('Cancel') }}
                        </span>
                        <span class="icon is-small">
                            <fa icon="ban"/>
                        </span>
                    </a>
                    <a class="button is-rounded is-bold is-success is-small action"
                        @click="add">
                        <span>
                            {{ i18n('Save') }}
                        </span>
                        <span class="icon is-small">
                            <fa icon="check"/>
                        </span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ChecklistItem from './ChecklistItem';
import {FontAwesomeIcon as Fa} from "@fortawesome/vue-fontawesome";

export default {
    name: "ChecklistItems",

    inject: [
        'errorHandler', 'http', 'toastr', 'route', 'i18n',
    ],

    components: {ChecklistItem, Fa},

    data: () => ({
        enableInput: false,
        addAction: true,
        checklist: '',
    }),

    props: {
        task: {
            type: Object,
            required: true,
        },
    },

    methods: {
        add() {
            this.http.post(this.route('tasks.checklistItems.store'), {
                name: this.checklist,
                task_id: this.$route.params.task
            }).then(response => {
                this.$emit('reload-task');
                this.checklist = null;
                this.enableInput = false
                this.addAction = true;
                this.toastr.success(response.data.message)
            }).catch(this.errorHandler);
        },
        changeInputState(event) {
            (!this.addAction && !this.enableInput)
            ? this.addAction = true
            : this.addAction = event;
        },
        openInput() {
            this.enableInput = true;
            this.addAction = false;
        }
    }
}
</script>

<style scoped>

</style>
