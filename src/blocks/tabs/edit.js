/**
 * BLOCK: Kadence Tabs
 */

/**
 * Import Icons
 */
import icons from '../../icons';

/**
 * Import External
 */
import times from 'lodash/times';
import map from 'lodash/map';
import classnames from 'classnames';
import memoize from 'memize';
import WebfontLoader from '../../fontloader';
import GenIcon from '../../genicon';
import Ico from '../../svgicons';
import IcoNames from '../../svgiconsnames';
import FaIco from '../../faicons';
import FontIconPicker from '@fonticonpicker/react-fonticonpicker';
import TypographyControls from '../../typography-control';
import MeasurementControls from '../../measurement-control';
import AdvancedColorControl from '../../advanced-color-control';
/**
 * Import Css
 */
import './style.scss';
import './editor.scss';
const {
	Component,
	Fragment,
} = wp.element;
const {
	InnerBlocks,
	InspectorControls,
	RichText,
	BlockControls,
	AlignmentToolbar,
	BlockAlignmentToolbar,
} = wp.blockEditor;
const {
	Button,
	ButtonGroup,
	Tooltip,
	TabPanel,
	Dashicon,
	PanelBody,
	RangeControl,
	ToggleControl,
	SelectControl,
} = wp.components;
/**
 * Internal block libraries
 */
const { __, sprintf } = wp.i18n;

const ALLOWED_BLOCKS = [ 'kadence/tab' ];
/**
 * Returns the layouts configuration for a given number of panes.
 *
 * @param {number} panes Number of panes.
 *
 * @return {Object[]} Panes layout configuration.
 */
const getPanesTemplate = memoize( ( panes ) => {
	return times( panes, n => [ 'kadence/tab', { id: n + 1 } ] );
} );
/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const kttabsUniqueIDs = [];
/**
 * Build the row edit
 */
class KadenceTabs extends Component {
	constructor() {
		super( ...arguments );
		this.showSettings = this.showSettings.bind( this );
		this.state = {
			hovered: 'false',
			showPreset: false,
			user: ( kadence_blocks_params.user ? kadence_blocks_params.user : 'admin' ),
			settings: {},
		};
	}
	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			const oldBlockConfig = kadence_blocks_params.config[ 'kadence/tabs' ];
			const blockConfigObject = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : [] );
			if ( blockConfigObject[ 'kadence/tabs' ] !== undefined && typeof blockConfigObject[ 'kadence/tabs' ] === 'object' ) {
				Object.keys( blockConfigObject[ 'kadence/tabs' ] ).map( ( attribute ) => {
					this.props.attributes[ attribute ] = blockConfigObject[ 'kadence/tabs' ][ attribute ];
				} );
			} else if ( oldBlockConfig !== undefined && typeof oldBlockConfig === 'object' ) {
				Object.keys( oldBlockConfig ).map( ( attribute ) => {
					this.props.attributes[ attribute ] = oldBlockConfig[ attribute ];
				} );
			}
			if ( this.props.attributes.showPresets ) {
				this.setState( { showPreset: true } );
			}
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			kttabsUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else if ( kttabsUniqueIDs.includes( this.props.attributes.uniqueID ) ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			kttabsUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else {
			kttabsUniqueIDs.push( this.props.attributes.uniqueID );
		}
		const blockSettings = ( kadence_blocks_params.settings ? JSON.parse( kadence_blocks_params.settings ) : {} );
		if ( blockSettings[ 'kadence/tabs' ] !== undefined && typeof blockSettings[ 'kadence/tabs' ] === 'object' ) {
			this.setState( { settings: blockSettings[ 'kadence/tabs' ] } );
		}
	}
	showSettings( key ) {
		if ( undefined === this.state.settings[ key ] || 'all' === this.state.settings[ key ] ) {
			return true;
		} else if ( 'contributor' === this.state.settings[ key ] && ( 'contributor' === this.state.user || 'author' === this.state.user || 'editor' === this.state.user || 'admin' === this.state.user ) ) {
			return true;
		} else if ( 'author' === this.state.settings[ key ] && ( 'author' === this.state.user || 'editor' === this.state.user || 'admin' === this.state.user ) ) {
			return true;
		} else if ( 'editor' === this.state.settings[ key ] && ( 'editor' === this.state.user || 'admin' === this.state.user ) ) {
			return true;
		} else if ( 'admin' === this.state.settings[ key ] && 'admin' === this.state.user ) {
			return true;
		}
		return false;
	}
	saveArrayUpdate( value, index ) {
		const { attributes, setAttributes } = this.props;
		const { titles } = attributes;

		const newItems = titles.map( ( item, thisIndex ) => {
			if ( index === thisIndex ) {
				item = { ...item, ...value };
			}

			return item;
		} );
		setAttributes( {
			titles: newItems,
		} );
	}
	render() {
		const { attributes: { uniqueID, tabCount, blockAlignment, mobileLayout, currentTab, tabletLayout, layout, innerPadding, minHeight, maxWidth, titles, titleColor, titleColorHover, titleColorActive, titleBg, titleBgHover, titleBgActive, size, sizeType, lineType, lineHeight, tabLineHeight, tabSize, mobileSize, mobileLineHeight, letterSpacing, borderRadius, titleBorderWidth, titleBorderControl, titleBorder, titleBorderHover, titleBorderActive, typography, fontVariant, fontWeight, fontStyle, fontSubset, googleFont, loadGoogleFont, innerPaddingControl, contentBorder, contentBorderControl, contentBorderColor, titlePadding, titlePaddingControl, titleMargin, titleMarginControl, contentBgColor, tabAlignment, titleBorderRadiusControl, titleBorderRadius, iSize, startTab, enableSubtitle, subtitleFont }, className, setAttributes } = this.props;
		const layoutClass = ( ! layout ? 'tabs' : layout );
		const sizeTypes = [
			{ key: 'px', name: __( 'px' ) },
			{ key: 'em', name: __( 'em' ) },
		];
		const gconfig = {
			google: {
				families: [ typography + ( fontVariant ? ':' + fontVariant : '' ) ],
			},
		};
		const sgconfig = {
			google: {
				families: [ subtitleFont[ 0 ].family + ( subtitleFont[ 0 ].variant ? ':' + subtitleFont[ 0 ].variant : '' ) ],
			},
		};
		const sconfig = ( subtitleFont[ 0 ].google ? sgconfig : '' );
		const saveSubtitleFont = ( value ) => {
			const newUpdate = subtitleFont.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				subtitleFont: newUpdate,
			} );
		};
		const startlayoutOptions = [
			{ key: 'skip', name: __( 'Skip' ), icon: __( 'Skip' ) },
			{ key: 'simple', name: __( 'Simple' ), icon: icons.tabsSimple },
			{ key: 'boldbg', name: __( 'Boldbg' ), icon: icons.tabsBold },
			{ key: 'center', name: __( 'Center' ), icon: icons.tabsCenter },
			{ key: 'vertical', name: __( 'Vertical' ), icon: icons.tabsVertical },
		];
		const setInitalLayout = ( key ) => {
			if ( 'skip' === key ) {
			} else if ( 'simple' === key ) {
				setAttributes( {
					layout: 'tabs',
					tabAlignment: 'left',
					size: 1.1,
					sizeType: 'em',
					lineHeight: 1.4,
					lineType: 'em',
					titleBorderWidth: [ 1, 1, 0, 1 ],
					titleBorderControl: 'individual',
					titleBorderRadius: [ 4, 4, 0, 0 ],
					titleBorderRadiusControl: 'individual',
					titlePadding: [ 8, 20, 8, 20 ],
					titlePaddingControl: 'individual',
					titleMargin: [ 0, 8, -1, 0 ],
					titleMarginControl: 'individual',
					titleColor: '#444444',
					titleColorHover: '#444444',
					titleColorActive: '#444444',
					titleBg: '#ffffff',
					titleBgHover: '#ffffff',
					titleBgActive: '#ffffff',
					titleBorder: '#eeeeee',
					titleBorderHover: '#e2e2e2',
					titleBorderActive: '#bcbcbc',
					contentBgColor: '#ffffff',
					contentBorderColor: '#bcbcbc',
					contentBorder: [ 1, 1, 1, 1 ],
					contentBorderControl: 'linked',
				} );
			} else if ( 'boldbg' === key ) {
				setAttributes( {
					layout: 'tabs',
					tabAlignment: 'left',
					size: 1.1,
					sizeType: 'em',
					lineHeight: 1.4,
					lineType: 'em',
					titleBorderWidth: [ 0, 0, 0, 0 ],
					titleBorderControl: 'linked',
					titleBorderRadius: [ 4, 4, 0, 0 ],
					titleBorderRadiusControl: 'individual',
					titlePadding: [ 8, 20, 8, 20 ],
					titlePaddingControl: 'individual',
					titleMargin: [ 0, 8, 0, 0 ],
					titleMarginControl: 'individual',
					titleColor: '#222222',
					titleColorHover: '#222222',
					titleColorActive: '#ffffff',
					titleBg: '#eeeeee',
					titleBgHover: '#e2e2e2',
					titleBgActive: '#0a6689',
					titleBorder: '#eeeeee',
					titleBorderHover: '#eeeeee',
					titleBorderActive: '#eeeeee',
					contentBgColor: '#ffffff',
					contentBorderColor: '#0a6689',
					contentBorder: [ 3, 0, 0, 0 ],
					contentBorderControl: 'individual',
				} );
			} else if ( 'center' === key ) {
				setAttributes( {
					layout: 'tabs',
					tabAlignment: 'center',
					size: 1.1,
					sizeType: 'em',
					lineHeight: 1.4,
					lineType: 'em',
					titleBorderWidth: [ 0, 0, 4, 0 ],
					titleBorderControl: 'individual',
					titleBorderRadius: [ 4, 4, 0, 0 ],
					titleBorderRadiusControl: 'individual',
					titlePadding: [ 8, 20, 8, 20 ],
					titlePaddingControl: 'individual',
					titleMargin: [ 0, 8, 0, 0 ],
					titleMarginControl: 'individual',
					titleColor: '#555555',
					titleColorHover: '#555555',
					titleColorActive: '#0a6689',
					titleBg: '#ffffff',
					titleBgHover: '#ffffff',
					titleBgActive: '#ffffff',
					titleBorder: '#ffffff',
					titleBorderHover: '#eeeeee',
					titleBorderActive: '#0a6689',
					contentBgColor: '#ffffff',
					contentBorderColor: '#eeeeee',
					contentBorder: [ 1, 0, 0, 0 ],
					contentBorderControl: 'individual',
				} );
			} else if ( 'vertical' === key ) {
				setAttributes( {
					layout: 'vtabs',
					mobileLayout: 'accordion',
					tabAlignment: 'left',
					size: 1.1,
					sizeType: 'em',
					lineHeight: 1.4,
					lineType: 'em',
					titleBorderWidth: [ 4, 0, 4, 4 ],
					titleBorderControl: 'individual',
					titleBorderRadius: [ 10, 0, 0, 10 ],
					titleBorderRadiusControl: 'individual',
					titlePadding: [ 12, 8, 12, 20 ],
					titlePaddingControl: 'individual',
					titleMargin: [ 0, -4, 10, 0 ],
					titleMarginControl: 'individual',
					titleColor: '#444444',
					titleColorHover: '#444444',
					titleColorActive: '#444444',
					titleBg: '#eeeeee',
					titleBgHover: '#e9e9e9',
					titleBgActive: '#ffffff',
					titleBorder: '#eeeeee',
					titleBorderHover: '#e9e9e9',
					titleBorderActive: '#eeeeee',
					contentBgColor: '#ffffff',
					contentBorderColor: '#eeeeee',
					contentBorder: [ 4, 4, 4, 4 ],
					contentBorderControl: 'linked',
					minHeight: 400,
				} );
			}
		};
		const config = ( googleFont ? gconfig : '' );
		const fontMin = ( sizeType === 'em' ? 0.2 : 5 );
		const fontMax = ( sizeType === 'em' ? 12 : 200 );
		const fontStep = ( sizeType === 'em' ? 0.1 : 1 );
		const lineMin = ( lineType === 'em' ? 0.2 : 5 );
		const lineMax = ( lineType === 'em' ? 12 : 200 );
		const lineStep = ( lineType === 'em' ? 0.1 : 1 );
		const tabLayoutClass = ( ! tabletLayout ? 'inherit' : tabletLayout );
		const mobileLayoutClass = ( ! mobileLayout ? 'inherit' : mobileLayout );
		const classes = classnames( className, `kt-tabs-wrap kt-tabs-id${ uniqueID } kt-tabs-has-${ tabCount }-tabs kt-active-tab-${ currentTab } kt-tabs-layout-${ layoutClass } kt-tabs-block kt-tabs-tablet-layout-${ tabLayoutClass } kt-tabs-mobile-layout-${ mobileLayoutClass } kt-tab-alignment-${ tabAlignment }` );
		const mLayoutOptions = [
			{ key: 'tabs', name: __( 'Tabs' ), icon: icons.tabs },
			{ key: 'vtabs', name: __( 'Vertical Tabs' ), icon: icons.vtabs },
			{ key: 'accordion', name: __( 'Accordion' ), icon: icons.accordion },
		];
		const layoutOptions = [
			{ key: 'tabs', name: __( 'Tabs' ), icon: icons.tabs },
			{ key: 'vtabs', name: __( 'Vertical Tabs' ), icon: icons.vtabs },
		];
		const renderSVG = svg => (
			<GenIcon name={ svg } icon={ ( 'fa' === svg.substring( 0, 2 ) ? FaIco[ svg ] : Ico[ svg ] ) } />
		);
		const mobileControls = (
			<div>
				<PanelBody>
					<p className="components-base-control__label">{ __( 'Mobile Layout' ) }</p>
					<ButtonGroup aria-label={ __( 'Mobile Layout' ) }>
						{ map( mLayoutOptions, ( { name, key, icon } ) => (
							<Tooltip text={ name }>
								<Button
									key={ key }
									className="kt-layout-btn kt-tablayout"
									isSmall
									isPrimary={ mobileLayout === key }
									aria-pressed={ mobileLayout === key }
									onClick={ () => setAttributes( { mobileLayout: key } ) }
								>
									{ icon }
								</Button>
							</Tooltip>
						) ) }
					</ButtonGroup>
				</PanelBody>
			</div>
		);
		const tabletControls = (
			<PanelBody>
				<p className="components-base-control__label">{ __( 'Tablet Layout' ) }</p>
				<ButtonGroup aria-label={ __( 'Tablet Layout' ) }>
					{ map( mLayoutOptions, ( { name, key, icon } ) => (
						<Tooltip text={ name }>
							<Button
								key={ key }
								className="kt-layout-btn kt-tablayout"
								isSmall
								isPrimary={ tabletLayout === key }
								aria-pressed={ tabletLayout === key }
								onClick={ () => setAttributes( { tabletLayout: key } ) }
							>
								{ icon }
							</Button>
						</Tooltip>
					) ) }
				</ButtonGroup>
			</PanelBody>
		);

		const deskControls = (
			<Fragment>
				<PanelBody>
					<RangeControl
						label={ __( 'Tabs' ) }
						value={ tabCount }
						onChange={ ( nexttabs ) => {
							const newtabs = titles;
							if ( newtabs.length < nexttabs ) {
								const amount = Math.abs( nexttabs - newtabs.length );
								{ times( amount, n => {
									const tabnumber = nexttabs - n;
									newtabs.push( {
										text: sprintf( __( 'Tab %d' ), tabnumber ),
										icon: titles[ 0 ].icon,
										iconSide: titles[ 0 ].iconSide,
										onlyIcon: titles[ 0 ].onlyIcon,
									} );
								} ); }
								setAttributes( { titles: newtabs } );
								this.saveArrayUpdate( { iconSide: titles[ 0 ].iconSide }, 0 );
							}
							setAttributes( {
								tabCount: nexttabs,
							} );
						} }
						min={ 1 }
						max={ 24 }
					/>
					<p className="components-base-control__label">{ __( 'Layout' ) }</p>
					<ButtonGroup aria-label={ __( 'Layout' ) }>
						{ map( layoutOptions, ( { name, key, icon } ) => (
							<Tooltip text={ name }>
								<Button
									key={ key }
									className="kt-layout-btn kt-tablayout"
									isSmall
									isPrimary={ layout === key }
									aria-pressed={ layout === key }
									onClick={ () => {
										setAttributes( {
											layout: key,
										} );
									} }
								>
									{ icon }
								</Button>
							</Tooltip>
						) ) }
					</ButtonGroup>
					<h2>{ __( 'Set initial Open Tab' ) }</h2>
					<ButtonGroup aria-label={ __( 'initial Open Tab' ) }>
						{ times( tabCount, n => (
							<Button
								key={ n + 1 }
								className="kt-init-open-tab"
								isSmall
								isPrimary={ startTab === n + 1 }
								aria-pressed={ startTab === n + 1 }
								onClick={ () => setAttributes( { startTab: n + 1 } ) }
							>
								{ __( 'Tab' ) + ' ' + ( n + 1 ) }
							</Button>
						) ) }
					</ButtonGroup>
				</PanelBody>
			</Fragment>
		);
		const tabControls = (
			<TabPanel className="kt-inspect-tabs"
				activeClass="active-tab"
				tabs={ [
					{
						name: 'desk',
						title: <Dashicon icon="desktop" />,
						className: 'kt-desk-tab',
					},
					{
						name: 'tablet',
						title: <Dashicon icon="tablet" />,
						className: 'kt-tablet-tab',
					},
					{
						name: 'mobile',
						title: <Dashicon icon="smartphone" />,
						className: 'kt-mobile-tab',
					},
				] }>
				{
					( tab ) => {
						let tabout;
						if ( tab.name ) {
							if ( 'mobile' === tab.name ) {
								tabout = mobileControls;
							} else if ( 'tablet' === tab.name ) {
								tabout = tabletControls;
							} else {
								tabout = deskControls;
							}
						}
						return <div>{ tabout }</div>;
					}
				}
			</TabPanel>
		);
		const renderTitles = ( index ) => {
			return (
				<Fragment>
					<li className={ `kt-title-item kt-title-item-${ index } kt-tabs-svg-show-${ ( titles[ index ] && titles[ index ].onlyIcon ? 'only' : 'always' ) } kt-tabs-icon-side-${ ( titles[ index ] && titles[ index ].iconSide ? titles[ index ].iconSide : 'right' ) } kt-tabs-has-icon-${ ( titles[ index ] && titles[ index ].icon ? 'true' : 'false' ) } kt-tab-title-${ ( 1 + index === currentTab ? 'active' : 'inactive' ) }${ ( enableSubtitle ? ' kb-tabs-have-subtitle' : '' ) }` } style={ {
						margin: ( titleMargin ? titleMargin[ 0 ] + 'px ' + titleMargin[ 1 ] + 'px ' + titleMargin[ 2 ] + 'px ' + titleMargin[ 3 ] + 'px' : '' ),
					} }>
						<div className={ `kt-tab-title kt-tab-title-${ 1 + index }` } style={ {
							backgroundColor: titleBg,
							color: titleColor,
							fontSize: size + sizeType,
							lineHeight: lineHeight + lineType,
							fontWeight: fontWeight,
							fontStyle: fontStyle,
							letterSpacing: letterSpacing + 'px',
							fontFamily: ( typography ? typography : '' ),
							borderTopLeftRadius: borderRadius + 'px',
							borderTopRightRadius: borderRadius + 'px',
							borderWidth: ( titleBorderWidth ? titleBorderWidth[ 0 ] + 'px ' + titleBorderWidth[ 1 ] + 'px ' + titleBorderWidth[ 2 ] + 'px ' + titleBorderWidth[ 3 ] + 'px' : '' ),
							borderRadius: ( titleBorderRadius ? titleBorderRadius[ 0 ] + 'px ' + titleBorderRadius[ 1 ] + 'px ' + titleBorderRadius[ 2 ] + 'px ' + titleBorderRadius[ 3 ] + 'px' : '' ),
							padding: ( titlePadding ? titlePadding[ 0 ] + 'px ' + titlePadding[ 1 ] + 'px ' + titlePadding[ 2 ] + 'px ' + titlePadding[ 3 ] + 'px' : '' ),
							borderColor: titleBorder,
						} } onClick={ () => setAttributes( { currentTab: 1 + index } ) } onKeyPress={ () => setAttributes( { currentTab: 1 + index } ) } tabIndex="0" role="button">
							{ titles[ index ] && titles[ index ].icon && 'right' !== titles[ index ].iconSide && (
								<GenIcon className={ `kt-tab-svg-icon kt-tab-svg-icon-${ titles[ index ].icon } kt-title-svg-side-${ titles[ index ].iconSide }` } name={ titles[ index ].icon } size={ ( ! iSize ? '14' : iSize ) } icon={ ( 'fa' === titles[ index ].icon.substring( 0, 2 ) ? FaIco[ titles[ index ].icon ] : Ico[ titles[ index ].icon ] ) } htmltag="span" />
							) }
							{ ( undefined === enableSubtitle || ! enableSubtitle ) && (
								<RichText
									tagName="div"
									placeholder={ __( 'Tab Title' ) }
									value={ ( titles[ index ] && titles[ index ].text ? titles[ index ].text : sprintf( __( 'Tab%d' ), ( 1 + index ) ) ) }
									unstableOnFocus={ () => setAttributes( { currentTab: 1 + index } ) }
									onChange={ value => {
										this.saveArrayUpdate( { text: value }, index );
									} }
									formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
									className={ 'kt-title-text' }
									style={ {
										lineHeight: lineHeight + lineType,
									} }
									keepPlaceholderOnFocus
								/>
							) }
							{ enableSubtitle && (
								<div className="kb-tab-titles-wrap">
									<RichText
										tagName="div"
										placeholder={ __( 'Tab Title' ) }
										value={ ( titles[ index ] && titles[ index ].text ? titles[ index ].text : sprintf( __( 'Tab%d' ), ( 1 + index ) ) ) }
										unstableOnFocus={ () => setAttributes( { currentTab: 1 + index } ) }
										onChange={ value => {
											this.saveArrayUpdate( { text: value }, index );
										} }
										formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
										className={ 'kt-title-text' }
										style={ {
											lineHeight: lineHeight + lineType,
										} }
										keepPlaceholderOnFocus
									/>
									<RichText
										tagName="div"
										placeholder={ __( 'Tab subtitle' ) }
										value={ ( titles[ index ] && titles[ index ].subText ? titles[ index ].subText : '' ) }
										unstableOnFocus={ () => setAttributes( { currentTab: 1 + index } ) }
										onChange={ value => {
											this.saveArrayUpdate( { subText: value }, index );
										} }
										formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
										className={ 'kt-title-sub-text' }
										style={ {
											fontWeight: subtitleFont[ 0 ].weight,
											fontStyle: subtitleFont[ 0 ].style,
											fontSize: subtitleFont[ 0 ].size[ 0 ] + subtitleFont[ 0 ].sizeType,
											lineHeight: ( subtitleFont[ 0 ].lineHeight && subtitleFont[ 0 ].lineHeight[ 0 ] ? subtitleFont[ 0 ].lineHeight[ 0 ] + subtitleFont[ 0 ].lineType : undefined ),
											letterSpacing: subtitleFont[ 0 ].letterSpacing + 'px',
											fontFamily: ( subtitleFont[ 0 ].family ? subtitleFont[ 0 ].family : '' ),
											padding: ( subtitleFont[ 0 ].padding ? subtitleFont[ 0 ].padding[ 0 ] + 'px ' + subtitleFont[ 0 ].padding[ 1 ] + 'px ' + subtitleFont[ 0 ].padding[ 2 ] + 'px ' + subtitleFont[ 0 ].padding[ 3 ] + 'px' : '' ),
											margin: ( subtitleFont[ 0 ].margin ? subtitleFont[ 0 ].margin[ 0 ] + 'px ' + subtitleFont[ 0 ].margin[ 1 ] + 'px ' + subtitleFont[ 0 ].margin[ 2 ] + 'px ' + subtitleFont[ 0 ].margin[ 3 ] + 'px' : '' ),
										} }
										keepPlaceholderOnFocus
									/>
								</div>
							) }
							{ titles[ index ] && titles[ index ].icon && 'right' === titles[ index ].iconSide && (
								<GenIcon className={ `kt-tab-svg-icon kt-tab-svg-icon-${ titles[ index ].icon } kt-title-svg-side-${ titles[ index ].iconSide }` } name={ titles[ index ].icon } size={ ( ! iSize ? '14' : iSize ) } icon={ ( 'fa' === titles[ index ].icon.substring( 0, 2 ) ? FaIco[ titles[ index ].icon ] : Ico[ titles[ index ].icon ] ) } htmltag="span" />
							) }
						</div>
					</li>
				</Fragment>
			);
		};
		const renderPreviewArray = (
			<Fragment>
				{ times( tabCount, n => renderTitles( n ) ) }
			</Fragment>
		);
		const renderTitleSettings = ( index ) => {
			return (
				<PanelBody
					title={ __( 'Tab' ) + ' ' + ( index + 1 ) + ' ' + __( 'Icon' ) }
					initialOpen={ false }
				>
					<FontIconPicker
						icons={ IcoNames }
						value={ titles[ index ] && titles[ index ].icon ? titles[ index ].icon : '' }
						onChange={ value => {
							this.saveArrayUpdate( { icon: value }, index );
						} }
						appendTo="body"
						renderFunc={ renderSVG }
						theme="default"
						isMulti={ false }
					/>
					<SelectControl
						label={ __( 'Icon Location' ) }
						value={ ( titles[ index ] && titles[ index ].iconSide ? titles[ index ].iconSide : 'right' ) }
						options={ [
							{ value: 'right', label: __( 'Right' ) },
							{ value: 'left', label: __( 'Left' ) },
							{ value: 'top', label: __( 'Top' ) },
						] }
						onChange={ value => {
							this.saveArrayUpdate( { iconSide: value }, index );
						} }
					/>
					<ToggleControl
						label={ __( 'Show Only Icon?' ) }
						checked={ ( titles[ index ] && titles[ index ].onlyIcon ? titles[ index ].onlyIcon : false ) }
						onChange={ value => {
							this.saveArrayUpdate( { onlyIcon: value }, index );
						} }
					/>
				</PanelBody>
			);
		};
		const normalSettings = (
			<Fragment>
				<AdvancedColorControl
					label={ __( 'Title Color' ) }
					colorValue={ ( titleColor ? titleColor : '' ) }
					colorDefault={ '' }
					onColorChange={ ( value ) => setAttributes( { titleColor: value } ) }
				/>
				<AdvancedColorControl
					label={ __( 'Title Background' ) }
					colorValue={ ( titleBg ? titleBg : '' ) }
					colorDefault={ '' }
					onColorChange={ ( value ) => setAttributes( { titleBg: value } ) }
				/>
				<AdvancedColorControl
					label={ __( 'Title Border Color' ) }
					colorValue={ ( titleBorder ? titleBorder : '' ) }
					colorDefault={ '' }
					onColorChange={ ( value ) => setAttributes( { titleBorder: value } ) }
				/>
			</Fragment>
		);
		const hoverSettings = (
			<Fragment>
				<AdvancedColorControl
					label={ __( 'Hover Color' ) }
					colorValue={ ( titleColorHover ? titleColorHover : '' ) }
					colorDefault={ '' }
					onColorChange={ ( value ) => setAttributes( { titleColorHover: value } ) }
				/>
				<AdvancedColorControl
					label={ __( 'Hover Background' ) }
					colorValue={ ( titleBgHover ? titleBgHover : '' ) }
					colorDefault={ '' }
					onColorChange={ ( value ) => setAttributes( { titleBgHover: value } ) }
				/>
				<AdvancedColorControl
					label={ __( 'Hover Border Color' ) }
					colorValue={ ( titleBorderHover ? titleBorderHover : '' ) }
					colorDefault={ '' }
					onColorChange={ ( value ) => setAttributes( { titleBorderHover: value } ) }
				/>
			</Fragment>
		);
		const activeSettings = (
			<Fragment>
				<AdvancedColorControl
					label={ __( 'Active Color' ) }
					colorValue={ ( titleColorActive ? titleColorActive : '' ) }
					colorDefault={ '' }
					onColorChange={ ( value ) => setAttributes( { titleColorActive: value } ) }
				/>
				<AdvancedColorControl
					label={ __( 'Active Background' ) }
					colorValue={ ( titleBgActive ? titleBgActive : '' ) }
					colorDefault={ '' }
					onColorChange={ ( value ) => setAttributes( { titleBgActive: value } ) }
				/>
				<AdvancedColorControl
					label={ __( 'Active Border Color' ) }
					colorValue={ ( titleBorderActive ? titleBorderActive : '' ) }
					colorDefault={ '' }
					onColorChange={ ( value ) => setAttributes( { titleBorderActive: value } ) }
				/>
			</Fragment>
		);
		const sizeDeskControls = (
			<PanelBody>
				<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Size Type' ) }>
					{ map( sizeTypes, ( { name, key } ) => (
						<Button
							key={ key }
							className="kt-size-btn"
							isSmall
							isPrimary={ sizeType === key }
							aria-pressed={ sizeType === key }
							onClick={ () => setAttributes( { sizeType: key } ) }
						>
							{ name }
						</Button>
					) ) }
				</ButtonGroup>
				<RangeControl
					label={ __( 'Font Size' ) }
					value={ ( size ? size : '' ) }
					onChange={ ( value ) => setAttributes( { size: value } ) }
					min={ fontMin }
					max={ fontMax }
					step={ fontStep }
				/>
				<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Size Type' ) }>
					{ map( sizeTypes, ( { name, key } ) => (
						<Button
							key={ key }
							className="kt-size-btn"
							isSmall
							isPrimary={ lineType === key }
							aria-pressed={ lineType === key }
							onClick={ () => setAttributes( { lineType: key } ) }
						>
							{ name }
						</Button>
					) ) }
				</ButtonGroup>
				<RangeControl
					label={ __( 'Line Height' ) }
					value={ ( lineHeight ? lineHeight : '' ) }
					onChange={ ( value ) => setAttributes( { lineHeight: value } ) }
					min={ lineMin }
					max={ lineMax }
					step={ lineStep }
				/>
			</PanelBody>
		);
		const sizeTabletControls = (
			<PanelBody>
				<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Size Type' ) }>
					{ map( sizeTypes, ( { name, key } ) => (
						<Button
							key={ key }
							className="kt-size-btn"
							isSmall
							isPrimary={ sizeType === key }
							aria-pressed={ sizeType === key }
							onClick={ () => setAttributes( { sizeType: key } ) }
						>
							{ name }
						</Button>
					) ) }
				</ButtonGroup>
				<RangeControl
					label={ __( 'Tablet Font Size' ) }
					value={ ( tabSize ? tabSize : '' ) }
					onChange={ ( value ) => setAttributes( { tabSize: value } ) }
					min={ fontMin }
					max={ fontMax }
					step={ fontStep }
				/>
				<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Size Type' ) }>
					{ map( sizeTypes, ( { name, key } ) => (
						<Button
							key={ key }
							className="kt-size-btn"
							isSmall
							isPrimary={ lineType === key }
							aria-pressed={ lineType === key }
							onClick={ () => setAttributes( { lineType: key } ) }
						>
							{ name }
						</Button>
					) ) }
				</ButtonGroup>
				<RangeControl
					label={ __( 'Tablet Line Height' ) }
					value={ ( tabLineHeight ? tabLineHeight : '' ) }
					onChange={ ( value ) => setAttributes( { tabLineHeight: value } ) }
					min={ lineMin }
					max={ lineMax }
					step={ lineStep }
				/>
			</PanelBody>
		);
		const sizeMobileControls = (
			<PanelBody>
				<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Size Type' ) }>
					{ map( sizeTypes, ( { name, key } ) => (
						<Button
							key={ key }
							className="kt-size-btn"
							isSmall
							isPrimary={ sizeType === key }
							aria-pressed={ sizeType === key }
							onClick={ () => setAttributes( { sizeType: key } ) }
						>
							{ name }
						</Button>
					) ) }
				</ButtonGroup>
				<RangeControl
					label={ __( 'Mobile Font Size' ) }
					value={ ( mobileSize ? mobileSize : '' ) }
					onChange={ ( value ) => setAttributes( { mobileSize: value } ) }
					min={ fontMin }
					max={ fontMax }
					step={ fontStep }
				/>
				<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Size Type' ) }>
					{ map( sizeTypes, ( { name, key } ) => (
						<Button
							key={ key }
							className="kt-size-btn"
							isSmall
							isPrimary={ lineType === key }
							aria-pressed={ lineType === key }
							onClick={ () => setAttributes( { lineType: key } ) }
						>
							{ name }
						</Button>
					) ) }
				</ButtonGroup>
				<RangeControl
					label={ __( 'Mobile Line Height' ) }
					value={ ( mobileLineHeight ? mobileLineHeight : '' ) }
					onChange={ ( value ) => setAttributes( { mobileLineHeight: value } ) }
					min={ lineMin }
					max={ lineMax }
					step={ lineStep }
				/>
			</PanelBody>
		);
		const sizeTabControls = (
			<TabPanel className="kt-size-tabs"
				activeClass="active-tab"
				tabs={ [
					{
						name: 'desk',
						title: <Dashicon icon="desktop" />,
						className: 'kt-desk-tab',
					},
					{
						name: 'tablet',
						title: <Dashicon icon="tablet" />,
						className: 'kt-tablet-tab',
					},
					{
						name: 'mobile',
						title: <Dashicon icon="smartphone" />,
						className: 'kt-mobile-tab',
					},
				] }>
				{
					( tab ) => {
						let tabout;
						if ( tab.name ) {
							// check which size tab to show.
							if ( 'mobile' === tab.name ) {
								tabout = sizeMobileControls;
							} else if ( 'tablet' === tab.name ) {
								tabout = sizeTabletControls;
							} else {
								tabout = sizeDeskControls;
							}
						}
						return <div>{ tabout }</div>;
					}
				}
			</TabPanel>
		);
		const renderCSS = (
			<style>
				{ `.kt-tabs-id${ uniqueID } .kt-title-item:hover .kt-tab-title {
					color: ${ titleColorHover } !important;
					border-color: ${ titleBorderHover } !important;
					background-color: ${ titleBgHover } !important;
				}
				.kt-tabs-id${ uniqueID } .kt-title-item.kt-tab-title-active .kt-tab-title, .kt-tabs-id${ uniqueID } .kt-title-item.kt-tab-title-active:hover .kt-tab-title {
					color: ${ titleColorActive } !important;
					border-color: ${ titleBorderActive } !important;
					background-color: ${ titleBgActive } !important;
				}` }
			</style>
		);
		return (
			<Fragment>
				{ renderCSS }
				<BlockControls>
					<BlockAlignmentToolbar
						value={ blockAlignment }
						controls={ [ 'center', 'wide', 'full' ] }
						onChange={ value => setAttributes( { blockAlignment: value } ) }
					/>
					<AlignmentToolbar
						value={ tabAlignment }
						onChange={ ( nextAlign ) => {
							setAttributes( { tabAlignment: nextAlign } );
						} }
					/>
				</BlockControls>
				{ this.showSettings( 'allSettings' ) && (
					<InspectorControls>
						{ this.showSettings( 'tabLayout' ) && (
							tabControls
						) }
						{ ! this.showSettings( 'tabLayout' ) && (
							<PanelBody>
								<RangeControl
									label={ __( 'Tabs' ) }
									value={ tabCount }
									onChange={ ( nexttabs ) => {
										const newtabs = titles;
										if ( newtabs.length < nexttabs ) {
											const amount = Math.abs( nexttabs - newtabs.length );
											{ times( amount, n => {
												const tabnumber = nexttabs - n;
												newtabs.push( {
													text: sprintf( __( 'Tab %d' ), tabnumber ),
													icon: titles[ 0 ].icon,
													iconSide: titles[ 0 ].iconSide,
													onlyIcon: titles[ 0 ].iconHover,
													subText: '',
												} );
											} ); }
											setAttributes( { titles: newtabs } );
											this.saveArrayUpdate( { iconSide: titles[ 0 ].iconSide }, 0 );
										}
										setAttributes( {
											tabCount: nexttabs,
										} );
									} }
									min={ 1 }
									max={ 24 }
								/>
								<h2>{ __( 'Set Initial Open Tab' ) }</h2>
								<ButtonGroup aria-label={ __( 'Initial Open Tab' ) }>
									{ times( tabCount, n => (
										<Button
											key={ n + 1 }
											className="kt-init-open-tab"
											isSmall
											isPrimary={ startTab === n + 1 }
											aria-pressed={ startTab === n + 1 }
											onClick={ () => setAttributes( { startTab: n + 1 } ) }
										>
											{ __( 'Tab' ) + ' ' + ( n + 1 ) }
										</Button>
									) ) }
								</ButtonGroup>
							</PanelBody>
						) }
						{ this.showSettings( 'tabContent' ) && (
							<PanelBody
								title={ __( 'Content Settings' ) }
								initialOpen={ false }
							>
								<AdvancedColorControl
									label={ __( 'Content Background' ) }
									colorValue={ ( contentBgColor ? contentBgColor : '' ) }
									colorDefault={ '' }
									onColorChange={ ( value ) => setAttributes( { contentBgColor: value } ) }
								/>
								<MeasurementControls
									label={ __( 'Inner Content Padding (px)' ) }
									measurement={ innerPadding }
									control={ innerPaddingControl }
									onChange={ ( value ) => setAttributes( { innerPadding: value } ) }
									onControl={ ( value ) => setAttributes( { innerPaddingControl: value } ) }
									min={ 0 }
									max={ 100 }
									step={ 1 }
								/>
								<AdvancedColorControl
									label={ __( 'Border Color' ) }
									colorValue={ ( contentBorderColor ? contentBorderColor : '' ) }
									colorDefault={ '' }
									onColorChange={ ( value ) => setAttributes( { contentBorderColor: value } ) }
								/>
								<MeasurementControls
									label={ __( 'Content Border Width (px)' ) }
									measurement={ contentBorder }
									control={ contentBorderControl }
									onChange={ ( value ) => setAttributes( { contentBorder: value } ) }
									onControl={ ( value ) => setAttributes( { contentBorderControl: value } ) }
									min={ 0 }
									max={ 100 }
									step={ 1 }
								/>
							</PanelBody>
						) }
						{ this.showSettings( 'titleColor' ) && (
							<PanelBody
								title={ __( 'Tab Title Color Settings' ) }
								initialOpen={ false }
							>
								<TabPanel className="kt-inspect-tabs kt-no-ho-ac-tabs kt-hover-tabs"
									activeClass="active-tab"
									tabs={ [
										{
											name: 'normal',
											title: __( 'Normal' ),
											className: 'kt-normal-tab',
										},
										{
											name: 'hover',
											title: __( 'Hover' ),
											className: 'kt-hover-tab',
										},
										{
											name: 'active',
											title: __( 'Active' ),
											className: 'kt-active-tab',
										},
									] }>
									{
										( tab ) => {
											let tabout;
											if ( tab.name ) {
												if ( 'hover' === tab.name ) {
													tabout = hoverSettings;
												} else if ( 'active' === tab.name ) {
													tabout = activeSettings;
												} else {
													tabout = normalSettings;
												}
											}
											return <div>{ tabout }</div>;
										}
									}
								</TabPanel>
							</PanelBody>
						) }
						{ this.showSettings( 'titleSpacing' ) && (
							<PanelBody
								title={ __( 'Tab Title Spacing/Border' ) }
								initialOpen={ false }
							>
								<MeasurementControls
									label={ __( 'Title Padding (px)' ) }
									measurement={ titlePadding }
									control={ titlePaddingControl }
									onChange={ ( value ) => setAttributes( { titlePadding: value } ) }
									onControl={ ( value ) => setAttributes( { titlePaddingControl: value } ) }
									min={ 0 }
									max={ 50 }
									step={ 1 }
								/>
								<MeasurementControls
									label={ __( 'Title Margin (px)' ) }
									measurement={ titleMargin }
									control={ titleMarginControl }
									onChange={ ( value ) => setAttributes( { titleMargin: value } ) }
									onControl={ ( value ) => setAttributes( { titleMarginControl: value } ) }
									min={ -25 }
									max={ 25 }
									step={ 1 }
								/>
								<MeasurementControls
									label={ __( 'Title Border Width (px)' ) }
									measurement={ titleBorderWidth }
									control={ titleBorderControl }
									onChange={ ( value ) => setAttributes( { titleBorderWidth: value } ) }
									onControl={ ( value ) => setAttributes( { titleBorderControl: value } ) }
									min={ 0 }
									max={ 20 }
									step={ 1 }
								/>
								<MeasurementControls
									label={ __( 'Title Border Radius (px)' ) }
									measurement={ titleBorderRadius }
									control={ titleBorderRadiusControl }
									onChange={ ( value ) => setAttributes( { titleBorderRadius: value } ) }
									onControl={ ( value ) => setAttributes( { titleBorderRadiusControl: value } ) }
									min={ 0 }
									max={ 50 }
									step={ 1 }
									controlTypes={ [
										{ key: 'linked', name: __( 'Linked' ), icon: icons.radiuslinked },
										{ key: 'individual', name: __( 'Individual' ), icon: icons.radiusindividual },
									] }
									firstIcon={ icons.topleft }
									secondIcon={ icons.topright }
									thirdIcon={ icons.bottomright }
									fourthIcon={ icons.bottomleft }
								/>
							</PanelBody>
						) }
						{ this.showSettings( 'titleFont' ) && (
							<PanelBody
								title={ __( 'Tab Title Font Settings' ) }
								initialOpen={ false }
							>
								<TypographyControls
									fontFamily={ typography }
									onFontFamily={ ( value ) => setAttributes( { typography: value } ) }
									googleFont={ googleFont }
									onFontChange={ ( select ) => {
										setAttributes( {
											typography: select.value,
											googleFont: select.google,
										} );
									} }
									onGoogleFont={ ( value ) => setAttributes( { googleFont: value } ) }
									loadGoogleFont={ loadGoogleFont }
									onLoadGoogleFont={ ( value ) => setAttributes( { loadGoogleFont: value } ) }
									fontVariant={ fontVariant }
									onFontVariant={ ( value ) => setAttributes( { fontVariant: value } ) }
									fontWeight={ fontWeight }
									onFontWeight={ ( value ) => setAttributes( { fontWeight: value } ) }
									fontStyle={ fontStyle }
									onFontStyle={ ( value ) => setAttributes( { fontStyle: value } ) }
									fontSubset={ fontSubset }
									onFontSubset={ ( value ) => setAttributes( { fontSubset: value } ) }
								/>
								<h2 className="kt-heading-size-title">{ __( 'Size Controls' ) }</h2>
								{ sizeTabControls }
								<RangeControl
									label={ __( 'Letter Spacing' ) }
									value={ ( letterSpacing ? letterSpacing : '' ) }
									onChange={ ( value ) => setAttributes( { letterSpacing: value } ) }
									min={ -5 }
									max={ 15 }
									step={ 0.1 }
								/>
							</PanelBody>
						) }
						{ this.showSettings( 'titleIcon' ) && (
							<PanelBody
								title={ __( 'Tab Title Icon Settings' ) }
								initialOpen={ false }
							>
								<RangeControl
									label={ __( 'Icon Size' ) }
									value={ ( iSize ? iSize : '' ) }
									onChange={ ( value ) => setAttributes( { iSize: value } ) }
									min={ 2 }
									max={ 120 }
									step={ 1 }
								/>
								{ times( tabCount, n => renderTitleSettings( n ) ) }
							</PanelBody>
						) }
						{ this.showSettings( 'subtitle' ) && (
							<PanelBody
								title={ __( 'Tab Subtitle Settings' ) }
								initialOpen={ false }
							>
								<ToggleControl
									label={ __( 'Show Subtitles?' ) }
									checked={ ( undefined !== enableSubtitle ? enableSubtitle : false ) }
									onChange={ value => {
										setAttributes( { enableSubtitle: value } );
									} }
								/>
								{ enableSubtitle && (
									<TypographyControls
										fontSize={ subtitleFont[ 0 ].size }
										onFontSize={ ( value ) => saveSubtitleFont( { size: value } ) }
										fontSizeType={ subtitleFont[ 0 ].sizeType }
										onFontSizeType={ ( value ) => saveSubtitleFont( { sizeType: value } ) }
										lineHeight={ subtitleFont[ 0 ].lineHeight }
										onLineHeight={ ( value ) => saveSubtitleFont( { lineHeight: value } ) }
										lineHeightType={ subtitleFont[ 0 ].lineType }
										onLineHeightType={ ( value ) => saveSubtitleFont( { lineType: value } ) }
										letterSpacing={ subtitleFont[ 0 ].letterSpacing }
										onLetterSpacing={ ( value ) => saveSubtitleFont( { letterSpacing: value } ) }
										fontFamily={ subtitleFont[ 0 ].family }
										onFontFamily={ ( value ) => saveSubtitleFont( { family: value } ) }
										onFontChange={ ( select ) => {
											saveSubtitleFont( {
												family: select.value,
												google: select.google,
											} );
										} }
										onFontArrayChange={ ( values ) => saveSubtitleFont( values ) }
										googleFont={ subtitleFont[ 0 ].google }
										onGoogleFont={ ( value ) => saveSubtitleFont( { google: value } ) }
										loadGoogleFont={ subtitleFont[ 0 ].loadGoogle }
										onLoadGoogleFont={ ( value ) => saveSubtitleFont( { loadGoogle: value } ) }
										fontVariant={ subtitleFont[ 0 ].variant }
										onFontVariant={ ( value ) => saveSubtitleFont( { variant: value } ) }
										fontWeight={ subtitleFont[ 0 ].weight }
										onFontWeight={ ( value ) => saveSubtitleFont( { weight: value } ) }
										fontStyle={ subtitleFont[ 0 ].style }
										onFontStyle={ ( value ) => saveSubtitleFont( { style: value } ) }
										fontSubset={ subtitleFont[ 0 ].subset }
										onFontSubset={ ( value ) => saveSubtitleFont( { subset: value } ) }
										padding={ subtitleFont[ 0 ].padding }
										onPadding={ ( value ) =>saveSubtitleFont( { padding: value } ) }
										paddingControl={ subtitleFont[ 0 ].paddingControl }
										onPaddingControl={ ( value ) =>saveSubtitleFont( { paddingControl: value } ) }
										margin={ subtitleFont[ 0 ].margin }
										onMargin={ ( value ) =>saveSubtitleFont( { margin: value } ) }
										marginControl={ subtitleFont[ 0 ].marginControl }
										onMarginControl={ ( value ) =>saveSubtitleFont( { marginControl: value } ) }
									/>
								) }
							</PanelBody>
						) }
						{ this.showSettings( 'structure' ) && (
							<PanelBody
								title={ __( 'Structure Settings' ) }
								initialOpen={ false }
							>
								<RangeControl
									label={ __( 'Content Minimium Height' ) }
									value={ minHeight }
									onChange={ ( value ) => {
										setAttributes( {
											minHeight: value,
										} );
									} }
									min={ 0 }
									max={ 1000 }
								/>
								<RangeControl
									label={ __( 'Max Width' ) }
									value={ maxWidth }
									onChange={ ( value ) => {
										setAttributes( {
											maxWidth: value,
										} );
									} }
									min={ 0 }
									max={ 2000 }
								/>
							</PanelBody>
						) }
					</InspectorControls>
				) }
				<div className={ classes } >
					{ this.state.showPreset && (
						<div className="kt-select-starter-style-tabs">
							<div className="kt-select-starter-style-tabs-title">
								{ __( 'Select Initial Style' ) }
							</div>
							<ButtonGroup className="kt-init-tabs-btn-group" aria-label={ __( 'Initial Style' ) }>
								{ map( startlayoutOptions, ( { name, key, icon } ) => (
									<Button
										key={ key }
										className="kt-inital-tabs-style-btn"
										isSmall
										onClick={ () => {
											setInitalLayout( key );
											this.setState( { showPreset: false } );
										} }
									>
										{ icon }
									</Button>
								) ) }
							</ButtonGroup>
						</div>
					) }
					{ ! this.state.showPreset && (
						<div className="kt-tabs-wrap" style={ {
							maxWidth: maxWidth + 'px',
						} }>
							<ul className="kt-tabs-title-list">
								{ renderPreviewArray }
							</ul>
							{ googleFont && (
								<WebfontLoader config={ config }>
								</WebfontLoader>
							) }
							{ enableSubtitle && subtitleFont && subtitleFont[ 0 ].google && (
								<WebfontLoader config={ sconfig }>
								</WebfontLoader>
							) }
							<div className="kt-tabs-content-wrap" style={ {
								padding: ( innerPadding ? innerPadding[ 0 ] + 'px ' + innerPadding[ 1 ] + 'px ' + innerPadding[ 2 ] + 'px ' + innerPadding[ 3 ] + 'px' : '' ),
								borderWidth: ( contentBorder ? contentBorder[ 0 ] + 'px ' + contentBorder[ 1 ] + 'px ' + contentBorder[ 2 ] + 'px ' + contentBorder[ 3 ] + 'px' : '' ),
								minHeight: minHeight + 'px',
								backgroundColor: contentBgColor,
								borderColor: contentBorderColor,
							} }>
								<InnerBlocks
									template={ getPanesTemplate( tabCount ) }
									templateLock="all"
									allowedBlocks={ ALLOWED_BLOCKS } />
							</div>
						</div>
					) }
				</div>
			</Fragment>
		);
	}
}
export default ( KadenceTabs );
