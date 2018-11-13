import React, { Component } from 'react';
import {
    FlatList,
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    PixelRatio,
    Dimensions
} from 'react-native';
import PropTypes from 'prop-types';;

const keyExtractor = item => item.id.toString();

export default class Grid extends Component {
    
    static propTypes = {
        renderItem: PropTypes.func.isRequired,
        numColumns: PropTypes.number,
        itemMargin: PropTypes.number,
    };

    static defaultProps = {
        numColumns: 4,
        itemMargin: StyleSheet.hairlineWidth,
    };

    renderGridItem = (info) => {
        const { index } = info;
        const { renderItem, numColumns, itemMargin } = this.props;
        
         // We want to get the device width on render, in case the device is rotated
        const { width } = Dimensions.get('window');

        const size = PixelRatio.roundToNearestPixel(
            (width - itemMargin * (numColumns - 1)) / numColumns
        );
        // We don't want to include a `marginLeft` on the first item of a row
        const marginLeft = index % numColumns === 0 ? 0 : itemMargin;

        // We don't want to include a `marginTop` on the first row of the grid
        const marginTop = index < numColumns ? 0 : itemMargin;

        return renderItem({...info, size, marginLeft, marginTop});
        // ... The interesting stuff happens here!
    };


    render() {
        return <FlatList {...this.props} renderItem={this.renderGridItem} />;
    }
}

const styles = StyleSheet.create({
    
});