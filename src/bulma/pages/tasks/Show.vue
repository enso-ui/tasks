<template>
    <div v-if="task" class="containter m-auto">
        <div class="columns mx-0 box">
            <div class="column is-two-third-tablet px-5">
                <div class="columns">
                    <div class="column is-three-quarters is-size-7 pl-5">
                        Updated {{ task.updatedAt }} | Created by
                        <a>
                            <strong>{{ task.createdBy.person.name }}</strong>
                        </a>
                    </div>
                    <div class="column pt-0">
                        <fa
                            :class="{ 'has-text-grey': !task.muted }"
                            @click="notification"
                            class="bell is-clickable is-pulled-right is-flex fa-2xl" icon="bell"/>
                    </div>
                </div>
                <div class="column">
                    <h4 class="title is-4">
                        {{ task.name }}
                    </h4>
                </div>
                <div class="column">
                    <div class="columns">
                        <div class="column is-one-fifth">
                            <div class="mt-3">Status</div>
                            <div class="mt-4">From - To</div>
                            <div class="mt-3">Flag</div>
                            <div class="mt-3">Allocated To</div>
                        </div>
                        <div class="column is-two-fifth">
                            <div class="mt-3">
                                <span v-for="(status, id) in enums.statuses._all()">
                                    <span class="tag is-table-tag"
                                        :class="cssClass(enums.statuses, task)"
                                        v-if="task.status ==id">
                                        {{ status }}
                                  </span>
                                </span>
                            </div>
                            <div class="mt-3">
                                {{ task.from }} - {{ task.to }}
                            </div>
                            <div class="mt-3">
                                <span v-for="(flag, id) in enums.flags._all()"
                                   class="icon" :class="`has-text-${flag.toLowerCase()}`">
                                   <fa v-if="id==task.flag" icon="flag"/>
                                </span>
                            </div>
                            <div class="mt-3">
                                <figure class="is-flex is-align-items-center avatar">
                                    <p class="image is-32x32 mr-2">
                                        <img class="is-rounded"
                                            alt="avatar"
                                            :src="route('core.avatars.show', task.allocatedTo.avatar.id)">
                                    </p>
                                    {{ task.allocatedTo.person.name }}
                                </figure>
                            </div>
                        </div>
                    </div>
                    <Divider/>
                    <div class="mt-5">
                        <div>
                            <strong>{{ i18n('Description') }}</strong>
                        </div>
                        <div class="my-4">
                            {{ task.description }}
                        </div>
                    </div>
                    <Divider/>
                    <div class="mt-5">
                        <div>
                            <strong>{{ i18n('Checklist') }} ({{task.completedTaskChecklistItems}})</strong>
                        </div>
                        <div>
                            <checklist-items :id="taskId"
                                :taskChecklistItems="taskChecklistItems"
                                @update="fetch();"
                                type="task"
                                ref="checklists"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column pt-0 is-one-third">
                <comments :id="taskId"
                    type="task"
                    ref="comments"/>
            </div>
        </div>
    </div>
</template>

<script>
import {FontAwesomeIcon as Fa} from '@fortawesome/vue-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faCloudDownloadAlt, faBell} from '@fortawesome/free-solid-svg-icons';
import {hljs} from '@enso-ui/directives';
import {mapState} from "vuex";
import ChecklistItems from './components/checklists/ChecklistItems.vue';
import cssClass from '../../modules/task';
import Divider from '@enso-ui/divider';
import Comments from './components/comments/Comments.vue';


library.add(faCloudDownloadAlt, faBell);

export default {
    name: 'Show',

    directives: {hljs},

    components: {
        Fa,
        ChecklistItems,
        Divider,
        Comments
    },

    inject: ['errorHandler', 'http', 'i18n', 'route', 'toastr', 'routerErrorHandler'],

    data: () => ({
        task: null,
        taskChecklistItems: [],

    }),
    computed: {
        ...mapState(['meta', 'enums']),
        taskId() {
            return Number.parseInt(this.$route.params.task, 10);
        },
    },

    created() {
        this.fetch();
    },

    methods: {
        fetch() {
            this.http.get(this.route('tasks.show', this.$route.params.task))
                .then(({data}) => {
                    this.task = data.task;
                    this.taskChecklistItems = data.task.taskChecklistItems;
                }).catch(this.errorHandler);
        },
        cssClass(columnEnum, row) {
            return cssClass(columnEnum, row);
        },
        notification() {
            this.http.patch(this.route('tasks.update', {'task': this.task}),
                {muted: !this.task.muted})
                .then(({data: {message}}) => {
                    this.toastr.success(message);
                    this.fetch()
                }).catch(error => {
                if (error.response && error.response.status === 422) {
                    this.toastr.warning(this.i18n(error.response.data.message));
                } else {
                    this.errorHandler(error);
                }
            });
        }
    },
};
</script>

<style src="highlight.js/styles/atom-one-light.css"></style>

<style lang="scss">
.wrapper {
    padding: 1.2em;
}
</style>
