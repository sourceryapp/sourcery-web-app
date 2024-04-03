<template>
    <v-autocomplete
        variant="outlined"
        label="Search for or Enter New Repository"
        v-model="repository"
        :items="repositories"
        item-title="name"
        return-object
        clearable
        class="mb-2"
        @update:search="(v) => search = v"
        :menu-props="{ closeOnContentClick: true }"
    >
        <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" :title="item.raw.organization.name" :subtitle="item.raw.name"></v-list-item>
        </template>
        <template v-slot:prepend-item v-if="!disableCustom">
            <v-list-item @click="initializeNonPartnerInstitution">
                <v-list-item-title>Create New Repository: {{ search }}</v-list-item-title>
                <v-list-item-subtitle><em>Type to Add Repository; Select to Confirm</em></v-list-item-subtitle>
            </v-list-item>
        </template>
    </v-autocomplete>
</template>

<script setup>
const repository = defineModel()
const { repositories, fetchRepositories } = useFetchRepositories()
const emit = defineEmits(['customSelected'])
const props = defineProps(['disableCustom'])

const search = ref('')

function initializeNonPartnerInstitution() {
    if ( search.value ) {
        repository.value = null
        emit('customSelected', search.value)
    }
}

function isValid() {

}

await fetchRepositories()
</script>