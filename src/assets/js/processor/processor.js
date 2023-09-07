import {removeSerialNumberProcessor} from "@/assets/js/processor/subprocessor/remove-serial-number-processor";
import {renumberTitle} from "@/assets/js/processor/subprocessor/renumber-processor";

export const processor = (md, configuration) => {
    md = removeSerialNumberProcessor(md, configuration.remove)
    md = renumberTitle(md, configuration.renumber)
    return md
}