declare module "react-quill-new" {
	import * as React from "react";

	export interface ReactQuillProps {
		value?: string;
		defaultValue?: string;
		readOnly?: boolean;
		theme?: string;
		modules?: any;
		formats?: string[];
		bounds?: string | HTMLElement;
		placeholder?: string;
		preserveWhitespace?: boolean;
		tabIndex?: number;
		onChange?: (value: string, delta: any, source: string, editor: any) => void;
		onChangeSelection?: (selection: any, source: string, editor: any) => void;
		onFocus?: (selection: any, source: string, editor: any) => void;
		onBlur?: (previousSelection: any, source: string, editor: any) => void;
		onKeyDown?: React.EventHandler<any>;
		onKeyPress?: React.EventHandler<any>;
		onKeyUp?: React.EventHandler<any>;
		id?: string;
		className?: string;
	}

	export default class ReactQuill extends React.Component<ReactQuillProps> {
		focus(): void;
		blur(): void;
		getEditor(): any;
	}
}
