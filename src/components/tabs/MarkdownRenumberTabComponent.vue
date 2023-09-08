<script>
// 第三方库
import {
  NButton, NScrollbar, NCode, NButtonGroup, useNotification
} from "naive-ui";
import {defineComponent, ref, watch, watchEffect} from "vue";
import {useI18n} from "vue-i18n";

// 自定义组件
import MarkdownEditorAndPreview from "@/components/public/MarkdownEditorAndPreviewComponent.vue";

// 自定义脚本
import {downloadFile} from "@/assets/js/utils/file-output";
import {processor} from "@/assets/js/processor/processor";

export default defineComponent({
  name: 'MarkdownRenumberComponent',
  components: {
    MarkdownEditorAndPreview,
    NButton, NScrollbar, NCode, NButtonGroup
  },
  props: {
    configuration: {
      type: Object,
      required: true,
      validator: (obj) => 'remove' in obj && 'renumber' in obj
    },
    inputMarkdownText: {
      type: String,
      default: '',
      required: false,
    },
  },
  emits: ['update:inputMarkdownText', 'onExportConfiguration', 'onImportConfiguration'],
  setup(props, {emit}) {
    // 注册组件
    const notification = useNotification()
    const {t} = useI18n()

    // 定义数据
    const inputMarkdownText = ref(props.inputMarkdownText)
    const outputMarkdownText = ref('')

    // 定义方法
    // 上传回调方法
    const handleMarkdownUpload = (event) => {
      const file = event.target.files[0];
      // 确保文件存在并且后缀为 .md
      if (file && file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          inputMarkdownText.value = e.target.result
          emit('update:input-markdown-text', inputMarkdownText.value);
          notification.success({
            title: t('RenumberTab.UploadMarkdown.Success.Title'),
            content: t('RenumberTab.UploadMarkdown.Success.Content'),
            duration: 3000,
            keepAliveOnHover: true,
          })
          processMarkdown()
        };
        reader.readAsText(file);
      } else {
        notification.error({
          title: t('RenumberTab.UploadMarkdown.Fail.Title'),
          content: t('RenumberTab.UploadMarkdown.Fail.Content'),
          duration: 5000,
          keepAliveOnHover: true,
        })
      }
    }
    const handleConfigUpload = (event) => {
      const file = event.target.files[0];
      // 确保文件存在并且后缀为 .json
      if (file && file.name.endsWith('.json')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const configContent = e.target.result
          emit('onImportConfiguration', configContent);
        };
        reader.readAsText(file);
      } else {
        notification.error({
          title: t('RenumberTab.UploadConfig.Fail.Title'),
          content: t('RenumberTab.UploadConfig.Fail.Content'),
          duration: 5000,
          keepAliveOnHover: true,
        })
      }
    }

    // 执行 Markdown 文本重排
    const processMarkdown = () => {
      try {
        outputMarkdownText.value = processor(inputMarkdownText.value, props.configuration)

        notification.success({
          title: t('RenumberTab.ProcessMarkdown.Success.Title'),
          content: t('RenumberTab.ProcessMarkdown.Success.Content'),
          duration: 3000,
          keepAliveOnHover: true,
        })
      } catch (e) {
        notification.error({
          title: t('RenumberTab.ProcessMarkdown.Fail.Title'),
          content: t('RenumberTab.ProcessMarkdown.Fail.Content', {msg: e.message}),
          duration: 5000,
          keepAliveOnHover: true,
        })
        outputMarkdownText.value = t('RenumberTab.ProcessMarkdown.Fail.OutputToMarkdownPreview', {msg: e.message})
      }
    }
    // 复制处理结果
    const onCopy = () => {
      navigator.clipboard.writeText(outputMarkdownText.value).then(() => {
        notification.success({
          title: t('RenumberTab.CopyProcessed.Success.Title'),
          content: t('RenumberTab.CopyProcessed.Success.Content'),
          duration: 3000,
          keepAliveOnHover: true,
        })
      }).catch(err => {
        notification.error({
          title: '复制失败',
          content: '复制失败，错误原因：' + err,
          duration: 5000,
          keepAliveOnHover: true,
        })
      });
    }
    const onDownloadProcessResult = () => {
      const timestamp = Date.now()
      downloadFile(outputMarkdownText.value, `result-${timestamp}`, "md")
    }
    const onExportConfiguration = () => {
      emit("onExportConfiguration")
    }

    // 监听输入 Markdown 文本的变化
    watchEffect(() => {
      inputMarkdownText.value = props.inputMarkdownText;
    });
    watch(inputMarkdownText, () => {
      emit('update:inputMarkdownText', inputMarkdownText.value);
    })
    return {
      t,
      inputMarkdownText, outputMarkdownText,
      handleMarkdownUpload, handleConfigUpload, processMarkdown,
      onCopy, onDownloadProcessResult, onExportConfiguration,
    }
  }
})
</script>

<template>
  <div class="main">
    <div class="toolbar">
      <n-button @click="$refs['markdown-uploader'].click()">{{ t('RenumberTab.Toolbar.ImportMarkdown') }}</n-button>
      <n-button @click="processMarkdown">{{ t('RenumberTab.Toolbar.StartRenumber') }}</n-button>

      <n-button-group>
        <n-button @click="onCopy">{{ t('RenumberTab.Toolbar.CopyProcessedResult') }}</n-button>
        <n-button @click="onDownloadProcessResult">{{ t('RenumberTab.Toolbar.DownloadProcessedResult') }}</n-button>
      </n-button-group>

      <n-button-group>
        <n-button @click="$refs['configuration-uploader'].click()">
          {{ t('RenumberTab.Toolbar.ImportConfig') }}
        </n-button>
        <n-button @click="onExportConfiguration">{{ t('RenumberTab.Toolbar.ExportConfig') }}</n-button>
      </n-button-group>
      <input ref="markdown-uploader" type="file" id="fileInput"
             accept=".md" @change="handleMarkdownUpload"
             style="display: none">
      <input ref="configuration-uploader" type="file" id="fileInput"
             accept=".json" @change="handleConfigUpload"
             style="display: none">
    </div>
    <div class="markdowns">
      <markdown-editor-and-preview class="markdown-item" v-model:md="inputMarkdownText"/>
      <markdown-editor-and-preview class="markdown-item" v-model:md="outputMarkdownText"/>
    </div>
  </div>
</template>

<style scoped lang="less">
.main {
  .toolbar {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 8px;
  }

  @markdown-gap: 8px;

  .markdowns {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: @markdown-gap;
    margin-top: 8px;

    .markdown-item {
      width: calc(50% - @markdown-gap / 2);
      flex-shrink: 0;
    }
  }
}

</style>