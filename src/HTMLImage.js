import React, { PureComponent } from 'react';
import { Image, View, Text } from 'react-native';
import PropTypes from 'prop-types';


const getDimensionsFromStyle = (style, defaultWidth, defaultHeight) => {
    const parsedStypes = Array.isArray(style) ? style[0] : style;

    const rawWidth = parsedStypes.width || defaultWidth || 0;
    const rawHeight = parsedStypes.height || defaultHeight || 0;

    const width = typeof rawWidth === 'string' && rawWidth.search('%') !== -1 ? rawWidth : parseInt(rawWidth, 10);
    const height = typeof rawHeight === 'string' && rawHeight.search('%') !== -1 ? rawHeight : parseInt(rawHeight, 10);

    return { width, height };
}

export default class HTMLImage extends PureComponent {
    constructor (props) {
        super(props);
        this.state = getDimensionsFromStyle(
            props.style,
            props.width || props.imagesInitialDimensions.width,
            props.height || props.imagesInitialDimensions.height
        );
    }

    static propTypes = {
        source: PropTypes.object.isRequired,
        alt: PropTypes.string,
        height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        style: Image.propTypes.style,
        imagesMaxWidth: PropTypes.number,
        imagesInitialDimensions: PropTypes.shape({
            width: PropTypes.number,
            height: PropTypes.number
        })
    }

    static defaultProps = {
        imagesInitialDimensions: {
            width: 100,
            height: 100
        }
    }

    getImageSize() {
        const { source, imagesMaxWidth, style, height, width } = this.props;
        const dimensions = getDimensionsFromStyle(
            props.style,
            props.width || props.imagesInitialDimensions.width,
            props.height || props.imagesInitialDimensions.height
        )
        if (dimensions.width && dimensions.height) {
            this.setState(dimensions);
        } else {
            // Fetch image dimensions only if they aren't supplied or if with or height is missing
            Image.getSize(
                source.uri,
                (originalWidth, originalHeight) => {
                    if (!imagesMaxWidth) {
                        this.setState({ width: originalWidth, height: originalHeight });
                    }
                    const optimalWidth = imagesMaxWidth <= originalWidth ? imagesMaxWidth : originalWidth;
                    const optimalHeight = (optimalWidth * originalHeight) / originalWidth;
                    this.setState({ width: optimalWidth, height: optimalHeight});
                },
                () => {
                    this.setState({ width: -1,  height: -1 });
                }
            );
        }
    }

    componentDidMount () {
        if (!this.state.width && !this.state.height) {
            this.getImageSize();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.source !== props.source || prevProps.width !== props.width ||
            prevProps.height !== props.height || prevProps.style !== props.style) {

            this.getImageSize();
        }
    }

    render () {
        const { source, style, passProps } = this.props;
        const hasError = this.state.width < 0 || this.state.height < 0;

        return !hasError ? (
            <Image
              source={source}
              style={[style, { width: this.state.width, height: this.state.height, resizeMode: 'cover' }]}
              {...passProps}
            />
        ) : (
            <View style={{ width: 50, height: 50, borderWidth: 1, borderColor: 'lightgray', overflow: 'hidden', justifyContent: 'center' }}>
                { this.props.alt ? <Text style={{ textAlign: 'center', fontStyle: 'italic' }}>{ this.props.alt }</Text> : false }
            </View>
        )
    }
}
