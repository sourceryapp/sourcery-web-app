<script setup>
const props = defineProps(['organization'])
</script>

<template>
    <v-card width="100%" class="fill-height" variant="outlined">
        <v-card-text>
            <h1 class="mb-0">{{ organization.name }}</h1>
            <p class="text-muted mb-2">{{ organization.address || 'No Address Set' }}</p>
            <div class="d-flex justify-end">
                <v-menu transition="slide-y-transition">
                    <template v-slot:activator="{ props }">
                        <v-btn size="small" color="secondary" v-bind="props">Manage <v-icon>mdi-chevron-down</v-icon></v-btn>
                    </template>
                    <v-list>
                        <v-list-item :to="'/o/' + organization.id  + '/manage'" title="Manage Organization"></v-list-item>
                        <v-list-item :to="'/o/' + organization.id  + '/manage/users'" title="Manage Users"></v-list-item>
                    </v-list>
                </v-menu>
            </div>
        </v-card-text>
    </v-card>
</template>