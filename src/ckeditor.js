/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

// The editor creator to use.
import BalloonEditorBase from '@ckeditor/ckeditor5-editor-balloon/src/ballooneditor';

import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript';
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat';
import Link from '../vendors/ckeditor5-link/src/link';
import Essentials from '../vendors/ckeditor5-essentials/src/essentials';
import Heading from '../vendors/ckeditor5-heading/src/heading';
import List from '../vendors/ckeditor5-list/src/list';
import Font from '../vendors/ckeditor5-font/src/font';

export default class BalloonEditor extends BalloonEditorBase {}

// Plugins to include in the build.
BalloonEditor.builtinPlugins = [
	RemoveFormat,
	Essentials,
	UploadAdapter,
	Autoformat,
	Bold,
	Italic,
	Underline,
	Strikethrough,
	Subscript,
	Superscript,
	BlockQuote,
	CKFinder,
	EasyImage,
	Heading,
	Image,
	ImageCaption,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	Link,
	List,
	MediaEmbed,
	Paragraph,
	PasteFromOffice,
	Table,
	TableToolbar,
	Font,
	Alignment,
];

// Editor configuration.
BalloonEditor.defaultConfig = {
	fontSize: { options: [ 48, 36, 24, 20, 16, 14, 12, 10, 9, 'default' ] },
	alignment: { options: [ 'left', 'right', 'center', 'justify' ] },
	toolbar: {
		items: [
			'removeFormat', 'heading', '|', 'bold', 'italic', 'underline', 'subscript', 'superscript', 'link',
			'undo', 'redo', 'fontColor', '|',
			'alignment', 'bulletedList', 'numberedList', 'blockQuote'
		]
	},
	heading: {
		options: [
			{
				model: 'paragraph',
				view: {
					name: 'p',
					classes: 'theme-style-default'
				},
				title: 'default'
			},
			{
				model: 'heading1',
				view: {
					name: 'h1',
					classes: 'theme-style-h1'
				},
				title: 'Heading 1',
				defaultTagConversion: true
			},
			{
				model: 'heading2',
				view: {
					name: 'h2',
					classes: 'theme-style-h2'
				},
				title: 'Heading 2',
				defaultTagConversion: true
			},
			{
				model: 'heading3',
				view: {
					name: 'h3',
					classes: 'theme-style-h3'
				},
				title: 'Heading 3',
				defaultTagConversion: true
			},
			{
				model: 'heading4',
				view: {
					name: 'h4',
					classes: 'theme-style-h4'
				},
				title: 'Heading 4',
				defaultTagConversion: true

			},
			{
				model: 'heading5',
				view: {
					name: 'h5',
					classes: 'theme-style-h5'
				},
				title: 'Heading 5',
				defaultTagConversion: true
			},
			{
				model: 'heading6',
				view: {
					name: 'h6',
					classes: 'theme-style-h6'
				},
				title: 'Heading 6',
				defaultTagConversion: true
			},
			{
				model: 'text1',
				view: {
					name: 'div',
					classes: 'theme-style-text1'
				},
				title: 'Text1'
			},
			{
				model: 'text2',
				view: {
					name: 'div',
					classes: 'theme-style-text2'
				},
				title: 'Text2'
			},
			{
				model: 'text3',
				view: {
					name: 'div',
					classes: 'theme-style-text3'
				},
				title: 'Text3'
			},
		]
	},
	link: {
		// Automatically add target="_blank" and rel="noopener noreferrer" to all external links.
		// addTargetToExternalLinks: true,
		// Allow users control the "downloadable" attribute of each link.
		decorators: [
			{
				mode: 'manual',
				label: 'Open in new window',
				attributes: {
					target: '_blank'
				}
			},
			{
				mode: 'automatic',
				callback: () => true,
				attributes: {
					class: 'theme-style-link',
				}
			}
		]
	},
	list: {
		decorators: [
			{
				mode: 'automatic',
				callback: () => true,
				attributes: {
					class: 'theme-style-list',
				}
			}
		]
	},
	image: {
		toolbar: [
			'imageStyle:full',
			'imageStyle:side',
			'|',
			'imageTextAlternative'
		]
	},
	table: {
		contentToolbar: [
			'tableColumn',
			'tableRow',
			'mergeTableCells'
		]
	},
	// This value must be kept in sync with the language defined in webpack.config.js.
	language: 'en'
};
