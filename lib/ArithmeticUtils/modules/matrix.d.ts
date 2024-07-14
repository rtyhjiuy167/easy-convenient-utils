declare class MatrixUtils {
    /**
     * 柱状图中最大的矩形（暴力）
     * 思路：对于给定的数组list[2,1,5,6,2,3]，对其进行遍历，向左右两边扩散。
     *       当左边的高度小于等于当前的元素时，可以扩散，右边同理，扩散完毕后，即可计算当前的面积（当前元素高度乘以长度）。
     * @param heights
     * @returns
     */
    static largestRectangleAreaByViolence(heights: number[]): number;
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
    static largestRectangleAreaByStack(heights: number[]): number;
    /**
     * 矩阵转置
     * @param arr 二维矩阵
     * @returns
     */
    static transpose(arr: Array<Array<number | string>>): any[][];
    /**
     * 获得矩形状的01矩阵的含1的最大面积及其对应的四个坐标点
     * @param matrix 矩形状的01矩阵
     * @returns
     */
    static maximalRectangle(matrix: Array<Array<string | number>>): {
        maxArea: number;
        pts: number[][];
    };
}
export default MatrixUtils;
