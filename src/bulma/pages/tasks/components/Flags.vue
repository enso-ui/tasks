<template>
    <div class="flags">
        <div class="vue-filter">
            <div class="tabs-wrapper">
                <div class="tabs is-toggle is-fullwidth filter-tabs">
                    <ul>
                        <li v-for="(flag, id) in enums.flags._all()"
                            :key="id"
                            :class="{ 'is-active': id === `${modelValue}` }">
                            <a @click="$emit('update:modelValue', id)">
                                <span class="icon"
                                    :class="`has-text-${flag.toLowerCase()}`">
                                    <fa :icon="faFlag"/>
                                </span>
                            </a>
                        </li>
                        <li :class="{ 'is-active': !modelValue }">
                            <a @click="$emit('update:modelValue', null)">
                                <span class="icon has-text-black">
                                    <fa :icon="faXmark"/>
                                </span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useStore } from '../../../utils/pinia';
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';
import { faFlag, faXmark } from '@fortawesome/free-solid-svg-icons';

export default {
    name: 'Flags',

    components: { Fa },

    data: () => ({
        faFlag,
        faXmark,
    }),

    props: {
        modelValue: {
            type: [Number, String],
            required: false,
            default: null,
        },
    },

    emits: ['update:modelValue'],

    computed: {
        enums() {
            return useStore('enums').enums;
        },
    },
};
</script>
<style lang="scss">
.flags {
    .tabs-wrapper {
        padding: 0;
    }
}
</style>
