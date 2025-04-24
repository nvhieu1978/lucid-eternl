declare namespace _default {
    let tasks: {
        build: string;
        "build:core": string;
        publish: string;
        test: string;
        "test:core": string;
    };
    namespace lint {
        let include: string[];
        let exclude: string[];
    }
    let nodeModulesDir: string;
    let name: string;
    let version: string;
    let license: string;
    let exports: {
        ".": string;
        "./blueprint": string;
    };
    let author: string;
    let description: string;
    let repository: string;
}
export default _default;
