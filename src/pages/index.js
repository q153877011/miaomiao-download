import fs from 'fs';
import path from 'path';
import Head from 'next/head'; // 用于设置页面标题等
import React from 'react';
import { Popup, Button } from 'tdesign-react/lib/';
import styles from '../styles/index.module.css'

export async function getStaticProps(context) {
    const zipDirectoryPath = path.join(process.cwd(), 'public', 'file');

    let files = [];
    let error = null;

    try {
        const fileNames = fs.readdirSync(zipDirectoryPath);
        console.log(fileNames);
        fileNames.forEach((fileName) => {
            const temp = {
                name: fileName,
                img: '',
                file: ''
            }
            console.log(path.join(process.cwd(), 'public', 'file', fileName))
            const now_files = fs.readdirSync(path.join(process.cwd(), 'public', 'file', fileName));

            temp.file = now_files.filter(file => file.endsWith('.zip'))[0];
            temp.img = now_files.filter(file => file.endsWith('.png'))[0];
            files.push({...temp});
        })
    } catch (e) {
        console.error("Error reading /public/zip directory:", e);
        error = "无法读取文件列表，请检查服务器配置。"; // 提供一个用户友好的错误信息
        files = []; 
    }

    return {
        props: {
            files,
            error,
        },
    };
}

export default function Home({ files, error }) {
  const [visible, setVisible] = React.useState(false);
  
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
            .PopupContent {
                background-color: black;
            }
        `}</style>

        <main>
            {
                visible ?
                    <div className={styles.popupContent}>
                        <div className={styles.button}>
                            <a href="https://edgeone.ai/pages/drop?from=miaomiao" target="_blank">
                                <Button shape="round" style={{padding: 20}}>
                                    🚀 立即体验
                                </Button>
                            </a>
                        </div>
                        <div className={styles.desc}>
                            EdgeOne Pages Drop 免费的文件托管和文件部署服务。
                        </div>
                    </div>
                :
                    <div></div>

            }
            
            {!error && files.length === 0 && (
                <p className="no-files">暂无文件可供下载。</p>
            )}

            {/* 如果没有错误且文件列表不为空，则渲染表格 */}
            {!error && files.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>预览图</th>
                            <th>模型名称</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map((fileObj) => (
                            <tr key={fileObj.name}> {/* 使用文件名作为 key */}
                                <td>
                                   <img src={`/file/${encodeURIComponent(fileObj.name)}/${encodeURIComponent(fileObj.img)}`} className={styles.preImg}></img>
                                </td>
                                <td>
                                    <a href={`/file/${encodeURIComponent(fileObj.name)}/${encodeURIComponent(fileObj.file)}`} download={fileObj.file} onClick={() => setVisible(true)}>
                                        {fileObj.name}
                                    </a>
                                </td>
                                <td>
                                    <a href={`/file/${encodeURIComponent(fileObj.name)}/${encodeURIComponent(fileObj.file)}`} download={fileObj.file} className="download-button" onClick={() => setVisible(true)}>
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
