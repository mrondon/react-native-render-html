import React from 'react';
import { TouchableOpacity, Text, View, WebView } from 'react-native';
import { _constructStyles } from './HTMLStyles';
import HTMLImage from './HTMLImage';

export function a (htmlAttribs, children, convertedCSSStyles, passProps) {
    const { parentWrapper, onLinkPress, key } = passProps;
    const style = _constructStyles({
        tagName: 'a',
        htmlAttribs,
        passProps,
        styleSet: parentWrapper === 'Text' ? 'TEXT' : 'VIEW'
    });

    const onPress = (evt) => onLinkPress && htmlAttribs && htmlAttribs.href ?
        onLinkPress(evt, htmlAttribs.href) :
        undefined;

    if (parentWrapper === 'Text') {
        return (
            <Text {...passProps} style={style} onPress={onPress} key={key}>
                { children }
            </Text>
        );
    } else {
        return (
            <TouchableOpacity onPress={onPress} key={key}>
                { children }
            </TouchableOpacity>
        );
    }
}

export function img (htmlAttribs, children, convertedCSSStyles, passProps = {}) {
    if (!htmlAttribs.src) {
        return false;
    }

    const style = _constructStyles({
        tagName: 'img',
        htmlAttribs,
        passProps,
        styleSet: 'IMAGE'
    });
    return (
        <HTMLImage source={{ uri: htmlAttribs.src }} style={style} {...passProps} />
    );
}

export function ul (htmlAttribs, children, convertedCSSStyles, passProps = {}) {
    const { rawChildren, nodeIndex, key } = passProps;
    children = children.map((child, index) => {
        const rawChild = rawChildren[index];
        let prefix = false;
        if (rawChild) {
            if (rawChild.parentTag === 'ul') {
                prefix = (
                    <View style={{
                        marginRight: 10,
                        width: 5,
                        height: 5,
                        marginTop: 5,
                        borderRadius: 2.5,
                        backgroundColor: 'black'
                    }} />
                );
            } else if (rawChild.parentTag === 'ol') {
                prefix = (
                    <Text style={{ marginRight: 5 }}>{ index + 1 })</Text>
                );
            }
        }
        return (
            <View key={`list-${nodeIndex}-${index}`} style={{ flexDirection: 'row', marginBottom: 10 }}>
                { prefix }
                <View style={{ flex: 1 }}>{ child }</View>
            </View>
        );
    });
    return (
        <View style={{ paddingLeft: 20 }} key={key}>
            { children }
        </View>
    );
}
export const ol = ul;

export function iframe (htmlAttribs, children, convertedCSSStyles, passProps) {
    if (!htmlAttribs.src) {
        return false;
    }

    const style = _constructStyles({
        tagName: 'iframe',
        htmlAttribs,
        passProps,
        styleSet: 'VIEW',
        additionalStyles: [
            htmlAttribs.height ? { height: parseInt(htmlAttribs.height, 10) } : {},
            htmlAttribs.width ? { width: parseInt(htmlAttribs.width, 10) } : {}
        ]
    });

    return (
        <WebView source={{ uri: htmlAttribs.src }} style={style} {...passProps} />
    );
}

export function br (htlmAttribs, children, convertedCSSStyles, passProps) {
    return (
        <View style={{ height: 1.2 * passProps.emSize }} key={passProps.key} />
    );
}

export function textwrapper (htmlAttribs, children, convertedCSSStyles) {
    return (
        <Text style={convertedCSSStyles}>{ children }</Text>
    );
}