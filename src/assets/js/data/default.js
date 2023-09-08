import {AvailableSerialNumberTypes} from "@/assets/js/base/serial-number";

export const defaultInputMarkdownText = `# 1. Level 1

> This is a numbered Markdown article. All titles are numbered.  
> 这是一个编号的 Markdown 文章。所有标题都是编号的。  
> 這是一個編號的 Markdown 文章。所有標題都是編號的。

\`\`\`python
# Code block
print("Hello World!")
\`\`\`

## 1.1 Level 2

### 1.1.1 Level 3

#### (1) Level 4

##### a) Level 5

###### i. Level 6

####### i.i Level 7 (not a header)`

/**
 * 默认原序号移除规则配置
 */
export const defaultRemoveConfiguration = {
    serialNumberRegexes: [
        // 数字后跟一个点，例如 "1.", "1.1.", "1.1", "i.", "i.1"
        '^([ivxIVX\\d]+\\.)[ivxIVX\\d\\.]*',
        // 中文章节，例如 "第一章", "第一节", "第一小节", "第一讲", "第一部分"
        '^第[零一二三四五六七八九十]+(章|节|小节|讲|部分)',
        // 以括号或方括号或花括号包裹的内容，例如 "(1)", "[1]", "{1}"
        '^[\\(\\[\\{\\<]?[a-zA-Z0-9]+[\\)\\]\\}\\>]',
    ]
}

/**
 * 默认重新编号规则配置
 */
export const defaultRenumberConfiguration = {
    handles: {
        // 当 strategyOfLevels 长度小于当前标题的层级时，使用该策略
        unspecifiedLevel: 'original',
        // 当 Markdown 标题的层级大于(greater than) 6 时，由于 Markdown 语法不支持，因此使用该策略
        gt6Level: 'quote',
    },
    strategyOfLevels: [{
        startIndex: 1,
        prefix: '',
        suffix: '.',
        keepSuffixIfFinal: true,
        independent: false,
        serialNumberType: AvailableSerialNumberTypes.NUMBER,
        customSerialNumberClass: null,
    }, {
        startIndex: 1,
        prefix: '',
        suffix: '.',
        keepSuffixIfFinal: false,
        independent: false,
        serialNumberType: AvailableSerialNumberTypes.NUMBER,
        customSerialNumberClass: null,
    }, {
        startIndex: 1,
        prefix: '',
        suffix: '.',
        keepSuffixIfFinal: false,
        independent: false,
        serialNumberType: AvailableSerialNumberTypes.NUMBER,
        customSerialNumberClass: null,
    }, {
        startIndex: 1,
        prefix: '',
        suffix: ')',
        keepSuffixIfFinal: true,
        independent: true,
        serialNumberType: AvailableSerialNumberTypes.ALPHABET_LOWER_CASE,
        customSerialNumberClass: null,
    }]
}

/**
 * 默认配置汇总
 */
export const defaultConfiguration = {
    remove: defaultRemoveConfiguration,
    renumber: defaultRenumberConfiguration
}

export const defaultTestTitles = [
    "# 1. Title",
    "# 第一节 Title",
    "## 1.1. Title",
    "### a) Title",
    "#### (1) Title",
    "##### i. Title",
]

export const defaultTestMarkdownText = `# Level 1

## Level 2

### Level 3

#### Level 4

##### Level 5

###### Level 6

####### Level 7 (Titles greater than 6 levels)
`