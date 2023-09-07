export const downloadFile = (content, fileName, format) => {
    let mimeType;
    // 根据指定的格式确定 MIME 类型和文件扩展名
    switch (format) {
        case 'md':
            mimeType = 'text/markdown';
            fileName += '.md';
            break;
        case 'json':
            mimeType = 'application/json';
            fileName += '.json';
            break;
        case 'txt':
        default:
            mimeType = 'text/plain';
            fileName += '.txt';
            break;
    }

    // 创建 blob
    const blob = new Blob([content], {type: mimeType});
    // 创建 blob URL
    const url = window.URL.createObjectURL(blob);
    // 创建一个新的 <a> 元素并模拟点击事件
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // 释放 blob URL
    window.URL.revokeObjectURL(url);
}