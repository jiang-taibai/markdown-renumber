<script>
// 第三方库
import {
  NDynamicInput, NInput, NButton, useNotification
} from "naive-ui";
import {defineComponent, reactive, ref, watch} from "vue";
import {useI18n} from "vue-i18n";

// 默认数据
import {defaultTestTitles, defaultRemoveConfiguration} from "@/assets/js/data/default";

// 自定义脚本
import {testRemoveSerialNumber} from "@/assets/js/processor/subprocessor/remove-serial-number-processor";
import {deepClone} from "@/assets/js/utils/deep-clone";

export default defineComponent({
  name: 'RemoveSettingComponent',
  components: {NDynamicInput, NInput, NButton},
  props: {
    removeConfiguration: {
      type: Object,
      required: true,
      validator: (obj) => 'serialNumberRegexes' in obj
    },
    testTitles: {
      type: Array,
      required: true,
    }
  },
  emits: ['update:removeConfiguration', "update:testTitles"],
  setup(props, context) {
    // 注册组件
    const {t} = useI18n()
    const notification = useNotification()

    // 定义数据
    const localRemoveConfiguration = ref(deepClone(props.removeConfiguration));
    const checkRegex = (regex) => {
      try {
        new RegExp(regex)
        return true
      } catch (e) {
        return false
      }
    }
    const serialNumberRegexesValid = ref(localRemoveConfiguration.value.serialNumberRegexes.map((item) => checkRegex(item)))
    const localTestTitles = ref([...props.testTitles])

    // 配合 NDynamicInput 使用创建一个新的测试标题
    const onCreateNewTestTitle = () => {
      return ''
    }

    // 测试一个标题行<br/>
    // 作为 测试数据的 NDynamicInput 中计算测试结果的值<br/>
    // 支持的双向绑定情况：<br/>
    // 1. 如果修改正则表达式，会重新计算 所有 测试结果<br/>
    // 2. 如果修改测试标题，仅会修改 相对应 的测试结果<br/>
    const testOneTitleLine = (titleLine) => {
      for (const index in serialNumberRegexesValid.value) {
        if (!serialNumberRegexesValid.value[index]) {
          return t('RemoveSettingTab.TestOneTitleLine.InvalidRegex', {regex: localRemoveConfiguration.value.serialNumberRegexes[index]})
        }
      }
      try {
        return testRemoveSerialNumber(titleLine, localRemoveConfiguration.value.serialNumberRegexes)
      } catch (e) {
        notification.warning({
          title: t('RemoveSettingTab.TestOneTitleLine.Notification.Title'),
          content: t('RemoveSettingTab.TestOneTitleLine.Notification.Content', {msg: e.message}),
          duration: 5000,
          keepAliveOnHover: true,
        })
        return t('RemoveSettingTab.TestOneTitleLine.TestFailedOutput', {msg: e.message})
      }
    };

    // Toolbar功能函数：恢复本页默认
    const onRestore = () => {
      localRemoveConfiguration.value.serialNumberRegexes = deepClone(defaultRemoveConfiguration.serialNumberRegexes)
      localTestTitles.value = defaultTestTitles
    }

    // 监听数据变化，实现双向绑定
    watch(localRemoveConfiguration, () => {
      context.emit('update:removeConfiguration', localRemoveConfiguration.value);
    }, {deep: true});
    watch(localTestTitles, () => {
      context.emit('update:testTitles', localTestTitles.value);
    }, {deep: true});
    return {
      t,
      localTestTitles,
      localRemoveConfiguration, serialNumberRegexesValid,
      onCreateNewTestTitle, onRestore, testOneTitleLine, checkRegex,
    }
  }
})

</script>

<template>
  <div>
    <div class="main">
      <div class="container">
        <div class="toolbar">
          <n-button @click="onRestore">{{ t('RemoveSettingTab.Toolbar.Restore') }}</n-button>
        </div>
        <div class="setting-area">
          <n-dynamic-input v-model:value="localRemoveConfiguration.serialNumberRegexes">
            <template #default="{ index }">
              <div style="width: 100%">
                <n-input :placeholder="t('RemoveSettingTab.SettingArea.InputPlaceholder')" type="textarea"
                         v-model:value="localRemoveConfiguration.serialNumberRegexes[index]"
                         :status="serialNumberRegexesValid[index] ? 'success' : 'error'"
                         :on-input="() => serialNumberRegexesValid[index] = checkRegex(localRemoveConfiguration.serialNumberRegexes[index])"
                         :autosize="{minRows: 1, maxRows: 3}"/>
              </div>
            </template>
          </n-dynamic-input>
        </div>
        <div class="preview-area">
          <n-dynamic-input v-model:value="localTestTitles" :on-create="onCreateNewTestTitle">
            <template #default="{ index }">
              <div class="test-item">
                <n-input class="test-input" v-model:value="localTestTitles[index]" style="margin-right: 12px;"
                         :placeholder="t('RemoveSettingTab.PreviewArea.InputPlaceholder')"/>
                <div class="test-symbol">=></div>
                <div class="test-output">{{ testOneTitleLine(localTestTitles[index]) }}</div>
              </div>
            </template>
          </n-dynamic-input>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.main {

  @area-gap: 8px;

  .container {
    display: flex;
    flex-direction: column;
    gap: @area-gap;

    .setting-area, .preview-area {
      background-color: #FFFFFF;
      border-radius: 8px;
      padding: 20px;

      .title {
        font-size: 18px;
        margin-bottom: 8px;
      }
    }

    .preview-area {
      @test-item-gap: 8px;
      @test-symbol-width: 24px;

      .test-item {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: center;
        gap: @test-item-gap;

        .test-input {
          width: calc(50% - @test-item-gap / 2 - @test-symbol-width / 2);
        }

        .test-symbol {
          width: @test-symbol-width;
        }

        .test-output {
          width: calc(50% - @test-item-gap / 2 - @test-symbol-width / 2);
        }
      }
    }

    .toolbar {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 8px;
    }
  }
}
</style>