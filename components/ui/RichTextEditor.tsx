"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Dynamically import ReactQuill to prevent "document is not defined" SSR errors
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface RichTextEditorProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

export default function RichTextEditor({
	value,
	onChange,
	placeholder,
}: RichTextEditorProps) {
	const modules = {
		toolbar: [
			[{ header: [1, 2, 3, false] }],
			["bold", "italic", "underline", "strike"],
			[{ list: "ordered" }, { list: "bullet" }],
			[{ color: [] }, { background: [] }],
			["link", "clean"],
		],
	};

	const formats = [
		"header",
		"bold",
		"italic",
		"underline",
		"strike",
		"list",
		"bullet",
		"color",
		"background",
		"link",
	];

	return (
		<div className="bg-white rounded-md border border-input [&_.ql-toolbar]:rounded-t-md [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-container]:rounded-b-md [&_.ql-container]:border-none [&_.ql-container]:min-h-[150px] [&_.ql-editor]:min-h-[150px] [&_.ql-editor]:text-base">
			<ReactQuill
				theme="snow"
				value={value}
				onChange={onChange}
				modules={modules}
				formats={formats}
				placeholder={placeholder || "Write description here..."}
			/>
		</div>
	);
}
