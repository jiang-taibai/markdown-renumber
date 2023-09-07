import {OtherSerialNumberStrategy, SerialNumberStrategy} from "@/assets/js/base/serial-number-strategy";
import {isBlankLineOrSingleLineCodeBlock, mdLinesToMd, mdToMdLines} from "@/assets/js/utils/md-line-utils";
import i18n from "@/i18n";

const getHandle = (handleType) => {
    switch (handleType) {
        case 'quote':
            return OtherSerialNumberStrategy.quote
        case 'original':
            return OtherSerialNumberStrategy.original
        case 'keepTitle':
            return OtherSerialNumberStrategy.keepTitle
        default:
            throw new Error(i18n.global.t('Processor.RenumberProcessor.UnknownHandleType', {type: handleType}))
    }
}

export const renumberTitle = (md, configuration) => {
    const lines = mdToMdLines(md)
    const {handles, strategyOfLevels} = configuration;

    const gt6Level = getHandle(handles.gt6Level)
    const unspecifiedLevel = getHandle(handles.unspecifiedLevel)

    // 初始化 strategyOfLevels，得到对象数组
    const strategyOfLevelsInstances = strategyOfLevels.map((strategyOfLevel) => {
        return new SerialNumberStrategy(
            strategyOfLevel.startIndex,
            strategyOfLevel.prefix,
            strategyOfLevel.suffix,
            strategyOfLevel.keepSuffixIfFinal,
            strategyOfLevel.independent,
            strategyOfLevel.serialNumberType,
            strategyOfLevel.customSerialNumberClass,
        )
    })
    // 用于存储每个级别的计数器
    const counters = [...Array(strategyOfLevelsInstances.length)].fill(0)
    const processedLines = []
    let inCodeBlock = false
    for (const line of lines) {
        let processedLine = line
        if (isBlankLineOrSingleLineCodeBlock(line)) {
            // 情况 1：空行和单行代码块
            // 不执行其他对行文本的操作，直接将原行添加到结果列表中
        } else if (line.trim().startsWith('```')) {
            // 情况 2：代码块开始或结束之处
            inCodeBlock = !inCodeBlock
            // 不执行其他对行文本的操作，直接将原行添加到结果列表中
        } else if (processedLine.startsWith('#') && !inCodeBlock) {
            const trimmedLine = line.trimStart()
            const match = trimmedLine.match(/^(#+) (.+)/)
            if (match && !inCodeBlock) {
                // 情况 3：标题
                const [hashes, title] = match.slice(1)
                const level = hashes.length
                if (level > 6) {
                    // 情况 3.1：标题的层级大于6
                    processedLine = gt6Level(hashes, title)
                } else if (level > strategyOfLevelsInstances.length) {
                    // 情况 3.2：标题的层级大于配置的层级
                    processedLine = unspecifiedLevel(hashes, title)
                } else {
                    // 情况 3.3：正常范围内的标题
                    // 整理计数器，例如当前标题的层级为3，那么就将计数器第3个+1，第4个及以后=0
                    counters[level - 1] += 1
                    for (let i = level; i < counters.length; i++) counters[i] = 0
                    processedLine = addSerialNumber(hashes, title, level, counters, strategyOfLevelsInstances)
                }
            }
        }
        processedLines.push(processedLine)
    }
    return mdLinesToMd(processedLines)
}

/**
 * 为标题添加序号
 * @param hashes    标题的前缀，例如 "#", "##", "###", ...
 * @param title     标题的内容
 * @param level     标题的层级，例如 hashes="###" 时，level=3
 * @param counters  每个层级的计数器
 * @param strategyOfLevelsInstances    每个层级的序号策略
 * @returns {string}    添加序号后的标题
 */
const addSerialNumber = (hashes, title, level, counters, strategyOfLevelsInstances) => {
    let serialNumber = ''
    for (let i = 0; i < level; i++) {
        const strategyOfLevelsInstance = strategyOfLevelsInstances[i]
        if (strategyOfLevelsInstance.independent) {
            serialNumber = ''
        }
        const currentSerialNumber = strategyOfLevelsInstance.serialNumberGetter.get(
            counters[i] + strategyOfLevelsInstance.startIndex - 1
        )
        if (i === level - 1 && !strategyOfLevelsInstance.keepSuffixIfFinal) {
            serialNumber = `${serialNumber}${strategyOfLevelsInstance.prefix}${currentSerialNumber}`
        } else {
            serialNumber = `${serialNumber}${strategyOfLevelsInstance.prefix}${currentSerialNumber}${strategyOfLevelsInstance.suffix}`
        }
    }
    return `${hashes} ${serialNumber} ${title}\n`
}


