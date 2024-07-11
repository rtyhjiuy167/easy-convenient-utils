declare class DateUtils {
    /**
     *
     * @param date
     * @param fmt 字符串替换模板 yyyy-MM-dd 季度q 周w hh:mm:ss SSSS毫秒
     * @returns
     */
    static format(date: Date, fmt: string): string;
    /**
     *
     * @param fmt 字符串替换模板 yyyy-MM-dd 季度q 周w hh:mm:ss SSSS毫秒
     * @returns
     */
    static newDate(fmt: string): string;
}
export default DateUtils;
