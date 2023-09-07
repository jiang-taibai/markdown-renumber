import i18n from "@/i18n";

const zhCN = `# 1. 基本介绍

本项目用于 Markdown 文档的序号重排版，可实现以下功能：

- 去除 Markdown 文档中原来的序号
- 为 Markdown 文档中的标题按照规则生成序号

下面依次介绍这两个功能。

# 2. 去除序号

## 2.1 去除原理

在去除标题时，将提取出文档中标题，例如 \`## 2.1 标题\`

\`\`\`mermaid
flowchart TD
    A[## 2.1 标题]
    A --> B[分割为 # 和 原标题]
    B --> B1[2.1 标题]
    B --> B2[##]
    B1 --> C[按照正则列表, 匹配到最长序号]
    C --> D1[第一种]
    C --> D2[第二种]
    C --> D3[第三种]
    D1 --> D11[2]
    D1 --> D12[.1 标题]
    D2 --> D21[2.]
    D2 --> D22[1 标题]
    D3 --> D31[2.1]
    D3 --> D32[标题]
    B2 --> E[## 标题]
    D32 --> E
\`\`\`

## 2.2 正则配置

你可以在 “设置原序号移除规则” 中配置正则表达式列表，用于匹配标题中的序号。  
该正则表达式列表将在 “按照正则列表, 匹配到最长序号” 中使用

可能有多个正则会匹配到标题中的序号，这里将匹配到的序号按照正则表达式的长度作为优先级，取最长的序号作为标题的序号。

# 3. 生成序号

## 3.1 未指定层级的标题策略

如果你没有指定某一层级的标题序号生成规则，那么将执行“未指定层级的标题策略”

共有三种策略：

- 引用：\`#### 标题\` => \`> 标题\`
- 原始：\`#### 标题\` => \`#### 标题\`
- 仅标题：\`#### 标题\` => \`标题\`

假设你的 Markdown 是这样的：

\`\`\`markdown
# 标题一

## 标题二

### 标题三

#### 标题四
\`\`\`

如果你没有指定第四层标题生成序号的规则，那么将执行“未指定层级的标题策略”，如果选择“引用”：

（这里忽略序号的生成，仅展示该策略的效果）
\`\`\`markdown
# 标题一

## 标题二

### 标题三

> 标题四
\`\`\`

## 3.2 大于 6 层的标题策略

在 Markdown 中，并不支持大于 6 层的标题，故在生成序号时如果标题层级大于 6，将使用“大于 6 层的标题策略”

共有三种策略，这三种策略的效果与上一节中展示的是一样的。

- 引用：\`##### 标题\` => \`> 标题\`
- 原始：\`##### 标题\` => \`##### 标题\`
- 仅标题：\`##### 标题\` => \`标题\`

## 3.3 类型

类型即为生成序号的类型，可选的类型有：

- 阿拉伯数字：\`[0, 1, 2, 3, ...]\`
- 小写字母：\`[NULL, a, b, c, d, ...]\`
- 大写字母：\`[NULL, A, B, C, D, ...]\`
- 罗马数字（小写）：\`[NULL, i, ii, iii, iv, ...]\`
- 罗马数字（大写）：\`[NULL, I, II, III, IV, ...]\`
- 中文数字（小写）：\`[〇, 一, 二, 三, 四, ...]\`
- 中文数字（大写）：\`[零, 壹, 贰, 叁, 肆, ...]\`

**注意**：这里的 \`NULL\` 表示不能使用的序号，但为了各类型的对齐，一律从 0 开始编号。

通过选择类型，你可以轻松地设置每一个标题的序号的基本样式

## 3.4 起始序号

起始序号即序号的起始值

> 样例一：阿拉伯数字，起始序号为 0

\`\`\`markdown
# 0. 章节一

# 1. 章节二

# 2. 章节三
\`\`\`

> 样例二：小写罗马数字，起始序号为 1

**注意**：如果起始序号为 n，并不是指第 n 个序号，而是下标为 n 的序号。（等同于数组下标概念）

参考罗马数字的所有取值：\`[NULL, i, ii, iii, iv, ...]\`

因为罗马数字中没有 0，所以起始序号为 1 时，序号将从 i 开始。

\`\`\`markdown
# i. 小节一

# ii. 小节二

# iii. 小节三
\`\`\`

## 3.5 前后缀

前后缀即序号前后的字符，可以是任意字符串

> 样例一：中文数字，起始序号为 1，前缀为 “第”，后缀为 “章”

\`\`\`markdown
# 第一章 章节一的标题

# 第二章 章节二的标题

# 第三章 章节三的标题
\`\`\`

> 样例二：小写字母，起始序号为 1，无前缀，后缀为 “)”

\`\`\`markdown
# a) 小节一的标题

# b) 小节二的标题

# c) 小节三的标题
\`\`\`

## 3.6 末缀

该选项有两个值，表示是否显示末尾的后缀，这可能不太好理解。

下面先给出几个样例：

### 3.6.1 样例

> 样例一：
> - 第一级标题：阿拉伯数字，起始序号为 1，后缀为 “.”，显示末尾的后缀
> - 第二级标题：阿拉伯数字，起始序号为 1，后缀为 “.”，**不显示**末尾的后缀
> - 第三级标题：阿拉伯数字，起始序号为 1，后缀为 “.”，显示末尾的后缀

如果第二级标题不显示末尾的后缀，不会使得第三级标题为 “1.11.”

\`\`\`markdown
# 1. 标题

## 1.1 标题

### 1.1.1. 标题
\`\`\`

> 样例二：
> - 第一级标题：阿拉伯数字，起始序号为 1，后缀为 “.”，**不显示**末尾的后缀
> - 第二级标题：阿拉伯数字，起始序号为 1，后缀为 “.”，显示末尾的后缀
> - 第三级标题：阿拉伯数字，起始序号为 1，后缀为 “.”，**不显示**末尾的后缀

如果第一级标题不显示末尾的后缀，不会使得第二级标题为 “11.”

\`\`\`markdown
# 1 标题

## 1.1. 标题

### 1.1.1 标题
\`\`\`

在实现生成标题时，并不是简单地将上一级标题的序号作为下一级标题的前缀

### 3.6.2 生成过程解析

下面展示一个不太美观但表述性很强的三级标题的生成过程（暂时不考虑独立的概念）：

- 第一级标题：小写字母，起始序号为 1，前缀为 “(”，后缀为 “)”，**不显示**末尾的后缀
- 第二级标题：小写字母，起始序号为 1，前缀为 “\\[”，后缀为 “\\]”，**不显示**末尾的后缀
- 第三级标题：阿拉伯数字，起始序号为 1，前缀为 “-”，后缀为 “.”，**不显示**末尾的后缀

\`\`\`mermaid
flowchart TD
    A[原标题: ### 第三级标题]
    B[分割为 # 和 原标题]
    A --> B
    B -- 分割部分 --> B1[###]
    B -- 后续流程 --> B2[生成序号]
    B -- 分割部分 --> B3[第三级标题]
    B2 --> C1["第一级序号: (1)"]
    B2 --> C2["第二级序号: [1]"]
    B2 --> C3["第三级序号: -1."]
    C1 --> D["合并序号: (1)[1]-1."]
    C2 --> D
    C3 --> D
    D --> E["由于第三级设定不显示末尾的后缀<br>最终序号: (1)[1]-1"]
    E --> F["### (1)[1]-1 第三级标题"]
    B1 --> F
    B3 --> F
\`\`\`

这是该配置下的效果：

\`\`\`markdown
# (1 第一级标题

## (1)[1 第二级标题

### (1)[1]-1 第三极标题
\`\`\`

## 3.7 独立

若某一级标题是独立的，那么就不会将之前层级的序号拼接在一起

### 3.7.1 样例

> 样例一：
> - 第一级标题：阿拉伯数字，起始序号为 1，后缀为 “.”，显示末尾的后缀，独立的
> - 第二级标题：小写字母，起始序号为 1，后缀为 “)”，显示末尾的后缀，独立的

\`\`\`markdown
# 1. 标题

## a) 标题
\`\`\`

> 样例一：
> - 第一级标题：阿拉伯数字，起始序号为 1，后缀为 “.”，显示末尾的后缀，独立的
> - 第二级标题：小写字母，起始序号为 1，后缀为 “)”，显示末尾的后缀，不独立的

如果第二级标题不独立，那么就会将第一级标题的序号拼接在一起

\`\`\`markdown
# 1. 标题

## 1.a) 标题
\`\`\`

### 3.7.2 生成过程解析

下面展示一个有多个独立或不独立交织的层级配置的生成过程：

- 所有标题基本配置：起始序号为 1，前缀为 “(”，后缀为 “)”，显示末尾的后缀
- 第一级标题：阿拉伯数字，独立的
- 第二级标题：小写罗马数字，不独立的
- 第三级标题：大写罗马数字，独立的
- 第四级标题：小写字母，不独立的
- 第五级标题：大写字母，独立的
- 第六级标题：小写中文，不独立的

\`\`\`mermaid
flowchart TD
    A["各级基本序号 (1)、(i)、(I)、(a)、(A)、(一)"]
    A -- 独立的 --> B["拼接后的第一级序号: (1)"]
    B -- 不独立的 --> C["拼接后的第二级序号: (1)(i)"]
    C -- 独立的 --> D["拼接后的第三级序号: (I)"]
    D -- 不独立的 --> E["拼接后的第四级序号: (I)(a)"]
    E -- 独立的 --> F["拼接后的第五级序号: (A)"]
    F -- 不独立的 --> G["拼接后的第六级序号: (A)(一)"]
\`\`\`

这是该配置下的效果：

\`\`\`markdown
# (1) 标题 1

## (1)(i) 标题 2

### (I) 标题 3

#### (I)(a) 标题 4

##### (A) 标题 5

###### (A)(一) 标题 6
\`\`\`



# 4. 配置的存储与隐私

配置包含两部分：
- 基本配置：移除标题的正则列表、新序号的生成规则
- 测试样例：测试移除序号的标题列表、测试生成序号的 Markdown 文档

在本项目中，配置的存储使用了 \`localStorage\`，即浏览器本地存储。

我们承诺不会将你的配置上传到任何服务器，也不会将你的配置分享给任何人。同时你所上传和粘贴的任何 Markdown 都不会保存在本地，也不会上传到任何服务器。

这意味着如果你切换浏览器，那么你的配置将不会被保留，你需要重新配置。

为了配置的持久化，你依然可以导出配置，导出的配置是一个 JSON 字符串，仅包含配置和测试样例，不包含你所上传的 Markdown 文档。

**但为了隐私安全，这里建议一下几点：**

1. 配置设置：不要在配置和测试样例中写入任何敏感信息 
2. 浏览器安全：浏览器不要使用不可信的插件和扩展

# 5. 项目地址

TODO`

const zhTW = `# 1. 基本介紹

本專案用於 Markdown 文件的序號重排版，可實現以下功能：

- 去除 Markdown 文件中原來的序號
- 為 Markdown 文件中的標題按照規則生成序號

下面依次介紹這兩個功能。

# 2. 去除序號

## 2.1 去除原理

在去除標題時，將提取出文件中標題，例如 \`## 2.1 標題\`

\`\`\`mermaid
flowchart TD
    A[## 2.1 標題]
    A --> B[分割為 # 和 原標題]
    B --> B1[2.1 標題]
    B --> B2[##]
    B1 --> C[按照正則列表, 匹配到最長序號]
    C --> D1[第一種]
    C --> D2[第二種]
    C --> D3[第三種]
    D1 --> D11[2]
    D1 --> D12[.1 標題]
    D2 --> D21[2.]
    D2 --> D22[1 標題]
    D3 --> D31[2.1]
    D3 --> D32[標題]
    B2 --> E[## 標題]
    D32 --> E
\`\`\`

## 2.2 正則配置

你可以在 “設定原序號移除規則” 中配置正則表示式列表，用於匹配標題中的序號。  
該正則表示式列表將在 “按照正則列表, 匹配到最長序號” 中使用

可能有多個正則會匹配到標題中的序號，這裡將匹配到的序號按照正則表示式的長度作為優先順序，取最長的序號作為標題的序號。

# 3. 生成序號

## 3.1 未指定層級的標題策略

如果你沒有指定某一層級的標題序號生成規則，那麼將執行“未指定層級的標題策略”

共有三種策略：

- 引用：\`#### 標題\` => \`> 標題\`
- 原始：\`#### 標題\` => \`#### 標題\`
- 僅標題：\`#### 標題\` => \`標題\`

假設你的 Markdown 是這樣的：

\`\`\`markdown
# 標題一

## 標題二

### 標題三

#### 標題四
\`\`\`

如果你沒有指定第四層標題生成序號的規則，那麼將執行“未指定層級的標題策略”，如果選擇“引用”：

（這裡忽略序號的生成，僅展示該策略的效果）

\`\`\`markdown
# 標題一

## 標題二

### 標題三

> 標題四
\`\`\`

## 3.2 大於 6 層的標題策略

在 Markdown 中，並不支援大於 6 層的標題，故在生成序號時如果標題層級大於 6，將使用“大於 6 層的標題策略”

共有三種策略，這三種策略的效果與上一節中展示的是一樣的。

- 引用：\`##### 標題\` => \`> 標題\`
- 原始：\`##### 標題\` => \`##### 標題\`
- 僅標題：\`##### 標題\` => \`標題\`

## 3.3 型別

型別即為生成序號的型別，可選的型別有：

- 阿拉伯數字：\`[0, 1, 2, 3, ...]\`
- 小寫字母：\`[NULL, a, b, c, d, ...]\`
- 大寫字母：\`[NULL, A, B, C, D, ...]\`
- 羅馬數字（小寫）：\`[NULL, i, ii, iii, iv, ...]\`
- 羅馬數字（大寫）：\`[NULL, I, II, III, IV, ...]\`
- 中文數字（小寫）：\`[〇, 一, 二, 三, 四, ...]\`
- 中文數字（大寫）：\`[零, 壹, 貳, 叄, 肆, ...]\`

**注意**：這裡的 \`NULL\` 表示不能使用的序號，但為了各型別的對齊，一律從 0 開始編號。

透過選擇型別，你可以輕鬆地設定每一個標題的序號的基本樣式

## 3.4 起始序號

起始序號即序號的起始值

> 樣例一：阿拉伯數字，起始序號為 0

\`\`\`markdown
# 0. 章節一

# 1. 章節二

# 2. 章節三
\`\`\`

> 樣例二：小寫羅馬數字，起始序號為 1

**注意**：如果起始序號為 n，並不是指第 n 個序號，而是下標為 n 的序號。（等同於陣列下標概念）

參考羅馬數字的所有取值：\`[NULL, i, ii, iii, iv, ...]\`

因為羅馬數字中沒有 0，所以起始序號為 1 時，序號將從 i 開始。

\`\`\`markdown
# i. 小節一

# ii. 小節二

# iii. 小節三
\`\`\`

## 3.5 前後綴

前後綴即序號前後的字元，可以是任意字串

> 樣例一：中文數字，起始序號為 1，字首為 “第”，字尾為 “章”

\`\`\`markdown
# 第一章 章節一的標題

# 第二章 章節二的標題

# 第三章 章節三的標題
\`\`\`

> 樣例二：小寫字母，起始序號為 1，無字首，字尾為 “)”

\`\`\`markdown
# a) 小節一的標題

# b) 小節二的標題

# c) 小節三的標題
\`\`\`

## 3.6 末綴

該選項有兩個值，表示是否顯示末尾的字尾，這可能不太好理解。

下面先給出幾個樣例：

### 3.6.1 樣例

> 樣例一：
> - 第一級標題：阿拉伯數字，起始序號為 1，字尾為 “.”，顯示末尾的字尾
> - 第二級標題：阿拉伯數字，起始序號為 1，字尾為 “.”，**不顯示**末尾的字尾
> - 第三級標題：阿拉伯數字，起始序號為 1，字尾為 “.”，顯示末尾的字尾

如果第二級標題不顯示末尾的字尾，不會使得第三級標題為 “1.11.”

\`\`\`markdown
# 1. 標題

## 1.1 標題

### 1.1.1. 標題
\`\`\`

> 樣例二：
> - 第一級標題：阿拉伯數字，起始序號為 1，字尾為 “.”，**不顯示**末尾的字尾
> - 第二級標題：阿拉伯數字，起始序號為 1，字尾為 “.”，顯示末尾的字尾
> - 第三級標題：阿拉伯數字，起始序號為 1，字尾為 “.”，**不顯示**末尾的字尾

如果第一級標題不顯示末尾的字尾，不會使得第二級標題為 “11.”

\`\`\`markdown
# 1 標題

## 1.1. 標題

### 1.1.1 標題
\`\`\`

在實現生成標題時，並不是簡單地將上一級標題的序號作為下一級標題的字首

### 3.6.2 生成過程解析

下面展示一個不太美觀但表述性很強的三級標題的生成過程（暫時不考慮獨立的概念）：

- 第一級標題：小寫字母，起始序號為 1，字首為 “(”，字尾為 “)”，**不顯示**末尾的字尾
- 第二級標題：小寫字母，起始序號為 1，字首為 “\\[”，字尾為 “\\]”，**不顯示**末尾的字尾
- 第三級標題：阿拉伯數字，起始序號為 1，字首為 “-”，字尾為 “.”，**不顯示**末尾的字尾

\`\`\`mermaid
flowchart TD
    A[原標題: ### 第三級標題]
    B[分割為 # 和 原標題]
    A --> B
    B -- 分割部分 --> B1[###]
    B -- 後續流程 --> B2[生成序號]
    B -- 分割部分 --> B3[第三級標題]
    B2 --> C1["第一級序號: (1)"]
    B2 --> C2["第二級序號: [1]"]
    B2 --> C3["第三級序號: -1."]
    C1 --> D["合併序號: (1)[1]-1."]
    C2 --> D
    C3 --> D
    D --> E["由於第三級設定不顯示末尾的字尾<br>最終序號: (1)[1]-1"]
    E --> F["### (1)[1]-1 第三級標題"]
    B1 --> F
    B3 --> F
\`\`\`

這是該配置下的效果：

\`\`\`markdown
# (1 第一級標題

## (1)[1 第二級標題

### (1)[1]-1 第三極標題
\`\`\`

## 3.7 獨立

若某一級標題是獨立的，那麼就不會將之前層級的序號拼接在一起

### 3.7.1 樣例

> 樣例一：
> - 第一級標題：阿拉伯數字，起始序號為 1，字尾為 “.”，顯示末尾的字尾，獨立的
> - 第二級標題：小寫字母，起始序號為 1，字尾為 “)”，顯示末尾的字尾，獨立的

\`\`\`markdown
# 1. 標題

## a) 標題
\`\`\`

> 樣例一：
> - 第一級標題：阿拉伯數字，起始序號為 1，字尾為 “.”，顯示末尾的字尾，獨立的
> - 第二級標題：小寫字母，起始序號為 1，字尾為 “)”，顯示末尾的字尾，不獨立的

如果第二級標題不獨立，那麼就會將第一級標題的序號拼接在一起

\`\`\`markdown
# 1. 標題

## 1.a) 標題
\`\`\`

### 3.7.2 生成過程解析

下面展示一個有多個獨立或不獨立交織的層級配置的生成過程：

- 所有標題基本配置：起始序號為 1，字首為 “(”，字尾為 “)”，顯示末尾的字尾
- 第一級標題：阿拉伯數字，獨立的
- 第二級標題：小寫羅馬數字，不獨立的
- 第三級標題：大寫羅馬數字，獨立的
- 第四級標題：小寫字母，不獨立的
- 第五級標題：大寫字母，獨立的
- 第六級標題：小寫中文，不獨立的

\`\`\`mermaid
flowchart TD
    A["各級基本序號 (1)、(i)、(I)、(a)、(A)、(一)"]
    A -- 獨立的 --> B["拼接後的第一級序號: (1)"]
    B -- 不獨立的 --> C["拼接後的第二級序號: (1)(i)"]
    C -- 獨立的 --> D["拼接後的第三級序號: (I)"]
    D -- 不獨立的 --> E["拼接後的第四級序號: (I)(a)"]
    E -- 獨立的 --> F["拼接後的第五級序號: (A)"]
    F -- 不獨立的 --> G["拼接後的第六級序號: (A)(一)"]
\`\`\`

這是該配置下的效果：

\`\`\`markdown
# (1) 標題 1

## (1)(i) 標題 2

### (I) 標題 3

#### (I)(a) 標題 4

##### (A) 標題 5

###### (A)(一) 標題 6
\`\`\`

# 4. 配置的儲存與隱私

配置包含兩部分：

- 基本配置：移除標題的正則列表、新序號的生成規則
- 測試樣例：測試移除序號的標題列表、測試生成序號的 Markdown 文件

在本專案中，配置的儲存使用了 \`localStorage\`，即瀏覽器本地儲存。

我們承諾不會將你的配置上傳到任何伺服器，也不會將你的配置分享給任何人。同時你所上傳和貼上的任何 Markdown 都不會儲存在本地，也不會上傳到任何伺服器。

這意味著如果你切換瀏覽器，那麼你的配置將不會被保留，你需要重新配置。

為了配置的持久化，你依然可以匯出配置，匯出的配置是一個 JSON 字串，僅包含配置和測試樣例，不包含你所上傳的 Markdown 文件。

**但為了隱私安全，這裡建議一下幾點：**

1. 配置設定：不要在配置和測試樣例中寫入任何敏感資訊
2. 瀏覽器安全：瀏覽器不要使用不可信的外掛和擴充套件

# 5. 專案地址

TODO
`

const enUS = `# 1. Basic introduction

This project is used for serial number rearrangement of Markdown documents, which can realize the following functions:

- Remove the original serial number in the Markdown document
- Generate serial numbers for titles in Markdown documents according to the rules

These two functions are introduced in turn below.

# 2. Remove the serial number

## 2.1 Removal principle

When removing the title, the title in the document will be extracted, such as \`## 2.1 Title\`

\`\`\`mermaid
flowchart TD
    A[## 2.1 Title]
    A --> B[split into # and original title]
    B --> B1[2.1 header]
    B --> B2[##]
    B1 --> C[According to the regular list, match the longest serial number]
    C --> D1[Type 1]
    C --> D2[second type]
    C --> D3[the third type]
    D1 --> D11[2]
    D1 --> D12[.1 header]
    D2 --> D21[2.]
    D2 --> D22[1 title]
    D3 --> D31[2.1]
    D3 --> D32[Title]
    B2 --> E[## title]
    D32 --> E
\`\`\`

## 2.2 Regular configuration

You can configure a list of regular expressions in "Set the original serial number removal rule" to match the serial number in the title.
This regular expression list will be used in "According to the regular list, match to the longest serial number"

There may be multiple regular expressions that will match the serial number in the title. Here, the matched serial number is prioritized according to the length of the regular expression, and the longest serial number is used as the serial number of the title.

# 3. Generate serial number

## 3.1 Heading Policy for Unspecified Hierarchy

If you do not specify a title sequence number generation rule for a certain level, the "title policy for unspecified level" will be executed

There are three strategies:

- Quote: \`#### Title\` => \`> Title\`
- Original: \`#### Title\` => \`#### Title\`
- title only: \`#### title\` => \`title\`

Suppose your markdown is like this:

\`\`\`markdown
# Title 1

## Title 2

### Title 3

#### Title 4
\`\`\`

If you do not specify the rules for generating serial numbers for fourth-level titles, then the "unspecified-level title policy" will be executed. If "Reference" is selected:

(Ignore the generation of serial numbers here and only show the effect of this strategy)
\`\`\`markdown
# Title One

## Title 2

### Title 3

> Title Four
\`\`\`

## 3.2 Title strategy for layers greater than 6

In Markdown, titles greater than 6 levels are not supported, so when generating serial numbers if the title level is greater than 6, the "title strategy greater than 6 levels" will be used.

There are three strategies, and the effects of these three strategies are the same as those shown in the previous section.

- Quote: \`##### title\` => \`> title\`
- Original: \`##### title\` => \`##### title\`
- Title only: \`##### title\` => \`title\`

## 3.3 Type

The type is the type of the serial number generated, and the optional types are:

- Arabic numerals: \`[0, 1, 2, 3, ...]\`
- Lowercase letters: \`[NULL, a, b, c, d, ...]\`
- Capital letters: \`[NULL, A, B, C, D, ...]\`
- Roman numerals (lower case): \`[NULL, i, ii, iii, iv, ...]\`
- Roman numerals (upper case): \`[NULL, I, II, III, IV, ...]\`
- Chinese numbers (lowercase): \`[〇, 一, 二, 三, 四, ...]\`
- Chinese numerals (uppercase): \`[zero, one, two, three, four, ...]\`

**Note**: \`NULL\` here means the serial number that cannot be used, but for the alignment of each type, the numbering starts from 0.

By selecting the type, you can easily set the basic style of the serial number of each title

## 3.4 Starting sequence number

The starting sequence number is the starting value of the sequence number

> Sample 1: Arabic numerals, starting sequence number is 0

\`\`\`markdown
# 0. Chapter 1

# 1. Chapter 2

# 2. Chapter Three
\`\`\`

> Example 2: Lowercase Roman numerals, starting number is 1

**Note**: If the starting sequence number is n, it does not refer to the nth sequence number, but the sequence number with subscript n. (Equivalent to the concept of array subscript)

Refer to all values of Roman numerals: \`[NULL, i, ii, iii, iv, ...]\`

Because there is no 0 in Roman numerals , when the starting sequence number is 1, the sequence number will start from i.

\`\`\`markdown
# i. Section 1

# ii. Section 2

# iii. Section 3
\`\`\`

## 3.5 Prefix and suffix

The prefix and suffix are the characters before and after the serial number, which can be any string

> Example 1: Chinese numbers, the starting serial number is 1, the prefix is "第", and the suffix is "章"

\`\`\`markdown
# Title of Chapter 1 Chapter 1

# Chapter 2 Title of Chapter 2

# Chapter 3 Title of Chapter 3
\`\`\`

> Example 2: lowercase letters, the starting sequence number is 1, no prefix, and the suffix is ")"

\`\`\`markdown
# a) Title of section one

# b) Title of section two

# c) Title of section three
\`\`\`

## 3.6 Suffix

This option has two values, indicating whether to display the suffix at the end, which may not be easy to understand.

Here are a few examples:

### 3.6.1 Example

> Example 1:
> - First-level title: Arabic numerals, the starting sequence number is 1, the suffix is ".", and the suffix at the end is displayed
> - Second-level title: Arabic numerals, the starting sequence number is 1, the suffix is ".", **do not display** the suffix at the end
> - The third-level title: Arabic numerals, the starting sequence number is 1, the suffix is ".", and the suffix at the end is displayed

If the second-level title does not display the suffix at the end, it will not make the third-level title "1.11."

\`\`\`markdown
# 1. Title

## 1.1 Title

### 1.1.1. Title
\`\`\`

> Example 2:
> - First-level title: Arabic numerals, the starting sequence number is 1, and the suffix is ".", **Do not display the suffix at the end
> - Second-level title: Arabic numerals, the starting sequence number is 1, the suffix is ".", and the suffix at the end is displayed
> - The third-level title: Arabic numerals, the starting sequence number is 1, and the suffix is ".", **do not display the suffix at the end

If the first-level title does not display the trailing suffix, it will not make the second-level title "11."

\`\`\`markdown
# 1 title

## 1.1. Title

### 1.1.1 Title
\`\`\`

When implementing title generation, it is not simply to use the serial number of the upper-level title as the prefix of the lower-level title

### 3.6.2 Analysis of the generation process

The following shows the generation process of an unsightly but highly descriptive third-level title (the independent concept is not considered for the time being):

- First-level title: lowercase letters, starting number is 1, prefix is "(", suffix is ")", **do not display** the suffix at the end
- Second-level title: lowercase letters, starting number is 1, prefix is "\\[", suffix is "\\]", **does not display** the suffix at the end
- Third level title: Arabic numerals, starting number is 1, prefix is "-", suffix is ".", **does not display** the suffix at the end

\`\`\`mermaid
flowchart TD
    A[Original title: ### Third level title]
    B[split into # and original title]
    A --> B
    B -- Split part --> B1[###]
    B -- Follow-up process --> B2[Generate serial number]
    B -- split part --> B3[third-level title]
    B2 --> C1["First level serial number: (1)"]
    B2 --> C2["Second level serial number: [1]"]
    B2 --> C3["Third level serial number: -1."]
    C1 --> D["Merge serial number: (1)[1]-1."]
    C2 --> D
    C3 --> D
    D --> E["Due to the third-level setting, the suffix at the end is not displayed Final serial number: (1)[1]-1"]
    E --> F["### (1)[1]-1 Third level title"]
    B1 --> F
    B3 --> F
\`\`\`

This is the effect of this configuration:

\`\`\`markdown
# (1 first level title

## (1)[1 Second level title

### (1)[1]-1 The third pole title
\`\`\`

## 3.7 Independent

If a certain level of heading is independent, the serial numbers of the previous levels will not be spliced together.

### 3.7.1 Example

> Example 1:
> - First-level title: Arabic numerals, starting sequence number is 1, suffix is ".", showing the suffix at the end, independent
> - Second-level title: lowercase letters, starting sequence number is 1, suffix is ")", showing the suffix at the end, independent

\`\`\`markdown
# 1. Title

## a) title
\`\`\`

> Example 1:
> - The first-level title: Arabic numerals, the starting sequence number is 1, the suffix is ".", and the suffix at the end is displayed, independent
> - Second-level title: lowercase letters, the starting sequence number is 1, the suffix is ")", the suffix at the end is displayed, not independent

If the second-level headings are not independent, the serial numbers of the first-level headings will be spliced together

\`\`\`markdown
# 1. Title

## 1.a) Title
\`\`\`

### 3.7.2 Analysis of the generation process

The following shows the generation process for a hierarchical configuration with multiple independent or non-independent interweaving:

- Basic configuration of all titles: the starting sequence number is 1, the prefix is "(", the suffix is ")", and the suffix at the end is displayed
- First level headings: Arabic numerals, independent
- Second-level headings: lowercase Roman numerals, not independent
- 3rd level heading: uppercase Roman numerals, separate
- Level 4 headings: lowercase letters, not independent
- Level 5 headings: capital letters, standalone
- Level 6 title: lowercase Chinese, not independent

\`\`\`mermaid
flowchart TD
    A["Basic serial numbers at all levels (1), (i), (I), (a), (A), (one)"]
    A -- Independent --> B["First-level serial number after splicing: (1)"]
    B -- Dependent --> C["Second-level serial number after splicing: (1)(i)"]
    C -- Independent --> D["The third-level serial number after splicing: (I)"]
    D -- Dependent --> E["The fourth-level serial number after splicing: (I)(a)"]
    E -- Independent --> F["The fifth-level serial number after splicing: (A)"]
    F -- Dependent --> G["Sixth-level serial number after splicing: (A) (one)"]
\`\`\`

This is the effect of this configuration:

\`\`\`markdown
# (1) Title 1

## (1)(i) Title 2

### (I) Title 3

#### (I)(a) Title 4

##### (A) Title 5

###### (A)(1) Title 6
\`\`\`



# 4. Configuration storage and privacy

Configuration consists of two parts:
- Basic configuration: Remove the regular list of titles, the generation rules of new serial numbers
- Test sample: test the title list with the serial number removed, test the Markdown document with the serial number generated

In this project, the configured storage uses \`localStorage\`, which is the browser's local storage.

We promise not to upload your configuration to any server, nor to share your configuration with anyone. At the same time, any Markdown you upload and paste will not be saved locally, nor will it be uploaded to any server.

This means that if you switch browsers, your configuration will not be retained and you will need to reconfigure.

For the persistence of the configuration, you can still export the configuration. The exported configuration is a JSON string, which only includes the configuration and test samples, and does not include the Markdown document you uploaded.

**But for the sake of privacy and security, here are a few suggestions:**

1. Configuration settings: Do not write any sensitive information in configuration and test samples
2. Browser security: Do not use untrusted plug-ins and extensions in your browser

# 5. Project address

TODO
`

export const getLocalHelpDocument = () => {
    switch (i18n.global.locale.value) {
        case 'zh-CN':
            return zhCN;
        case 'zh-TW':
            return zhTW;
        case 'en-US':
            return enUS;
        default:
            return zhCN;
    }
}