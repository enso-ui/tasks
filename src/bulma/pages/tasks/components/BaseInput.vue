<template>
    <div class="column is-4">
        <p class="control has-icons-left has-icons-right">
            <input
                v-model="checklist"
                class="input"
                placeholder="Add a checklist"
                @keypress.enter="add"
            >
            <span class="icon is-small is-left mauto">
              <avatar :user="task.allocatedTo"
                      class="is-32x32"/>
            </span>
        </p>
    </div>
</template>

<script>
import {Avatar} from '@enso-ui/users';

export default {
    name: "BaseInput",

    components: {Avatar},
}
</script>

<style scoped>
input::placeholder {
    padding-left: 1rem;
}
</style>