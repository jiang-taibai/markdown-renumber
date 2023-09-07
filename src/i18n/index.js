import zhCN from './zh_CN.json5'
import zhTW from './zh_TW.json5'
import enUS from './en_US.json5'

import {createI18n} from 'vue-i18n';

const i18n = createI18n({
    legacy: false,
    locale: 'zh-CN',
    fallbackLocale: 'en-US',
    messages: {
        'zh-CN': zhCN,
        'zh-TW': zhTW,
        'en-US': enUS,
    },
});

export default i18n;