<script>
// 第三方库
import {defineComponent, reactive, ref, watch, markRaw, onMounted} from "vue";
import {
  NButton, NDynamicInput, NInput, NSelect, NInputNumber, NCheckbox, NSwitch,
  NRadioGroup, NRadio, NRadioButton, useNotification,
} from "naive-ui";
import {useI18n} from "vue-i18n";

// 默认数据
import {defaultRenumberConfiguration, defaultTestMarkdownText} from "@/assets/js/data/default";

// 自定义组件
import MarkdownEditorAndPreview from "@/components/public/MarkdownEditorAndPreviewComponent.vue";

// 自定义脚本
import {AvailableSerialNumberTypes} from "@/assets/js/base/serial-number";
import {renumberTitle} from '@/assets/js/processor/subprocessor/renumber-processor'
import {deepClone} from "@/assets/js/utils/deep-clone";

export default defineComponent({
  components: {
    MarkdownEditorAndPreview,
    NDynamicInput, NInput, NButton, NSelect, NInputNumber, NCheckbox,
    NRadioGroup, NRadio, NRadioButton, NSwitch,
  },
  props: {
    renumberConfiguration: {
      type: Object,
      required: true,
    },
    testMarkdownText: {
      type: String,
      required: true,
    }
  },
  emits: ['update:renumberConfiguration'],
  setup(props, context) {
    // 注册组件
    const {t} = useI18n()
    const notification = useNotification()

    // 定义数据
    const localRenumberConfiguration = reactive(deepClone(props.renumberConfiguration))
    const localTestMarkdownText = ref('')
    localTestMarkdownText.value = props.testMarkdownText
    const processedMarkdownText = ref('')
    // 定义常量
    const serialNumberOptions = markRaw([
      {
        label: '123', value: 'NUMBER',
      }, {
        label: 'abc', value: 'ALPHABET_LOWER_CASE',
      }, {
        label: 'ABC', value: 'ALPHABET_UPPER_CASE',
      }, {
        label: 'iii', value: 'ROMAN_LOWER_CASE',
      }, {
        label: 'III', value: 'ROMAN_UPPER_CASE',
      }, {
        label: '〇一二', value: 'CHINESE_LOWER_CASE',
      }, {
        label: '零壹贰', value: 'CHINESE_UPPER_CASE',
      },])
    const handleOptions = [
      {
        i18NKeyOfLabel: 'RenumberSettingTab.HandleOptionLabel.Quote',
        value: 'quote',
      }, {
        i18NKeyOfLabel: 'RenumberSettingTab.HandleOptionLabel.Original',
        value: 'original',
      }, {
        i18NKeyOfLabel: 'RenumberSettingTab.HandleOptionLabel.KeepTitle',
        value: 'keepTitle',
      },
    ]

    // 测试配置
    const testConfiguration = () => {
      try {
        processedMarkdownText.value = renumberTitle(localTestMarkdownText.value, localRenumberConfiguration)
      } catch (e) {
        notification.warning({
          title: t('RenumberSettingTab.TestConfig.Notification.Title'),
          content: t('RenumberSettingTab.TestConfig.Notification.Content', {msg: e.message}),
          duration: 5000,
          keepAliveOnHover: true,
        })
        processedMarkdownText.value = t('RenumberSettingTab.TestConfig.OutputToMarkdownPreview', {msg: e.message})
      }
    }

    // 用于 Toolbar 恢复本页默认
    const onRestore = () => {
      localRenumberConfiguration.handles = deepClone(defaultRenumberConfiguration.handles)
      localRenumberConfiguration.strategyOfLevels = deepClone(defaultRenumberConfiguration.strategyOfLevels)
      localTestMarkdownText.value = defaultTestMarkdownText
    }

    // 用于 NDynamicInput 的创建新项
    const onCreateNewRenumberConfiguration = () => {
      return {
        startIndex: 1,
        prefix: '',
        suffix: '.',
        keepSuffixIfFinal: false,
        independent: false,
        serialNumberType: AvailableSerialNumberTypes.NUMBER,
        customSerialNumberClass: null,
      }
    }

    // 监听数据变化，实现双向绑定
    watch(localRenumberConfiguration, () => {
      context.emit('update:renumberConfiguration', localRenumberConfiguration);
      testConfiguration()
    });

    // 初试时首先测试一次，以便显示默认的测试结果
    onMounted(() => {
      testConfiguration()
    })
    return {
      t,
      onRestore, onCreateNewRenumberConfiguration,
      localRenumberConfiguration, processedMarkdownText, localTestMarkdownText,
      serialNumberOptions, handleOptions,
    }
  },
})
</script>

<template>
  <div>
    <div class="main">
      <div class="container">
        <div class="toolbar">
          <n-button @click="onRestore">{{ t('RenumberSettingTab.Toolbar.Restore') }}</n-button>
        </div>
        <div class="setting-area">
          <div class="handle-setting-list">
            <div class="handle-setting-item">
              <div class="handle-setting-title">{{ t('RenumberSettingTab.SettingArea.Title.Handle.Unspecified') }}</div>
              <div class="handle-setting-content">
                <n-radio-group v-model:value="localRenumberConfiguration.handles.unspecifiedLevel"
                               name="unspecifiedLevelRadioGroup">
                  <n-radio-button v-for="handleOption in handleOptions" :key="handleOption.value"
                                  :value="handleOption.value">
                    {{ t(handleOption.i18NKeyOfLabel) }}
                  </n-radio-button>
                </n-radio-group>
              </div>
            </div>
            <div class="handle-setting-item">
              <div class="handle-setting-title">{{ t('RenumberSettingTab.SettingArea.Title.Handle.GE6') }}</div>
              <div class="handle-setting-content">
                <n-radio-group v-model:value="localRenumberConfiguration.handles.gt6Level" name="gt6LevelRadioGroup">
                  <n-radio-button v-for="handleOption in handleOptions"
                                  :key="handleOption.value" :value="handleOption.value">
                    {{ t(handleOption.i18NKeyOfLabel) }}
                  </n-radio-button>
                </n-radio-group>
              </div>
            </div>
          </div>
          <div class="strategy-setting">
            <div class="row" style="margin-bottom: 8px">
              <div class="column-index"></div>
              <div class="column-type">{{ t('RenumberSettingTab.SettingArea.Title.Strategy.Type') }}</div>
              <div class="column-start">{{ t('RenumberSettingTab.SettingArea.Title.Strategy.StartIndex') }}</div>
              <div class="column-prefix">{{ t('RenumberSettingTab.SettingArea.Title.Strategy.Prefix') }}</div>
              <div class="column-suffix">{{ t('RenumberSettingTab.SettingArea.Title.Strategy.Suffix') }}</div>
              <div class="column-keep-last-suffix">{{
                  t('RenumberSettingTab.SettingArea.Title.Strategy.KeepLastSuffix')
                }}
              </div>
              <div class="column-independent">{{ t('RenumberSettingTab.SettingArea.Title.Strategy.Independent') }}</div>
            </div>
            <n-dynamic-input v-model:value="localRenumberConfiguration.strategyOfLevels"
                             :on-create="onCreateNewRenumberConfiguration" :min="1" :max="6">
              <template #default="{ value, index }">
                <div class="row">
                  <div class="column-index">
                    {{ t('RenumberSettingTab.SettingArea.Title.Strategy.RowTitle', {index: index + 1}) }}
                  </div>
                  <n-select class="column-type" v-model:value="value.serialNumberType" :options="serialNumberOptions"/>
                  <n-input-number class="column-start" v-model:value="value.startIndex" button-placement="both"/>
                  <n-input class="column-prefix" v-model:value="value.prefix"
                           type="text" :placeholder="t('RenumberSettingTab.SettingArea.Placeholder.Prefix')"/>
                  <n-input class="column-suffix" v-model:value="value.suffix"
                           type="text" :placeholder="t('RenumberSettingTab.SettingArea.Placeholder.Suffix')"/>
                  <n-switch class="column-keep-last-suffix" v-model:value="value.keepSuffixIfFinal"/>
                  <n-switch class="column-independent" v-model:value="value.independent"/>
                </div>
              </template>
            </n-dynamic-input>
          </div>
        </div>
        <div class="preview-area">
          <div class="markdowns">
            <markdown-editor-and-preview
                class="markdown-input" v-model:md="localTestMarkdownText" height="350px" :show-toolbar="true"/>
            <markdown-editor-and-preview
                class="markdown-output" v-model:md="processedMarkdownText" height="350px" :show-toolbar="false"/>
          </div>
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

    .title {
      font-size: 18px;
      margin-bottom: 8px;
    }

    .setting-area {
      .handle-setting-list,
      .strategy-setting {
        background-color: #FFFFFF;
        border-radius: 8px;
        padding: 20px;
      }

      .handle-setting-list {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 8px;
        margin-bottom: 8px;

        .handle-setting-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          gap: 8px;

          .handle-setting-title {
            min-width: 100px;
            margin-right: 8px;
          }
        }

      }

      .strategy-setting {
        .row {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          text-align: center;
          gap: 4px;

          .column-index,
          .column-type,
          .column-start,
          .column-prefix,
          .column-suffix {
            width: 100px;
          }

          .column-keep-last-suffix,
          .column-independent {
            width: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
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

    .preview-area {
      @markdowns-gap: 8px;

      .markdowns {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: @markdowns-gap;

        .markdown-input,
        .markdown-output {
          width: calc(50% - @markdowns-gap / 2);
        }
      }
    }
  }
}
</style>