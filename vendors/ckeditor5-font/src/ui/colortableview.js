/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module font/ui/colortableview
 */

import View from '@ckeditor/ckeditor5-ui/src/view';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import ColorTileView from '@ckeditor/ckeditor5-ui/src/colorgrid/colortileview';
import ColorGridView from '@ckeditor/ckeditor5-ui/src/colorgrid/colorgridview';
import InputTextView from '@ckeditor/ckeditor5-ui/src/inputtext/inputtextview';
import LabeledInputView from '@ckeditor/ckeditor5-ui/src/labeledinput/labeledinputview';
import LabelView from '@ckeditor/ckeditor5-ui/src/label/labelview';
import DocumentColorCollection from '../documentcolorcollection';
import Template from '@ckeditor/ckeditor5-ui/src/template';
import FocusTracker from '@ckeditor/ckeditor5-utils/src/focustracker';
import FocusCycler from '@ckeditor/ckeditor5-ui/src/focuscycler';
import KeystrokeHandler from '@ckeditor/ckeditor5-utils/src/keystrokehandler';
import removeButtonIcon from '@ckeditor/ckeditor5-core/theme/icons/eraser.svg';
import '../../theme/fontcolor.css';
import checkIcon from "@ckeditor/ckeditor5-core/theme/icons/check.svg";
import submitHandler from '@ckeditor/ckeditor5-ui/src/bindings/submithandler';

/**
 * A class which represents a view with the following sub–components:
 *
 * * A remove color button,
 * * A static {@link module:ui/colorgrid/colorgrid~ColorGridView} of colors defined in the configuration,
 * * A dynamic {@link module:ui/colorgrid/colorgrid~ColorGridView} of colors used in the document.
 *
 * @extends module:ui/view~View
 */
export default class ColorTableView extends View {
	/**
	 * Creates a view to be inserted as a child of {@link module:ui/dropdown/dropdownview~DropdownView}.
	 *
	 * @param {module:utils/locale~Locale} [locale] The localization services instance.
	 * @param {Object} config The configuration object.
	 * @param {Array.<module:ui/colorgrid/colorgrid~ColorDefinition>} config.colors An array with definitions of colors to
	 * be displayed in the table.
	 * @param {Number} config.columns The number of columns in the color grid.
	 * @param {String} config.removeButtonLabel The label of the button responsible for removing the color.
	 * @param {String} config.documentColorsLabel The label for the section with the document colors.
	 * @param {String} config.documentColorsCount The number of colors in document colors section inside dropdown.
	 */
	constructor( locale, { colors, columns, removeButtonLabel, documentColorsLabel, documentColorsCount } ) {
		super( locale );

		/**
		 * Collection of the children of the table.
		 *
		 * @readonly
		 * @member {module:ui/viewcollection~ViewCollection}
		 */
		this.items = this.createCollection();

		/**
		 * An array with objects representing colors to be displayed in the grid.
		 *
		 * @type {Arrray.<module:ui/colorgrid/colorgrid~ColorDefinition>}
		 */
		this.colorDefinitions = colors;

		/**
		 * Tracks information about DOM focus in the list.
		 *
		 * @readonly
		 * @member {module:utils/focustracker~FocusTracker}
		 */
		this.focusTracker = new FocusTracker();

		/**
		 * An instance of the {@link module:utils/keystrokehandler~KeystrokeHandler}.
		 *
		 * @readonly
		 * @member {module:utils/keystrokehandler~KeystrokeHandler}
		 */
		this.keystrokes = new KeystrokeHandler();

		/**
		 * Keeps value of the command associated with the table for the current selection.
		 *
		 * @type {String}
		 */
		this.set( 'selectedColor' );

		/**
		 * The label of the button responsible for removing color attributes.
		 *
		 * @type {String}
		 */
		this.removeButtonLabel = removeButtonLabel;

		/**
		 * The number of columns in the color grid.
		 *
		 * @type {Number}
		 */
		this.columns = columns;

		/**
		 * A collection of definitions stores document colors.
		 *
		 * @readonly
		 * @member {module:font/documentcolorcollection~DocumentColorCollection}
		 */
		this.documentColors = new DocumentColorCollection();

		/**
		 * Maximum number of colors in document colors section.
		 * If equals 0, then document colors section is not added.
		 *
		 * @readonly
		 * @type {Number}
		 */
		this.documentColorsCount = documentColorsCount;

		/**
		 * Preserves reference to {@link module:ui/colorgrid/colorgrid~ColorGridView} used to create
		 * default (static) colors set.
		 *
		 * @readonly
		 * @member {module:ui/colorgrid/colorgrid~ColorGridView}
		 */
		this.staticColorsGrid = this._createStaticColorsGrid();

		/**
		 * Preserves reference to {@link module:ui/labeledinputview~LabeledInputView} used to create dynamic colors input
		 *
		 * @readonly
		 * @member {module:ui/labeledinputview~LabeledInputView}
		 */
		this.dynamicColorsInput = this._createDynamicColorsInput();

		/**
		 * Preserves reference to {@link module:ui/colorgrid/colorgrid~ColorGridView} used to create
		 * document colors. It remains undefined if document colors are disabled.
		 *
		 * @readonly
		 * @member {module:ui/colorgrid/colorgrid~ColorGridView}
		 */
		this.documentColorGrid;

		/**
		 * Helps cycling over focusable {@link #items} in the list.
		 *
		 * @readonly
		 * @protected
		 * @member {module:ui/focuscycler~FocusCycler}
		 */
		this._focusCycler = new FocusCycler( {
			focusables: this.items,
			focusTracker: this.focusTracker,
			keystrokeHandler: this.keystrokes,
			actions: {
				// Navigate list items backwards using the Arrow Up key.
				focusPrevious: 'arrowup',

				// Navigate list items forwards using the Arrow Down key.
				focusNext: 'arrowdown',
			}
		} );

		this.setTemplate( {
			tag: 'div',
			attributes: {
				class: [
					'ck',
					'ck-color-table'
				]
			},
			children: this.items
		} );

		this.items.add( this._removeColorButton() );
		this.items.add( this.staticColorsGrid );
		this.items.add( this.dynamicColorsInput )

		this.saveButtonView = this._createButton( 'Save' , checkIcon, 'ck-button-save' );
		this.saveButtonView.type = 'submit';

		this.items.add( this.saveButtonView )

		if ( documentColorsCount ) {
			// Create a label for document colors.
			const bind = Template.bind( this.documentColors, this.documentColors );
			const label = new LabelView( this.locale );

			label.text = documentColorsLabel;
			label.extendTemplate( {
				attributes: {
					class: [
						'ck',
						'ck-color-grid__label',
						bind.if( 'isEmpty', 'ck-hidden' )
					]
				}
			} );

			this.items.add( label );

			this.documentColorsGrid = this._createDocumentColorsGrid();
			this.items.add( this.documentColorsGrid );
		}
	}

	/**
	 * Method scans through the editor's model and searches for text node attributes with attributeName.
	 * Found entries are set as document colors.
	 *
	 * All the previously stored document colors will be lost in the process.
	 *
	 * @param {module:engine/model/model~Model} model Model used as a source to obtain document colors.
	 * @param {String} attributeName Determines what is the name of a related model's attribute for given dropdown.
	 */
	updateDocumentColors( model, attributeName ) {
		const document = model.document;
		const maxCount = this.documentColorsCount;

		this.documentColors.clear();

		for ( const rootName of document.getRootNames() ) {
			const root = document.getRoot( rootName );
			const range = model.createRangeIn( root );

			for ( const node of range.getItems() ) {
				if ( node.is( 'textProxy' ) && node.hasAttribute( attributeName ) ) {
					this._addColorToDocumentColors( node.getAttribute( attributeName ) );

					if ( this.documentColors.length >= maxCount ) {
						return;
					}
				}
			}
		}
	}

	/**
	 * Method refresh state of `selectedColor` in single or both {@link module:ui/colorgrid/colorgrid~ColorGridView}
	 * available in {@link module:font/ui/colortableview~ColorTableView}. It guarantees that selection will occur only in one of them.
	 */
	updateSelectedColors() {
		const documentColorsGrid = this.documentColorsGrid;
		const staticColorsGrid = this.staticColorsGrid;
		const selectedColor = this.selectedColor;

		if ( !this.documentColors.isEmpty ) {
			if ( this.documentColors.hasColor( selectedColor ) ) {
				staticColorsGrid.selectedColor = null;
				documentColorsGrid.selectedColor = selectedColor;
			} else {
				staticColorsGrid.selectedColor = selectedColor;
				documentColorsGrid.selectedColor = null;
			}
		} else {
			staticColorsGrid.selectedColor = selectedColor;
		}
	}

	/**
	 * @inheritDoc
	 */
	render() {
		super.render();

		submitHandler( {
			view: this
		} );

		// Items added before rendering should be known to the #focusTracker.
		for ( const item of this.items ) {
			this.focusTracker.add( item.element );
		}

		// Start listening for the keystrokes coming from #element.
		this.keystrokes.listenTo( this.element );
	}

	/**
	 * Focuses the first focusable element in {@link #items}.
	 */
	focus() {
		this._focusCycler.focusFirst();
	}

	/**
	 * Focuses the last focusable element in {@link #items}.
	 */
	focusLast() {
		this._focusCycler.focusLast();
	}

	/**
	 * Adds the remove color button as a child of the current view.
	 *
	 * @private
	 * @returns {module:ui/button/buttonview~ButtonView}
	 */
	_removeColorButton() {
		const buttonView = new ButtonView();

		buttonView.set( {
			withText: true,
			icon: removeButtonIcon,
			tooltip: true,
			label: this.removeButtonLabel
		} );

		buttonView.class = 'ck-color-table__remove-color';
		buttonView.on( 'execute', () => {
			this.fire( 'execute', { value: null } );
		} );

		return buttonView;
	}

	/**
	 * Creates a static color table grid based on the editor configuration.
	 *
	 * @private
	 * @returns {module:ui/colorgrid/colorgrid~ColorGridView}
	 */
	_createStaticColorsGrid() {
		const colorGrid = new ColorGridView( this.locale, {
			colorDefinitions: this.colorDefinitions,
			columns: this.columns
		} );

		colorGrid.delegate( 'execute' ).to( this );

		return colorGrid;
	}

	/**
	 * Creates a dynamic color input
	 *
	 * @private
	 * @returns {module:ui/colorgrid/labeledinputview~LabeledInputView}
	 */
	_createDynamicColorsInput() {
		const t = this.locale.t;

		const labeledInput = new LabeledInputView( this.locale, InputTextView );
		const inputView = labeledInput.inputView;

		this._hexInputViewInfoDefault = t( 'Paste the color HEX code' );

		labeledInput.label = t( 'Color hex code' );
		labeledInput.infoText = this._urlInputViewInfoDefault;
		inputView.placeholder = '#000000';

		inputView.on( 'input', (evt, name, val) => {
			// Display the tip text only when there's some value. Otherwise fall back to the default info text.
			//labeledInput.infoText = 'HEX color'
			//console.log("val", inputView.element.value);
			//this._addColorToDocumentColors(inputView.element.value);
		} );

		inputView.on( 'blur', () => {
			console.log("submit", val);
			this._addColorToDocumentColors(val);
		} );

		return labeledInput;
	}

	/**
	 * Creates a button view.
	 *
	 * @private
	 * @param {String} label The button label.
	 * @param {String} icon The button's icon.
	 * @param {String} className The additional button CSS class name.
	 * @param {String} [eventName] An event name that the `ButtonView#execute` event will be delegated to.
	 * @returns {module:ui/button/buttonview~ButtonView} The button view instance.
	 */
	_createButton( label, icon, className, eventName ) {
		const button = new ButtonView( this.locale );

		button.set( {
			label,
			icon,
			tooltip: true
		} );

		button.extendTemplate( {
			attributes: {
				class: className
			}
		} );

		if ( eventName ) {
			button.delegate( 'execute' ).to( this, eventName );
		}

		return button;
	}


	/**
	 * Creates document colors section view and binds it to {@link #documentColors}.
	 *
	 * @private
	 * @returns {module:ui/colorgrid/colorgrid~ColorGridView}
	 */
	_createDocumentColorsGrid() {
		const bind = Template.bind( this.documentColors, this.documentColors );
		const documentColorsGrid = new ColorGridView( this.locale, {
			columns: this.columns
		} );

		documentColorsGrid.delegate( 'execute' ).to( this );

		documentColorsGrid.extendTemplate( {
			attributes: {
				class: bind.if( 'isEmpty', 'ck-hidden' )
			}
		} );

		documentColorsGrid.items.bindTo( this.documentColors ).using(
			colorObj => {
				const colorTile = new ColorTileView();

				colorTile.set( {
					color: colorObj.color,
					hasBorder: colorObj.options && colorObj.options.hasBorder
				} );

				if ( colorObj.label ) {
					colorTile.set( {
						label: colorObj.label,
						tooltip: true
					} );
				}

				colorTile.on( 'execute', () => {
					this.fire( 'execute', {
						value: colorObj.color
					} );
				} );

				return colorTile;
			}
		);

		// Selected color should be cleared when document colors became empty.
		this.documentColors.on( 'change:isEmpty', ( evt, name, val ) => {
			if ( val ) {
				documentColorsGrid.selectedColor = null;
			}
		} );

		return documentColorsGrid;
	}

	/**
	 * Method adds a given `color` to the document colors list. If possible, method will attempt to use
	 * data from the {@link #colorDefinitions} (label, color options).
	 *
	 * @private
	 * @param {String} color String which stores value of recently applied color.
	 */
	_addColorToDocumentColors( color ) {
		const predefinedColor = this.colorDefinitions
			.find( definition => definition.color === color );

		if ( !predefinedColor ) {
			this.documentColors.add( {
				color,
				label: color,
				options: {
					hasBorder: false
				}
			} );
		} else {
			this.documentColors.add( Object.assign( {}, predefinedColor ) );
		}
	}
}
