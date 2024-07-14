class MatrixUtils {
    /**
     * 柱状图中最大的矩形（暴力）
     * 思路：对于给定的数组list[2,1,5,6,2,3]，对其进行遍历，向左右两边扩散。
     *       当左边的高度小于等于当前的元素时，可以扩散，右边同理，扩散完毕后，即可计算当前的面积（当前元素高度乘以长度）。
     * @param heights 
     * @returns 
     */
    static largestRectangleAreaByViolence(heights: number[]): number {
        let max = 0
        for (let j = 0; j < heights.length; j++) {
            let i = j - 1;
            let k = j + 1;
            let temp = heights[j]
            while (true) {
                if (i >= 0 && heights[j] <= heights[i]) {
                    temp += heights[j]
                    i--
                };
                if (k < heights.length && heights[j] <= heights[k]) {
                    temp += heights[j]
                    k++
                };
                if ((i < 0 || heights[j] > heights[i]) && (k >= heights.length || heights[j] > heights[k])) {
                    if (max < temp) max = temp
                    break;
                }
            }
        }
        return max
    }
    /**
     * 柱状图中最大的矩形（单调栈）
     * 思路：计算各个元素的左右边界，使用left和right两个数组记录。
     *       计算left边界时，借助一个stack[]。
     *       对各个元素进行遍历，当stack不为空且栈顶的元素大于等于当前元素时，说明不是边界，移除栈顶，直到不满足条件。
     *       此时，记录边界索引，并将该元素索引入栈（因为其最小，不需要再比较比其大了）作为下个元素判断的左边界。
     *       右边界同理。
     *       最后（右边界-左边界-1）*高即可。
     * @param matrix 
     * @returns 
     */
    static largestRectangleAreaByStack(heights: number[]): number {
        let left: number[] = []
        let right: number[] = []
        let stack: number[] = []
        for (let i = 0; i < heights.length; i++) {
            while (stack.length && heights[stack[stack.length - 1]] >= heights[i]) {
                stack.pop()
            }
            left[i] = stack.length === 0 ? -1 : stack[stack.length - 1]
            stack.push(i)
        }
        stack = []
        for (let i = heights.length - 1; i >= 0; i--) {
            while (stack.length && heights[stack[stack.length - 1]] >= heights[i]) {
                stack.pop()
            }
            right[i] = stack.length === 0 ? heights.length : stack[stack.length - 1]
            stack.push(i)
        }
        let max = 0
        for (let i = 0; i < heights.length; i++) {
            let t = (right[i] - left[i] - 1) * heights[i]
            max = max < t ? t : max
        }
        return max
    };
    /**
     * 矩阵转置
     * @param arr 二维矩阵
     * @returns 
     */
    static transpose(arr: Array<Array<number | string>>) {
        const res = new Array(arr[0].length).fill(0).map(() => new Array(arr.length))
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[i].length; j++) {
                res[j][i] = arr[i][j]
            }
        }
        return res
    }

    /**
     * 获得矩形状的01矩阵的含1的最大面积及其对应的四个坐标点
     * @param matrix 矩形状的01矩阵
     * @returns 
     */
    static maximalRectangle(matrix: Array<Array<string | number>>): { maxArea: number, pts: number[][] } {
        const m = matrix.length
        const res = { maxArea: 0, pts: [] as number[][] }
        if (!m) return res
        const n = matrix[0].length
        let left = new Array(m).fill(0).map(() => new Array(n).fill(0))
        // 计算每个元素到其左边连续为1的长度
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                if (Number(matrix[i][j]) === 1) {
                    left[i][j] = (j === 0 ? 0 : left[i][j - 1]) + 1
                }
            }
        }
        // 以列为单位，左侧为高
        // 按照求柱状图中最大的矩形方法，即largestRectangleAreaByStack 求出最大值
        for (let j = 0; j < n; j++) {
            const up: number[] = []
            const down: number[] = []
            let stack: number[] = []
            for (let i = 0; i < m; i++) {
                while (stack.length && left[stack[stack.length - 1]][j] >= left[i][j]) {
                    stack.pop()
                }
                up[i] = stack.length === 0 ? -1 : stack[stack.length - 1]
                stack.push(i)
            }
            stack = []
            for (let i = m - 1; i >= 0; i--) {
                while (stack.length && left[stack[stack.length - 1]][j] >= left[i][j]) {
                    stack.pop()
                }
                down[i] = stack.length === 0 ? m : stack[stack.length - 1]
                stack.push(i)
            }
            for (let i = 0; i < m; i++) {
                const height = down[i] - up[i] - 1;
                const area = height * left[i][j];
                if (res.maxArea < area) {
                    res.maxArea = area
                    res.pts[0] = [up[i] + 1, j - height + 1]
                    res.pts[1] = [up[i] + 1, j]
                    res.pts[2] = [down[i] - 1, j]
                    res.pts[3] = [down[i] - 1, j - height + 1]
                }
            }
        }
        return res
    };
}

export default MatrixUtils