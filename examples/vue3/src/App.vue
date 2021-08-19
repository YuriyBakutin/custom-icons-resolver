<template>
  <div
    style="color: brown; font-size: 100px;"
  >
    <span style="color: rgb(88, 88, 88); font-size: 60px; margin-right: 40px;">
      <custom-icon-cat-head />
    </span>
    <custom-icon-dog-head />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
})
</script>
