import zhCN from './zh_CN.json'
import zhTW from './zh_TW.json'
import enUS from './en_US.json'

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