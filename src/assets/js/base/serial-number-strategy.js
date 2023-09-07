export const OtherSerialNumberStrategy = {
    original: (hashes, title) => `${hashes} ${title}\n`,
    quote: (hashes, title) => `\n> ${title}\n`,
    keepTitle: (hashes, title) => `${title}\n`,
}

import {AvailableSerialNumberTypes, SerialNumberFactory} from './serial-number';

export class SerialNumberStrategy {
    /**
     * 构造函数
     * @param startIndex    序号起始值
     * @param prefix        序号前缀
     * @param suffix        序号后缀
     * @param keepSuffixIfFinal   如果层级到此结束，则移除后缀
     * @param independent           是否独立开始计数，而不是接着上一层的序号
     * @param serialNumberType      序号类型
     * @param customSerialNumberFunction            自定义序号获取器，当序号类型为 CUSTOM 时，必须提供
     *                                              类型为 (index, options=null) => string
     * @param customSerialNumberFunctionOptions     自定义序号获取器的参数
     *                                              传入到 customSerialNumberFunction 中的 options 参数
     */
    constructor(startIndex = 1, prefix = '', suffix = '',
                keepSuffixIfFinal = false, independent = false,
                serialNumberType = AvailableSerialNumberTypes.NUMBER,
                customSerialNumberFunction = null, customSerialNumberFunctionOptions = null) {

        this.prefix = prefix;
        this.suffix = suffix;
        this.keepSuffixIfFinal = keepSuffixIfFinal;
        this.independent = independent;
        this.serialNumberType = serialNumberType;
        this.startIndex = startIndex;
        this.serialNumberGetter = SerialNumberFactory(serialNumberType, customSerialNumberFunction, customSerialNumberFunctionOptions);
    }

    get(index) {
        return this.serialNumberGetter.get(index);
    }
}