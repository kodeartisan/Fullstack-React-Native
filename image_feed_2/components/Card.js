import React, { Component } from 'react';
import { 
    Image, 
    StyleSheet, 
    View,
    ActivityIndicator 
} from 'react-native';
import PropTypes from 'prop-types';

import AuthorRow from './AuthorRow';

class Card extends Component {

    state = {
        loading: true
    };

    handleLoad = () => {
        this.setState({ loading: false });
    };

    shouldComponentUpdate = (nextProps) => {
        return this.props.linkText !== nextProps.linkText;
    }

    render = () => {

        const { fullname, image, linkText, onPressLinkText } = this.props;
        const { loading } = this.state

        return(
            <View>
                <AuthorRow
                    fullname={fullname}
                    linkText={linkText}
                    onPressLinkText={onPressLinkText}
                />
                <View style={styles.image}>
                    {loading && (
                        <ActivityIndicator style={StyleSheet.absoluteFill} size={'large'} />
                    )}
                    <Image 
                        style={StyleSheet.absoluteFill} source={image}
                        onLoad={this.handleLoad} />
                </View>
                
            </View>
        );
    }

}

Card.propTypes = {
    fullname: PropTypes.string.isRequired,
    image: Image.propTypes.source.isRequired,
    linkText: PropTypes.string,
    onPressLinkText: PropTypes.func,
}

Card.defaultProps = {
    linkText: '',
    onPressLinkText: () => { console.log('is default') },
}

const styles = StyleSheet.create({
    image: {
        aspectRatio: 1,
        backgroundColor: 'rgba(0,0,0,0.02)',
    }
});

export default Card;