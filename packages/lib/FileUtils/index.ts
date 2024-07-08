
export interface FileInfo {
    path: string
    name: string
    title: string
    type: string
    url?: string
}
type CB = (data: any) => void

class FileUtils {
    private statSync: any
    private readdirSync: any
    private readFile: any

    /**
     * 
     * @param statSync fs.statSync
     * @param readdirSync fs.readdirSync
     * @param readFile fs.readFile
     */
    constructor(statSync: any, readdirSync: any, readFile: any) {
        this.statSync = statSync
        this.readdirSync = readdirSync
        this.readFile = readFile
    }

    pathJoin(...args: string[]) {
        return args.map(arg => arg.replace(/^\/|\/$/g, '')).join('\\');
    }

    isFile(path: string) {
        const stat = this.statSync(path)
        return stat.isFile()
    }

    isDir(path: string) {
        const stat = this.statSync(path)
        return stat.isDirectory()
    }

    getFileType(pathOrName: string) {
        const s = pathOrName.split('.')
        const type = s[s.length - 1]
        return type
    }

    getAllFilesInfo(dir: string, deep: boolean) {
        const fileList: Array<FileInfo> = []
        const _getAllFilesPath = (dir: string, deep: boolean, fileList: FileInfo[]) => {
            const fileOrDirNamelist = this.readdirSync(dir)
            for (let i = 0; i < fileOrDirNamelist.length; i++) {
                const fileOrDirName = fileOrDirNamelist[i]
                const fileOrDirPath = this.pathJoin(dir, fileOrDirName)
                if (this.isFile(fileOrDirPath)) {
                    const s = fileOrDirName.split('.')
                    const title = s[0]
                    const type = s[1]
                    fileList.push({ path: fileOrDirPath, name: fileOrDirName, title, type })
                } else if (deep) {
                    _getAllFilesPath(fileOrDirPath, deep, fileList)
                }
            }
        }
        _getAllFilesPath(dir, deep, fileList)
        return fileList
    }

    /**
     * 获取目标文件夹下的所有的文件且该文件的后缀为图像形式
     * @param dir 文件夹路径
     * @param deep 是否递归读取
     * @returns
     */
    getAllImgFilesInfo(dir: string, deep: boolean) {
        const filesPathList = this.getAllFilesInfo(dir, deep)
        return filesPathList.filter((item) => {
            return ['jpg', 'png', 'jpeg'].includes(item.type)
        })
    }

    imgsFolderWatch({
        dir,
        deep,
        gap,
        endFunc,
        changeFunc
    }: {
        dir: string
        deep: boolean
        gap: number
        endFunc?: (imgsInfoList: FileInfo[]) => boolean
        changeFunc: (imgsInfoList: FileInfo[]) => void
    }) {
        let num = 0
        const interval = setInterval(() => {
            const infoList = this.getAllImgFilesInfo(dir, deep)
            if (endFunc && endFunc(infoList)) {
                clearInterval(interval)
            }
            if (num != infoList.length) {
                changeFunc(infoList)
                num = infoList.length
            }
        }, gap)
        return interval
    }

    /**
     *
     * @param path 图像路径
     * @param type 图像类型
     * @param cb 回调函数
     * @returns
     */
    changeImgFile2Base64({
        path,
        cb
    }: {
        path: string
        cb?: CB
    }): Promise<string> {
        return new Promise((resolve, _) => {
            this.readFile(path, (err, data) => {
                if (err) {
                    console.error(err)
                    resolve("")
                }
                else {
                    const base64Image = `data:image/${this.getFileType(path)};base64,${data.toString('base64')}`
                    if (cb) cb(base64Image)
                    resolve(base64Image)
                }
            })
        })
    }

    /**
     * 获取目标文件夹下的所有图像信息，并转换成base64格式
     * @param dir 文件夹路径
     * @param deep 是否递归读取
     * @returns
     */
    getAllImgFilesBase64(dir: string, deep: boolean): Promise<FileInfo[]> {
        return new Promise((resolve, _) => {
            const infoList = this.getAllImgFilesInfo(dir, deep)
            let j = 0
            for (let i = 0; i < infoList.length; i++) {
                const info = infoList[i]
                const cb = (base64Image: string) => {
                    info.url = base64Image
                    j++
                    if (j === infoList.length) {
                        resolve(infoList)
                    }
                }
                this.changeImgFile2Base64({ path: info.path, cb })
            }
        })
    }
}

export default FileUtils

