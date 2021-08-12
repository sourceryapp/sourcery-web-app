<template>
  <v-alert
    :type="type"
  >
    {{ message }}
    <NuxtLink :to="to">
      {{ actionText }}
    </NuxtLink>
  </v-alert>
</template>

<script>
export default {
    props: {
        message: {
            type: String,
            required: true,
            default: 'This is the default message.'
        },
        to: {
            type: String,
            required: true,
            default: '/dashboard'
        },
        type: {
            type: String,
            default: 'warning'
        },
        actionText: {
            type: String,
            default: 'Go Home.'
        }
    }
}
</script>
