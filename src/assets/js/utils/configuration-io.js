import {downloadFile} from "@/assets/js/utils/file-output";
import defaultConfig_v1 from "@/assets/js/data/default-v1"
import i18n from '@/i18n'

/**
 * 获取对象的类型，由于 typeof 无法区分数组和对象，所以使用 Object.prototype.toString.call(obj) 来获取对象的类型
 *
 * @param obj           待获取类型的对象
 * @returns {string}    对象的类型，如 '[object Object]'
 */
function getType(obj) {
    return Object.prototype.toString.call(obj);
}

function deepMerge(defaultConfig, userConfig) {
    // 首先将当前层级的默认配置复制到结果对象中
    const result = {
        success: true,
        config: {...defaultConfig},
        message: '',
    };
    for (const key in userConfig) {
        const defaultConfigKeyType = getType(defaultConfig[key]);
        const userConfigKeyType = getType(userConfig[key]);
        if (userConfigKeyType === '[object Object]' && userConfig[key] !== null && defaultConfig.hasOwnProperty(key)) {
            // 如果是对象，则递归合并
            const nextResult = deepMerge(defaultConfig[key], userConfig[key]);
            if (nextResult.success) {
                result.config[key] = nextResult.config;
            } else {
                result.success = false;
                result.message = nextResult.message;
                return result;
            }
        } else if (userConfigKeyType === defaultConfigKeyType) {
            // 同版本策略：用户配置覆盖默认配置
            result.config[key] = userConfig[key];
        } else if (defaultConfigKeyType === '[object Undefined]' || defaultConfigKeyType === '[object Null]') {
            // 高版本用户配置兼容低版本默认配置策略：由于用不到高版本用户配置，所以无需赋值
        } else {
            // 类型不匹配
            result.success = false;
            result.message = i18n.global.t('ConfigIO.DeepMerge.TypeError', {
                field: key,
                userType: userConfigKeyType,
                defaultType: defaultConfigKeyType,
            })
            return result;
        }
    }
    return result;
}

/**
 * 解析配置文件对象，兼容不同版本
 *
 * @param userConfig   待解析的配置文件对象
 * @returns {{configuration: *, version, sample: *}}
 */
export const parseConfiguration = (userConfig) => {
    if (!userConfig.version) {
        throw new Error(i18n.global.t('ConfigIO.Parse.Error.VersionNotSpecified'))
    }
    if ('1.0' <= userConfig.version && userConfig.version < '2.0') {
        const defaultConfig = {
            version: userConfig.version,
            configuration: {
                remove: {
                    serialNumberRegexes: defaultConfig_v1.defaultConfiguration.remove.serialNumberRegexes
                },
                renumber: {
                    handles: {
                        unspecifiedLevel: defaultConfig_v1.defaultConfiguration.renumber.handles.unspecifiedLevel,
                        gt6Level: defaultConfig_v1.defaultConfiguration.renumber.handles.gt6Level,
                    },
                    strategyOfLevels: defaultConfig_v1.defaultConfiguration.renumber.strategyOfLevels
                }
            },
            sample: {
                testTitles: defaultConfig_v1.defaultTestTitles,
                testMarkdownText: defaultConfig_v1.defaultTestMarkdownText,
            },
        }
        const result = deepMerge(defaultConfig, userConfig)
        if (!result.success) {
            throw new Error(result.message)
        }
        return {
            version: userConfig.version,
            configuration: result.config.configuration,
            sample: result.config.sample,
        }
    } else {
        throw new Error(i18n.global.t('ConfigIO.Parse.Error.VersionNotSupported', {version: userConfig.version}))
    }
}

/**
 * 输出配置文件
 *
 * @param configuration
 */
export const exportConfiguration = (configuration) => {
    return new Promise((resolve, reject) => {
        try {
            const timestamp = Date.now()
            downloadFile(JSON.stringify(configuration, null, 2), `config-${timestamp}`, "json")
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}