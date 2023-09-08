<script setup>
// 第三方库
import {
  NTabs, NTabPane, useNotification
} from "naive-ui";
import {reactive, ref, toRaw, watch, onMounted} from "vue";
import {useI18n} from "vue-i18n";

// 自定义组件
import MarkdownRenumberComponent from "@/components/tabs/MarkdownRenumberTabComponent.vue";
import RemoveSettingComponent from "@/components/tabs/RemoveSettingTabComponent.vue";
import RenumberSettingComponent from "@/components/tabs/RenumberSettingTabComponent.vue";
import HelpComponent from "@/components/tabs/HelpTabComponent.vue";
import I18NComponent from "@/components/top-toolbar/I18NComponent.vue";

// 自定义脚本
import {
  defaultInputMarkdownText, defaultConfiguration,
  defaultTestMarkdownText, defaultTestTitles,
} from "@/assets/js/data/default";
import {exportConfiguration, parseConfiguration} from "@/assets/js/utils/configuration-io";
import {deepClone} from "@/assets/js/utils/deep-clone";
import LinkComponent from "@/components/top-toolbar/LinkComponent.vue";

// 注册组件
const {t} = useI18n()
const notification = useNotification()

// 定义数据
const demoMarkdownText = ref(defaultInputMarkdownText)
const demoConfiguration = ref(deepClone(defaultConfiguration))
const demoTestTitles = ref(defaultTestTitles)
const demoTestMarkdownText = ref(defaultTestMarkdownText)

const integrateConfiguration = () => {
  return {
    version: '1.0.0',
    configuration: demoConfiguration.value,
    sample: {
      testTitles: demoTestTitles.value,
      testMarkdownText: demoTestMarkdownText.value,
    }
  }
}

const onExportConfiguration = () => {
  exportConfiguration(integrateConfiguration()).then(() => {
    notification.success({
      title: t('ConfigIO.Export.Notification.Success.Title'),
      content: t('ConfigIO.Export.Notification.Success.Content'),
      duration: 3000,
      keepAliveOnHover: true,
    })
  }).catch((e) => {
    notification.error({
      title: t('ConfigIO.Export.Notification.Error.Title'),
      content: t('ConfigIO.Export.Notification.Error.Content', {msg: e.message}),
      duration: 5000,
      keepAliveOnHover: true,
    })
  })
}
const onImportConfiguration = (configContent) => {
  try {
    const configContentObject = JSON.parse(configContent)
    const parsedConfig = parseConfiguration(configContentObject)
    demoConfiguration.value.remove = parsedConfig.configuration.remove
    demoConfiguration.value.renumber = parsedConfig.configuration.renumber
    demoTestTitles.value = parsedConfig.sample.testTitles
    demoTestMarkdownText.value = parsedConfig.sample.testMarkdownText
    notification.success({
      title: t('ConfigIO.Import.Notification.Success.Title'),
      content: t('ConfigIO.Import.Notification.Success.Content'),
      duration: 3000,
      keepAliveOnHover: true,
    })
  } catch (e) {
    notification.error({
      title: t('ConfigIO.Import.Notification.Error.Title'),
      content: t('ConfigIO.Import.Notification.Error.Content', {msg: e.message}),
      duration: 5000,
      keepAliveOnHover: true,
    })
  }
}

// 监听数据变化，实时保存到 localStorage
watch(
    [demoConfiguration, demoTestTitles, demoTestMarkdownText],
    () => {
      localStorage.setItem('integrateConfiguration', JSON.stringify(integrateConfiguration()));
    },
    {deep: true}
);
onMounted(() => {
  const storedConfiguration = localStorage.getItem('integrateConfiguration');
  if (storedConfiguration) {
    try {
      const configContentObject = JSON.parse(storedConfiguration)
      const parsedConfig = parseConfiguration(configContentObject)
      demoConfiguration.value.remove = parsedConfig.configuration.remove
      demoConfiguration.value.renumber = parsedConfig.configuration.renumber
      demoTestTitles.value = parsedConfig.sample.testTitles
      demoTestMarkdownText.value = parsedConfig.sample.testMarkdownText
    } catch (e) {
      console.error(e)
    }
  }
});
</script>

<template>
  <div class="main">
    <div class="container">
      <div class="top-toolbar">
        <i18-n-component @on-locale-change="$refs['tabs'].syncBarPosition()"/>
        <link-component/>
      </div>
      <n-tabs ref="tabs" type="line" animated>
        <n-tab-pane name="renumber" :tab="t('MainView.TabTitle.Renumber')">
          <markdown-renumber-component v-model:configuration="demoConfiguration"
                                       v-model:input-markdown-text="demoMarkdownText"
                                       @on-export-configuration="onExportConfiguration"
                                       @on-import-configuration="onImportConfiguration"/>
        </n-tab-pane>
        <n-tab-pane name="remove-setting" :tab="t('MainView.TabTitle.RemoveSetting')">
          <remove-setting-component v-model:remove-configuration="demoConfiguration.remove"
                                    v-model:test-titles="demoTestTitles"/>
        </n-tab-pane>
        <n-tab-pane name="renumber-setting" :tab="t('MainView.TabTitle.RenumberSetting')">
          <renumber-setting-component v-model:renumber-configuration="demoConfiguration.renumber"
                                      v-model:test-markdown-text="demoTestMarkdownText"/>
        </n-tab-pane>
        <n-tab-pane name="help" :tab="t('MainView.TabTitle.Help')">
          <help-component/>
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<style scoped lang="less">
.main {

  .container {
    margin: 30px auto;
    max-width: 1200px;
    min-width: 700px;
    padding: 0 16px;

    .top-toolbar {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
  }
}
</style>