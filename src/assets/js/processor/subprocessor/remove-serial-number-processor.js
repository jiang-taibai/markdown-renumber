import {isBlankLineOrSingleLineCodeBlock, mdLinesToMd, mdToMdLines} from "@/assets/js/utils/md-line-utils";
import i18n from "@/i18n";

export const removeSerialNumberProcessor = (md, configuration) => {
    const lines = mdToMdLines(md)
    const serialNumberRegexes = configuration.serialNumberRegexes
    for (const serialNumberRegex of serialNumberRegexes) {
        try {
            new RegExp(serialNumberRegex)
        } catch (e) {
            throw new Error(i18n.global.t('Processor.RemoveSerialNumberProcessor.InvalidRegex', {regex: serialNumberRegex}))
        }
    }
    const processedLines = []
    let inCodeBlock = false
    for (const line of lines) {
        let processedLine = line
        if (isBlankLineOrSingleLineCodeBlock(line)) {
            // 情况1：空行和单行代码块（不对这两种情况进行处理）
        } else if (line.startsWith('```')) {
            // 情况2：代码块起始或结束（不对代码块中的内容进行处理）
            inCodeBlock = !inCodeBlock
        } else if (line.startsWith('#') && !inCodeBlock) {
            // 情况3：标题情况
            const match = line.match(/^(#+) (.*)$/)
            if (match) {
                const hashes = match[1]
                const title = match[2]
                processedLine = removeSerialNumber(hashes, title, serialNumberRegexes)
            }
        }
        processedLines.push(processedLine)
    }
    return mdLinesToMd(processedLines)
}

/**
 *
 * 如果标题名中包含能被标题编号与标题分隔符正则表达式匹配的内容，那么就去除匹配到的内容
 * 如果有多个，就去除最长的那个
 * @param hashes        标题的前缀，例如 "#", "##", "###", ...
 * @param title         标题名
 * @param serialNumberRegexes    标题编号正则表达式数组
 * @returns {string}    去除匹配到的内容后的标题名
 */
const removeSerialNumber = (hashes, title, serialNumberRegexes) => {
    let maxLengthMatch = ''
    for (const serialNumberRegex of serialNumberRegexes) {
        const match = title.match(serialNumberRegex)
        if (match && match[0].length > maxLengthMatch.length) {
            maxLengthMatch = match[0]
        }
    }
    if (maxLengthMatch) {
        return `${hashes} ${title.split(maxLengthMatch).slice(-1)[0].trimStart()}\n`
    } else {
        return `${hashes} ${title}\n`
    }
}

/**
 * 测试移除标题的原序号。供给用户在配置页面测试使用，预览效果
 *
 * @param titleLine             标题行
 * @param serialNumberRegexes   标题编号正则表达式数组
 * @returns {string}            移除原序号后的标题行
 */
export const testRemoveSerialNumber = (titleLine, serialNumberRegexes) => {
    if (!titleLine) {
        return ''
    }
    const match = titleLine.match(/^(#+) (.*)$/)
    let result = ''
    if (match) {
        const hashes = match[1]
        const title = match[2]
        result = removeSerialNumber(hashes, title, serialNumberRegexes)
    } else {
        result = t('Processor.RemoveSerialNumberProcessor.InvalidTitleFormat')
    }
    return result
}