import fs from 'fs';
import path from 'path';
import Head from 'next/head'; // 用于设置页面标题等

export async function getStaticProps(context) {
    // 构建到 public/zip 目录的绝对路径
    // process.cwd() 获取当前工作目录，在 Next.js 中通常是项目根目录
    const zipDirectoryPath = path.join(process.cwd(), 'public', 'zip');

    let files = [];
    let error = null;

    try {
        // 读取目录内容
        // fs.readdirSync 是同步读取，适合在 getServerSideProps 中使用
        const fileNames = fs.readdirSync(zipDirectoryPath);

        // 可选：过滤只保留 .zip 文件，如果你的目录里有其他文件的话
        files = fileNames.filter(name => name.endsWith('.zip'));

        // 如果需要排除隐藏文件或特定文件，可以在这里添加更多过滤逻辑
        // files = files.filter(name => !name.startsWith('.'));

    } catch (e) {
        // 如果目录不存在或读取失败，捕获错误
        console.error("Error reading /public/zip directory:", e);
        error = "无法读取文件列表，请检查服务器配置。"; // 提供一个用户友好的错误信息
        files = []; // 确保在出错时文件列表为空
    }

    // 将文件列表和可能的错误作为 props 传递给页面组件
    return {
        props: {
            files,
            error,
        },
    };
}

export default function Home({ files, error }) {
  return (
    <div>
        <Head>
            <title>模型下载列表</title>
            <meta name="description" content="下载项目文件" />
            <link rel="icon" href="/favicon.svg" />
        </Head>

        {/* 使用 style jsx 可以在组件内部写 CSS，Next.js 会处理 */}
        <style jsx>{`
            body {
                font-family: sans-serif;
                line-height: 1.6;
                margin: 20px;
            }
            table {
                width: 80%;
                border-collapse: collapse;
                margin-top: 20px;
                margin-left: auto;
                margin-right: auto;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 10px;
                text-align: left;
            }
            th {
                background-color: #f2f2f2;
            }
            a {
                text-decoration: none;
                color: #007bff;
            }
            a:hover {
                text-decoration: underline;
            }
            .download-button {
                display: inline-block;
                padding: 5px 10px;
                background-color: #28a745;
                color: white;
                border-radius: 4px;
                cursor: pointer;
                text-align: center; /* 按钮文字居中 */
            }
            .download-button:hover {
                background-color: #218838;
                text-decoration: none; /* 防止按钮文字下划线 */
            }
            .error-message {
                color: red;
                text-align: center;
                margin-top: 20px;
            }
            .no-files {
                  text-align: center;
                  margin-top: 20px;
            }
        `}</style>

        <main>
            {/* 显示错误信息（如果存在） */}
            {error && <p className="error-message">{error}</p>}

            {/* 如果没有错误且文件列表为空 */}
            {!error && files.length === 0 && (
                <p className="no-files">暂无文件可供下载。</p>
            )}

            {/* 如果没有错误且文件列表不为空，则渲染表格 */}
            {!error && files.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>模型名称</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* 遍历文件列表，为每个文件创建一行 */}
                        {files.map((fileName) => (
                            <tr key={fileName}> {/* 使用文件名作为 key */}
                                <td>
                                    {/* 文件名链接，点击下载 */}
                                    <a href={`/zip/${encodeURIComponent(fileName)}`} download={fileName}>
                                        {fileName}
                                    </a>
                                </td>
                                <td>
                                    {/* 下载按钮链接，点击下载 */}
                                    <a href={`/zip/${encodeURIComponent(fileName)}`} download={fileName} className="download-button">
                                        下载
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </main>
    </div>
  );
}
