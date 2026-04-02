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

        input.onchange = () => {
            const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const base64 = e.target.result;
                    const quill = quillRef.current.getEditor();
                    const range = quill.getSelection(true);
                    quill.insertEmbed(range.index, 'image', base64);
                    quill.setSelection(range.index + 1);
                };
                reader.readAsDataURL(file);
            }
        };
    };

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link', 'image', 'video'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        }
    }), [folder]);

    return (
        <div className="custom-quill-container">
            <style>
                {`
                    .custom-quill-container .ql-editor img {
                        width: calc(50% - 10px);
                        height: auto;
                        display: inline-block;
                        vertical-align: top;
                        margin: 5px;
                        box-sizing: border-box;
                    }
                `}
            </style>
            <ReactQuill
                ref={quillRef}
                theme="snow"
                modules={modules}
                value={value || ''}
                onChange={onChange}
                style={style}
            />
        </div>
    );
};

export default CustomQuillEditor;
