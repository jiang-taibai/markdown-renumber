import {downloadFile} from "@/assets/js/utils/file-output";
import i18n from '@/i18n/index'

/**
 * 获取对象的类型，由于 typeof 无法区分数组和对象，所以使用 Object.prototype.toString.call(obj) 来获取对象的类型
 *
 * @param obj           待获取类型的对象
 * @returns {string}    对象的类型，如 '[object Object]'
 */
function getType(obj) {
    return Object.prototype.toString.call(obj);
}

/**
 * 检查配置文件对象的结构和类型是否符合标准
 *
 * @param standardObj   标准配置文件对象，只用于检查结构和类型，不用于检查值和数组长度等无关基本结构的属性
 * @param testObj       待检查的配置文件对象
 * @param path          待检查的配置文件对象的路径
 * @returns {{reason: string, match: boolean}|{reason: string, match: boolean}|{reason: string, match: boolean}|*|{reason: string, match: boolean}}
 */
function checkStructureAndType(standardObj, testObj, path = '') {
    const standardKeys = Object.keys(standardObj);
    const testKeys = Object.keys(testObj);

    if (standardKeys.length !== testKeys.length) {
        return {
            match: false,
            reason: i18n.global.t('ConfigIO.Parse.Error.KeyCountMismatch', {path: path}),
        };
    }

    for (const key of standardKeys) {
        if (!testObj.hasOwnProperty(key)) {
            return {
                match: false,
                reason: i18n.global.t('ConfigIO.Parse.Error.KeyNotExists', {path: `${path}.${key}`}),
            };
        }

        const standardType = getType(standardObj[key]);
        const testType = getType(testObj[key]);

        if (standardType !== testType) {
            return {
                match: false,
                reason: t('ConfigIO.Parse.Error.TypeMismatch', {
                    path: `${path}.${key}`,
                    standardType: standardType, testType: testType
                })
            };
        }

        if (standardType === '[object Object]' && standardObj[key] !== null && testObj[key] !== null) {
            const result = checkStructureAndType(standardObj[key], testObj[key], `${path}.${key}`);
            if (!result.match) {
                return result;
            }
        }
    }

    return {
        match: true,
        reason: ''
    };
}

/**
 * 解析配置文件对象，兼容不同版本
 *
 * @param obj   待解析的配置文件对象
 * @returns {{configuration: *, version, sample: *}}
 */
export const parseConfiguration = (obj) => {
    if (!obj.version) {
        throw new Error(i18n.global.t('ConfigIO.Parse.Error.VersionNotSpecified'))
    }
    if ('1.0.0' <= obj.version && obj.version <= '1.0.0') {
        const standardConfiguration = {
            version: '1.0.0',
            configuration: {
                remove: {
                    serialNumberRegexes: []
                },
                renumber: {
                    handles: {
                        unspecifiedLevel: '',
                        gt6Level: '',
                    },
                    strategyOfLevels: []
                }
            },
            sample: {
                testTitles: [],
                testMarkdownText: '',
            },
        }
        const checkResult = checkStructureAndType(standardConfiguration, obj, 'ImportedConfigurationFile')
        if (!checkResult.match) {
            throw new Error(checkResult.reason)
        }
        return {
            version: obj.version,
            configuration: obj.configuration,
            sample: obj.sample,
        }
    } else {
        throw new Error(i18n.global.t('ConfigIO.Parse.Error.VersionNotSupported'))
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