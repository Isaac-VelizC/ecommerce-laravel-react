import { Editor } from "@tinymce/tinymce-react";
import React, { useRef } from "react";

const EditorText = ({ height = 300, ...props }) => {
    const editorRef = useRef<any>(null);
    return (
        <div className="mt-1">
            <Editor
                apiKey="ffw1zlg0hr0zawwie75ga36a49ynmdv11366r0xj2j0lsobt"
                {...props}
                onInit={(_evt, editor) => (editorRef.current = editor)}
                init={{
                    height: height,
                    menubar: false,
                    plugins: [
                        "advlist autolink lists link image charmap preview anchor",
                        "searchreplace visualblocks code fullscreen",
                        "insertdatetime media table code help wordcount",
                    ],
                    toolbar:
                        "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                    language: "en",
                    content_style:
                        "body { font-family: Arial, sans-serif; font-size: 16px; color: #121212; }",
                }}
            />
        </div>
    );
};

export default EditorText;
