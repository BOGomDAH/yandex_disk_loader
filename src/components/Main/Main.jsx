import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import axios from "axios";
import {$api} from "../../http/index.js";
import image from "../../assets/file.jpg";
import {getAccessTokenFromUrl} from "../../utils/getAccessTokenFromUrl.js";

const Main = () => {
    const [maxFiles, setMaxFiles] = useState(100);
    const [path, setPath] = useState('uploadedFiles');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const token = getAccessTokenFromUrl(location);
        if (token) {
            localStorage.setItem("access_token", token);
        } else {
            window.location.href = '/login'
        }
    }, [location]);

    const handleLoad = async () => {
        const folderName = path === "" ? 'uploadedFiles' : path
        try {
            await $api.get(`?path=${encodeURIComponent(folderName)}`)

            for (const fileData of selectedFiles) {
                const getResponse = await $api.get(`/upload?path=${encodeURIComponent(  folderName + '/' + fileData.name)}`);
                await axios.put(getResponse.data.href, fileData)
            }

        } catch (error) {
            console.error("Ошибка при загрузке на Яндекс.Диск:", error.response);
        }
    }

    const handleFileChange = (event, maxFiles) => {
        const files = Array.from(event.target.files);
        if (files.length > maxFiles) {
            alert(`Максимальное количество файлов - ${maxFiles}. Выберите не более ${maxFiles} файлов.`);
            event.target.value = null;
            return;
        }
        setSelectedFiles(files);
    };

    const handleFileRemove = (fileName) => {
        const updatedFiles = selectedFiles.filter((file) => file.name !== fileName);
        setSelectedFiles(updatedFiles);
    };

    const handleInputChange = (event) => {
        const value = event.target.value;
        if (!value.includes('/')){
            setPath(value)
        }
    }

    return (
        <div>
            <h2>{selectedFiles.length ? `Выбранные файлы (${selectedFiles.length}) : ` : 'Выберите файлы'}</h2>
            <input
                type="text"
                className="path"
                placeholder="Название создаваемой папки (по умолчанию: uploadedFiles)"
                value={path}
                onChange={handleInputChange}
            />
            <ul>
                {selectedFiles.map((file) => {
                    const imageUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : image;
                    return (
                        <li key={file.name}>
                            <img
                                src={imageUrl}
                                alt={file.name}
                                style={{ maxWidth: '100px', maxHeight: '100px' }}
                            />
                            <p>{file.name}</p>
                            <button onClick={() => handleFileRemove(file.name)}>Удалить</button>
                        </li>
                    )
                })}
            </ul>
            <p className="p-default">Максимальное количество файлов: {maxFiles}</p>
            <label htmlFor="file_loader">Выбрать файлы</label>
            <input type="file" id="file_loader" className="hidden-file-input" multiple onChange={(e) => handleFileChange(e, maxFiles)} />
            {selectedFiles.length ? <button onClick={handleLoad}>Загрузить на Яндекс.Диск</button> : null}
        </div>
    );
};

export default Main;