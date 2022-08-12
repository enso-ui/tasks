<template>
    <div v-if="task" class="container m-auto">
        <div class="columns mx-0 box">
            <div class="column is-two-thirds">
                <div id="box-header"
                     class="is-flex has-text-grey-light is-justify-content-space-between is-align-items-center mb-5">
                    <p>
                        Updated ( {{ task.updatedAt }} ) | Created by <a href="#">{{ task.createdBy }}</a>
                    </p>
                    <fa :class="{ 'has-text-grey': !task.muted }"
                        class="icon is-clickable is-medium"
                        icon="bell"
                        @click="toggleMuted"/>
                </div>
                <div>
                    <h4 class="title is-4">
                        {{ task.name }}
                    </h4>
                    <div class="columns is-vcentered is-multiline is-mobile">
                        <div class="column is-3">
                            <strong>{{ i18n('Status') }}</strong>
                        </div>
                        <div class="column is-9 px-2">
                           <span :class="cssClass(enums.taskStatuses, task)"
                                 class="tag">
                                {{ enums.taskStatuses._get(task.status) }}
                            </span>
                        </div>
                        <div class="column is-3">
                            <strong>{{ i18n('From - to') }}</strong>
                        </div>
                        <div class="column is-9 px-2">
                            {{ task.from }} - {{ task.to }}
                        </div>
                        <div class="column is-3-tablet is-4-mobile">
                            <strong>{{ i18n('Allocated To') }}</strong>
                        </div>
                        <div class="column is-9-tablet is-8-mobile px-2 is-flex is-vcentered">
                            <avatar :user="task.allocatedTo"
                                    class="is-32x32 m-0"/>
                            <span class="ml-2">
                               {{ task.allocatedTo.person.name }}
                            </span>
                        </div>
                        <div class="column is-3">
                            <strong>{{ i18n('Flag') }}</strong>
                        </div>
                        <div class="column is-9 px-2">
                           <span v-if="enums.flags._get(task.flag)"
                                 :class="`has-text-${enums.flags._get(task.flag).toLowerCase()}`"
                                 class="icon is-clickable">
                                <fa icon="flag"/>
                            </span>
                            <span v-else
                                  class="icon is-naked is-clickable is-small">
                                <fa icon="cog"
                                    size="xs"/>
                            </span>
                        </div>
                    </div>

                    <divider class="my-2"/>
                    <div class="my-6">
                        <h4 class="is-uppercase title is-6">
                            {{ i18n('Description') }}
                        </h4>
                        <p class="subtitle is-6 mt-5">
                            {{ task.description }}
                        </p>
                    </div>
                    <divider class="my-2"/>

                    <ChecklistItems :task="task"
                        @reload-task="fetch" />
                </div>
            </div>
            <div class="column">
                <Comments :id="task.id"
                          type="task" />
            </div>
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import {Avatar} from '@enso-ui/users';
import {FontAwesomeIcon as Fa} from '@fortawesome/vue-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faBell, faCog, faPlus, faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import cssClass from '../../modules/task';
import Divider from '@enso-ui/divider';
import ChecklistItems from './components/ChecklistItems.vue';
import Comments from './components/comments/Comments.vue';

library.add(faTimesCircle, faCog, faPlus, faBell);

export default {
    name: "Show",

    inject: [
        'errorHandler', 'http', 'toastr', 'route', 'i18n',
    ],

    components: {Avatar, Fa, Divider, ChecklistItems, Comments},

    data: () => ({
        task: null,
    }),

    computed: {
        ...mapState(['enums']),
    },

    created() {
        this.fetch();
    },

    methods: {
        fetch() {
            this.http.get(this.route(this.$route.name, this.$route.params.task))
            .then(response => (this.task = response.data.task))
            .catch(this.errorHandler);
        },
        cssClass(columnEnum, row) {
            return cssClass(columnEnum, row);
        },
        toggleMuted() {
            this.http.patch(this.route('tasks.update', this.$route.params.task),
                {muted: !this.task.muted})
            .then(response => {
                this.fetch()
                this.toastr.success(response.data.message);
            })
            .catch(this.errorHandler);
        }
    },
}
</script>

<style scoped>

</style>
