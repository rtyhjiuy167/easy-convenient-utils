export interface FileInfo {
    path: string;
    name: string;
    title: string;
    type: string;
    url?: string;
}
type CB = (data: any) => void;
declare class FileUtils {
    private statSync;
    private readdirSync;
    private readFile;
    /**
     *
     * @param statSync fs.statSync
     * @param readdirSync fs.readdirSync
     * @param readFile fs.readFile
     */
    constructor(statSync: any, readdirSync: any, readFile: any);
    pathJoin(...args: string[]): string;
    isFile(path: string): any;
    isDir(path: string): any;
    getFileType(pathOrName: string): string;
    getAllFilesInfo(dir: string, deep: boolean): FileInfo[];
    /**
     * 获取目标文件夹下的所有的文件且该文件的后缀为图像形式
     * @param dir 文件夹路径
     * @param deep 是否递归读取
     * @returns
     */
    getAllImgFilesInfo(dir: string, deep: boolean): FileInfo[];
    imgsFolderWatch({ dir, deep, gap, initFunc, endFunc, changeFunc }: {
        dir: string;
        deep: boolean;
        gap: number;
        initFunc?: () => void;
        endFunc?: (imgsInfoList: FileInfo[]) => boolean;
        changeFunc: (imgsInfoList: FileInfo[]) => void;
    }): NodeJS.Timeout;
    /**
     *
     * @param path 图像路径
     * @param type 图像类型
     * @param cb 回调函数
     * @returns
     */
    changeImgFile2Base64({ path, cb }: {
        path: string;
        cb?: CB;
    }): Promise<string>;
    /**
     * 获取目标文件夹下的所有图像信息，并转换成base64格式
     * @param dir 文件夹路径
     * @param deep 是否递归读取
     * @returns
     */
    getAllImgFilesBase64(dir: string, deep: boolean): Promise<FileInfo[]>;
}
export default FileUtils;
