import i18n from "@/i18n";
/**
 * @fileoverview 序号类，用于生成序号
 */


/**
 * 可用的序号类型的枚举
 */
export const AvailableSerialNumberTypes = {
    NUMBER: 'NUMBER',
    ALPHABET_LOWER_CASE: 'ALPHABET_LOWER_CASE',
    ALPHABET_UPPER_CASE: 'ALPHABET_UPPER_CASE',
    ROMAN_LOWER_CASE: 'ROMAN_LOWER_CASE',
    ROMAN_UPPER_CASE: 'ROMAN_UPPER_CASE',
    CHINESE_LOWER_CASE: 'CHINESE_LOWER_CASE',
    CHINESE_UPPER_CASE: 'CHINESE_UPPER_CASE',
    CUSTOM: 'CUSTOM',
}

/**
 * 序号检查器，用于检查序号的合法性
 */
export const SerialNumberChecker = {
    ge1: (index) => {
        if (!(Number.isSafeInteger(index) && index >= 1)) {
            // throw new Error('Index must be a positive integer, but got ' + index);
            throw new Error(i18n.global.t('SerialNumber.SerialNumberChecker.Error.GE1', {index: index}));
        }
    },
    ge0: (index) => {
        if (!(Number.isSafeInteger(index) && index >= 0)) {
            throw new Error(i18n.global.t('SerialNumber.SerialNumberChecker.Error.GE0', {index: index}));
        }
    },
    ge1le3999: (index) => {
        if (!(Number.isSafeInteger(index) && index >= 1 && index <= 3999)) {
            throw new Error(i18n.global.t('SerialNumber.SerialNumberChecker.Error.GE1LE3999', {index: index}));
        }
    },
}

export const SerialNumberFactory = (serialNumberType, customSerialNumberFunction = null, customSerialNumberFunctionOptions = null) => {
    if (!serialNumberType in SerialNumberType2Class) {
        throw new Error(i18n.global.t('SerialNumber.SerialNumberFactory.Error.UnknownSerialNumberType', {type: serialNumberType}));
    }
    if (serialNumberType === AvailableSerialNumberTypes.CUSTOM) {
        if (customSerialNumberFunction === null) {
            throw new Error(i18n.global.t('SerialNumber.SerialNumberFactory.Error.CustomSerialNumberTypeRequiresCustomSerialNumberGetter'));
        }
        if (typeof customSerialNumberFunction !== 'function') {
            throw new Error(i18n.global.t('SerialNumber.SerialNumberFactory.Error.CustomSerialNumberGetterMustBeAFunction'));
        }
        return new SerialNumberType2Class.CUSTOM(customSerialNumberFunction, customSerialNumberFunctionOptions);
    } else {
        return new SerialNumberType2Class[serialNumberType]()
    }
}

/**
 * 序号抽象类，用于定义序号类的接口
 */
export class SerialNumber {

    constructor() {
        if (this.constructor === SerialNumber) {
            throw new Error(i18n.global.t('SerialNumber.SerialNumberClasses.SerialNumberAbstractClass.Error.CannotConstructAbstractClass'));
        }
    }

    /**
     * 获取序号，基类中抛出异常，要求子类必须实现该方法
     * @param index {number} 序号索引
     * @returns {string} 序号
     * @throws {Error} 如果子类没有实现该方法，则抛出异常
     */
    get(index) {
        throw new Error(i18n.global.t('SerialNumber.SerialNumberClasses.SerialNumberAbstractClass.Error.MustImplementGet'));
    }

}

/**
 * 阿拉伯数字序号类，用于生成阿拉伯数字序号，生成范围为 [0, +∞)
 */
class NumberSerialNumber extends SerialNumber {
    get(index) {
        SerialNumberChecker.ge0(index)
        return index.toString();
    }
}

/**
 * 罗马数字序号抽象类，用于生成罗马数字序号，生成范围为 [1, 3999]
 */
class RomanSerialNumber extends SerialNumber {
    get(index) {
        SerialNumberChecker.ge1le3999(index);
        const val = [
            1000, 900, 500, 400,
            100, 90, 50, 40,
            10, 9, 5, 4,
            1
        ];
        const syb = [
            "M", "CM", "D", "CD",
            "C", "XC", "L", "XL",
            "X", "IX", "V", "IV",
            "I"
        ];
        let result = '';
        for (let i = 0; i < val.length; i++) {
            while (index >= val[i]) {
                index -= val[i];
                result += syb[i];
            }
        }
        return result;
    }
}

/**
 * 小写罗马数字序号类，用于生成罗马数字序号，生成范围为 [1, 3999]
 */
class RomanLowerCaseSerialNumber extends RomanSerialNumber {
    get(index) {
        return super.get(index).toLowerCase();
    }
}

/**
 * 大写罗马数字序号类，用于生成罗马数字序号，生成范围为 [1, 3999]
 */
class RomanUpperCaseSerialNumber extends RomanSerialNumber {
    get(index) {
        return super.get(index).toUpperCase();
    }
}

/**
 * 字母序号抽象类，用于生成字母序号，生成范围为 [1, 3999]
 */
class AlphabetSerialNumber extends SerialNumber {
    get(index) {
        SerialNumberChecker.ge1le3999(index);
        let result = '';
        while (index > 0) {
            let mod = index % 26;
            if (mod === 0) {
                mod = 26;
            }
            result = String.fromCharCode(64 + mod) + result;
            index = (index - mod) / 26;
        }
        return result;
    }
}

/**
 * 小写字母序号类，用于生成字母序号，生成范围为 [1, 3999]
 */
class AlphabetLowerCaseSerialNumber extends AlphabetSerialNumber {
    get(index) {
        return super.get(index).toLowerCase();
    }
}

/**
 * 大写字母序号类，用于生成字母序号，生成范围为 [1, 3999]
 */
class AlphabetUpperCaseSerialNumber extends AlphabetSerialNumber {
    get(index) {
        return super.get(index).toUpperCase();
    }
}

/**
 * 中文序号抽象类，用于生成中文序号，生成范围为 [1, 3999]
 */
class ChineseSerialNumber extends SerialNumber {
    constructor(options) {
        super();
        this._options = options;
    }

    get(index) {
        SerialNumberChecker.ge1le3999(index);
        // 参考 https://juejin.cn/post/6892372242143903758
        const digits = this._options.digits;
        const units = this._options.units;
        if (index === 0) {
            return "零";
        }
        const english = index.toString().split("")
        let result = "";
        for (let i = 0; i < english.length; i++) {
            const des_i = english.length - 1 - i;   //倒序排列设值
            result = units[i] + result;
            const arr1_index = english[des_i];
            result = digits[arr1_index] + result;
        }
        result = result
            .replace(/零([千百十])/g, '零')  // 零千,零百,零十 => 零
            .replace(/十零/g, '十')         // 十零 => 十
            .replace(/零+/g, '零')    // 零零...零 => 零
            .replace(/零亿/g, '亿')    // 零亿 => 亿
            .replace(/零万/g, '万')    // 零万 => 万
            .replace(/亿万/g, '亿')    // 亿万 => 亿
            .replace(/零+$/, '')     // 移除末尾的零
            // .replace(/零一十/g, '零十')                   // 零一十 => 零十 (可选)
            .replace(/^一十/g, '十')   // 一十 => 十
        return result;
    }
}

/**
 * 小写中文序号类，用于生成中文序号，生成范围为 [1, 3999]
 */
class ChineseLowerCaseSerialNumber extends ChineseSerialNumber {
    constructor() {
        const options = {
            units: ['', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '万', '十', '百', '千', '亿'],
            digits: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
        }
        super(options);
    }
}

/**
 * 大写中文序号类，用于生成中文序号，生成范围为 [1, 3999]
 */
class ChineseUpperCaseSerialNumber extends ChineseSerialNumber {
    constructor() {
        const options = {
            units: ['', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿'],
            digits: ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"],
        }
        super(options);
    }
}

/**
 * 自定义序号类，用于生成自定义序号
 */
class CustomSerialNumber extends SerialNumber {
    /**
     * 构造函数
     * @param func      序号获取器，接受一个参数 index，返回一个字符串
     * @param options   传递给序号获取器的参数，可选的
     */
    constructor(func, options = null) {
        super();
        this._func = func;
        this._options = options;
    }

    get(index) {
        if (this._options) {
            return this._func(index, this._options)
        } else {
            return this._func(index)
        }
    }
}


/**
 * 序号类型到序号类的映射表
 */
const SerialNumberType2Class = {
    // 0, 1, 2, 3, 4, 5, ...
    NUMBER: NumberSerialNumber,
    // a, b, c, d, e, ...
    ALPHABET_LOWER_CASE: AlphabetLowerCaseSerialNumber,
    // A, B, C, D, E, ...
    ALPHABET_UPPER_CASE: AlphabetUpperCaseSerialNumber,
    // i, ii, iii, iv, v, ...
    ROMAN_LOWER_CASE: RomanLowerCaseSerialNumber,
    // I, II, III, IV, V, ...
    ROMAN_UPPER_CASE: RomanUpperCaseSerialNumber,
    // 〇, 一, 二, 三, 四, 五, ...
    CHINESE_LOWER_CASE: ChineseLowerCaseSerialNumber,
    // 零, 壹, 贰, 叁, 肆, 伍, ...
    CHINESE_UPPER_CASE: ChineseUpperCaseSerialNumber,
    // 自定义类型
    CUSTOM: CustomSerialNumber,
}

