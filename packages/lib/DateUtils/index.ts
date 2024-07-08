class DateUtils {

    /**
     * 
     * @param date 
     * @param fmt 字符串替换模板 yyyy-MM-dd 季度q 周w hh:mm:ss SSSS毫秒
     * @returns 
     */
    static format(date: Date, fmt: string) {
        const o = {
            'M+': date.getMonth() + 1, //月份
            'd+': date.getDate(), //日
            'h+': date.getHours(), //小时
            'm+': date.getMinutes(), //分
            's+': date.getSeconds(), //秒
            'q+': Math.floor((date.getMonth() + 3) / 3), //季度
            S: date.getMilliseconds() //毫秒
        }
        type ot = typeof o
        const yearMatches = /(y+)/.exec(fmt)
        if (yearMatches) {
            fmt = fmt.replace(
                yearMatches[1],
                (date.getFullYear() + '').substring(4 - yearMatches[1].length)
            )
        }
        const weekdayMatches = /(w+)/.exec(fmt)
        const weekday = ['日', '一', '二', '三', '四', '五', '六']
        if (weekdayMatches) {
            fmt = fmt.replace(weekdayMatches[1], weekday[date.getDay()])
        }
        for (const k in o) {
            const pattern = new RegExp('(' + k + ')')
            const matches = pattern.exec(fmt)
            if (matches) {
                const str =
                    matches[1].length == 1
                        ? o[k as keyof ot]
                        : ('00' + o[k as keyof ot]).substring(('' + o[k as keyof ot]).length)
                fmt = fmt.replace(matches[1], String(str))
            }
        }
        return fmt
    }

    /**
     * 
     * @param fmt 字符串替换模板 yyyy-MM-dd 季度q 周w hh:mm:ss SSSS毫秒
     * @returns 
     */
    static newDate(fmt: string) {
        return this.format(new Date(), fmt)
    }
}

export default DateUtils