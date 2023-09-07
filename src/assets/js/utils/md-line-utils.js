export const isBlankLineOrSingleLineCodeBlock = (line) => {
    // 计算该行前面有多少个空格
    const previousSpaces = line.length - line.trimStart().length
    // 1. 跳过空行
    // 2. 如果有4个及以上的空格，那么就是单行代码块
    return previousSpaces >= 4 || line.trim() === '';
}

/**
 * 将 md 文本数组转换为 md 文本
 * replace(/\n\n+/g, '\n\n') 的作用是将多个连续的空行替换为一个空行
 *
 * @param mdLines   md 文本数组
 * @returns {string}    md 文本
 */
export const mdLinesToMd = (mdLines) => {
    // 先将所有换行统一为 \n
    const unified = mdLines.map(mdLine => mdLine.replace(/\r\n|\r|\n/g, '\n'))
    return unified.join('\n').replace(/\n\n+/g, '\n\n');
}

export const mdToMdLines = (md) => {
    // 统一换行符为 \n
    const unified = md.replace(/\r\n|\r|\n/g, '\n');
    return unified.split('\n')
}