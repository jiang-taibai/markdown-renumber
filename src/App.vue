<template>
  <n-config-provider :hljs="hljs">
    <n-notification-provider>
      <demo-view/>
    </n-notification-provider>
  </n-config-provider>
</template>

<script setup>
import TestScriptView from "@/views/TestScriptView.vue";
import {NConfigProvider, NNotificationProvider} from "naive-ui";
import hljs from 'highlight.js/lib/core'
import markdown from 'highlight.js/lib/languages/markdown'
import DemoView from "@/views/MainView.vue";

hljs.registerLanguage('markdown', markdown)

</script>

<style>

</style>
