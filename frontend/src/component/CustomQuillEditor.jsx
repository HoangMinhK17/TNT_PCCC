import React, { useRef, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { message } from 'antd';
import { uploadImageToCloudinary } from '../utils/imageApi';

const CustomQuillEditor = ({ value, onChange, folder = "tnt_shared_uploads", style }) => {
    const quillRef = useRef(null);

    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (file) {
                const hide = message.loading('Đang tải ảnh lên...', 0);
                try {
                    const url = await uploadImageToCloudinary(file, folder);
                    hide();
                    const quill = quillRef.current.getEditor();
                    const range = quill.getSelection(true);
                    quill.insertEmbed(range.index, 'image', url);
                    quill.setSelection(range.index + 1);
                } catch (error) {
                    hide();
                    message.error("Tải ảnh thất bại!");
                }
            }
        };
    };

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link', 'image', 'video'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        }
    }), [folder]);

    return (
        <ReactQuill 
            ref={quillRef} 
            theme="snow" 
            modules={modules} 
            value={value || ''} 
            onChange={onChange} 
            style={style} 
        />
    );
};

export default CustomQuillEditor;
