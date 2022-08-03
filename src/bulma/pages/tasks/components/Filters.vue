<template>
    <div class="columns is-centered is-multiline">
        <div class="column is-narrow is-one-fifth">
            <enso-select-filter class="box raises-on-hover"
                v-model="filters.tasks.allocated_to"
                source="administration.users.options"
                label="person.name"
                :name="i18n('Allocated To')"/>
        </div>
        <div class="column is-narrow flags-filter">
            <enso-filter class="box raises-on-hover"
                v-model="filters.tasks.flag"
                icons
                :options="flagOptions"
                :name="i18n('Importance')"/>
        </div>
        <div class="column is-narrow is-2">
            <enso-select-filter
                class="box raises-on-hover"
                v-model="filters.tasks.status"
                :options="enums.statuses._select()" 
                :name="i18n('Status')"/>
        </div>
        <div class="column is-narrow">
            <enso-filter class="box raises-on-hover"
                v-model="params.overdue"
                icons
                :options="overdueOptions"
                :name="i18n('Overdue')"/>
        </div>
    </div>
    <div class="columns is-centered">
        <div class="column is-narrow">
            <enso-date-filter 
                class="box raises-on-hover" 
                v-model:filter="params.dateFilter"
                v-model:interval="intervals.tasks.reminder"/>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import {
    BooleanFilter, EnsoDateFilter, EnsoFilter, EnsoSelectFilter,
} from '@enso-ui/filters/bulma';
import { faFlag, faExclamation } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { EnsoSelect } from '@enso-ui/select/bulma';


library.add(faFlag, faExclamation);

export default {
    name: 'Filters',

    components: {
        BooleanFilter, EnsoDateFilter, EnsoFilter, EnsoSelectFilter, EnsoSelect
    },

    inject: ['i18n'],

    props: {
        filters: {
            type: Object,
            required: true,
        },
        intervals: {
            type: Object,
            required: true,
        },
        params: {
            type: Object,
            required: true,
        },
    },

    data: () => ({
        overdueOptions: [
            { value: true, icon: 'exclamation', class: 'has-text-danger' },
        ],
    }),

    computed: {
        ...mapState(['enums']),
        flagOptions() {
            // eslint-disable-next-line no-underscore-dangle
            return this.enums.flags._keys().map(flag => ({
                icon: 'flag',
                value: flag * 1,
                // eslint-disable-next-line no-underscore-dangle
                class: `has-text-${this.enums.flags._get(flag).toLowerCase()}`,
            }));
        },

    },
};
</script>

<style lang="scss">
</style>
